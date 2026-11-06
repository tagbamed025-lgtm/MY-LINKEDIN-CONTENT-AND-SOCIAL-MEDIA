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
  { id: 'msg', a: 0, b: 5.2, bg: 'perle' }, { id: 'logo', a: 5.2, b: 9.2, bg: 'perle' }, { id: 'err', a: 9.2, b: 12.4, bg: 'bleu' },
  { id: 'q1', a: 12.4, b: 16.2, bg: 'blanc' }, { id: 'q2', a: 16.2, b: 19.4, bg: 'blanc' }, { id: 'idea', a: 19.4, b: 24.4, bg: 'sable' },
  { id: 'story', a: 24.4, b: 38.4, bg: 'blanc' }, { id: 'kpi', a: 38.4, b: 43.6, bg: 'perle' }, { id: 'cta', a: 43.6, b: 52, bg: 'blanc' },
];
const BG = { perle: bgPerle, blanc: (c, w, h) => bgBlanc(c, w, h, true), bleu: bgBleu, sable: bgSable };
let M; // contexte de mesure
const STORY = [
  { icon: 'user', t: 1.2, toks: [['En', 0], ['tant', 0], ['que', 0], ['DG', 1]] },
  { icon: 'pin', t: 4.2, toks: [['Je', 0], ['veux', 0], ['savoir', 0], ['quelles', 1], ['zones', 1], ['du', 1], ['projet', 1], ['agricole', 1], ['sont', 1], ['en', 1], ['retard', 1]] },
  { icon: 'team', t: 8.8, toks: [['Pour', 0], ['décider', 0], ['où', 1], ['envoyer', 1], ["l'équipe", 1], ['de', 1], ['terrain', 1], ['avant', 0], ['la', 0], ['fin', 0], ['du', 0], ['mois', 0]] },
];
const ICON = {
  user: ['M12 8m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', 'M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7'],
  pin: ['M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z', 'M12 10m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0'],
  team: ['M9 8m-3.2 0a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0 -6.4 0', 'M3 20c0-3.6 2.7-5.6 6-5.6s6 2 6 5.6', 'M17 9m-2.6 0a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0', 'M17 14.6c2.6.2 4.4 1.9 4.4 5'],
  bar: ['M5 20V10M12 20V4M19 20v-7'], clock: ['M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M12 7v5l3 2'],
};
const BUB = [
  { side: 'in', text: 'Hello Mo,', typ: .45, t: 1.05 },
  { side: 'out', text: 'Bonjour !', typ: 1.95, t: 2.55 },
  { side: 'in', text: 'Peux-tu me faire un dashboard pour lundi ?', typ: 3.15, t: 3.8 },
];
const BF = SANS(46, 500);

export async function init() {
  for (const w of [400, 500, 700, 800]) document.fonts.add(await new FontFace('Inter Tight', `url(/assets/fonts/InterTight/inter-tight-latin-${w}-normal.woff2)`, { weight: String(w) }).load());
  document.fonts.add(await new FontFace('Instrument Serif', 'url(/assets/fonts/InstrumentSerif/instrument-serif-latin-400-italic.woff2)', { style: 'italic' }).load());
  document.fonts.add(await new FontFace('Geist Mono', 'url(/assets/fonts/GeistMono/geist-mono-latin-400-normal.woff2)').load());
  M = document.createElement('canvas').getContext('2d');
  // bulles : lignes et tailles finales
  M.font = BF;
  for (const b of BUB) {
    const words = b.text.split(' '), lines = []; let cur = '';
    for (const w of words) { const test = cur ? cur + ' ' + w : w; if (cur && M.measureText(test).width > 470) { lines.push(cur); cur = w; } else cur = test; }
    lines.push(cur); b.lines = lines.map(l => ({ l, words: l.split(' ') }));
    b.w = Math.max(...lines.map(l => M.measureText(l).width)) + 72; b.h = lines.length * 58 + 44;
  }
  // story : lignes
  const fw = bold => bold ? SANS(52, 800) : SANS(52, 500), maxW = 600; const sp = (M.font = SANS(52, 500), M.measureText(' ').width);
  for (const r of STORY) {
    const lines = []; let cur = [], cw = 0;
    r.toks.forEach(([w, b], i) => { M.font = fw(b); const ww = M.measureText(w).width; if (cur.length && cw + sp + ww > maxW) { lines.push(cur); cur = []; cw = 0; } cur.push({ w, b, ww, i }); cw += (cur.length > 1 ? sp : 0) + ww; });
    lines.push(cur); r.lines = lines; r.h = Math.max(110, lines.length * 66);
  }
}

