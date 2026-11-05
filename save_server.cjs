const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3333;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-File-Name, Range');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API SAVE ENDPOINT
  if (req.method === 'POST' && req.url.startsWith('/api/save')) {
    let body = [];
    req.on('data', chunk => body.push(chunk));
    req.on('end', () => {
      try {
        const content = Buffer.concat(body).toString('utf8');
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        let targetFileName = urlObj.searchParams.get('file') || req.headers['x-file-name'] || 'Apresentacao_Slides_DISARM_AI_02NOV.html';
        targetFileName = path.basename(targetFileName); // prevent directory traversal
        
        const targetPath = path.join(ROOT_DIR, targetFileName);
        let backupFileName = null;

        // Se o arquivo já existe no disco e não é um backup, cria uma cópia de segurança usando o nome do próprio arquivo como referência
        if (fs.existsSync(targetPath) && !targetFileName.includes('.backup')) {
          const parsed = path.parse(targetFileName);
          backupFileName = `${parsed.name}.backup_latest${parsed.ext}`;
          const backupPath = path.join(ROOT_DIR, backupFileName);
          try {
            fs.copyFileSync(targetPath, backupPath);
            console.log(`[SAVE SERVER] Backup criado referenciando o arquivo original: ${backupFileName}`);
          } catch (backupErr) {
            console.warn('[SAVE SERVER] Aviso ao gerar backup:', backupErr.message);
          }
        }

        fs.writeFileSync(targetPath, content, 'utf8');
        
        console.log(`[SAVE SERVER] Successfully saved ${targetPath} (${Buffer.byteLength(content)} bytes)`);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          fileName: targetFileName,
          backupFileName: backupFileName,
          savedAt: new Date().toISOString(),
          bytes: Buffer.byteLength(content)
        }));
      } catch (err) {
        console.error('[SAVE SERVER ERROR]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API UPLOAD MEDIA ENDPOINT (for binary video/media files)
  if (req.method === 'POST' && req.url.startsWith('/api/upload-media')) {
    let body = [];
    req.on('data', chunk => body.push(chunk));
    req.on('end', () => {
      try {
        const buffer = Buffer.concat(body);
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        let targetFileName = decodeURIComponent(urlObj.searchParams.get('file') || req.headers['x-file-name'] || `video_${Date.now()}.mp4`);
        targetFileName = path.basename(targetFileName);

        const targetPath = path.join(ROOT_DIR, targetFileName);
        if (!fs.existsSync(targetPath) || fs.statSync(targetPath).size !== buffer.length) {
          fs.writeFileSync(targetPath, buffer);
          console.log(`[SAVE SERVER] Uploaded media ${targetPath} (${buffer.length} bytes)`);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          fileName: targetFileName,
          bytes: buffer.length
        }));
      } catch (err) {
        console.error('[UPLOAD MEDIA ERROR]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // STATIC FILE SERVING (with HTTP Range support for MP4/WebM streaming)
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/Apresentacao_Slides_DISARM_AI_02NOV.html';
  }
  
  const filePath = path.join(ROOT_DIR, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const range = req.headers.range;

  if (range && (ext === '.mp4' || ext === '.webm')) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunksize = (end - start) + 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType
    });
    const stream = fs.createReadStream(filePath, { start, end });
    stream.on('error', () => {});
    stream.pipe(res);
    return;
  }

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {});
  stream.pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[DISARM SYNC SERVER] Running at http://localhost:${PORT}/`);
  console.log(`[DISARM SYNC SERVER] Direct disk-saving endpoint active at http://127.0.0.1:${PORT}/api/save`);
});
