import { C, SANS, SERIF, cl, pr, lerp, eOut, eIO, bgPerle, bgBlanc, bgBleu, wordStream, card, badge, dashedLine, swoosh, pill, blurOut } from '../kit/moustakim_kit.js';
import { drawDash } from '../dashart.js';
const FF = (n, f, st = 'normal', w = '400') => new FontFace(n, `url(/assets/fonts/${f})`, { style: st, weight: w });
export async function init() { for (const w of [400, 500, 700, 800]) document.fonts.add(await FF('Inter Tight', `InterTight/inter-tight-latin-${w}-normal.woff2`, 'normal', String(w)).load());
  document.fonts.add(await FF('Instrument Serif', 'InstrumentSerif/instrument-serif-latin-400-italic.woff2', 'italic').load()); }
const T1 = [{ w: 'Un', t: .2 }, { w: 'dashboard', t: .45, em: true }, { w: 'qui', t: .75 }, { w: 'prenait', t: 1.0 }, { w: 'deux', t: 1.3 }, { w: 'semaines', t: 1.6, em: 'blue', big: 1.35 }, { w: 'de', t: 2.0 }, { w: 'travail…', t: 2.25 }];
const T2 = [{ w: 'se', t: .2 }, { w: 'construit', t: .45, em: true }, { w: 'en', t: .8 }, { w: 'une', t: 1.05 }, { w: 'journée', t: 1.3, serif: true, big: 1.15 }];
const T3 = [{ w: 'avec', t: .2 }, { w: "l'IA", t: .5, em: 'blue', big: 1.3 }, { w: 'comme', t: 1.0 }, { w: 'copilote', t: 1.3, em: true }];
export function draw(ctx, t, { W, H }) {
  if (t < 4.6) { bgPerle(ctx, W, H); blurOut(ctx, pr(t, 3.9, 4.5), () => wordStream(ctx, T1, { cx: W / 2, cy: H / 2, t, W, size: 96 })); return; }
  const a = t - 4.6;
  if (a < 4.4) { bgPerle(ctx, W, H); const ex = pr(a, 3.7, 4.3);
    card(ctx, { x: W / 2, y: H * .38, w: 1160, h: 650, t: a, t0: .1, ex, draw: (c, w, h) => drawDash(c, w, h, 0) });
    wordStream(ctx, T2, { cx: W / 2, cy: H * .83, t: a, W, size: 84, ex }); swoosh(ctx, { x: W * .66, y: H * .88, w: 300, t: a, t0: 1.9, color: C.BLUE }); return; }
  const b = a - 4.4; bgBlanc(ctx, W, H);
  const labels = ['Power BI', 'Excel', 'Python', 'Claude'], xs = [-480, -160, 160, 480], ex = pr(b, 3.0, 3.6);
  [0, 1, 2].forEach(i => dashedLine(ctx, { x1: W / 2 + xs[i] + 95, y1: H * .36, x2: W / 2 + xs[i + 1] - 95, y2: H * .36, t: b, t0: .9 + i * .25, ex }));
  xs.forEach((dx, i) => badge(ctx, { x: W / 2 + dx, y: H * .36, t: b, t0: .2 + i * .18, ex, draw: (c, r) => { c.fillStyle = i === 3 ? C.CORAL : C.INK; c.font = SANS(r * .62, 800); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(labels[i][0], 0, 4); } }));
  wordStream(ctx, T3, { cx: W / 2, cy: H * .7, t: b, W, size: 84, ex }); pill(ctx, { cx: W / 2, cy: H * .88, text: 'ton expertise × IA', t: b, t0: 2.0, ex });
}
