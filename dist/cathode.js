import { defineComponent as Je, ref as z, reactive as kt, computed as ne, watch as N, inject as Tt, nextTick as ze, onMounted as Oe, onUnmounted as Qe, openBlock as pe, createElementBlock as we, normalizeStyle as Fe, createElementVNode as re, withModifiers as Ne, withKeys as kn, createCommentVNode as We, toDisplayString as Be, createVNode as rn, withDirectives as sn, vModelText as In, provide as Zt, renderSlot as At, Transition as Ln, withCtx as Rn, Fragment as Dn, renderList as En, createTextVNode as Fn, normalizeClass as An, vShow as _n } from "vue";
import * as X from "three";
const ct = {
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
}, me = 30, It = 12, Bn = 10, cn = 28;
function Wn(t, n) {
  if (typeof n == "function") return n(t);
  const e = t.filter((a) => a != null && a !== "");
  if (n === "count") return e.length;
  const l = e.map((a) => Number(a)).filter((a) => !Number.isNaN(a));
  if (l.length === 0) return null;
  switch (n) {
    case "sum":
      return l.reduce((a, i) => a + i, 0);
    case "avg":
      return l.reduce((a, i) => a + i, 0) / l.length;
    case "min":
      return Math.min(...l);
    case "max":
      return Math.max(...l);
  }
}
function Jt(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, i = ct[n.theme] ?? ct.none, { cols: f, rows: d, pinnedRows: c, rowHeight: r, scrollY: u, scrollX: h, glow: y } = n;
  e.clearRect(0, 0, l, a), e.fillStyle = i.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const S = c.length * r, p = n.aggregateRow ? cn : 0, b = a - me - S - p;
  e.fillStyle = i.headerBg, e.fillRect(0, 0, l, me), e.textBaseline = "middle", e.textAlign = "left";
  let v = -h;
  for (let _ = 0; _ < f.length; _++) {
    const V = f[_];
    if (v + V.width <= 0) {
      v += V.width;
      continue;
    }
    if (v >= l) break;
    const W = !!n.colFilters[V.colId], B = n.sortColId === V.colId, O = (V.colDef.headerName ?? V.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(v, 0, V.width, me), e.clip(), e.font = `bold ${Bn}px system-ui, -apple-system, sans-serif`, e.fillStyle = W ? i.accent : i.textHeader, y ? (e.shadowColor = i.textHeader, e.shadowBlur = 10, e.fillText(O, v + 8, me / 2), e.shadowBlur = 4, e.fillText(O, v + 8, me / 2), e.shadowBlur = 0) : e.fillText(O, v + 8, me / 2), B) {
      const $ = e.measureText(O).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = i.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", v + 8 + $ + 4, me / 2);
    }
    V.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = W ? i.accent : i.textHeader, e.globalAlpha = W ? 1 : 0.38, e.fillText("⌕", v + V.width - 20, me / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(v + V.width - 0.5, 0), e.lineTo(v + V.width - 0.5, me), e.stroke(), v += V.width;
  }
  e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, me - 0.5), e.lineTo(l, me - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, me, l, b), e.clip();
  const m = Math.max(0, Math.floor(u / r)), D = Math.min(d.length, Math.ceil((u + b) / r)), L = n.selectionAnchorRow ?? n.selectedRow, K = n.selectionAnchorCol ?? n.selectedCol, g = n.selectedRow >= 0 && L >= 0 ? Math.min(n.selectedRow, L) : -1, k = n.selectedRow >= 0 && L >= 0 ? Math.max(n.selectedRow, L) : -1, R = n.selectedCol >= 0 && K >= 0 ? Math.min(n.selectedCol, K) : -1, P = n.selectedCol >= 0 && K >= 0 ? Math.max(n.selectedCol, K) : -1, A = k > g || P > R;
  let Q = Number.POSITIVE_INFINITY, G = Number.NEGATIVE_INFINITY, U = Number.POSITIVE_INFINITY, j = Number.NEGATIVE_INFINITY;
  for (let _ = m; _ < D; _++) {
    const V = d[_], W = me + _ * r - u;
    _ % 2 === 1 && (e.fillStyle = i.rowAlt, e.fillRect(0, W, l, r));
    const B = _ >= g && _ <= k;
    _ === n.hoveredRow && !B && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, W, l, r)), B && !A && (e.fillStyle = Lt(i.accent, 0.1), e.fillRect(0, W, l, r)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, W + r - 0.5), e.lineTo(l, W + r - 0.5), e.stroke();
    let O = -h;
    for (let $ = 0; $ < f.length; $++) {
      const M = f[$];
      if (O + M.width <= 0) {
        O += M.width;
        continue;
      }
      if (O >= l) break;
      const q = B && $ >= R && $ <= P;
      q && A && (e.fillStyle = Lt(i.accent, 0.14), e.fillRect(O, W, M.width, r)), q && (O < Q && (Q = O), O + M.width > G && (G = O + M.width), W < U && (U = W), W + r > j && (j = W + r));
      const te = n.getCellStyle(M, V), se = te.color ?? i.text, ie = te.textAlign ?? "left", fe = n.formatCell(M, V);
      e.save(), e.beginPath(), e.rect(O + 1, W, M.width - 2, r), e.clip(), e.font = `${It}px system-ui, -apple-system, sans-serif`, e.fillStyle = se, e.textBaseline = "middle";
      const ae = ie === "right" ? O + M.width - 8 : O + 8;
      e.textAlign = ie === "right" ? "right" : "left";
      const ce = W + r / 2;
      y ? (e.shadowColor = se, e.shadowBlur = 12, e.fillText(fe, ae, ce), e.shadowBlur = 6, e.fillText(fe, ae, ce), e.shadowBlur = 2, e.fillText(fe, ae, ce), e.shadowBlur = 0) : e.fillText(fe, ae, ce), e.restore(), _ === n.selectedRow && $ === n.selectedCol && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(O + 1.5, W + 1.5, M.width - 3, r - 3)), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(O + M.width - 0.5, W), e.lineTo(O + M.width - 0.5, W + r), e.stroke(), O += M.width;
    }
  }
  if (A && Q < G && U < j && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(Q + 0.5, U + 0.5, G - Q - 1, j - U - 1)), e.restore(), c.length > 0) {
    const _ = a - S - p;
    e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, _ - 0.5), e.lineTo(l, _ - 0.5), e.stroke();
    for (let V = 0; V < c.length; V++) {
      const W = c[V], B = _ + V * r;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, B, l, r);
      let O = -h;
      for (let $ = 0; $ < f.length; $++) {
        const M = f[$];
        if (O + M.width <= 0) {
          O += M.width;
          continue;
        }
        if (O >= l) break;
        const q = n.getCellStyle(M, W), te = q.color ?? i.text, se = q.textAlign ?? "left", ie = n.formatCell(M, W);
        e.save(), e.beginPath(), e.rect(O + 1, B, M.width - 2, r), e.clip(), e.font = `bold ${It}px system-ui, -apple-system, sans-serif`, e.fillStyle = te, e.textBaseline = "middle", se === "right" ? (e.textAlign = "right", e.fillText(ie, O + M.width - 8, B + r / 2)) : (e.textAlign = "left", e.fillText(ie, O + 8, B + r / 2)), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(O + M.width - 0.5, B), e.lineTo(O + M.width - 0.5, B + r), e.stroke(), O += M.width;
      }
      e.strokeStyle = i.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, B + r - 0.5), e.lineTo(l, B + r - 0.5), e.stroke();
    }
  }
  if (n.aggregateRow) {
    const _ = a - p;
    e.fillStyle = Lt(i.accent, 0.1), e.fillRect(0, _, l, p), e.strokeStyle = i.accent, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, _ - 0.5), e.lineTo(l, _ - 0.5), e.stroke();
    let V = -h;
    for (let W = 0; W < f.length; W++) {
      const B = f[W];
      if (V + B.width <= 0) {
        V += B.width;
        continue;
      }
      if (V >= l) break;
      const $ = n.getCellStyle(B, n.aggregateRow).textAlign ?? "left", M = n.aggregateRow[B.colId] ?? "";
      e.save(), e.beginPath(), e.rect(V + 1, _, B.width - 2, p), e.clip(), e.font = `bold ${It}px system-ui, -apple-system, sans-serif`, e.fillStyle = i.accent, e.textBaseline = "middle", y && (e.shadowColor = i.accent, e.shadowBlur = 8), $ === "right" ? (e.textAlign = "right", e.fillText(M, V + B.width - 8, _ + p / 2)) : (e.textAlign = "left", e.fillText(M, V + 8, _ + p / 2)), e.shadowBlur = 0, e.restore(), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(V + B.width - 0.5, _), e.lineTo(V + B.width - 0.5, _ + p), e.stroke(), V += B.width;
    }
  }
  e.restore();
}
function Lt(t, n) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(t.slice(1, 3), 16), l = parseInt(t.slice(3, 5), 16), a = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${l},${a},${n})`;
}
function Yn(t, n, e) {
  const l = t - 0.5, a = n - 0.5, i = (l * l + a * a) * e, f = l * (1 + i) * i, d = a * (1 + i) * i;
  return [t + f, n + d * 0.15];
}
function zn(t, n, e, l, a) {
  const i = t / e, f = 1 - n / l, [d, c] = Yn(i, f, a);
  return d < 0 || d > 1 || c < 0 || c > 1 ? [-1, -1] : [d * e, (1 - c) * l];
}
function Rt(t, n) {
  let e = 0;
  for (let l = 0; l < t; l++) e += n[l].width;
  return e;
}
function Pn(t, n, e) {
  return t >= n + e - 24 && t < n + e;
}
function Qt(t, n, e) {
  const l = n + e;
  return t >= l - 6 && t <= l + 1;
}
function en(t, n, e, l, a, i, f, d, c, r = !1) {
  const u = t + c;
  let h = -1, y = 0;
  for (let m = 0; m < e.length; m++) {
    if (u >= y && u < y + e[m].width) {
      h = m;
      break;
    }
    y += e[m].width;
  }
  if (n < me) return { area: "header", colIdx: h, rowIdx: -1 };
  const S = r ? cn : 0;
  if (S > 0 && n >= f - S)
    return { area: "agg", colIdx: h, rowIdx: -1 };
  const p = d * a;
  if (p > 0 && n >= f - p - S) {
    const m = Math.floor((n - (f - p - S)) / a);
    return { area: "pinned", colIdx: h, rowIdx: m };
  }
  const b = n - me + i, v = Math.floor(b / a);
  return v >= 0 && v < l ? { area: "body", colIdx: h, rowIdx: v } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const Hn = 500, $n = Hn / 2, Vn = 1.6, Wt = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`, Yt = `
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
`, zt = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`;
function Pt() {
  return {
    uMouseUV: { value: new X.Vector2(-999, -999) },
    uLensR: { value: 0 },
    uLensZoom: { value: Vn },
    uLensTint: { value: new X.Color(7268263) },
    uAspect: { value: 1 }
  };
}
const Me = { x: -999, y: -999 };
function Ht(t, n, e, l, a) {
  const i = n && e.x !== -999;
  t.uniforms.uMouseUV.value.set(e.x, e.y), t.uniforms.uLensR.value = i && a > 0 ? $n / a : 0, t.uniforms.uAspect.value = a > 0 ? l / a : 1;
}
function $t(t, n) {
  const e = n.getBoundingClientRect();
  return {
    x: (t.clientX - e.left) / e.width,
    y: 1 - (t.clientY - e.top) / e.height
  };
}
const Xn = ["value"], Nn = ["disabled"], On = ["disabled"], Un = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Kn = 28, Gn = 600, jn = /* @__PURE__ */ Je({
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
  setup(t, { emit: n }) {
    const e = t, l = n, a = z(e.rowData ?? []), i = z(e.pinnedBottomRowData ?? []), f = z(""), d = z(null), c = kt({}), r = kt({}), u = kt(/* @__PURE__ */ new Set()), h = z(0), y = z(0), S = z(0), p = z(0), b = z(0), v = z(-1), m = z(null), D = z(null), L = z(null), K = { ...Me }, g = z({ x: 0, y: me }), k = z("");
    function R(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const P = ne(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((s) => !u.has(R(s))).map((s) => {
        const x = R(s), I = { ...o, ...s };
        return { colId: x, colDef: I, width: r[x] ?? I.width ?? 100 };
      });
    }), A = ne(() => {
      const o = y.value;
      if (!o) return P.value;
      const s = P.value.reduce((T, E) => T + E.width, 0);
      if (!s || s >= o) return P.value;
      const x = o / s;
      let I = 0;
      return P.value.map((T, E) => {
        const Z = E === P.value.length - 1 ? o - I : Math.max(8, Math.round(T.width * x));
        return I += Z, { ...T, width: Z };
      });
    }), Q = ne(() => {
      const o = A.value.reduce((s, x) => s + x.width, 0);
      return Math.max(0, o - y.value);
    }), G = ne(() => {
      const o = i.value.length * e.rowHeight;
      return Math.max(0, S.value - me - o);
    }), U = ne(
      () => Math.max(0, $.value.length * e.rowHeight - G.value)
    ), j = ne(
      () => Math.max(1, Math.floor(G.value / e.rowHeight))
    ), _ = ne(
      () => $.value.length === 0 ? 0 : Math.min($.value.length - 1, Math.floor(p.value / e.rowHeight))
    ), V = ne(
      () => Math.min($.value.length - 1, _.value + j.value - 1)
    );
    function W(o, s) {
      if (s.colDef.valueGetter) return s.colDef.valueGetter({ data: o, colDef: s.colDef });
      if (s.colDef.field) return o[s.colDef.field];
    }
    function B(o, s) {
      const x = W(s, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: x, data: s, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: x, data: s, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : x == null ? "" : String(x);
    }
    function O(o, s) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: W(s, o), data: s, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const $ = ne(() => {
      h.value;
      let o = a.value;
      const s = f.value.trim().toLowerCase();
      s && (o = o.filter(
        (x) => P.value.some(
          (I) => String(W(x, I) ?? "").toLowerCase().includes(s)
        )
      ));
      for (const [x, I] of Object.entries(c)) {
        if (!I) continue;
        const T = P.value.find((E) => E.colId === x);
        if (T)
          if (I.startsWith("__eq__")) {
            const E = I.slice(6).toLowerCase();
            o = o.filter((Y) => String(W(Y, T) ?? "").toLowerCase() === E);
          } else {
            const E = I.toLowerCase();
            o = o.filter((Y) => String(W(Y, T) ?? "").toLowerCase().includes(E));
          }
      }
      if (d.value) {
        const { colId: x, dir: I } = d.value, T = P.value.find((E) => E.colId === x);
        T && (o = [...o].sort((E, Y) => {
          const Z = W(E, T), de = W(Y, T);
          let ge = 0;
          return T.colDef.comparator ? ge = T.colDef.comparator(Z, de) : typeof Z == "number" && typeof de == "number" ? ge = Z - de : ge = String(Z ?? "").localeCompare(String(de ?? ""), void 0, { numeric: !0 }), I === "asc" ? ge : -ge;
        }));
      }
      return o;
    }), M = ne(() => {
      const o = P.value.filter((T) => T.colDef.aggFunc != null);
      if (o.length === 0) return null;
      const s = $.value, x = {};
      for (const T of o) {
        const E = s.map((Z) => W(Z, T)), Y = Wn(E, T.colDef.aggFunc);
        if (Y == null) {
          x[T.colId] = "";
          continue;
        }
        x[T.colId] = T.colDef.aggValueFormatter ? T.colDef.aggValueFormatter(Y) : String(Y);
      }
      const I = o[0].colId;
      return x[I] === "" && (x[I] = "Σ"), x;
    });
    N($, () => {
      p.value = 0, m.value = null;
    }), N(Q, () => {
      b.value = Math.min(b.value, Q.value);
    }), N(U, () => {
      p.value = Math.min(p.value, U.value);
    });
    function q(o) {
      const s = o * e.rowHeight, x = s + e.rowHeight;
      s < p.value ? p.value = s : x > p.value + G.value && (p.value = Math.min(U.value, x - G.value));
    }
    function te() {
      p.value = Math.max(0, p.value - G.value), oe();
    }
    function se() {
      p.value = Math.min(U.value, p.value + G.value), oe();
    }
    let ie = !1, fe = "", ae = 0, ce = 0, ke = !1, be = !1, De = 0, C = 0, H = 0, le = 0, ve = !1;
    function Se(o, s) {
      var x;
      ie = !0, fe = o, ae = s, ce = ((x = A.value.find((I) => I.colId === o)) == null ? void 0 : x.width) ?? 100, ke = !1;
    }
    function Pe(o) {
      if (be) {
        const E = De - o.clientX, Y = C - o.clientY;
        (Math.abs(E) > 4 || Math.abs(Y) > 4) && (ve = !0), b.value = Math.max(0, Math.min(Q.value, H + E)), p.value = Math.max(0, Math.min(U.value, le + Y)), oe();
        return;
      }
      if (!ie) return;
      const s = y.value, x = Math.max(30, ce + (o.clientX - ae)), I = P.value.filter((E) => E.colId !== fe).reduce((E, Y) => E + Y.width, 0), T = s - x;
      T > 10 && (r[fe] = Math.max(10, Math.round(x * I / T))), oe();
    }
    function nt() {
      be && (ve && (ke = !0), be = !1), ie && (ie = !1, ke = !0, l("column-resized"));
    }
    function ut(o) {
      if (o.touches.length !== 1) return;
      const s = o.touches[0];
      be = !0, ve = !1, De = s.clientX, C = s.clientY, H = b.value, le = p.value;
    }
    function lt(o) {
      if (!be || o.touches.length !== 1) return;
      o.preventDefault();
      const s = o.touches[0], x = De - s.clientX, I = C - s.clientY;
      (Math.abs(x) > 4 || Math.abs(I) > 4) && (ve = !0), b.value = Math.max(0, Math.min(Q.value, H + x)), p.value = Math.max(0, Math.min(U.value, le + I)), oe();
    }
    function Xe() {
      be && (ve && (ke = !0), be = !1);
    }
    const Ie = z(null), ee = z(null), He = Tt("cathodeResetTick", z(0));
    N(He, () => at());
    let ue = null, $e = !1, Ae, ft, Ce, Te, he;
    const w = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour
  ${Wt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Yt}

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

    ${zt}

    gl_FragColor = color;
  }
`;
    function F() {
      if (!(!ee.value || !Ie.value)) {
        he = document.createElement("canvas");
        try {
          ue = new X.WebGLRenderer({ canvas: ee.value, antialias: !1, alpha: !0 });
        } catch {
          $e = !0;
        }
        if (!$e && !ue.getContext() && (ue.dispose(), ue = null, $e = !0), $e) {
          J();
          return;
        }
        ue.setPixelRatio(1), ue.setClearColor(0, 0), Ae = new X.Scene(), ft = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), Te = new X.CanvasTexture(he), Te.minFilter = X.LinearFilter, Te.magFilter = X.LinearFilter, Ce = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: Te },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new X.Color(0) },
            ...Pt()
          },
          vertexShader: Un,
          fragmentShader: w,
          transparent: !0
        }), Ae.add(new X.Mesh(new X.PlaneGeometry(2, 2), Ce)), J();
      }
    }
    function J() {
      if (!Ie.value || !ue && !$e) return;
      const o = Ie.value.clientWidth, s = Ie.value.clientHeight - (e.pagination ? Kn : 0);
      if (!o || !s) return;
      const x = he.width !== o || he.height !== s;
      he.width = o, he.height = s, y.value = o, S.value = s, b.value = Math.max(0, Math.min(Q.value, b.value)), p.value = Math.max(0, Math.min(U.value, p.value)), ue ? (x && Te && (Te.dispose(), Te = new X.CanvasTexture(he), Te.minFilter = X.LinearFilter, Te.magFilter = X.LinearFilter, Ce && (Ce.uniforms.uTex.value = Te)), ue.setPixelRatio(window.devicePixelRatio || 1), ue.setSize(o, s)) : ee.value && (ee.value.width = o, ee.value.height = s, ee.value.style.width = o + "px", ee.value.style.height = s + "px"), oe();
    }
    function oe() {
      var x, I, T, E, Y, Z, de, ge, it, ht, mt, rt;
      if (!(he != null && he.width)) return;
      if ($e) {
        if (!ee.value) return;
        Jt(he, {
          cols: A.value,
          rows: $.value,
          pinnedRows: i.value,
          rowHeight: e.rowHeight,
          scrollY: p.value,
          scrollX: b.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((x = d.value) == null ? void 0 : x.colId) ?? null,
          sortDir: ((I = d.value) == null ? void 0 : I.dir) ?? null,
          colFilters: c,
          hoveredRow: v.value,
          selectedRow: ((T = m.value) == null ? void 0 : T.row) ?? -1,
          selectedCol: ((E = m.value) == null ? void 0 : E.col) ?? -1,
          selectionAnchorRow: ((Y = D.value) == null ? void 0 : Y.row) ?? -1,
          selectionAnchorCol: ((Z = D.value) == null ? void 0 : Z.col) ?? -1,
          formatCell: B,
          getCellStyle: O
        });
        const gt = ee.value.getContext("2d");
        gt && gt.drawImage(he, 0, 0);
        return;
      }
      if (!ue || !Ce || !Te) return;
      const o = ct[e.theme] ?? ct.none, s = e.theme === "paper";
      Ce.uniforms.uStrength.value = e.curvature / 45 * 0.55, Ce.uniforms.uScanlines.value = e.scanlines && !s ? 1 : 0, Ce.uniforms.uVignette.value = s ? 0 : 1, Ce.uniforms.uBezel.value.set(o.bg), Ht(Ce, e.magnify, K, he.width, he.height), Jt(he, {
        cols: A.value,
        rows: $.value,
        pinnedRows: i.value,
        rowHeight: e.rowHeight,
        scrollY: p.value,
        scrollX: b.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((de = d.value) == null ? void 0 : de.colId) ?? null,
        sortDir: ((ge = d.value) == null ? void 0 : ge.dir) ?? null,
        colFilters: c,
        hoveredRow: v.value,
        selectedRow: ((it = m.value) == null ? void 0 : it.row) ?? -1,
        selectedCol: ((ht = m.value) == null ? void 0 : ht.col) ?? -1,
        selectionAnchorRow: ((mt = D.value) == null ? void 0 : mt.row) ?? -1,
        selectionAnchorCol: ((rt = D.value) == null ? void 0 : rt.col) ?? -1,
        formatCell: B,
        getCellStyle: O,
        aggregateRow: M.value
      }), Te.needsUpdate = !0, ue.render(Ae, ft);
    }
    function Ee(o) {
      if (!ee.value) return [-1, -1];
      const s = ee.value.getBoundingClientRect(), x = o.clientX - s.left, I = o.clientY - s.top, T = ee.value.width || s.width, E = ee.value.height || s.height, Y = e.curvature / 45 * 0.55, [Z, de] = zn(x, I, T, E, Y);
      return Z < 0 ? [-1, -1] : [Z, de];
    }
    let Le = 0;
    function _e(o) {
      L.value = null;
      const s = Date.now();
      if (o.deltaX !== 0) {
        Le = s, b.value = Math.max(0, Math.min(Q.value, b.value + o.deltaX)), oe();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        Le = s, b.value = Math.max(0, Math.min(Q.value, b.value + o.deltaY)), oe();
        return;
      }
      s - Le < Gn || (p.value = Math.max(0, Math.min(U.value, p.value + o.deltaY)), oe());
    }
    function ot(o) {
      if (ie) return;
      if (e.magnify && ee.value) {
        const T = $t(o, ee.value);
        K.x = T.x, K.y = T.y;
      }
      const [s, x] = Ee(o);
      if (s < 0) {
        v.value = -1, oe();
        return;
      }
      const I = en(
        s,
        x,
        A.value,
        $.value.length,
        e.rowHeight,
        p.value,
        he.height,
        i.value.length,
        b.value,
        M.value !== null
      );
      if (v.value = I.area === "body" ? I.rowIdx : -1, I.area === "header" && I.colIdx >= 0) {
        const T = A.value[I.colIdx], E = Rt(I.colIdx, A.value), Y = s + b.value;
        ee.value.style.cursor = T && Qt(Y, E, T.width) ? "col-resize" : "pointer";
      } else I.area === "body" ? ee.value.style.cursor = "pointer" : ee.value.style.cursor = "default";
      oe();
    }
    function Ge() {
      v.value = -1, K.x = Me.x, K.y = Me.y, oe();
    }
    function mn(o) {
      const [s, x] = Ee(o);
      if (s < 0) return;
      if (x >= me) {
        be = !0, ve = !1, De = o.clientX, C = o.clientY, H = b.value, le = p.value;
        return;
      }
      const I = s + b.value;
      for (let T = 0; T < A.value.length; T++) {
        const E = A.value[T], Y = Rt(T, A.value);
        if (E.colDef.resizable !== !1 && Qt(I, Y, E.width)) {
          Se(E.colId, o.clientX);
          return;
        }
      }
    }
    function gn(o) {
      var T, E, Y;
      if (ke) {
        ke = !1;
        return;
      }
      if (ie) return;
      const [s, x] = Ee(o);
      if (s < 0) {
        L.value = null;
        return;
      }
      const I = en(
        s,
        x,
        A.value,
        $.value.length,
        e.rowHeight,
        p.value,
        he.height,
        i.value.length,
        b.value,
        M.value !== null
      );
      if (I.area === "header" && I.colIdx >= 0) {
        const Z = A.value[I.colIdx], de = Rt(I.colIdx, A.value), ge = s + b.value;
        Z.colDef.filter && Pn(ge, de, Z.width) ? (o.stopPropagation(), L.value === Z.colId ? L.value = null : (L.value = Z.colId, k.value = (T = c[Z.colId]) != null && T.startsWith("__eq__") ? c[Z.colId].slice(6) : c[Z.colId] ?? "", g.value = { x: Math.max(0, de - b.value), y: me })) : Z.colDef.sortable !== !1 && (L.value = null, d.value = ((E = d.value) == null ? void 0 : E.colId) === Z.colId ? d.value.dir === "asc" ? { colId: Z.colId, dir: "desc" } : null : { colId: Z.colId, dir: "asc" }, l("sort-changed"));
        return;
      }
      if (L.value = null, I.area === "body" && I.rowIdx >= 0 && I.colIdx >= 0) {
        const Z = I.rowIdx;
        o.shiftKey && m.value ? (D.value || (D.value = { ...m.value }), m.value = { row: Z, col: I.colIdx }) : (m.value = { row: Z, col: I.colIdx }, D.value = { row: Z, col: I.colIdx }), (Y = ee.value) == null || Y.focus();
        const de = $.value[Z], ge = A.value[I.colIdx];
        de && ge && (l("row-clicked", { data: de, event: o }), l("cell-selected", { data: de, row: Z, col: I.colIdx, colId: ge.colId }));
      }
    }
    function Ut(o) {
      var s, x;
      L.value && ((x = (s = o.target).closest) != null && x.call(s, ".cathode-filter-popup") || (L.value = null));
    }
    function pn(o) {
      var T;
      if (!y.value) return;
      let s = 0;
      for (let E = 0; E < o; E++) s += A.value[E].width;
      const x = ((T = A.value[o]) == null ? void 0 : T.width) ?? 0, I = s - b.value;
      I < 0 ? b.value = Math.max(0, s) : I + x > y.value && (b.value = Math.min(Q.value, s + x - y.value));
    }
    function wn(o) {
      const x = A.value.length - 1, I = $.value.length - 1;
      if (!m.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), m.value = { row: _.value, col: 0 }, D.value = { row: _.value, col: 0 });
        return;
      }
      let { row: T, col: E } = m.value;
      const Y = (Z, de, ge = !1) => {
        T = Math.max(0, Math.min(I, Z)), E = Math.max(0, Math.min(x, de)), m.value = { row: T, col: E }, ge || (D.value = { row: T, col: E }), q(T), pn(E);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), Y(T + 1, E, o.shiftKey);
          break;
        case "ArrowUp":
          o.preventDefault(), Y(T - 1, E, o.shiftKey);
          break;
        case "ArrowRight":
          o.preventDefault(), o.shiftKey ? Y(T, E + 1, !0) : E < x ? Y(T, E + 1) : Y(T + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), o.shiftKey ? Y(T, E - 1, !0) : E > 0 ? Y(T, E - 1) : Y(T - 1, x);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? E > 0 ? Y(T, E - 1) : Y(T - 1, x) : E < x ? Y(T, E + 1) : Y(T + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? Y(T - 1, E) : Y(T + 1, E);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? Y(0, 0, o.shiftKey) : Y(T, 0, o.shiftKey);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? Y(I, x, o.shiftKey) : Y(T, x, o.shiftKey);
          break;
        case "PageDown":
          o.preventDefault(), Y(Math.min(I, T + j.value), E, o.shiftKey);
          break;
        case "PageUp":
          o.preventDefault(), Y(Math.max(0, T - j.value), E, o.shiftKey);
          break;
        case "Escape":
          m.value = null, D.value = null;
          break;
        case "c":
        case "C":
          (o.ctrlKey || o.metaKey) && (o.preventDefault(), yn());
          break;
      }
    }
    function yn() {
      var ge;
      if (!m.value) return;
      const o = A.value, s = $.value, x = D.value ?? m.value, I = Math.min(x.row, m.value.row), T = Math.max(x.row, m.value.row), E = Math.min(x.col, m.value.col), Y = Math.max(x.col, m.value.col), Z = [];
      for (let it = I; it <= T; it++) {
        const ht = s[it];
        if (!ht) continue;
        const mt = [];
        for (let rt = E; rt <= Y; rt++) {
          const gt = o[rt];
          gt && mt.push(B(gt, ht).replace(/[\t\r\n]+/g, " "));
        }
        Z.push(mt.join("	"));
      }
      const de = Z.join(`
`);
      (ge = navigator.clipboard) == null || ge.writeText(de).catch(() => {
      });
    }
    function xn(o) {
      const s = o.target.value;
      k.value = s, s ? c[L.value] = s : delete c[L.value], l("filter-changed");
    }
    function Kt() {
      L.value && delete c[L.value], k.value = "", L.value = null, l("filter-changed");
    }
    const bn = {
      setGridOption(o, s) {
        o === "rowData" ? a.value = s : o === "pinnedBottomRowData" ? i.value = s : o === "quickFilterText" && (f.value = s);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var x, I;
          const s = R(o);
          return {
            colId: s,
            hide: u.has(s),
            sort: ((x = d.value) == null ? void 0 : x.colId) === s ? d.value.dir : null,
            sortIndex: ((I = d.value) == null ? void 0 : I.colId) === s ? 0 : null,
            width: r[s] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const s of o)
          s.hide === !0 && u.add(s.colId), s.hide === !1 && u.delete(s.colId), s.sort && (d.value = { colId: s.colId, dir: s.sort }), s.width && (r[s.colId] = s.width);
      },
      setFilterModel(o) {
        for (const s of Object.keys(c)) delete c[s];
        if (o)
          for (const [s, x] of Object.entries(o))
            (x == null ? void 0 : x.type) === "equals" ? c[s] = `__eq__${x.filter}` : x != null && x.filter && (c[s] = x.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [s, x] of Object.entries(c))
          x && (o[s] = x.startsWith("__eq__") ? { type: "equals", filter: x.slice(6) } : { type: "contains", filter: x });
        return o;
      },
      async setColumnFilterModel(o, s) {
        s ? s.type === "equals" ? c[o] = `__eq__${s.filter}` : c[o] = s.filter ?? "" : delete c[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        h.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const s = P.value, x = s.map((Y) => Y.colDef.headerName ?? Y.colId).join(","), I = $.value.map(
          (Y) => s.map((Z) => `"${String(B(Z, Y)).replace(/"/g, '""')}"`).join(",")
        ), T = new Blob([[x, ...I].join(`
`)], { type: "text/csv" }), E = URL.createObjectURL(T);
        Object.assign(document.createElement("a"), { href: E, download: o }).click(), URL.revokeObjectURL(E);
      },
      resize() {
        J();
      },
      resetColumnState() {
        u.clear();
        for (const s of e.columnDefs)
          s.hide && u.add(R(s));
        const o = e.columnDefs.find((s) => s.sort);
        d.value = o ? { colId: R(o), dir: o.sort } : null;
        for (const s of Object.keys(r)) delete r[s];
        for (const s of Object.keys(c)) delete c[s];
        f.value = "", p.value = 0, m.value = null, L.value = null;
      }
    };
    N(
      [$, () => i.value, A, p, v, m],
      () => ze(oe)
    ), N(() => e.theme, () => oe()), N(() => e.curvature, () => ze(J)), N(() => e.scanlines, () => oe()), N(() => e.glow, () => oe()), N(() => e.magnify, (o) => {
      o || (K.x = Me.x, K.y = Me.y), oe();
    }), N(m, (o) => {
      if (!o) return;
      const s = $.value[o.row], x = A.value[o.col];
      s && x && l("cell-selected", { data: s, row: o.row, col: o.col, colId: x.colId });
    });
    let dt = null, vt = null, Ct = 0;
    function at() {
      cancelAnimationFrame(Ct), Ct = requestAnimationFrame(J);
    }
    function Gt(o) {
      o.preventDefault();
    }
    function jt() {
      ue == null || ue.dispose(), ue = null, $e = !1, F();
    }
    Oe(() => {
      for (const o of e.columnDefs)
        o.hide && u.add(R(o)), o.sort && !d.value && (d.value = { colId: R(o), dir: o.sort });
      a.value = e.rowData ?? [], i.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", Ut), document.addEventListener("mousemove", Pe), document.addEventListener("mouseup", nt), ze(() => {
        var o;
        F(), ee.value && (ee.value.addEventListener("webglcontextlost", Gt), ee.value.addEventListener("webglcontextrestored", jt)), Ie.value && (dt = new ResizeObserver(() => J()), dt.observe(Ie.value), vt = new IntersectionObserver((s) => {
          s.some((x) => x.isIntersecting) && at();
        }), vt.observe(Ie.value)), window.addEventListener("resize", at), (o = window.visualViewport) == null || o.addEventListener("resize", at), l("grid-ready", { api: bn });
      });
    }), Qe(() => {
      var o, s, x;
      document.removeEventListener("click", Ut, !0), document.removeEventListener("mousemove", Pe), document.removeEventListener("mouseup", nt), (o = ee.value) == null || o.removeEventListener("webglcontextlost", Gt), (s = ee.value) == null || s.removeEventListener("webglcontextrestored", jt), dt == null || dt.disconnect(), vt == null || vt.disconnect(), window.removeEventListener("resize", at), (x = window.visualViewport) == null || x.removeEventListener("resize", at), cancelAnimationFrame(Ct), ue == null || ue.dispose();
    });
    const Re = ne(() => ct[e.theme] ?? ct.none), Mn = ne(() => ({
      position: "absolute",
      left: `${g.value.x}px`,
      top: `${g.value.y}px`,
      zIndex: 100,
      background: Re.value.headerBg,
      border: `1px solid ${Re.value.accent}`,
      color: Re.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Sn = ne(() => ({
      background: Re.value.bg,
      border: `1px solid ${Re.value.border}`,
      color: Re.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Tn = ne(() => ({
      background: Re.value.headerBg,
      borderTop: `1px solid ${Re.value.border}`,
      color: Re.value.text
    })), Cn = ne(() => ({
      background: Re.value.bg
    })), qt = ne(() => Re.value.accent);
    return (o, s) => {
      var x, I;
      return pe(), we("div", {
        ref_key: "wrapEl",
        ref: Ie,
        class: "cathode-wrap",
        style: Fe(Cn.value)
      }, [
        re("canvas", {
          ref_key: "canvasEl",
          ref: ee,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Ne(_e, ["prevent"]),
          onMousemove: ot,
          onMouseleave: Ge,
          onMousedown: mn,
          onClick: gn,
          onKeydown: wn,
          onTouchstartPassive: ut,
          onTouchmove: lt,
          onTouchend: Xe,
          onTouchcancel: Xe
        }, null, 544),
        L.value ? (pe(), we("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: Fe(Mn.value),
          onClick: s[0] || (s[0] = Ne(() => {
          }, ["stop"]))
        }, [
          re("input", {
            style: Fe(Sn.value),
            value: k.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: xn,
            onKeydown: kn(Kt, ["escape"])
          }, null, 44, Xn),
          k.value ? (pe(), we("button", {
            key: 0,
            style: Fe({
              background: "none",
              border: "none",
              color: Re.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: Kt
          }, "✕", 4)) : We("", !0)
        ], 4)) : We("", !0),
        t.pagination ? (pe(), we("div", {
          key: 1,
          class: "cathode-pagination",
          style: Fe(Tn.value)
        }, [
          re("button", {
            disabled: p.value <= 0,
            onClick: s[1] || (s[1] = (T) => te())
          }, "◀", 8, Nn),
          re("span", null, Be((_.value + 1).toLocaleString()) + "–" + Be(Math.min($.value.length, V.value + 1).toLocaleString()) + " / " + Be($.value.length.toLocaleString()), 1),
          re("button", {
            disabled: p.value >= U.value,
            onClick: s[2] || (s[2] = (T) => se())
          }, "▶", 8, On),
          re("span", {
            class: "cathode-page-info",
            style: Fe({ color: qt.value })
          }, Be($.value.length.toLocaleString()) + " rows ", 5),
          m.value ? (pe(), we("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Fe({ color: qt.value })
          }, Be(((x = A.value[m.value.col]) == null ? void 0 : x.colDef.headerName) ?? ((I = A.value[m.value.col]) == null ? void 0 : I.colId)) + " : " + Be(B(A.value[m.value.col], $.value[m.value.row])), 5)) : We("", !0)
        ], 4)) : We("", !0)
      ], 4);
    };
  }
}), et = (t, n) => {
  const e = t.__vccOpts || t;
  for (const [l, a] of n)
    e[l] = a;
  return e;
}, no = /* @__PURE__ */ et(jn, [["__scopeId", "data-v-e37eed70"]]), xt = {
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
function qn(t, n) {
  switch (n) {
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
const Zn = 12, ye = 18, wt = 10, qe = 6, Vt = `${Zn}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Jn(t, n, e) {
  if (e <= 0 || !n) return [n];
  const l = [];
  for (const a of n.split(`
`)) {
    if (!a) {
      l.push("");
      continue;
    }
    if (t.measureText(a).width <= e) {
      l.push(a);
      continue;
    }
    const i = a.split(/(\s+)/);
    let f = "";
    for (const d of i) {
      const c = f + d;
      if (t.measureText(c).width <= e)
        f = c;
      else if (f && (l.push(f.replace(/\s+$/, "")), f = ""), t.measureText(d).width > e) {
        let r = "";
        for (const u of d)
          t.measureText(r + u).width > e ? (r && l.push(r), r = u) : r += u;
        f = r;
      } else
        f = d.replace(/^\s+/, "");
    }
    f && l.push(f.replace(/\s+$/, ""));
  }
  return l.length ? l : [""];
}
function un(t) {
  if (typeof t == "number") {
    const n = new Date(t), e = String(n.getHours()).padStart(2, "0"), l = String(n.getMinutes()).padStart(2, "0"), a = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${l}:${a}`;
  }
  return t;
}
function Qn(t, n) {
  return Math.ceil(t.measureText(n).width) + 12;
}
function el(t) {
  const { entries: n, ctx: e, textMaxWidth: l, showTimestamps: a, wordWrap: i } = t, f = t.formatTs ?? un;
  e.font = Vt;
  const d = [];
  for (let c = 0; c < n.length; c++) {
    const r = n[c], u = r.level ?? "info", h = a && r.ts != null ? f(r.ts) : "", y = i ? Jn(e, r.text, l) : r.text.split(`
`);
    for (let S = 0; S < y.length; S++)
      d.push({
        entryIdx: c,
        text: y[S],
        level: u,
        timestamp: S === 0 ? h : "",
        isFirstFrag: S === 0,
        widthPx: e.measureText(y[S]).width
      });
  }
  return d;
}
function tn(t, n) {
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, i = xt[n.theme] ?? xt.none;
  e.clearRect(0, 0, l, a), e.fillStyle = i.bg, e.fillRect(0, 0, l, a), e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip(), e.font = Vt, e.textBaseline = "middle";
  const f = n.visualLines, d = wt - n.scrollX, c = (n.showTimestamps ? wt + n.timestampWidth : wt) - n.scrollX, r = Math.max(0, Math.floor((n.scrollY - qe) / ye)), u = Math.min(f.length, Math.ceil((n.scrollY + a - qe) / ye) + 1);
  for (let h = r; h < u; h++) {
    const y = f[h], S = qe + h * ye - n.scrollY + ye / 2;
    if (y.entryIdx % 2 === 1 && y.isFirstFrag) {
      e.fillStyle = i.rowAlt;
      let b = 1;
      for (; h + b < u && f[h + b].entryIdx === y.entryIdx; ) b++;
      e.fillRect(0, S - ye / 2, l, ye * b);
    }
    n.selectionStart >= 0 && h >= n.selectionStart && h <= n.selectionEnd && (e.fillStyle = i.selection ?? "rgba(110, 231, 167, 0.16)", e.fillRect(0, S - ye / 2, l, ye)), h === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, S - ye / 2, l, ye)), n.showTimestamps && y.timestamp && (e.fillStyle = i.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 6, e.shadowColor = i.timestamp), e.fillText(y.timestamp, d, S), e.shadowBlur = 0);
    const p = qn(i, y.level);
    e.fillStyle = p, e.textAlign = "left", n.glow ? (e.shadowColor = p, e.shadowBlur = 14, e.fillText(y.text, c, S), e.shadowBlur = 7, e.fillText(y.text, c, S), e.shadowBlur = 3, e.fillText(y.text, c, S), e.shadowBlur = 0) : e.fillText(y.text, c, S);
  }
  e.restore();
}
function nn(t, n, e) {
  if (t < 0) return -1;
  const l = Math.floor((t + n - qe) / ye);
  return l < 0 || l >= e ? -1 : l;
}
function tl(t) {
  return qe * 2 + t * ye;
}
const nl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ll = /* @__PURE__ */ Je({
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
  setup(t, { expose: n }) {
    const e = t, l = z(null), a = z(null), i = { ...Me }, f = z(0), d = z(0), c = z(0), r = z(-1), u = z(!0), h = z(-1), y = z(-1), S = ne(() => {
      const w = e.entries ?? [];
      return e.maxLines > 0 && w.length > e.maxLines ? w.slice(w.length - e.maxLines) : w;
    }), p = ne(() => {
      if (!e.showTimestamps) return "";
      const w = e.formatTs ?? un;
      let F = "00:00:00";
      for (const J of S.value) {
        if (J.ts == null) continue;
        const oe = w(J.ts);
        oe.length > F.length && (F = oe);
      }
      return F;
    }), b = z(0), v = z([]);
    function m() {
      if (!j) return;
      const w = j.getContext("2d");
      if (!w) return;
      w.font = Vt;
      const F = e.showTimestamps ? Qn(w, p.value) : 0;
      b.value = F;
      const J = Math.max(
        1,
        f.value - wt * 2 - F
      );
      v.value = el({
        entries: S.value,
        ctx: w,
        textMaxWidth: J,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const D = ne(() => tl(v.value.length)), L = ne(() => Math.max(0, D.value - d.value)), K = ne(() => {
      let w = 0;
      for (const F of v.value) F.widthPx > w && (w = F.widthPx);
      return wt * 2 + b.value + w;
    }), g = ne(() => Math.max(0, K.value - f.value)), k = z(0);
    N(L, () => {
      u.value ? c.value = L.value : c.value = Math.min(c.value, L.value);
    }), N(g, () => {
      k.value = Math.min(k.value, g.value);
    }), N(
      [S, f, () => e.showTimestamps, () => e.wordWrap, p],
      () => {
        m(), ze(B);
      },
      { deep: !1 }
    );
    let R = null, P = !1, A, Q, G, U, j;
    const _ = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Wt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Yt}

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

    ${zt}

    gl_FragColor = color;
  }
`;
    function V() {
      if (!(!a.value || !l.value)) {
        j = document.createElement("canvas");
        try {
          R = new X.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          P = !0;
        }
        if (!P && !R.getContext() && (R.dispose(), R = null, P = !0), P) {
          W();
          return;
        }
        R.setPixelRatio(1), R.setClearColor(0, 0), A = new X.Scene(), Q = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), U = new X.CanvasTexture(j), U.minFilter = X.LinearFilter, U.magFilter = X.LinearFilter, G = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: U },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Pt()
          },
          vertexShader: nl,
          fragmentShader: _,
          transparent: !0
        }), A.add(new X.Mesh(new X.PlaneGeometry(2, 2), G)), W();
      }
    }
    function W() {
      if (!l.value || !R && !P) return;
      const w = l.value.clientWidth, F = l.value.clientHeight;
      if (!w || !F) return;
      const J = j.width !== w || j.height !== F;
      J && (j.width = w, j.height = F, f.value = w, d.value = F, m(), R ? (J && U && (U.dispose(), U = new X.CanvasTexture(j), U.minFilter = X.LinearFilter, U.magFilter = X.LinearFilter, G && (G.uniforms.uTex.value = U)), R.setPixelRatio(window.devicePixelRatio || 1), R.setSize(w, F)) : a.value && (a.value.width = w, a.value.height = F, a.value.style.width = w + "px", a.value.style.height = F + "px"), u.value && (c.value = Math.max(0, D.value - d.value)), B());
    }
    function B() {
      if (!(j != null && j.width)) return;
      if (P) {
        if (!a.value) return;
        tn(j, {
          visualLines: v.value,
          scrollY: c.value,
          scrollX: k.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: b.value,
          hoveredLine: r.value,
          selectionStart: Math.min(h.value, y.value),
          selectionEnd: Math.max(h.value, y.value)
        });
        const F = a.value.getContext("2d");
        F && F.drawImage(j, 0, 0);
        return;
      }
      if (!R || !G || !U) return;
      const w = e.theme === "paper";
      G.uniforms.uStrength.value = e.curvature / 45 * 0.55, G.uniforms.uScanlines.value = e.scanlines && !w ? 1 : 0, G.uniforms.uVignette.value = w ? 0 : 1, Ht(G, e.magnify, i, j.width, j.height), tn(j, {
        visualLines: v.value,
        scrollY: c.value,
        scrollX: k.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: b.value,
        hoveredLine: r.value,
        selectionStart: Math.min(h.value, y.value),
        selectionEnd: Math.max(h.value, y.value)
      }), U.needsUpdate = !0, R.render(A, Q);
    }
    N(() => e.theme, () => B()), N(() => e.curvature, () => B()), N(() => e.scanlines, () => B()), N(() => e.glow, () => B()), N(() => e.magnify, (w) => {
      w || (i.x = Me.x, i.y = Me.y), B();
    }), N(c, () => B()), N(k, () => B()), N(r, () => B()), N([h, y], () => B());
    function O(w) {
      if (!a.value) return [-1, -1];
      const F = a.value.getBoundingClientRect();
      return [w.clientX - F.left, w.clientY - F.top];
    }
    function $(w) {
      c.value = Math.max(0, Math.min(L.value, w)), u.value = c.value >= L.value - 4;
    }
    function M(w) {
      k.value = Math.max(0, Math.min(g.value, w));
    }
    function q(w) {
      w.shiftKey ? M(k.value + w.deltaY) : Math.abs(w.deltaX) > Math.abs(w.deltaY) ? M(k.value + w.deltaX) : $(c.value + w.deltaY);
    }
    let te = !1, se = 0, ie = 0, fe = 0, ae = 0, ce = !1;
    function ke(w) {
      te = !0, ce = !1, se = w.clientX, ie = w.clientY, fe = k.value, ae = c.value, l.value && l.value.focus();
    }
    function be(w) {
      if (te) {
        const F = se - w.clientX, J = ie - w.clientY;
        (Math.abs(F) > 4 || Math.abs(J) > 4) && (ce = !0), M(fe + F), $(ae + J);
      }
    }
    function De() {
      te && (te = !1, ce && (ce = !1));
    }
    function C(w) {
      if (w.touches.length !== 1) return;
      const F = w.touches[0];
      te = !0, ce = !1, se = F.clientX, ie = F.clientY, fe = k.value, ae = c.value, l.value && l.value.focus();
    }
    function H(w) {
      if (!te || w.touches.length !== 1) return;
      w.preventDefault();
      const F = w.touches[0], J = se - F.clientX, oe = ie - F.clientY;
      (Math.abs(J) > 4 || Math.abs(oe) > 4) && (ce = !0), M(fe + J), $(ae + oe);
    }
    function le() {
      te && (te = !1, ce && (ce = !1));
    }
    function ve(w) {
      const [, F] = O(w);
      return F < 0 ? -1 : nn(F, c.value, v.value.length);
    }
    function Se(w) {
      if (ce) {
        ce = !1;
        return;
      }
      const F = ve(w);
      if (F < 0) {
        h.value = -1, y.value = -1;
        return;
      }
      w.shiftKey && h.value >= 0 || (h.value = F), y.value = F;
    }
    function Pe(w, F) {
      const J = v.value.length;
      if (J === 0) return;
      const oe = y.value < 0 ? 0 : y.value;
      let Ee = Math.max(0, Math.min(J - 1, oe + w));
      y.value = Ee, (!F || h.value < 0) && (h.value = Ee), r.value = Ee;
      const Le = qe + Ee * ye, _e = Le + ye;
      Le < c.value ? $(Le) : _e > c.value + d.value && $(_e - d.value);
    }
    function nt() {
      const w = Math.min(h.value, y.value), F = Math.max(h.value, y.value);
      if (w < 0) return "";
      const J = v.value, oe = /* @__PURE__ */ new Set(), Ee = [];
      for (let Le = w; Le <= F && Le < J.length; Le++) {
        const _e = J[Le];
        if (oe.has(_e.entryIdx)) continue;
        oe.add(_e.entryIdx);
        let ot = "";
        for (let Ge = 0; Ge < J.length; Ge++)
          J[Ge].entryIdx === _e.entryIdx && (ot += (ot && !J[Ge].isFirstFrag ? " " : "") + J[Ge].text);
        Ee.push(_e.timestamp ? `${_e.timestamp}  ${ot}` : ot);
      }
      return Ee.join(`
`);
    }
    async function ut() {
      const w = nt();
      if (w)
        try {
          await navigator.clipboard.writeText(w);
        } catch {
          const F = document.createElement("textarea");
          F.value = w, F.style.position = "fixed", F.style.opacity = "0", document.body.appendChild(F), F.select();
          try {
            document.execCommand("copy");
          } catch {
          }
          document.body.removeChild(F);
        }
    }
    function lt(w) {
      if ((w.metaKey || w.ctrlKey) && (w.key === "c" || w.key === "C")) {
        h.value >= 0 && (w.preventDefault(), ut());
        return;
      }
      if ((w.metaKey || w.ctrlKey) && (w.key === "a" || w.key === "A")) {
        w.preventDefault(), h.value = 0, y.value = v.value.length - 1;
        return;
      }
      switch (w.key) {
        case "ArrowDown":
          w.preventDefault(), Pe(1, w.shiftKey);
          break;
        case "ArrowUp":
          w.preventDefault(), Pe(-1, w.shiftKey);
          break;
        case "ArrowRight":
          w.preventDefault(), M(k.value + ye * 2);
          break;
        case "ArrowLeft":
          w.preventDefault(), M(k.value - ye * 2);
          break;
        case "PageDown":
          w.preventDefault(), $(c.value + d.value);
          break;
        case "PageUp":
          w.preventDefault(), $(c.value - d.value);
          break;
        case "Home":
          w.preventDefault(), $(0), M(0);
          break;
        case "End":
          w.preventDefault(), $(L.value);
          break;
        case "Escape":
          h.value = -1, y.value = -1;
          break;
      }
    }
    function Xe(w) {
      if (e.magnify && a.value) {
        const J = $t(w, a.value);
        i.x = J.x, i.y = J.y, B();
      }
      const [, F] = O(w);
      if (F < 0) {
        r.value = -1;
        return;
      }
      r.value = nn(F, c.value, v.value.length);
    }
    function Ie() {
      r.value = -1, i.x = Me.x, i.y = Me.y, B();
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, c.value = L.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(w) {
        $(qe + w * ye);
      }
    });
    let ee = null, He = null, ue = 0;
    const $e = Tt("cathodeResetTick", z(0));
    N($e, () => Ae());
    function Ae() {
      cancelAnimationFrame(ue), ue = requestAnimationFrame(W);
    }
    function ft(w) {
      w.preventDefault();
    }
    function Ce() {
      R == null || R.dispose(), R = null, P = !1, V();
    }
    Oe(() => {
      document.addEventListener("mousemove", be), document.addEventListener("mouseup", De), ze(() => {
        var w;
        V(), a.value && (a.value.addEventListener("webglcontextlost", ft), a.value.addEventListener("webglcontextrestored", Ce)), l.value && (ee = new ResizeObserver(() => W()), ee.observe(l.value), He = new IntersectionObserver((F) => {
          F.some((J) => J.isIntersecting) && Ae();
        }), He.observe(l.value)), window.addEventListener("resize", Ae), (w = window.visualViewport) == null || w.addEventListener("resize", Ae), c.value = L.value;
      });
    }), Qe(() => {
      var w, F, J;
      document.removeEventListener("mousemove", be), document.removeEventListener("mouseup", De), (w = a.value) == null || w.removeEventListener("webglcontextlost", ft), (F = a.value) == null || F.removeEventListener("webglcontextrestored", Ce), ee == null || ee.disconnect(), He == null || He.disconnect(), window.removeEventListener("resize", Ae), (J = window.visualViewport) == null || J.removeEventListener("resize", Ae), cancelAnimationFrame(ue), R == null || R.dispose();
    });
    const Te = ne(() => xt[e.theme] ?? xt.none), he = ne(() => ({
      background: Te.value.bg
    }));
    return (w, F) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-log-wrap",
      style: Fe(he.value),
      tabindex: "0",
      onKeydown: lt
    }, [
      re("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: Ne(q, ["prevent"]),
        onMousemove: Xe,
        onMouseleave: Ie,
        onMousedown: ke,
        onClick: Se,
        onTouchstartPassive: C,
        onTouchmove: H,
        onTouchend: le,
        onTouchcancel: le
      }, null, 544)
    ], 36));
  }
}), ol = /* @__PURE__ */ et(ll, [["__scopeId", "data-v-96a56f90"]]), al = ["disabled"], il = /* @__PURE__ */ Je({
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
  setup(t, { expose: n, emit: e }) {
    const l = t, a = e, i = z(null), f = z(null), d = z(""), c = z([]), r = z(-1);
    let u = "";
    function h(g) {
      g.trim() && (c.value.length && c.value[c.value.length - 1] === g || (c.value.push(g), c.value.length > l.historyLimit && c.value.splice(0, c.value.length - l.historyLimit)));
    }
    function y(g) {
      if (!l.disabled) {
        if (g.key === "Enter") {
          g.preventDefault();
          const k = d.value;
          k.trim() && h(k), r.value = -1, d.value = "", a("submit", k);
          return;
        }
        if (g.key === "ArrowUp") {
          if (!c.value.length) return;
          g.preventDefault(), r.value === -1 ? (u = d.value, r.value = c.value.length - 1) : r.value > 0 && r.value--, d.value = c.value[r.value];
          return;
        }
        if (g.key === "ArrowDown") {
          if (r.value === -1) return;
          g.preventDefault(), r.value < c.value.length - 1 ? (r.value++, d.value = c.value[r.value]) : (r.value = -1, d.value = u, u = "");
          return;
        }
      }
    }
    const S = z(!0);
    let p = null;
    function b() {
      p || (p = setInterval(() => {
        S.value = !S.value;
      }, 530));
    }
    function v() {
      p && (clearInterval(p), p = null), S.value = !0;
    }
    const m = ne(() => {
      let g;
      return l.disabled ? g = " " : l.busy ? g = "█" : g = S.value ? "█" : " ", { level: "info", text: `${l.prompt}${d.value}${g}` };
    }), D = ne(
      () => [...l.entries, m.value]
    );
    function L() {
      var g;
      l.disabled || (g = f.value) == null || g.focus();
    }
    N(() => l.busy, (g, k) => {
      k && !g && !l.disabled && ze(() => {
        var R;
        return (R = f.value) == null ? void 0 : R.focus();
      });
    });
    function K() {
      var g;
      (g = f.value) == null || g.focus();
    }
    return n({ focus: K }), Oe(() => {
      b(), l.disabled || requestAnimationFrame(() => {
        var g;
        return (g = f.value) == null ? void 0 : g.focus();
      });
    }), Qe(() => {
      v();
    }), (g, k) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: i,
      class: "cathode-terminal-wrap",
      onClick: L
    }, [
      rn(ol, {
        entries: D.value,
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
      sn(re("input", {
        ref_key: "inputEl",
        ref: f,
        "onUpdate:modelValue": k[0] || (k[0] = (R) => d.value = R),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: y
      }, null, 40, al), [
        [In, d.value]
      ])
    ], 512));
  }
}), lo = /* @__PURE__ */ et(il, [["__scopeId", "data-v-a2b39934"]]), bt = {
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
}, rl = 0.18, pt = 8, Xt = 22, sl = 4, Ve = 8, Ze = 56, fn = 42, Ue = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", cl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Dt = 4, ul = 1, fl = 1;
function dl(t, n, e, l = 0, a = !1) {
  const i = a ? fn : Ze, f = Math.max(0, n - Ve - i), d = Math.max(1, Math.floor(f / e)), c = Math.min(d, t);
  return { firstIdx: Math.max(0, t - c - Math.floor(l / e)), count: c, slotW: e };
}
function vl(t, n, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let l = 1 / 0, a = -1 / 0, i = 0;
  const f = Math.min(t.length, n + e);
  for (let c = n; c < f; c++) {
    const r = t[c];
    r && (r.low < l && (l = r.low), r.high > a && (a = r.high), r.volume > i && (i = r.volume));
  }
  if (!isFinite(l) || !isFinite(a) || l === a) {
    const c = isFinite(l) ? l : 0;
    return { min: c - 1, max: c + 1, maxVol: Math.max(1, i) };
  }
  const d = (a - l) * 0.04;
  return { min: l - d, max: a + d, maxVol: Math.max(1, i) };
}
function hl(t, n, e = !1) {
  const l = e ? sl : Xt, a = Math.max(1, t - pt - l - Dt), i = Math.max(0, Math.round(a * n)), f = a - i;
  return {
    priceY0: pt,
    priceY1: pt + f,
    volumeY0: pt + f + Dt,
    volumeY1: pt + f + Dt + i
  };
}
function Ye(t, n, e, l) {
  const a = n.max - n.min;
  return a <= 0 ? (e + l) / 2 : e + (1 - (t - n.min) / a) * (l - e);
}
function Ke(t, n, e) {
  return Ve + (t - n + 0.5) * e;
}
function je(t) {
  const n = Math.abs(t), e = n >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : n >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : n >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : n >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function Nt(t) {
  const n = new Date(t), e = String(n.getMonth() + 1).padStart(2, "0"), l = String(n.getDate()).padStart(2, "0"), a = String(n.getHours()).padStart(2, "0"), i = String(n.getMinutes()).padStart(2, "0");
  return `${e}-${l} ${a}:${i}`;
}
function ml(t, n) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, n), l = Math.pow(10, Math.floor(Math.log10(e))), a = e / l;
  let i;
  return a < 1.5 ? i = 1 : a < 3 ? i = 2 : a < 7 ? i = 5 : i = 10, i * l;
}
function ln(t, n) {
  var S, p, b, v, m;
  const e = t.getContext("2d");
  if (!e) return;
  const l = t.width, a = t.height, i = bt[n.theme] ?? bt.none, f = n.colors ? { ...i, ...n.colors } : i, d = !!n.compact;
  if (e.clearRect(0, 0, l, a), e.fillStyle = f.bg, e.fillRect(0, 0, l, a), !n.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, l, a), e.clip();
  const c = dl(n.candles.length, l, n.slotW, n.scrollX, d), r = vl(n.candles, c.firstIdx, c.count), u = hl(a, n.showVolume ? n.volumeFraction : 0, d), h = Math.max(ul, Math.floor(n.slotW * 0.7)), y = Math.min(n.candles.length, c.firstIdx + c.count);
  for (let D = c.firstIdx; D < y; D++) {
    const L = n.candles[D];
    if (!L) continue;
    const K = Ke(D, c.firstIdx, n.slotW), g = Ye(L.open, r, u.priceY0, u.priceY1), k = Ye(L.close, r, u.priceY0, u.priceY1), R = Ye(L.high, r, u.priceY0, u.priceY1), P = Ye(L.low, r, u.priceY0, u.priceY1), A = L.close >= L.open, Q = A ? f.wickBull : f.wickBear, G = A ? f.candleBull : f.candleBear;
    n.glow && (e.shadowBlur = 10, e.shadowColor = G), e.strokeStyle = Q, e.lineWidth = fl, e.beginPath(), e.moveTo(Math.round(K) + 0.5, R), e.lineTo(Math.round(K) + 0.5, P), e.stroke(), e.fillStyle = G;
    const U = Math.min(g, k), j = Math.max(1, Math.abs(k - g)), _ = Math.round(K - h / 2), V = Math.round(U), W = Math.round(j);
    if (e.fillRect(_, V, h, W), n.glow && (e.shadowBlur = 4, e.fillRect(_, V, h, W)), e.shadowBlur = 0, n.showVolume && r.maxVol > 0) {
      const B = Math.round(L.volume / r.maxVol * (u.volumeY1 - u.volumeY0));
      B > 0 && (e.fillStyle = A ? f.volumeBull : f.volumeBear, e.fillRect(
        Math.round(K - h / 2),
        u.volumeY1 - B,
        h,
        B
      ));
    }
  }
  if ((S = n.overlays) != null && S.length)
    for (const D of n.overlays) gl(e, D, c, r, u, n.slotW);
  (p = n.markers) != null && p.length && Tl(e, f, n.markers, n.candles, c, r, u, n.slotW), Cl(e, f, r, u, l, d), d || (kl(e, f, n.candles, c, n.slotW, a), Ml(e, f, n.candles, l, a)), (b = n.overlays) != null && b.length && wl(e, f, n.overlays, u), n.hover && (Il(e, f, n.candles, c, r, u, n.slotW, n.hover, l), yl(e, f, n.candles, c, n.slotW, n.hover, u, ((v = n.overlays) == null ? void 0 : v.length) ?? 0), (m = n.markers) != null && m.length && bl(e, f, n.markers, n.candles, c, r, u, n.slotW, n.hover, l)), e.restore();
}
function gl(t, n, e, l, a, i) {
  var d;
  const f = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Ve,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), n.kind === "line")
    yt(t, n.data, e.firstIdx, f, i, l, a, n.color, n.lineWidth ?? 1, n.dashed === !0);
  else {
    const c = dn(n.color, n.fillAlpha ?? 0.08);
    pl(t, n.upper, n.lower, e.firstIdx, f, i, l, a, c), yt(t, n.upper, e.firstIdx, f, i, l, a, n.color, 1, !1), yt(t, n.lower, e.firstIdx, f, i, l, a, n.color, 1, !1), (d = n.middle) != null && d.length && yt(t, n.middle, e.firstIdx, f, i, l, a, n.color, 1, n.middleDashed !== !1);
  }
  t.restore();
}
function yt(t, n, e, l, a, i, f, d, c, r) {
  if (!n || !n.length) return;
  t.strokeStyle = d, t.lineWidth = c, t.setLineDash(r ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let h = e; h < l; h++) {
    const y = n[h];
    if (typeof y != "number" || !isFinite(y)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const S = Ke(h, e, a), p = Ye(y, i, f.priceY0, f.priceY1);
    u ? t.lineTo(S, p) : (t.moveTo(S, p), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function pl(t, n, e, l, a, i, f, d, c) {
  if (!(n != null && n.length) || !(e != null && e.length)) return;
  t.fillStyle = c;
  let r = !1, u = -1;
  for (let h = l; h <= a; h++) {
    const y = n[h], S = e[h], p = h < a && typeof y == "number" && typeof S == "number" && isFinite(y) && isFinite(S);
    if (p && !r && (u = h, r = !0), !p && r || h === a && r) {
      const b = p ? h + 1 : h;
      t.beginPath();
      for (let v = u; v < b; v++) {
        const m = Ke(v, l, i), D = Ye(n[v], f, d.priceY0, d.priceY1);
        v === u ? t.moveTo(m, D) : t.lineTo(m, D);
      }
      for (let v = b - 1; v >= u; v--) {
        const m = Ke(v, l, i), D = Ye(e[v], f, d.priceY0, d.priceY1);
        t.lineTo(m, D);
      }
      t.closePath(), t.fill(), r = !1;
    }
  }
}
function dn(t, n) {
  const e = Math.max(0, Math.min(1, n));
  if (t.startsWith("#") && t.length === 7) {
    const l = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), i = parseInt(t.slice(5, 7), 16);
    return `rgba(${l},${a},${i},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function wl(t, n, e, l) {
  const a = e.filter((b) => !!b.label);
  if (!a.length) return;
  t.save(), t.font = Ue;
  const i = 8, f = 5, d = 12, c = 6, r = 14;
  let u = 0;
  for (const b of a) {
    const v = t.measureText(b.label).width;
    v > u && (u = v);
  }
  const h = i * 2 + d + c + u, y = f * 2 + r * a.length, S = Ve + 4, p = l.priceY0 + 4;
  t.fillStyle = n.panelBg, t.fillRect(S, p, h, y), t.textBaseline = "middle", t.textAlign = "left";
  for (let b = 0; b < a.length; b++) {
    const v = a[b], m = p + f + r * (b + 0.5), D = S + i;
    v.kind === "line" ? (t.strokeStyle = v.color, t.lineWidth = v.lineWidth ?? 1, t.setLineDash(v.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(D, m), t.lineTo(D + d, m), t.stroke(), t.setLineDash([])) : (t.fillStyle = dn(v.color, v.fillAlpha ?? 0.2), t.fillRect(D, m - 4, d, 8), t.strokeStyle = v.color, t.lineWidth = 1, t.strokeRect(D + 0.5, m - 4 + 0.5, d - 1, 7)), t.fillStyle = n.text, t.fillText(v.label, D + d + c, m);
  }
  t.restore();
}
function yl(t, n, e, l, a, i, f, d) {
  const c = Math.floor((i.x - Ve) / a), r = l.firstIdx + c;
  if (r < 0 || r >= e.length) return;
  const u = e[r];
  if (!u) return;
  const h = u.close - u.open, y = u.open !== 0 ? h / u.open * 100 : 0, S = h >= 0 ? "+" : "", p = [
    ["O", je(u.open), void 0],
    ["H", je(u.high), void 0],
    ["L", je(u.low), void 0],
    ["C", je(u.close), void 0],
    ["V", xl(u.volume), void 0],
    ["", `${S}${y.toFixed(2)}%`, h >= 0 ? n.candleBull : n.candleBear]
  ];
  t.save(), t.font = Ue, t.textBaseline = "middle", t.textAlign = "left";
  const b = 8, v = 4, m = 14;
  let D = b;
  for (const [k, R] of p) {
    const P = k ? `${k} ${R}` : R, A = t.measureText(P).width + 12;
    D += A;
  }
  D += b - 12;
  const L = f.priceY0 + 4 + (d > 0 ? v * 2 + 14 * d + 4 : 0), K = Ve + 4;
  t.fillStyle = n.panelBg, t.fillRect(K, L, D, m + v * 2);
  let g = K + b;
  for (let k = 0; k < p.length; k++) {
    const [R, P, A] = p[k];
    t.fillStyle = n.text, R && (t.globalAlpha = 0.6, t.fillText(R + " ", g, L + v + m / 2), t.globalAlpha = 1, g += t.measureText(R + " ").width), A && (t.fillStyle = A), t.fillText(P, g, L + v + m / 2), g += t.measureText(P).width + 12;
  }
  t.restore();
}
function xl(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function bl(t, n, e, l, a, i, f, d, c, r) {
  if (!l.length) return;
  const u = l.length > 1 ? l[1].start - l[0].start : 6e4, h = Math.max(1, u * 0.5), y = Math.min(l.length, a.firstIdx + a.count), S = 9;
  let p = null;
  for (const P of e) {
    let A = 0, Q = l.length - 1, G = -1;
    for (; A <= Q; ) {
      const _ = A + Q >> 1, V = l[_].start - P.timestamp;
      if (Math.abs(V) <= h) {
        G = _;
        break;
      }
      V < 0 ? A = _ + 1 : Q = _ - 1;
    }
    if (G < 0 || G < a.firstIdx || G >= y) continue;
    const U = Ke(G, a.firstIdx, d), j = Ye(P.price, i, f.priceY0, f.priceY1);
    if (Math.abs(c.x - U) <= S && Math.abs(c.y - j) <= S) {
      p = { m: P, x: U, y: j };
      break;
    }
  }
  if (!p) return;
  const b = Nt(p.m.timestamp), v = [
    `${p.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${b}`,
    `@ ${je(p.m.price)}`
  ];
  p.m.label && v.push(p.m.label), t.save(), t.font = Ue, t.textBaseline = "top", t.textAlign = "left";
  const m = 6, D = 14;
  let L = 0;
  for (const P of v) {
    const A = t.measureText(P).width;
    A > L && (L = A);
  }
  const K = L + m * 2, g = v.length * D + m * 2;
  let k = p.x + 12;
  k + K > r - Ze && (k = p.x - 12 - K);
  let R = p.y - g / 2;
  R < f.priceY0 && (R = f.priceY0), R + g > f.priceY1 && (R = f.priceY1 - g), t.fillStyle = n.panelBgSolid, t.strokeStyle = p.m.kind === "entry" ? n.markerEntry : n.markerExit, t.lineWidth = 1, t.fillRect(k, R, K, g), t.strokeRect(k + 0.5, R + 0.5, K - 1, g - 1);
  for (let P = 0; P < v.length; P++) {
    const A = v[P];
    t.fillStyle = P === 0 ? p.m.kind === "entry" ? n.markerEntry : n.markerExit : n.text, t.fillText(A, k + m, R + m + P * D);
  }
  t.restore();
}
function Ml(t, n, e, l, a) {
  if (e.length < 2) return;
  const i = e[1].start - e[0].start, f = Sl(i);
  if (!f) return;
  t.save(), t.font = Ue, t.textBaseline = "top", t.textAlign = "right";
  const d = 6, c = 3, r = t.measureText(f).width, u = l - Ze - d, h = a - Xt + 4;
  t.fillStyle = n.accent, t.fillRect(u - r - d, h - c, r + d * 2, 14 + c * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(f, u, h), t.restore();
}
function Sl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const n = 1e3, e = 60 * n, l = 60 * e, a = 24 * l, i = 7 * a;
  return t >= i && t % i === 0 ? t / i + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= l && t % l === 0 ? t / l + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= n && t % n === 0 ? t / n + "s" : Math.round(t / e) + "m";
}
function Tl(t, n, e, l, a, i, f, d) {
  if (!l.length) return;
  const c = l.length > 1 ? l[1].start - l[0].start : 6e4, r = Math.max(1, c * 0.5), u = Math.min(l.length, a.firstIdx + a.count), h = (S) => {
    let p = 0, b = l.length - 1;
    for (; p <= b; ) {
      const v = p + b >> 1, m = l[v].start - S;
      if (Math.abs(m) <= r) return v;
      m < 0 ? p = v + 1 : b = v - 1;
    }
    return -1;
  }, y = 7;
  for (const S of e) {
    const p = h(S.timestamp);
    if (p < 0 || p < a.firstIdx || p >= u) continue;
    const b = Ke(p, a.firstIdx, d), v = Ye(S.price, i, f.priceY0, f.priceY1);
    if (v < f.priceY0 || v > f.priceY1) continue;
    const m = S.color ?? (S.kind === "entry" ? n.markerEntry : n.markerExit);
    t.fillStyle = m, t.strokeStyle = n.panelBgSolid, t.lineWidth = 1, t.beginPath(), S.kind === "entry" ? (t.moveTo(b, v - y), t.lineTo(b - y, v + y - 1), t.lineTo(b + y, v + y - 1)) : (t.moveTo(b, v + y), t.lineTo(b - y, v - y + 1), t.lineTo(b + y, v - y + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function Cl(t, n, e, l, a, i = !1) {
  const f = e.max - e.min;
  if (f <= 0) return;
  const d = l.priceY1 - l.priceY0, c = i ? Math.max(2, Math.min(4, Math.round(d / 36))) : 6, r = ml(f, c), u = Math.ceil(e.min / r) * r, h = i ? fn : Ze;
  t.font = i ? cl : Ue, t.fillStyle = n.text, t.strokeStyle = n.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let y = u; y <= e.max; y += r) {
    const S = Ye(y, e, l.priceY0, l.priceY1);
    S < l.priceY0 || S > l.priceY1 || (t.beginPath(), t.moveTo(Ve, Math.round(S) + 0.5), t.lineTo(a - h, Math.round(S) + 0.5), t.stroke(), t.fillText(je(y), a - h + 3, S));
  }
  t.globalAlpha = 1;
}
function kl(t, n, e, l, a, i) {
  if (l.count <= 0 || !e.length) return;
  const d = Math.max(1, Math.floor(l.count / 6));
  t.font = Ue, t.fillStyle = n.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const c = Math.min(e.length, l.firstIdx + l.count);
  for (let r = l.firstIdx; r < c; r += d) {
    const u = e[r];
    if (!u) continue;
    const h = Ke(r, l.firstIdx, a);
    t.fillText(Nt(u.start), h, i - Xt + 4);
  }
  t.globalAlpha = 1;
}
function Il(t, n, e, l, a, i, f, d, c) {
  const r = Math.floor((d.x - Ve) / f), u = Math.max(0, Math.min(e.length - 1, l.firstIdx + r)), h = e[u];
  if (!h) return;
  const y = Ke(u, l.firstIdx, f);
  t.save(), t.strokeStyle = n.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(y) + 0.5, i.priceY0), t.lineTo(Math.round(y) + 0.5, i.volumeY1 || i.priceY1), t.stroke();
  const S = Math.max(i.priceY0, Math.min(i.priceY1, d.y));
  t.beginPath(), t.moveTo(Ve, Math.round(S) + 0.5), t.lineTo(c - Ze, Math.round(S) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const p = a.max - a.min;
  if (p > 0) {
    const m = a.max - (S - i.priceY0) / (i.priceY1 - i.priceY0) * p, D = je(m);
    t.font = Ue, t.textBaseline = "middle", t.textAlign = "left";
    const L = t.measureText(D).width, K = 4, g = 2;
    t.fillStyle = n.accent, t.fillRect(c - Ze + 2, S - 7 - g, L + K * 2, 14 + g * 2), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(D, c - Ze + 2 + K, S);
  }
  t.font = Ue, t.textBaseline = "top", t.textAlign = "center";
  const b = Nt(h.start), v = t.measureText(b).width;
  t.fillStyle = n.accent, t.fillRect(y - v / 2 - 4, i.volumeY1 + 2, v + 8, 14), t.fillStyle = n.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : n.bg, t.fillText(b, y, i.volumeY1 + 4), t.restore();
}
const Et = 0.25, Ft = 6, Ll = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Rl = /* @__PURE__ */ Je({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: rl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {},
    magnify: { type: Boolean, default: !1 }
  },
  setup(t) {
    const n = t, e = z(null), l = z(null), a = { ...Me }, i = z(0), f = z(0), d = z(0), c = z(1), r = z(null), u = ne(() => Math.max(1, n.slotW * c.value));
    let h = null, y = !1, S, p, b, v, m;
    const D = `
  uniform sampler2D uTex;
  uniform float     uStrength;
  uniform float     uScanlines;
  uniform float     uVignette;
  ${Wt}

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    vec2  d    = cc * (1.0 + dist) * dist;
    return uv + d;
  }

  ${Yt}

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

    ${zt}

    gl_FragColor = color;
  }
`;
    function L() {
      if (!(!l.value || !e.value)) {
        if (m = document.createElement("canvas"), n.flat) {
          y = !0, K();
          return;
        }
        try {
          h = new X.WebGLRenderer({ canvas: l.value, antialias: !1, alpha: !0 });
        } catch {
          y = !0;
        }
        if (!y && !h.getContext() && (h.dispose(), h = null, y = !0), y) {
          K();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), S = new X.Scene(), p = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), v = new X.CanvasTexture(m), v.minFilter = X.LinearFilter, v.magFilter = X.LinearFilter, b = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: v },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            ...Pt()
          },
          vertexShader: Ll,
          fragmentShader: D,
          transparent: !0
        }), S.add(new X.Mesh(new X.PlaneGeometry(2, 2), b)), K();
      }
    }
    function K() {
      if (!e.value || !h && !y) return;
      const C = e.value.clientWidth, H = e.value.clientHeight;
      !C || !H || !(m.width !== C || m.height !== H) || (m.width = C, m.height = H, i.value = C, f.value = H, h ? (v && (v.dispose(), v = new X.CanvasTexture(m), v.minFilter = X.LinearFilter, v.magFilter = X.LinearFilter, b && (b.uniforms.uTex.value = v)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(C, H)) : l.value && (l.value.width = C, l.value.height = H, l.value.style.width = C + "px", l.value.style.height = H + "px"), g());
    }
    function g() {
      if (!(m != null && m.width)) return;
      if (y) {
        if (!l.value) return;
        ln(m, {
          candles: n.candles,
          slotW: u.value,
          scrollX: d.value,
          theme: n.theme,
          glow: !1,
          showVolume: n.showVolume,
          volumeFraction: n.volumeFraction,
          hover: r.value,
          overlays: n.overlays,
          markers: n.markers,
          compact: n.compact,
          colors: n.colors
        });
        const H = l.value.getContext("2d");
        H && (H.clearRect(0, 0, l.value.width, l.value.height), H.drawImage(m, 0, 0));
        return;
      }
      if (!h || !b || !v) return;
      const C = n.theme === "paper";
      b.uniforms.uStrength.value = n.curvature / 45 * 0.55, b.uniforms.uScanlines.value = n.scanlines && !C ? 1 : 0, b.uniforms.uVignette.value = C ? 0 : 1, Ht(b, n.magnify, a, m.width, m.height), ln(m, {
        candles: n.candles,
        slotW: u.value,
        scrollX: d.value,
        theme: n.theme,
        glow: n.glow,
        showVolume: n.showVolume,
        volumeFraction: n.volumeFraction,
        hover: r.value,
        overlays: n.overlays,
        markers: n.markers,
        compact: n.compact,
        colors: n.colors
      }), v.needsUpdate = !0, h.render(S, p);
    }
    N(() => n.theme, () => g()), N(() => n.curvature, () => g()), N(() => n.scanlines, () => g()), N(() => n.glow, () => g()), N(() => n.showVolume, () => g()), N(() => n.volumeFraction, () => g()), N(() => n.slotW, () => g()), N(() => n.candles, () => g(), { deep: !1 }), N(() => n.overlays, () => g(), { deep: !1 }), N(() => n.markers, () => g(), { deep: !1 }), N(() => n.compact, () => g()), N(() => n.magnify, (C) => {
      C || (a.x = Me.x, a.y = Me.y), g();
    }), N(() => n.colors, () => g(), { deep: !0 }), N(() => n.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), N(d, () => g()), N(c, () => g()), N(r, () => g()), N(u, () => g());
    let k = null, R = null, P = 0;
    const A = Tt("cathodeResetTick", z(0));
    N(A, () => Q());
    function Q() {
      cancelAnimationFrame(P), P = requestAnimationFrame(K);
    }
    function G(C) {
      C.preventDefault();
    }
    function U() {
      h == null || h.dispose(), h = null, y = !1, L();
    }
    function j(C) {
      if (!l.value) return [-1, -1];
      const H = l.value.getBoundingClientRect();
      return [C.clientX - H.left, C.clientY - H.top];
    }
    function _(C) {
      var Pe;
      const H = u.value;
      if (H <= 0) return 0;
      const le = ((Pe = n.candles) == null ? void 0 : Pe.length) ?? 0, ve = Math.max(1, Math.floor((i.value || 1) / H)), Se = Math.max(0, le - ve);
      return Math.max(0, Math.min(C, Se * H));
    }
    function V(C) {
      var ve;
      if (C.deltaX !== 0 || C.shiftKey && C.deltaY !== 0) {
        const Se = C.deltaX !== 0 ? C.deltaX : C.deltaY;
        d.value = _(d.value + Se);
        return;
      }
      if (C.deltaY === 0) return;
      const [H] = j(C), le = u.value;
      if (H >= 0 && le > 0 && ((ve = n.candles) != null && ve.length)) {
        const Se = Math.max(1, Math.floor((i.value || 1) / le)), nt = Math.max(0, n.candles.length - Se - Math.floor(d.value / le)) + (H - 8) / le, ut = Math.exp(-C.deltaY * 15e-4), lt = Math.max(Et, Math.min(Ft, c.value * ut));
        c.value = lt;
        const Xe = n.slotW * lt, Ie = Math.max(1, Math.floor((i.value || 1) / Xe)), ee = nt - (H - 8) / Xe, He = Math.max(0, n.candles.length - Ie - ee);
        d.value = _(He * Xe);
      } else {
        const Se = Math.exp(-C.deltaY * 15e-4);
        c.value = Math.max(Et, Math.min(Ft, c.value * Se));
      }
    }
    let W = !1, B = 0, O = 0;
    function $(C) {
      C.button === 0 && (W = !0, B = C.clientX, O = d.value, r.value = null, e.value && e.value.focus());
    }
    function M(C) {
      const H = Math.exp(C * 0.18);
      c.value = Math.max(Et, Math.min(Ft, c.value * H)), d.value = _(d.value);
    }
    function q(C) {
      const H = u.value, le = C.shiftKey ? 20 : 3;
      switch (C.key) {
        case "ArrowLeft":
          C.preventDefault(), d.value = _(d.value + H * le);
          break;
        case "ArrowRight":
          C.preventDefault(), d.value = _(d.value - H * le);
          break;
        case "ArrowUp":
          C.preventDefault(), M(1);
          break;
        case "ArrowDown":
          C.preventDefault(), M(-1);
          break;
        case "Home":
          C.preventDefault(), d.value = _(Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          C.preventDefault(), d.value = 0;
          break;
      }
    }
    function te(C) {
      if (W) {
        const H = C.clientX - B;
        d.value = _(O + H);
        return;
      }
    }
    function se() {
      W = !1;
    }
    function ie(C) {
      if (C.touches.length !== 1) return;
      const H = C.touches[0];
      W = !0, B = H.clientX, O = d.value, r.value = null;
    }
    function fe(C) {
      if (!W || C.touches.length !== 1) return;
      C.preventDefault();
      const le = C.touches[0].clientX - B;
      d.value = _(O + le);
    }
    function ae() {
      W = !1;
    }
    function ce(C) {
      if (n.magnify && l.value) {
        const ve = $t(C, l.value);
        a.x = ve.x, a.y = ve.y, g();
      }
      if (W) return;
      const [H, le] = j(C);
      if (H < 0 || le < 0) {
        r.value = null;
        return;
      }
      r.value = { x: H, y: le };
    }
    function ke() {
      r.value = null, a.x = Me.x, a.y = Me.y, g();
    }
    Oe(() => {
      document.addEventListener("mousemove", te), document.addEventListener("mouseup", se), ze(() => {
        var C;
        L(), l.value && (l.value.addEventListener("webglcontextlost", G), l.value.addEventListener("webglcontextrestored", U)), e.value && (k = new ResizeObserver(() => K()), k.observe(e.value), R = new IntersectionObserver((H) => {
          H.some((le) => le.isIntersecting) && Q();
        }), R.observe(e.value)), window.addEventListener("resize", Q), (C = window.visualViewport) == null || C.addEventListener("resize", Q);
      });
    }), Qe(() => {
      var C, H, le;
      document.removeEventListener("mousemove", te), document.removeEventListener("mouseup", se), (C = l.value) == null || C.removeEventListener("webglcontextlost", G), (H = l.value) == null || H.removeEventListener("webglcontextrestored", U), k == null || k.disconnect(), R == null || R.disconnect(), window.removeEventListener("resize", Q), (le = window.visualViewport) == null || le.removeEventListener("resize", Q), cancelAnimationFrame(P), h == null || h.dispose();
    });
    const be = ne(() => bt[n.theme] ?? bt.none), De = ne(() => ({
      background: be.value.bg
    }));
    return (C, H) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Fe(De.value),
      tabindex: "0",
      onKeydown: q
    }, [
      re("canvas", {
        ref_key: "canvasEl",
        ref: l,
        class: "cathode-candle-canvas",
        onWheel: Ne(V, ["prevent"]),
        onMousedown: $,
        onMousemove: ce,
        onMouseleave: ke,
        onTouchstartPassive: ie,
        onTouchmove: fe,
        onTouchend: ae,
        onTouchcancel: ae
      }, null, 544)
    ], 36));
  }
}), oo = /* @__PURE__ */ et(Rl, [["__scopeId", "data-v-8aefbc85"]]), Ot = z(0), _t = 28, st = 12;
let Bt = 10, Mt = "cathode.layout", St = !1;
const xe = z({});
function Dl(t, n = "cathode.layout") {
  if (!St) {
    St = !0, Mt = n;
    try {
      const e = localStorage.getItem(Mt);
      if (e) {
        xe.value = JSON.parse(e), on();
        return;
      }
    } catch {
    }
    xe.value = { ...t }, on();
  }
}
function on() {
  let t = 10;
  for (const n of Object.values(xe.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > t && (t = n.zIndex);
  Bt = t;
}
function tt() {
  localStorage.setItem(Mt, JSON.stringify(xe.value));
}
function El(t) {
  St = !1, localStorage.removeItem(Mt), xe.value = { ...t }, tt(), St = !0, Ot.value++;
}
function vn(t) {
  Bt++, xe.value[t] && (xe.value[t].zIndex = Bt);
}
function Fl(t, n) {
  xe.value[t].visible = n, tt();
}
function Al(t, n) {
  xe.value[t].minimized = n, n && (xe.value[t].maximized = !1), tt();
}
function _l(t, n) {
  xe.value[t].maximized = n, n && (xe.value[t].minimized = !1, vn(t)), tt();
}
function Bl(t, n, e) {
  xe.value[t].x = Math.round(n), xe.value[t].y = Math.round(e), tt();
}
function Wl(t, n, e) {
  xe.value[t].w = Math.round(n), xe.value[t].h = Math.round(e), tt();
}
function ao(t, n, e) {
  const l = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / l), i = Math.floor((t - st * (l + 1)) / l), f = Math.floor((n - st * (a + 1)) / a), d = {};
  return e.forEach((c, r) => {
    const u = r % l, h = Math.floor(r / l);
    d[c] = {
      x: st + u * (i + st),
      y: st + h * (f + st),
      w: i,
      h: f,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: r + 1
    };
  }), d;
}
function hn() {
  return {
    containers: xe,
    TITLEBAR_H: _t,
    load: Dl,
    save: tt,
    reset: El,
    bringToFront: vn,
    setVisible: Fl,
    setMinimized: Al,
    setMaximized: _l,
    updatePos: Bl,
    updateSize: Wl
  };
}
const Yl = { class: "ws-toolbar" }, zl = {
  key: 0,
  class: "ws-restore-menu"
}, Pl = {
  key: 0,
  class: "ws-restore-empty"
}, Hl = ["onClick"], $l = /* @__PURE__ */ Je({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const n = t, { containers: e, load: l, reset: a, setVisible: i } = hn(), f = z(null);
    Zt("cathodeWorkspace", f), Zt("cathodeResetTick", Ot), Oe(() => {
      if (!f.value) return;
      const { clientWidth: v, clientHeight: m } = f.value, D = n.initialLayout ?? {};
      l(D, n.storageKey ?? "cathode.layout");
      const L = Object.keys(e.value)[0];
      L && d(L);
    });
    function d(v) {
      var D;
      document.querySelectorAll(".cc").forEach((L) => L.classList.remove("cc-focused"));
      const m = (D = f.value) == null ? void 0 : D.querySelector(`#cc-${v}`);
      m && m.classList.add("cc-focused");
    }
    function c() {
      !f.value || !n.initialLayout || a(n.initialLayout);
    }
    function r(v) {
      const m = v.target.closest(".cc");
      m && (document.querySelectorAll(".cc").forEach((D) => D.classList.remove("cc-focused")), m.classList.add("cc-focused"));
    }
    const u = z(!1), h = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function y(v) {
      i(v, !0), u.value = !1;
    }
    function S(v) {
      if (!u.value) return;
      const m = v.target;
      !m.closest(".ws-restore-menu") && !m.closest(".ws-btn-restore") && (u.value = !1);
    }
    function p(v) {
      v.key === "Escape" && (u.value = !1);
    }
    Oe(() => {
      document.addEventListener("click", S), document.addEventListener("keydown", p);
    }), Qe(() => {
      document.removeEventListener("click", S), document.removeEventListener("keydown", p);
    });
    function b(v) {
      var m;
      return ((m = n.containerTitles) == null ? void 0 : m[v]) ?? v;
    }
    return (v, m) => (pe(), we("div", {
      ref_key: "workspaceEl",
      ref: f,
      class: "cathode-workspace",
      onMousedown: r
    }, [
      At(v.$slots, "default", {}, void 0, !0),
      At(v.$slots, "overlay", {}, void 0, !0),
      re("div", Yl, [
        t.initialLayout ? (pe(), we("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
        }, " ↺ Reset Layout ")) : We("", !0),
        m[1] || (m[1] = re("div", { class: "ws-sep" }, null, -1)),
        re("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: m[0] || (m[0] = (D) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      rn(Ln, { name: "menu" }, {
        default: Rn(() => [
          u.value ? (pe(), we("div", zl, [
            m[3] || (m[3] = re("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            h().length ? We("", !0) : (pe(), we("div", Pl, " No closed panels ")),
            (pe(!0), we(Dn, null, En(h(), (D) => (pe(), we("div", {
              key: D,
              class: "ws-restore-item",
              onClick: (L) => y(D)
            }, [
              m[2] || (m[2] = re("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Fn(" " + Be(b(D)), 1)
            ], 8, Hl))), 128))
          ])) : We("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), io = /* @__PURE__ */ et($l, [["__scopeId", "data-v-5838d04b"]]), Vl = ["id"], Xl = { class: "cc-title" }, Nl = {
  key: 0,
  class: "cc-size-badge"
}, Ol = { class: "cc-controls" }, Ul = ["title"], Kl = { class: "cc-body" }, Gl = 200, jl = 80, an = 60, ql = /* @__PURE__ */ Je({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const n = t, { containers: e, bringToFront: l, setVisible: a, setMinimized: i, setMaximized: f, updatePos: d, updateSize: c } = hn(), r = Tt("cathodeWorkspace", z(null)), u = ne(() => e.value[n.id]), h = ne(() => {
      const M = u.value, q = n.curvature ?? 0;
      if (!M) return {};
      const te = { "--curvature": q };
      return M.maximized ? { ...te, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: M.zIndex } : {
        ...te,
        left: M.x + "px",
        top: M.y + "px",
        width: M.w + "px",
        height: M.minimized ? _t + "px" : M.h + "px",
        zIndex: M.zIndex,
        display: M.visible ? "flex" : "none"
      };
    });
    let y = !1, S = 0, p = 0;
    function b(M) {
      var se;
      if (M.target.closest(".cc-btn") || u.value.maximized) return;
      l(n.id), y = !0;
      const q = (se = r.value) == null ? void 0 : se.querySelector(`#cc-${n.id}`);
      if (!q) return;
      const te = q.getBoundingClientRect();
      S = M.clientX - te.left, p = M.clientY - te.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", m), M.preventDefault();
    }
    function v(M) {
      var fe;
      if (!y || !r.value) return;
      const q = r.value.getBoundingClientRect(), te = ((fe = u.value) == null ? void 0 : fe.w) ?? 300;
      let se = M.clientX - q.left - S, ie = M.clientY - q.top - p;
      se = Math.max(an - te, Math.min(q.width - an, se)), ie = Math.max(0, Math.min(q.height - _t, ie)), d(n.id, se, ie);
    }
    function m() {
      y = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", m);
    }
    let D = !1, L = 0, K = 0, g = 0, k = 0;
    const R = z("");
    function P(M) {
      u.value.maximized || (l(n.id), D = !0, L = M.clientX, K = M.clientY, g = u.value.w, k = u.value.h, document.addEventListener("mousemove", A), document.addEventListener("mouseup", Q), M.preventDefault(), M.stopPropagation());
    }
    function A(M) {
      if (!D) return;
      const q = Math.max(Gl, g + (M.clientX - L)), te = Math.max(jl, k + (M.clientY - K));
      c(n.id, q, te), R.value = `${Math.round(q)}×${Math.round(te)}`;
    }
    function Q() {
      D = !1, R.value = "", document.removeEventListener("mousemove", A), document.removeEventListener("mouseup", Q), G.value++;
    }
    const G = z(0);
    N(Ot, () => {
      G.value++;
    }), Qe(() => {
      var M;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", m), document.removeEventListener("mousemove", A), document.removeEventListener("mouseup", Q), (M = U.value) == null || M.removeEventListener("scroll", _), V();
    });
    const U = z(null);
    function j(M) {
      if (n.canvas) return [];
      const q = M.children[0];
      return q ? Array.from(q.children) : [];
    }
    function _() {
      const M = U.value, q = n.curvature ?? 0;
      if (!M) return;
      const te = j(M);
      if (!te.length) return;
      const se = M.clientHeight, ie = se / 2, fe = q * 38e-4;
      te.forEach((ae) => {
        if (!ae.dataset.origFs) {
          const Se = getComputedStyle(ae);
          ae.dataset.origFs = Se.fontSize, ae.dataset.origLh = Se.lineHeight;
        }
        if (q === 0) {
          ae.style.fontSize = "", ae.style.lineHeight = "";
          return;
        }
        const ce = ae.getBoundingClientRect(), ke = M.getBoundingClientRect(), be = ce.top - ke.top + ce.height / 2, De = Math.min(1, Math.abs(be - ie) / (se / 2)), C = 1 + fe * Math.cos(De * Math.PI / 2), H = parseFloat(ae.dataset.origFs), le = ae.dataset.origLh, ve = le === "normal" ? H * 1.4 : parseFloat(le);
        isNaN(H) || (ae.style.fontSize = `${(H * C).toFixed(2)}px`), isNaN(ve) || (ae.style.lineHeight = `${(ve * C).toFixed(2)}px`);
      });
    }
    function V() {
      const M = U.value;
      M && j(M).forEach((q) => {
        q.style.fontSize = "", q.style.lineHeight = "", delete q.dataset.origFs, delete q.dataset.origLh;
      });
    }
    N(() => n.curvature, (M) => {
      (M ?? 0) === 0 ? V() : _();
    }), Oe(() => {
      var M;
      (M = U.value) == null || M.addEventListener("scroll", _, { passive: !0 }), ze(_);
    });
    function W() {
      i(n.id, !u.value.minimized), ze(() => {
        G.value++;
      });
    }
    function B() {
      f(n.id, !u.value.maximized), ze(() => {
        G.value++;
      });
    }
    function O() {
      a(n.id, !1);
    }
    function $() {
      l(n.id);
    }
    return (M, q) => u.value && u.value.visible ? (pe(), we("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: An(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Fe(h.value),
      onMousedown: $
    }, [
      re("div", {
        class: "cc-titlebar",
        onMousedown: b
      }, [
        q[0] || (q[0] = re("span", { class: "cc-status-dot" }, null, -1)),
        re("span", Xl, Be(t.title), 1),
        R.value ? (pe(), we("span", Nl, Be(R.value), 1)) : We("", !0),
        re("div", Ol, [
          re("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Ne(W, ["stop"])
          }, "─"),
          re("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: Ne(B, ["stop"])
          }, Be(u.value.maximized ? "⤡" : "⤢"), 9, Ul),
          re("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Ne(O, ["stop"])
          }, "✕")
        ])
      ], 32),
      sn(re("div", Kl, [
        re("div", {
          ref_key: "bodyEl",
          ref: U,
          class: "cc-screen",
          onScroll: _
        }, [
          At(M.$slots, "default", { resizeKey: G.value }, void 0, !0),
          q[1] || (q[1] = re("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [_n, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (pe(), we("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Ne(P, ["stop"])
      }, null, 32)) : We("", !0)
    ], 46, Vl)) : We("", !0);
  }
}), ro = /* @__PURE__ */ et(ql, [["__scopeId", "data-v-d8a49f79"]]), Zl = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Jl = `
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
`, Ql = 100, eo = /* @__PURE__ */ Je({
  __name: "CathodeLoader",
  props: {
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    label: { default: "BOOTING" }
  },
  setup(t) {
    const n = t, e = {
      none: { bg: "rgba(0,0,0,0)", text: "#33ff77", cursor: "#33ff77" },
      phosphor: { bg: "#060d06", text: "#33ff33", cursor: "#80ff80" },
      amber: { bg: "#0a0700", text: "#ffb000", cursor: "#ffd060" },
      paper: { bg: "rgba(0,0,0,0)", text: "#222222", cursor: "#158cba" }
    }, l = z(null), a = z(null);
    let i = null, f = !1, d, c, r, u, h, y = null, S = 0;
    function p(g) {
      g - S >= Ql && (m(), S = g), y = requestAnimationFrame(p);
    }
    function b() {
      if (!l.value || !h) return;
      const g = l.value.clientWidth, k = l.value.clientHeight;
      g <= 0 || k <= 0 || h.width === g && h.height === k || (h.width = g, h.height = k, i && i.setSize(g, k, !1), a.value && (a.value.width = g, a.value.height = k, a.value.style.width = g + "px", a.value.style.height = k + "px"));
    }
    function v() {
      if (!(h != null && h.width)) return;
      const g = h.getContext("2d");
      if (!g) return;
      const k = h.width, R = h.height, P = e[n.theme] ?? e.none;
      g.clearRect(0, 0, k, R), g.fillStyle = P.bg, g.fillRect(0, 0, k, R);
      const A = Date.now(), Q = (A / 500 | 0) % 2 === 0, G = (A / 400 | 0) % 4;
      g.font = `bold ${Math.max(14, Math.min(k, R) * 0.06)}px monospace`, g.textAlign = "center", g.textBaseline = "middle", g.fillStyle = P.text, n.glow && (g.shadowColor = P.text, g.shadowBlur = 14);
      const U = ".".repeat(G).padEnd(3, " "), j = `${n.label}${U}`;
      if (g.fillText(j, k / 2, R / 2), g.shadowBlur = 0, Q) {
        const _ = g.measureText(j), V = g.measureText("M").width, W = parseFloat(g.font), B = k / 2 + _.width / 2 + 4, O = R / 2 - W / 2 + 2;
        g.fillStyle = P.cursor, n.glow && (g.shadowColor = P.cursor, g.shadowBlur = 12), g.fillRect(B, O, V * 0.7, W * 0.95), g.shadowBlur = 0;
      }
    }
    function m() {
      if (!h) return;
      if (v(), f) {
        if (!a.value) return;
        const k = a.value.getContext("2d");
        k && k.drawImage(h, 0, 0);
        return;
      }
      if (!i || !r || !u) return;
      const g = n.theme === "paper";
      r.uniforms.uStrength.value = n.curvature / 45 * 0.55, r.uniforms.uScanlines.value = n.scanlines && !g ? 1 : 0, r.uniforms.uVignette.value = g ? 0 : 1, u.needsUpdate = !0, i.render(d, c);
    }
    function D() {
      if (!(!a.value || !l.value)) {
        h = document.createElement("canvas");
        try {
          i = new X.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          f = !0;
        }
        if (!f && !i.getContext() && (i.dispose(), i = null, f = !0), f) {
          b();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), d = new X.Scene(), c = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), u = new X.CanvasTexture(h), u.minFilter = X.LinearFilter, u.magFilter = X.LinearFilter, r = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: u },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Zl,
          fragmentShader: Jl,
          transparent: !0
        }), d.add(new X.Mesh(new X.PlaneGeometry(2, 2), r)), b();
      }
    }
    let L = null;
    Oe(() => {
      D(), m(), y = requestAnimationFrame(p), l.value && (L = new ResizeObserver(() => b()), L.observe(l.value));
    }), Qe(() => {
      y !== null && cancelAnimationFrame(y), L == null || L.disconnect(), i && i.dispose(), u == null || u.dispose(), r == null || r.dispose();
    }), N(() => [n.theme, n.curvature, n.scanlines, n.glow, n.label], () => m());
    const K = ne(() => ({
      background: (e[n.theme] ?? e.none).bg
    }));
    return (g, k) => (pe(), we("div", {
      ref_key: "wrapEl",
      ref: l,
      class: "cathode-loader-wrap",
      style: Fe(K.value)
    }, [
      re("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-loader-canvas"
      }, null, 512)
    ], 4));
  }
}), so = /* @__PURE__ */ et(eo, [["__scopeId", "data-v-2be1f107"]]);
export {
  bt as CANDLE_THEME_COLORS,
  oo as CathodeCandle,
  ro as CathodeContainer,
  no as CathodeGrid,
  so as CathodeLoader,
  ol as CathodeLog,
  lo as CathodeTerminal,
  io as CathodeWorkspace,
  xt as LOG_THEME_COLORS,
  ao as buildDefaultLayout,
  hn as useCathodeLayout
};
