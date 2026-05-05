import { defineComponent as at, ref as W, reactive as St, computed as te, watch as N, inject as bt, nextTick as We, onMounted as Ze, onUnmounted as it, openBlock as pe, createElementBlock as we, normalizeStyle as Fe, createElementVNode as ie, withModifiers as Ne, withKeys as Ml, createCommentVNode as _e, toDisplayString as Be, createVNode as nl, withDirectives as ol, vModelText as Sl, provide as Gt, renderSlot as Dt, Transition as Tl, withCtx as Cl, Fragment as kl, renderList as Il, createTextVNode as Ll, normalizeClass as Rl, vShow as Dl } from "vue";
import * as q from "three";
const ot = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Header keeps modest opacity for contrast against rows.
    bg: "rgba(0,0,0,0)",
    headerBg: "rgba(18,18,42,0.65)",
    text: "#e8f2ff",
    textHeader: "#6a90b8",
    border: "#2a3a50",
    accent: "#40a0f0",
    rowAlt: "rgba(255,255,255,0.018)"
  },
  phosphor: {
    bg: "#060d06",
    headerBg: "#030703",
    text: "#33ff33",
    textHeader: "#00cc00",
    border: "#0a250a",
    accent: "#80ff80",
    rowAlt: "rgba(51,255,51,0.025)"
  },
  amber: {
    bg: "#0a0700",
    headerBg: "#060400",
    text: "#ffb000",
    textHeader: "#ffd000",
    border: "#2a1500",
    accent: "#ffd060",
    rowAlt: "rgba(255,176,0,0.025)"
  },
  paper: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through in day mode — same propagation pattern as 'none' (1c79043).
    // Header keeps a subtle white tint for contrast against rows.
    // Border bumped from #dee2e6 (very light grey, nearly invisible on
    // the brighter screen surface after the 2026-05-01 vignette/bg
    // changes) to #bfc8d4 — gridlines now read as proper rules.
    bg: "rgba(0,0,0,0)",
    headerBg: "rgba(255,255,255,0.65)",
    text: "#222222",
    textHeader: "#158cba",
    border: "#bfc8d4",
    accent: "#158cba",
    rowAlt: "rgba(21,140,186,0.04)"
  }
}, ve = 30, Tt = 12, El = 10, al = 28;
function Al(t, l) {
  if (typeof l == "function") return l(t);
  const e = t.filter((a) => a != null && a !== "");
  if (l === "count") return e.length;
  const n = e.map((a) => Number(a)).filter((a) => !Number.isNaN(a));
  if (n.length === 0) return null;
  switch (l) {
    case "sum":
      return n.reduce((a, i) => a + i, 0);
    case "avg":
      return n.reduce((a, i) => a + i, 0) / n.length;
    case "min":
      return Math.min(...n);
    case "max":
      return Math.max(...n);
  }
}
function jt(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, i = ot[l.theme] ?? ot.none, { cols: d, rows: v, pinnedRows: s, rowHeight: c, scrollY: f, scrollX: m, glow: w } = l;
  e.clearRect(0, 0, n, a), e.fillStyle = i.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const M = s.length * c, g = l.aggregateRow ? al : 0, x = a - ve - M - g;
  e.fillStyle = i.headerBg, e.fillRect(0, 0, n, ve), e.textBaseline = "middle", e.textAlign = "left";
  let u = -m;
  for (let B = 0; B < d.length; B++) {
    const V = d[B];
    if (u + V.width <= 0) {
      u += V.width;
      continue;
    }
    if (u >= n) break;
    const z = !!l.colFilters[V.colId], Y = l.sortColId === V.colId, X = (V.colDef.headerName ?? V.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(u, 0, V.width, ve), e.clip(), e.font = `bold ${El}px system-ui, -apple-system, sans-serif`, e.fillStyle = z ? i.accent : i.textHeader, w ? (e.shadowColor = i.textHeader, e.shadowBlur = 10, e.fillText(X, u + 8, ve / 2), e.shadowBlur = 4, e.fillText(X, u + 8, ve / 2), e.shadowBlur = 0) : e.fillText(X, u + 8, ve / 2), Y) {
      const P = e.measureText(X).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = i.accent, e.fillText(l.sortDir === "asc" ? "▲" : "▼", u + 8 + P + 4, ve / 2);
    }
    V.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = z ? i.accent : i.textHeader, e.globalAlpha = z ? 1 : 0.38, e.fillText("⌕", u + V.width - 20, ve / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(u + V.width - 0.5, 0), e.lineTo(u + V.width - 0.5, ve), e.stroke(), u += V.width;
  }
  e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, ve - 0.5), e.lineTo(n, ve - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ve, n, x), e.clip();
  const h = Math.max(0, Math.floor(f / c)), L = Math.min(v.length, Math.ceil((f + x) / c)), R = l.selectionAnchorRow ?? l.selectedRow, O = l.selectionAnchorCol ?? l.selectedCol, S = l.selectedRow >= 0 && R >= 0 ? Math.min(l.selectedRow, R) : -1, _ = l.selectedRow >= 0 && R >= 0 ? Math.max(l.selectedRow, R) : -1, D = l.selectedCol >= 0 && O >= 0 ? Math.min(l.selectedCol, O) : -1, H = l.selectedCol >= 0 && O >= 0 ? Math.max(l.selectedCol, O) : -1, F = _ > S || H > D;
  let Q = Number.POSITIVE_INFINITY, j = Number.NEGATIVE_INFINITY, U = Number.POSITIVE_INFINITY, Z = Number.NEGATIVE_INFINITY;
  for (let B = h; B < L; B++) {
    const V = v[B], z = ve + B * c - f;
    B % 2 === 1 && (e.fillStyle = i.rowAlt, e.fillRect(0, z, n, c));
    const Y = B >= S && B <= _;
    B === l.hoveredRow && !Y && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, z, n, c)), Y && !F && (e.fillStyle = Ct(i.accent, 0.1), e.fillRect(0, z, n, c)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, z + c - 0.5), e.lineTo(n, z + c - 0.5), e.stroke();
    let X = -m;
    for (let P = 0; P < d.length; P++) {
      const b = d[P];
      if (X + b.width <= 0) {
        X += b.width;
        continue;
      }
      if (X >= n) break;
      const K = Y && P >= D && P <= H;
      K && F && (e.fillStyle = Ct(i.accent, 0.14), e.fillRect(X, z, b.width, c)), K && (X < Q && (Q = X), X + b.width > j && (j = X + b.width), z < U && (U = z), z + c > Z && (Z = z + c));
      const le = l.getCellStyle(b, V), ce = le.color ?? i.text, re = le.textAlign ?? "left", he = l.formatCell(b, V);
      e.save(), e.beginPath(), e.rect(X + 1, z, b.width - 2, c), e.clip(), e.font = `${Tt}px system-ui, -apple-system, sans-serif`, e.fillStyle = ce, e.textBaseline = "middle";
      const oe = re === "right" ? X + b.width - 8 : X + 8;
      e.textAlign = re === "right" ? "right" : "left";
      const fe = z + c / 2;
      w ? (e.shadowColor = ce, e.shadowBlur = 12, e.fillText(he, oe, fe), e.shadowBlur = 6, e.fillText(he, oe, fe), e.shadowBlur = 2, e.fillText(he, oe, fe), e.shadowBlur = 0) : e.fillText(he, oe, fe), e.restore(), B === l.selectedRow && P === l.selectedCol && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(X + 1.5, z + 1.5, b.width - 3, c - 3)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(X + b.width - 0.5, z), e.lineTo(X + b.width - 0.5, z + c), e.stroke(), X += b.width;
    }
  }
  if (F && Q < j && U < Z && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(Q + 0.5, U + 0.5, j - Q - 1, Z - U - 1)), e.restore(), s.length > 0) {
    const B = a - M - g;
    e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, B - 0.5), e.lineTo(n, B - 0.5), e.stroke();
    for (let V = 0; V < s.length; V++) {
      const z = s[V], Y = B + V * c;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, Y, n, c);
      let X = -m;
      for (let P = 0; P < d.length; P++) {
        const b = d[P];
        if (X + b.width <= 0) {
          X += b.width;
          continue;
        }
        if (X >= n) break;
        const K = l.getCellStyle(b, z), le = K.color ?? i.text, ce = K.textAlign ?? "left", re = l.formatCell(b, z);
        e.save(), e.beginPath(), e.rect(X + 1, Y, b.width - 2, c), e.clip(), e.font = `bold ${Tt}px system-ui, -apple-system, sans-serif`, e.fillStyle = le, e.textBaseline = "middle", ce === "right" ? (e.textAlign = "right", e.fillText(re, X + b.width - 8, Y + c / 2)) : (e.textAlign = "left", e.fillText(re, X + 8, Y + c / 2)), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(X + b.width - 0.5, Y), e.lineTo(X + b.width - 0.5, Y + c), e.stroke(), X += b.width;
      }
      e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, Y + c - 0.5), e.lineTo(n, Y + c - 0.5), e.stroke();
    }
  }
  if (l.aggregateRow) {
    const B = a - g;
    e.fillStyle = Ct(i.accent, 0.1), e.fillRect(0, B, n, g), e.strokeStyle = i.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, B - 0.5), e.lineTo(n, B - 0.5), e.stroke();
    let V = -m;
    for (let z = 0; z < d.length; z++) {
      const Y = d[z];
      if (V + Y.width <= 0) {
        V += Y.width;
        continue;
      }
      if (V >= n) break;
      const P = l.getCellStyle(Y, l.aggregateRow).textAlign ?? "left", b = l.aggregateRow[Y.colId] ?? "";
      e.save(), e.beginPath(), e.rect(V + 1, B, Y.width - 2, g), e.clip(), e.font = `bold ${Tt}px system-ui, -apple-system, sans-serif`, e.fillStyle = i.accent, e.textBaseline = "middle", w && (e.shadowColor = i.accent, e.shadowBlur = 8), P === "right" ? (e.textAlign = "right", e.fillText(b, V + Y.width - 8, B + g / 2)) : (e.textAlign = "left", e.fillText(b, V + 8, B + g / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(V + Y.width - 0.5, B), e.lineTo(V + Y.width - 0.5, B + g), e.stroke(), V += Y.width;
    }
  }
  e.restore();
}
function Ct(t, l) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${l})`);
  const e = parseInt(t.slice(1, 3), 16), n = parseInt(t.slice(3, 5), 16), a = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${n},${a},${l})`;
}
function Fl(t, l, e) {
  const n = t - 0.5, a = l - 0.5, i = (n * n + a * a) * e, d = n * (1 + i) * i, v = a * (1 + i) * i;
  return [t + d, l + v * 0.15];
}
function Bl(t, l, e, n, a) {
  const i = t / e, d = 1 - l / n, [v, s] = Fl(i, d, a);
  return v < 0 || v > 1 || s < 0 || s > 1 ? [-1, -1] : [v * e, (1 - s) * n];
}
function kt(t, l) {
  let e = 0;
  for (let n = 0; n < t; n++) e += l[n].width;
  return e;
}
function _l(t, l, e) {
  return t >= l + e - 24 && t < l + e;
}
function qt(t, l, e) {
  const n = l + e;
  return t >= n - 6 && t <= n + 1;
}
function Zt(t, l, e, n, a, i, d, v, s, c = !1) {
  const f = t + s;
  let m = -1, w = 0;
  for (let h = 0; h < e.length; h++) {
    if (f >= w && f < w + e[h].width) {
      m = h;
      break;
    }
    w += e[h].width;
  }
  if (l < ve) return { area: "header", colIdx: m, rowIdx: -1 };
  const M = c ? al : 0;
  if (M > 0 && l >= d - M)
    return { area: "agg", colIdx: m, rowIdx: -1 };
  const g = v * a;
  if (g > 0 && l >= d - g - M) {
    const h = Math.floor((l - (d - g - M)) / a);
    return { area: "pinned", colIdx: m, rowIdx: h };
  }
  const x = l - ve + i, u = Math.floor(x / a);
  return u >= 0 && u < n ? { area: "body", colIdx: m, rowIdx: u } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const Yl = 500, Wl = Yl / 2, zl = 1.6, Ft = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Bt = `
  // Pull sample position toward mouse when within lens radius — compresses
  // the sampled region so it displays magnified. Distance is computed in
  // aspect-corrected space (x scaled by W/H) so the lens is circular in
  // pixels regardless of canvas proportions; the inverse aspect scale is
  // applied when reconstructing the sample UV.
  //
  // Magnification is FLAT across the inner ~88% of the lens, then tapers
  // through the outer rim — just enough taper to read as a real glass curl
  // at the edge without becoming a fish-eye orb. The inner-flat percentage
  // (smoothstep first arg) controls how much "magnifier" vs "convex" the
  // lens reads as: smaller number = more orb-like.
  vec2 applyLens(vec2 uv) {
    if (uLensR <= 0.0) return uv;
    vec2  d    = (uv - uMouseUV) * vec2(uAspect, 1.0);
    float dist = length(d);
    if (dist >= uLensR) return uv;
    float t    = dist / uLensR;
    float zoom = mix(uLensZoom, 1.0, smoothstep(0.88, 1.0, t));
    vec2  newD = (d / zoom) * vec2(1.0 / uAspect, 1.0);
    return uMouseUV + newD;
  }
`, _t = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function Yt() {
  return {
    uMouseUV: { value: new q.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: zl },
    uLensTint: { value: new q.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Me = { x: -999, y: -999 };
function Wt(t, l, e, n, a) {
  const i = l && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = i && a > 0 ? Wl / a : 0, t.uniforms.uAspect.value = a > 0 ? n / a : 1;
}
function zt(t, l) {
  const e = l.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const Pl = ["value"], Hl = ["disabled"], $l = ["disabled"], Vl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Nl = 28, Xl = 600, Ol = /* @__PURE__ */ at({
  __name: "CathodeGrid",
  props: {
    columnDefs: {},
    rowData: { default: () => [] },
    rowHeight: { default: 28 },
    defaultColDef: {},
    getRowStyle: {},
    pinnedBottomRowData: {},
    pagination: { type: Boolean, default: !0 },
    paginationPageSize: { default: 200 },
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    magnify: { type: Boolean, default: !1 }
  },
  emits: ["grid-ready", "row-clicked", "cell-selected", "column-resized", "sort-changed", "filter-changed"],
  setup(t, { emit: l }) {
    const e = t, n = l, a = W(e.rowData ?? []), i = W(e.pinnedBottomRowData ?? []), d = W(""), v = W(null), s = St({}), c = St({}), f = St(/* @__PURE__ */ new Set()), m = W(0), w = W(0), M = W(0), g = W(0), x = W(0), u = W(-1), h = W(null), L = W(null), R = W(null), O = { ...Me }, S = W({ x: 0, y: ve }), _ = W("");
    function D(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const H = te(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((r) => !f.has(D(r))).map((r) => {
        const y = D(r), C = { ...o, ...r };
        return { colId: y, colDef: C, width: c[y] ?? C.width ?? 100 };
      });
    }), F = te(() => {
      const o = w.value;
      if (!o) return H.value;
      const r = H.value.reduce((T, I) => T + I.width, 0);
      if (!r || r >= o) return H.value;
      const y = o / r;
      let C = 0;
      return H.value.map((T, I) => {
        const G = I === H.value.length - 1 ? o - C : Math.max(8, Math.round(T.width * y));
        return C += G, { ...T, width: G };
      });
    }), Q = te(() => {
      const o = F.value.reduce((r, y) => r + y.width, 0);
      return Math.max(0, o - w.value);
    }), j = te(() => {
      const o = i.value.length * e.rowHeight;
      return Math.max(0, M.value - ve - o);
    }), U = te(
      () => Math.max(0, P.value.length * e.rowHeight - j.value)
    ), Z = te(
      () => Math.max(1, Math.floor(j.value / e.rowHeight))
    ), B = te(
      () => P.value.length === 0 ? 0 : Math.min(P.value.length - 1, Math.floor(g.value / e.rowHeight))
    ), V = te(
      () => Math.min(P.value.length - 1, B.value + Z.value - 1)
    );
    function z(o, r) {
      if (r.colDef.valueGetter) return r.colDef.valueGetter({ data: o, colDef: r.colDef });
      if (r.colDef.field) return o[r.colDef.field];
    }
    function Y(o, r) {
      const y = z(r, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: y, data: r, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: y, data: r, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : y == null ? "" : String(y);
    }
    function X(o, r) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: z(r, o), data: r, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const P = te(() => {
      m.value;
      let o = a.value;
      const r = d.value.trim().toLowerCase();
      r && (o = o.filter(
        (y) => H.value.some(
          (C) => String(z(y, C) ?? "").toLowerCase().includes(r)
        )
      ));
      for (const [y, C] of Object.entries(s)) {
        if (!C) continue;
        const T = H.value.find((I) => I.colId === y);
        if (T)
          if (C.startsWith("__eq__")) {
            const I = C.slice(6).toLowerCase();
            o = o.filter((A) => String(z(A, T) ?? "").toLowerCase() === I);
          } else {
            const I = C.toLowerCase();
            o = o.filter((A) => String(z(A, T) ?? "").toLowerCase().includes(I));
          }
      }
      if (v.value) {
        const { colId: y, dir: C } = v.value, T = H.value.find((I) => I.colId === y);
        T && (o = [...o].sort((I, A) => {
          const G = z(I, T), ue = z(A, T);
          let me = 0;
          return T.colDef.comparator ? me = T.colDef.comparator(G, ue) : typeof G == "number" && typeof ue == "number" ? me = G - ue : me = String(G ?? "").localeCompare(String(ue ?? ""), void 0, { numeric: !0 }), C === "asc" ? me : -me;
        }));
      }
      return o;
    }), b = te(() => {
      const o = H.value.filter((T) => T.colDef.aggFunc != null);
      if (o.length === 0) return null;
      const r = P.value, y = {};
      for (const T of o) {
        const I = r.map((G) => z(G, T)), A = Al(I, T.colDef.aggFunc);
        if (A == null) {
          y[T.colId] = "";
          continue;
        }
        y[T.colId] = T.colDef.aggValueFormatter ? T.colDef.aggValueFormatter(A) : String(A);
      }
      const C = o[0].colId;
      return y[C] === "" && (y[C] = "Σ"), y;
    });
    N(P, () => {
      g.value = 0, h.value = null;
    }), N(Q, () => {
      x.value = Math.min(x.value, Q.value);
    }), N(U, () => {
      g.value = Math.min(g.value, U.value);
    });
    function K(o) {
      const r = o * e.rowHeight, y = r + e.rowHeight;
      r < g.value ? g.value = r : y > g.value + j.value && (g.value = Math.min(U.value, y - j.value));
    }
    function le() {
      g.value = Math.max(0, g.value - j.value), ae();
    }
    function ce() {
      g.value = Math.min(U.value, g.value + j.value), ae();
    }
    let re = !1, he = "", oe = 0, fe = 0, k = !1, $ = !1, ne = 0, be = 0, xe = 0, Ce = 0, De = !1;
    function $e(o, r) {
      var y;
      re = !0, he = o, oe = r, fe = ((y = F.value.find((C) => C.colId === o)) == null ? void 0 : y.width) ?? 100, k = !1;
    }
    function Ue(o) {
      if ($) {
        const I = ne - o.clientX, A = be - o.clientY;
        (Math.abs(I) > 4 || Math.abs(A) > 4) && (De = !0), x.value = Math.max(0, Math.min(Q.value, xe + I)), g.value = Math.max(0, Math.min(U.value, Ce + A)), ae();
        return;
      }
      if (!re) return;
      const r = w.value, y = Math.max(30, fe + (o.clientX - oe)), C = H.value.filter((I) => I.colId !== he).reduce((I, A) => I + A.width, 0), T = r - y;
      T > 10 && (c[he] = Math.max(10, Math.round(y * C / T))), ae();
    }
    function Ve() {
      $ && (De && (k = !0), $ = !1), re && (re = !1, k = !0, n("column-resized"));
    }
    const ke = W(null), ee = W(null), ze = bt("cathodeResetTick", W(0));
    N(ze, () => et());
    let se = null, Pe = !1, Ee, st, Te, Se, de;
    const p = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${Ft}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Bt}

  void main() {
    vec2 lensUV = applyLens(vUv);
    vec2 uv     = barrel(lensUV);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec4 color = texture2D(uTex, uv);

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;   // softened falloff — see CathodeLog for rationale
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    ${_t}

    gl_FragColor = color;
  }
`;
    function E() {
      if (!(!ee.value || !ke.value)) {
        de = document.createElement("canvas");
        try {
          se = new q.WebGLRenderer({ canvas: ee.value, antialias: !1, alpha: !0 });
        } catch {
          Pe = !0;
        }
        if (!Pe && !se.getContext() && (se.dispose(), se = null, Pe = !0), Pe) {
          J();
          return;
        }
        se.setPixelRatio(1), se.setClearColor(0, 0), Ee = new q.Scene(), st = new q.OrthographicCamera(-1, 1, 1, -1, 0, 1), Se = new q.CanvasTexture(de), Se.minFilter = q.LinearFilter, Se.magFilter = q.LinearFilter, Te = new q.ShaderMaterial({
          uniforms: {
            uTex: { value: Se },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new q.Color(0) },
            ...Yt()
          },
          vertexShader: Vl,
          fragmentShader: p,
          transparent: !0
        }), Ee.add(new q.Mesh(new q.PlaneGeometry(2, 2), Te)), J();
      }
    }
    function J() {
      if (!ke.value || !se && !Pe) return;
      const o = ke.value.clientWidth, r = ke.value.clientHeight - (e.pagination ? Nl : 0);
      if (!o || !r) return;
      const y = de.width !== o || de.height !== r;
      de.width = o, de.height = r, w.value = o, M.value = r, x.value = Math.max(0, Math.min(Q.value, x.value)), g.value = Math.max(0, Math.min(U.value, g.value)), se ? (y && Se && (Se.dispose(), Se = new q.CanvasTexture(de), Se.minFilter = q.LinearFilter, Se.magFilter = q.LinearFilter, Te && (Te.uniforms.uTex.value = Se)), se.setPixelRatio(window.devicePixelRatio || 1), se.setSize(o, r)) : ee.value && (ee.value.width = o, ee.value.height = r, ee.value.style.width = o + "px", ee.value.style.height = r + "px"), ae();
    }
    function ae() {
      var y, C, T, I, A, G, ue, me, tt, ft, dt, lt;
      if (!(de != null && de.width)) return;
      if (Pe) {
        if (!ee.value) return;
        jt(de, {
          cols: F.value,
          rows: P.value,
          pinnedRows: i.value,
          rowHeight: e.rowHeight,
          scrollY: g.value,
          scrollX: x.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((y = v.value) == null ? void 0 : y.colId) ?? null,
          sortDir: ((C = v.value) == null ? void 0 : C.dir) ?? null,
          colFilters: s,
          hoveredRow: u.value,
          selectedRow: ((T = h.value) == null ? void 0 : T.row) ?? -1,
          selectedCol: ((I = h.value) == null ? void 0 : I.col) ?? -1,
          selectionAnchorRow: ((A = L.value) == null ? void 0 : A.row) ?? -1,
          selectionAnchorCol: ((G = L.value) == null ? void 0 : G.col) ?? -1,
          formatCell: Y,
          getCellStyle: X
        });
        const vt = ee.value.getContext("2d");
        vt && vt.drawImage(de, 0, 0);
        return;
      }
      if (!se || !Te || !Se) return;
      const o = ot[e.theme] ?? ot.none, r = e.theme === "paper";
      Te.uniforms.uStrength.value = e.curvature / 45 * 0.55, Te.uniforms.uScanlines.value = e.scanlines && !r ? 1 : 0, Te.uniforms.uVignette.value = r ? 0 : 1, Te.uniforms.uBezel.value.set(o.bg), Wt(Te, e.magnify, O, de.width, de.height), jt(de, {
        cols: F.value,
        rows: P.value,
        pinnedRows: i.value,
        rowHeight: e.rowHeight,
        scrollY: g.value,
        scrollX: x.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((ue = v.value) == null ? void 0 : ue.colId) ?? null,
        sortDir: ((me = v.value) == null ? void 0 : me.dir) ?? null,
        colFilters: s,
        hoveredRow: u.value,
        selectedRow: ((tt = h.value) == null ? void 0 : tt.row) ?? -1,
        selectedCol: ((ft = h.value) == null ? void 0 : ft.col) ?? -1,
        selectionAnchorRow: ((dt = L.value) == null ? void 0 : dt.row) ?? -1,
        selectionAnchorCol: ((lt = L.value) == null ? void 0 : lt.col) ?? -1,
        formatCell: Y,
        getCellStyle: X,
        aggregateRow: b.value
      }), Se.needsUpdate = !0, se.render(Ee, st);
    }
    function Re(o) {
      if (!ee.value) return [-1, -1];
      const r = ee.value.getBoundingClientRect(), y = o.clientX - r.left, C = o.clientY - r.top, T = ee.value.width || r.width, I = ee.value.height || r.height, A = e.curvature / 45 * 0.55, [G, ue] = Bl(y, C, T, I, A);
      return G < 0 ? [-1, -1] : [G, ue];
    }
    let Ie = 0;
    function Ae(o) {
      R.value = null;
      const r = Date.now();
      if (o.deltaX !== 0) {
        Ie = r, x.value = Math.max(0, Math.min(Q.value, x.value + o.deltaX)), ae();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        Ie = r, x.value = Math.max(0, Math.min(Q.value, x.value + o.deltaY)), ae();
        return;
      }
      r - Ie < Xl || (g.value = Math.max(0, Math.min(U.value, g.value + o.deltaY)), ae());
    }
    function Qe(o) {
      if (re) return;
      if (e.magnify && ee.value) {
        const T = zt(o, ee.value);
        O.x = T.x, O.y = T.y;
      }
      const [r, y] = Re(o);
      if (r < 0) {
        u.value = -1, ae();
        return;
      }
      const C = Zt(
        r,
        y,
        F.value,
        P.value.length,
        e.rowHeight,
        g.value,
        de.height,
        i.value.length,
        x.value,
        b.value !== null
      );
      if (u.value = C.area === "body" ? C.rowIdx : -1, C.area === "header" && C.colIdx >= 0) {
        const T = F.value[C.colIdx], I = kt(C.colIdx, F.value), A = r + x.value;
        ee.value.style.cursor = T && qt(A, I, T.width) ? "col-resize" : "pointer";
      } else C.area === "body" ? ee.value.style.cursor = "pointer" : ee.value.style.cursor = "default";
      ae();
    }
    function Ke() {
      u.value = -1, O.x = Me.x, O.y = Me.y, ae();
    }
    function fl(o) {
      const [r, y] = Re(o);
      if (r < 0) return;
      if (y >= ve) {
        $ = !0, De = !1, ne = o.clientX, be = o.clientY, xe = x.value, Ce = g.value;
        return;
      }
      const C = r + x.value;
      for (let T = 0; T < F.value.length; T++) {
        const I = F.value[T], A = kt(T, F.value);
        if (I.colDef.resizable !== !1 && qt(C, A, I.width)) {
          $e(I.colId, o.clientX);
          return;
        }
      }
    }
    function dl(o) {
      var T, I, A;
      if (k) {
        k = !1;
        return;
      }
      if (re) return;
      const [r, y] = Re(o);
      if (r < 0) {
        R.value = null;
        return;
      }
      const C = Zt(
        r,
        y,
        F.value,
        P.value.length,
        e.rowHeight,
        g.value,
        de.height,
        i.value.length,
        x.value,
        b.value !== null
      );
      if (C.area === "header" && C.colIdx >= 0) {
        const G = F.value[C.colIdx], ue = kt(C.colIdx, F.value), me = r + x.value;
        G.colDef.filter && _l(me, ue, G.width) ? (o.stopPropagation(), R.value === G.colId ? R.value = null : (R.value = G.colId, _.value = (T = s[G.colId]) != null && T.startsWith("__eq__") ? s[G.colId].slice(6) : s[G.colId] ?? "", S.value = { x: Math.max(0, ue - x.value), y: ve })) : G.colDef.sortable !== !1 && (R.value = null, v.value = ((I = v.value) == null ? void 0 : I.colId) === G.colId ? v.value.dir === "asc" ? { colId: G.colId, dir: "desc" } : null : { colId: G.colId, dir: "asc" }, n("sort-changed"));
        return;
      }
      if (R.value = null, C.area === "body" && C.rowIdx >= 0 && C.colIdx >= 0) {
        const G = C.rowIdx;
        o.shiftKey && h.value ? (L.value || (L.value = { ...h.value }), h.value = { row: G, col: C.colIdx }) : (h.value = { row: G, col: C.colIdx }, L.value = { row: G, col: C.colIdx }), (A = ee.value) == null || A.focus();
        const ue = P.value[G], me = F.value[C.colIdx];
        ue && me && (n("row-clicked", { data: ue, event: o }), n("cell-selected", { data: ue, row: G, col: C.colIdx, colId: me.colId }));
      }
    }
    function Nt(o) {
      var r, y;
      R.value && ((y = (r = o.target).closest) != null && y.call(r, ".cathode-filter-popup") || (R.value = null));
    }
    function vl(o) {
      var T;
      if (!w.value) return;
      let r = 0;
      for (let I = 0; I < o; I++) r += F.value[I].width;
      const y = ((T = F.value[o]) == null ? void 0 : T.width) ?? 0, C = r - x.value;
      C < 0 ? x.value = Math.max(0, r) : C + y > w.value && (x.value = Math.min(Q.value, r + y - w.value));
    }
    function hl(o) {
      const y = F.value.length - 1, C = P.value.length - 1;
      if (!h.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), h.value = { row: B.value, col: 0 }, L.value = { row: B.value, col: 0 });
        return;
      }
      let { row: T, col: I } = h.value;
      const A = (G, ue, me = !1) => {
        T = Math.max(0, Math.min(C, G)), I = Math.max(0, Math.min(y, ue)), h.value = { row: T, col: I }, me || (L.value = { row: T, col: I }), K(T), vl(I);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), A(T + 1, I, o.shiftKey);
          break;
        case "ArrowUp":
          o.preventDefault(), A(T - 1, I, o.shiftKey);
          break;
        case "ArrowRight":
          o.preventDefault(), o.shiftKey ? A(T, I + 1, !0) : I < y ? A(T, I + 1) : A(T + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), o.shiftKey ? A(T, I - 1, !0) : I > 0 ? A(T, I - 1) : A(T - 1, y);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? I > 0 ? A(T, I - 1) : A(T - 1, y) : I < y ? A(T, I + 1) : A(T + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? A(T - 1, I) : A(T + 1, I);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? A(0, 0, o.shiftKey) : A(T, 0, o.shiftKey);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? A(C, y, o.shiftKey) : A(T, y, o.shiftKey);
          break;
        case "PageDown":
          o.preventDefault(), A(Math.min(C, T + Z.value), I, o.shiftKey);
          break;
        case "PageUp":
          o.preventDefault(), A(Math.max(0, T - Z.value), I, o.shiftKey);
          break;
        case "Escape":
          h.value = null, L.value = null;
          break;
        case "c":
        case "C":
          (o.ctrlKey || o.metaKey) && (o.preventDefault(), ml());
          break;
      }
    }
    function ml() {
      var me;
      if (!h.value) return;
      const o = F.value, r = P.value, y = L.value ?? h.value, C = Math.min(y.row, h.value.row), T = Math.max(y.row, h.value.row), I = Math.min(y.col, h.value.col), A = Math.max(y.col, h.value.col), G = [];
      for (let tt = C; tt <= T; tt++) {
        const ft = r[tt];
        if (!ft) continue;
        const dt = [];
        for (let lt = I; lt <= A; lt++) {
          const vt = o[lt];
          vt && dt.push(Y(vt, ft).replace(/[\t\r\n]+/g, " "));
        }
        G.push(dt.join("	"));
      }
      const ue = G.join(`
`);
      (me = navigator.clipboard) == null || me.writeText(ue).catch(() => {
      });
    }
    function gl(o) {
      const r = o.target.value;
      _.value = r, r ? s[R.value] = r : delete s[R.value], n("filter-changed");
    }
    function Xt() {
      R.value && delete s[R.value], _.value = "", R.value = null, n("filter-changed");
    }
    const pl = {
      setGridOption(o, r) {
        o === "rowData" ? a.value = r : o === "pinnedBottomRowData" ? i.value = r : o === "quickFilterText" && (d.value = r);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var y, C;
          const r = D(o);
          return {
            colId: r,
            hide: f.has(r),
            sort: ((y = v.value) == null ? void 0 : y.colId) === r ? v.value.dir : null,
            sortIndex: ((C = v.value) == null ? void 0 : C.colId) === r ? 0 : null,
            width: c[r] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const r of o)
          r.hide === !0 && f.add(r.colId), r.hide === !1 && f.delete(r.colId), r.sort && (v.value = { colId: r.colId, dir: r.sort }), r.width && (c[r.colId] = r.width);
      },
      setFilterModel(o) {
        for (const r of Object.keys(s)) delete s[r];
        if (o)
          for (const [r, y] of Object.entries(o))
            (y == null ? void 0 : y.type) === "equals" ? s[r] = `__eq__${y.filter}` : y != null && y.filter && (s[r] = y.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [r, y] of Object.entries(s))
          y && (o[r] = y.startsWith("__eq__") ? { type: "equals", filter: y.slice(6) } : { type: "contains", filter: y });
        return o;
      },
      async setColumnFilterModel(o, r) {
        r ? r.type === "equals" ? s[o] = `__eq__${r.filter}` : s[o] = r.filter ?? "" : delete s[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        m.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const r = H.value, y = r.map((A) => A.colDef.headerName ?? A.colId).join(","), C = P.value.map(
          (A) => r.map((G) => `"${String(Y(G, A)).replace(/"/g, '""')}"`).join(",")
        ), T = new Blob([[y, ...C].join(`
`)], { type: "text/csv" }), I = URL.createObjectURL(T);
        Object.assign(document.createElement("a"), { href: I, download: o }).click(), URL.revokeObjectURL(I);
      },
      resize() {
        J();
      },
      resetColumnState() {
        f.clear();
        for (const r of e.columnDefs)
          r.hide && f.add(D(r));
        const o = e.columnDefs.find((r) => r.sort);
        v.value = o ? { colId: D(o), dir: o.sort } : null;
        for (const r of Object.keys(c)) delete c[r];
        for (const r of Object.keys(s)) delete s[r];
        d.value = "", g.value = 0, h.value = null, R.value = null;
      }
    };
    N(
      [P, () => i.value, F, g, u, h],
      () => We(ae)
    ), N(() => e.theme, () => ae()), N(() => e.curvature, () => We(J)), N(() => e.scanlines, () => ae()), N(() => e.glow, () => ae()), N(() => e.magnify, (o) => {
      o || (O.x = Me.x, O.y = Me.y), ae();
    }), N(h, (o) => {
      if (!o) return;
      const r = P.value[o.row], y = F.value[o.col];
      r && y && n("cell-selected", { data: r, row: o.row, col: o.col, colId: y.colId });
    });
    let ct = null, ut = null, Mt = 0;
    function et() {
      cancelAnimationFrame(Mt), Mt = requestAnimationFrame(J);
    }
    function Ot(o) {
      o.preventDefault();
    }
    function Ut() {
      se == null || se.dispose(), se = null, Pe = !1, E();
    }
    Ze(() => {
      for (const o of e.columnDefs)
        o.hide && f.add(D(o)), o.sort && !v.value && (v.value = { colId: D(o), dir: o.sort });
      a.value = e.rowData ?? [], i.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", Nt), document.addEventListener("mousemove", Ue), document.addEventListener("mouseup", Ve), We(() => {
        var o;
        E(), ee.value && (ee.value.addEventListener("webglcontextlost", Ot), ee.value.addEventListener("webglcontextrestored", Ut)), ke.value && (ct = new ResizeObserver(() => J()), ct.observe(ke.value), ut = new IntersectionObserver((r) => {
          r.some((y) => y.isIntersecting) && et();
        }), ut.observe(ke.value)), window.addEventListener("resize", et), (o = window.visualViewport) == null || o.addEventListener("resize", et), n("grid-ready", { api: pl });
      });
    }), it(() => {
      var o, r, y;
      document.removeEventListener("click", Nt, !0), document.removeEventListener("mousemove", Ue), document.removeEventListener("mouseup", Ve), (o = ee.value) == null || o.removeEventListener("webglcontextlost", Ot), (r = ee.value) == null || r.removeEventListener("webglcontextrestored", Ut), ct == null || ct.disconnect(), ut == null || ut.disconnect(), window.removeEventListener("resize", et), (y = window.visualViewport) == null || y.removeEventListener("resize", et), cancelAnimationFrame(Mt), se == null || se.dispose();
    });
    const Le = te(() => ot[e.theme] ?? ot.none), wl = te(() => ({
      position: "absolute",
      left: `${S.value.x}px`,
      top: `${S.value.y}px`,
      zIndex: 100,
      background: Le.value.headerBg,
      border: `1px solid ${Le.value.accent}`,
      color: Le.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), yl = te(() => ({
      background: Le.value.bg,
      border: `1px solid ${Le.value.border}`,
      color: Le.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), xl = te(() => ({
      background: Le.value.headerBg,
      borderTop: `1px solid ${Le.value.border}`,
      color: Le.value.text
    })), bl = te(() => ({
      background: Le.value.bg
    })), Kt = te(() => Le.value.accent);
    return (o, r) => {
      var y, C;
      return pe(), we("div", {
        ref_key: "wrapEl",
        ref: ke,
        class: "cathode-wrap",
        style: Fe(bl.value)
      }, [
        ie("canvas", {
          ref_key: "canvasEl",
          ref: ee,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Ne(Ae, ["prevent"]),
          onMousemove: Qe,
          onMouseleave: Ke,
          onMousedown: fl,
          onClick: dl,
          onKeydown: hl
        }, null, 544),
        R.value ? (pe(), we("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: Fe(wl.value),
          onClick: r[0] || (r[0] = Ne(() => {
          }, ["stop"]))
        }, [
          ie("input", {
            style: Fe(yl.value),
            value: _.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: gl,
            onKeydown: Ml(Xt, ["escape"])
          }, null, 44, Pl),
          _.value ? (pe(), we("button", {
            key: 0,
            style: Fe({
              background: "none",
              border: "none",
              color: Le.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: Xt
          }, "✕", 4)) : _e("", !0)
        ], 4)) : _e("", !0),
        t.pagination ? (pe(), we("div", {
          key: 1,
          class: "cathode-pagination",
          style: Fe(xl.value)
        }, [
          ie("button", {
            disabled: g.value <= 0,
            onClick: r[1] || (r[1] = (T) => le())
          }, "◀", 8, Hl),
          ie("span", null, Be((B.value + 1).toLocaleString()) + "–" + Be(Math.min(P.value.length, V.value + 1).toLocaleString()) + " / " + Be(P.value.length.toLocaleString()), 1),
          ie("button", {
            disabled: g.value >= U.value,
            onClick: r[2] || (r[2] = (T) => ce())
          }, "▶", 8, $l),
          ie("span", {
            class: "cathode-page-info",
            style: Fe({ color: Kt.value })
          }, Be(P.value.length.toLocaleString()) + " rows ", 5),
          h.value ? (pe(), we("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Fe({ color: Kt.value })
          }, Be(((y = F.value[h.value.col]) == null ? void 0 : y.colDef.headerName) ?? ((C = F.value[h.value.col]) == null ? void 0 : C.colId)) + " : " + Be(Y(F.value[h.value.col], P.value[h.value.row])), 5)) : _e("", !0)
        ], 4)) : _e("", !0)
      ], 4);
    };
  }
}), rt = (t, l) => {
  const e = t.__vccOpts || t;
  for (const [n, a] of l)
    e[n] = a;
  return e;
}, jn = /* @__PURE__ */ rt(Ol, [["__scopeId", "data-v-b951b247"]]), pt = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Same propagation pattern as CanvasGrid's `none` theme.
    // Brightened 2026-05-01: levelInfo, levelDebug, timestamp were too
    // muted — read as washed-out under barrel + vignette.
    bg: "rgba(0,0,0,0)",
    text: "#f0f8ff",
    border: "#2a3a50",
    accent: "#60c0ff",
    rowAlt: "rgba(255,255,255,0.018)",
    levelInfo: "#e0eaf4",
    levelWarn: "#ffd890",
    levelError: "#ff9a9a",
    levelDebug: "#a0b8d0",
    levelSuccess: "#a0e8c0",
    timestamp: "#90b8d8"
  },
  paper: {
    // bg fully transparent for day-mode glass propagation.
    bg: "rgba(0,0,0,0)",
    text: "#222222",
    border: "#dee2e6",
    accent: "#158cba",
    // Black at 2% — invisible on dark bg, barely-there shading on light.
    // The previous accent-blue at 4% read as harsh bands across each
    // entry on a paper-light surface (visible above ~3% alpha on white).
    rowAlt: "rgba(0,0,0,0.020)",
    levelInfo: "#444444",
    levelWarn: "#a06000",
    levelError: "#c0392b",
    levelDebug: "#888888",
    levelSuccess: "#1a8038",
    timestamp: "#888888"
  },
  phosphor: {
    // Mixed-with-white phosphor — pure #33ff33 reads as muted green
    // under shader vignette. Lifting to a slightly off-white green
    // gives the proper "burn through the screen" CRT phosphor look.
    bg: "#060d06",
    text: "#80ff80",
    border: "#0a250a",
    accent: "#a0ffa0",
    rowAlt: "rgba(51,255,51,0.025)",
    levelInfo: "#80ff80",
    levelWarn: "#d0ff60",
    levelError: "#ff8080",
    levelDebug: "#5fcc5f",
    levelSuccess: "#80ffa0",
    timestamp: "#60dd60"
  },
  amber: {
    bg: "#0a0700",
    text: "#ffd060",
    border: "#2a1500",
    accent: "#ffe080",
    rowAlt: "rgba(255,176,0,0.025)",
    levelInfo: "#ffd060",
    levelWarn: "#ffe040",
    levelError: "#ff7030",
    levelDebug: "#cc9030",
    levelSuccess: "#ffe890",
    timestamp: "#ffe080"
  }
};
function Ul(t, l) {
  switch (l) {
    case "warn":
      return t.levelWarn;
    case "error":
      return t.levelError;
    case "debug":
      return t.levelDebug;
    case "success":
      return t.levelSuccess;
    case "info":
    default:
      return t.levelInfo;
  }
}
const Kl = 12, ge = 18, mt = 10, je = 6, Pt = `${Kl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Gl(t, l, e) {
  if (e <= 0 || !l) return [l];
  const n = [];
  for (const a of l.split(`
