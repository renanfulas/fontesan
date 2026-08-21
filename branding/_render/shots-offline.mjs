// Igual ao shots.mjs, mas BLOQUEIA fonts.googleapis.com/fonts.gstatic.com.
// Serve para provar que os SVGs finais não dependem de fonte externa.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , htmlFile, outDir, scaleArg] = process.argv;
const SCALE = Number(scaleArg || 2);
mkdirSync(outDir, { recursive: true });

const p = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ['--headless=new', '--disable-gpu', '--remote-debugging-port=9232',
   '--user-data-dir=' + process.env.TEMP + '\\f-brand-offline',
   '--hide-scrollbars', '--window-size=1700,2400', 'about:blank'], { stdio: 'ignore' });
const sl = ms => new Promise(r => setTimeout(r, ms));

try {
  let t;
  for (let i = 0; i < 40 && !t; i++) {
    await sl(300);
    try { const l = await (await fetch('http://127.0.0.1:9232/json/list')).json(); t = l.find(x => x.type === 'page'); } catch {}
  }
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((a, b) => { ws.onopen = a; ws.onerror = b; });
  let id = 0; const pend = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } };
  const send = (m, par = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: par })); });
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');

  // A prova: nenhuma fonte da web pode carregar.
  await send('Network.setBlockedURLs', { urls: ['*fonts.googleapis.com*', '*fonts.gstatic.com*'] });

  const ev = async ex => (await send('Runtime.evaluate', { expression: ex, returnByValue: true, awaitPromise: true })).result.value;
  const url = 'file:///' + resolve(htmlFile).replace(/\\/g, '/');
  await send('Page.navigate', { url });
  for (let i = 0; i < 30; i++) { await sl(400); if (await ev('document.title') === 'FONTS-OK') break; }
  await sl(600);

  const shots = await ev(`[...document.querySelectorAll('.shot')].map(el=>{const r=el.getBoundingClientRect();return{name:el.dataset.name,x:r.x,y:r.y,w:r.width,h:r.height}})`);
  for (const s of shots) {
    const r = await send('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true,
      clip: { x: s.x, y: s.y, width: s.w, height: s.h, scale: SCALE },
    });
    writeFileSync(outDir + '/' + s.name + '.png', Buffer.from(r.data, 'base64'));
    console.log('shot(offline):', s.name);
  }
} finally { try { p.kill(); } catch {} }
