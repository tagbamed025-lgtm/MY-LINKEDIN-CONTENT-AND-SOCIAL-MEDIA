// Vidéo 001 — « Ton DG te demande un dashboard » — aperçu animation (sans voix). 1080×1920, 30 fps.
import { C, SANS, SERIF, MONO, bgPerle, bgBlanc, bgBleu, bgSable, card, badge } from '../kit/moustakim_kit.js';
const INK = C.INK2, BLUE = C.BLUE, GREY = C.GREY, TAUPE = C.TAUPE;
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), pr = (t, a, b) => cl((t - a) / (b - a)), lerp = (a, b, u) => a + (b - a) * u;
const eOut = u => 1 - Math.pow(1 - u, 5), eIO = u => u < .5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2;
const eBack = u => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
const bounce = u => { const n = 7.5625, d = 2.75; if (u < 1 / d) return n * u * u; if (u < 2 / d) return n * (u -= 1.5 / d) * u + .75; if (u < 2.5 / d) return n * (u -= 2.25 / d) * u + .9375; return n * (u -= 2.625 / d) * u + .984375; };
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mixc = (a, b, u) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], u))).join(',')})`; };

const SEG = [
  { id: 'msg', a: 0, b: 5.0, bg: 'perle' }, { id: 'logo', a: 5.0, b: 8.3, bg: 'perle' }, { id: 'err', a: 8.3, b: 9.95, bg: 'bleu' },
  { id: 'pre', a: 9.95, b: 12.95, bg: 'blanc' }, { id: 'q1', a: 12.95, b: 13.85, bg: 'blanc' }, { id: 'q2', a: 13.85, b: 14.95, bg: 'blanc' },
  { id: 'idea', a: 14.95, b: 18.7, bg: 'sable' }, { id: 'story', a: 18.7, b: 30.7, bg: 'blanc' }, { id: 'kpi', a: 30.7, b: 34.8, bg: 'perle' }, { id: 'cta', a: 34.8, b: 43, bg: 'blanc' },
];
const BG = { perle: bgPerle, blanc: (c, w, h) => bgBlanc(c, w, h, true), bleu: bgBleu, sable: bgSable };
let M; // contexte de mesure
const STORY = [
  { icon: 'user', t: 3.47, sp: .24, toks: [['En', 0], ['tant', 0], ['que', 0], ['DG', 1]] },
  { icon: 'pin', t: 4.56, sp: .256, toks: [['Je', 0], ['veux', 0], ['savoir', 0], ['quelles', 1], ['zones', 1], ['du', 1], ['projet', 1], ['agricole', 1], ['sont', 1], ['en', 1], ['retard', 1]] },
  { icon: 'team', t: 7.83, sp: .26, toks: [['Pour', 0], ['décider', 0], ['où', 1], ['envoyer', 1], ["l'équipe", 1], ['de', 1], ['terrain', 1], ['avant', 0], ['la', 0], ['fin', 0], ['du', 0], ['mois', 0]] },
];
const ICON = {
  user: ['M12 8m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', 'M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7'],
  pin: ['M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z', 'M12 10m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0'],
  team: ['M9 8m-3.2 0a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0 -6.4 0', 'M3 20c0-3.6 2.7-5.6 6-5.6s6 2 6 5.6', 'M17 9m-2.6 0a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0', 'M17 14.6c2.6.2 4.4 1.9 4.4 5'],
  bar: ['M5 20V10M12 20V4M19 20v-7'], clock: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M12 7v5l3 2'],
};
const BUB = [
  { side: 'in', text: 'Hello Mo,', typ: .3, t: .7 },
  { side: 'out', text: 'Bonjour DG', typ: 1.25, t: 1.65 },
  { side: 'in', text: 'Peux-tu me faire un petit dashboard sur le projet agricole pour lundi ?', typ: 2.1, t: 2.5 },
];
const BF = SANS(54, 500);
const cyc = (yc, size) => yc + size * .35; // centre visuel -> ligne de base

const IMG = {};
const loadImg = n => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = `/assets/img/${n}.png`; });
function circHead(ctx, img, x, y, r, bg) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip(); ctx.fillStyle = bg; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); const ih = 2 * r * 1.12, iw = ih * img.width / img.height; ctx.drawImage(img, x - iw / 2, y - ih * .52, iw, ih); ctx.restore(); }
export async function init() {
  for (const n of ['dg-tete', 'mo-tete', 'mo-buste', 'powerbi']) IMG[n] = await loadImg(n);
  for (const w of [400, 500, 700, 800]) document.fonts.add(await new FontFace('Inter Tight', `url(/assets/fonts/InterTight/inter-tight-latin-${w}-normal.woff2)`, { weight: String(w) }).load());
  document.fonts.add(await new FontFace('Instrument Serif', 'url(/assets/fonts/InstrumentSerif/instrument-serif-latin-400-italic.woff2)', { style: 'italic' }).load());
  document.fonts.add(await new FontFace('Geist Mono', 'url(/assets/fonts/GeistMono/geist-mono-latin-400-normal.woff2)').load());
  M = document.createElement('canvas').getContext('2d');
  // bulles : lignes et tailles finales
  M.font = BF;
  for (const b of BUB) {
    const words = b.text.split(' '), lines = []; let cur = '';
    for (const w of words) { const test = cur ? cur + ' ' + w : w; if (cur && M.measureText(test).width > 520) { lines.push(cur); cur = w; } else cur = test; }
    lines.push(cur); b.lines = lines.map(l => ({ l, words: l.split(' ') }));
    b.w = Math.max(...lines.map(l => M.measureText(l).width)) + 72; b.h = lines.length * 66 + 48;
  }
  // story : lignes
  const fw = bold => bold ? SANS(56, 800) : SANS(56, 500), maxW = 590; const sp = (M.font = SANS(56, 500), M.measureText(' ').width);
  for (const r of STORY) {
    const lines = []; let cur = [], cw = 0;
    r.toks.forEach(([w, b], i) => { M.font = fw(b); const ww = M.measureText(w).width; if (cur.length && cw + sp + ww > maxW) { lines.push(cur); cur = []; cw = 0; } cur.push({ w, b, ww, i }); cw += (cur.length > 1 ? sp : 0) + ww; });
    lines.push(cur); r.lines = lines; r.h = Math.max(110, lines.length * 72);
  }
}

function lineWords(ctx, parts, { cx, cy, t, size, color = INK, ex = 0, to = color, d = .7 }) { // une seule ligne, mots qui arrivent un à un
  ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = `${-.025 * size}px`;
  const fnt = p => p.k === 'serif' ? SERIF(size * 1.18) : p.k === 'bold' ? SANS(size, 800) : SANS(size, 500);
  ctx.font = SANS(size, 500); const sp = ctx.measureText(' ').width; const ws = parts.map(p => (ctx.font = fnt(p), ctx.measureText(p.w).width));
  const total = ws.reduce((a, b) => a + b, 0) + sp * (parts.length - 1); let x = cx - total / 2;
  parts.forEach((p, i) => {
    const u = pr(t, p.t, p.t + d), e = eOut(u);
    if (u > 0) { const ga = ctx.globalAlpha; ctx.save(); ctx.globalAlpha = ga * cl(u * 3) * (1 - eIO(ex)); const bl = (1 - e) * 12 + eIO(ex) * 14; if (bl > .3) ctx.filter = `blur(${bl}px)`;
      ctx.translate(x + ws[i] / 2, cy + (1 - e) * size * .38 - eIO(ex) * 24); const sc = lerp(.95, 1, e) * (1 + .06 * eIO(ex)); ctx.scale(sc, sc);
      ctx.font = fnt(p); ctx.textAlign = 'center'; ctx.fillStyle = mixc(GREY.length === 7 ? GREY : '#A8A8AA', p.c || to, eOut(pr(t, p.t + .15, p.t + .75))); ctx.fillText(p.w, 0, 0); ctx.restore(); }
    x += ws[i] + sp;
  });
  ctx.restore();
}
const wrap = (ctx, W, H, ex, fn, zoom = .08) => { const e = eIO(ex); ctx.save(); ctx.globalAlpha = 1 - e; ctx.translate(W / 2, H / 2); const s = 1 + zoom * e; ctx.scale(s, s); ctx.translate(-W / 2, -H / 2); if (e > 0) ctx.filter = `blur(${14 * e}px)`; fn(); ctx.restore(); };
const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
function icon(ctx, name, x, y, s, color, lw = 2) { ctx.save(); ctx.translate(x - 12 * s, y - 12 * s); ctx.scale(s, s); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (const d of ICON[name]) ctx.stroke(new Path2D(d)); ctx.restore(); }
function tile(ctx, { x, y, s, t, t0, drop = false, glow = false, inner }) { // tuile blanche arrondie, tombe et rebondit ou zoome
  const u = pr(t, t0, t0 + (drop ? .75 : .6)); if (u <= 0) return; let dy = 0, sc = 1;
  if (drop) { dy = lerp(-420, 0, bounce(u)); } else { sc = lerp(.6, 1, eBack(u)); dy = (1 - eOut(u)) * 60; }
  { const ga = ctx.globalAlpha; ctx.save(); ctx.globalAlpha = ga * cl(u * 4); ctx.translate(x, y + dy); ctx.scale(sc, sc);
  ctx.save(); ctx.shadowColor = glow ? 'rgba(8,30,100,.55)' : 'rgba(43,38,34,.32)'; ctx.shadowBlur = 70; ctx.shadowOffsetY = 36; ctx.fillStyle = '#fff'; rr(ctx, -s / 2, -s / 2, s, s, s * .26); ctx.fill(); ctx.restore();
  if (inner) inner(ctx); ctx.restore(); }
}

// ---------------- scènes ----------------
const SC = {};
SC.msg = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  const gap = 24, dots = (c, x, y, tt, col) => { for (let i = 0; i < 3; i++) { c.fillStyle = col; c.beginPath(); c.arc(x + i * 34, y + Math.sin(tt * 7 - i * .9) * 6, 9, 0, 7); c.fill(); } };
  const st = BUB.map((b, i) => { const vis = eOut(pr(t, b.typ, b.typ + .4)); const m = eOut(pr(t, b.t, b.t + .3)); return { b, vis, w: lerp(160, b.w, m), h: lerp(114, b.h, m), m }; });
  let total = 0; st.forEach(s => total += (s.h + gap) * s.vis); total -= gap; let y = H * .5 - total / 2;
  st.forEach((s, i) => {
    const b = s.b; if (s.vis <= 0) return; const left = b.side === 'in' ? 190 : W - 190 - s.w, nxt = BUB[i + 1] ? eOut(pr(t, BUB[i + 1].typ, BUB[i + 1].typ + .4)) : 0;
    const dim = 1 - .45 * nxt, by = y; y += (s.h + gap) * s.vis;
    ctx.save(); ctx.globalAlpha = s.vis * dim; const sc = lerp(.82, 1, s.vis); const ox = b.side === 'in' ? left : left + s.w; ctx.translate(ox, by + s.h); ctx.scale(sc, sc); ctx.translate(-ox, -(by + s.h));
    if (s.vis < .98) ctx.filter = `blur(${(1 - s.vis) * 10}px)`;
    ctx.fillStyle = b.side === 'in' ? '#E9E9EB' : BLUE; rr(ctx, left, by, s.w, s.h, 40); ctx.fill();
    if (s.m < .6) dots(ctx, left + s.w / 2 - 34, by + s.h / 2, t, b.side === 'in' ? GREY : 'rgba(255,255,255,.8)');
    else { ctx.font = BF; ctx.textBaseline = 'middle'; ctx.letterSpacing = '-1px'; let wi = 0; const sp = ctx.measureText(' ').width;
      b.lines.forEach((L, li) => { let x = left + 36; L.words.forEach(w => { const ww = ctx.measureText(w).width, u = pr(t, b.t + .05 + wi * .075, b.t + .05 + wi * .075 + .4); wi++;
        ctx.save(); ctx.globalAlpha *= cl(u * 3); ctx.fillStyle = b.side === 'in' ? mixc('#A8A8AA', INK, eOut(u)) : mixc('#9DB8F8', '#ffffff', eOut(u)); ctx.fillText(w, x, by + 24 + 33 + li * 66 + 2 + (1 - eOut(u)) * 14); ctx.restore(); x += ww + sp; }); }); }
    ctx.restore();
    if (b.side === 'out') { ctx.save(); ctx.globalAlpha = s.vis * dim; circHead(ctx, IMG['mo-tete'], W - 118, by + s.h - 44, 48, '#DDE6FB'); ctx.restore(); }
    // avatar du DG sur la dernière bulle entrante
    if (b.side === 'in') { const last = i === 2, a = last ? eOut(pr(t, b.typ, b.typ + .4)) : 1 - eOut(pr(t, BUB[2].typ - .1, BUB[2].typ + .3));
      if (a > 0) { ctx.save(); ctx.globalAlpha = a * s.vis * dim; circHead(ctx, IMG['dg-tete'], 118, by + s.h - 44, 48, '#D9DCE3'); ctx.restore(); } }
  });
});
SC.logo = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  badge(ctx, { x: W / 2, y: 892, r: 175, t, t0: .3, draw: (c, r) => { const im = IMG.powerbi, h = 210, w = h * im.width / im.height; c.drawImage(im, -w / 2, -h / 2, w, h); } });
  lineWords(ctx, [{ w: 'Tu', t: 1.85 }, { w: 'ouvres', t: 1.97 }, { w: 'Power', t: 2.3, k: 'bold' }, { w: 'BI.', t: 2.45, k: 'bold' }], { cx: W / 2, cy: cyc(1165, 76), t, size: 76 });
});
SC.err = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  tile(ctx, { x: W / 2, y: 890, s: 300, t, t0: .05, drop: true, glow: true, inner: c => { c.strokeStyle = BLUE; c.lineWidth = 26; c.lineCap = 'round'; c.beginPath(); c.moveTo(-62, -62); c.lineTo(62, 62); c.moveTo(62, -62); c.lineTo(-62, 62); c.stroke(); } });
  lineWords(ctx, [{ w: "C'est", t: .2 }, { w: 'la', t: .32 }, { w: 'première', t: .45 }, { w: 'erreur.', t: .7, k: 'serif' }], { cx: W / 2, cy: cyc(1145, 70), t, size: 70, color: '#FFFFFF' });
});
SC.pre = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  lineWords(ctx, [{ w: 'Avant', t: .2 }, { w: 'de', t: .4 }, { w: 'toucher', t: .52 }, { w: 'aux', t: .8 }, { w: 'données,', t: 1.0, k: 'bold' }], { cx: W / 2, cy: cyc(925, 62), t, size: 62 });
  lineWords(ctx, [{ w: 'pose', t: 1.6 }, { w: 'une', t: 1.8 }, { w: 'seule', t: 1.95 }, { w: 'question.', t: 2.2, k: 'serif', c: BLUE }], { cx: W / 2, cy: cyc(1010, 62), t, size: 62 });
});
SC.q1 = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  lineWords(ctx, [{ w: "Qu'est-ce", t: .1 }, { w: "qu'il", t: .25 }, { w: 'veut', t: .4 }], { cx: W / 2, cy: cyc(960, 96), t, size: 96, color: INK, d: .4 });
}, .45);
SC.q2 = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  const fy = Math.sin(t * 2.2) * 8;
  tile(ctx, { x: W / 2, y: 875 + fy, s: 270, t, t0: 0, inner: c => { c.fillStyle = BLUE; c.font = SERIF(210); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 0, 18); } });
  lineWords(ctx, [{ w: 'décider', t: .12, k: 'serif', c: BLUE }], { cx: W / 2, cy: cyc(1125, 104), t, size: 104 });
});
SC.idea = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  const pill = (txt, y, u0, fs, fill, col, sc = 1, strike = 0) => { const u = pr(t, u0, u0 + .7), e = eOut(u); if (u <= 0) return; ctx.save(); ctx.globalAlpha = cl(u * 3); if (e < .99) ctx.filter = `blur(${(1 - e) * 16}px)`;
    ctx.font = SANS(fs, 700); ctx.letterSpacing = `${-.03 * fs}px`; const tw = ctx.measureText(txt).width, w = tw + fs * 1.5, h = fs * 1.75; ctx.translate(W / 2, y + (1 - e) * 50); const s = lerp(.8, 1, e) * sc; ctx.scale(s, s);
    ctx.save(); ctx.shadowColor = fill === '#fff' ? 'rgba(43,38,34,.22)' : 'rgba(34,96,245,.5)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 22; ctx.fillStyle = fill; rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.restore();
    ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4);
    if (strike > 0) { ctx.strokeStyle = TAUPE; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-tw / 2, 6); ctx.lineTo(-tw / 2 + tw * strike, 6); ctx.stroke(); } ctx.restore(); };
  const sk = eOut(pr(t, 1.5, 1.85)), grow = eOut(pr(t, 1.85, 2.4)), cf = pr(t, 1.85, 2.3);
  pill('Montrer', 800, .1, 64, '#fff', mixc('#6F6962', '#A8A8AA', sk), 1 - .06 * sk, sk);
  pill('Décider', 962, .75, 78, mixc('#ffffff', '#2260F5', cf), mixc('#2B2622', '#ffffff', cf), 1 + .16 * grow);
  lineWords(ctx, [{ w: 'Un', t: 2.05 }, { w: 'dashboard', t: 2.15 }, { w: 'sert', t: 2.3 }, { w: 'à', t: 2.4 }, { w: 'décider.', t: 2.65, k: 'serif', c: INK }], { cx: W / 2, cy: cyc(1150, 66), t, size: 66 });
});
SC.story = (ctx, t, { W, H, ex }) => {
  const pad = 56, iw = 110, gx = 36, rg = 46, headH = 70; const vs = STORY.map(r => eOut(pr(t, r.t - .4, r.t + .3))); let ch = pad + headH; STORY.forEach((r, i) => ch += (r.h + rg) * vs[i]); ch += pad - rg;
  card(ctx, { x: W / 2, y: H * .5, w: 920, h: ch, t, t0: .15, ex, r: 52, draw: (c, w, h) => {
    c.save(); c.font = MONO(26); c.letterSpacing = '2px'; c.fillStyle = TAUPE; c.textBaseline = 'alphabetic'; c.fillText('USER STORY · EXEMPLE FICTIF', pad, pad + 28); c.restore();
    let y = pad + headH;
    STORY.forEach(r => { const u = pr(t, r.t, r.t + .5), e = eBack(u); const cyc = y + r.h / 2;
      if (u > 0) { c.save(); c.globalAlpha = cl(u * 3); c.translate(pad + iw / 2, cyc); c.scale(lerp(.4, 1, e), lerp(.4, 1, e)); c.fillStyle = '#EAF0FE'; c.beginPath(); c.arc(0, 0, 48, 0, 7); c.fill(); icon(c, r.icon, 0, 0, 2.2, BLUE, 2.1); c.restore(); }
      let ly = cyc - (r.lines.length * 72) / 2; c.textBaseline = 'alphabetic'; c.letterSpacing = '-1.5px';
      r.lines.forEach(L => { let x = pad + iw + gx; L.forEach(o => { const wu = pr(t, r.t + .25 + o.i * r.sp, r.t + .25 + o.i * r.sp + .5); if (wu > 0) { c.save(); c.globalAlpha = cl(wu * 3); c.font = o.b ? SANS(56, 800) : SANS(56, 500);
        const col = o.b ? BLUE : INK; c.fillStyle = mixc('#A8A8AA', col, eOut(wu)); c.fillText(o.w, x, ly + 54 + (1 - eOut(wu)) * 16); c.restore(); } c.font = o.b ? SANS(56, 800) : SANS(56, 500); x += o.ww + c.measureText(' ').width; }); ly += 72; });
      y += (r.h + rg) * vs[STORY.indexOf(r)]; });
  } });
};
SC.kpi = (ctx, t, { W, H, ex }) => {
  const K = [['bar', 'Avancement par zone', .1], ['clock', 'Jours de retard', .5], ['team', 'Équipes disponibles', .9]];
  K.forEach(([ic, lab, t0], i) => card(ctx, { x: W / 2, y: 695 + i * 190, w: 800, h: 150, t, t0, ex, r: 40, draw: (c, w, h) => {
    c.fillStyle = '#EAF0FE'; rr(c, 44, h / 2 - 42, 84, 84, 24); c.fill(); icon(c, ic, 86, h / 2, 2.2, BLUE, 2.2);
    c.fillStyle = INK; c.font = SANS(48, 600); c.letterSpacing = '-1.2px'; c.textBaseline = 'middle'; c.fillText(lab, 164, h / 2 + 3); } }));
  wrap(ctx, W, H, ex, () => lineWords(ctx, [{ w: 'Là,', t: .35 }, { w: 'tu', t: .5 }, { w: 'sais', t: .7 }, { w: 'quoi', t: 1.05, k: 'bold' }, { w: 'mesurer.', t: 1.35, k: 'bold' }], { cx: W / 2, cy: cyc(1265, 70), t, size: 70 }));
};
function laptop(ctx, { x, y, t, t0, ex = 0 }) {
  const u = pr(t, t0, t0 + .65); if (u <= 0 || ex >= 1) return; const e = eOut(u), xo = eIO(ex), sc = lerp(.62, 1, eBack(u)) * (1 + .1 * xo);
  const ga = ctx.globalAlpha; ctx.save(); ctx.globalAlpha = ga * cl(u * 3) * (1 - xo); const bl = (1 - e) * 18 + xo * 14; if (bl > .3) ctx.filter = `blur(${bl}px)`; ctx.translate(x, y); ctx.scale(sc, sc);
  const sw = 560, sh = 350, bz = 22;
  ctx.save(); ctx.shadowColor = 'rgba(43,38,34,.34)'; ctx.shadowBlur = 70; ctx.shadowOffsetY = 40;
  ctx.fillStyle = '#25282E'; rr(ctx, -sw / 2 - bz, -sh / 2 - bz - 40, sw + 2 * bz, sh + 2 * bz, 30); ctx.fill(); ctx.restore();
  const g = ctx.createLinearGradient(0, sh / 2 - 10, 0, sh / 2 + 50); g.addColorStop(0, '#E4E4E7'); g.addColorStop(1, '#C9C9CE');
  ctx.fillStyle = g; rr(ctx, -sw / 2 - 70, sh / 2 - 8 + bz - 40 + 6, sw + 140, 30, 14); ctx.fill(); ctx.fillStyle = '#B9B9BF'; rr(ctx, -50, sh / 2 + bz - 40 + 6, 100, 9, 5); ctx.fill();
  // écran : tableau de bord fictif, sans chiffres ni libellés
  const X0 = -sw / 2, Y0 = -sh / 2 - 40; ctx.fillStyle = '#fff'; rr(ctx, X0, Y0, sw, sh, 12); ctx.fill();
  ctx.fillStyle = '#F2F4F9'; rr(ctx, X0, Y0, sw, 36, 12); ctx.fill(); ctx.fillStyle = BLUE; ctx.beginPath(); ctx.arc(X0 + 24, Y0 + 18, 7, 0, 7); ctx.fill(); ctx.fillStyle = '#C9D3EC'; rr(ctx, X0 + 44, Y0 + 13, 90, 10, 5); ctx.fill();
  for (let k = 0; k < 3; k++) { const kx = X0 + 24 + k * 172, ku = eOut(pr(t, t0 + .5 + k * .12, t0 + 1.0 + k * .12)); ctx.save(); ctx.globalAlpha = ku; ctx.fillStyle = '#EAF0FE'; rr(ctx, kx, Y0 + 54, 160, 78, 14); ctx.fill(); ctx.fillStyle = BLUE; rr(ctx, kx + 16, Y0 + 70, 62, 11, 5); ctx.fill(); ctx.fillStyle = '#9DB8F8'; rr(ctx, kx + 16, Y0 + 94, 108, 18, 6); ctx.fill(); ctx.restore(); }
  const hs = [.35, .55, .42, .78, .62, .9, .7]; hs.forEach((h, k) => { const bu = eOut(pr(t, t0 + .8 + k * .07, t0 + 1.4 + k * .07)), bh = 130 * h * bu; ctx.fillStyle = k === 5 ? BLUE : '#BFD0FB'; rr(ctx, X0 + 34 + k * 70, Y0 + sh - 28 - bh, 44, bh, 8); ctx.fill(); });
  ctx.restore();
}
SC.cta = (ctx, t, { W, H }) => {
  const ex1 = pr(t, 2.5, 2.95);
  wrap(ctx, W, H, ex1, () => {
    const sh = eIO(pr(t, 1.0, 1.45)), q1 = lerp(960, 760, sh);
    lineWords(ctx, [{ w: 'Pas', t: .25, k: 'bold' }, { w: 'de', t: .4, k: 'bold' }, { w: 'question,', t: .55, k: 'bold' }], { cx: W / 2, cy: cyc(q1, 100), t, size: 100 });
    lineWords(ctx, [{ w: 'pas', t: 1.25, k: 'bold' }, { w: 'de', t: 1.37, k: 'bold' }, { w: 'dashboard.', t: 1.5, k: 'bold' }], { cx: W / 2, cy: cyc(870, 100), t, size: 100 });
    laptop(ctx, { x: W / 2, y: 1230, t, t0: 1.35 });
  }, .06);
  badge(ctx, { x: W / 2, y: 985, r: 118, t, t0: 2.95, draw: (c, r) => { const im = IMG['mo-buste'], h = 2 * r * 1.02, w = h * im.width / im.height; c.save(); c.beginPath(); c.arc(0, 0, r - 3, 0, 7); c.clip(); c.fillStyle = '#EAF0FE'; c.fillRect(-r, -r, 2 * r, 2 * r); c.drawImage(im, -w / 2, r + 4 - h, w, h); c.restore(); } });
  lineWords(ctx, [{ w: 'La', t: 3.35 }, { w: 'demande', t: 3.5 }, { w: 'la', t: 3.85 }, { w: 'plus', t: 4.3 }, { w: 'floue', t: 4.5, k: 'serif', c: BLUE }], { cx: W / 2, cy: cyc(690, 84), t, size: 84 });
  lineWords(ctx, [{ w: 'que', t: 5.2 }, { w: 'tu', t: 5.3 }, { w: 'aies', t: 5.45 }, { w: 'reçue ?', t: 5.6, k: 'bold' }], { cx: W / 2, cy: cyc(785, 84), t, size: 84 });
  lineWords(ctx, [{ w: 'Mohamed', t: 3.2, k: 'bold' }, { w: 'Moustakim', t: 3.3, k: 'bold' }, { w: 'Tagba', t: 3.4, k: 'bold' }], { cx: W / 2, cy: cyc(1160, 56), t, size: 56 });
  { const u = pr(t, 3.5, 4.1); if (u > 0) { ctx.save(); ctx.globalAlpha = cl(u * 2); ctx.fillStyle = TAUPE; ctx.font = MONO(25); ctx.letterSpacing = '2px'; ctx.textAlign = 'center'; ctx.fillText('DATA · SUIVI-ÉVALUATION · COMMUNICATION', W / 2, 1222); ctx.restore(); } }
};

function header(ctx, t, W) { // mini-avatar + nom, coin haut gauche, toute la vidéo sauf la dernière scène
  const a = eOut(pr(t, .4, 1.0)) * (1 - eIO(pr(t, 34.8, 35.3))); if (a <= 0) return;
  const bl = eIO(pr(t, 8.3, 8.75)) * (1 - eIO(pr(t, 9.95, 10.4))), x0 = 70, y = 300;
  ctx.save(); ctx.globalAlpha = a; circHead(ctx, IMG['mo-tete'], x0 + 30, y, 30, mixc('#E3EAFB', '#ffffff', bl));
  ctx.fillStyle = mixc(INK, '#ffffff', bl); ctx.font = SANS(34, 700); ctx.letterSpacing = '-1px'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('Moustakim', x0 + 76, y + 2); ctx.restore(); }
export function draw(ctx, t, { W, H }) {
  let i = SEG.findIndex(s => t >= s.a && t < s.b); if (i < 0) i = SEG.length - 1; const s = SEG[i], prev = SEG[i - 1], u = pr(t, s.a, s.a + .45);
  if (prev && prev.bg !== s.bg && u < 1) { BG[prev.bg](ctx, W, H); ctx.save(); ctx.globalAlpha = eIO(u); BG[s.bg](ctx, W, H); ctx.restore(); } else BG[s.bg](ctx, W, H);
  const lt = t - s.a, ex = s.id === 'cta' ? 0 : pr(t, s.b - .45, s.b);
  ctx.save(); const push = 1 + .01 * lt; ctx.translate(W / 2, H / 2); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2); SC[s.id](ctx, lt, { W, H, ex }); ctx.restore(); header(ctx, t, W);
}
