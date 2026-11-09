import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire('file:///c:/Users/renat/disarm-threat-dashboard/package.json');
const { jsPDF } = require('jspdf');
const sharp = require('sharp');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const HTML_URL = 'file:///C:/Users/renat/disarm-threat-dashboard/Apresentacao_Slides_DISARM_AI_08NOV_FINAL_4.html';
const OUT_WORKSPACE = 'c:/Users/renat/disarm-threat-dashboard/Apresentacao_Slides_DISARM_AI_08NOV_FINAL_4.pdf';
const OUT_DOWNLOADS = 'C:/Users/renat/Downloads/Apresentacao_Slides_DISARM_AI_08NOV_FINAL_4.pdf';

const PORT = 9350;
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-pdf-final4-'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log('🚀 Iniciando Edge Headless para renderização ultra-nítida...');
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--allow-file-access-from-files',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1920,1080',
    'about:blank'
  ], { stdio: 'ignore' });

  try {
    let targets = null;
    for (let attempt = 0; attempt < 40; attempt++) {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
        if (res.ok) {
          targets = await res.json();
          if (targets && targets.length > 0) break;
        }
      } catch (e) {}
      await sleep(250);
    }

    if (!targets || targets.length === 0) {
      throw new Error('Não foi possível conectar ao endpoint do Edge DevTools.');
    }

    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 0;
    const pending = new Map();
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(new Error(data.error.message));
        else resolve(data.result);
      }
    };

    function send(method, params = {}) {
      const id = ++msgId;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2,
      mobile: false
    });

    console.log('📄 Carregando HTML da Apresentação FINAL 4...');
    await send('Page.navigate', { url: HTML_URL });

    // Aguarda prontidão da página, fonts e scripts
    for (let i = 0; i < 40; i++) {
      const chk = await send('Runtime.evaluate', {
        expression: 'Boolean(document.body && window.slides && window.slides.length > 0)'
      });
      if (chk.result && chk.result.value) break;
      await sleep(200);
    }

    await send('Runtime.evaluate', {
      expression: `new Promise(async (resolve) => {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
        setTimeout(resolve, 800);
      })`,
      awaitPromise: true
    });

    // Injeta estilo otimizado para preencher 100% da tela útil (sem barras pretas desnecessárias, tipografia encorpada e robusta)
    const evalInit = await send('Runtime.evaluate', {
      expression: `(() => {
        editing = false;
        if (typeof clearSelection === 'function') clearSelection();
        document.body.classList.remove('editing');
        document.body.classList.add('presenting');

        const style = document.createElement('style');
        style.id = 'pdf-export-robust-styles';
        style.textContent = \`
          :root {
            --stage-vh: 1vh !important;
          }
          .slide {
            height: 100vh !important;
            width: 100vw !important;
            transition: none !important;
            padding: 1.8vh 2.8vw !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
          }
          .projector-container {
            max-width: 96vw !important;
            zoom: 1.05 !important;
          }
          #floating-dock,
          #format-inspector,
          #text-block-toolbar,
          #dom-selection-gizmo,
          #quick-next-orb,
          #present-hover-zone,
          .edit-only,
          .move-grip,
          .resize-handle {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
          video::-webkit-media-controls {
            display: none !important;
          }
        \`;
        document.head.appendChild(style);

        return slides.length;
      })()`,
      returnByValue: true
    });

    const totalSlides = evalInit.result.value;
    console.log(`🎯 Total de slides detectados: ${totalSlides}`);

    // Configura o documento PDF com padrão Widescreen 16:9 profissional (960x540 pt)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [960, 540],
      compress: true
    });

    pdf.setProperties({
      title: 'DISARM.AI - Apresentação Executiva',
      subject: 'Arquitetura Baseada em IA Simbólica para Mapeamento Automatizado de TTPs em Operações de Hacking for Influence',
      author: 'Exército Brasileiro - CIGE - C Av G Ciber 2026',
      creator: 'DISARM.AI High-Resolution Presentation Engine'
    });

    for (let i = 0; i < totalSlides; i++) {
      await send('Runtime.evaluate', {
        expression: `new Promise((resolve) => {
          current = ${i};
          renderSlide();
          const activeSlide = slides[${i}];
          const vid = activeSlide ? activeSlide.querySelector('video') : null;
          if (vid) {
            vid.muted = true;
            const onSeeked = () => {
              vid.removeEventListener('seeked', onSeeked);
              setTimeout(resolve, 200);
            };
            vid.addEventListener('seeked', onSeeked);
            try {
              vid.currentTime = 1.5;
            } catch (e) {
              setTimeout(resolve, 200);
            }
            setTimeout(resolve, 800);
          } else {
            requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 150)));
          }
        })`,
        awaitPromise: true
      });

      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true
      });

      const pngBuffer = Buffer.from(shot.data, 'base64');
      const jpgBuffer = await sharp(pngBuffer)
        .resize(2880, 1620)
        .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
        .toBuffer();

      const imgDataUrl = 'data:image/jpeg;base64,' + jpgBuffer.toString('base64');

      if (i > 0) {
        pdf.addPage([960, 540], 'landscape');
      }
      pdf.addImage(imgDataUrl, 'JPEG', 0, 0, 960, 540, undefined, 'FAST');
      console.log(`✅ [${i + 1}/${totalSlides}] Slide capturado com sucesso`);
    }

    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    fs.writeFileSync(OUT_WORKSPACE, pdfBuffer);
    fs.copyFileSync(OUT_WORKSPACE, OUT_DOWNLOADS);

    const sizeMb = (pdfBuffer.length / 1024 / 1024).toFixed(2);
    console.log(`🎉 PDF gerado com sucesso! Tamanho final: ${sizeMb} MB`);
    console.log('📍 Salvo em:');
    console.log('   1.', OUT_WORKSPACE);
    console.log('   2.', OUT_DOWNLOADS);

    ws.close();
  } finally {
    try { edgeProc.kill(); } catch (e) {}
  }
}

main().catch((err) => {
  console.error('❌ Erro na geração:', err);
  process.exit(1);
});
