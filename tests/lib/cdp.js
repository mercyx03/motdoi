/* Điều khiển Chrome headless qua giao thức DevTools, chỉ dùng Node (WebSocket có sẵn từ Node 22), không cần cài gói.
   open(url,{width,height}) → { eval(fn, ...args), screenshot(file), errors, close() } */
'use strict';
const { spawn } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function launch() {
  const port = 9300 + Math.floor(Math.random() * 500), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'motdoi-cdp-'));
  const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=' + port, '--user-data-dir=' + dir, 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 100; i++) { try { const r = await fetch('http://127.0.0.1:' + port + '/json/version'); if (r.ok) break; } catch (e) { } await sleep(100); }
  return { port, proc, dir, async close() { proc.kill(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { } } };
}
async function page(chrome, url, o) {
  const list = await (await fetch('http://127.0.0.1:' + chrome.port + '/json/list')).json();
  const t = list.find(x => x.type === 'page');
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const wait = new Map(), errors = [], events = [];
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); } else if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); else events.push(d.method); };
  const send = (method, params) => new Promise(res => { const i = ++id; wait.set(i, res); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: o.width, height: o.height || 900, deviceScaleFactor: 1, mobile: o.width < 768 });
  async function load(u) { events.length = 0; await send('Page.navigate', { url: u }); for (let i = 0; i < 200 && !events.includes('Page.loadEventFired'); i++) await sleep(50); await sleep(400); }
  await load(url);
  return {
    errors, load, send,
    async eval(fn, ...args) {
      const r = await send('Runtime.evaluate', { expression: '(' + fn.toString() + ')(...' + JSON.stringify(args) + ')', awaitPromise: true, returnByValue: true });
      if (r.result.exceptionDetails) throw Error(r.result.exceptionDetails.exception ? r.result.exceptionDetails.exception.description : r.result.exceptionDetails.text);
      return r.result.result.value;
    },
    async reload() { await load(url); },
    async screenshot(file) { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(file, Buffer.from(r.result.data, 'base64')); },
    close() { ws.close(); }
  };
}
module.exports = { launch, page, sleep };
