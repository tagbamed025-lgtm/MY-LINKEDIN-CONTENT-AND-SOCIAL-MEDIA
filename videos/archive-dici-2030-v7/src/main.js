import { W, H, scenes } from './data.js';
const scale = Number(new URLSearchParams(location.search).get('scale')) || 1;
const canvas = document.getElementById('c');
canvas.width = Math.max(2, 2 * Math.round(W * scale / 2));
canvas.height = Math.max(2, 2 * Math.round(H * scale / 2));
const ctx = canvas.getContext('2d');
const mods = await Promise.all(scenes.map(s => import(`./scenes/${s.id}.js`)));
await Promise.all(mods.map(m => m.init?.({ W, H, scale })));
await document.fonts.ready;
const acc = document.createElement('canvas'); acc.width = canvas.width; acc.height = canvas.height; const ax = acc.getContext('2d');
const SUB = 4, SHUTTER = 0.5 / 30;
window.renderFrame = async t => {
  for (let k = 0; k < SUB; k++) { await drawAt(Math.max(0, t - SHUTTER / 2 + SHUTTER * k / (SUB - 1))); ax.globalAlpha = 1 / (k + 1); ax.drawImage(canvas, 0, 0); }
  ctx.setTransform(1,0,0,1,0,0); ctx.drawImage(acc, 0, 0);
};
const drawAt = async t => {
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);
  for (let i=0;i<scenes.length;i++) {
    const s=scenes[i];if(t<s.start || t>=s.end)continue;
    ctx.save();ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
    await mods[i].draw(ctx,t-s.start,{W,H,scale,dur:s.end-s.start,t});ctx.restore();
  }
};
window.grab=(type,quality=.95)=>canvas.toDataURL(type,quality);
window.__ready=true;
