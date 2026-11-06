// MOUSTAKIM KIT — style signature (canvas 2D). Ordre de grandeur : tout est calibré pour 1920×1080 ; pour 1080×1920 passer S = W/1080.
// Source du style : analyse image par image (10–20 fps) de 5 vidéos de référence (voir references/01-mouvements.md)
export const C = { INK: '#232323', INK2: '#2B2622', GREY: '#A8A8AA', TAUPE: '#6F6962', BLUE: '#2260F5', CORAL: '#D9482B', PERLE: '#F2F2F2', SABLE: '#E9E2D4', BLANC: '#FFFFFF' };
export const SANS = (s, w = 500) => `${w} ${s}px "Inter Tight","Inter Display",Inter,sans-serif`;
export const SERIF = s => `italic 400 ${s}px "Instrument Serif",serif`;
export const MONO = s => `400 ${s}px "Geist Mono",monospace`;
export const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), pr = (t, a, b) => cl((t - a) / (b - a)), lerp = (a, b, u) => a + (b - a) * u;
export const eOut = u => 1 - Math.pow(1 - u, 5), eIO = u => u < .5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2;
export const eBack = u => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
const mix = (a, b, u) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], u))).join(',')})`; };

// ---------- 5 fonds ----------
export function bgPerle(ctx, W, H) { // gris perle #F2F2F2 + lueur centrale + voile de points sur les bords
  ctx.fillStyle = C.PERLE; ctx.fillRect(0, 0, W, H); const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.hypot(W, H) / 2);
  g.addColorStop(0, '#F7F7F7'); g.addColorStop(.55, '#F2F2F2'); g.addColorStop(1, '#E4E4E4'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.fillStyle = 'rgba(43,38,34,.13)'; const st = 6; for (let y = 0; y < H; y += st) for (let x = (y / st % 2) * st / 2; x < W; x += st) { const d = Math.hypot((x - W / 2) / (W / 2), (y - H / 2) / (H / 2)); if (d > .78) { ctx.globalAlpha = cl((d - .78) * 2.2); ctx.fillRect(x, y, 1.3, 1.3); } } ctx.restore(); }
export function bgBlanc(ctx, W, H, glow = true) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); if (glow) { const g = ctx.createRadialGradient(W / 2, H * 1.1, 0, W / 2, H * 1.1, W * .7); g.addColorStop(0, 'rgba(34,96,245,.16)'); g.addColorStop(1, 'rgba(34,96,245,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); } }
export function bgBleu(ctx, W, H) { ctx.fillStyle = C.BLUE; ctx.fillRect(0, 0, W, H); const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * .6); g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
export function bgSable(ctx, W, H) { const g = ctx.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, W * .7); g.addColorStop(0, '#F1ECE0'); g.addColorStop(.6, C.SABLE); g.addColorStop(1, '#DDD4C2'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }

// ---------- flux de mots (signature) ----------
// tokens: [{w:'dashboard', t:.3, em:true|'blue'|false, big:1.6, serif:true}] ; t = apparition (s) ; mots gris clair → encre ; mots forts passent en gras
export function wordStream(ctx, tokens, { cx, cy, t, W, size = 76, maxW, lh = 1.2, ink = C.INK, ex = 0, S = 1 }) {
  maxW = maxW || (W || ctx.canvas.width) * .78; const FS = tk => size * (tk.big || 1);
  const fin = tk => tk.serif ? SERIF(FS(tk) * 1.12) : SANS(FS(tk), tk.em ? 700 : 400), reg = tk => SANS(FS(tk), 400);
  ctx.save(); ctx.letterSpacing = `${-.03 * size}px`; const meas = tk => { ctx.font = fin(tk); return ctx.measureText(tk.w).width; }, sp = (ctx.font = SANS(size, 400), ctx.measureText(' ').width);
  const lines = []; let cur = [], cw = 0; tokens.forEach(tk => { const w = meas(tk); if (cur.length && cw + sp + w > maxW) { lines.push(cur); cur = []; cw = 0; } cur.push({ tk, w }); cw += (cur.length > 1 ? sp : 0) + w; }); if (cur.length) lines.push(cur);
  const lineH = L => size * lh * Math.max(1, ...L.map(o => o.tk.big || 1) .map(b => 1 + (b - 1) * .6)), t1 = L => L[0].tk.t;
  const vis = lines.map(L => eOut(pr(t, t1(L) - .05, t1(L) + .45))); const heights = lines.map(lineH); let totalH = 0; heights.forEach((h, i) => totalH += h * vis[i]);
  let y = cy - totalH / 2; ctx.globalAlpha = 1 - ex; if (ex > 0) ctx.filter = `blur(${ex * 16}px)`;
  lines.forEach((L, li) => { const h = heights[li], base = y + h * vis[li] * .5 + size * .36; const lw = L.reduce((a, o, i) => a + o.w + (i ? sp : 0), 0); let x = cx - lw / 2;
    L.forEach(o => { const tk = o.tk, u = pr(t, tk.t, tk.t + .7), e = eOut(u), nxt = tokens[tokens.indexOf(tk) + 1], settle = Math.max(pr(t, tk.t + .3, tk.t + .8), nxt ? pr(t, nxt.t, nxt.t + .3) : 0);
      if (u > 0) { ctx.save(); ctx.globalAlpha *= cl(u * 3); ctx.translate(x + o.w / 2, base + (1 - e) * size * .38 - ex * 30 * S + (1 - settle) * size * .04); const sc = lerp(.94, 1, e); ctx.scale(sc, sc);
        const col = tk.em === 'blue' ? C.BLUE : ink, grey = C.GREY; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        if (tk.em && !tk.serif) { const k = eOut(settle), a0 = ctx.globalAlpha, fc = tk.em === 'blue' ? C.BLUE : ink;
          ctx.globalAlpha = a0 * (1 - k); ctx.font = reg(tk); ctx.fillStyle = grey; ctx.fillText(tk.w, 0, 0);
          ctx.globalAlpha = a0 * k; ctx.font = fin(tk); ctx.fillStyle = tk.em === 'blue' ? mix(C.GREY, C.BLUE, settle) : mix(grey, fc, settle); ctx.fillText(tk.w, 0, 0); ctx.globalAlpha = a0; }
        else { ctx.font = fin(tk); ctx.fillStyle = tk.serif ? mix(grey, C.BLUE, settle) : mix(grey, col, settle); ctx.fillText(tk.w, 0, 0); } ctx.restore(); }
      x += o.w + sp; }); y += h * vis[li]; });
  ctx.restore(); }

// ---------- carte (screenshot / dashboard / écran) ----------
// draw(ctx,w,h) dessine le contenu dans [0,w]×[0,h]. Entrée : zoom .62→1, montée 140px, flou 20→0, léger tilt ; sortie : 1→1.1, -50px, flou, fondu
export function card(ctx, { x, y, w, h, t, t0 = 0, ex = 0, draw, r = 30, dark = false, S = 1 }) {
  const u = eOut(pr(t, t0, t0 + .85)); if (u <= 0 || ex >= 1) return; const sc = lerp(.62, 1, u) * (1 + .1 * eIO(ex)), dy = (1 - u) * 140 * S - 50 * S * eIO(ex), a = cl(u * 2.4) * (1 - eIO(ex)), blur = (1 - u) * 20 + eIO(ex) * 14;
  ctx.save(); ctx.globalAlpha = a; if (blur > .3) ctx.filter = `blur(${blur}px)`; ctx.translate(x, y + dy); ctx.scale(sc, sc * (1 - (1 - u) * .08)); ctx.transform(1, 0, -(1 - u) * .10, 1, 0, 0);
  const rr = () => { ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, r); };
  ctx.save(); ctx.shadowColor = 'rgba(20,20,30,.30)'; ctx.shadowBlur = 90 * S; ctx.shadowOffsetY = 46 * S; ctx.shadowOffsetX = 18 * S; ctx.fillStyle = dark ? '#14161c' : '#fff'; rr(); ctx.fill(); ctx.restore();
  ctx.save(); ctx.shadowColor = 'rgba(20,20,30,.22)'; ctx.shadowBlur = 16 * S; ctx.shadowOffsetY = 8 * S; ctx.fillStyle = dark ? '#14161c' : '#fff'; rr(); ctx.fill(); ctx.restore();
  ctx.save(); rr(); ctx.clip(); ctx.translate(-w / 2, -h / 2); draw(ctx, w, h); ctx.restore();
  ctx.save(); rr(); ctx.lineWidth = 2; ctx.strokeStyle = dark ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.9)'; ctx.stroke(); ctx.restore(); ctx.restore(); }

// ---------- pastille ronde (logo) avec petite ombre ----------
export function badge(ctx, { x, y, r = 95, t, t0 = 0, ex = 0, draw, S = 1 }) {
  const u = pr(t, t0, t0 + .55); if (u <= 0 || ex >= 1) return; const s = lerp(.4, 1, eBack(u)), a = cl(u * 3) * (1 - eIO(ex));
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y - ex * 30 * S); ctx.scale(s, s); if (u < 1) ctx.filter = `blur(${(1 - u) * 8}px)`;
  ctx.save(); ctx.shadowColor = 'rgba(20,20,30,.24)'; ctx.shadowBlur = 44 * S; ctx.shadowOffsetY = 26 * S; ctx.shadowOffsetX = 8 * S; const g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#EFEFEF'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.restore();
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.beginPath(); ctx.arc(0, 0, r - 1, 0, 7); ctx.stroke(); if (draw) draw(ctx, r); ctx.restore(); }

// ---------- connecteur pointillé qui se dessine ----------
export function dashedLine(ctx, { x1, y1, x2, y2, t, t0 = 0, dur = .5, color = '#2B2622', ex = 0 }) {
  const u = eOut(pr(t, t0, t0 + dur)); if (u <= 0 || ex >= 1) return; ctx.save(); ctx.globalAlpha = 1 - eIO(ex); ctx.setLineDash([10, 9]); ctx.lineWidth = 3; ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, u), lerp(y1, y2, u)); ctx.stroke(); ctx.restore(); }

// ---------- trait d'accent courbe (swoosh) qui se dessine puis s'efface ----------
export function swoosh(ctx, { x, y, w, t, t0 = 0, color = C.INK, hold = .6 }) {
  const u = eOut(pr(t, t0, t0 + .5)), o = pr(t, t0 + .5 + hold, t0 + .5 + hold + .35); if (u <= 0 || o >= 1) return; ctx.save(); ctx.globalAlpha = 1 - o; ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.lineCap = 'round';
  const N = 40; ctx.beginPath(); for (let i = 0; i <= N * u; i++) { const k = i / N, px = x - w / 2 + w * k, py = y - Math.sin(Math.PI * k) * 10 + (1 - k) * 8; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore(); }

// ---------- étiquette noire qui glisse (révélée de gauche à droite) ----------
export function pill(ctx, { cx, cy, text, t, t0 = 0, size = 44, ex = 0 }) {
  const u = eOut(pr(t, t0, t0 + .5)); if (u <= 0 || ex >= 1) return; ctx.save(); ctx.font = SANS(size, 700); const tw = ctx.measureText(text).width, w = tw + size * 1.1, h = size * 1.5;
  ctx.globalAlpha = 1 - eIO(ex); ctx.shadowColor = 'rgba(20,20,30,.28)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12; ctx.beginPath(); ctx.rect(cx - w / 2, cy - h, w * u, h * 2); ctx.clip(); ctx.fillStyle = '#17171A'; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 10); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, cx, cy + 2); ctx.restore(); }

// ---------- transition entre scènes : le contenu se floute et se fond dans le fond (appliquer à tout le dessin de la scène) ----------
export function blurOut(ctx, u, drawScene) { const e = eIO(u); ctx.save(); ctx.globalAlpha = 1 - e; if (e > 0) ctx.filter = `blur(${e * 18}px)`; drawScene(); ctx.restore(); }
