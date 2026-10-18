import * as k from "../vendor/iso-kit.mjs";
import * as A from "../vendor/audit.mjs";

export function buildCabinet({ audit = false } = {}) {
  const P = k.fitProjection(k.boxCorners({ x: -70, y: -49, w: 140, d: 126, r: 0 }, -14, 155), 580, 420, { pad: 16, azimuth: 32, elevation: 28 });
  const R = A.recorder(P);
  const names = ["opinion", "behavior", "commitment"];
  const states = [{ label: "closed", shares: {} }];
  for (const name of names) {
    for (let i = 1; i <= 16; i++) states.push({ label: `${name}-${i}`, shares: { [name]: i / 16 } });
  }
  function box(name, x, y, z, w, d, h, { drawer, tone = "mid", inner = "", lit = false } = {}) {
    const plan = { x, y, w, d, r: 0 };
    const shape = R.solid(A.slab(plan, z, h, { name }));
    const svg = k.solidSvg(k.slabOf(plan, z, h, P, 1, 0.45), { tone, inner, lit });
    R.put({ name, piece: drawer || "frame", at: [x + w / 2, y + d / 2, z + h / 2], move: drawer ? [0, 26, 0] : undefined, svg, shapes: [shape], drawer });
  }
  const dots = (pts) => k.dotsSvg(pts.map(p => k.iso(p, P)), { size: 0.65, tone: "hi" });
  for (const x of [-62, 50]) for (const y of [-42, 30]) box(`stand.foot-${x}-${y}`, x, y, -14, 12, 12, 10, { tone: "lo" });
  box("frame.plinth", -70, -49, -4, 140, 98, 4, { tone: "hi" });
  box("frame.back", -65, -46, 0, 130, 4, 150, { tone: "lo" });
  box("frame.left", -65, -42, 0, 4, 88, 150, { tone: "mid" });
  const sidePanel = [[65,-30,14],[65,34,14],[65,34,136],[65,-30,136]].map(p=>k.iso(p,P));
  const sideSeam = `M${sidePanel.map(p=>p.join(",")).join("L")}Z`;
  box("frame.right", 61, -42, 0, 4, 88, 150, {
    tone: "hi",
    inner: k.lineSvg(sideSeam, { tone: "lo" }) + dots([[65,-26,18],[65,30,18],[65,-26,132],[65,30,132]])
  });
  box("frame.cap", -68, -49, 150, 136, 98, 5, {
    tone: "hi",
    inner: k.lineSvg(k.planOutline({ x: -62, y: -43, w: 124, d: 86, r: 1 }, 155, P), { tone: "lo" }) +
      dots([[-61,-42,155],[61,-42,155],[-61,42,155],[61,42,155]]) +
      k.faceTextSvg(k.topMatrix([-16, 22], 155, P), "EVIDENCE", { size: 5, tone: "mid" })
  });
  for (let i = 0; i < 3; i++) {
    const z = i * 49;
    const drawer = names[i];
    box(`frame.shelf-${i}`, -61, -42, z, 122, 88, 3, { tone: "lo" });
    for (const x of [-61, 58]) box(`frame.rail-${i}-${x}`, x, -38, z + 3, 3, 79, 3, { tone: "mid" });
    box(`${drawer}.floor`, -58, -41, z + 3, 116, 80, 2, { drawer, tone: "lo" });
    box(`${drawer}.back`, -58, -41, z + 5, 116, 3, 31, { drawer, tone: "lo" });
    for (const x of [-58, 55]) box(`${drawer}.side-${x}`, x, -38, z + 5, 3, 77, 31, { drawer, tone: "mid" });
    for (let p = 0; p < 3; p++) {
      const px = -47 + p * 1.2, py = -26 + p * 1.5, pz = z + 5 + p * 0.6;
      const rule = [0, 1, 2].map(r => k.lineSvg(k.lineOnTop([px+9,py+10+r*6],[px+67-r*9,py+10+r*6],pz+0.6,P), { tone: "lo", free: true })).join("");
      box(`${drawer}.paper-${p}`, px, py, pz, 94, 56, 0.6, { drawer, tone: "hi", inner: rule });
    }
    box(`${drawer}.front`, -58, 39, z + 3, 116, 4, 39, {
      drawer, tone: "hi",
      inner: dots([[-52,43,z+8],[52,43,z+8],[-52,43,z+36],[52,43,z+36]])
    });
    box(`${drawer}.label-frame`, -28, 43, z + 24, 56, 0.6, 10, { drawer, tone: "mid" });
    box(`${drawer}.label-insert`, -24, 43.6, z + 26, 48, 0.4, 6, { drawer, tone: "lo", lit: true });
    for (const x of [-18, 15]) box(`${drawer}.pull-mount-${x}`, x, 43, z + 11, 3, 5, 4, { drawer, tone: "hi" });
    box(`${drawer}.pull`, -18, 48, z + 11, 36, 3, 4, { drawer, tone: "hi" });
  }
  A.settle(R, P, { states, step: 2.5 });
  if (audit) {
    A.auditOrExit(R, P, { argv: ["--audit"], frames: states, apart: false });
    for (const state of states) {
      const posed = R.solids.map(s => s.move ? A.moved(s, A.offsetOf(s, state)) : s);
      const interlocks = A.solidClearances(posed);
      if (interlocks.length) throw new Error(`Cabinet interlock at ${state.label}: ${JSON.stringify(interlocks.slice(0, 2))}`);
    }
  }
  const V = A.cameraBasis(P).V;
  const motion = k.iso([0,26,0],P).map((v,i)=>v-k.iso([0,0,0],P)[i]);
  const items = R.items.sort((a,b)=>a.key-b.key).map(item => {
    const lift = item.move ? item.move.reduce((sum,v,i)=>sum+v*V[i],0) : 0;
    return `<g data-part="${item.name}" data-key="${item.key}" data-lift="${lift}"${item.drawer ? ` data-drawer="${item.drawer}"` : ""}>${item.svg}</g>`;
  }).join("");
  const svg = `<svg class="cabinet-svg" viewBox="0 0 580 420" role="img" aria-labelledby="cabinet-title cabinet-description"><title id="cabinet-title">An evidence filing cabinet</title><desc id="cabinet-description">A physical analogy with drawers for opinions, observed behavior, and costly commitments. Choosing a signal opens its drawer. Drawer position is not a business score.</desc><g id="cabinet-parts">${items}</g></svg>`;
  return { svg, motion, count: R.items.length };
}