`)) {
    if (!a) {
      n.push("");
      continue;
    }
    if (t.measureText(a).width <= e) {
      n.push(a);
      continue;
    }
    const i = a.split(/(\s+)/);
    let d = "";
    for (const v of i) {
      const s = d + v;
      if (t.measureText(s).width <= e)
        d = s;
      else if (d && (n.push(d.replace(/\s+$/, "")), d = ""), t.measureText(v).width > e) {
        let c = "";
        for (const f of v)
          t.measureText(c + f).width > e ? (c && n.push(c), c = f) : c += f;
        d = c;
      } else
        d = v.replace(/^\s+/, "");
    }
    d && n.push(d.replace(/\s+$/, ""));
  }
  return n.length ? n : [""];
}
function il(t) {
  if (typeof t == "number") {
    const l = new Date(t), e = String(l.getHours()).padStart(2, "0"), n = String(l.getMinutes()).padStart(2, "0"), a = String(l.getSeconds()).padStart(2, "0");
    return `${e}:${n}:${a}`;
  }
  return t;
}
function jl(t, l) {
  return Math.ceil(t.measureText(l).width) + 12;
}
function ql(t) {
  const { entries: l, ctx: e, textMaxWidth: n, showTimestamps: a, wordWrap: i } = t, d = t.formatTs ?? il;
  e.font = Pt;
  const v = [];
  for (let s = 0; s < l.length; s++) {
    const c = l[s], f = c.level ?? "info", m = a && c.ts != null ? d(c.ts) : "", w = i ? Gl(e, c.text, n) : c.text.split(`
