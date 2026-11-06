import { initProfiles, renderProfiles } from '../profiles3d.js';
import { initDash, renderDash } from '../dash3d.js';
import { initCorridor, renderCorridor } from '../corridor3d.js';
import { dashSource } from '../dashart.js';
// Aperçu scènes 1–2 (storyboard v1). Valeurs = TASTE.md (locked).
import { C, bgPerle, bgBlanc, bgBleu } from '../kit/moustakim_kit.js';
const INK = C.INK, BLUE = C.BLUE, GREYW = [168,168,170];
const SANS = (s, w = 700) => `${w} ${s}px "Inter Tight", "Inter Display", sans-serif`, SERIF = s => `italic 400 ${s}px "Instrument Serif", serif`;
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), pr = (t, a, b) => cl((t - a) / (b - a));
const eOut = u => 1 - Math.pow(1 - u, 5), eIn = u => u * u * u, eIO = u => u < .5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2, lerp = (a, b, u) => a + (b - a) * u;
let SKY, PHOTO;
export async function init() {
  for (const w of [400,500,700,800]) document.fonts.add(await new FontFace('Inter Tight', `url(/assets/fonts/InterTight/inter-tight-latin-${w}-normal.woff2)`, {weight:String(w)}).load());
  const f = new FontFace('Instrument Serif', 'url(/assets/fonts/InstrumentSerif/instrument-serif-latin-400-italic.woff2)', { style: 'italic' });
  document.fonts.add(await f.load()); initProfiles(1920, 1080); await initDash(1920, 1080, await dashSource(0)); await initCorridor(1920, 1080); PHOTO = new Image(); PHOTO.src = '/assets/images/PROVISOIRE-photo.png'; await PHOTO.decode(); SKY = new Image(); SKY.src = '/assets/images/PROVISOIRE-ciel-reference.png'; await SKY.decode();
}
// TASTE §4: word entrance blur 12→0, y +20→0, 250 ms easeOutCubic, stagger 150 ms; exit zoom 1→1.15 + blur 0→16, 350 ms
function words(ctx, list, cx, y, t, t0, { font, color, stagger = .15, shadow = false }) {
  ctx.font = font; const sp = ctx.measureText(' ').width, ws = list.map(w => ctx.measureText(w).width);
  let x = cx - (ws.reduce((a, b) => a + b, 0) + sp * (list.length - 1)) / 2;
  list.forEach((w, i) => { const u = pr(t, t0 + i * stagger, t0 + i * stagger + .75), e = eOut(u);
    if (u > 0) { ctx.save(); ctx.globalAlpha = cl(u * 2.2); if (e < .995) ctx.filter = `blur(${(1 - e) * 20}px)`; ctx.font = font; ctx.textBaseline = 'middle';
      if (shadow) { ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 4; }
      const sc = lerp(.96, 1, e), ww = ws[i]; ctx.translate(x + ww / 2, y + (1 - e) * 40); ctx.scale(sc, sc);
      ctx.fillStyle = color; ctx.fillText(w, -ww / 2, 0); ctx.restore(); }
    x += ws[i] + sp; });
}
function letters(ctx, str, cx, y, t, t0, { font, color, stagger = .035, dur = .9, shadow = false }) {
  ctx.font = font; const total = ctx.measureText(str).width; let x = cx - total / 2;
  [...str].forEach((ch, i) => { const cw = ctx.measureText(ch).width, u = pr(t, t0 + i * stagger, t0 + i * stagger + dur), e = eOut(u);
    if (u > 0 && ch !== ' ') { ctx.save(); ctx.globalAlpha = cl(u * 2); if (e < .995) ctx.filter = `blur(${(1 - e) * 22}px)`; ctx.font = font; ctx.textBaseline = 'middle';
      if (shadow) { ctx.shadowColor = 'rgba(0,0,0,.22)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 6; }
      const sc = lerp(.9, 1, e); ctx.translate(x + cw / 2, y + (1 - e) * 50); ctx.scale(sc, sc); ctx.fillStyle = color; ctx.fillText(ch, -cw / 2, 0); ctx.restore(); }
    x += cw; });
}
function exitWrap(ctx, W, H, u, draw) { const e = eIO(u); ctx.save(); ctx.globalAlpha = 1 - e; ctx.translate(W / 2, H / 2); const s = 1 + .15 * e; ctx.scale(s, s); ctx.translate(-W / 2, -H / 2); if (e > 0) ctx.filter = `blur(${16 * e}px)`; draw(); ctx.restore(); }
// TASTE §3: clear gradient #FFFFFF → #EEF2FF → #F3EEFB, very soft, no shapes
function clear(ctx, W, H) { bgPerle(ctx, W, H); }


function mixc(a, hex, k) { const h = hex.replace('#',''), b = [0,2,4].map(i => parseInt(h.slice(i,i+2),16)); return `rgb(${a.map((v,i)=>Math.round(v+(b[i]-v)*k)).join(',')})`; }
// Un seul texte au centre : mots qui arrivent d'une direction (dir) et repartent (ex, exv) sans jamais chevaucher le suivant
function lineX(ctx, list, cx, y, t, t0, { font, colors, dir = [0, 60], ex = 0, exv = [0, -40], stagger = .1 }) {
  ctx.font = font; const sp = ctx.measureText(' ').width, ws = list.map(w => ctx.measureText(w).width); let x = cx - (ws.reduce((a, b) => a + b, 0) + sp * (list.length - 1)) / 2;
  list.forEach((w, i) => { const u = pr(t, t0 + i * stagger, t0 + i * stagger + .8), e = eOut(u), a = cl(u * 2.2) * (1 - ex);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; const b = (1 - e) * 20 + ex * 16; if (b > .3) ctx.filter = `blur(${b}px)`; ctx.font = font; ctx.textBaseline = 'middle'; ctx.fillStyle = mixc(GREYW, Array.isArray(colors) ? colors[i] : colors, eOut(pr(t, t0 + i * stagger + .25, t0 + i * stagger + .85)));
      ctx.translate(x + ws[i] / 2 + dir[0] * (1 - e) + exv[0] * ex, y + dir[1] * (1 - e) + exv[1] * ex); const sc = lerp(.96, 1, e); ctx.scale(sc, sc); ctx.fillText(w, -ws[i] / 2, 0); ctx.restore(); }
    x += ws[i] + sp; }); }
