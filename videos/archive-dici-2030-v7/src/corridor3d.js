// Couloir de dashboards en profondeur (Three.js) : le dashboard principal recule, 5 autres défilent dans la profondeur.
import * as THREE from '/node_modules/three/build/three.module.js';
import { dashSource } from './dashart.js';
let R, sc, cam, glc; const planes = [];
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, u) => a + (b - a) * u;
export async function initCorridor(W, H) {
  glc = document.createElement('canvas'); glc.width = W; glc.height = H;
  R = new THREE.WebGLRenderer({ canvas: glc, alpha: true, antialias: true, preserveDrawingBuffer: true }); R.setSize(W, H, false); R.setClearColor(0, 0); R.outputColorSpace = THREE.SRGBColorSpace;
  sc = new THREE.Scene(); cam = new THREE.PerspectiveCamera(32, W / H, .1, 300);
  for (let v = 0; v < 6; v++) { const img = await dashSource(v), c = document.createElement('canvas'); c.width = img.width + 80; c.height = img.height + 80; const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.beginPath(); x.roundRect(0, 0, c.width, c.height, 44); x.fill(); x.save(); x.beginPath(); x.roundRect(40, 40, img.width, img.height, 22); x.clip(); x.drawImage(img, 40, 40, img.width, img.height); x.restore();
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(c.width / 100, c.height / 100), new THREE.MeshBasicMaterial({ map: tex, transparent: true })); sc.add(m); planes.push(m); }
}
// u : recul du 1er dashboard (0→1) · cz/cx/cy : position caméra
export function renderCorridor({ u, cz, cx = 0, cy = 0 }) {
  planes.forEach((m, i) => { if (i === 0) { const s = lerp(1, .52, u); m.scale.set(s, s, 1); m.position.set(lerp(0, -4.9, u), lerp(0, .3, u), 0); m.rotation.y = lerp(0, .42, u); m.material.opacity = 1; return; }
    const side = i % 2 ? 1 : -1, z = -6.5 * i, d = cz - z; m.scale.set(.52, .52, 1); m.position.set(side * 4.9, ((i % 3) - 1) * .45, z); m.rotation.y = -side * .42;
    m.material.opacity = cl(1 - (d - 22) / 34) * cl((u - .35) / .5) * cl(d / 3); m.visible = m.material.opacity > .002; });
  cam.position.set(cx, cy, cz); cam.lookAt(cx * .2, cy * .2, cz - 20); R.render(sc, cam); return glc;
}
