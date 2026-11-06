// Scène 5 : page de nouveaux profils en perspective 3D (style référence pindown) — Three.js, rendu hors écran.
import * as THREE from '/node_modules/three/build/three.module.js';
const BLUE = '#3D5AFE', INK = '#1E2030', GREY = '#7A7E8C';
const FONT = (w, s) => `${w} ${s}px "Inter Display", Inter, sans-serif`;
let renderer, scene, camera, group, page, chips = [], glc;
const PW = 1400, PH = 4200, U = 100; // page px, px per world unit

const SECTIONS = [
  ['Data & IA', [['Spécialiste IA', 'IA'], ['Analyste big data', 'Data'], ['Data engineer', 'Data']]],
  ['Tech & sécurité', [['Ingénieur fintech', 'Fintech'], ['Expert cybersécurité', 'Sécurité'], ['Développeur logiciel', 'Tech']]],
  ['Transition verte', [['Ingénieur énergies renouvelables', 'Énergie'], ['Spécialiste véhicules autonomes', 'Mobilité'], ['Analyste climat', 'Climat']]],
  ['Humain & éducation', [['Infirmier', 'Soin'], ['Enseignant', 'Éducation'], ['Coach en compétences IA', 'IA']]]];
const HUES = [['#5B7CFF', '#9DB4FF'], ['#22B07D', '#7FE0B5'], ['#FF8A3D', '#FFC08A'], ['#B45CFF', '#DDB0FF'], ['#E5484D', '#FF9DA0'], ['#14A3C7', '#8EE0F2']];