function S1b(ctx, t, W, H) { bgBleu(ctx, W, H); const ex = eIO(pr(t, .95, 1.4)); // « selon le Forum » (haut) puis « économique mondial » : un seul texte au centre
  lineX(ctx, ['selon', 'le', 'Forum'], W / 2, H / 2, t, .1, { font: SANS(96, 700), colors: '#FFFFFF', dir: [0, -60], ex });
  lineX(ctx, ['économique', 'mondial'], W / 2, H / 2, t, 1.25, { font: SANS(96, 800), colors: '#FFFFFF', dir: [0, 60] }); }
function S1(ctx, t, W, H) { bgBleu(ctx, W, H); const d = 1 + t * .012;
  ctx.save(); ctx.translate(W / 2, H * .5); ctx.scale(d, d); ctx.translate(-W / 2, -H * .5);
  exitWrap(ctx, W, H, pr(t, 1.9, 2.6), () => letters(ctx, 'D’ici 2030…', W / 2, H * .5, t, .25, { font: SERIF(250), color: '#FFFFFF' })); ctx.restore(); }
function S2(ctx, T, W, H) {
  const t = T - 2.6; bgBlanc(ctx, W, H); const white = 1 - pr(t, 0, .35);
  const zin = eOut(pr(t, .1, 1.4)), zout = eIO(pr(t, 4.1, 4.8)), push = t * .01;
  const sc = lerp(.55, 1, zin) + push + zout * 2.4, tilt = (1 - zin) * .35, blur = (1 - zin) * 22 + zout * 30;
  const cw = 1320, ch = 760, cx = W / 2, cy = H / 2 + (1 - zin) * 80;
  ctx.save(); ctx.globalAlpha = cl(zin * 1.6) * (1 - cl(zout * 1.4)); if (blur > .3) ctx.filter = `blur(${blur}px)`;
  ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.transform(1, 0, -tilt * .25, 1 - tilt * .3, 0, 0);
  // card
  ctx.shadowColor = 'rgba(40,50,110,.18)'; ctx.shadowBlur = 90; ctx.shadowOffsetY = 40; ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 40); ctx.fill(); ctx.shadowColor = 'transparent';
  const L = -cw / 2 + 80, R = cw / 2 - 80, Tp = -ch / 2 + 70;
  ctx.font = SANS(34, 600); ctx.fillStyle = '#6F6962'; ctx.textBaseline = 'middle'; ctx.globalAlpha *= 1; ctx.fillText('Emplois dans le monde, d’ici 2030', L, Tp);
  // KPI tiles
  const kpi = (x, val, label, color, ta) => { const u = eOut(pr(t, ta, ta + 1.6)), a = cl(pr(t, ta, ta + .5) * 1.5);
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - eOut(pr(t, ta, ta + .8))) * 24);
    ctx.font = SANS(110, 800); ctx.fillStyle = color; ctx.fillText(`${val > 0 ? '+' : '−'}${Math.round(Math.abs(val) * u)} M`, x, Tp + 110);
    ctx.font = SANS(32, 600); ctx.fillStyle = '#6F6962'; ctx.fillText(label, x + 4, Tp + 190); ctx.restore(); };
  kpi(L, -92, 'emplois supprimés', '#D9482B', 1.0); kpi(L + 560, 170, 'emplois créés', BLUE, 2.1);
  // chart area
  const gx0 = L, gx1 = R, gy0 = ch / 2 - 90, gyTop = Tp + 260, k = (gy0 - gyTop) / 190;
  const base = gy0 - 92 * k; // zero line raised so the red can go below
  ctx.save(); ctx.globalAlpha *= cl(pr(t, .9, 1.6)); ctx.strokeStyle = 'rgba(43,45,51,.07)'; ctx.lineWidth = 2;
  for (let i = 0; i <= 3; i++) { const y = gyTop + (gy0 - gyTop) * i / 3; ctx.beginPath(); ctx.moveTo(gx0, y); ctx.lineTo(gx1, y); ctx.stroke(); }
  ctx.font = SANS(26, 600); ctx.fillStyle = '#9A9DA8'; ['2025', '2030'].forEach((y, i) => { ctx.textAlign = i ? 'right' : 'left'; ctx.fillText(y, i ? gx1 : gx0, gy0 + 40); }); ctx.restore();
  const area = (val, color, ta, tb) => { const u = eIO(pr(t, ta, tb)); if (u <= 0) return; const n = 80, pts = [];
    for (let i = 0; i <= n; i++) { const f = i / n * u; pts.push([lerp(gx0, gx1, f), base - val * k * (f * f * (3 - 2 * f))]); }
    const g = ctx.createLinearGradient(0, base - val * k, 0, base); g.addColorStop(0, color + (val > 0 ? '55' : '10')); g.addColorStop(1, color + (val > 0 ? '05' : '50'));
    ctx.beginPath(); ctx.moveTo(gx0, base); pts.forEach(p => ctx.lineTo(...p)); ctx.lineTo(pts.at(-1)[0], base); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.strokeStyle = color; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    const [hx, hy] = pts.at(-1); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hx, hy, 13, 0, 7); ctx.fill(); ctx.lineWidth = 6; ctx.stroke(); };
  area(-92, '#D9482B', 1.0, 2.8); area(170, '#4245F6', 2.1, 3.9);
  ctx.save(); ctx.globalAlpha *= cl(pr(t, .9, 1.6)); ctx.strokeStyle = 'rgba(43,45,51,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx0, base); ctx.lineTo(gx1, base); ctx.stroke(); ctx.restore();
  ctx.restore();
  ctx.save(); ctx.globalAlpha = cl(pr(t, 1.2, 1.8)) * (1 - zout); ctx.font = SANS(22, 500); ctx.fillStyle = '#9A9DA8'; ctx.textAlign = 'center'; ctx.fillText('Source : World Economic Forum, Future of Jobs Report 2025', W / 2, H - 36); ctx.restore();
  if (white > 0) { ctx.save(); ctx.globalAlpha = white; bgBleu(ctx, W, H); ctx.restore(); }

}
const JOBS = ['Assistant administratif', 'Caissier', 'Comptable', 'Graphiste'];
function S3(ctx, T, W, H) { // métiers qui défilent ; puis « parmi les plus cités » en fondu, mot à mot, au milieu
  const t = T - 7.4; clear(ctx, W, H); { const a = 1 - eOut(pr(t, 0, .5)); if (a > 0) { ctx.save(); ctx.globalAlpha = a; bgBlanc(ctx, W, H); ctx.restore(); } } const font = SANS(120, 800), gap = 140; ctx.font = font;
  const ws = JOBS.map(j => ctx.measureText(j).width), cx = []; let acc = 0; ws.forEach((w, i) => { cx.push(acc + w / 2); acc += w + gap; });
  const step = 1.0, s0 = .2; let cam = cx[0];
  for (let i = 1; i < JOBS.length; i++) cam = lerp(cam, cx[i], eIO(pr(t, s0 + i * step - .1, s0 + i * step + .6)));
  const jobsOut = eIO(pr(t, 4.3, 4.8));
  exitWrap(ctx, W, H, pr(t, 6.0, 6.6), () => {
    if (jobsOut < 1) JOBS.forEach((j, i) => { const u = pr(t, s0 + i * step, s0 + i * step + .7); if (u <= 0) return; const e = eOut(u);
      const x = W / 2 + cx[i] - cam, d = cl(Math.abs(cx[i] - cam) / 500), act = 1 - d;
      ctx.save(); ctx.globalAlpha = cl(u * 2) * lerp(.25, 1, act) * (1 - jobsOut); ctx.filter = `blur(${(1 - e) * 20 + d * 4 + jobsOut * 10}px)`;
      ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = INK; ctx.fillText(j, x, H / 2 + (1 - e) * 20); ctx.restore(); });
    lineX(ctx, ['parmi', 'les', 'plus', 'cités'], W / 2, H / 2, t, 4.9, { font: SANS(130, 800), colors: BLUE, dir: [0, 0], stagger: .22 });
  });
}
function S4(ctx, T, W, H) { // « Le tien est peut-être sur la liste. » : une seule ligne centrée, deux couleurs, entre de gauche et de droite
  const t = T - 11.2; clear(ctx, W, H); const A = ['Le', 'tien', 'est', 'peut-être'], B = ['sur', 'la', 'liste.'], fA = z => SANS(z, 800), fB = z => SANS(z, 900);
  const wid = z => { ctx.font = fA(z); const sp = ctx.measureText(' ').width, a = ctx.measureText(A.join(' ')).width; ctx.font = fB(z); return [a, ctx.measureText(B.join(' ')).width, sp]; };
  let size = 130; for (; size > 60; size -= 2) { const [a, b, sp] = wid(size); if (a + b + sp * 1.4 < 1640) break; }
  const [wa, wb, sp] = wid(size), x0 = W / 2 - (wa + wb + sp * 1.4) / 2, zout = pr(t, 2.7, 3.4), push = 1 + t * .012;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2);
  exitWrap(ctx, W, H, zout, () => {
    lineX(ctx, A, x0 + wa / 2, H / 2, t, .2, { font: fA(size), colors: INK, dir: [-110, 0], stagger: .13 });
    lineX(ctx, B, x0 + wa + sp * 1.4 + wb / 2, H / 2, t, 1.0, { font: fB(size), colors: BLUE, dir: [110, 0], stagger: .13 });
  }); ctx.restore();

}
function S5(ctx, T, W, H) { // 14.6–22.2 : page de profils 3D → la carte part à gauche → « Mais » puis « demain… »
  const t = T - 14.6; clear(ctx, W, H);
  const settle = eIO(pr(t, 3.0, 4.8)), u1 = eIO(pr(t, 0, 3.4));
  const cy = lerp(lerp(650, 3850, u1), 470, settle);
  const gl = renderProfiles({ t, cy, tilt: lerp(.95, 0, settle), dist: lerp(10.5, 16, settle), rotZ: lerp(-.1, 0, settle) + Math.sin(t * .8) * .015 * (1 - settle), lift: 0, chipK: 1 });
  // card exit: zoom out + slide left + blur
  const go = eIO(pr(t, 4.9, 5.9));
  if (go < 1) { ctx.save(); ctx.globalAlpha = 1 - cl((go - .35) * 1.6); const sc = lerp(1, .6, go); ctx.translate(W / 2 - go * W * .7, H / 2); ctx.scale(sc, sc); ctx.translate(-W / 2, -H / 2);
    if (go > .2) ctx.filter = `blur(${(go - .2) * 20}px)`; ctx.drawImage(gl, 0, 0, W, H); ctx.restore(); }
  // « Mais » centre, then slides left as « demain… » appears
  const font = SANS(190, 900); ctx.font = font; const wM = ctx.measureText('Mais ').width, wD = ctx.measureText('demain…').width;
  const slide = eIO(pr(t, 5.9, 6.9)), xM = lerp(W / 2, W / 2 - (wM + wD) / 2 + ctx.measureText('Mais').width / 2, slide);
  exitWrap(ctx, W, H, pr(t, 7.1, 7.6), () => {
    letters(ctx, 'Mais', xM, H / 2, t, 5.1, { font, color: INK, stagger: .05 });
    letters(ctx, 'demain…', W / 2 - (wM + wD) / 2 + wM + wD / 2, H / 2, t, 6.15, { font, color: BLUE, stagger: .045 });
  });

}
function S6(ctx, T, W, H) { // un seul texte à la fois : « Ton expertise reste ta force. » (de gauche) → « L'IA la multiplie. » (de droite)
  const t = T - 22.2; clear(ctx, W, H); const push = 1 + t * .01, f = SANS(120, 800);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2);
  exitWrap(ctx, W, H, pr(t, 4.6, 5.2), () => {
    lineX(ctx, ['Ton', 'expertise', 'reste', 'ta', 'force.'], W / 2, H / 2, t, .2, { font: f, colors: INK, dir: [-110, 0], ex: eIO(pr(t, 1.9, 2.35)), exv: [-70, 0], stagger: .11 });
    lineX(ctx, ['L’IA', 'la', 'multiplie.'], W / 2, H / 2, t, 2.2, { font: f, colors: [INK, INK, BLUE], dir: [110, 0], stagger: .14 });
  }); ctx.restore();
}
function S7(ctx, T, W, H) { // 27.4–31.8 : « Moi, c'est Moustakim. »
  const t = T - 27.4; clear(ctx, W, H);
  exitWrap(ctx, W, H, pr(t, 3.8, 4.4), () => {
    const u = eOut(pr(t, .1, 1.1)), r = 190, cx = W * .3, cy = H / 2;
    ctx.save(); ctx.globalAlpha = cl(u * 1.5); ctx.filter = u < .99 ? `blur(${(1 - u) * 20}px)` : 'none'; ctx.translate(cx, cy + (1 - u) * 50); ctx.scale(lerp(.9, 1, u), lerp(.9, 1, u));
    ctx.shadowColor = 'rgba(40,50,110,.2)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, r + 12, 0, 7); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.clip(); ctx.drawImage(PHOTO, -r * 1.04, -r * 1.04, r * 2.08, r * 2.08); ctx.restore();
    const ring = eIO(pr(t, .6, 1.8)); if (ring > 0) { ctx.save(); ctx.strokeStyle = BLUE; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, cy, r + 34, -Math.PI / 2, -Math.PI / 2 + ring * Math.PI * 2); ctx.stroke(); ctx.restore(); }
    const L = W * .48;
    ctx.save(); ctx.textAlign = 'left';
    letters(ctx, 'Moi, c’est', L + 300, H * .4, t, .7, { font: SANS(96, 800), color: '#6F6962', stagger: .03 });
    letters(ctx, 'Moustakim.', L + 330, H * .53, t, 1.1, { font: SANS(130, 900), color: INK, stagger: .04 });
    words(ctx, ['Data', '·', 'Suivi-évaluation', '·', 'Communication'], L + 350, H * .65, t, 1.9, { font: SANS(40, 600), color: BLUE, stagger: .1 });
    ctx.restore();
  });
}
function grad(ctx, W, H, t) { bgBlanc(ctx, W, H);
  const r = ctx.createRadialGradient(W * (.25 + .05 * Math.sin(t * .5)), H * .2, 0, W * .25, H * .2, W * .6); r.addColorStop(0, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = r; ctx.fillRect(0, 0, W, H); }
function cursorHand(ctx, x, y, press = 0) { ctx.save(); ctx.translate(x, y); const s = 1.6 * (1 - press * .15); ctx.scale(s, s);
  ctx.fillStyle = '#111'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.lineTo(8, 23); ctx.lineTo(14, 36); ctx.lineTo(19, 34); ctx.lineTo(13, 21); ctx.lineTo(23, 21); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
function S8(ctx, T, W, H) { // 31.8–44.2 : « Un dashboard ? 2 semaines à 1 mois » → glisse dans l'écran → couloir de dashboards → « 1 journée »
  const t = T - 31.8;
  if (t < 3.0) { // a) machine à écrire sur blanc, rétrécit, clic sur le mot clé
    clear(ctx, W, H); const A = 'Un dashboard ?', B = '2 semaines à 1 mois', n = Math.floor(eIO(pr(t, .1, 1.6)) * (A.length + B.length));
    const shrink = eIO(pr(t, 1.8, 2.4)), size = lerp(120, 76, shrink); ctx.font = SANS(size, 800); ctx.textBaseline = 'middle'; const wA = ctx.measureText(A).width, wB = ctx.measureText(B).width;
    const yA = H / 2 - size * .6, yB = H / 2 + size * .6; ctx.textAlign = 'left'; ctx.fillStyle = INK; ctx.fillText(A.slice(0, Math.min(n, A.length)), W / 2 - wA / 2, yA);
    if (n > A.length) { ctx.fillStyle = BLUE; ctx.fillText(B.slice(0, n - A.length), W / 2 - wB / 2, yB); }
    if (n < A.length + B.length || Math.floor(t * 2.5) % 2 === 0) { const sh = n > A.length ? B.slice(0, n - A.length) : A.slice(0, n), ww = ctx.measureText(sh).width, bx = (n > A.length ? W / 2 - wB / 2 : W / 2 - wA / 2) + ww + 6; ctx.fillStyle = INK; ctx.fillRect(bx, (n > A.length ? yB : yA) - size * .45, 5, size * .9); }
    const c = eIO(pr(t, 2.0, 2.5)), press = Math.sin(Math.PI * pr(t, 2.5, 2.7)); if (t > 1.9) cursorHand(ctx, lerp(W * .62, W / 2 + wB * .25, c), lerp(H * .8, yB + 14, c), press);
    const g = eIO(pr(t, 2.55, 3.0)); if (g > 0) { ctx.save(); ctx.globalAlpha = g; grad(ctx, W, H, T); ctx.restore(); }
    return;
  }
  const u = t - 3.0; grad(ctx, W, H, T);
  if (u < 4.2) { // b) inclinaison 3D, la caméra glisse sur les KPI puis le graphique, puis se remet à plat
    const a = eIO(pr(u, 0, 1.6)), b = eIO(pr(u, 1.4, 3.0)), c = eIO(pr(u, 2.9, 4.2));
    const fx = lerp(lerp(500, 700, a), 840, c), fy = lerp(lerp(230, 420, b), 468, c);
    const gl = renderDash({ rx: lerp(-.75, 0, c), ry: lerp(.35, 0, c), rz: lerp(.12, 0, c), fx, fy, dist: lerp(lerp(5.2, 6.5, b), 21, c) });
    const ia = eOut(pr(u, 0, .8)); ctx.save(); ctx.globalAlpha = ia; if (ia < .99) ctx.filter = `blur(${(1 - ia) * 18}px)`; ctx.drawImage(gl, 0, 0, W, H); ctx.restore();
  } else { // c) le dashboard recule, 5 autres défilent en profondeur ; bulles « avant / avec l'IA »
    const v = u - 4.2, ru = eIO(pr(v, 0, 1.5)), fly = eIO(pr(v, 1.1, 5.0));
    const cz = lerp(lerp(21, 15, ru), -21, fly), cx = Math.sin(v * .9) * .5 * pr(v, 1.5, 2.4), cy = Math.sin(v * .7 + 1) * .25 * pr(v, 1.5, 2.4);
    ctx.drawImage(renderCorridor({ u: ru, cz, cx, cy }), 0, 0, W, H);
    const pill = (txt, y, ta, col, size, bg) => { const e = eOut(pr(v, ta, ta + .8)); if (e <= 0) return; ctx.save(); ctx.font = SANS(size, 800); const tw = ctx.measureText(txt).width + 110; ctx.globalAlpha = cl(e * 1.6); ctx.translate(W / 2, y + (1 - e) * 50); ctx.scale(lerp(.9, 1, e), lerp(.9, 1, e)); if (e < .99) ctx.filter = `blur(${(1 - e) * 16}px)`;
      ctx.shadowColor = 'rgba(30,40,110,.3)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-tw / 2, -size * .85, tw, size * 1.7, size * .85); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
    pill('Avant : 2 semaines à 1 mois', H * .72, 1.3, '#6F6962', 58, 'rgba(255,255,255,.92)'); pill('Avec l’IA : 1 journée', H * .86, 3.1, '#fff', 74, BLUE);
    const o = pr(v, 5.0, 5.5); if (o > 0) { ctx.fillStyle = `rgba(255,255,255,${eIO(o)})`; ctx.fillRect(0, 0, W, H); }
  }
}
function S9(ctx, T, W, H) { // une seule ligne, fond blanc uni, deux couleurs : « L'IA ne remplace pas l'expert. » puis « Elle remplace celui qui ne s'en sert pas. »
  const t = T - 44.4; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  const two = (A, B, t0, ex, dirA, dirB, size) => { const fA = SANS(size, 800), fB = SANS(size, 900); ctx.font = fA; const sp = ctx.measureText(' ').width, wa = ctx.measureText(A.join(' ')).width; ctx.font = fB; const wb = ctx.measureText(B.join(' ')).width, tot = wa + wb + sp * 1.4, x0 = W / 2 - tot / 2;
    lineX(ctx, A, x0 + wa / 2, H / 2, t, t0, { font: fA, colors: INK, dir: dirA, ex, exv: [-60, 0], stagger: .1 });
    lineX(ctx, B, x0 + wa + sp * 1.4 + wb / 2, H / 2, t, t0 + .75, { font: fB, colors: BLUE, dir: dirB, ex, exv: [60, 0], stagger: .1 }); };
  two(['L’IA', 'ne', 'remplace', 'pas'], ['l’expert.'], .2, eIO(pr(t, 4.0, 4.5)), [-110, 0], [110, 0], 104);
  if (t > 4.4) two(['Elle', 'remplace', 'celui', 'qui'], ['ne', 's’en', 'sert', 'pas.'], 4.5, eIO(pr(t, 7.0, 7.5)), [-110, 0], [110, 0], 84);
}
function S10(ctx, T, W, H) { // « D'ailleurs… cette vidéo a été animée avec l'IA. » : un seul texte au centre, 3 temps
  const t = T - 50.0; clear(ctx, W, H);
  exitWrap(ctx, W, H, pr(t, 4.1, 4.6), () => {
    lineX(ctx, ['D’ailleurs…'], W / 2, H / 2, t, .2, { font: SERIF(160), colors: INK, dir: [0, -60], ex: eIO(pr(t, 1.0, 1.45)) });
    lineX(ctx, ['Cette', 'vidéo', 'a', 'été', 'animée'], W / 2, H / 2, t, 1.25, { font: SANS(112, 800), colors: INK, dir: [0, 60], ex: eIO(pr(t, 2.75, 3.2)), stagger: .09 });
    letters(ctx, 'avec l’IA.', W / 2, H / 2, t, 3.05, { font: SANS(230, 900), color: BLUE, stagger: .045 });
  });

}
function S11(ctx, T, W, H) { // signature sur fond bleu
  const t = T - 54.6; clear(ctx, W, H); { const a = eOut(pr(t, 0, .5)); ctx.save(); ctx.globalAlpha = a; bgBleu(ctx, W, H); ctx.restore(); }
  const u = eOut(pr(t, .1, 1.1)), r = 190, cx = W * .3, cy = H / 2;
  ctx.save(); ctx.globalAlpha = cl(u * 1.5); ctx.filter = u < .99 ? `blur(${(1 - u) * 20}px)` : 'none'; ctx.translate(cx, cy + (1 - u) * 50); ctx.scale(lerp(.9, 1, u), lerp(.9, 1, u));
  ctx.shadowColor = 'rgba(10,12,80,.35)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 26; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, r + 12, 0, 7); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.clip(); ctx.drawImage(PHOTO, -r * 1.04, -r * 1.04, r * 2.08, r * 2.08); ctx.restore();
  const ring = eIO(pr(t, .6, 1.8)); if (ring > 0) { ctx.save(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, cy, r + 34, -Math.PI / 2, -Math.PI / 2 + ring * Math.PI * 2); ctx.stroke(); ctx.restore(); }
  const L = W * .48; ctx.save(); ctx.textAlign = 'left';
  letters(ctx, 'Moustakim', L + 350, H * .40, t, .7, { font: SANS(150, 800), color: '#FFFFFF', stagger: .04 });
  words(ctx, ['Data', '·', 'Suivi-évaluation', '·', 'Communication'], L + 350, H * .53, t, 1.6, { font: SANS(40, 500), color: '#E3E4FF', stagger: .1 });
  ctx.restore();
  const b = eOut(pr(t, 2.9, 3.7)); if (b > 0) { const pulse = 1 + .025 * Math.sin((t - 3.7) * 5) * pr(t, 3.7, 4.2); ctx.save(); ctx.globalAlpha = cl(b * 1.5); ctx.translate(L + 350, H * .70 + (1 - b) * 60); ctx.scale(lerp(.85, 1, b) * pulse, lerp(.85, 1, b) * pulse); if (b < .99) ctx.filter = `blur(${(1 - b) * 14}px)`;
    ctx.shadowColor = 'rgba(10,12,80,.4)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-250, -66, 500, 132, 66); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.fillStyle = BLUE; ctx.font = SANS(62, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Abonne-toi', 0, 4); ctx.restore(); }
}
// ---- séquence (script v4) : [début, fin, plan, début d'origine] ----
const SEG = [[0, 2.0, S1, 0, 1.3], [2.0, 4.55, S1b, 0], [4.55, 8.0, S2, 2.6, 1.3], [8.0, 14.6, S3, 7.4], [14.6, 17.8, S4, 11.2, 1.06], [17.8, 25.4, S5, 14.6], [25.4, 30.5, S6, 22.2, 1.02], [30.5, 37.0, S7, 27.4, .68], [37.0, 48.7, S8, 31.8, 1.06], [48.7, 56.5, S9, 44.4], [56.5, 60.8, S10, 50.0, 1.07], [60.8, 64.6, S11, 54.6, 1.8]];
export function draw(ctx, t, { W, H }) { const s = SEG.find(x => t < x[1]) || SEG.at(-1); s[2](ctx, (t - s[0]) * (s[4] || 1) + s[3], W, H); }