`);
    for (let M = 0; M < w.length; M++)
      v.push({
        entryIdx: s,
        text: w[M],
        level: f,
        timestamp: M === 0 ? m : "",
        isFirstFrag: M === 0,
        widthPx: e.measureText(w[M]).width
      });
  }
  return v;
}
function Jt(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, i = pt[l.theme] ?? pt.none;
  e.clearRect(0, 0, n, a), e.fillStyle = i.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip(), e.font = Pt, e.textBaseline = "middle";
  const d = l.visualLines, v = mt - l.scrollX, s = (l.showTimestamps ? mt + l.timestampWidth : mt) - l.scrollX, c = Math.max(0, Math.floor((l.scrollY - je) / ge)), f = Math.min(d.length, Math.ceil((l.scrollY + a - je) / ge) + 1);
  for (let m = c; m < f; m++) {
    const w = d[m], M = je + m * ge - l.scrollY + ge / 2;
    if (w.entryIdx % 2 === 1 && w.isFirstFrag) {
      e.fillStyle = i.rowAlt;
      let x = 1;
      for (; m + x < f && d[m + x].entryIdx === w.entryIdx; ) x++;
      e.fillRect(0, M - ge / 2, n, ge * x);
    }
    l.selectionStart >= 0 && m >= l.selectionStart && m <= l.selectionEnd && (e.fillStyle = i.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, M - ge / 2, n, ge)), m === l.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, M - ge / 2, n, ge)), l.showTimestamps && w.timestamp && (e.fillStyle = i.timestamp, e.textAlign = "left", l.glow && (e.shadowBlur = 6, e.shadowColor = i.timestamp), e.fillText(w.timestamp, v, M), e.shadowBlur = 0);
    const g = Ul(i, w.level);
    e.fillStyle = g, e.textAlign = "left", l.glow ? (e.shadowColor = g, e.shadowBlur = 14, e.fillText(w.text, s, M), e.shadowBlur = 7, e.fillText(w.text, s, M), e.shadowBlur = 3, e.fillText(w.text, s, M), e.shadowBlur = 0) : e.fillText(w.text, s, M);
  }
  e.restore();
}
function Qt(t, l, e) {
  if (t < 0) return -1;
  const n = Math.floor((t + l - je) / ge);
  return n < 0 || n >= e ? -1 : n;
}
function Zl(t) {
  return je * 2 + t * ge;
}
const Jl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Ql = /* @__PURE__ */ at({
  __name: "CathodeLog",
  props: {
    entries: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showTimestamps: { type: Boolean, default: !0 },
    formatTs: {},
    wordWrap: { type: Boolean, default: !0 },
    autoscroll: { type: Boolean, default: !0 },
    maxLines: { default: 0 },
    magnify: { type: Boolean, default: !1 }
  },
  setup(t, { expose: l }) {
    const e = t, n = W(null), a = W(null), i = { ...Me }, d = W(0), v = W(0), s = W(0), c = W(-1), f = W(!0), m = W(-1), w = W(-1), M = te(() => {
      const p = e.entries ?? [];
      return e.maxLines > 0 && p.length > e.maxLines ? p.slice(p.length - e.maxLines) : p;
    }), g = te(() => {
      if (!e.showTimestamps) return "";
      const p = e.formatTs ?? il;
      let E = "00:00:00";
      for (const J of M.value) {
        if (J.ts == null) continue;
        const ae = p(J.ts);
        ae.length > E.length && (E = ae);
      }
      return E;
    }), x = W(0), u = W([]);
    function h() {
      if (!Z) return;
      const p = Z.getContext("2d");
      if (!p) return;
      p.font = Pt;
      const E = e.showTimestamps ? jl(p, g.value) : 0;
      x.value = E;
      const J = Math.max(
        1,
        d.value - mt * 2 - E
      );
      u.value = ql({
        entries: M.value,
        ctx: p,
        textMaxWidth: J,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const L = te(() => Zl(u.value.length)), R = te(() => Math.max(0, L.value - v.value)), O = te(() => {
      let p = 0;
      for (const E of u.value) E.widthPx > p && (p = E.widthPx);
      return mt * 2 + x.value + p;
    }), S = te(() => Math.max(0, O.value - d.value)), _ = W(0);
    N(R, () => {
      f.value ? s.value = R.value : s.value = Math.min(s.value, R.value);
    }), N(S, () => {
      _.value = Math.min(_.value, S.value);
    }), N(
      [M, d, () => e.showTimestamps, () => e.wordWrap, g],
      () => {
        h(), We(Y);
      },
      { deep: !1 }
    );
    let D = null, H = !1, F, Q, j, U, Z;
    const B = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Ft}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Bt}

  void main() {
    vec2 lensUV = applyLens(vUv);
    vec2 uv     = barrel(lensUV);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec4 color = texture2D(uTex, uv);

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      // Falloff coefficient was 1.5 — corners darkened to ~25% of centre,
      // which crushed text brightness. Dropped to 0.6: corners now hold
      // ~70%+ luminance so text reads bright across the whole screen.
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    ${_t}

    gl_FragColor = color;
  }
`;
    function V() {
      if (!(!a.value || !n.value)) {
        Z = document.createElement("canvas");
        try {
          D = new q.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          H = !0;
        }
        if (!H && !D.getContext() && (D.dispose(), D = null, H = !0), H) {
          z();
          return;
        }
        D.setPixelRatio(1), D.setClearColor(0, 0), F = new q.Scene(), Q = new q.OrthographicCamera(-1, 1, 1, -1, 0, 1), U = new q.CanvasTexture(Z), U.minFilter = q.LinearFilter, U.magFilter = q.LinearFilter, j = new q.ShaderMaterial({
          uniforms: {
            uTex: { value: U },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Yt()
          },
          vertexShader: Jl,
          fragmentShader: B,
          transparent: !0
        }), F.add(new q.Mesh(new q.PlaneGeometry(2, 2), j)), z();
      }
    }
    function z() {
      if (!n.value || !D && !H) return;
      const p = n.value.clientWidth, E = n.value.clientHeight;
      if (!p || !E) return;
      const J = Z.width !== p || Z.height !== E;
      J && (Z.width = p, Z.height = E, d.value = p, v.value = E, h(), D ? (J && U && (U.dispose(), U = new q.CanvasTexture(Z), U.minFilter = q.LinearFilter, U.magFilter = q.LinearFilter, j && (j.uniforms.uTex.value = U)), D.setPixelRatio(window.devicePixelRatio || 1), D.setSize(p, E)) : a.value && (a.value.width = p, a.value.height = E, a.value.style.width = p + "px", a.value.style.height = E + "px"), f.value && (s.value = Math.max(0, L.value - v.value)), Y());
    }
    function Y() {
      if (!(Z != null && Z.width)) return;
      if (H) {
        if (!a.value) return;
        Jt(Z, {
          visualLines: u.value,
          scrollY: s.value,
          scrollX: _.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: x.value,
          hoveredLine: c.value,
          selectionStart: Math.min(m.value, w.value),
          selectionEnd: Math.max(m.value, w.value)
        });
        const E = a.value.getContext("2d");
        E && E.drawImage(Z, 0, 0);
        return;
      }
      if (!D || !j || !U) return;
      const p = e.theme === "paper";
      j.uniforms.uStrength.value = e.curvature / 45 * 0.55, j.uniforms.uScanlines.value = e.scanlines && !p ? 1 : 0, j.uniforms.uVignette.value = p ? 0 : 1, Wt(j, e.magnify, i, Z.width, Z.height), Jt(Z, {
        visualLines: u.value,
        scrollY: s.value,
        scrollX: _.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: x.value,
        hoveredLine: c.value,
        selectionStart: Math.min(m.value, w.value),
        selectionEnd: Math.max(m.value, w.value)
      }), U.needsUpdate = !0, D.render(F, Q);
    }
    N(() => e.theme, () => Y()), N(() => e.curvature, () => Y()), N(() => e.scanlines, () => Y()), N(() => e.glow, () => Y()), N(() => e.magnify, (p) => {
      p || (i.x = Me.x, i.y = Me.y), Y();
    }), N(s, () => Y()), N(_, () => Y()), N(c, () => Y()), N([m, w], () => Y());
    function X(p) {
      if (!a.value) return [-1, -1];
      const E = a.value.getBoundingClientRect();
      return [p.clientX - E.left, p.clientY - E.top];
    }
    function P(p) {
      s.value = Math.max(0, Math.min(R.value, p)), f.value = s.value >= R.value - 4;
    }
    function b(p) {
      _.value = Math.max(0, Math.min(S.value, p));
    }
    function K(p) {
      p.shiftKey ? b(_.value + p.deltaY) : Math.abs(p.deltaX) > Math.abs(p.deltaY) ? b(_.value + p.deltaX) : P(s.value + p.deltaY);
    }
    let le = !1, ce = 0, re = 0, he = 0, oe = 0, fe = !1;
    function k(p) {
      le = !0, fe = !1, ce = p.clientX, re = p.clientY, he = _.value, oe = s.value, n.value && n.value.focus();
    }
    function $(p) {
      if (le) {
        const E = ce - p.clientX, J = re - p.clientY;
        (Math.abs(E) > 4 || Math.abs(J) > 4) && (fe = !0), b(he + E), P(oe + J);
      }
    }
    function ne() {
      le && (le = !1, fe && (fe = !1));
    }
    function be(p) {
      const [, E] = X(p);
      return E < 0 ? -1 : Qt(E, s.value, u.value.length);
    }
    function xe(p) {
      if (fe) {
        fe = !1;
        return;
      }
      const E = be(p);
      if (E < 0) {
        m.value = -1, w.value = -1;
        return;
      }
      p.shiftKey && m.value >= 0 || (m.value = E), w.value = E;
    }
    function Ce(p, E) {
      const J = u.value.length;
      if (J === 0) return;
      const ae = w.value < 0 ? 0 : w.value;
      let Re = Math.max(0, Math.min(J - 1, ae + p));
      w.value = Re, (!E || m.value < 0) && (m.value = Re), c.value = Re;
      const Ie = je + Re * ge, Ae = Ie + ge;
      Ie < s.value ? P(Ie) : Ae > s.value + v.value && P(Ae - v.value);
    }
    function De() {
      const p = Math.min(m.value, w.value), E = Math.max(m.value, w.value);
      if (p < 0) return "";
      const J = u.value, ae = /* @__PURE__ */ new Set(), Re = [];
      for (let Ie = p; Ie <= E && Ie < J.length; Ie++) {
        const Ae = J[Ie];
        if (ae.has(Ae.entryIdx)) continue;
        ae.add(Ae.entryIdx);
        let Qe = "";
        for (let Ke = 0; Ke < J.length; Ke++)
          J[Ke].entryIdx === Ae.entryIdx && (Qe += (Qe && !J[Ke].isFirstFrag ? " " : "") + J[Ke].text);
        Re.push(Ae.timestamp ? `${Ae.timestamp}  ${Qe}` : Qe);
      }
      return Re.join(`
`);
    }
    async function $e() {
      const p = De();
      if (p)
        try {
          await navigator.clipboard.writeText(p);
        } catch {
          const E = document.createElement("textarea");
          E.value = p, E.style.position = "fixed", E.style.opacity = "0", document.body.appendChild(E), E.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(E);
        }
    }
    function Ue(p) {
      if ((p.metaKey || p.ctrlKey) && (p.key === "c" || p.key === "C")) {
        m.value >= 0 && (p.preventDefault(), $e());
        return;
      }
      if ((p.metaKey || p.ctrlKey) && (p.key === "a" || p.key === "A")) {
        p.preventDefault(), m.value = 0, w.value = u.value.length - 1;
        return;
      }
      switch (p.key) {
        case "ArrowDown":
          p.preventDefault(), Ce(1, p.shiftKey);
          break;
        case "ArrowUp":
          p.preventDefault(), Ce(-1, p.shiftKey);
          break;
        case "ArrowRight":
          p.preventDefault(), b(_.value + ge * 2);
          break;
        case "ArrowLeft":
          p.preventDefault(), b(_.value - ge * 2);
          break;
        case "PageDown":
          p.preventDefault(), P(s.value + v.value);
          break;
        case "PageUp":
          p.preventDefault(), P(s.value - v.value);
          break;
        case "Home":
          p.preventDefault(), P(0), b(0);
          break;
        case "End":
          p.preventDefault(), P(R.value);
          break;
        case "Escape":
          m.value = -1, w.value = -1;
          break;
      }
    }
    function Ve(p) {
      if (e.magnify && a.value) {
        const J = zt(p, a.value);
        i.x = J.x, i.y = J.y, Y();
      }
      const [, E] = X(p);
      if (E < 0) {
        c.value = -1;
        return;
      }
      c.value = Qt(E, s.value, u.value.length);
    }
    function ke() {
      c.value = -1, i.x = Me.x, i.y = Me.y, Y();
    }
    l({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        f.value = !0, s.value = R.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(p) {
        P(je + p * ge);
      }
    });
    let ee = null, ze = null, se = 0;
    const Pe = bt("cathodeResetTick", W(0));
    N(Pe, () => Ee());
    function Ee() {
      cancelAnimationFrame(se), se = requestAnimationFrame(z);
    }
    function st(p) {
      p.preventDefault();
    }
    function Te() {
      D == null || D.dispose(), D = null, H = !1, V();
    }
    Ze(() => {
      document.addEventListener("mousemove", $), document.addEventListener("mouseup", ne), We(() => {
        var p;
        V(), a.value && (a.value.addEventListener("webglcontextlost", st), a.value.addEventListener("webglcontextrestored", Te)), n.value && (ee = new ResizeObserver(() => z()), ee.observe(n.value), ze = new IntersectionObserver((E) => {
          E.some((J) => J.isIntersecting) && Ee();
        }), ze.observe(n.value)), window.addEventListener("resize", Ee), (p = window.visualViewport) == null || p.addEventListener("resize", Ee), s.value = R.value;
      });
    }), it(() => {
      var p, E, J;
      document.removeEventListener("mousemove", $), document.removeEventListener("mouseup", ne), (p = a.value) == null || p.removeEventListener("webglcontextlost", st), (E = a.value) == null || E.removeEventListener("webglcontextrestored", Te), ee == null || ee.disconnect(), ze == null || ze.disconnect(), window.removeEventListener("resize", Ee), (J = window.visualViewport) == null || J.removeEventListener("resize", Ee), cancelAnimationFrame(se), D == null || D.dispose();
    });
    const Se = te(() => pt[e.theme] ?? pt.none), de = te(() => ({
      background: Se.value.bg
    }));
    return (p, E) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: Fe(de.value),
      tabindex: "0",
      onKeydown: Ue
    }, [
      ie("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: Ne(K, ["prevent"]),
        onMousemove: Ve,
        onMouseleave: ke,
        onMousedown: k,
        onClick: xe
      }, null, 544)
    ], 36));
  }
}), en = /* @__PURE__ */ rt(Ql, [["__scopeId", "data-v-50995a41"]]), tn = ["disabled"], ln = /* @__PURE__ */ at({
  __name: "CathodeTerminal",
  props: {
    entries: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showTimestamps: { type: Boolean, default: !0 },
    formatTs: {},
    wordWrap: { type: Boolean, default: !0 },
    autoscroll: { type: Boolean, default: !0 },
    maxLines: { default: 0 },
    prompt: { default: "→ " },
    disabled: { type: Boolean, default: !1 },
    busy: { type: Boolean, default: !1 },
    historyLimit: { default: 100 }
  },
  emits: ["submit"],
  setup(t, { expose: l, emit: e }) {
    const n = t, a = e, i = W(null), d = W(null), v = W(""), s = W([]), c = W(-1);
    let f = "";
    function m(S) {
      S.trim() && (s.value.length && s.value[s.value.length - 1] === S || (s.value.push(S), s.value.length > n.historyLimit && s.value.splice(0, s.value.length - n.historyLimit)));
    }
    function w(S) {
      if (!n.disabled) {
        if (S.key === "Enter") {
          S.preventDefault();
          const _ = v.value;
          _.trim() && m(_), c.value = -1, v.value = "", a("submit", _);
          return;
        }
        if (S.key === "ArrowUp") {
          if (!s.value.length) return;
          S.preventDefault(), c.value === -1 ? (f = v.value, c.value = s.value.length - 1) : c.value > 0 && c.value--, v.value = s.value[c.value];
          return;
        }
        if (S.key === "ArrowDown") {
          if (c.value === -1) return;
          S.preventDefault(), c.value < s.value.length - 1 ? (c.value++, v.value = s.value[c.value]) : (c.value = -1, v.value = f, f = "");
          return;
        }
      }
    }
    const M = W(!0);
    let g = null;
    function x() {
      g || (g = setInterval(() => {
        M.value = !M.value;
      }, 530));
    }
    function u() {
      g && (clearInterval(g), g = null), M.value = !0;
    }
    const h = te(() => {
      let S;
      return n.disabled ? S = " " : n.busy ? S = "█" : S = M.value ? "█" : " ", { level: "info", text: `${n.prompt}${v.value}${S}` };
    }), L = te(
      () => [...n.entries, h.value]
    );
    function R() {
      var S;
      n.disabled || (S = d.value) == null || S.focus();
    }
    N(() => n.busy, (S, _) => {
      _ && !S && !n.disabled && We(() => {
        var D;
        return (D = d.value) == null ? void 0 : D.focus();
      });
    });
    function O() {
      var S;
      (S = d.value) == null || S.focus();
    }
    return l({ focus: O }), Ze(() => {
      x(), n.disabled || requestAnimationFrame(() => {
        var S;
        return (S = d.value) == null ? void 0 : S.focus();
      });
    }), it(() => {
      u();
    }), (S, _) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-terminal-wrap",
      onClick: R
    }, [
      nl(en, {
        entries: L.value,
        theme: t.theme,
        curvature: t.curvature,
        scanlines: t.scanlines,
        glow: t.glow,
        "show-timestamps": t.showTimestamps,
        "format-ts": t.formatTs,
        "word-wrap": t.wordWrap,
        autoscroll: t.autoscroll,
        "max-lines": t.maxLines
      }, null, 8, ["entries", "theme", "curvature", "scanlines", "glow", "show-timestamps", "format-ts", "word-wrap", "autoscroll", "max-lines"]),
      ol(ie("input", {
        ref_key: "inputEl",
        ref: d,
        "onUpdate:modelValue": _[0] || (_[0] = (D) => v.value = D),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: w
      }, null, 40, tn), [
        [Sl, v.value]
      ])
    ], 512));
  }
}), qn = /* @__PURE__ */ rt(ln, [["__scopeId", "data-v-90cf2990"]]), wt = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Same propagation pattern as CanvasGrid / CanvasLog `none`.
    bg: "rgba(0,0,0,0)",
    candleBull: "#26a69a",
    candleBear: "#ef5350",
    wickBull: "#26a69a",
    wickBear: "#ef5350",
    volumeBull: "rgba(38,166,154,0.45)",
    volumeBear: "rgba(239,83,80,0.45)",
    gridline: "rgba(255,255,255,0.06)",
    text: "#c0d0e0",
    accent: "#40a0f0",
    markerEntry: "#00cc55",
    markerExit: "#e74c3c",
    panelBg: "rgba(13,21,32,0.55)",
    panelBgSolid: "rgba(13,21,32,0.92)"
  },
  paper: {
    bg: "rgba(0,0,0,0)",
    candleBull: "#1a8038",
    candleBear: "#c0392b",
    wickBull: "#1a8038",
    wickBear: "#c0392b",
    volumeBull: "rgba(26,128,56,0.30)",
    volumeBear: "rgba(192,57,43,0.30)",
    gridline: "rgba(0,0,0,0.06)",
    text: "#222222",
    accent: "#158cba",
    markerEntry: "#1a9e3f",
    markerExit: "#d93025",
    // Light backdrops for paper mode — dark fallbacks would be illegible on
    // the white parent background.
    panelBg: "rgba(255,255,255,0.78)",
    panelBgSolid: "rgba(255,255,255,0.96)"
  },
  phosphor: {
    bg: "#060d06",
    candleBull: "#33ff33",
    candleBear: "#ff5050",
    wickBull: "#33ff33",
    wickBear: "#ff5050",
    volumeBull: "rgba(51,255,51,0.35)",
    volumeBear: "rgba(255,80,80,0.35)",
    gridline: "rgba(51,255,51,0.10)",
    text: "#33ff33",
    accent: "#80ff80",
    markerEntry: "#80ff80",
    markerExit: "#ff8080",
    panelBg: "rgba(6,13,6,0.85)",
    panelBgSolid: "rgba(6,13,6,0.96)"
  },
  amber: {
    bg: "#0a0700",
    candleBull: "#ffd060",
    candleBear: "#ff5000",
    wickBull: "#ffd060",
    wickBear: "#ff5000",
    volumeBull: "rgba(255,208,96,0.35)",
    volumeBear: "rgba(255,80,0,0.35)",
    gridline: "rgba(255,176,0,0.10)",
    text: "#ffb000",
    accent: "#ffd060",
    markerEntry: "#ffe080",
    markerExit: "#ff7030",
    panelBg: "rgba(10,7,0,0.85)",
    panelBgSolid: "rgba(10,7,0,0.96)"
  }
}, nn = 0.18, ht = 8, Ht = 22, on = 4, He = 8, qe = 56, rl = 42, Xe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", an = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", It = 4, rn = 1, sn = 1;
function cn(t, l, e, n = 0, a = !1) {
  const i = a ? rl : qe, d = Math.max(0, l - He - i), v = Math.max(1, Math.floor(d / e)), s = Math.min(v, t);
  return { firstIdx: Math.max(0, t - s - Math.floor(n / e)), count: s, slotW: e };
}
function un(t, l, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, a = -1 / 0, i = 0;
  const d = Math.min(t.length, l + e);
  for (let s = l; s < d; s++) {
    const c = t[s];
    c && (c.low < n && (n = c.low), c.high > a && (a = c.high), c.volume > i && (i = c.volume));
  }
  if (!isFinite(n) || !isFinite(a) || n === a) {
    const s = isFinite(n) ? n : 0;
    return { min: s - 1, max: s + 1, maxVol: Math.max(1, i) };
  }
  const v = (a - n) * 0.04;
  return { min: n - v, max: a + v, maxVol: Math.max(1, i) };
}
function fn(t, l, e = !1) {
  const n = e ? on : Ht, a = Math.max(1, t - ht - n - It), i = Math.max(0, Math.round(a * l)), d = a - i;
  return {
    priceY0: ht,
    priceY1: ht + d,
    volumeY0: ht + d + It,
    volumeY1: ht + d + It + i
  };
}
function Ye(t, l, e, n) {
  const a = l.max - l.min;
  return a <= 0 ? (e + n) / 2 : e + (1 - (t - l.min) / a) * (n - e);
}
function Oe(t, l, e) {
  return He + (t - l + 0.5) * e;
}
function Ge(t) {
  const l = Math.abs(t), e = l >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : l >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : l >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : l >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function $t(t) {
  const l = new Date(t), e = String(l.getMonth() + 1).padStart(2, "0"), n = String(l.getDate()).padStart(2, "0"), a = String(l.getHours()).padStart(2, "0"), i = String(l.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${a}:${i}`;
}
function dn(t, l) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, l), n = Math.pow(10, Math.floor(Math.log10(e))), a = e / n;
  let i;
  return a < 1.5 ? i = 1 : a < 3 ? i = 2 : a < 7 ? i = 5 : i = 10, i * n;
}
function el(t, l) {
  var M, g, x, u, h;
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, i = wt[l.theme] ?? wt.none, d = l.colors ? { ...i, ...l.colors } : i, v = !!l.compact;
  if (e.clearRect(0, 0, n, a), e.fillStyle = d.bg, e.fillRect(0, 0, n, a), !l.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const s = cn(l.candles.length, n, l.slotW, l.scrollX, v), c = un(l.candles, s.firstIdx, s.count), f = fn(a, l.showVolume ? l.volumeFraction : 0, v), m = Math.max(rn, Math.floor(l.slotW * 0.7)), w = Math.min(l.candles.length, s.firstIdx + s.count);
  for (let L = s.firstIdx; L < w; L++) {
    const R = l.candles[L];
    if (!R) continue;
    const O = Oe(L, s.firstIdx, l.slotW), S = Ye(R.open, c, f.priceY0, f.priceY1), _ = Ye(R.close, c, f.priceY0, f.priceY1), D = Ye(R.high, c, f.priceY0, f.priceY1), H = Ye(R.low, c, f.priceY0, f.priceY1), F = R.close >= R.open, Q = F ? d.wickBull : d.wickBear, j = F ? d.candleBull : d.candleBear;
    l.glow && (e.shadowBlur = 10, e.shadowColor = j), e.strokeStyle = Q, e.lineWidth = sn, e.beginPath(), e.moveTo(Math.round(O) + 0.5, D), e.lineTo(Math.round(O) + 0.5, H), e.stroke(), e.fillStyle = j;
    const U = Math.min(S, _), Z = Math.max(1, Math.abs(_ - S)), B = Math.round(O - m / 2), V = Math.round(U), z = Math.round(Z);
    if (e.fillRect(B, V, m, z), l.glow && (e.shadowBlur = 4, e.fillRect(B, V, m, z)), e.shadowBlur = 0, l.showVolume && c.maxVol > 0) {
      const Y = Math.round(R.volume / c.maxVol * (f.volumeY1 - f.volumeY0));
      Y > 0 && (e.fillStyle = F ? d.volumeBull : d.volumeBear, e.fillRect(
        Math.round(O - m / 2),
        f.volumeY1 - Y,
        m,
        Y
      ));
    }
  }
  if ((M = l.overlays) != null && M.length)
    for (const L of l.overlays) vn(e, L, s, c, f, l.slotW);
  (g = l.markers) != null && g.length && bn(e, d, l.markers, l.candles, s, c, f, l.slotW), Mn(e, d, c, f, n, v), v || (Sn(e, d, l.candles, s, l.slotW, a), yn(e, d, l.candles, n, a)), (x = l.overlays) != null && x.length && mn(e, d, l.overlays, f), l.hover && (Tn(e, d, l.candles, s, c, f, l.slotW, l.hover, n), gn(e, d, l.candles, s, l.slotW, l.hover, f, ((u = l.overlays) == null ? void 0 : u.length) ?? 0), (h = l.markers) != null && h.length && wn(e, d, l.markers, l.candles, s, c, f, l.slotW, l.hover, n)), e.restore();
}
function vn(t, l, e, n, a, i) {
  var v;
  const d = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    He,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), l.kind === "line")
    gt(t, l.data, e.firstIdx, d, i, n, a, l.color, l.lineWidth ?? 1, l.dashed === !0);
  else {
    const s = sl(l.color, l.fillAlpha ?? 0.08);
    hn(t, l.upper, l.lower, e.firstIdx, d, i, n, a, s), gt(t, l.upper, e.firstIdx, d, i, n, a, l.color, 1, !1), gt(t, l.lower, e.firstIdx, d, i, n, a, l.color, 1, !1), (v = l.middle) != null && v.length && gt(t, l.middle, e.firstIdx, d, i, n, a, l.color, 1, l.middleDashed !== !1);
  }
  t.restore();
}
function gt(t, l, e, n, a, i, d, v, s, c) {
  if (!l || !l.length) return;
  t.strokeStyle = v, t.lineWidth = s, t.setLineDash(c ? [4, 3] : []), t.beginPath();
  let f = !1;
  for (let m = e; m < n; m++) {
    const w = l[m];
    if (typeof w != "number" || !isFinite(w)) {
      f && (t.stroke(), t.beginPath(), f = !1);
      continue;
    }
    const M = Oe(m, e, a), g = Ye(w, i, d.priceY0, d.priceY1);
    f ? t.lineTo(M, g) : (t.moveTo(M, g), f = !0);
  }
  f && t.stroke(), t.setLineDash([]);
}
function hn(t, l, e, n, a, i, d, v, s) {
  if (!(l != null && l.length) || !(e != null && e.length)) return;
  t.fillStyle = s;
  let c = !1, f = -1;
  for (let m = n; m <= a; m++) {
    const w = l[m], M = e[m], g = m < a && typeof w == "number" && typeof M == "number" && isFinite(w) && isFinite(M);
    if (g && !c && (f = m, c = !0), !g && c || m === a && c) {
      const x = g ? m + 1 : m;
      t.beginPath();
      for (let u = f; u < x; u++) {
        const h = Oe(u, n, i), L = Ye(l[u], d, v.priceY0, v.priceY1);
        u === f ? t.moveTo(h, L) : t.lineTo(h, L);
      }
      for (let u = x - 1; u >= f; u--) {
        const h = Oe(u, n, i), L = Ye(e[u], d, v.priceY0, v.priceY1);
        t.lineTo(h, L);
      }
      t.closePath(), t.fill(), c = !1;
    }
  }
}
function sl(t, l) {
  const e = Math.max(0, Math.min(1, l));
  if (t.startsWith("#") && t.length === 7) {
    const n = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), i = parseInt(t.slice(5, 7), 16);
    return `rgba(${n},${a},${i},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function mn(t, l, e, n) {
  const a = e.filter((x) => !!x.label);
  if (!a.length) return;
  t.save(), t.font = Xe;
  const i = 8, d = 5, v = 12, s = 6, c = 14;
  let f = 0;
  for (const x of a) {
    const u = t.measureText(x.label).width;
    u > f && (f = u);
  }
  const m = i * 2 + v + s + f, w = d * 2 + c * a.length, M = He + 4, g = n.priceY0 + 4;
  t.fillStyle = l.panelBg, t.fillRect(M, g, m, w), t.textBaseline = "middle", t.textAlign = "left";
  for (let x = 0; x < a.length; x++) {
    const u = a[x], h = g + d + c * (x + 0.5), L = M + i;
    u.kind === "line" ? (t.strokeStyle = u.color, t.lineWidth = u.lineWidth ?? 1, t.setLineDash(u.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(L, h), t.lineTo(L + v, h), t.stroke(), t.setLineDash([])) : (t.fillStyle = sl(u.color, u.fillAlpha ?? 0.2), t.fillRect(L, h - 4, v, 8), t.strokeStyle = u.color, t.lineWidth = 1, t.strokeRect(L + 0.5, h - 4 + 0.5, v - 1, 7)), t.fillStyle = l.text, t.fillText(u.label, L + v + s, h);
  }
  t.restore();
}
function gn(t, l, e, n, a, i, d, v) {
  const s = Math.floor((i.x - He) / a), c = n.firstIdx + s;
  if (c < 0 || c >= e.length) return;
  const f = e[c];
  if (!f) return;
  const m = f.close - f.open, w = f.open !== 0 ? m / f.open * 100 : 0, M = m >= 0 ? "+" : "", g = [
    ["O", Ge(f.open), void 0],
    ["H", Ge(f.high), void 0],
    ["L", Ge(f.low), void 0],
    ["C", Ge(f.close), void 0],
    ["V", pn(f.volume), void 0],
    ["", `${M}${w.toFixed(2)}%`, m >= 0 ? l.candleBull : l.candleBear]
  ];
  t.save(), t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
  const x = 8, u = 4, h = 14;
  let L = x;
  for (const [_, D] of g) {
    const H = _ ? `${_} ${D}` : D, F = t.measureText(H).width + 12;
    L += F;
  }
  L += x - 12;
  const R = d.priceY0 + 4 + (v > 0 ? u * 2 + 14 * v + 4 : 0), O = He + 4;
  t.fillStyle = l.panelBg, t.fillRect(O, R, L, h + u * 2);
  let S = O + x;
  for (let _ = 0; _ < g.length; _++) {
    const [D, H, F] = g[_];
    t.fillStyle = l.text, D && (t.globalAlpha = 0.6, t.fillText(D + " ", S, R + u + h / 2), t.globalAlpha = 1, S += t.measureText(D + " ").width), F && (t.fillStyle = F), t.fillText(H, S, R + u + h / 2), S += t.measureText(H).width + 12;
  }
  t.restore();
}
function pn(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function wn(t, l, e, n, a, i, d, v, s, c) {
  if (!n.length) return;
  const f = n.length > 1 ? n[1].start - n[0].start : 6e4, m = Math.max(1, f * 0.5), w = Math.min(n.length, a.firstIdx + a.count), M = 9;
  let g = null;
  for (const H of e) {
    let F = 0, Q = n.length - 1, j = -1;
    for (; F <= Q; ) {
      const B = F + Q >> 1, V = n[B].start - H.timestamp;
      if (Math.abs(V) <= m) {
        j = B;
        break;
      }
      V < 0 ? F = B + 1 : Q = B - 1;
    }
    if (j < 0 || j < a.firstIdx || j >= w) continue;
    const U = Oe(j, a.firstIdx, v), Z = Ye(H.price, i, d.priceY0, d.priceY1);
    if (Math.abs(s.x - U) <= M && Math.abs(s.y - Z) <= M) {
      g = { m: H, x: U, y: Z };
      break;
    }
  }
  if (!g) return;
  const x = $t(g.m.timestamp), u = [
    `${g.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${x}`,
    `@ ${Ge(g.m.price)}`
  ];
  g.m.label && u.push(g.m.label), t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "left";
  const h = 6, L = 14;
  let R = 0;
  for (const H of u) {
    const F = t.measureText(H).width;
    F > R && (R = F);
  }
  const O = R + h * 2, S = u.length * L + h * 2;
  let _ = g.x + 12;
  _ + O > c - qe && (_ = g.x - 12 - O);
  let D = g.y - S / 2;
  D < d.priceY0 && (D = d.priceY0), D + S > d.priceY1 && (D = d.priceY1 - S), t.fillStyle = l.panelBgSolid, t.strokeStyle = g.m.kind === "entry" ? l.markerEntry : l.markerExit, t.lineWidth = 1, t.fillRect(_, D, O, S), t.strokeRect(_ + 0.5, D + 0.5, O - 1, S - 1);
  for (let H = 0; H < u.length; H++) {
    const F = u[H];
    t.fillStyle = H === 0 ? g.m.kind === "entry" ? l.markerEntry : l.markerExit : l.text, t.fillText(F, _ + h, D + h + H * L);
  }
  t.restore();
}
function yn(t, l, e, n, a) {
  if (e.length < 2) return;
  const i = e[1].start - e[0].start, d = xn(i);
  if (!d) return;
  t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "right";
  const v = 6, s = 3, c = t.measureText(d).width, f = n - qe - v, m = a - Ht + 4;
  t.fillStyle = l.accent, t.fillRect(f - c - v, m - s, c + v * 2, 14 + s * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(d, f, m), t.restore();
}
function xn(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const l = 1e3, e = 60 * l, n = 60 * e, a = 24 * n, i = 7 * a;
  return t >= i && t % i === 0 ? t / i + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= n && t % n === 0 ? t / n + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= l && t % l === 0 ? t / l + "s" : Math.round(t / e) + "m";
}
function bn(t, l, e, n, a, i, d, v) {
  if (!n.length) return;
  const s = n.length > 1 ? n[1].start - n[0].start : 6e4, c = Math.max(1, s * 0.5), f = Math.min(n.length, a.firstIdx + a.count), m = (M) => {
    let g = 0, x = n.length - 1;
    for (; g <= x; ) {
      const u = g + x >> 1, h = n[u].start - M;
      if (Math.abs(h) <= c) return u;
      h < 0 ? g = u + 1 : x = u - 1;
    }
    return -1;
  }, w = 7;
  for (const M of e) {
    const g = m(M.timestamp);
    if (g < 0 || g < a.firstIdx || g >= f) continue;
    const x = Oe(g, a.firstIdx, v), u = Ye(M.price, i, d.priceY0, d.priceY1);
    if (u < d.priceY0 || u > d.priceY1) continue;
    const h = M.color ?? (M.kind === "entry" ? l.markerEntry : l.markerExit);
    t.fillStyle = h, t.strokeStyle = l.panelBgSolid, t.lineWidth = 1, t.beginPath(), M.kind === "entry" ? (t.moveTo(x, u - w), t.lineTo(x - w, u + w - 1), t.lineTo(x + w, u + w - 1)) : (t.moveTo(x, u + w), t.lineTo(x - w, u - w + 1), t.lineTo(x + w, u - w + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function Mn(t, l, e, n, a, i = !1) {
  const d = e.max - e.min;
  if (d <= 0) return;
  const v = n.priceY1 - n.priceY0, s = i ? Math.max(2, Math.min(4, Math.round(v / 36))) : 6, c = dn(d, s), f = Math.ceil(e.min / c) * c, m = i ? rl : qe;
  t.font = i ? an : Xe, t.fillStyle = l.text, t.strokeStyle = l.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let w = f; w <= e.max; w += c) {
    const M = Ye(w, e, n.priceY0, n.priceY1);
    M < n.priceY0 || M > n.priceY1 || (t.beginPath(), t.moveTo(He, Math.round(M) + 0.5), t.lineTo(a - m, Math.round(M) + 0.5), t.stroke(), t.fillText(Ge(w), a - m + 3, M));
  }
  t.globalAlpha = 1;
}
function Sn(t, l, e, n, a, i) {
  if (n.count <= 0 || !e.length) return;
  const v = Math.max(1, Math.floor(n.count / 6));
  t.font = Xe, t.fillStyle = l.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const s = Math.min(e.length, n.firstIdx + n.count);
  for (let c = n.firstIdx; c < s; c += v) {
    const f = e[c];
    if (!f) continue;
    const m = Oe(c, n.firstIdx, a);
    t.fillText($t(f.start), m, i - Ht + 4);
  }
  t.globalAlpha = 1;
}
function Tn(t, l, e, n, a, i, d, v, s) {
  const c = Math.floor((v.x - He) / d), f = Math.max(0, Math.min(e.length - 1, n.firstIdx + c)), m = e[f];
  if (!m) return;
  const w = Oe(f, n.firstIdx, d);
  t.save(), t.strokeStyle = l.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(w) + 0.5, i.priceY0), t.lineTo(Math.round(w) + 0.5, i.volumeY1 || i.priceY1), t.stroke();
  const M = Math.max(i.priceY0, Math.min(i.priceY1, v.y));
  t.beginPath(), t.moveTo(He, Math.round(M) + 0.5), t.lineTo(s - qe, Math.round(M) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const g = a.max - a.min;
  if (g > 0) {
    const h = a.max - (M - i.priceY0) / (i.priceY1 - i.priceY0) * g, L = Ge(h);
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const R = t.measureText(L).width, O = 4, S = 2;
    t.fillStyle = l.accent, t.fillRect(s - qe + 2, M - 7 - S, R + O * 2, 14 + S * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(L, s - qe + 2 + O, M);
  }
  t.font = Xe, t.textBaseline = "top", t.textAlign = "center";
  const x = $t(m.start), u = t.measureText(x).width;
  t.fillStyle = l.accent, t.fillRect(w - u / 2 - 4, i.volumeY1 + 2, u + 8, 14), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(x, w, i.volumeY1 + 4), t.restore();
}
const Lt = 0.25, Rt = 6, Cn = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, kn = /* @__PURE__ */ at({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: nn },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(t) {
    const l = t, e = W(null), n = W(null), a = { ...Me }, i = W(0), d = W(0), v = W(0), s = W(1), c = W(null), f = te(() => Math.max(1, l.slotW * s.value));
    let m = null, w = !1, M, g, x, u, h;
    const L = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Ft}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Bt}

  void main() {
    vec2 lensUV = applyLens(vUv);
    vec2 uv     = barrel(lensUV);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }

    vec4 color = texture2D(uTex, uv);

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;   // softened falloff — see CathodeLog for rationale
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    ${_t}

    gl_FragColor = color;
  }
`;
    function R() {
      if (!(!n.value || !e.value)) {
        if (h = document.createElement("canvas"), l.flat) {
          w = !0, O();
          return;
        }
        try {
          m = new q.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0 });
        } catch {
          w = !0;
        }
        if (!w && !m.getContext() && (m.dispose(), m = null, w = !0), w) {
          O();
          return;
        }
        m.setPixelRatio(1), m.setClearColor(0, 0), M = new q.Scene(), g = new q.OrthographicCamera(-1, 1, 1, -1, 0, 1), u = new q.CanvasTexture(h), u.minFilter = q.LinearFilter, u.magFilter = q.LinearFilter, x = new q.ShaderMaterial({
          uniforms: {
            uTex: { value: u },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Yt()
          },
          vertexShader: Cn,
          fragmentShader: L,
          transparent: !0
        }), M.add(new q.Mesh(new q.PlaneGeometry(2, 2), x)), O();
      }
    }
    function O() {
      if (!e.value || !m && !w) return;
      const k = e.value.clientWidth, $ = e.value.clientHeight;
      !k || !$ || !(h.width !== k || h.height !== $) || (h.width = k, h.height = $, i.value = k, d.value = $, m ? (u && (u.dispose(), u = new q.CanvasTexture(h), u.minFilter = q.LinearFilter, u.magFilter = q.LinearFilter, x && (x.uniforms.uTex.value = u)), m.setPixelRatio(window.devicePixelRatio || 1), m.setSize(k, $)) : n.value && (n.value.width = k, n.value.height = $, n.value.style.width = k + "px", n.value.style.height = $ + "px"), S());
    }
    function S() {
      if (!(h != null && h.width)) return;
      if (w) {
        if (!n.value) return;
        el(h, {
          candles: l.candles,
          slotW: f.value,
          scrollX: v.value,
          theme: l.theme,
          glow: !1,
          showVolume: l.showVolume,
          volumeFraction: l.volumeFraction,
          hover: c.value,
          overlays: l.overlays,
          markers: l.markers,
          compact: l.compact,
          colors: l.colors
        });
        const $ = n.value.getContext("2d");
        $ && ($.clearRect(0, 0, n.value.width, n.value.height), $.drawImage(h, 0, 0));
        return;
      }
      if (!m || !x || !u) return;
      const k = l.theme === "paper";
      x.uniforms.uStrength.value = l.curvature / 45 * 0.55, x.uniforms.uScanlines.value = l.scanlines && !k ? 1 : 0, x.uniforms.uVignette.value = k ? 0 : 1, Wt(x, l.magnify, a, h.width, h.height), el(h, {
        candles: l.candles,
        slotW: f.value,
        scrollX: v.value,
        theme: l.theme,
        glow: l.glow,
        showVolume: l.showVolume,
        volumeFraction: l.volumeFraction,
        hover: c.value,
        overlays: l.overlays,
        markers: l.markers,
        compact: l.compact,
        colors: l.colors
      }), u.needsUpdate = !0, m.render(M, g);
    }
    N(() => l.theme, () => S()), N(() => l.curvature, () => S()), N(() => l.scanlines, () => S()), N(() => l.glow, () => S()), N(() => l.showVolume, () => S()), N(() => l.volumeFraction, () => S()), N(() => l.slotW, () => S()), N(() => l.candles, () => S(), { deep: !1 }), N(() => l.overlays, () => S(), { deep: !1 }), N(() => l.markers, () => S(), { deep: !1 }), N(() => l.compact, () => S()), N(() => l.magnify, (k) => {
      k || (a.x = Me.x, a.y = Me.y), S();
    }), N(() => l.colors, () => S(), { deep: !0 }), N(() => l.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), N(v, () => S()), N(s, () => S()), N(c, () => S()), N(f, () => S());
    let _ = null, D = null, H = 0;
    const F = bt("cathodeResetTick", W(0));
    N(F, () => Q());
    function Q() {
      cancelAnimationFrame(H), H = requestAnimationFrame(O);
    }
    function j(k) {
      k.preventDefault();
    }
    function U() {
      m == null || m.dispose(), m = null, w = !1, R();
    }
    function Z(k) {
      if (!n.value) return [-1, -1];
      const $ = n.value.getBoundingClientRect();
      return [k.clientX - $.left, k.clientY - $.top];
    }
    function B(k) {
      var Ce;
      const $ = f.value;
      if ($ <= 0) return 0;
      const ne = ((Ce = l.candles) == null ? void 0 : Ce.length) ?? 0, be = Math.max(1, Math.floor((i.value || 1) / $)), xe = Math.max(0, ne - be);
      return Math.max(0, Math.min(k, xe * $));
    }
    function V(k) {
      var be;
      if (k.deltaX !== 0 || k.shiftKey && k.deltaY !== 0) {
        const xe = k.deltaX !== 0 ? k.deltaX : k.deltaY;
        v.value = B(v.value + xe);
        return;
      }
      if (k.deltaY === 0) return;
      const [$] = Z(k), ne = f.value;
      if ($ >= 0 && ne > 0 && ((be = l.candles) != null && be.length)) {
        const xe = Math.max(1, Math.floor((i.value || 1) / ne)), De = Math.max(0, l.candles.length - xe - Math.floor(v.value / ne)) + ($ - 8) / ne, $e = Math.exp(-k.deltaY * 15e-4), Ue = Math.max(Lt, Math.min(Rt, s.value * $e));
        s.value = Ue;
        const Ve = l.slotW * Ue, ke = Math.max(1, Math.floor((i.value || 1) / Ve)), ee = De - ($ - 8) / Ve, ze = Math.max(0, l.candles.length - ke - ee);
        v.value = B(ze * Ve);
      } else {
        const xe = Math.exp(-k.deltaY * 15e-4);
        s.value = Math.max(Lt, Math.min(Rt, s.value * xe));
      }
    }
    let z = !1, Y = 0, X = 0;
    function P(k) {
      k.button === 0 && (z = !0, Y = k.clientX, X = v.value, c.value = null, e.value && e.value.focus());
    }
    function b(k) {
      const $ = Math.exp(k * 0.18);
      s.value = Math.max(Lt, Math.min(Rt, s.value * $)), v.value = B(v.value);
    }
    function K(k) {
      const $ = f.value, ne = k.shiftKey ? 20 : 3;
      switch (k.key) {
        case "ArrowLeft":
          k.preventDefault(), v.value = B(v.value + $ * ne);
          break;
        case "ArrowRight":
          k.preventDefault(), v.value = B(v.value - $ * ne);
          break;
        case "ArrowUp":
          k.preventDefault(), b(1);
          break;
        case "ArrowDown":
          k.preventDefault(), b(-1);
          break;
        case "Home":
          k.preventDefault(), v.value = B(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          k.preventDefault(), v.value = 0;
          break;
      }
    }
    function le(k) {
      if (z) {
        const $ = k.clientX - Y;
        v.value = B(X + $);
        return;
      }
    }
    function ce() {
      z = !1;
    }
    function re(k) {
      if (l.magnify && n.value) {
        const be = zt(k, n.value);
        a.x = be.x, a.y = be.y, S();
      }
      if (z) return;
      const [$, ne] = Z(k);
      if ($ < 0 || ne < 0) {
        c.value = null;
        return;
      }
      c.value = { x: $, y: ne };
    }
    function he() {
      c.value = null, a.x = Me.x, a.y = Me.y, S();
    }
    Ze(() => {
      document.addEventListener("mousemove", le), document.addEventListener("mouseup", ce), We(() => {
        var k;
        R(), n.value && (n.value.addEventListener("webglcontextlost", j), n.value.addEventListener("webglcontextrestored", U)), e.value && (_ = new ResizeObserver(() => O()), _.observe(e.value), D = new IntersectionObserver(($) => {
          $.some((ne) => ne.isIntersecting) && Q();
        }), D.observe(e.value)), window.addEventListener("resize", Q), (k = window.visualViewport) == null || k.addEventListener("resize", Q);
      });
    }), it(() => {
      var k, $, ne;
      document.removeEventListener("mousemove", le), document.removeEventListener("mouseup", ce), (k = n.value) == null || k.removeEventListener("webglcontextlost", j), ($ = n.value) == null || $.removeEventListener("webglcontextrestored", U), _ == null || _.disconnect(), D == null || D.disconnect(), window.removeEventListener("resize", Q), (ne = window.visualViewport) == null || ne.removeEventListener("resize", Q), cancelAnimationFrame(H), m == null || m.dispose();
    });
    const oe = te(() => wt[l.theme] ?? wt.none), fe = te(() => ({
      background: oe.value.bg
    }));
    return (k, $) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Fe(fe.value),
      tabindex: "0",
      onKeydown: K
    }, [
      ie("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-candle-canvas",
        onWheel: Ne(V, ["prevent"]),
        onMousedown: P,
        onMousemove: re,
        onMouseleave: he
      }, null, 544)
    ], 36));
  }
}), Zn = /* @__PURE__ */ rt(kn, [["__scopeId", "data-v-1752ef06"]]), Vt = W(0), Et = 28, nt = 12;
let At = 10, yt = "cathode.layout", xt = !1;
const ye = W({});
function In(t, l = "cathode.layout") {
  if (!xt) {
    xt = !0, yt = l;
    try {
      const e = localStorage.getItem(yt);
      if (e) {
        ye.value = JSON.parse(e), tl();
        return;
      }
    } catch {
    }
    ye.value = { ...t }, tl();
  }
}
function tl() {
  let t = 10;
  for (const l of Object.values(ye.value))
    typeof (l == null ? void 0 : l.zIndex) == "number" && l.zIndex > t && (t = l.zIndex);
  At = t;
}
function Je() {
  localStorage.setItem(yt, JSON.stringify(ye.value));
}
function Ln(t) {
  xt = !1, localStorage.removeItem(yt), ye.value = { ...t }, Je(), xt = !0, Vt.value++;
}
function cl(t) {
  At++, ye.value[t] && (ye.value[t].zIndex = At);
}
function Rn(t, l) {
  ye.value[t].visible = l, Je();
}
function Dn(t, l) {
  ye.value[t].minimized = l, l && (ye.value[t].maximized = !1), Je();
}
function En(t, l) {
  ye.value[t].maximized = l, l && (ye.value[t].minimized = !1, cl(t)), Je();
}
function An(t, l, e) {
  ye.value[t].x = Math.round(l), ye.value[t].y = Math.round(e), Je();
}
function Fn(t, l, e) {
  ye.value[t].w = Math.round(l), ye.value[t].h = Math.round(e), Je();
}
function Jn(t, l, e) {
  const n = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / n), i = Math.floor((t - nt * (n + 1)) / n), d = Math.floor((l - nt * (a + 1)) / a), v = {};
  return e.forEach((s, c) => {
    const f = c % n, m = Math.floor(c / n);
    v[s] = {
      x: nt + f * (i + nt),
      y: nt + m * (d + nt),
      w: i,
      h: d,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: c + 1
    };
  }), v;
}
function ul() {
  return {
    containers: ye,
    TITLEBAR_H: Et,
    load: In,
    save: Je,
    reset: Ln,
    bringToFront: cl,
    setVisible: Rn,
    setMinimized: Dn,
    setMaximized: En,
    updatePos: An,
    updateSize: Fn
  };
}
const Bn = { class: "ws-toolbar" }, _n = {
  key: 0,
  class: "ws-restore-menu"
}, Yn = {
  key: 0,
  class: "ws-restore-empty"
}, Wn = ["onClick"], zn = /* @__PURE__ */ at({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const l = t, { containers: e, load: n, reset: a, setVisible: i } = ul(), d = W(null);
    Gt("cathodeWorkspace", d), Gt("cathodeResetTick", Vt), Ze(() => {
      if (!d.value) return;
      const { clientWidth: u, clientHeight: h } = d.value, L = l.initialLayout ?? {};
      n(L, l.storageKey ?? "cathode.layout");
      const R = Object.keys(e.value)[0];
      R && v(R);
    });
    function v(u) {
      var L;
      document.querySelectorAll(".cc").forEach((R) => R.classList.remove("cc-focused"));
      const h = (L = d.value) == null ? void 0 : L.querySelector(`#cc-${u}`);
      h && h.classList.add("cc-focused");
    }
    function s() {
      !d.value || !l.initialLayout || a(l.initialLayout);
    }
    function c(u) {
      const h = u.target.closest(".cc");
      h && (document.querySelectorAll(".cc").forEach((L) => L.classList.remove("cc-focused")), h.classList.add("cc-focused"));
    }
    const f = W(!1), m = () => Object.entries(e.value).filter(([, u]) => !u.visible).map(([u]) => u);
    function w(u) {
      i(u, !0), f.value = !1;
    }
    function M(u) {
      if (!f.value) return;
      const h = u.target;
      !h.closest(".ws-restore-menu") && !h.closest(".ws-btn-restore") && (f.value = !1);
    }
    function g(u) {
      u.key === "Escape" && (f.value = !1);
    }
    Ze(() => {
      document.addEventListener("click", M), document.addEventListener("keydown", g);
    }), it(() => {
      document.removeEventListener("click", M), document.removeEventListener("keydown", g);
    });
    function x(u) {
      var h;
      return ((h = l.containerTitles) == null ? void 0 : h[u]) ?? u;
    }
    return (u, h) => (pe(), we("div", {
      ref_key: "workspaceEl",
      ref: d,
      class: "cathode-workspace",
      onMousedown: c
    }, [
      Dt(u.$slots, "default", {}, void 0, !0),
      Dt(u.$slots, "overlay", {}, void 0, !0),
      ie("div", Bn, [
        t.initialLayout ? (pe(), we("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: s
        }, " ↺ Reset Layout ")) : _e("", !0),
        h[1] || (h[1] = ie("div", { class: "ws-sep" }, null, -1)),
        ie("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: h[0] || (h[0] = (L) => f.value = !f.value)
        }, " ⊞ Restore Panel ")
      ]),
      nl(Tl, { name: "menu" }, {
        default: Cl(() => [
          f.value ? (pe(), we("div", _n, [
            h[3] || (h[3] = ie("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            m().length ? _e("", !0) : (pe(), we("div", Yn, " No closed panels ")),
            (pe(!0), we(kl, null, Il(m(), (L) => (pe(), we("div", {
              key: L,
              class: "ws-restore-item",
              onClick: (R) => w(L)
            }, [
              h[2] || (h[2] = ie("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Ll(" " + Be(x(L)), 1)
            ], 8, Wn))), 128))
          ])) : _e("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Qn = /* @__PURE__ */ rt(zn, [["__scopeId", "data-v-5838d04b"]]), Pn = ["id"], Hn = { class: "cc-title" }, $n = {
  key: 0,
  class: "cc-size-badge"
}, Vn = { class: "cc-controls" }, Nn = ["title"], Xn = { class: "cc-body" }, On = 200, Un = 80, ll = 60, Kn = /* @__PURE__ */ at({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const l = t, { containers: e, bringToFront: n, setVisible: a, setMinimized: i, setMaximized: d, updatePos: v, updateSize: s } = ul(), c = bt("cathodeWorkspace", W(null)), f = te(() => e.value[l.id]), m = te(() => {
      const b = f.value, K = l.curvature ?? 0;
      if (!b) return {};
      const le = { "--curvature": K };
      return b.maximized ? { ...le, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: b.zIndex } : {
        ...le,
        left: b.x + "px",
        top: b.y + "px",
        width: b.w + "px",
        height: b.minimized ? Et + "px" : b.h + "px",
        zIndex: b.zIndex,
        display: b.visible ? "flex" : "none"
      };
    });
    let w = !1, M = 0, g = 0;
    function x(b) {
      var ce;
      if (b.target.closest(".cc-btn") || f.value.maximized) return;
      n(l.id), w = !0;
      const K = (ce = c.value) == null ? void 0 : ce.querySelector(`#cc-${l.id}`);
      if (!K) return;
      const le = K.getBoundingClientRect();
      M = b.clientX - le.left, g = b.clientY - le.top, document.addEventListener("mousemove", u), document.addEventListener("mouseup", h), b.preventDefault();
    }
    function u(b) {
      var he;
      if (!w || !c.value) return;
      const K = c.value.getBoundingClientRect(), le = ((he = f.value) == null ? void 0 : he.w) ?? 300;
      let ce = b.clientX - K.left - M, re = b.clientY - K.top - g;
      ce = Math.max(ll - le, Math.min(K.width - ll, ce)), re = Math.max(0, Math.min(K.height - Et, re)), v(l.id, ce, re);
    }
    function h() {
      w = !1, document.removeEventListener("mousemove", u), document.removeEventListener("mouseup", h);
    }
    let L = !1, R = 0, O = 0, S = 0, _ = 0;
    const D = W("");
    function H(b) {
      f.value.maximized || (n(l.id), L = !0, R = b.clientX, O = b.clientY, S = f.value.w, _ = f.value.h, document.addEventListener("mousemove", F), document.addEventListener("mouseup", Q), b.preventDefault(), b.stopPropagation());
    }
    function F(b) {
      if (!L) return;
      const K = Math.max(On, S + (b.clientX - R)), le = Math.max(Un, _ + (b.clientY - O));
      s(l.id, K, le), D.value = `${Math.round(K)}×${Math.round(le)}`;
    }
    function Q() {
      L = !1, D.value = "", document.removeEventListener("mousemove", F), document.removeEventListener("mouseup", Q), j.value++;
    }
    const j = W(0);
    N(Vt, () => {
      j.value++;
    }), it(() => {
      var b;
      document.removeEventListener("mousemove", u), document.removeEventListener("mouseup", h), document.removeEventListener("mousemove", F), document.removeEventListener("mouseup", Q), (b = U.value) == null || b.removeEventListener("scroll", B), V();
    });
    const U = W(null);
    function Z(b) {
      if (l.canvas) return [];
      const K = b.children[0];
      return K ? Array.from(K.children) : [];
    }
    function B() {
      const b = U.value, K = l.curvature ?? 0;
      if (!b) return;
      const le = Z(b);
      if (!le.length) return;
      const ce = b.clientHeight, re = ce / 2, he = K * 38e-4;
      le.forEach((oe) => {
        if (!oe.dataset.origFs) {
          const $e = getComputedStyle(oe);
          oe.dataset.origFs = $e.fontSize, oe.dataset.origLh = $e.lineHeight;
        }
        if (K === 0) {
          oe.style.fontSize = "", oe.style.lineHeight = "";
          return;
        }
        const fe = oe.getBoundingClientRect(), k = b.getBoundingClientRect(), $ = fe.top - k.top + fe.height / 2, ne = Math.min(1, Math.abs($ - re) / (ce / 2)), be = 1 + he * Math.cos(ne * Math.PI / 2), xe = parseFloat(oe.dataset.origFs), Ce = oe.dataset.origLh, De = Ce === "normal" ? xe * 1.4 : parseFloat(Ce);
        isNaN(xe) || (oe.style.fontSize = `${(xe * be).toFixed(2)}px`), isNaN(De) || (oe.style.lineHeight = `${(De * be).toFixed(2)}px`);
      });
    }
    function V() {
      const b = U.value;
      b && Z(b).forEach((K) => {
        K.style.fontSize = "", K.style.lineHeight = "", delete K.dataset.origFs, delete K.dataset.origLh;
      });
    }
    N(() => l.curvature, (b) => {
      (b ?? 0) === 0 ? V() : B();
    }), Ze(() => {
      var b;
      (b = U.value) == null || b.addEventListener("scroll", B, { passive: !0 }), We(B);
    });
    function z() {
      i(l.id, !f.value.minimized), We(() => {
        j.value++;
      });
    }
    function Y() {
      d(l.id, !f.value.maximized), We(() => {
        j.value++;
      });
    }
    function X() {
      a(l.id, !1);
    }
    function P() {
      n(l.id);
    }
    return (b, K) => f.value && f.value.visible ? (pe(), we("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: Rl(["cc", { "cc-minimized": f.value.minimized, "cc-maximized": f.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Fe(m.value),
      onMousedown: P
    }, [
      ie("div", {
        class: "cc-titlebar",
        onMousedown: x
      }, [
        K[0] || (K[0] = ie("span", { class: "cc-status-dot" }, null, -1)),
        ie("span", Hn, Be(t.title), 1),
        D.value ? (pe(), we("span", $n, Be(D.value), 1)) : _e("", !0),
        ie("div", Vn, [
          ie("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Ne(z, ["stop"])
          }, "─"),
          ie("button", {
            class: "cc-btn cc-btn-max",
            title: f.value.maximized ? "Restore" : "Maximize",
            onClick: Ne(Y, ["stop"])
          }, Be(f.value.maximized ? "⤡" : "⤢"), 9, Nn),
          ie("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Ne(X, ["stop"])
          }, "✕")
        ])
      ], 32),
      ol(ie("div", Xn, [
        ie("div", {
          ref_key: "bodyEl",
          ref: U,
          class: "cc-screen",
          onScroll: B
        }, [
          Dt(b.$slots, "default", { resizeKey: j.value }, void 0, !0),
          K[1] || (K[1] = ie("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Dl, !f.value.minimized]
      ]),
      !f.value.minimized && !f.value.maximized ? (pe(), we("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Ne(H, ["stop"])
      }, null, 32)) : _e("", !0)
    ], 46, Pn)) : _e("", !0);
  }
}), eo = /* @__PURE__ */ rt(Kn, [["__scopeId", "data-v-d8a49f79"]]);
export {
  wt as CANDLE_THEME_COLORS,
  Zn as CathodeCandle,
  eo as CathodeContainer,
  jn as CathodeGrid,
  en as CathodeLog,
  qn as CathodeTerminal,
  Qn as CathodeWorkspace,
  pt as LOG_THEME_COLORS,
  Jn as buildDefaultLayout,
  ul as useCathodeLayout
};