function rr(x, X, Y, w, h, r) { x.beginPath(); x.roundRect(X, Y, w, h, r); }
function drawPage() {
  const c = document.createElement('canvas'); c.width = PW; c.height = PH; const x = c.getContext('2d');
  x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, PW, PH);
  // hero
  const g = x.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, '#CFE0FF'); g.addColorStop(1, '#5B8BFF');
  x.fillStyle = g; rr(x, 40, 40, PW - 80, 820, 48); x.fill();
  x.fillStyle = 'rgba(255,255,255,.95)'; rr(x, 90, 80, PW - 180, 70, 35); x.fill();
  x.fillStyle = INK; x.font = FONT(700, 30); x.textBaseline = 'middle'; x.fillText('Métiers 2030', 130, 115);
  x.fillStyle = INK; rr(x, PW - 300, 92, 170, 46, 23); x.fill(); x.fillStyle = '#fff'; x.font = FONT(700, 22); x.textAlign = 'center'; x.fillText('Explorer', PW - 215, 116);
  x.fillStyle = '#fff'; x.font = FONT(800, 112); x.fillText('170 millions', PW / 2, 400); x.font = FONT(700, 64); x.fillText('de nouveaux métiers.', PW / 2, 510);
  x.font = FONT(500, 30); x.fillStyle = 'rgba(255,255,255,.85)'; x.fillText('Source : WEF, Future of Jobs Report 2025', PW / 2, 600);
  x.textAlign = 'left';
  let y = 960;
  SECTIONS.forEach(([name, jobs], si) => {
    x.fillStyle = INK; x.font = FONT(800, 58); x.fillText(name, 70, y + 40);
    x.fillStyle = GREY; x.font = FONT(500, 26); x.fillText('Profils en forte croissance', 72, y + 100);
    y += 150;
    jobs.forEach(([title, tag], j) => {
      const cx = 60 + j * 440, cw = 400, chh = 520, [h1, h2] = HUES[(si * 3 + j) % HUES.length];
      const cg = x.createLinearGradient(0, y, 0, y + chh); cg.addColorStop(0, '#EEF3FF'); cg.addColorStop(1, '#F8FAFF');
      x.fillStyle = cg; rr(x, cx, y, cw, chh, 36); x.fill(); x.strokeStyle = 'rgba(61,90,254,.12)'; x.lineWidth = 3; x.stroke();
      // avatar
      const ag = x.createLinearGradient(cx + 120, y + 50, cx + 280, y + 210); ag.addColorStop(0, h1); ag.addColorStop(1, h2);
      x.fillStyle = ag; x.beginPath(); x.arc(cx + cw / 2, y + 150, 95, 0, 7); x.fill();
      x.fillStyle = 'rgba(255,255,255,.92)'; x.beginPath(); x.arc(cx + cw / 2, y + 125, 34, 0, 7); x.fill();
      x.beginPath(); x.ellipse(cx + cw / 2, y + 212, 58, 36, 0, Math.PI, 0); x.fill();
      x.fillStyle = INK; x.font = FONT(800, 34); x.textAlign = 'center';
      const words = title.split(' '); let l1 = '', l2 = '';
      words.forEach(w => { if (x.measureText(l1 + ' ' + w).width < 340 && !l2) l1 = (l1 + ' ' + w).trim(); else l2 = (l2 + ' ' + w).trim(); });
      x.fillText(l1, cx + cw / 2, y + 300); if (l2) x.fillText(l2, cx + cw / 2, y + 345);
      x.font = FONT(700, 24); const tw = x.measureText(tag).width + 44; x.fillStyle = h1; rr(x, cx + cw / 2 - tw / 2, y + 395, tw, 46, 23); x.fill();
      x.fillStyle = '#fff'; x.fillText(tag, cx + cw / 2, y + 419);
      x.fillStyle = '#E3E8F5'; rr(x, cx + 60, y + 465, cw - 120, 12, 6); x.fill();
      x.textAlign = 'left';
    });
    y += 640;
  });
  return c;
}
function chip(text, color) {
  const c = document.createElement('canvas'), x = c.getContext('2d'); x.font = FONT(800, 64); const w = x.measureText(text).width + 120;
  c.width = w + 60; c.height = 190; x.font = FONT(800, 64);
  x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = 30; x.shadowOffsetY = 14;
  const g = x.createLinearGradient(0, 0, 0, 130); g.addColorStop(0, color[1]); g.addColorStop(1, color[0]);
  x.fillStyle = g; rr(x, 30, 20, w, 130, 65); x.fill(); x.shadowColor = 'transparent';
  x.fillStyle = 'rgba(255,255,255,.35)'; rr(x, 50, 28, w - 40, 40, 20); x.fill();
  x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.textAlign = 'center'; x.fillText(text, 30 + w / 2, 88);
  return c;
}
export function initProfiles(W, H) {
  glc = document.createElement('canvas'); glc.width = W; glc.height = H;
  renderer = new THREE.WebGLRenderer({ canvas: glc, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(W, H, false); renderer.setClearColor(0xffffff, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(35, W / H, .1, 200);
  group = new THREE.Group(); scene.add(group);
  const tex = new THREE.CanvasTexture(drawPage()); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16;
  page = new THREE.Mesh(new THREE.PlaneGeometry(PW / U, PH / U), new THREE.MeshBasicMaterial({ map: tex })); group.add(page);
  // floating chips above the page (parallax): [text, hue, page x px, page y px, height]
  [['+ IA', 0, 260, 1250, 1.6], ['Data', 5, 1180, 1500, 2.2], ['Fintech', 1, 200, 1950, 1.4], ['Sécurité', 4, 1150, 2250, 2.0],
   ['Énergie', 2, 300, 2700, 1.8], ['Climat', 1, 1120, 3000, 1.3], ['Soin', 3, 260, 3450, 2.1], ['Éducation', 5, 1100, 3700, 1.5]].forEach(([s, h, px, py, z]) => {
    const cv = chip(s, HUES[h]), t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(cv.width / U * .75, cv.height / U * .75), new THREE.MeshBasicMaterial({ map: t, transparent: true }));
    m.position.set(px / U - PW / U / 2, PH / U / 2 - py / U, z); m.userData = { z, phase: px * .01 }; page.add(m); chips.push(m);
  });
}
// p: { cy (page y in px at centre), tilt (rad), dist, rotZ, lift (screen offset), t }
export function renderProfiles(p) {
  group.rotation.set(-p.tilt, 0, p.rotZ || 0); group.position.y = p.lift || 0;
  page.position.y = (p.cy - PH / 2) / U;
  chips.forEach(m => { m.position.z = m.userData.z * (p.chipK ?? 1) + Math.sin(p.t * 1.4 + m.userData.phase) * .12; m.rotation.x = p.tilt * .6; });
  camera.position.set(0, 0, p.dist); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
  renderer.render(scene, camera); return glc;
}
