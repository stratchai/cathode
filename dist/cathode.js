import { defineComponent as Je, ref as Y, reactive as St, computed as te, watch as O, inject as bt, nextTick as Ye, onMounted as Oe, onUnmounted as Qe, openBlock as ge, createElementBlock as pe, normalizeStyle as De, createElementVNode as oe, withModifiers as Ne, withKeys as Ml, createCommentVNode as Be, toDisplayString as _e, createVNode as nl, withDirectives as ol, vModelText as Sl, provide as Gt, renderSlot as Dt, Transition as Cl, withCtx as Tl, Fragment as kl, renderList as Il, createTextVNode as Ll, normalizeClass as Rl, vShow as Dl } from "vue";
import * as N from "three";
const rt = {
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
}, ve = 30, Ct = 12, El = 10, al = 28;
function Fl(t, l) {
  if (typeof l == "function") return l(t);
  const e = t.filter((o) => o != null && o !== "");
  if (l === "count") return e.length;
  const n = e.map((o) => Number(o)).filter((o) => !Number.isNaN(o));
  if (n.length === 0) return null;
  switch (l) {
    case "sum":
      return n.reduce((o, i) => o + i, 0);
    case "avg":
      return n.reduce((o, i) => o + i, 0) / n.length;
    case "min":
      return Math.min(...n);
    case "max":
      return Math.max(...n);
  }
}
function jt(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, o = t.height, i = rt[l.theme] ?? rt.none, { cols: f, rows: v, pinnedRows: s, rowHeight: r, scrollY: u, scrollX: h, glow: w } = l;
  e.clearRect(0, 0, n, o), e.fillStyle = i.bg, e.fillRect(0, 0, n, o), e.save(), e.beginPath(), e.rect(0, 0, n, o), e.clip();
  const S = s.length * r, p = l.aggregateRow ? al : 0, b = o - ve - S - p;
  e.fillStyle = i.headerBg, e.fillRect(0, 0, n, ve), e.textBaseline = "middle", e.textAlign = "left";
  let d = -h;
  for (let A = 0; A < f.length; A++) {
    const $ = f[A];
    if (d + $.width <= 0) {
      d += $.width;
      continue;
    }
    if (d >= n) break;
    const P = !!l.colFilters[$.colId], W = l.sortColId === $.colId, X = ($.colDef.headerName ?? $.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(d, 0, $.width, ve), e.clip(), e.font = `bold ${El}px system-ui, -apple-system, sans-serif`, e.fillStyle = P ? i.accent : i.textHeader, w ? (e.shadowColor = i.textHeader, e.shadowBlur = 10, e.fillText(X, d + 8, ve / 2), e.shadowBlur = 4, e.fillText(X, d + 8, ve / 2), e.shadowBlur = 0) : e.fillText(X, d + 8, ve / 2), W) {
      const H = e.measureText(X).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = i.accent, e.fillText(l.sortDir === "asc" ? "▲" : "▼", d + 8 + H + 4, ve / 2);
    }
    $.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = P ? i.accent : i.textHeader, e.globalAlpha = P ? 1 : 0.38, e.fillText("⌕", d + $.width - 20, ve / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(d + $.width - 0.5, 0), e.lineTo(d + $.width - 0.5, ve), e.stroke(), d += $.width;
  }
  e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, ve - 0.5), e.lineTo(n, ve - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ve, n, b), e.clip();
  const m = Math.max(0, Math.floor(u / r)), R = Math.min(v.length, Math.ceil((u + b) / r)), k = l.selectionAnchorRow ?? l.selectedRow, U = l.selectionAnchorCol ?? l.selectedCol, g = l.selectedRow >= 0 && k >= 0 ? Math.min(l.selectedRow, k) : -1, T = l.selectedRow >= 0 && k >= 0 ? Math.max(l.selectedRow, k) : -1, I = l.selectedCol >= 0 && U >= 0 ? Math.min(l.selectedCol, U) : -1, z = l.selectedCol >= 0 && U >= 0 ? Math.max(l.selectedCol, U) : -1, F = T > g || z > I;
  let J = Number.POSITIVE_INFINITY, G = Number.NEGATIVE_INFINITY, K = Number.POSITIVE_INFINITY, j = Number.NEGATIVE_INFINITY;
  for (let A = m; A < R; A++) {
    const $ = v[A], P = ve + A * r - u;
    A % 2 === 1 && (e.fillStyle = i.rowAlt, e.fillRect(0, P, n, r));
    const W = A >= g && A <= T;
    A === l.hoveredRow && !W && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, P, n, r)), W && !F && (e.fillStyle = Tt(i.accent, 0.1), e.fillRect(0, P, n, r)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, P + r - 0.5), e.lineTo(n, P + r - 0.5), e.stroke();
    let X = -h;
    for (let H = 0; H < f.length; H++) {
      const M = f[H];
      if (X + M.width <= 0) {
        X += M.width;
        continue;
      }
      if (X >= n) break;
      const q = W && H >= I && H <= z;
      q && F && (e.fillStyle = Tt(i.accent, 0.14), e.fillRect(X, P, M.width, r)), q && (X < J && (J = X), X + M.width > G && (G = X + M.width), P < K && (K = P), P + r > j && (j = P + r));
      const le = l.getCellStyle(M, $), ce = le.color ?? i.text, re = le.textAlign ?? "left", he = l.formatCell(M, $);
      e.save(), e.beginPath(), e.rect(X + 1, P, M.width - 2, r), e.clip(), e.font = `${Ct}px system-ui, -apple-system, sans-serif`, e.fillStyle = ce, e.textBaseline = "middle";
      const ae = re === "right" ? X + M.width - 8 : X + 8;
      e.textAlign = re === "right" ? "right" : "left";
      const fe = P + r / 2;
      w ? (e.shadowColor = ce, e.shadowBlur = 12, e.fillText(he, ae, fe), e.shadowBlur = 6, e.fillText(he, ae, fe), e.shadowBlur = 2, e.fillText(he, ae, fe), e.shadowBlur = 0) : e.fillText(he, ae, fe), e.restore(), A === l.selectedRow && H === l.selectedCol && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(X + 1.5, P + 1.5, M.width - 3, r - 3)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(X + M.width - 0.5, P), e.lineTo(X + M.width - 0.5, P + r), e.stroke(), X += M.width;
    }
  }
  if (F && J < G && K < j && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(J + 0.5, K + 0.5, G - J - 1, j - K - 1)), e.restore(), s.length > 0) {
    const A = o - S - p;
    e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, A - 0.5), e.lineTo(n, A - 0.5), e.stroke();
    for (let $ = 0; $ < s.length; $++) {
      const P = s[$], W = A + $ * r;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, W, n, r);
      let X = -h;
      for (let H = 0; H < f.length; H++) {
        const M = f[H];
        if (X + M.width <= 0) {
          X += M.width;
          continue;
        }
        if (X >= n) break;
        const q = l.getCellStyle(M, P), le = q.color ?? i.text, ce = q.textAlign ?? "left", re = l.formatCell(M, P);
        e.save(), e.beginPath(), e.rect(X + 1, W, M.width - 2, r), e.clip(), e.font = `bold ${Ct}px system-ui, -apple-system, sans-serif`, e.fillStyle = le, e.textBaseline = "middle", ce === "right" ? (e.textAlign = "right", e.fillText(re, X + M.width - 8, W + r / 2)) : (e.textAlign = "left", e.fillText(re, X + 8, W + r / 2)), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(X + M.width - 0.5, W), e.lineTo(X + M.width - 0.5, W + r), e.stroke(), X += M.width;
      }
      e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, W + r - 0.5), e.lineTo(n, W + r - 0.5), e.stroke();
    }
  }
  if (l.aggregateRow) {
    const A = o - p;
    e.fillStyle = Tt(i.accent, 0.1), e.fillRect(0, A, n, p), e.strokeStyle = i.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, A - 0.5), e.lineTo(n, A - 0.5), e.stroke();
    let $ = -h;
    for (let P = 0; P < f.length; P++) {
      const W = f[P];
      if ($ + W.width <= 0) {
        $ += W.width;
        continue;
      }
      if ($ >= n) break;
      const H = l.getCellStyle(W, l.aggregateRow).textAlign ?? "left", M = l.aggregateRow[W.colId] ?? "";
      e.save(), e.beginPath(), e.rect($ + 1, A, W.width - 2, p), e.clip(), e.font = `bold ${Ct}px system-ui, -apple-system, sans-serif`, e.fillStyle = i.accent, e.textBaseline = "middle", w && (e.shadowColor = i.accent, e.shadowBlur = 8), H === "right" ? (e.textAlign = "right", e.fillText(M, $ + W.width - 8, A + p / 2)) : (e.textAlign = "left", e.fillText(M, $ + 8, A + p / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo($ + W.width - 0.5, A), e.lineTo($ + W.width - 0.5, A + p), e.stroke(), $ += W.width;
    }
  }
  e.restore();
}
function Tt(t, l) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${l})`);
  const e = parseInt(t.slice(1, 3), 16), n = parseInt(t.slice(3, 5), 16), o = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${n},${o},${l})`;
}
function Al(t, l, e) {
  const n = t - 0.5, o = l - 0.5, i = (n * n + o * o) * e, f = n * (1 + i) * i, v = o * (1 + i) * i;
  return [t + f, l + v * 0.15];
}
function _l(t, l, e, n, o) {
  const i = t / e, f = 1 - l / n, [v, s] = Al(i, f, o);
  return v < 0 || v > 1 || s < 0 || s > 1 ? [-1, -1] : [v * e, (1 - s) * n];
}
function kt(t, l) {
  let e = 0;
  for (let n = 0; n < t; n++) e += l[n].width;
  return e;
}
function Bl(t, l, e) {
  return t >= l + e - 24 && t < l + e;
}
function qt(t, l, e) {
  const n = l + e;
  return t >= n - 6 && t <= n + 1;
}
function Zt(t, l, e, n, o, i, f, v, s, r = !1) {
  const u = t + s;
  let h = -1, w = 0;
  for (let m = 0; m < e.length; m++) {
    if (u >= w && u < w + e[m].width) {
      h = m;
      break;
    }
    w += e[m].width;
  }
  if (l < ve) return { area: "header", colIdx: h, rowIdx: -1 };
  const S = r ? al : 0;
  if (S > 0 && l >= f - S)
    return { area: "agg", colIdx: h, rowIdx: -1 };
  const p = v * o;
  if (p > 0 && l >= f - p - S) {
    const m = Math.floor((l - (f - p - S)) / o);
    return { area: "pinned", colIdx: h, rowIdx: m };
  }
  const b = l - ve + i, d = Math.floor(b / o);
  return d >= 0 && d < n ? { area: "body", colIdx: h, rowIdx: d } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const Wl = 500, Yl = Wl / 2, zl = 1.6, At = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, _t = `
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
`, Bt = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function Wt() {
  return {
    uMouseUV: { value: new N.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: zl },
    uLensTint: { value: new N.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Me = { x: -999, y: -999 };
function Yt(t, l, e, n, o) {
  const i = l && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = i && o > 0 ? Yl / o : 0, t.uniforms.uAspect.value = o > 0 ? n / o : 1;
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
`, Nl = 28, Ol = 600, Xl = /* @__PURE__ */ Je({
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
    const e = t, n = l, o = Y(e.rowData ?? []), i = Y(e.pinnedBottomRowData ?? []), f = Y(""), v = Y(null), s = St({}), r = St({}), u = St(/* @__PURE__ */ new Set()), h = Y(0), w = Y(0), S = Y(0), p = Y(0), b = Y(0), d = Y(-1), m = Y(null), R = Y(null), k = Y(null), U = { ...Me }, g = Y({ x: 0, y: ve }), T = Y("");
    function I(a) {
      return a.colId ?? a.field ?? (a.headerName ? a.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const z = te(() => {
      const a = e.defaultColDef ?? {};
      return e.columnDefs.filter((c) => !u.has(I(c))).map((c) => {
        const x = I(c), L = { ...a, ...c };
        return { colId: x, colDef: L, width: r[x] ?? L.width ?? 100 };
      });
    }), F = te(() => {
      const a = w.value;
      if (!a) return z.value;
      const c = z.value.reduce((C, E) => C + E.width, 0);
      if (!c || c >= a) return z.value;
      const x = a / c;
      let L = 0;
      return z.value.map((C, E) => {
        const Z = E === z.value.length - 1 ? a - L : Math.max(8, Math.round(C.width * x));
        return L += Z, { ...C, width: Z };
      });
    }), J = te(() => {
      const a = F.value.reduce((c, x) => c + x.width, 0);
      return Math.max(0, a - w.value);
    }), G = te(() => {
      const a = i.value.length * e.rowHeight;
      return Math.max(0, S.value - ve - a);
    }), K = te(
      () => Math.max(0, H.value.length * e.rowHeight - G.value)
    ), j = te(
      () => Math.max(1, Math.floor(G.value / e.rowHeight))
    ), A = te(
      () => H.value.length === 0 ? 0 : Math.min(H.value.length - 1, Math.floor(p.value / e.rowHeight))
    ), $ = te(
      () => Math.min(H.value.length - 1, A.value + j.value - 1)
    );
    function P(a, c) {
      if (c.colDef.valueGetter) return c.colDef.valueGetter({ data: a, colDef: c.colDef });
      if (c.colDef.field) return a[c.colDef.field];
    }
    function W(a, c) {
      const x = P(c, a);
      return a.colDef.valueFormatter ? a.colDef.valueFormatter({ value: x, data: c, colDef: a.colDef }) ?? "" : a.colDef.cellRenderer ? (a.colDef.cellRenderer({ value: x, data: c, colDef: a.colDef }) ?? "").replace(/<[^>]+>/g, "") : x == null ? "" : String(x);
    }
    function X(a, c) {
      return a.colDef.cellStyle ? typeof a.colDef.cellStyle == "function" ? a.colDef.cellStyle({ value: P(c, a), data: c, colDef: a.colDef }) ?? {} : a.colDef.cellStyle : {};
    }
    const H = te(() => {
      h.value;
      let a = o.value;
      const c = f.value.trim().toLowerCase();
      c && (a = a.filter(
        (x) => z.value.some(
          (L) => String(P(x, L) ?? "").toLowerCase().includes(c)
        )
      ));
      for (const [x, L] of Object.entries(s)) {
        if (!L) continue;
        const C = z.value.find((E) => E.colId === x);
        if (C)
          if (L.startsWith("__eq__")) {
            const E = L.slice(6).toLowerCase();
            a = a.filter((B) => String(P(B, C) ?? "").toLowerCase() === E);
          } else {
            const E = L.toLowerCase();
            a = a.filter((B) => String(P(B, C) ?? "").toLowerCase().includes(E));
          }
      }
      if (v.value) {
        const { colId: x, dir: L } = v.value, C = z.value.find((E) => E.colId === x);
        C && (a = [...a].sort((E, B) => {
          const Z = P(E, C), ue = P(B, C);
          let me = 0;
          return C.colDef.comparator ? me = C.colDef.comparator(Z, ue) : typeof Z == "number" && typeof ue == "number" ? me = Z - ue : me = String(Z ?? "").localeCompare(String(ue ?? ""), void 0, { numeric: !0 }), L === "asc" ? me : -me;
        }));
      }
      return a;
    }), M = te(() => {
      const a = z.value.filter((C) => C.colDef.aggFunc != null);
      if (a.length === 0) return null;
      const c = H.value, x = {};
      for (const C of a) {
        const E = c.map((Z) => P(Z, C)), B = Fl(E, C.colDef.aggFunc);
        if (B == null) {
          x[C.colId] = "";
          continue;
        }
        x[C.colId] = C.colDef.aggValueFormatter ? C.colDef.aggValueFormatter(B) : String(B);
      }
      const L = a[0].colId;
      return x[L] === "" && (x[L] = "Σ"), x;
    });
    O(H, () => {
      p.value = 0, m.value = null;
    }), O(J, () => {
      b.value = Math.min(b.value, J.value);
    }), O(K, () => {
      p.value = Math.min(p.value, K.value);
    });
    function q(a) {
      const c = a * e.rowHeight, x = c + e.rowHeight;
      c < p.value ? p.value = c : x > p.value + G.value && (p.value = Math.min(K.value, x - G.value));
    }
    function le() {
      p.value = Math.max(0, p.value - G.value), ie();
    }
    function ce() {
      p.value = Math.min(K.value, p.value + G.value), ie();
    }
    let re = !1, he = "", ae = 0, fe = 0, D = !1, V = !1, ne = 0, be = 0, xe = 0, Te = 0, Ee = !1;
    function $e(a, c) {
      var x;
      re = !0, he = a, ae = c, fe = ((x = F.value.find((L) => L.colId === a)) == null ? void 0 : x.width) ?? 100, D = !1;
    }
    function Ke(a) {
      if (V) {
        const E = ne - a.clientX, B = be - a.clientY;
        (Math.abs(E) > 4 || Math.abs(B) > 4) && (Ee = !0), b.value = Math.max(0, Math.min(J.value, xe + E)), p.value = Math.max(0, Math.min(K.value, Te + B)), ie();
        return;
      }
      if (!re) return;
      const c = w.value, x = Math.max(30, fe + (a.clientX - ae)), L = z.value.filter((E) => E.colId !== he).reduce((E, B) => E + B.width, 0), C = c - x;
      C > 10 && (r[he] = Math.max(10, Math.round(x * L / C))), ie();
    }
    function Ve() {
      V && (Ee && (D = !0), V = !1), re && (re = !1, D = !0, n("column-resized"));
    }
    const ke = Y(null), ee = Y(null), ze = bt("cathodeResetTick", Y(0));
    O(ze, () => nt());
    let se = null, Pe = !1, Fe, st, Ce, Se, de;
    const y = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${At}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${_t}

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

    ${Bt}

    gl_FragColor = color;
  }
`;
    function _() {
      if (!(!ee.value || !ke.value)) {
        de = document.createElement("canvas");
        try {
          se = new N.WebGLRenderer({ canvas: ee.value, antialias: !1, alpha: !0 });
        } catch {
          Pe = !0;
        }
        if (!Pe && !se.getContext() && (se.dispose(), se = null, Pe = !0), Pe) {
          Q();
          return;
        }
        se.setPixelRatio(1), se.setClearColor(0, 0), Fe = new N.Scene(), st = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), Se = new N.CanvasTexture(de), Se.minFilter = N.LinearFilter, Se.magFilter = N.LinearFilter, Ce = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: Se },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new N.Color(0) },
            ...Wt()
          },
          vertexShader: Vl,
          fragmentShader: y,
          transparent: !0
        }), Fe.add(new N.Mesh(new N.PlaneGeometry(2, 2), Ce)), Q();
      }
    }
    function Q() {
      if (!ke.value || !se && !Pe) return;
      const a = ke.value.clientWidth, c = ke.value.clientHeight - (e.pagination ? Nl : 0);
      if (!a || !c) return;
      const x = de.width !== a || de.height !== c;
      de.width = a, de.height = c, w.value = a, S.value = c, b.value = Math.max(0, Math.min(J.value, b.value)), p.value = Math.max(0, Math.min(K.value, p.value)), se ? (x && Se && (Se.dispose(), Se = new N.CanvasTexture(de), Se.minFilter = N.LinearFilter, Se.magFilter = N.LinearFilter, Ce && (Ce.uniforms.uTex.value = Se)), se.setPixelRatio(window.devicePixelRatio || 1), se.setSize(a, c)) : ee.value && (ee.value.width = a, ee.value.height = c, ee.value.style.width = a + "px", ee.value.style.height = c + "px"), ie();
    }
    function ie() {
      var x, L, C, E, B, Z, ue, me, ot, ft, dt, at;
      if (!(de != null && de.width)) return;
      if (Pe) {
        if (!ee.value) return;
        jt(de, {
          cols: F.value,
          rows: H.value,
          pinnedRows: i.value,
          rowHeight: e.rowHeight,
          scrollY: p.value,
          scrollX: b.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((x = v.value) == null ? void 0 : x.colId) ?? null,
          sortDir: ((L = v.value) == null ? void 0 : L.dir) ?? null,
          colFilters: s,
          hoveredRow: d.value,
          selectedRow: ((C = m.value) == null ? void 0 : C.row) ?? -1,
          selectedCol: ((E = m.value) == null ? void 0 : E.col) ?? -1,
          selectionAnchorRow: ((B = R.value) == null ? void 0 : B.row) ?? -1,
          selectionAnchorCol: ((Z = R.value) == null ? void 0 : Z.col) ?? -1,
          formatCell: W,
          getCellStyle: X
        });
        const vt = ee.value.getContext("2d");
        vt && vt.drawImage(de, 0, 0);
        return;
      }
      if (!se || !Ce || !Se) return;
      const a = rt[e.theme] ?? rt.none, c = e.theme === "paper";
      Ce.uniforms.uStrength.value = e.curvature / 45 * 0.55, Ce.uniforms.uScanlines.value = e.scanlines && !c ? 1 : 0, Ce.uniforms.uVignette.value = c ? 0 : 1, Ce.uniforms.uBezel.value.set(a.bg), Yt(Ce, e.magnify, U, de.width, de.height), jt(de, {
        cols: F.value,
        rows: H.value,
        pinnedRows: i.value,
        rowHeight: e.rowHeight,
        scrollY: p.value,
        scrollX: b.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((ue = v.value) == null ? void 0 : ue.colId) ?? null,
        sortDir: ((me = v.value) == null ? void 0 : me.dir) ?? null,
        colFilters: s,
        hoveredRow: d.value,
        selectedRow: ((ot = m.value) == null ? void 0 : ot.row) ?? -1,
        selectedCol: ((ft = m.value) == null ? void 0 : ft.col) ?? -1,
        selectionAnchorRow: ((dt = R.value) == null ? void 0 : dt.row) ?? -1,
        selectionAnchorCol: ((at = R.value) == null ? void 0 : at.col) ?? -1,
        formatCell: W,
        getCellStyle: X,
        aggregateRow: M.value
      }), Se.needsUpdate = !0, se.render(Fe, st);
    }
    function Re(a) {
      if (!ee.value) return [-1, -1];
      const c = ee.value.getBoundingClientRect(), x = a.clientX - c.left, L = a.clientY - c.top, C = ee.value.width || c.width, E = ee.value.height || c.height, B = e.curvature / 45 * 0.55, [Z, ue] = _l(x, L, C, E, B);
      return Z < 0 ? [-1, -1] : [Z, ue];
    }
    let Ie = 0;
    function Ae(a) {
      k.value = null;
      const c = Date.now();
      if (a.deltaX !== 0) {
        Ie = c, b.value = Math.max(0, Math.min(J.value, b.value + a.deltaX)), ie();
        return;
      }
      if (a.shiftKey && a.deltaY !== 0) {
        Ie = c, b.value = Math.max(0, Math.min(J.value, b.value + a.deltaY)), ie();
        return;
      }
      c - Ie < Ol || (p.value = Math.max(0, Math.min(K.value, p.value + a.deltaY)), ie());
    }
    function lt(a) {
      if (re) return;
      if (e.magnify && ee.value) {
        const C = zt(a, ee.value);
        U.x = C.x, U.y = C.y;
      }
      const [c, x] = Re(a);
      if (c < 0) {
        d.value = -1, ie();
        return;
      }
      const L = Zt(
        c,
        x,
        F.value,
        H.value.length,
        e.rowHeight,
        p.value,
        de.height,
        i.value.length,
        b.value,
        M.value !== null
      );
      if (d.value = L.area === "body" ? L.rowIdx : -1, L.area === "header" && L.colIdx >= 0) {
        const C = F.value[L.colIdx], E = kt(L.colIdx, F.value), B = c + b.value;
        ee.value.style.cursor = C && qt(B, E, C.width) ? "col-resize" : "pointer";
      } else L.area === "body" ? ee.value.style.cursor = "pointer" : ee.value.style.cursor = "default";
      ie();
    }
    function Ge() {
      d.value = -1, U.x = Me.x, U.y = Me.y, ie();
    }
    function fl(a) {
      const [c, x] = Re(a);
      if (c < 0) return;
      if (x >= ve) {
        V = !0, Ee = !1, ne = a.clientX, be = a.clientY, xe = b.value, Te = p.value;
        return;
      }
      const L = c + b.value;
      for (let C = 0; C < F.value.length; C++) {
        const E = F.value[C], B = kt(C, F.value);
        if (E.colDef.resizable !== !1 && qt(L, B, E.width)) {
          $e(E.colId, a.clientX);
          return;
        }
      }
    }
    function dl(a) {
      var C, E, B;
      if (D) {
        D = !1;
        return;
      }
      if (re) return;
      const [c, x] = Re(a);
      if (c < 0) {
        k.value = null;
        return;
      }
      const L = Zt(
        c,
        x,
        F.value,
        H.value.length,
        e.rowHeight,
        p.value,
        de.height,
        i.value.length,
        b.value,
        M.value !== null
      );
      if (L.area === "header" && L.colIdx >= 0) {
        const Z = F.value[L.colIdx], ue = kt(L.colIdx, F.value), me = c + b.value;
        Z.colDef.filter && Bl(me, ue, Z.width) ? (a.stopPropagation(), k.value === Z.colId ? k.value = null : (k.value = Z.colId, T.value = (C = s[Z.colId]) != null && C.startsWith("__eq__") ? s[Z.colId].slice(6) : s[Z.colId] ?? "", g.value = { x: Math.max(0, ue - b.value), y: ve })) : Z.colDef.sortable !== !1 && (k.value = null, v.value = ((E = v.value) == null ? void 0 : E.colId) === Z.colId ? v.value.dir === "asc" ? { colId: Z.colId, dir: "desc" } : null : { colId: Z.colId, dir: "asc" }, n("sort-changed"));
        return;
      }
      if (k.value = null, L.area === "body" && L.rowIdx >= 0 && L.colIdx >= 0) {
        const Z = L.rowIdx;
        a.shiftKey && m.value ? (R.value || (R.value = { ...m.value }), m.value = { row: Z, col: L.colIdx }) : (m.value = { row: Z, col: L.colIdx }, R.value = { row: Z, col: L.colIdx }), (B = ee.value) == null || B.focus();
        const ue = H.value[Z], me = F.value[L.colIdx];
        ue && me && (n("row-clicked", { data: ue, event: a }), n("cell-selected", { data: ue, row: Z, col: L.colIdx, colId: me.colId }));
      }
    }
    function Nt(a) {
      var c, x;
      k.value && ((x = (c = a.target).closest) != null && x.call(c, ".cathode-filter-popup") || (k.value = null));
    }
    function vl(a) {
      var C;
      if (!w.value) return;
      let c = 0;
      for (let E = 0; E < a; E++) c += F.value[E].width;
      const x = ((C = F.value[a]) == null ? void 0 : C.width) ?? 0, L = c - b.value;
      L < 0 ? b.value = Math.max(0, c) : L + x > w.value && (b.value = Math.min(J.value, c + x - w.value));
    }
    function hl(a) {
      const x = F.value.length - 1, L = H.value.length - 1;
      if (!m.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(a.key) && (a.preventDefault(), m.value = { row: A.value, col: 0 }, R.value = { row: A.value, col: 0 });
        return;
      }
      let { row: C, col: E } = m.value;
      const B = (Z, ue, me = !1) => {
        C = Math.max(0, Math.min(L, Z)), E = Math.max(0, Math.min(x, ue)), m.value = { row: C, col: E }, me || (R.value = { row: C, col: E }), q(C), vl(E);
      };
      switch (a.key) {
        case "ArrowDown":
          a.preventDefault(), B(C + 1, E, a.shiftKey);
          break;
        case "ArrowUp":
          a.preventDefault(), B(C - 1, E, a.shiftKey);
          break;
        case "ArrowRight":
          a.preventDefault(), a.shiftKey ? B(C, E + 1, !0) : E < x ? B(C, E + 1) : B(C + 1, 0);
          break;
        case "ArrowLeft":
          a.preventDefault(), a.shiftKey ? B(C, E - 1, !0) : E > 0 ? B(C, E - 1) : B(C - 1, x);
          break;
        case "Tab":
          a.preventDefault(), a.shiftKey ? E > 0 ? B(C, E - 1) : B(C - 1, x) : E < x ? B(C, E + 1) : B(C + 1, 0);
          break;
        case "Enter":
          a.preventDefault(), a.shiftKey ? B(C - 1, E) : B(C + 1, E);
          break;
        case "Home":
          a.preventDefault(), a.ctrlKey || a.metaKey ? B(0, 0, a.shiftKey) : B(C, 0, a.shiftKey);
          break;
        case "End":
          a.preventDefault(), a.ctrlKey || a.metaKey ? B(L, x, a.shiftKey) : B(C, x, a.shiftKey);
          break;
        case "PageDown":
          a.preventDefault(), B(Math.min(L, C + j.value), E, a.shiftKey);
          break;
        case "PageUp":
          a.preventDefault(), B(Math.max(0, C - j.value), E, a.shiftKey);
          break;
        case "Escape":
          m.value = null, R.value = null;
          break;
        case "c":
        case "C":
          (a.ctrlKey || a.metaKey) && (a.preventDefault(), ml());
          break;
      }
    }
    function ml() {
      var me;
      if (!m.value) return;
      const a = F.value, c = H.value, x = R.value ?? m.value, L = Math.min(x.row, m.value.row), C = Math.max(x.row, m.value.row), E = Math.min(x.col, m.value.col), B = Math.max(x.col, m.value.col), Z = [];
      for (let ot = L; ot <= C; ot++) {
        const ft = c[ot];
        if (!ft) continue;
        const dt = [];
        for (let at = E; at <= B; at++) {
          const vt = a[at];
          vt && dt.push(W(vt, ft).replace(/[\t\r\n]+/g, " "));
        }
        Z.push(dt.join("	"));
      }
      const ue = Z.join(`
`);
      (me = navigator.clipboard) == null || me.writeText(ue).catch(() => {
      });
    }
    function gl(a) {
      const c = a.target.value;
      T.value = c, c ? s[k.value] = c : delete s[k.value], n("filter-changed");
    }
    function Ot() {
      k.value && delete s[k.value], T.value = "", k.value = null, n("filter-changed");
    }
    const pl = {
      setGridOption(a, c) {
        a === "rowData" ? o.value = c : a === "pinnedBottomRowData" ? i.value = c : a === "quickFilterText" && (f.value = c);
      },
      getColumnState() {
        return e.columnDefs.map((a) => {
          var x, L;
          const c = I(a);
          return {
            colId: c,
            hide: u.has(c),
            sort: ((x = v.value) == null ? void 0 : x.colId) === c ? v.value.dir : null,
            sortIndex: ((L = v.value) == null ? void 0 : L.colId) === c ? 0 : null,
            width: r[c] ?? a.width
          };
        });
      },
      applyColumnState({ state: a }) {
        for (const c of a)
          c.hide === !0 && u.add(c.colId), c.hide === !1 && u.delete(c.colId), c.sort && (v.value = { colId: c.colId, dir: c.sort }), c.width && (r[c.colId] = c.width);
      },
      setFilterModel(a) {
        for (const c of Object.keys(s)) delete s[c];
        if (a)
          for (const [c, x] of Object.entries(a))
            (x == null ? void 0 : x.type) === "equals" ? s[c] = `__eq__${x.filter}` : x != null && x.filter && (s[c] = x.filter);
      },
      getFilterModel() {
        const a = {};
        for (const [c, x] of Object.entries(s))
          x && (a[c] = x.startsWith("__eq__") ? { type: "equals", filter: x.slice(6) } : { type: "contains", filter: x });
        return a;
      },
      async setColumnFilterModel(a, c) {
        c ? c.type === "equals" ? s[a] = `__eq__${c.filter}` : s[a] = c.filter ?? "" : delete s[a];
      },
      onFilterChanged() {
      },
      refreshCells() {
        h.value++;
      },
      exportDataAsCsv({ fileName: a = "export.csv" } = {}) {
        const c = z.value, x = c.map((B) => B.colDef.headerName ?? B.colId).join(","), L = H.value.map(
          (B) => c.map((Z) => `"${String(W(Z, B)).replace(/"/g, '""')}"`).join(",")
        ), C = new Blob([[x, ...L].join(`
`)], { type: "text/csv" }), E = URL.createObjectURL(C);
        Object.assign(document.createElement("a"), { href: E, download: a }).click(), URL.revokeObjectURL(E);
      },
      resize() {
        Q();
      },
      resetColumnState() {
        u.clear();
        for (const c of e.columnDefs)
          c.hide && u.add(I(c));
        const a = e.columnDefs.find((c) => c.sort);
        v.value = a ? { colId: I(a), dir: a.sort } : null;
        for (const c of Object.keys(r)) delete r[c];
        for (const c of Object.keys(s)) delete s[c];
        f.value = "", p.value = 0, m.value = null, k.value = null;
      }
    };
    O(
      [H, () => i.value, F, p, d, m],
      () => Ye(ie)
    ), O(() => e.theme, () => ie()), O(() => e.curvature, () => Ye(Q)), O(() => e.scanlines, () => ie()), O(() => e.glow, () => ie()), O(() => e.magnify, (a) => {
      a || (U.x = Me.x, U.y = Me.y), ie();
    }), O(m, (a) => {
      if (!a) return;
      const c = H.value[a.row], x = F.value[a.col];
      c && x && n("cell-selected", { data: c, row: a.row, col: a.col, colId: x.colId });
    });
    let ct = null, ut = null, Mt = 0;
    function nt() {
      cancelAnimationFrame(Mt), Mt = requestAnimationFrame(Q);
    }
    function Xt(a) {
      a.preventDefault();
    }
    function Ut() {
      se == null || se.dispose(), se = null, Pe = !1, _();
    }
    Oe(() => {
      for (const a of e.columnDefs)
        a.hide && u.add(I(a)), a.sort && !v.value && (v.value = { colId: I(a), dir: a.sort });
      o.value = e.rowData ?? [], i.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", Nt), document.addEventListener("mousemove", Ke), document.addEventListener("mouseup", Ve), Ye(() => {
        var a;
        _(), ee.value && (ee.value.addEventListener("webglcontextlost", Xt), ee.value.addEventListener("webglcontextrestored", Ut)), ke.value && (ct = new ResizeObserver(() => Q()), ct.observe(ke.value), ut = new IntersectionObserver((c) => {
          c.some((x) => x.isIntersecting) && nt();
        }), ut.observe(ke.value)), window.addEventListener("resize", nt), (a = window.visualViewport) == null || a.addEventListener("resize", nt), n("grid-ready", { api: pl });
      });
    }), Qe(() => {
      var a, c, x;
      document.removeEventListener("click", Nt, !0), document.removeEventListener("mousemove", Ke), document.removeEventListener("mouseup", Ve), (a = ee.value) == null || a.removeEventListener("webglcontextlost", Xt), (c = ee.value) == null || c.removeEventListener("webglcontextrestored", Ut), ct == null || ct.disconnect(), ut == null || ut.disconnect(), window.removeEventListener("resize", nt), (x = window.visualViewport) == null || x.removeEventListener("resize", nt), cancelAnimationFrame(Mt), se == null || se.dispose();
    });
    const Le = te(() => rt[e.theme] ?? rt.none), wl = te(() => ({
      position: "absolute",
      left: `${g.value.x}px`,
      top: `${g.value.y}px`,
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
    return (a, c) => {
      var x, L;
      return ge(), pe("div", {
        ref_key: "wrapEl",
        ref: ke,
        class: "cathode-wrap",
        style: De(bl.value)
      }, [
        oe("canvas", {
          ref_key: "canvasEl",
          ref: ee,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Ne(Ae, ["prevent"]),
          onMousemove: lt,
          onMouseleave: Ge,
          onMousedown: fl,
          onClick: dl,
          onKeydown: hl
        }, null, 544),
        k.value ? (ge(), pe("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: De(wl.value),
          onClick: c[0] || (c[0] = Ne(() => {
          }, ["stop"]))
        }, [
          oe("input", {
            style: De(yl.value),
            value: T.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: gl,
            onKeydown: Ml(Ot, ["escape"])
          }, null, 44, Pl),
          T.value ? (ge(), pe("button", {
            key: 0,
            style: De({
              background: "none",
              border: "none",
              color: Le.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: Ot
          }, "✕", 4)) : Be("", !0)
        ], 4)) : Be("", !0),
        t.pagination ? (ge(), pe("div", {
          key: 1,
          class: "cathode-pagination",
          style: De(xl.value)
        }, [
          oe("button", {
            disabled: p.value <= 0,
            onClick: c[1] || (c[1] = (C) => le())
          }, "◀", 8, Hl),
          oe("span", null, _e((A.value + 1).toLocaleString()) + "–" + _e(Math.min(H.value.length, $.value + 1).toLocaleString()) + " / " + _e(H.value.length.toLocaleString()), 1),
          oe("button", {
            disabled: p.value >= K.value,
            onClick: c[2] || (c[2] = (C) => ce())
          }, "▶", 8, $l),
          oe("span", {
            class: "cathode-page-info",
            style: De({ color: Kt.value })
          }, _e(H.value.length.toLocaleString()) + " rows ", 5),
          m.value ? (ge(), pe("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: De({ color: Kt.value })
          }, _e(((x = F.value[m.value.col]) == null ? void 0 : x.colDef.headerName) ?? ((L = F.value[m.value.col]) == null ? void 0 : L.colId)) + " : " + _e(W(F.value[m.value.col], H.value[m.value.row])), 5)) : Be("", !0)
        ], 4)) : Be("", !0)
      ], 4);
    };
  }
}), et = (t, l) => {
  const e = t.__vccOpts || t;
  for (const [n, o] of l)
    e[n] = o;
  return e;
}, Qn = /* @__PURE__ */ et(Xl, [["__scopeId", "data-v-b951b247"]]), pt = {
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
const Kl = 12, we = 18, mt = 10, qe = 6, Pt = `${Kl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Gl(t, l, e) {
  if (e <= 0 || !l) return [l];
  const n = [];
  for (const o of l.split(`
`)) {
    if (!o) {
      n.push("");
      continue;
    }
    if (t.measureText(o).width <= e) {
      n.push(o);
      continue;
    }
    const i = o.split(/(\s+)/);
    let f = "";
    for (const v of i) {
      const s = f + v;
      if (t.measureText(s).width <= e)
        f = s;
      else if (f && (n.push(f.replace(/\s+$/, "")), f = ""), t.measureText(v).width > e) {
        let r = "";
        for (const u of v)
          t.measureText(r + u).width > e ? (r && n.push(r), r = u) : r += u;
        f = r;
      } else
        f = v.replace(/^\s+/, "");
    }
    f && n.push(f.replace(/\s+$/, ""));
  }
  return n.length ? n : [""];
}
function il(t) {
  if (typeof t == "number") {
    const l = new Date(t), e = String(l.getHours()).padStart(2, "0"), n = String(l.getMinutes()).padStart(2, "0"), o = String(l.getSeconds()).padStart(2, "0");
    return `${e}:${n}:${o}`;
  }
  return t;
}
function jl(t, l) {
  return Math.ceil(t.measureText(l).width) + 12;
}
function ql(t) {
  const { entries: l, ctx: e, textMaxWidth: n, showTimestamps: o, wordWrap: i } = t, f = t.formatTs ?? il;
  e.font = Pt;
  const v = [];
  for (let s = 0; s < l.length; s++) {
    const r = l[s], u = r.level ?? "info", h = o && r.ts != null ? f(r.ts) : "", w = i ? Gl(e, r.text, n) : r.text.split(`
`);
    for (let S = 0; S < w.length; S++)
      v.push({
        entryIdx: s,
        text: w[S],
        level: u,
        timestamp: S === 0 ? h : "",
        isFirstFrag: S === 0,
        widthPx: e.measureText(w[S]).width
      });
  }
  return v;
}
function Jt(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, o = t.height, i = pt[l.theme] ?? pt.none;
  e.clearRect(0, 0, n, o), e.fillStyle = i.bg, e.fillRect(0, 0, n, o), e.save(), e.beginPath(), e.rect(0, 0, n, o), e.clip(), e.font = Pt, e.textBaseline = "middle";
  const f = l.visualLines, v = mt - l.scrollX, s = (l.showTimestamps ? mt + l.timestampWidth : mt) - l.scrollX, r = Math.max(0, Math.floor((l.scrollY - qe) / we)), u = Math.min(f.length, Math.ceil((l.scrollY + o - qe) / we) + 1);
  for (let h = r; h < u; h++) {
    const w = f[h], S = qe + h * we - l.scrollY + we / 2;
    if (w.entryIdx % 2 === 1 && w.isFirstFrag) {
      e.fillStyle = i.rowAlt;
      let b = 1;
      for (; h + b < u && f[h + b].entryIdx === w.entryIdx; ) b++;
      e.fillRect(0, S - we / 2, n, we * b);
    }
    l.selectionStart >= 0 && h >= l.selectionStart && h <= l.selectionEnd && (e.fillStyle = i.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, S - we / 2, n, we)), h === l.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, S - we / 2, n, we)), l.showTimestamps && w.timestamp && (e.fillStyle = i.timestamp, e.textAlign = "left", l.glow && (e.shadowBlur = 6, e.shadowColor = i.timestamp), e.fillText(w.timestamp, v, S), e.shadowBlur = 0);
    const p = Ul(i, w.level);
    e.fillStyle = p, e.textAlign = "left", l.glow ? (e.shadowColor = p, e.shadowBlur = 14, e.fillText(w.text, s, S), e.shadowBlur = 7, e.fillText(w.text, s, S), e.shadowBlur = 3, e.fillText(w.text, s, S), e.shadowBlur = 0) : e.fillText(w.text, s, S);
  }
  e.restore();
}
function Qt(t, l, e) {
  if (t < 0) return -1;
  const n = Math.floor((t + l - qe) / we);
  return n < 0 || n >= e ? -1 : n;
}
function Zl(t) {
  return qe * 2 + t * we;
}
const Jl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Ql = /* @__PURE__ */ Je({
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
    const e = t, n = Y(null), o = Y(null), i = { ...Me }, f = Y(0), v = Y(0), s = Y(0), r = Y(-1), u = Y(!0), h = Y(-1), w = Y(-1), S = te(() => {
      const y = e.entries ?? [];
      return e.maxLines > 0 && y.length > e.maxLines ? y.slice(y.length - e.maxLines) : y;
    }), p = te(() => {
      if (!e.showTimestamps) return "";
      const y = e.formatTs ?? il;
      let _ = "00:00:00";
      for (const Q of S.value) {
        if (Q.ts == null) continue;
        const ie = y(Q.ts);
        ie.length > _.length && (_ = ie);
      }
      return _;
    }), b = Y(0), d = Y([]);
    function m() {
      if (!j) return;
      const y = j.getContext("2d");
      if (!y) return;
      y.font = Pt;
      const _ = e.showTimestamps ? jl(y, p.value) : 0;
      b.value = _;
      const Q = Math.max(
        1,
        f.value - mt * 2 - _
      );
      d.value = ql({
        entries: S.value,
        ctx: y,
        textMaxWidth: Q,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const R = te(() => Zl(d.value.length)), k = te(() => Math.max(0, R.value - v.value)), U = te(() => {
      let y = 0;
      for (const _ of d.value) _.widthPx > y && (y = _.widthPx);
      return mt * 2 + b.value + y;
    }), g = te(() => Math.max(0, U.value - f.value)), T = Y(0);
    O(k, () => {
      u.value ? s.value = k.value : s.value = Math.min(s.value, k.value);
    }), O(g, () => {
      T.value = Math.min(T.value, g.value);
    }), O(
      [S, f, () => e.showTimestamps, () => e.wordWrap, p],
      () => {
        m(), Ye(W);
      },
      { deep: !1 }
    );
    let I = null, z = !1, F, J, G, K, j;
    const A = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${At}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${_t}

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

    ${Bt}

    gl_FragColor = color;
  }
`;
    function $() {
      if (!(!o.value || !n.value)) {
        j = document.createElement("canvas");
        try {
          I = new N.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          z = !0;
        }
        if (!z && !I.getContext() && (I.dispose(), I = null, z = !0), z) {
          P();
          return;
        }
        I.setPixelRatio(1), I.setClearColor(0, 0), F = new N.Scene(), J = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), K = new N.CanvasTexture(j), K.minFilter = N.LinearFilter, K.magFilter = N.LinearFilter, G = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: K },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Wt()
          },
          vertexShader: Jl,
          fragmentShader: A,
          transparent: !0
        }), F.add(new N.Mesh(new N.PlaneGeometry(2, 2), G)), P();
      }
    }
    function P() {
      if (!n.value || !I && !z) return;
      const y = n.value.clientWidth, _ = n.value.clientHeight;
      if (!y || !_) return;
      const Q = j.width !== y || j.height !== _;
      Q && (j.width = y, j.height = _, f.value = y, v.value = _, m(), I ? (Q && K && (K.dispose(), K = new N.CanvasTexture(j), K.minFilter = N.LinearFilter, K.magFilter = N.LinearFilter, G && (G.uniforms.uTex.value = K)), I.setPixelRatio(window.devicePixelRatio || 1), I.setSize(y, _)) : o.value && (o.value.width = y, o.value.height = _, o.value.style.width = y + "px", o.value.style.height = _ + "px"), u.value && (s.value = Math.max(0, R.value - v.value)), W());
    }
    function W() {
      if (!(j != null && j.width)) return;
      if (z) {
        if (!o.value) return;
        Jt(j, {
          visualLines: d.value,
          scrollY: s.value,
          scrollX: T.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: b.value,
          hoveredLine: r.value,
          selectionStart: Math.min(h.value, w.value),
          selectionEnd: Math.max(h.value, w.value)
        });
        const _ = o.value.getContext("2d");
        _ && _.drawImage(j, 0, 0);
        return;
      }
      if (!I || !G || !K) return;
      const y = e.theme === "paper";
      G.uniforms.uStrength.value = e.curvature / 45 * 0.55, G.uniforms.uScanlines.value = e.scanlines && !y ? 1 : 0, G.uniforms.uVignette.value = y ? 0 : 1, Yt(G, e.magnify, i, j.width, j.height), Jt(j, {
        visualLines: d.value,
        scrollY: s.value,
        scrollX: T.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: b.value,
        hoveredLine: r.value,
        selectionStart: Math.min(h.value, w.value),
        selectionEnd: Math.max(h.value, w.value)
      }), K.needsUpdate = !0, I.render(F, J);
    }
    O(() => e.theme, () => W()), O(() => e.curvature, () => W()), O(() => e.scanlines, () => W()), O(() => e.glow, () => W()), O(() => e.magnify, (y) => {
      y || (i.x = Me.x, i.y = Me.y), W();
    }), O(s, () => W()), O(T, () => W()), O(r, () => W()), O([h, w], () => W());
    function X(y) {
      if (!o.value) return [-1, -1];
      const _ = o.value.getBoundingClientRect();
      return [y.clientX - _.left, y.clientY - _.top];
    }
    function H(y) {
      s.value = Math.max(0, Math.min(k.value, y)), u.value = s.value >= k.value - 4;
    }
    function M(y) {
      T.value = Math.max(0, Math.min(g.value, y));
    }
    function q(y) {
      y.shiftKey ? M(T.value + y.deltaY) : Math.abs(y.deltaX) > Math.abs(y.deltaY) ? M(T.value + y.deltaX) : H(s.value + y.deltaY);
    }
    let le = !1, ce = 0, re = 0, he = 0, ae = 0, fe = !1;
    function D(y) {
      le = !0, fe = !1, ce = y.clientX, re = y.clientY, he = T.value, ae = s.value, n.value && n.value.focus();
    }
    function V(y) {
      if (le) {
        const _ = ce - y.clientX, Q = re - y.clientY;
        (Math.abs(_) > 4 || Math.abs(Q) > 4) && (fe = !0), M(he + _), H(ae + Q);
      }
    }
    function ne() {
      le && (le = !1, fe && (fe = !1));
    }
    function be(y) {
      const [, _] = X(y);
      return _ < 0 ? -1 : Qt(_, s.value, d.value.length);
    }
    function xe(y) {
      if (fe) {
        fe = !1;
        return;
      }
      const _ = be(y);
      if (_ < 0) {
        h.value = -1, w.value = -1;
        return;
      }
      y.shiftKey && h.value >= 0 || (h.value = _), w.value = _;
    }
    function Te(y, _) {
      const Q = d.value.length;
      if (Q === 0) return;
      const ie = w.value < 0 ? 0 : w.value;
      let Re = Math.max(0, Math.min(Q - 1, ie + y));
      w.value = Re, (!_ || h.value < 0) && (h.value = Re), r.value = Re;
      const Ie = qe + Re * we, Ae = Ie + we;
      Ie < s.value ? H(Ie) : Ae > s.value + v.value && H(Ae - v.value);
    }
    function Ee() {
      const y = Math.min(h.value, w.value), _ = Math.max(h.value, w.value);
      if (y < 0) return "";
      const Q = d.value, ie = /* @__PURE__ */ new Set(), Re = [];
      for (let Ie = y; Ie <= _ && Ie < Q.length; Ie++) {
        const Ae = Q[Ie];
        if (ie.has(Ae.entryIdx)) continue;
        ie.add(Ae.entryIdx);
        let lt = "";
        for (let Ge = 0; Ge < Q.length; Ge++)
          Q[Ge].entryIdx === Ae.entryIdx && (lt += (lt && !Q[Ge].isFirstFrag ? " " : "") + Q[Ge].text);
        Re.push(Ae.timestamp ? `${Ae.timestamp}  ${lt}` : lt);
      }
      return Re.join(`
`);
    }
    async function $e() {
      const y = Ee();
      if (y)
        try {
          await navigator.clipboard.writeText(y);
        } catch {
          const _ = document.createElement("textarea");
          _.value = y, _.style.position = "fixed", _.style.opacity = "0", document.body.appendChild(_), _.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(_);
        }
    }
    function Ke(y) {
      if ((y.metaKey || y.ctrlKey) && (y.key === "c" || y.key === "C")) {
        h.value >= 0 && (y.preventDefault(), $e());
        return;
      }
      if ((y.metaKey || y.ctrlKey) && (y.key === "a" || y.key === "A")) {
        y.preventDefault(), h.value = 0, w.value = d.value.length - 1;
        return;
      }
      switch (y.key) {
        case "ArrowDown":
          y.preventDefault(), Te(1, y.shiftKey);
          break;
        case "ArrowUp":
          y.preventDefault(), Te(-1, y.shiftKey);
          break;
        case "ArrowRight":
          y.preventDefault(), M(T.value + we * 2);
          break;
        case "ArrowLeft":
          y.preventDefault(), M(T.value - we * 2);
          break;
        case "PageDown":
          y.preventDefault(), H(s.value + v.value);
          break;
        case "PageUp":
          y.preventDefault(), H(s.value - v.value);
          break;
        case "Home":
          y.preventDefault(), H(0), M(0);
          break;
        case "End":
          y.preventDefault(), H(k.value);
          break;
        case "Escape":
          h.value = -1, w.value = -1;
          break;
      }
    }
    function Ve(y) {
      if (e.magnify && o.value) {
        const Q = zt(y, o.value);
        i.x = Q.x, i.y = Q.y, W();
      }
      const [, _] = X(y);
      if (_ < 0) {
        r.value = -1;
        return;
      }
      r.value = Qt(_, s.value, d.value.length);
    }
    function ke() {
      r.value = -1, i.x = Me.x, i.y = Me.y, W();
    }
    l({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, s.value = k.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(y) {
        H(qe + y * we);
      }
    });
    let ee = null, ze = null, se = 0;
    const Pe = bt("cathodeResetTick", Y(0));
    O(Pe, () => Fe());
    function Fe() {
      cancelAnimationFrame(se), se = requestAnimationFrame(P);
    }
    function st(y) {
      y.preventDefault();
    }
    function Ce() {
      I == null || I.dispose(), I = null, z = !1, $();
    }
    Oe(() => {
      document.addEventListener("mousemove", V), document.addEventListener("mouseup", ne), Ye(() => {
        var y;
        $(), o.value && (o.value.addEventListener("webglcontextlost", st), o.value.addEventListener("webglcontextrestored", Ce)), n.value && (ee = new ResizeObserver(() => P()), ee.observe(n.value), ze = new IntersectionObserver((_) => {
          _.some((Q) => Q.isIntersecting) && Fe();
        }), ze.observe(n.value)), window.addEventListener("resize", Fe), (y = window.visualViewport) == null || y.addEventListener("resize", Fe), s.value = k.value;
      });
    }), Qe(() => {
      var y, _, Q;
      document.removeEventListener("mousemove", V), document.removeEventListener("mouseup", ne), (y = o.value) == null || y.removeEventListener("webglcontextlost", st), (_ = o.value) == null || _.removeEventListener("webglcontextrestored", Ce), ee == null || ee.disconnect(), ze == null || ze.disconnect(), window.removeEventListener("resize", Fe), (Q = window.visualViewport) == null || Q.removeEventListener("resize", Fe), cancelAnimationFrame(se), I == null || I.dispose();
    });
    const Se = te(() => pt[e.theme] ?? pt.none), de = te(() => ({
      background: Se.value.bg
    }));
    return (y, _) => (ge(), pe("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: De(de.value),
      tabindex: "0",
      onKeydown: Ke
    }, [
      oe("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-log-canvas",
        onWheel: Ne(q, ["prevent"]),
        onMousemove: Ve,
        onMouseleave: ke,
        onMousedown: D,
        onClick: xe
      }, null, 544)
    ], 36));
  }
}), en = /* @__PURE__ */ et(Ql, [["__scopeId", "data-v-50995a41"]]), tn = ["disabled"], ln = /* @__PURE__ */ Je({
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
    historyLimit: { default: 100 },
    magnify: { type: Boolean, default: !1 }
  },
  emits: ["submit"],
  setup(t, { expose: l, emit: e }) {
    const n = t, o = e, i = Y(null), f = Y(null), v = Y(""), s = Y([]), r = Y(-1);
    let u = "";
    function h(g) {
      g.trim() && (s.value.length && s.value[s.value.length - 1] === g || (s.value.push(g), s.value.length > n.historyLimit && s.value.splice(0, s.value.length - n.historyLimit)));
    }
    function w(g) {
      if (!n.disabled) {
        if (g.key === "Enter") {
          g.preventDefault();
          const T = v.value;
          T.trim() && h(T), r.value = -1, v.value = "", o("submit", T);
          return;
        }
        if (g.key === "ArrowUp") {
          if (!s.value.length) return;
          g.preventDefault(), r.value === -1 ? (u = v.value, r.value = s.value.length - 1) : r.value > 0 && r.value--, v.value = s.value[r.value];
          return;
        }
        if (g.key === "ArrowDown") {
          if (r.value === -1) return;
          g.preventDefault(), r.value < s.value.length - 1 ? (r.value++, v.value = s.value[r.value]) : (r.value = -1, v.value = u, u = "");
          return;
        }
      }
    }
    const S = Y(!0);
    let p = null;
    function b() {
      p || (p = setInterval(() => {
        S.value = !S.value;
      }, 530));
    }
    function d() {
      p && (clearInterval(p), p = null), S.value = !0;
    }
    const m = te(() => {
      let g;
      return n.disabled ? g = " " : n.busy ? g = "█" : g = S.value ? "█" : " ", { level: "info", text: `${n.prompt}${v.value}${g}` };
    }), R = te(
      () => [...n.entries, m.value]
    );
    function k() {
      var g;
      n.disabled || (g = f.value) == null || g.focus();
    }
    O(() => n.busy, (g, T) => {
      T && !g && !n.disabled && Ye(() => {
        var I;
        return (I = f.value) == null ? void 0 : I.focus();
      });
    });
    function U() {
      var g;
      (g = f.value) == null || g.focus();
    }
    return l({ focus: U }), Oe(() => {
      b(), n.disabled || requestAnimationFrame(() => {
        var g;
        return (g = f.value) == null ? void 0 : g.focus();
      });
    }), Qe(() => {
      d();
    }), (g, T) => (ge(), pe("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-terminal-wrap",
      onClick: k
    }, [
      nl(en, {
        entries: R.value,
        theme: t.theme,
        curvature: t.curvature,
        scanlines: t.scanlines,
        glow: t.glow,
        magnify: t.magnify,
        "show-timestamps": t.showTimestamps,
        "format-ts": t.formatTs,
        "word-wrap": t.wordWrap,
        autoscroll: t.autoscroll,
        "max-lines": t.maxLines
      }, null, 8, ["entries", "theme", "curvature", "scanlines", "glow", "magnify", "show-timestamps", "format-ts", "word-wrap", "autoscroll", "max-lines"]),
      ol(oe("input", {
        ref_key: "inputEl",
        ref: f,
        "onUpdate:modelValue": T[0] || (T[0] = (I) => v.value = I),
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
}), eo = /* @__PURE__ */ et(ln, [["__scopeId", "data-v-a2b39934"]]), wt = {
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
}, nn = 0.18, ht = 8, Ht = 22, on = 4, He = 8, Ze = 56, rl = 42, Xe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", an = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", It = 4, rn = 1, sn = 1;
function cn(t, l, e, n = 0, o = !1) {
  const i = o ? rl : Ze, f = Math.max(0, l - He - i), v = Math.max(1, Math.floor(f / e)), s = Math.min(v, t);
  return { firstIdx: Math.max(0, t - s - Math.floor(n / e)), count: s, slotW: e };
}
function un(t, l, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, o = -1 / 0, i = 0;
  const f = Math.min(t.length, l + e);
  for (let s = l; s < f; s++) {
    const r = t[s];
    r && (r.low < n && (n = r.low), r.high > o && (o = r.high), r.volume > i && (i = r.volume));
  }
  if (!isFinite(n) || !isFinite(o) || n === o) {
    const s = isFinite(n) ? n : 0;
    return { min: s - 1, max: s + 1, maxVol: Math.max(1, i) };
  }
  const v = (o - n) * 0.04;
  return { min: n - v, max: o + v, maxVol: Math.max(1, i) };
}
function fn(t, l, e = !1) {
  const n = e ? on : Ht, o = Math.max(1, t - ht - n - It), i = Math.max(0, Math.round(o * l)), f = o - i;
  return {
    priceY0: ht,
    priceY1: ht + f,
    volumeY0: ht + f + It,
    volumeY1: ht + f + It + i
  };
}
function We(t, l, e, n) {
  const o = l.max - l.min;
  return o <= 0 ? (e + n) / 2 : e + (1 - (t - l.min) / o) * (n - e);
}
function Ue(t, l, e) {
  return He + (t - l + 0.5) * e;
}
function je(t) {
  const l = Math.abs(t), e = l >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : l >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : l >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : l >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function $t(t) {
  const l = new Date(t), e = String(l.getMonth() + 1).padStart(2, "0"), n = String(l.getDate()).padStart(2, "0"), o = String(l.getHours()).padStart(2, "0"), i = String(l.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${o}:${i}`;
}
function dn(t, l) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, l), n = Math.pow(10, Math.floor(Math.log10(e))), o = e / n;
  let i;
  return o < 1.5 ? i = 1 : o < 3 ? i = 2 : o < 7 ? i = 5 : i = 10, i * n;
}
function el(t, l) {
  var S, p, b, d, m;
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, o = t.height, i = wt[l.theme] ?? wt.none, f = l.colors ? { ...i, ...l.colors } : i, v = !!l.compact;
  if (e.clearRect(0, 0, n, o), e.fillStyle = f.bg, e.fillRect(0, 0, n, o), !l.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, n, o), e.clip();
  const s = cn(l.candles.length, n, l.slotW, l.scrollX, v), r = un(l.candles, s.firstIdx, s.count), u = fn(o, l.showVolume ? l.volumeFraction : 0, v), h = Math.max(rn, Math.floor(l.slotW * 0.7)), w = Math.min(l.candles.length, s.firstIdx + s.count);
  for (let R = s.firstIdx; R < w; R++) {
    const k = l.candles[R];
    if (!k) continue;
    const U = Ue(R, s.firstIdx, l.slotW), g = We(k.open, r, u.priceY0, u.priceY1), T = We(k.close, r, u.priceY0, u.priceY1), I = We(k.high, r, u.priceY0, u.priceY1), z = We(k.low, r, u.priceY0, u.priceY1), F = k.close >= k.open, J = F ? f.wickBull : f.wickBear, G = F ? f.candleBull : f.candleBear;
    l.glow && (e.shadowBlur = 10, e.shadowColor = G), e.strokeStyle = J, e.lineWidth = sn, e.beginPath(), e.moveTo(Math.round(U) + 0.5, I), e.lineTo(Math.round(U) + 0.5, z), e.stroke(), e.fillStyle = G;
    const K = Math.min(g, T), j = Math.max(1, Math.abs(T - g)), A = Math.round(U - h / 2), $ = Math.round(K), P = Math.round(j);
    if (e.fillRect(A, $, h, P), l.glow && (e.shadowBlur = 4, e.fillRect(A, $, h, P)), e.shadowBlur = 0, l.showVolume && r.maxVol > 0) {
      const W = Math.round(k.volume / r.maxVol * (u.volumeY1 - u.volumeY0));
      W > 0 && (e.fillStyle = F ? f.volumeBull : f.volumeBear, e.fillRect(
        Math.round(U - h / 2),
        u.volumeY1 - W,
        h,
        W
      ));
    }
  }
  if ((S = l.overlays) != null && S.length)
    for (const R of l.overlays) vn(e, R, s, r, u, l.slotW);
  (p = l.markers) != null && p.length && bn(e, f, l.markers, l.candles, s, r, u, l.slotW), Mn(e, f, r, u, n, v), v || (Sn(e, f, l.candles, s, l.slotW, o), yn(e, f, l.candles, n, o)), (b = l.overlays) != null && b.length && mn(e, f, l.overlays, u), l.hover && (Cn(e, f, l.candles, s, r, u, l.slotW, l.hover, n), gn(e, f, l.candles, s, l.slotW, l.hover, u, ((d = l.overlays) == null ? void 0 : d.length) ?? 0), (m = l.markers) != null && m.length && wn(e, f, l.markers, l.candles, s, r, u, l.slotW, l.hover, n)), e.restore();
}
function vn(t, l, e, n, o, i) {
  var v;
  const f = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    He,
    o.priceY0,
    /* width: */
    999999,
    o.priceY1 - o.priceY0
  ), t.clip(), l.kind === "line")
    gt(t, l.data, e.firstIdx, f, i, n, o, l.color, l.lineWidth ?? 1, l.dashed === !0);
  else {
    const s = sl(l.color, l.fillAlpha ?? 0.08);
    hn(t, l.upper, l.lower, e.firstIdx, f, i, n, o, s), gt(t, l.upper, e.firstIdx, f, i, n, o, l.color, 1, !1), gt(t, l.lower, e.firstIdx, f, i, n, o, l.color, 1, !1), (v = l.middle) != null && v.length && gt(t, l.middle, e.firstIdx, f, i, n, o, l.color, 1, l.middleDashed !== !1);
  }
  t.restore();
}
function gt(t, l, e, n, o, i, f, v, s, r) {
  if (!l || !l.length) return;
  t.strokeStyle = v, t.lineWidth = s, t.setLineDash(r ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let h = e; h < n; h++) {
    const w = l[h];
    if (typeof w != "number" || !isFinite(w)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const S = Ue(h, e, o), p = We(w, i, f.priceY0, f.priceY1);
    u ? t.lineTo(S, p) : (t.moveTo(S, p), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function hn(t, l, e, n, o, i, f, v, s) {
  if (!(l != null && l.length) || !(e != null && e.length)) return;
  t.fillStyle = s;
  let r = !1, u = -1;
  for (let h = n; h <= o; h++) {
    const w = l[h], S = e[h], p = h < o && typeof w == "number" && typeof S == "number" && isFinite(w) && isFinite(S);
    if (p && !r && (u = h, r = !0), !p && r || h === o && r) {
      const b = p ? h + 1 : h;
      t.beginPath();
      for (let d = u; d < b; d++) {
        const m = Ue(d, n, i), R = We(l[d], f, v.priceY0, v.priceY1);
        d === u ? t.moveTo(m, R) : t.lineTo(m, R);
      }
      for (let d = b - 1; d >= u; d--) {
        const m = Ue(d, n, i), R = We(e[d], f, v.priceY0, v.priceY1);
        t.lineTo(m, R);
      }
      t.closePath(), t.fill(), r = !1;
    }
  }
}
function sl(t, l) {
  const e = Math.max(0, Math.min(1, l));
  if (t.startsWith("#") && t.length === 7) {
    const n = parseInt(t.slice(1, 3), 16), o = parseInt(t.slice(3, 5), 16), i = parseInt(t.slice(5, 7), 16);
    return `rgba(${n},${o},${i},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function mn(t, l, e, n) {
  const o = e.filter((b) => !!b.label);
  if (!o.length) return;
  t.save(), t.font = Xe;
  const i = 8, f = 5, v = 12, s = 6, r = 14;
  let u = 0;
  for (const b of o) {
    const d = t.measureText(b.label).width;
    d > u && (u = d);
  }
  const h = i * 2 + v + s + u, w = f * 2 + r * o.length, S = He + 4, p = n.priceY0 + 4;
  t.fillStyle = l.panelBg, t.fillRect(S, p, h, w), t.textBaseline = "middle", t.textAlign = "left";
  for (let b = 0; b < o.length; b++) {
    const d = o[b], m = p + f + r * (b + 0.5), R = S + i;
    d.kind === "line" ? (t.strokeStyle = d.color, t.lineWidth = d.lineWidth ?? 1, t.setLineDash(d.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(R, m), t.lineTo(R + v, m), t.stroke(), t.setLineDash([])) : (t.fillStyle = sl(d.color, d.fillAlpha ?? 0.2), t.fillRect(R, m - 4, v, 8), t.strokeStyle = d.color, t.lineWidth = 1, t.strokeRect(R + 0.5, m - 4 + 0.5, v - 1, 7)), t.fillStyle = l.text, t.fillText(d.label, R + v + s, m);
  }
  t.restore();
}
function gn(t, l, e, n, o, i, f, v) {
  const s = Math.floor((i.x - He) / o), r = n.firstIdx + s;
  if (r < 0 || r >= e.length) return;
  const u = e[r];
  if (!u) return;
  const h = u.close - u.open, w = u.open !== 0 ? h / u.open * 100 : 0, S = h >= 0 ? "+" : "", p = [
    ["O", je(u.open), void 0],
    ["H", je(u.high), void 0],
    ["L", je(u.low), void 0],
    ["C", je(u.close), void 0],
    ["V", pn(u.volume), void 0],
    ["", `${S}${w.toFixed(2)}%`, h >= 0 ? l.candleBull : l.candleBear]
  ];
  t.save(), t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
  const b = 8, d = 4, m = 14;
  let R = b;
  for (const [T, I] of p) {
    const z = T ? `${T} ${I}` : I, F = t.measureText(z).width + 12;
    R += F;
  }
  R += b - 12;
  const k = f.priceY0 + 4 + (v > 0 ? d * 2 + 14 * v + 4 : 0), U = He + 4;
  t.fillStyle = l.panelBg, t.fillRect(U, k, R, m + d * 2);
  let g = U + b;
  for (let T = 0; T < p.length; T++) {
    const [I, z, F] = p[T];
    t.fillStyle = l.text, I && (t.globalAlpha = 0.6, t.fillText(I + " ", g, k + d + m / 2), t.globalAlpha = 1, g += t.measureText(I + " ").width), F && (t.fillStyle = F), t.fillText(z, g, k + d + m / 2), g += t.measureText(z).width + 12;
  }
  t.restore();
}
function pn(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function wn(t, l, e, n, o, i, f, v, s, r) {
  if (!n.length) return;
  const u = n.length > 1 ? n[1].start - n[0].start : 6e4, h = Math.max(1, u * 0.5), w = Math.min(n.length, o.firstIdx + o.count), S = 9;
  let p = null;
  for (const z of e) {
    let F = 0, J = n.length - 1, G = -1;
    for (; F <= J; ) {
      const A = F + J >> 1, $ = n[A].start - z.timestamp;
      if (Math.abs($) <= h) {
        G = A;
        break;
      }
      $ < 0 ? F = A + 1 : J = A - 1;
    }
    if (G < 0 || G < o.firstIdx || G >= w) continue;
    const K = Ue(G, o.firstIdx, v), j = We(z.price, i, f.priceY0, f.priceY1);
    if (Math.abs(s.x - K) <= S && Math.abs(s.y - j) <= S) {
      p = { m: z, x: K, y: j };
      break;
    }
  }
  if (!p) return;
  const b = $t(p.m.timestamp), d = [
    `${p.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${b}`,
    `@ ${je(p.m.price)}`
  ];
  p.m.label && d.push(p.m.label), t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "left";
  const m = 6, R = 14;
  let k = 0;
  for (const z of d) {
    const F = t.measureText(z).width;
    F > k && (k = F);
  }
  const U = k + m * 2, g = d.length * R + m * 2;
  let T = p.x + 12;
  T + U > r - Ze && (T = p.x - 12 - U);
  let I = p.y - g / 2;
  I < f.priceY0 && (I = f.priceY0), I + g > f.priceY1 && (I = f.priceY1 - g), t.fillStyle = l.panelBgSolid, t.strokeStyle = p.m.kind === "entry" ? l.markerEntry : l.markerExit, t.lineWidth = 1, t.fillRect(T, I, U, g), t.strokeRect(T + 0.5, I + 0.5, U - 1, g - 1);
  for (let z = 0; z < d.length; z++) {
    const F = d[z];
    t.fillStyle = z === 0 ? p.m.kind === "entry" ? l.markerEntry : l.markerExit : l.text, t.fillText(F, T + m, I + m + z * R);
  }
  t.restore();
}
function yn(t, l, e, n, o) {
  if (e.length < 2) return;
  const i = e[1].start - e[0].start, f = xn(i);
  if (!f) return;
  t.save(), t.font = Xe, t.textBaseline = "top", t.textAlign = "right";
  const v = 6, s = 3, r = t.measureText(f).width, u = n - Ze - v, h = o - Ht + 4;
  t.fillStyle = l.accent, t.fillRect(u - r - v, h - s, r + v * 2, 14 + s * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(f, u, h), t.restore();
}
function xn(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const l = 1e3, e = 60 * l, n = 60 * e, o = 24 * n, i = 7 * o;
  return t >= i && t % i === 0 ? t / i + "W" : t >= o && t % o === 0 ? t / o + "D" : t >= n && t % n === 0 ? t / n + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= l && t % l === 0 ? t / l + "s" : Math.round(t / e) + "m";
}
function bn(t, l, e, n, o, i, f, v) {
  if (!n.length) return;
  const s = n.length > 1 ? n[1].start - n[0].start : 6e4, r = Math.max(1, s * 0.5), u = Math.min(n.length, o.firstIdx + o.count), h = (S) => {
    let p = 0, b = n.length - 1;
    for (; p <= b; ) {
      const d = p + b >> 1, m = n[d].start - S;
      if (Math.abs(m) <= r) return d;
      m < 0 ? p = d + 1 : b = d - 1;
    }
    return -1;
  }, w = 7;
  for (const S of e) {
    const p = h(S.timestamp);
    if (p < 0 || p < o.firstIdx || p >= u) continue;
    const b = Ue(p, o.firstIdx, v), d = We(S.price, i, f.priceY0, f.priceY1);
    if (d < f.priceY0 || d > f.priceY1) continue;
    const m = S.color ?? (S.kind === "entry" ? l.markerEntry : l.markerExit);
    t.fillStyle = m, t.strokeStyle = l.panelBgSolid, t.lineWidth = 1, t.beginPath(), S.kind === "entry" ? (t.moveTo(b, d - w), t.lineTo(b - w, d + w - 1), t.lineTo(b + w, d + w - 1)) : (t.moveTo(b, d + w), t.lineTo(b - w, d - w + 1), t.lineTo(b + w, d - w + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function Mn(t, l, e, n, o, i = !1) {
  const f = e.max - e.min;
  if (f <= 0) return;
  const v = n.priceY1 - n.priceY0, s = i ? Math.max(2, Math.min(4, Math.round(v / 36))) : 6, r = dn(f, s), u = Math.ceil(e.min / r) * r, h = i ? rl : Ze;
  t.font = i ? an : Xe, t.fillStyle = l.text, t.strokeStyle = l.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let w = u; w <= e.max; w += r) {
    const S = We(w, e, n.priceY0, n.priceY1);
    S < n.priceY0 || S > n.priceY1 || (t.beginPath(), t.moveTo(He, Math.round(S) + 0.5), t.lineTo(o - h, Math.round(S) + 0.5), t.stroke(), t.fillText(je(w), o - h + 3, S));
  }
  t.globalAlpha = 1;
}
function Sn(t, l, e, n, o, i) {
  if (n.count <= 0 || !e.length) return;
  const v = Math.max(1, Math.floor(n.count / 6));
  t.font = Xe, t.fillStyle = l.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const s = Math.min(e.length, n.firstIdx + n.count);
  for (let r = n.firstIdx; r < s; r += v) {
    const u = e[r];
    if (!u) continue;
    const h = Ue(r, n.firstIdx, o);
    t.fillText($t(u.start), h, i - Ht + 4);
  }
  t.globalAlpha = 1;
}
function Cn(t, l, e, n, o, i, f, v, s) {
  const r = Math.floor((v.x - He) / f), u = Math.max(0, Math.min(e.length - 1, n.firstIdx + r)), h = e[u];
  if (!h) return;
  const w = Ue(u, n.firstIdx, f);
  t.save(), t.strokeStyle = l.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(w) + 0.5, i.priceY0), t.lineTo(Math.round(w) + 0.5, i.volumeY1 || i.priceY1), t.stroke();
  const S = Math.max(i.priceY0, Math.min(i.priceY1, v.y));
  t.beginPath(), t.moveTo(He, Math.round(S) + 0.5), t.lineTo(s - Ze, Math.round(S) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const p = o.max - o.min;
  if (p > 0) {
    const m = o.max - (S - i.priceY0) / (i.priceY1 - i.priceY0) * p, R = je(m);
    t.font = Xe, t.textBaseline = "middle", t.textAlign = "left";
    const k = t.measureText(R).width, U = 4, g = 2;
    t.fillStyle = l.accent, t.fillRect(s - Ze + 2, S - 7 - g, k + U * 2, 14 + g * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(R, s - Ze + 2 + U, S);
  }
  t.font = Xe, t.textBaseline = "top", t.textAlign = "center";
  const b = $t(h.start), d = t.measureText(b).width;
  t.fillStyle = l.accent, t.fillRect(w - d / 2 - 4, i.volumeY1 + 2, d + 8, 14), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(b, w, i.volumeY1 + 4), t.restore();
}
const Lt = 0.25, Rt = 6, Tn = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, kn = /* @__PURE__ */ Je({
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
    const l = t, e = Y(null), n = Y(null), o = { ...Me }, i = Y(0), f = Y(0), v = Y(0), s = Y(1), r = Y(null), u = te(() => Math.max(1, l.slotW * s.value));
    let h = null, w = !1, S, p, b, d, m;
    const R = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${At}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${_t}

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

    ${Bt}

    gl_FragColor = color;
  }
`;
    function k() {
      if (!(!n.value || !e.value)) {
        if (m = document.createElement("canvas"), l.flat) {
          w = !0, U();
          return;
        }
        try {
          h = new N.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0 });
        } catch {
          w = !0;
        }
        if (!w && !h.getContext() && (h.dispose(), h = null, w = !0), w) {
          U();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), S = new N.Scene(), p = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), d = new N.CanvasTexture(m), d.minFilter = N.LinearFilter, d.magFilter = N.LinearFilter, b = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: d },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Wt()
          },
          vertexShader: Tn,
          fragmentShader: R,
          transparent: !0
        }), S.add(new N.Mesh(new N.PlaneGeometry(2, 2), b)), U();
      }
    }
    function U() {
      if (!e.value || !h && !w) return;
      const D = e.value.clientWidth, V = e.value.clientHeight;
      !D || !V || !(m.width !== D || m.height !== V) || (m.width = D, m.height = V, i.value = D, f.value = V, h ? (d && (d.dispose(), d = new N.CanvasTexture(m), d.minFilter = N.LinearFilter, d.magFilter = N.LinearFilter, b && (b.uniforms.uTex.value = d)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(D, V)) : n.value && (n.value.width = D, n.value.height = V, n.value.style.width = D + "px", n.value.style.height = V + "px"), g());
    }
    function g() {
      if (!(m != null && m.width)) return;
      if (w) {
        if (!n.value) return;
        el(m, {
          candles: l.candles,
          slotW: u.value,
          scrollX: v.value,
          theme: l.theme,
          glow: !1,
          showVolume: l.showVolume,
          volumeFraction: l.volumeFraction,
          hover: r.value,
          overlays: l.overlays,
          markers: l.markers,
          compact: l.compact,
          colors: l.colors
        });
        const V = n.value.getContext("2d");
        V && (V.clearRect(0, 0, n.value.width, n.value.height), V.drawImage(m, 0, 0));
        return;
      }
      if (!h || !b || !d) return;
      const D = l.theme === "paper";
      b.uniforms.uStrength.value = l.curvature / 45 * 0.55, b.uniforms.uScanlines.value = l.scanlines && !D ? 1 : 0, b.uniforms.uVignette.value = D ? 0 : 1, Yt(b, l.magnify, o, m.width, m.height), el(m, {
        candles: l.candles,
        slotW: u.value,
        scrollX: v.value,
        theme: l.theme,
        glow: l.glow,
        showVolume: l.showVolume,
        volumeFraction: l.volumeFraction,
        hover: r.value,
        overlays: l.overlays,
        markers: l.markers,
        compact: l.compact,
        colors: l.colors
      }), d.needsUpdate = !0, h.render(S, p);
    }
    O(() => l.theme, () => g()), O(() => l.curvature, () => g()), O(() => l.scanlines, () => g()), O(() => l.glow, () => g()), O(() => l.showVolume, () => g()), O(() => l.volumeFraction, () => g()), O(() => l.slotW, () => g()), O(() => l.candles, () => g(), { deep: !1 }), O(() => l.overlays, () => g(), { deep: !1 }), O(() => l.markers, () => g(), { deep: !1 }), O(() => l.compact, () => g()), O(() => l.magnify, (D) => {
      D || (o.x = Me.x, o.y = Me.y), g();
    }), O(() => l.colors, () => g(), { deep: !0 }), O(() => l.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), O(v, () => g()), O(s, () => g()), O(r, () => g()), O(u, () => g());
    let T = null, I = null, z = 0;
    const F = bt("cathodeResetTick", Y(0));
    O(F, () => J());
    function J() {
      cancelAnimationFrame(z), z = requestAnimationFrame(U);
    }
    function G(D) {
      D.preventDefault();
    }
    function K() {
      h == null || h.dispose(), h = null, w = !1, k();
    }
    function j(D) {
      if (!n.value) return [-1, -1];
      const V = n.value.getBoundingClientRect();
      return [D.clientX - V.left, D.clientY - V.top];
    }
    function A(D) {
      var Te;
      const V = u.value;
      if (V <= 0) return 0;
      const ne = ((Te = l.candles) == null ? void 0 : Te.length) ?? 0, be = Math.max(1, Math.floor((i.value || 1) / V)), xe = Math.max(0, ne - be);
      return Math.max(0, Math.min(D, xe * V));
    }
    function $(D) {
      var be;
      if (D.deltaX !== 0 || D.shiftKey && D.deltaY !== 0) {
        const xe = D.deltaX !== 0 ? D.deltaX : D.deltaY;
        v.value = A(v.value + xe);
        return;
      }
      if (D.deltaY === 0) return;
      const [V] = j(D), ne = u.value;
      if (V >= 0 && ne > 0 && ((be = l.candles) != null && be.length)) {
        const xe = Math.max(1, Math.floor((i.value || 1) / ne)), Ee = Math.max(0, l.candles.length - xe - Math.floor(v.value / ne)) + (V - 8) / ne, $e = Math.exp(-D.deltaY * 15e-4), Ke = Math.max(Lt, Math.min(Rt, s.value * $e));
        s.value = Ke;
        const Ve = l.slotW * Ke, ke = Math.max(1, Math.floor((i.value || 1) / Ve)), ee = Ee - (V - 8) / Ve, ze = Math.max(0, l.candles.length - ke - ee);
        v.value = A(ze * Ve);
      } else {
        const xe = Math.exp(-D.deltaY * 15e-4);
        s.value = Math.max(Lt, Math.min(Rt, s.value * xe));
      }
    }
    let P = !1, W = 0, X = 0;
    function H(D) {
      D.button === 0 && (P = !0, W = D.clientX, X = v.value, r.value = null, e.value && e.value.focus());
    }
    function M(D) {
      const V = Math.exp(D * 0.18);
      s.value = Math.max(Lt, Math.min(Rt, s.value * V)), v.value = A(v.value);
    }
    function q(D) {
      const V = u.value, ne = D.shiftKey ? 20 : 3;
      switch (D.key) {
        case "ArrowLeft":
          D.preventDefault(), v.value = A(v.value + V * ne);
          break;
        case "ArrowRight":
          D.preventDefault(), v.value = A(v.value - V * ne);
          break;
        case "ArrowUp":
          D.preventDefault(), M(1);
          break;
        case "ArrowDown":
          D.preventDefault(), M(-1);
          break;
        case "Home":
          D.preventDefault(), v.value = A(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          D.preventDefault(), v.value = 0;
          break;
      }
    }
    function le(D) {
      if (P) {
        const V = D.clientX - W;
        v.value = A(X + V);
        return;
      }
    }
    function ce() {
      P = !1;
    }
    function re(D) {
      if (l.magnify && n.value) {
        const be = zt(D, n.value);
        o.x = be.x, o.y = be.y, g();
      }
      if (P) return;
      const [V, ne] = j(D);
      if (V < 0 || ne < 0) {
        r.value = null;
        return;
      }
      r.value = { x: V, y: ne };
    }
    function he() {
      r.value = null, o.x = Me.x, o.y = Me.y, g();
    }
    Oe(() => {
      document.addEventListener("mousemove", le), document.addEventListener("mouseup", ce), Ye(() => {
        var D;
        k(), n.value && (n.value.addEventListener("webglcontextlost", G), n.value.addEventListener("webglcontextrestored", K)), e.value && (T = new ResizeObserver(() => U()), T.observe(e.value), I = new IntersectionObserver((V) => {
          V.some((ne) => ne.isIntersecting) && J();
        }), I.observe(e.value)), window.addEventListener("resize", J), (D = window.visualViewport) == null || D.addEventListener("resize", J);
      });
    }), Qe(() => {
      var D, V, ne;
      document.removeEventListener("mousemove", le), document.removeEventListener("mouseup", ce), (D = n.value) == null || D.removeEventListener("webglcontextlost", G), (V = n.value) == null || V.removeEventListener("webglcontextrestored", K), T == null || T.disconnect(), I == null || I.disconnect(), window.removeEventListener("resize", J), (ne = window.visualViewport) == null || ne.removeEventListener("resize", J), cancelAnimationFrame(z), h == null || h.dispose();
    });
    const ae = te(() => wt[l.theme] ?? wt.none), fe = te(() => ({
      background: ae.value.bg
    }));
    return (D, V) => (ge(), pe("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: De(fe.value),
      tabindex: "0",
      onKeydown: q
    }, [
      oe("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-candle-canvas",
        onWheel: Ne($, ["prevent"]),
        onMousedown: H,
        onMousemove: re,
        onMouseleave: he
      }, null, 544)
    ], 36));
  }
}), to = /* @__PURE__ */ et(kn, [["__scopeId", "data-v-1752ef06"]]), Vt = Y(0), Et = 28, it = 12;
let Ft = 10, yt = "cathode.layout", xt = !1;
const ye = Y({});
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
  Ft = t;
}
function tt() {
  localStorage.setItem(yt, JSON.stringify(ye.value));
}
function Ln(t) {
  xt = !1, localStorage.removeItem(yt), ye.value = { ...t }, tt(), xt = !0, Vt.value++;
}
function cl(t) {
  Ft++, ye.value[t] && (ye.value[t].zIndex = Ft);
}
function Rn(t, l) {
  ye.value[t].visible = l, tt();
}
function Dn(t, l) {
  ye.value[t].minimized = l, l && (ye.value[t].maximized = !1), tt();
}
function En(t, l) {
  ye.value[t].maximized = l, l && (ye.value[t].minimized = !1, cl(t)), tt();
}
function Fn(t, l, e) {
  ye.value[t].x = Math.round(l), ye.value[t].y = Math.round(e), tt();
}
function An(t, l, e) {
  ye.value[t].w = Math.round(l), ye.value[t].h = Math.round(e), tt();
}
function lo(t, l, e) {
  const n = Math.ceil(Math.sqrt(e.length)), o = Math.ceil(e.length / n), i = Math.floor((t - it * (n + 1)) / n), f = Math.floor((l - it * (o + 1)) / o), v = {};
  return e.forEach((s, r) => {
    const u = r % n, h = Math.floor(r / n);
    v[s] = {
      x: it + u * (i + it),
      y: it + h * (f + it),
      w: i,
      h: f,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: r + 1
    };
  }), v;
}
function ul() {
  return {
    containers: ye,
    TITLEBAR_H: Et,
    load: In,
    save: tt,
    reset: Ln,
    bringToFront: cl,
    setVisible: Rn,
    setMinimized: Dn,
    setMaximized: En,
    updatePos: Fn,
    updateSize: An
  };
}
const _n = { class: "ws-toolbar" }, Bn = {
  key: 0,
  class: "ws-restore-menu"
}, Wn = {
  key: 0,
  class: "ws-restore-empty"
}, Yn = ["onClick"], zn = /* @__PURE__ */ Je({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const l = t, { containers: e, load: n, reset: o, setVisible: i } = ul(), f = Y(null);
    Gt("cathodeWorkspace", f), Gt("cathodeResetTick", Vt), Oe(() => {
      if (!f.value) return;
      const { clientWidth: d, clientHeight: m } = f.value, R = l.initialLayout ?? {};
      n(R, l.storageKey ?? "cathode.layout");
      const k = Object.keys(e.value)[0];
      k && v(k);
    });
    function v(d) {
      var R;
      document.querySelectorAll(".cc").forEach((k) => k.classList.remove("cc-focused"));
      const m = (R = f.value) == null ? void 0 : R.querySelector(`#cc-${d}`);
      m && m.classList.add("cc-focused");
    }
    function s() {
      !f.value || !l.initialLayout || o(l.initialLayout);
    }
    function r(d) {
      const m = d.target.closest(".cc");
      m && (document.querySelectorAll(".cc").forEach((R) => R.classList.remove("cc-focused")), m.classList.add("cc-focused"));
    }
    const u = Y(!1), h = () => Object.entries(e.value).filter(([, d]) => !d.visible).map(([d]) => d);
    function w(d) {
      i(d, !0), u.value = !1;
    }
    function S(d) {
      if (!u.value) return;
      const m = d.target;
      !m.closest(".ws-restore-menu") && !m.closest(".ws-btn-restore") && (u.value = !1);
    }
    function p(d) {
      d.key === "Escape" && (u.value = !1);
    }
    Oe(() => {
      document.addEventListener("click", S), document.addEventListener("keydown", p);
    }), Qe(() => {
      document.removeEventListener("click", S), document.removeEventListener("keydown", p);
    });
    function b(d) {
      var m;
      return ((m = l.containerTitles) == null ? void 0 : m[d]) ?? d;
    }
    return (d, m) => (ge(), pe("div", {
      ref_key: "workspaceEl",
      ref: f,
      class: "cathode-workspace",
      onMousedown: r
    }, [
      Dt(d.$slots, "default", {}, void 0, !0),
      Dt(d.$slots, "overlay", {}, void 0, !0),
      oe("div", _n, [
        t.initialLayout ? (ge(), pe("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: s
        }, " ↺ Reset Layout ")) : Be("", !0),
        m[1] || (m[1] = oe("div", { class: "ws-sep" }, null, -1)),
        oe("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: m[0] || (m[0] = (R) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      nl(Cl, { name: "menu" }, {
        default: Tl(() => [
          u.value ? (ge(), pe("div", Bn, [
            m[3] || (m[3] = oe("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            h().length ? Be("", !0) : (ge(), pe("div", Wn, " No closed panels ")),
            (ge(!0), pe(kl, null, Il(h(), (R) => (ge(), pe("div", {
              key: R,
              class: "ws-restore-item",
              onClick: (k) => w(R)
            }, [
              m[2] || (m[2] = oe("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Ll(" " + _e(b(R)), 1)
            ], 8, Yn))), 128))
          ])) : Be("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), no = /* @__PURE__ */ et(zn, [["__scopeId", "data-v-5838d04b"]]), Pn = ["id"], Hn = { class: "cc-title" }, $n = {
  key: 0,
  class: "cc-size-badge"
}, Vn = { class: "cc-controls" }, Nn = ["title"], On = { class: "cc-body" }, Xn = 200, Un = 80, ll = 60, Kn = /* @__PURE__ */ Je({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const l = t, { containers: e, bringToFront: n, setVisible: o, setMinimized: i, setMaximized: f, updatePos: v, updateSize: s } = ul(), r = bt("cathodeWorkspace", Y(null)), u = te(() => e.value[l.id]), h = te(() => {
      const M = u.value, q = l.curvature ?? 0;
      if (!M) return {};
      const le = { "--curvature": q };
      return M.maximized ? { ...le, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: M.zIndex } : {
        ...le,
        left: M.x + "px",
        top: M.y + "px",
        width: M.w + "px",
        height: M.minimized ? Et + "px" : M.h + "px",
        zIndex: M.zIndex,
        display: M.visible ? "flex" : "none"
      };
    });
    let w = !1, S = 0, p = 0;
    function b(M) {
      var ce;
      if (M.target.closest(".cc-btn") || u.value.maximized) return;
      n(l.id), w = !0;
      const q = (ce = r.value) == null ? void 0 : ce.querySelector(`#cc-${l.id}`);
      if (!q) return;
      const le = q.getBoundingClientRect();
      S = M.clientX - le.left, p = M.clientY - le.top, document.addEventListener("mousemove", d), document.addEventListener("mouseup", m), M.preventDefault();
    }
    function d(M) {
      var he;
      if (!w || !r.value) return;
      const q = r.value.getBoundingClientRect(), le = ((he = u.value) == null ? void 0 : he.w) ?? 300;
      let ce = M.clientX - q.left - S, re = M.clientY - q.top - p;
      ce = Math.max(ll - le, Math.min(q.width - ll, ce)), re = Math.max(0, Math.min(q.height - Et, re)), v(l.id, ce, re);
    }
    function m() {
      w = !1, document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", m);
    }
    let R = !1, k = 0, U = 0, g = 0, T = 0;
    const I = Y("");
    function z(M) {
      u.value.maximized || (n(l.id), R = !0, k = M.clientX, U = M.clientY, g = u.value.w, T = u.value.h, document.addEventListener("mousemove", F), document.addEventListener("mouseup", J), M.preventDefault(), M.stopPropagation());
    }
    function F(M) {
      if (!R) return;
      const q = Math.max(Xn, g + (M.clientX - k)), le = Math.max(Un, T + (M.clientY - U));
      s(l.id, q, le), I.value = `${Math.round(q)}×${Math.round(le)}`;
    }
    function J() {
      R = !1, I.value = "", document.removeEventListener("mousemove", F), document.removeEventListener("mouseup", J), G.value++;
    }
    const G = Y(0);
    O(Vt, () => {
      G.value++;
    }), Qe(() => {
      var M;
      document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", m), document.removeEventListener("mousemove", F), document.removeEventListener("mouseup", J), (M = K.value) == null || M.removeEventListener("scroll", A), $();
    });
    const K = Y(null);
    function j(M) {
      if (l.canvas) return [];
      const q = M.children[0];
      return q ? Array.from(q.children) : [];
    }
    function A() {
      const M = K.value, q = l.curvature ?? 0;
      if (!M) return;
      const le = j(M);
      if (!le.length) return;
      const ce = M.clientHeight, re = ce / 2, he = q * 38e-4;
      le.forEach((ae) => {
        if (!ae.dataset.origFs) {
          const $e = getComputedStyle(ae);
          ae.dataset.origFs = $e.fontSize, ae.dataset.origLh = $e.lineHeight;
        }
        if (q === 0) {
          ae.style.fontSize = "", ae.style.lineHeight = "";
          return;
        }
        const fe = ae.getBoundingClientRect(), D = M.getBoundingClientRect(), V = fe.top - D.top + fe.height / 2, ne = Math.min(1, Math.abs(V - re) / (ce / 2)), be = 1 + he * Math.cos(ne * Math.PI / 2), xe = parseFloat(ae.dataset.origFs), Te = ae.dataset.origLh, Ee = Te === "normal" ? xe * 1.4 : parseFloat(Te);
        isNaN(xe) || (ae.style.fontSize = `${(xe * be).toFixed(2)}px`), isNaN(Ee) || (ae.style.lineHeight = `${(Ee * be).toFixed(2)}px`);
      });
    }
    function $() {
      const M = K.value;
      M && j(M).forEach((q) => {
        q.style.fontSize = "", q.style.lineHeight = "", delete q.dataset.origFs, delete q.dataset.origLh;
      });
    }
    O(() => l.curvature, (M) => {
      (M ?? 0) === 0 ? $() : A();
    }), Oe(() => {
      var M;
      (M = K.value) == null || M.addEventListener("scroll", A, { passive: !0 }), Ye(A);
    });
    function P() {
      i(l.id, !u.value.minimized), Ye(() => {
        G.value++;
      });
    }
    function W() {
      f(l.id, !u.value.maximized), Ye(() => {
        G.value++;
      });
    }
    function X() {
      o(l.id, !1);
    }
    function H() {
      n(l.id);
    }
    return (M, q) => u.value && u.value.visible ? (ge(), pe("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: Rl(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: De(h.value),
      onMousedown: H
    }, [
      oe("div", {
        class: "cc-titlebar",
        onMousedown: b
      }, [
        q[0] || (q[0] = oe("span", { class: "cc-status-dot" }, null, -1)),
        oe("span", Hn, _e(t.title), 1),
        I.value ? (ge(), pe("span", $n, _e(I.value), 1)) : Be("", !0),
        oe("div", Vn, [
          oe("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Ne(P, ["stop"])
          }, "─"),
          oe("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: Ne(W, ["stop"])
          }, _e(u.value.maximized ? "⤡" : "⤢"), 9, Nn),
          oe("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Ne(X, ["stop"])
          }, "✕")
        ])
      ], 32),
      ol(oe("div", On, [
        oe("div", {
          ref_key: "bodyEl",
          ref: K,
          class: "cc-screen",
          onScroll: A
        }, [
          Dt(M.$slots, "default", { resizeKey: G.value }, void 0, !0),
          q[1] || (q[1] = oe("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Dl, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (ge(), pe("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Ne(z, ["stop"])
      }, null, 32)) : Be("", !0)
    ], 46, Pn)) : Be("", !0);
  }
}), oo = /* @__PURE__ */ et(Kn, [["__scopeId", "data-v-d8a49f79"]]), Gn = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, jn = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  void main() {
    vec2 uv = barrel(vUv);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }
    vec4 color = texture2D(uTex, uv);
    if (uScanlines > 0.5 && mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }
    gl_FragColor = color;
  }
`, qn = 100, Zn = /* @__PURE__ */ Je({
  __name: "CathodeLoader",
  props: {
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    label: { default: "BOOTING" }
  },
  setup(t) {
    const l = t, e = {
      none: { bg: "rgba(0,0,0,0)", text: "#33ff77", cursor: "#33ff77" },
      phosphor: { bg: "#060d06", text: "#33ff33", cursor: "#80ff80" },
      amber: { bg: "#0a0700", text: "#ffb000", cursor: "#ffd060" },
      paper: { bg: "rgba(0,0,0,0)", text: "#222222", cursor: "#158cba" }
    }, n = Y(null), o = Y(null);
    let i = null, f = !1, v, s, r, u, h, w = null, S = 0;
    function p(g) {
      g - S >= qn && (m(), S = g), w = requestAnimationFrame(p);
    }
    function b() {
      if (!n.value || !h) return;
      const g = n.value.clientWidth, T = n.value.clientHeight;
      g <= 0 || T <= 0 || h.width === g && h.height === T || (h.width = g, h.height = T, i && i.setSize(g, T, !1), o.value && (o.value.width = g, o.value.height = T, o.value.style.width = g + "px", o.value.style.height = T + "px"));
    }
    function d() {
      if (!(h != null && h.width)) return;
      const g = h.getContext("2d");
      if (!g) return;
      const T = h.width, I = h.height, z = e[l.theme] ?? e.none;
      g.clearRect(0, 0, T, I), g.fillStyle = z.bg, g.fillRect(0, 0, T, I);
      const F = Date.now(), J = (F / 500 | 0) % 2 === 0, G = (F / 400 | 0) % 4;
      g.font = `bold ${Math.max(14, Math.min(T, I) * 0.06)}px monospace`, g.textAlign = "center", g.textBaseline = "middle", g.fillStyle = z.text, l.glow && (g.shadowColor = z.text, g.shadowBlur = 14);
      const K = ".".repeat(G).padEnd(3, " "), j = `${l.label}${K}`;
      if (g.fillText(j, T / 2, I / 2), g.shadowBlur = 0, J) {
        const A = g.measureText(j), $ = g.measureText("M").width, P = parseFloat(g.font), W = T / 2 + A.width / 2 + 4, X = I / 2 - P / 2 + 2;
        g.fillStyle = z.cursor, l.glow && (g.shadowColor = z.cursor, g.shadowBlur = 12), g.fillRect(W, X, $ * 0.7, P * 0.95), g.shadowBlur = 0;
      }
    }
    function m() {
      if (!h) return;
      if (d(), f) {
        if (!o.value) return;
        const T = o.value.getContext("2d");
        T && T.drawImage(h, 0, 0);
        return;
      }
      if (!i || !r || !u) return;
      const g = l.theme === "paper";
      r.uniforms.uStrength.value = l.curvature / 45 * 0.55, r.uniforms.uScanlines.value = l.scanlines && !g ? 1 : 0, r.uniforms.uVignette.value = g ? 0 : 1, u.needsUpdate = !0, i.render(v, s);
    }
    function R() {
      if (!(!o.value || !n.value)) {
        h = document.createElement("canvas");
        try {
          i = new N.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          f = !0;
        }
        if (!f && !i.getContext() && (i.dispose(), i = null, f = !0), f) {
          b();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), v = new N.Scene(), s = new N.OrthographicCamera(-1, 1, 1, -1, 0, 1), u = new N.CanvasTexture(h), u.minFilter = N.LinearFilter, u.magFilter = N.LinearFilter, r = new N.ShaderMaterial({
          uniforms: {
            uTex: { value: u },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Gn,
          fragmentShader: jn,
          transparent: !0
        }), v.add(new N.Mesh(new N.PlaneGeometry(2, 2), r)), b();
      }
    }
    let k = null;
    Oe(() => {
      R(), m(), w = requestAnimationFrame(p), n.value && (k = new ResizeObserver(() => b()), k.observe(n.value));
    }), Qe(() => {
      w !== null && cancelAnimationFrame(w), k == null || k.disconnect(), i && i.dispose(), u == null || u.dispose(), r == null || r.dispose();
    }), O(() => [l.theme, l.curvature, l.scanlines, l.glow, l.label], () => m());
    const U = te(() => ({
      background: (e[l.theme] ?? e.none).bg
    }));
    return (g, T) => (ge(), pe("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-loader-wrap",
      style: De(U.value)
    }, [
      oe("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), ao = /* @__PURE__ */ et(Zn, [["__scopeId", "data-v-2be1f107"]]);
export {
  wt as CANDLE_THEME_COLORS,
  to as CathodeCandle,
  oo as CathodeContainer,
  Qn as CathodeGrid,
  ao as CathodeLoader,
  en as CathodeLog,
  eo as CathodeTerminal,
  no as CathodeWorkspace,
  pt as LOG_THEME_COLORS,
  lo as buildDefaultLayout,
  ul as useCathodeLayout
};