function lineWords(ctx, parts, { cx, cy, t, size, color = INK, ex = 0, to = color }) { // une seule ligne, mots qui arrivent un à un
  ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = `${-.025 * size}px`;
  const fnt = p => p.k === 'serif' ? SERIF(size * 1.18) : p.k === 'bold' ? SANS(size, 800) : SANS(size, 500);
  ctx.font = SANS(size, 500); const sp = ctx.measureText(' ').width; const ws = parts.map(p => (ctx.font = fnt(p), ctx.measureText(p.w).width));
  const total = ws.reduce((a, b) => a + b, 0) + sp * (parts.length - 1); let x = cx - total / 2;
  parts.forEach((p, i) => {
    const u = pr(t, p.t, p.t + .7), e = eOut(u);
    if (u > 0) { ctx.save(); ctx.globalAlpha = cl(u * 3) * (1 - eIO(ex)); const bl = (1 - e) * 12 + eIO(ex) * 14; if (bl > .3) ctx.filter = `blur(${bl}px)`;
      ctx.translate(x + ws[i] / 2, cy + (1 - e) * size * .38 - eIO(ex) * 24); const sc = lerp(.95, 1, e) * (1 + .06 * eIO(ex)); ctx.scale(sc, sc);
      ctx.font = fnt(p); ctx.textAlign = 'center'; ctx.fillStyle = mixc(GREY.length === 7 ? GREY : '#A8A8AA', p.c || to, eOut(pr(t, p.t + .15, p.t + .75))); ctx.fillText(p.w, 0, 0); ctx.restore(); }
    x += ws[i] + sp;
  });
  ctx.restore();
}
const wrap = (ctx, W, H, ex, fn) => { const e = eIO(ex); ctx.save(); ctx.globalAlpha = 1 - e; ctx.translate(W / 2, H / 2); const s = 1 + .08 * e; ctx.scale(s, s); ctx.translate(-W / 2, -H / 2); if (e > 0) ctx.filter = `blur(${14 * e}px)`; fn(); ctx.restore(); };
const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
function icon(ctx, name, x, y, s, color, lw = 2) { ctx.save(); ctx.translate(x - 12 * s, y - 12 * s); ctx.scale(s, s); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (const d of ICON[name]) ctx.stroke(new Path2D(d)); ctx.restore(); }
function tile(ctx, { x, y, s, t, t0, drop = false, glow = false, inner }) { // tuile blanche arrondie, tombe et rebondit ou zoome
  const u = pr(t, t0, t0 + (drop ? .75 : .6)); if (u <= 0) return; let dy = 0, sc = 1;
  if (drop) { dy = lerp(-420, 0, bounce(u)); } else { sc = lerp(.6, 1, eBack(u)); dy = (1 - eOut(u)) * 60; }
  ctx.save(); ctx.globalAlpha = cl(u * 4); ctx.translate(x, y + dy); ctx.scale(sc, sc);
  ctx.save(); ctx.shadowColor = glow ? 'rgba(8,30,100,.55)' : 'rgba(43,38,34,.32)'; ctx.shadowBlur = 70; ctx.shadowOffsetY = 36; ctx.fillStyle = '#fff'; rr(ctx, -s / 2, -s / 2, s, s, s * .26); ctx.fill(); ctx.restore();
  if (inner) inner(ctx); ctx.restore();
}

