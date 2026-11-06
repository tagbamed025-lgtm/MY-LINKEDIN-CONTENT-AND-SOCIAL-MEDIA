// Test 2 s : « selon le Forum » (arrive du haut) → « économique mondial » (arrive du bas, en bleu) pendant que le 1er disparaît.
const INK = '#2B2D33', BLUE = '#3D5AFE', SANS = (s, w = 700) => `${w} ${s}px "Inter Display", Inter, sans-serif`;
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), pr = (t, a, b) => cl((t - a) / (b - a)), lerp = (a, b, u) => a + (b - a) * u;
const eOut = u => 1 - Math.pow(1 - u, 5), eIO = u => u < .5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2;
function clear(ctx, W, H) { const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.55, '#F7F9FF'); g.addColorStop(1, '#F6F3FB'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
// mot par mot ; dir = -1 : arrive du haut · +1 : arrive du bas ; ex : progression de sortie (0..1, monte et floute)
function line(ctx, list, cx, y, t, t0, { font, color, dir, ex = 0, stagger = .1 }) {
  ctx.font = font; const sp = ctx.measureText(' ').width, ws = list.map(w => ctx.measureText(w).width); let x = cx - (ws.reduce((a, b) => a + b, 0) + sp * (list.length - 1)) / 2;
  list.forEach((w, i) => { const u = pr(t, t0 + i * stagger, t0 + i * stagger + .8), e = eOut(u), a = cl(u * 2.2) * (1 - ex);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; const b = (1 - e) * 20 + ex * 16; if (b > .3) ctx.filter = `blur(${b}px)`; ctx.font = font; ctx.textBaseline = 'middle'; ctx.fillStyle = color;
      ctx.translate(x + ws[i] / 2, y + dir * (1 - e) * 60 - ex * 40); const sc = lerp(.96, 1, e); ctx.scale(sc, sc); ctx.fillText(w, -ws[i] / 2, 0); ctx.restore(); }
    x += ws[i] + sp; }); }
export async function init() {}
export function draw(ctx, t, { W, H }) {
  clear(ctx, W, H); const f = SANS(70, 700), ex = eIO(pr(t, .95, 1.4));
  line(ctx, ['selon', 'le', 'Forum'], W / 2, H / 2, t, .1, { font: f, color: INK, dir: -1, ex });
  line(ctx, ['économique', 'mondial'], W / 2, H / 2, t, 1.25, { font: f, color: BLUE, dir: 1 });
  const w = 1 - eOut(pr(t, 0, .35)); if (w > 0) { ctx.fillStyle = `rgba(255,255,255,${w})`; ctx.fillRect(0, 0, W, H); }
}
