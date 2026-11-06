// Dashboard sur un plan 3D (style référence : inclinaison, glissement caméra, remise à plat) — Three.js.
import * as THREE from '/node_modules/three/build/three.module.js';
let renderer, scene, camera, group, plane, glc, IW = 1680, IH = 936;
export async function initDash(W, H, src) {
  glc = document.createElement('canvas'); glc.width = W; glc.height = H;
  renderer = new THREE.WebGLRenderer({ canvas: glc, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(W, H, false); renderer.setClearColor(0, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(32, W / H, .1, 200); group = new THREE.Group(); scene.add(group);
  let img = src; if (typeof src === 'string') { img = new Image(); img.src = src; await img.decode(); } IW = img.width; IH = img.height;
  // rounded white frame + screenshot
  const c = document.createElement('canvas'); c.width = IW + 80; c.height = IH + 80; const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.beginPath(); x.roundRect(0, 0, c.width, c.height, 44); x.fill();
  x.save(); x.beginPath(); x.roundRect(40, 40, IW, IH, 22); x.clip(); x.drawImage(img, 40, 40); x.restore();
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 16;
  plane = new THREE.Mesh(new THREE.PlaneGeometry(c.width / 100, c.height / 100), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  group.add(plane);
}
// p: { rx, ry, rz, fx, fy (focus point in image px), dist, ox (screen shift units) }
export function renderDash(p) {
  group.rotation.set(p.rx || 0, p.ry || 0, p.rz || 0);
  plane.position.set(-((p.fx ?? IW / 2) + 40 - (IW + 80) / 2) / 100, ((p.fy ?? IH / 2) + 40 - (IH + 80) / 2) / 100, 0);
  group.position.x = p.ox || 0;
  camera.position.set(0, 0, p.dist); camera.lookAt(0, 0, 0); renderer.render(scene, camera); return glc;
}