// ---------------- scènes ----------------
const SC = {};
SC.msg = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  const gap = 24, dots = (c, x, y, tt, col) => { for (let i = 0; i < 3; i++) { c.fillStyle = col; c.beginPath(); c.arc(x + i * 34, y + Math.sin(tt * 7 - i * .9) * 6, 9, 0, 7); c.fill(); } };
  const st = BUB.map((b, i) => { const vis = eOut(pr(t, b.typ, b.typ + .4)); const m = eOut(pr(t, b.t, b.t + .3)); return { b, vis, w: lerp(150, b.w, m), h: lerp(96, b.h, m), m }; });
  let total = 0; st.forEach(s => total += (s.h + gap) * s.vis); total -= gap; let y = H * .5 - total / 2;
  st.forEach((s, i) => {
    const b = s.b; if (s.vis <= 0) return; const left = b.side === 'in' ? 185 : W - 150 - s.w, nxt = BUB[i + 1] ? eOut(pr(t, BUB[i + 1].typ, BUB[i + 1].typ + .4)) : 0;
    const dim = 1 - .45 * nxt, by = y; y += (s.h + gap) * s.vis;
    ctx.save(); ctx.globalAlpha = s.vis * dim; const sc = lerp(.82, 1, s.vis); const ox = b.side === 'in' ? left : left + s.w; ctx.translate(ox, by + s.h); ctx.scale(sc, sc); ctx.translate(-ox, -(by + s.h));
    if (s.vis < .98) ctx.filter = `blur(${(1 - s.vis) * 10}px)`;
    ctx.fillStyle = b.side === 'in' ? '#E9E9EB' : BLUE; rr(ctx, left, by, s.w, s.h, 40); ctx.fill();
    if (s.m < .6) dots(ctx, left + s.w / 2 - 34, by + s.h / 2, t, b.side === 'in' ? GREY : 'rgba(255,255,255,.8)');
    else { ctx.font = BF; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '-1px'; let wi = 0; const sp = ctx.measureText(' ').width;
      b.lines.forEach((L, li) => { let x = left + 36; L.words.forEach(w => { const ww = ctx.measureText(w).width, u = pr(t, b.t + .05 + wi * .12, b.t + .05 + wi * .12 + .45); wi++;
        ctx.save(); ctx.globalAlpha *= cl(u * 3); ctx.fillStyle = b.side === 'in' ? mixc('#A8A8AA', INK, eOut(u)) : mixc('#9DB8F8', '#ffffff', eOut(u)); ctx.fillText(w, x, by + 22 + 46 + li * 58 - 12 + (1 - eOut(u)) * 14); ctx.restore(); x += ww + sp; }); }); }
    ctx.restore();
    // avatar du DG sur la dernière bulle entrante
    if (b.side === 'in') { const last = i === 2, a = last ? eOut(pr(t, b.typ, b.typ + .4)) : 1 - eOut(pr(t, BUB[2].typ - .1, BUB[2].typ + .3));
      if (a > 0) { ctx.save(); ctx.globalAlpha = a * s.vis * dim; ctx.translate(122, by + s.h - 38); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 38, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = SANS(28, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('DG', 0, 2); ctx.restore(); } }
  });
});
SC.logo = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  badge(ctx, { x: W / 2, y: H * .43, r: 175, t, t0: .3, draw: (c, r) => { c.fillStyle = TAUPE; c.font = MONO(30); c.textAlign = 'center'; c.fillText('LOGO', 0, -6); c.fillText('POWER BI', 0, 34); } });
  lineWords(ctx, [{ w: 'Tu', t: 1.0 }, { w: 'ouvres', t: 1.15 }, { w: 'Power', t: 1.4, k: 'bold' }, { w: 'BI.', t: 1.55, k: 'bold' }], { cx: W / 2, cy: H * .61, t, size: 62 });
});
SC.err = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  tile(ctx, { x: W / 2, y: H * .38, s: 300, t, t0: .25, drop: true, glow: true, inner: c => { c.strokeStyle = BLUE; c.lineWidth = 26; c.lineCap = 'round'; c.beginPath(); c.moveTo(-62, -62); c.lineTo(62, 62); c.moveTo(62, -62); c.lineTo(-62, 62); c.stroke(); } });
  lineWords(ctx, [{ w: "C'est", t: 1.0 }, { w: 'la', t: 1.12 }, { w: 'première', t: 1.25 }, { w: 'erreur.', t: 1.45, k: 'serif' }], { cx: W / 2, cy: H * .61, t, size: 62, color: '#FFFFFF' });
});
SC.q1 = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  lineWords(ctx, [{ w: "Qu'est-ce", t: .3 }, { w: "qu'il", t: .5 }, { w: 'veut', t: .7 }, { w: 'décider', t: .95, k: 'serif', c: BLUE }, { w: '?', t: 1.1 }], { cx: W / 2, cy: H * .48, t, size: 58 });
});
SC.q2 = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  const fy = Math.sin(t * 2.2) * 8;
  tile(ctx, { x: W / 2, y: H * .38 + fy, s: 270, t, t0: .2, inner: c => { c.fillStyle = BLUE; c.font = SERIF(210); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 0, 18); } });
  lineWords(ctx, [{ w: 'décider', t: .7, k: 'serif', c: BLUE }], { cx: W / 2, cy: H * .61, t, size: 74 });
});
SC.idea = (ctx, t, { W, H, ex }) => wrap(ctx, W, H, ex, () => {
  const pill = (txt, y, u0, fs, fill, col, sc = 1, strike = 0) => { const u = pr(t, u0, u0 + .7), e = eOut(u); if (u <= 0) return; ctx.save(); ctx.globalAlpha = cl(u * 3); if (e < .99) ctx.filter = `blur(${(1 - e) * 16}px)`;
    ctx.font = SANS(fs, 700); ctx.letterSpacing = `${-.03 * fs}px`; const tw = ctx.measureText(txt).width, w = tw + fs * 1.5, h = fs * 1.75; ctx.translate(W / 2, y + (1 - e) * 50); const s = lerp(.8, 1, e) * sc; ctx.scale(s, s);
    ctx.save(); ctx.shadowColor = fill === '#fff' ? 'rgba(43,38,34,.22)' : 'rgba(34,96,245,.5)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 22; ctx.fillStyle = fill; rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.restore();
    ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4);
    if (strike > 0) { ctx.strokeStyle = TAUPE; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-tw / 2, 6); ctx.lineTo(-tw / 2 + tw * strike, 6); ctx.stroke(); } ctx.restore(); };
  const sk = eOut(pr(t, 1.6, 2.0)), grow = eOut(pr(t, 1.9, 2.5)), cf = pr(t, 1.9, 2.4);
  pill('Montrer', H * .26, .3, 64, '#fff', mixc('#6F6962', '#A8A8AA', sk), 1 - .06 * sk, sk);
  pill('Décider', H * .375, .95, 78, mixc('#ffffff', '#2260F5', cf), mixc('#2B2622', '#ffffff', cf), 1 + .16 * grow);
  lineWords(ctx, [{ w: 'Un', t: 2.5 }, { w: 'dashboard', t: 2.65 }, { w: 'sert', t: 2.8 }, { w: 'à', t: 2.9 }, { w: 'décider.', t: 3.05, k: 'serif', c: INK }], { cx: W / 2, cy: H * .61, t, size: 58 });
});
SC.story = (ctx, t, { W, H, ex }) => {
  const pad = 56, iw = 110, gx = 36, rg = 46, headH = 70; const vs = STORY.map(r => eOut(pr(t, r.t - .4, r.t + .3))); let ch = pad + headH; STORY.forEach((r, i) => ch += (r.h + rg) * vs[i]); ch += pad - rg;
  card(ctx, { x: W / 2, y: H * .385, w: 920, h: ch, t, t0: .2, ex, r: 52, draw: (c, w, h) => {
    c.save(); c.font = MONO(26); c.letterSpacing = '2px'; c.fillStyle = TAUPE; c.textBaseline = 'alphabetic'; c.fillText('USER STORY · EXEMPLE FICTIF', pad, pad + 28); c.restore();
    let y = pad + headH;
    STORY.forEach(r => { const u = pr(t, r.t, r.t + .5), e = eBack(u); const cyc = y + r.h / 2;
      if (u > 0) { c.save(); c.globalAlpha = cl(u * 3); c.translate(pad + iw / 2, cyc); c.scale(lerp(.4, 1, e), lerp(.4, 1, e)); c.fillStyle = '#EAF0FE'; c.beginPath(); c.arc(0, 0, 48, 0, 7); c.fill(); icon(c, r.icon, 0, 0, 2.2, BLUE, 2.1); c.restore(); }
      let ly = cyc - (r.lines.length * 66) / 2; c.textBaseline = 'alphabetic'; c.letterSpacing = '-1.5px';
      r.lines.forEach(L => { let x = pad + iw + gx; L.forEach(o => { const wu = pr(t, r.t + .25 + o.i * .16, r.t + .25 + o.i * .16 + .5); if (wu > 0) { c.save(); c.globalAlpha = cl(wu * 3); c.font = o.b ? SANS(52, 800) : SANS(52, 500);
        const col = o.b ? BLUE : INK; c.fillStyle = mixc('#A8A8AA', col, eOut(wu)); c.fillText(o.w, x, ly + 50 + (1 - eOut(wu)) * 16); c.restore(); } c.font = o.b ? SANS(52, 800) : SANS(52, 500); x += o.ww + c.measureText(' ').width; }); ly += 66; });
      y += (r.h + rg) * vs[STORY.indexOf(r)]; });
  } });
};
SC.kpi = (ctx, t, { W, H, ex }) => {
  const K = [['bar', 'Avancement par zone', .3], ['clock', 'Jours de retard', .8], ['team', 'Équipes disponibles', 1.3]];
  K.forEach(([ic, lab, t0], i) => card(ctx, { x: W / 2, y: H * (.215 + i * .1), w: 800, h: 150, t, t0, ex, r: 40, draw: (c, w, h) => {
    c.fillStyle = '#EAF0FE'; rr(c, 44, h / 2 - 42, 84, 84, 24); c.fill(); icon(c, ic, 86, h / 2, 2.2, BLUE, 2.2);
    c.fillStyle = INK; c.font = SANS(48, 600); c.letterSpacing = '-1.2px'; c.textBaseline = 'middle'; c.fillText(lab, 164, h / 2 + 3); } }));
  wrap(ctx, W, H, ex, () => lineWords(ctx, [{ w: 'Là,', t: 2.3 }, { w: 'tu', t: 2.42 }, { w: 'sais', t: 2.55 }, { w: 'quoi', t: 2.75, k: 'bold' }, { w: 'mesurer.', t: 2.9, k: 'bold' }], { cx: W / 2, cy: H * .61, t, size: 62 }));
};
SC.cta = (ctx, t, { W, H }) => {
  badge(ctx, { x: W / 2, y: H * .3, r: 200, t, t0: .2, draw: (c, r) => { c.fillStyle = TAUPE; c.font = MONO(32); c.textAlign = 'center'; c.fillText('PHOTO', 0, -6); c.fillText('DE MO', 0, 36); } });
  lineWords(ctx, [{ w: 'Moustakim', t: .8, k: 'bold' }], { cx: W / 2, cy: H * .455, t, size: 62 });
  { const u = pr(t, 1.1, 1.8); if (u > 0) { ctx.save(); ctx.globalAlpha = cl(u * 2); ctx.fillStyle = TAUPE; ctx.font = MONO(26); ctx.letterSpacing = '3px'; ctx.textAlign = 'center'; ctx.fillText("L'ACCRO À L'IA", W / 2, H * .487); ctx.restore(); } }
  lineWords(ctx, [{ w: 'Pas', t: 1.6, k: 'bold' }, { w: 'de', t: 1.72, k: 'bold' }, { w: 'question,', t: 1.85, k: 'bold' }], { cx: W / 2, cy: H * .6, t, size: 76 });
  lineWords(ctx, [{ w: 'pas', t: 2.15, k: 'bold' }, { w: 'de', t: 2.27, k: 'bold' }, { w: 'dashboard.', t: 2.4, k: 'bold' }], { cx: W / 2, cy: H * .64, t, size: 76 });
  lineWords(ctx, [{ w: 'Ta', t: 4.0 }, { w: 'demande', t: 4.12 }, { w: 'la', t: 4.25 }, { w: 'plus', t: 4.35 }, { w: 'floue', t: 4.48 }, { w: '?', t: 4.6 }], { cx: W / 2, cy: H * .735, t, size: 46, color: TAUPE });
};

export function draw(ctx, t, { W, H }) {
  let i = SEG.findIndex(s => t >= s.a && t < s.b); if (i < 0) i = SEG.length - 1; const s = SEG[i], prev = SEG[i - 1], u = pr(t, s.a, s.a + .45);
  if (prev && prev.bg !== s.bg && u < 1) { BG[prev.bg](ctx, W, H); ctx.save(); ctx.globalAlpha = eIO(u); BG[s.bg](ctx, W, H); ctx.restore(); } else BG[s.bg](ctx, W, H);
  const lt = t - s.a, ex = s.id === 'cta' ? 0 : pr(t, s.b - .45, s.b);
  ctx.save(); const push = 1 + .01 * lt; ctx.translate(W / 2, H / 2); ctx.scale(push, push); ctx.translate(-W / 2, -H / 2); SC[s.id](ctx, lt, { W, H, ex }); ctx.restore();
}
