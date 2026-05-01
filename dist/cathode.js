import { defineComponent as Ge, ref as B, reactive as vt, computed as ee, watch as V, inject as st, nextTick as ke, onMounted as ze, onUnmounted as Ue, openBlock as ue, createElementBlock as fe, normalizeStyle as Se, createElementVNode as ne, withModifiers as De, withKeys as ul, createCommentVNode as Te, toDisplayString as Ce, createVNode as Ot, withDirectives as Vt, vModelText as fl, provide as Et, renderSlot as gt, Transition as dl, withCtx as vl, Fragment as hl, renderList as ml, createTextVNode as gl, normalizeClass as pl, vShow as wl } from "vue";
import * as X from "three";
const Xe = {
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
}, re = 30, Dt = 12, bl = 10;
function Ft(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, u = Xe[l.theme] ?? Xe.none, { cols: c, rows: d, pinnedRows: f, rowHeight: s, scrollY: i, scrollX: w, glow: b } = l;
  e.clearRect(0, 0, n, a), e.fillStyle = u.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const x = f.length * s, g = a - re - x;
  e.fillStyle = u.headerBg, e.fillRect(0, 0, n, re), e.textBaseline = "middle", e.textAlign = "left";
  let m = -w;
  for (let j = 0; j < c.length; j++) {
    const Y = c[j];
    if (m + Y.width <= 0) {
      m += Y.width;
      continue;
    }
    if (m >= n) break;
    const W = !!l.colFilters[Y.colId], Q = l.sortColId === Y.colId, H = (Y.colDef.headerName ?? Y.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(m, 0, Y.width, re), e.clip(), e.font = `bold ${bl}px system-ui, -apple-system, sans-serif`, e.fillStyle = W ? u.accent : u.textHeader, b ? (e.shadowColor = u.textHeader, e.shadowBlur = 10, e.fillText(H, m + 8, re / 2), e.shadowBlur = 4, e.fillText(H, m + 8, re / 2), e.shadowBlur = 0) : e.fillText(H, m + 8, re / 2), Q) {
      const O = e.measureText(H).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = u.accent, e.fillText(l.sortDir === "asc" ? "▲" : "▼", m + 8 + O + 4, re / 2);
    }
    Y.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = W ? u.accent : u.textHeader, e.globalAlpha = W ? 1 : 0.38, e.fillText("⌕", m + Y.width - 20, re / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = u.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(m + Y.width - 0.5, 0), e.lineTo(m + Y.width - 0.5, re), e.stroke(), m += Y.width;
  }
  e.strokeStyle = u.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, re - 0.5), e.lineTo(n, re - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, re, n, g), e.clip();
  const v = Math.max(0, Math.floor(i / s)), h = Math.min(d.length, Math.ceil((i + g) / s)), y = l.selectionAnchorRow ?? l.selectedRow, M = l.selectionAnchorCol ?? l.selectedCol, K = l.selectedRow >= 0 && y >= 0 ? Math.min(l.selectedRow, y) : -1, S = l.selectedRow >= 0 && y >= 0 ? Math.max(l.selectedRow, y) : -1, D = l.selectedCol >= 0 && M >= 0 ? Math.min(l.selectedCol, M) : -1, L = l.selectedCol >= 0 && M >= 0 ? Math.max(l.selectedCol, M) : -1, R = S > K || L > D;
  let P = Number.POSITIVE_INFINITY, q = Number.NEGATIVE_INFINITY, U = Number.POSITIVE_INFINITY, te = Number.NEGATIVE_INFINITY;
  for (let j = v; j < h; j++) {
    const Y = d[j], W = re + j * s - i;
    j % 2 === 1 && (e.fillStyle = u.rowAlt, e.fillRect(0, W, n, s));
    const Q = j >= K && j <= S;
    j === l.hoveredRow && !Q && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, W, n, s)), Q && !R && (e.fillStyle = Bt(u.accent, 0.1), e.fillRect(0, W, n, s)), e.strokeStyle = u.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, W + s - 0.5), e.lineTo(n, W + s - 0.5), e.stroke();
    let H = -w;
    for (let O = 0; O < c.length; O++) {
      const Z = c[O];
      if (H + Z.width <= 0) {
        H += Z.width;
        continue;
      }
      if (H >= n) break;
      const E = Q && O >= D && O <= L;
      E && R && (e.fillStyle = Bt(u.accent, 0.14), e.fillRect(H, W, Z.width, s)), E && (H < P && (P = H), H + Z.width > q && (q = H + Z.width), W < U && (U = W), W + s > te && (te = W + s));
      const N = l.getCellStyle(Z, Y), J = N.color ?? u.text, le = N.textAlign ?? "left", k = l.formatCell(Z, Y);
      e.save(), e.beginPath(), e.rect(H + 1, W, Z.width - 2, s), e.clip(), e.font = `${Dt}px system-ui, -apple-system, sans-serif`, e.fillStyle = J, e.textBaseline = "middle";
      const A = le === "right" ? H + Z.width - 8 : H + 8;
      e.textAlign = le === "right" ? "right" : "left";
      const z = W + s / 2;
      b ? (e.shadowColor = J, e.shadowBlur = 12, e.fillText(k, A, z), e.shadowBlur = 6, e.fillText(k, A, z), e.shadowBlur = 2, e.fillText(k, A, z), e.shadowBlur = 0) : e.fillText(k, A, z), e.restore(), j === l.selectedRow && O === l.selectedCol && (e.strokeStyle = u.accent, e.lineWidth = 2, e.strokeRect(H + 1.5, W + 1.5, Z.width - 3, s - 3)), e.strokeStyle = u.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(H + Z.width - 0.5, W), e.lineTo(H + Z.width - 0.5, W + s), e.stroke(), H += Z.width;
    }
  }
  if (R && P < q && U < te && (e.strokeStyle = u.accent, e.lineWidth = 2, e.strokeRect(P + 0.5, U + 0.5, q - P - 1, te - U - 1)), e.restore(), f.length > 0) {
    const j = a - x;
    e.strokeStyle = u.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, j - 0.5), e.lineTo(n, j - 0.5), e.stroke();
    for (let Y = 0; Y < f.length; Y++) {
      const W = f[Y], Q = j + Y * s;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, Q, n, s);
      let H = -w;
      for (let O = 0; O < c.length; O++) {
        const Z = c[O];
        if (H + Z.width <= 0) {
          H += Z.width;
          continue;
        }
        if (H >= n) break;
        const E = l.getCellStyle(Z, W), N = E.color ?? u.text, J = E.textAlign ?? "left", le = l.formatCell(Z, W);
        e.save(), e.beginPath(), e.rect(H + 1, Q, Z.width - 2, s), e.clip(), e.font = `bold ${Dt}px system-ui, -apple-system, sans-serif`, e.fillStyle = N, e.textBaseline = "middle", J === "right" ? (e.textAlign = "right", e.fillText(le, H + Z.width - 8, Q + s / 2)) : (e.textAlign = "left", e.fillText(le, H + 8, Q + s / 2)), e.restore(), e.strokeStyle = u.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(H + Z.width - 0.5, Q), e.lineTo(H + Z.width - 0.5, Q + s), e.stroke(), H += Z.width;
      }
      e.strokeStyle = u.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, Q + s - 0.5), e.lineTo(n, Q + s - 0.5), e.stroke();
    }
  }
  e.restore();
}
function Bt(t, l) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${l})`);
  const e = parseInt(t.slice(1, 3), 16), n = parseInt(t.slice(3, 5), 16), a = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${n},${a},${l})`;
}
function ht(t, l) {
  let e = 0;
  for (let n = 0; n < t; n++) e += l[n].width;
  return e;
}
function xl(t, l, e) {
  return t >= l + e - 24 && t < l + e;
}
function _t(t, l, e) {
  const n = l + e;
  return t >= n - 6 && t <= n + 1;
}
function At(t, l, e, n, a, u, c, d, f) {
  const s = t + f;
  let i = -1, w = 0;
  for (let m = 0; m < e.length; m++) {
    if (s >= w && s < w + e[m].width) {
      i = m;
      break;
    }
    w += e[m].width;
  }
  if (l < re) return { area: "header", colIdx: i, rowIdx: -1 };
  const b = d * a;
  if (b > 0 && l >= c - b) {
    const m = Math.floor((l - (c - b)) / a);
    return { area: "pinned", colIdx: i, rowIdx: m };
  }
  const x = l - re + u, g = Math.floor(x / a);
  return g >= 0 && g < n ? { area: "body", colIdx: i, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const yl = ["value"], Ml = ["disabled"], Sl = ["disabled"], Cl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Tl = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour

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

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;   // softened falloff — see CathodeLog for rationale
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`, Il = 28, kl = 600, Ll = /* @__PURE__ */ Ge({
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
    glow: { type: Boolean, default: !0 }
  },
  emits: ["grid-ready", "row-clicked", "cell-selected", "column-resized", "sort-changed", "filter-changed"],
  setup(t, { emit: l }) {
    const e = t, n = l, a = B(e.rowData ?? []), u = B(e.pinnedBottomRowData ?? []), c = B(""), d = B(null), f = vt({}), s = vt({}), i = vt(/* @__PURE__ */ new Set()), w = B(0), b = B(0), x = B(0), g = B(0), m = B(0), v = B(-1), h = B(null), y = B(null), M = B(null), K = B({ x: 0, y: re }), S = B("");
    function D(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const L = ee(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((r) => !i.has(D(r))).map((r) => {
        const p = D(r), C = { ...o, ...r };
        return { colId: p, colDef: C, width: s[p] ?? C.width ?? 100 };
      });
    }), R = ee(() => {
      const o = b.value;
      if (!o) return L.value;
      const r = L.value.reduce((T, I) => T + I.width, 0);
      if (!r || r >= o) return L.value;
      const p = o / r;
      let C = 0;
      return L.value.map((T, I) => {
        const G = I === L.value.length - 1 ? o - C : Math.max(8, Math.round(T.width * p));
        return C += G, { ...T, width: G };
      });
    }), P = ee(() => {
      const o = R.value.reduce((r, p) => r + p.width, 0);
      return Math.max(0, o - b.value);
    }), q = ee(() => {
      const o = u.value.length * e.rowHeight;
      return Math.max(0, x.value - re - o);
    }), U = ee(
      () => Math.max(0, O.value.length * e.rowHeight - q.value)
    ), te = ee(
      () => Math.max(1, Math.floor(q.value / e.rowHeight))
    ), j = ee(
      () => O.value.length === 0 ? 0 : Math.min(O.value.length - 1, Math.floor(g.value / e.rowHeight))
    ), Y = ee(
      () => Math.min(O.value.length - 1, j.value + te.value - 1)
    );
    function W(o, r) {
      if (r.colDef.valueGetter) return r.colDef.valueGetter({ data: o, colDef: r.colDef });
      if (r.colDef.field) return o[r.colDef.field];
    }
    function Q(o, r) {
      const p = W(r, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: p, data: r, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: p, data: r, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : p == null ? "" : String(p);
    }
    function H(o, r) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: W(r, o), data: r, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const O = ee(() => {
      w.value;
      let o = a.value;
      const r = c.value.trim().toLowerCase();
      r && (o = o.filter(
        (p) => L.value.some(
          (C) => String(W(p, C) ?? "").toLowerCase().includes(r)
        )
      ));
      for (const [p, C] of Object.entries(f)) {
        if (!C) continue;
        const T = L.value.find((I) => I.colId === p);
        if (T)
          if (C.startsWith("__eq__")) {
            const I = C.slice(6).toLowerCase();
            o = o.filter((_) => String(W(_, T) ?? "").toLowerCase() === I);
          } else {
            const I = C.toLowerCase();
            o = o.filter((_) => String(W(_, T) ?? "").toLowerCase().includes(I));
          }
      }
      if (d.value) {
        const { colId: p, dir: C } = d.value, T = L.value.find((I) => I.colId === p);
        T && (o = [...o].sort((I, _) => {
          const G = W(I, T), se = W(_, T);
          let ce = 0;
          return T.colDef.comparator ? ce = T.colDef.comparator(G, se) : typeof G == "number" && typeof se == "number" ? ce = G - se : ce = String(G ?? "").localeCompare(String(se ?? ""), void 0, { numeric: !0 }), C === "asc" ? ce : -ce;
        }));
      }
      return o;
    });
    V(O, () => {
      g.value = 0, h.value = null;
    }), V(P, () => {
      m.value = Math.min(m.value, P.value);
    }), V(U, () => {
      g.value = Math.min(g.value, U.value);
    });
    function Z(o) {
      const r = o * e.rowHeight, p = r + e.rowHeight;
      r < g.value ? g.value = r : p > g.value + q.value && (g.value = Math.min(U.value, p - q.value));
    }
    function E() {
      g.value = Math.max(0, g.value - q.value), ge();
    }
    function N() {
      g.value = Math.min(U.value, g.value + q.value), ge();
    }
    let J = !1, le = "", k = 0, A = 0, z = !1, ve = !1, he = 0, xe = 0, Ee = 0, F = 0, $ = !1;
    function oe(o, r) {
      var p;
      J = !0, le = o, k = r, A = ((p = R.value.find((C) => C.colId === o)) == null ? void 0 : p.width) ?? 100, z = !1;
    }
    function ye(o) {
      if (ve) {
        const I = he - o.clientX, _ = xe - o.clientY;
        (Math.abs(I) > 4 || Math.abs(_) > 4) && ($ = !0), m.value = Math.max(0, Math.min(P.value, Ee + I)), g.value = Math.max(0, Math.min(U.value, F + _)), ge();
        return;
      }
      if (!J) return;
      const r = b.value, p = Math.max(30, A + (o.clientX - k)), C = L.value.filter((I) => I.colId !== le).reduce((I, _) => I + _.width, 0), T = r - p;
      T > 10 && (s[le] = Math.max(10, Math.round(p * C / T))), ge();
    }
    function _e() {
      ve && ($ && (z = !0), ve = !1), J && (J = !1, z = !0, n("column-resized"));
    }
    const Me = B(null), ae = B(null), jt = st("cathodeResetTick", B(0));
    V(jt, () => $e());
    let ie = null, Ae = !1, ct, St, Le, pe, me;
    function Ct() {
      if (!(!ae.value || !Me.value)) {
        me = document.createElement("canvas");
        try {
          ie = new X.WebGLRenderer({ canvas: ae.value, antialias: !1, alpha: !0 });
        } catch {
          Ae = !0;
        }
        if (!Ae && !ie.getContext() && (ie.dispose(), ie = null, Ae = !0), Ae) {
          He();
          return;
        }
        ie.setPixelRatio(1), ie.setClearColor(0, 0), ct = new X.Scene(), St = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), pe = new X.CanvasTexture(me), pe.minFilter = X.LinearFilter, pe.magFilter = X.LinearFilter, Le = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: pe },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new X.Color(0) }
          },
          vertexShader: Cl,
          fragmentShader: Tl,
          transparent: !0
        }), ct.add(new X.Mesh(new X.PlaneGeometry(2, 2), Le)), He();
      }
    }
    function He() {
      if (!Me.value || !ie && !Ae) return;
      const o = Me.value.clientWidth, r = Me.value.clientHeight - (e.pagination ? Il : 0);
      if (!o || !r) return;
      const p = me.width !== o || me.height !== r;
      me.width = o, me.height = r, b.value = o, x.value = r, m.value = Math.max(0, Math.min(P.value, m.value)), g.value = Math.max(0, Math.min(U.value, g.value)), ie ? (p && pe && (pe.dispose(), pe = new X.CanvasTexture(me), pe.minFilter = X.LinearFilter, pe.magFilter = X.LinearFilter, Le && (Le.uniforms.uTex.value = pe)), ie.setPixelRatio(window.devicePixelRatio || 1), ie.setSize(o, r)) : ae.value && (ae.value.width = o, ae.value.height = r, ae.value.style.width = o + "px", ae.value.style.height = r + "px"), ge();
    }
    function ge() {
      var p, C, T, I, _, G, se, ce, Oe, Je, Qe, Ve;
      if (!(me != null && me.width)) return;
      if (Ae) {
        if (!ae.value) return;
        Ft(me, {
          cols: R.value,
          rows: O.value,
          pinnedRows: u.value,
          rowHeight: e.rowHeight,
          scrollY: g.value,
          scrollX: m.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((p = d.value) == null ? void 0 : p.colId) ?? null,
          sortDir: ((C = d.value) == null ? void 0 : C.dir) ?? null,
          colFilters: f,
          hoveredRow: v.value,
          selectedRow: ((T = h.value) == null ? void 0 : T.row) ?? -1,
          selectedCol: ((I = h.value) == null ? void 0 : I.col) ?? -1,
          selectionAnchorRow: ((_ = y.value) == null ? void 0 : _.row) ?? -1,
          selectionAnchorCol: ((G = y.value) == null ? void 0 : G.col) ?? -1,
          formatCell: Q,
          getCellStyle: H
        });
        const et = ae.value.getContext("2d");
        et && et.drawImage(me, 0, 0);
        return;
      }
      if (!ie || !Le || !pe) return;
      const o = Xe[e.theme] ?? Xe.none, r = e.theme === "paper";
      Le.uniforms.uStrength.value = e.curvature / 45 * 0.55, Le.uniforms.uScanlines.value = e.scanlines && !r ? 1 : 0, Le.uniforms.uVignette.value = r ? 0 : 1, Le.uniforms.uBezel.value.set(o.bg), Ft(me, {
        cols: R.value,
        rows: O.value,
        pinnedRows: u.value,
        rowHeight: e.rowHeight,
        scrollY: g.value,
        scrollX: m.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((se = d.value) == null ? void 0 : se.colId) ?? null,
        sortDir: ((ce = d.value) == null ? void 0 : ce.dir) ?? null,
        colFilters: f,
        hoveredRow: v.value,
        selectedRow: ((Oe = h.value) == null ? void 0 : Oe.row) ?? -1,
        selectedCol: ((Je = h.value) == null ? void 0 : Je.col) ?? -1,
        selectionAnchorRow: ((Qe = y.value) == null ? void 0 : Qe.row) ?? -1,
        selectionAnchorCol: ((Ve = y.value) == null ? void 0 : Ve.col) ?? -1,
        formatCell: Q,
        getCellStyle: H
      }), pe.needsUpdate = !0, ie.render(ct, St);
    }
    function ut(o) {
      if (!ae.value) return [-1, -1];
      const r = ae.value.getBoundingClientRect();
      return [o.clientX - r.left, o.clientY - r.top];
    }
    let ft = 0;
    function qt(o) {
      M.value = null;
      const r = Date.now();
      if (o.deltaX !== 0) {
        ft = r, m.value = Math.max(0, Math.min(P.value, m.value + o.deltaX)), ge();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        ft = r, m.value = Math.max(0, Math.min(P.value, m.value + o.deltaY)), ge();
        return;
      }
      r - ft < kl || (g.value = Math.max(0, Math.min(U.value, g.value + o.deltaY)), ge());
    }
    function Zt(o) {
      if (J) return;
      const [r, p] = ut(o);
      if (r < 0) {
        v.value = -1, ge();
        return;
      }
      const C = At(
        r,
        p,
        R.value,
        O.value.length,
        e.rowHeight,
        g.value,
        me.height,
        u.value.length,
        m.value
      );
      if (v.value = C.area === "body" ? C.rowIdx : -1, C.area === "header" && C.colIdx >= 0) {
        const T = R.value[C.colIdx], I = ht(C.colIdx, R.value), _ = r + m.value;
        ae.value.style.cursor = T && _t(_, I, T.width) ? "col-resize" : "pointer";
      } else C.area === "body" ? ae.value.style.cursor = "pointer" : ae.value.style.cursor = "default";
      ge();
    }
    function Jt() {
      v.value = -1, ge();
    }
    function Qt(o) {
      const [r, p] = ut(o);
      if (r < 0) return;
      if (p >= re) {
        ve = !0, $ = !1, he = o.clientX, xe = o.clientY, Ee = m.value, F = g.value;
        return;
      }
      const C = r + m.value;
      for (let T = 0; T < R.value.length; T++) {
        const I = R.value[T], _ = ht(T, R.value);
        if (I.colDef.resizable !== !1 && _t(C, _, I.width)) {
          oe(I.colId, o.clientX);
          return;
        }
      }
    }
    function el(o) {
      var T, I, _;
      if (z) {
        z = !1;
        return;
      }
      if (J) return;
      const [r, p] = ut(o);
      if (r < 0) {
        M.value = null;
        return;
      }
      const C = At(
        r,
        p,
        R.value,
        O.value.length,
        e.rowHeight,
        g.value,
        me.height,
        u.value.length,
        m.value
      );
      if (C.area === "header" && C.colIdx >= 0) {
        const G = R.value[C.colIdx], se = ht(C.colIdx, R.value), ce = r + m.value;
        G.colDef.filter && xl(ce, se, G.width) ? (o.stopPropagation(), M.value === G.colId ? M.value = null : (M.value = G.colId, S.value = (T = f[G.colId]) != null && T.startsWith("__eq__") ? f[G.colId].slice(6) : f[G.colId] ?? "", K.value = { x: Math.max(0, se - m.value), y: re })) : G.colDef.sortable !== !1 && (M.value = null, d.value = ((I = d.value) == null ? void 0 : I.colId) === G.colId ? d.value.dir === "asc" ? { colId: G.colId, dir: "desc" } : null : { colId: G.colId, dir: "asc" }, n("sort-changed"));
        return;
      }
      if (M.value = null, C.area === "body" && C.rowIdx >= 0 && C.colIdx >= 0) {
        const G = C.rowIdx;
        o.shiftKey && h.value ? (y.value || (y.value = { ...h.value }), h.value = { row: G, col: C.colIdx }) : (h.value = { row: G, col: C.colIdx }, y.value = { row: G, col: C.colIdx }), (_ = ae.value) == null || _.focus();
        const se = O.value[G], ce = R.value[C.colIdx];
        se && ce && (n("row-clicked", { data: se, event: o }), n("cell-selected", { data: se, row: G, col: C.colIdx, colId: ce.colId }));
      }
    }
    function Tt(o) {
      var r, p;
      M.value && ((p = (r = o.target).closest) != null && p.call(r, ".cathode-filter-popup") || (M.value = null));
    }
    function tl(o) {
      var T;
      if (!b.value) return;
      let r = 0;
      for (let I = 0; I < o; I++) r += R.value[I].width;
      const p = ((T = R.value[o]) == null ? void 0 : T.width) ?? 0, C = r - m.value;
      C < 0 ? m.value = Math.max(0, r) : C + p > b.value && (m.value = Math.min(P.value, r + p - b.value));
    }
    function ll(o) {
      const p = R.value.length - 1, C = O.value.length - 1;
      if (!h.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), h.value = { row: j.value, col: 0 }, y.value = { row: j.value, col: 0 });
        return;
      }
      let { row: T, col: I } = h.value;
      const _ = (G, se, ce = !1) => {
        T = Math.max(0, Math.min(C, G)), I = Math.max(0, Math.min(p, se)), h.value = { row: T, col: I }, ce || (y.value = { row: T, col: I }), Z(T), tl(I);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), _(T + 1, I, o.shiftKey);
          break;
        case "ArrowUp":
          o.preventDefault(), _(T - 1, I, o.shiftKey);
          break;
        case "ArrowRight":
          o.preventDefault(), o.shiftKey ? _(T, I + 1, !0) : I < p ? _(T, I + 1) : _(T + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), o.shiftKey ? _(T, I - 1, !0) : I > 0 ? _(T, I - 1) : _(T - 1, p);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? I > 0 ? _(T, I - 1) : _(T - 1, p) : I < p ? _(T, I + 1) : _(T + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? _(T - 1, I) : _(T + 1, I);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? _(0, 0, o.shiftKey) : _(T, 0, o.shiftKey);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? _(C, p, o.shiftKey) : _(T, p, o.shiftKey);
          break;
        case "PageDown":
          o.preventDefault(), _(Math.min(C, T + te.value), I, o.shiftKey);
          break;
        case "PageUp":
          o.preventDefault(), _(Math.max(0, T - te.value), I, o.shiftKey);
          break;
        case "Escape":
          h.value = null, y.value = null;
          break;
        case "c":
        case "C":
          (o.ctrlKey || o.metaKey) && (o.preventDefault(), nl());
          break;
      }
    }
    function nl() {
      var ce;
      if (!h.value) return;
      const o = R.value, r = O.value, p = y.value ?? h.value, C = Math.min(p.row, h.value.row), T = Math.max(p.row, h.value.row), I = Math.min(p.col, h.value.col), _ = Math.max(p.col, h.value.col), G = [];
      for (let Oe = C; Oe <= T; Oe++) {
        const Je = r[Oe];
        if (!Je) continue;
        const Qe = [];
        for (let Ve = I; Ve <= _; Ve++) {
          const et = o[Ve];
          et && Qe.push(Q(et, Je).replace(/[\t\r\n]+/g, " "));
        }
        G.push(Qe.join("	"));
      }
      const se = G.join(`
`);
      (ce = navigator.clipboard) == null || ce.writeText(se).catch(() => {
      });
    }
    function ol(o) {
      const r = o.target.value;
      S.value = r, r ? f[M.value] = r : delete f[M.value], n("filter-changed");
    }
    function It() {
      M.value && delete f[M.value], S.value = "", M.value = null, n("filter-changed");
    }
    const al = {
      setGridOption(o, r) {
        o === "rowData" ? a.value = r : o === "pinnedBottomRowData" ? u.value = r : o === "quickFilterText" && (c.value = r);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var p, C;
          const r = D(o);
          return {
            colId: r,
            hide: i.has(r),
            sort: ((p = d.value) == null ? void 0 : p.colId) === r ? d.value.dir : null,
            sortIndex: ((C = d.value) == null ? void 0 : C.colId) === r ? 0 : null,
            width: s[r] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const r of o)
          r.hide === !0 && i.add(r.colId), r.hide === !1 && i.delete(r.colId), r.sort && (d.value = { colId: r.colId, dir: r.sort }), r.width && (s[r.colId] = r.width);
      },
      setFilterModel(o) {
        for (const r of Object.keys(f)) delete f[r];
        if (o)
          for (const [r, p] of Object.entries(o))
            (p == null ? void 0 : p.type) === "equals" ? f[r] = `__eq__${p.filter}` : p != null && p.filter && (f[r] = p.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [r, p] of Object.entries(f))
          p && (o[r] = p.startsWith("__eq__") ? { type: "equals", filter: p.slice(6) } : { type: "contains", filter: p });
        return o;
      },
      async setColumnFilterModel(o, r) {
        r ? r.type === "equals" ? f[o] = `__eq__${r.filter}` : f[o] = r.filter ?? "" : delete f[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        w.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const r = L.value, p = r.map((_) => _.colDef.headerName ?? _.colId).join(","), C = O.value.map(
          (_) => r.map((G) => `"${String(Q(G, _)).replace(/"/g, '""')}"`).join(",")
        ), T = new Blob([[p, ...C].join(`
`)], { type: "text/csv" }), I = URL.createObjectURL(T);
        Object.assign(document.createElement("a"), { href: I, download: o }).click(), URL.revokeObjectURL(I);
      },
      resize() {
        He();
      },
      resetColumnState() {
        i.clear();
        for (const r of e.columnDefs)
          r.hide && i.add(D(r));
        const o = e.columnDefs.find((r) => r.sort);
        d.value = o ? { colId: D(o), dir: o.sort } : null;
        for (const r of Object.keys(s)) delete s[r];
        for (const r of Object.keys(f)) delete f[r];
        c.value = "", g.value = 0, h.value = null, M.value = null;
      }
    };
    V(
      [O, () => u.value, R, g, v, h],
      () => ke(ge)
    ), V(() => e.theme, () => ge()), V(() => e.curvature, () => ke(He)), V(() => e.scanlines, () => ge()), V(() => e.glow, () => ge()), V(h, (o) => {
      if (!o) return;
      const r = O.value[o.row], p = R.value[o.col];
      r && p && n("cell-selected", { data: r, row: o.row, col: o.col, colId: p.colId });
    });
    let qe = null, Ze = null, dt = 0;
    function $e() {
      cancelAnimationFrame(dt), dt = requestAnimationFrame(He);
    }
    function kt(o) {
      o.preventDefault();
    }
    function Lt() {
      ie == null || ie.dispose(), ie = null, Ae = !1, Ct();
    }
    ze(() => {
      for (const o of e.columnDefs)
        o.hide && i.add(D(o)), o.sort && !d.value && (d.value = { colId: D(o), dir: o.sort });
      a.value = e.rowData ?? [], u.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", Tt), document.addEventListener("mousemove", ye), document.addEventListener("mouseup", _e), ke(() => {
        var o;
        Ct(), ae.value && (ae.value.addEventListener("webglcontextlost", kt), ae.value.addEventListener("webglcontextrestored", Lt)), Me.value && (qe = new ResizeObserver(() => He()), qe.observe(Me.value), Ze = new IntersectionObserver((r) => {
          r.some((p) => p.isIntersecting) && $e();
        }), Ze.observe(Me.value)), window.addEventListener("resize", $e), (o = window.visualViewport) == null || o.addEventListener("resize", $e), n("grid-ready", { api: al });
      });
    }), Ue(() => {
      var o, r, p;
      document.removeEventListener("click", Tt, !0), document.removeEventListener("mousemove", ye), document.removeEventListener("mouseup", _e), (o = ae.value) == null || o.removeEventListener("webglcontextlost", kt), (r = ae.value) == null || r.removeEventListener("webglcontextrestored", Lt), qe == null || qe.disconnect(), Ze == null || Ze.disconnect(), window.removeEventListener("resize", $e), (p = window.visualViewport) == null || p.removeEventListener("resize", $e), cancelAnimationFrame(dt), ie == null || ie.dispose();
    });
    const we = ee(() => Xe[e.theme] ?? Xe.none), il = ee(() => ({
      position: "absolute",
      left: `${K.value.x}px`,
      top: `${K.value.y}px`,
      zIndex: 100,
      background: we.value.headerBg,
      border: `1px solid ${we.value.accent}`,
      color: we.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), rl = ee(() => ({
      background: we.value.bg,
      border: `1px solid ${we.value.border}`,
      color: we.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), sl = ee(() => ({
      background: we.value.headerBg,
      borderTop: `1px solid ${we.value.border}`,
      color: we.value.text
    })), cl = ee(() => ({
      background: we.value.bg
    })), Rt = ee(() => we.value.accent);
    return (o, r) => {
      var p, C;
      return ue(), fe("div", {
        ref_key: "wrapEl",
        ref: Me,
        class: "cathode-wrap",
        style: Se(cl.value)
      }, [
        ne("canvas", {
          ref_key: "canvasEl",
          ref: ae,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: De(qt, ["prevent"]),
          onMousemove: Zt,
          onMouseleave: Jt,
          onMousedown: Qt,
          onClick: el,
          onKeydown: ll
        }, null, 544),
        M.value ? (ue(), fe("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: Se(il.value),
          onClick: r[0] || (r[0] = De(() => {
          }, ["stop"]))
        }, [
          ne("input", {
            style: Se(rl.value),
            value: S.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: ol,
            onKeydown: ul(It, ["escape"])
          }, null, 44, yl),
          S.value ? (ue(), fe("button", {
            key: 0,
            style: Se({
              background: "none",
              border: "none",
              color: we.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: It
          }, "✕", 4)) : Te("", !0)
        ], 4)) : Te("", !0),
        t.pagination ? (ue(), fe("div", {
          key: 1,
          class: "cathode-pagination",
          style: Se(sl.value)
        }, [
          ne("button", {
            disabled: g.value <= 0,
            onClick: r[1] || (r[1] = (T) => E())
          }, "◀", 8, Ml),
          ne("span", null, Ce((j.value + 1).toLocaleString()) + "–" + Ce(Math.min(O.value.length, Y.value + 1).toLocaleString()) + " / " + Ce(O.value.length.toLocaleString()), 1),
          ne("button", {
            disabled: g.value >= U.value,
            onClick: r[2] || (r[2] = (T) => N())
          }, "▶", 8, Sl),
          ne("span", {
            class: "cathode-page-info",
            style: Se({ color: Rt.value })
          }, Ce(O.value.length.toLocaleString()) + " rows ", 5),
          h.value ? (ue(), fe("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Se({ color: Rt.value })
          }, Ce(((p = R.value[h.value.col]) == null ? void 0 : p.colDef.headerName) ?? ((C = R.value[h.value.col]) == null ? void 0 : C.colId)) + " : " + Ce(Q(R.value[h.value.col], O.value[h.value.row])), 5)) : Te("", !0)
        ], 4)) : Te("", !0)
      ], 4);
    };
  }
}), je = (t, l) => {
  const e = t.__vccOpts || t;
  for (const [n, a] of l)
    e[n] = a;
  return e;
}, An = /* @__PURE__ */ je(Ll, [["__scopeId", "data-v-d5fb1081"]]), ot = {
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
function Rl(t, l) {
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
const El = 12, be = 18, nt = 10, Ke = 6, bt = `${El}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Dl(t, l, e) {
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
    const u = a.split(/(\s+)/);
    let c = "";
    for (const d of u) {
      const f = c + d;
      if (t.measureText(f).width <= e)
        c = f;
      else if (c && (n.push(c.replace(/\s+$/, "")), c = ""), t.measureText(d).width > e) {
        let s = "";
        for (const i of d)
          t.measureText(s + i).width > e ? (s && n.push(s), s = i) : s += i;
        c = s;
      } else
        c = d.replace(/^\s+/, "");
    }
    c && n.push(c.replace(/\s+$/, ""));
  }
  return n.length ? n : [""];
}
function Nt(t) {
  if (typeof t == "number") {
    const l = new Date(t), e = String(l.getHours()).padStart(2, "0"), n = String(l.getMinutes()).padStart(2, "0"), a = String(l.getSeconds()).padStart(2, "0");
    return `${e}:${n}:${a}`;
  }
  return t;
}
function Fl(t, l) {
  return Math.ceil(t.measureText(l).width) + 12;
}
function Bl(t) {
  const { entries: l, ctx: e, textMaxWidth: n, showTimestamps: a, wordWrap: u } = t, c = t.formatTs ?? Nt;
  e.font = bt;
  const d = [];
  for (let f = 0; f < l.length; f++) {
    const s = l[f], i = s.level ?? "info", w = a && s.ts != null ? c(s.ts) : "", b = u ? Dl(e, s.text, n) : s.text.split(`
`);
    for (let x = 0; x < b.length; x++)
      d.push({
        entryIdx: f,
        text: b[x],
        level: i,
        timestamp: x === 0 ? w : "",
        isFirstFrag: x === 0
      });
  }
  return d;
}
function Yt(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, u = ot[l.theme] ?? ot.none;
  e.clearRect(0, 0, n, a), e.fillStyle = u.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip(), e.font = bt, e.textBaseline = "middle";
  const c = l.visualLines, d = nt, f = l.showTimestamps ? nt + l.timestampWidth : nt, s = Math.max(0, Math.floor((l.scrollY - Ke) / be)), i = Math.min(c.length, Math.ceil((l.scrollY + a - Ke) / be) + 1);
  for (let w = s; w < i; w++) {
    const b = c[w], x = Ke + w * be - l.scrollY + be / 2;
    if (b.entryIdx % 2 === 1 && b.isFirstFrag) {
      e.fillStyle = u.rowAlt;
      let m = 1;
      for (; w + m < i && c[w + m].entryIdx === b.entryIdx; ) m++;
      e.fillRect(0, x - be / 2, n, be * m);
    }
    w === l.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, x - be / 2, n, be)), l.showTimestamps && b.timestamp && (e.fillStyle = u.timestamp, e.textAlign = "left", l.glow && (e.shadowBlur = 6, e.shadowColor = u.timestamp), e.fillText(b.timestamp, d, x), e.shadowBlur = 0);
    const g = Rl(u, b.level);
    e.fillStyle = g, e.textAlign = "left", l.glow ? (e.shadowColor = g, e.shadowBlur = 14, e.fillText(b.text, f, x), e.shadowBlur = 7, e.fillText(b.text, f, x), e.shadowBlur = 3, e.fillText(b.text, f, x), e.shadowBlur = 0) : e.fillText(b.text, f, x);
  }
  e.restore();
}
function _l(t, l, e) {
  if (t < 0) return -1;
  const n = Math.floor((t + l - Ke) / be);
  return n < 0 || n >= e ? -1 : n;
}
function Al(t) {
  return Ke * 2 + t * be;
}
const Yl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Wl = `
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

    gl_FragColor = color;
  }
`, zl = /* @__PURE__ */ Ge({
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
    maxLines: { default: 0 }
  },
  setup(t, { expose: l }) {
    const e = t, n = B(null), a = B(null), u = B(0), c = B(0), d = B(0), f = B(-1), s = B(!0), i = ee(() => {
      const F = e.entries ?? [];
      return e.maxLines > 0 && F.length > e.maxLines ? F.slice(F.length - e.maxLines) : F;
    }), w = ee(() => {
      if (!e.showTimestamps) return "";
      const F = e.formatTs ?? Nt;
      let $ = "00:00:00";
      for (const oe of i.value) {
        if (oe.ts == null) continue;
        const ye = F(oe.ts);
        ye.length > $.length && ($ = ye);
      }
      return $;
    }), b = B(0), x = B([]);
    function g() {
      if (!L) return;
      const F = L.getContext("2d");
      if (!F) return;
      F.font = bt;
      const $ = e.showTimestamps ? Fl(F, w.value) : 0;
      b.value = $;
      const oe = Math.max(
        1,
        u.value - nt * 2 - $
      );
      x.value = Bl({
        entries: i.value,
        ctx: F,
        textMaxWidth: oe,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const m = ee(() => Al(x.value.length)), v = ee(() => Math.max(0, m.value - c.value));
    V(v, () => {
      s.value ? d.value = v.value : d.value = Math.min(d.value, v.value);
    }), V(
      [i, u, () => e.showTimestamps, () => e.wordWrap, w],
      () => {
        g(), ke(q);
      },
      { deep: !1 }
    );
    let h = null, y = !1, M, K, S, D, L;
    function R() {
      if (!(!a.value || !n.value)) {
        L = document.createElement("canvas");
        try {
          h = new X.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          y = !0;
        }
        if (!y && !h.getContext() && (h.dispose(), h = null, y = !0), y) {
          P();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), M = new X.Scene(), K = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), D = new X.CanvasTexture(L), D.minFilter = X.LinearFilter, D.magFilter = X.LinearFilter, S = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: D },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Yl,
          fragmentShader: Wl,
          transparent: !0
        }), M.add(new X.Mesh(new X.PlaneGeometry(2, 2), S)), P();
      }
    }
    function P() {
      if (!n.value || !h && !y) return;
      const F = n.value.clientWidth, $ = n.value.clientHeight;
      if (!F || !$) return;
      const oe = L.width !== F || L.height !== $;
      oe && (L.width = F, L.height = $, u.value = F, c.value = $, g(), h ? (oe && D && (D.dispose(), D = new X.CanvasTexture(L), D.minFilter = X.LinearFilter, D.magFilter = X.LinearFilter, S && (S.uniforms.uTex.value = D)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(F, $)) : a.value && (a.value.width = F, a.value.height = $, a.value.style.width = F + "px", a.value.style.height = $ + "px"), s.value && (d.value = Math.max(0, m.value - c.value)), q());
    }
    function q() {
      if (!(L != null && L.width)) return;
      if (y) {
        if (!a.value) return;
        Yt(L, {
          visualLines: x.value,
          scrollY: d.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: b.value,
          hoveredLine: f.value
        });
        const $ = a.value.getContext("2d");
        $ && $.drawImage(L, 0, 0);
        return;
      }
      if (!h || !S || !D) return;
      const F = e.theme === "paper";
      S.uniforms.uStrength.value = e.curvature / 45 * 0.55, S.uniforms.uScanlines.value = e.scanlines && !F ? 1 : 0, S.uniforms.uVignette.value = F ? 0 : 1, Yt(L, {
        visualLines: x.value,
        scrollY: d.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: b.value,
        hoveredLine: f.value
      }), D.needsUpdate = !0, h.render(M, K);
    }
    V(() => e.theme, () => q()), V(() => e.curvature, () => q()), V(() => e.scanlines, () => q()), V(() => e.glow, () => q()), V(d, () => q()), V(f, () => q());
    function U(F) {
      if (!a.value) return [-1, -1];
      const $ = a.value.getBoundingClientRect();
      return [F.clientX - $.left, F.clientY - $.top];
    }
    function te(F) {
      d.value = Math.max(0, Math.min(v.value, F)), s.value = d.value >= v.value - 4;
    }
    function j(F) {
      te(d.value + F.deltaY);
    }
    let Y = !1, W = 0, Q = 0;
    function H(F) {
      Y = !0, W = F.clientY, Q = d.value;
    }
    function O(F) {
      if (Y) {
        const $ = W - F.clientY;
        te(Q + $);
      }
    }
    function Z() {
      Y && (Y = !1);
    }
    function E(F) {
      const [, $] = U(F);
      if ($ < 0) {
        f.value = -1;
        return;
      }
      f.value = _l($, d.value, x.value.length);
    }
    function N() {
      f.value = -1;
    }
    l({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        s.value = !0, d.value = v.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(F) {
        te(Ke + F * be);
      }
    });
    let J = null, le = null, k = 0;
    const A = st("cathodeResetTick", B(0));
    V(A, () => z());
    function z() {
      cancelAnimationFrame(k), k = requestAnimationFrame(P);
    }
    function ve(F) {
      F.preventDefault();
    }
    function he() {
      h == null || h.dispose(), h = null, y = !1, R();
    }
    ze(() => {
      document.addEventListener("mousemove", O), document.addEventListener("mouseup", Z), ke(() => {
        var F;
        R(), a.value && (a.value.addEventListener("webglcontextlost", ve), a.value.addEventListener("webglcontextrestored", he)), n.value && (J = new ResizeObserver(() => P()), J.observe(n.value), le = new IntersectionObserver(($) => {
          $.some((oe) => oe.isIntersecting) && z();
        }), le.observe(n.value)), window.addEventListener("resize", z), (F = window.visualViewport) == null || F.addEventListener("resize", z), d.value = v.value;
      });
    }), Ue(() => {
      var F, $, oe;
      document.removeEventListener("mousemove", O), document.removeEventListener("mouseup", Z), (F = a.value) == null || F.removeEventListener("webglcontextlost", ve), ($ = a.value) == null || $.removeEventListener("webglcontextrestored", he), J == null || J.disconnect(), le == null || le.disconnect(), window.removeEventListener("resize", z), (oe = window.visualViewport) == null || oe.removeEventListener("resize", z), cancelAnimationFrame(k), h == null || h.dispose();
    });
    const xe = ee(() => ot[e.theme] ?? ot.none), Ee = ee(() => ({
      background: xe.value.bg
    }));
    return (F, $) => (ue(), fe("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: Se(Ee.value)
    }, [
      ne("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: De(j, ["prevent"]),
        onMousemove: E,
        onMouseleave: N,
        onMousedown: H
      }, null, 544)
    ], 4));
  }
}), Pl = /* @__PURE__ */ je(zl, [["__scopeId", "data-v-669b69f1"]]), Hl = ["disabled"], $l = /* @__PURE__ */ Ge({
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
    const n = t, a = e, u = B(null), c = B(null), d = B(""), f = B([]), s = B(-1);
    let i = "";
    function w(S) {
      S.trim() && (f.value.length && f.value[f.value.length - 1] === S || (f.value.push(S), f.value.length > n.historyLimit && f.value.splice(0, f.value.length - n.historyLimit)));
    }
    function b(S) {
      if (!n.disabled) {
        if (S.key === "Enter") {
          S.preventDefault();
          const D = d.value;
          D.trim() && w(D), s.value = -1, d.value = "", a("submit", D);
          return;
        }
        if (S.key === "ArrowUp") {
          if (!f.value.length) return;
          S.preventDefault(), s.value === -1 ? (i = d.value, s.value = f.value.length - 1) : s.value > 0 && s.value--, d.value = f.value[s.value];
          return;
        }
        if (S.key === "ArrowDown") {
          if (s.value === -1) return;
          S.preventDefault(), s.value < f.value.length - 1 ? (s.value++, d.value = f.value[s.value]) : (s.value = -1, d.value = i, i = "");
          return;
        }
      }
    }
    const x = B(!0);
    let g = null;
    function m() {
      g || (g = setInterval(() => {
        x.value = !x.value;
      }, 530));
    }
    function v() {
      g && (clearInterval(g), g = null), x.value = !0;
    }
    const h = ee(() => {
      let S;
      return n.disabled ? S = " " : n.busy ? S = "█" : S = x.value ? "█" : " ", { level: "info", text: `${n.prompt}${d.value}${S}` };
    }), y = ee(
      () => [...n.entries, h.value]
    );
    function M() {
      var S;
      n.disabled || (S = c.value) == null || S.focus();
    }
    V(() => n.busy, (S, D) => {
      D && !S && !n.disabled && ke(() => {
        var L;
        return (L = c.value) == null ? void 0 : L.focus();
      });
    });
    function K() {
      var S;
      (S = c.value) == null || S.focus();
    }
    return l({ focus: K }), ze(() => {
      m(), n.disabled || requestAnimationFrame(() => {
        var S;
        return (S = c.value) == null ? void 0 : S.focus();
      });
    }), Ue(() => {
      v();
    }), (S, D) => (ue(), fe("div", {
      ref_key: "wrapEl",
      ref: u,
      class: "cathode-terminal-wrap",
      onClick: M
    }, [
      Ot(Pl, {
        entries: y.value,
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
      Vt(ne("input", {
        ref_key: "inputEl",
        ref: c,
        "onUpdate:modelValue": D[0] || (D[0] = (L) => d.value = L),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: b
      }, null, 40, Hl), [
        [fl, d.value]
      ])
    ], 512));
  }
}), Yn = /* @__PURE__ */ je($l, [["__scopeId", "data-v-90cf2990"]]), at = {
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
}, Ol = 0.18, tt = 8, xt = 22, Vl = 4, Re = 8, We = 56, Xt = 42, Fe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Nl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", mt = 4, Xl = 1, Kl = 1;
function Gl(t, l, e, n = 0, a = !1) {
  const u = a ? Xt : We, c = Math.max(0, l - Re - u), d = Math.max(1, Math.floor(c / e)), f = Math.min(d, t);
  return { firstIdx: Math.max(0, t - f - Math.floor(n / e)), count: f, slotW: e };
}
function Ul(t, l, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, a = -1 / 0, u = 0;
  const c = Math.min(t.length, l + e);
  for (let f = l; f < c; f++) {
    const s = t[f];
    s && (s.low < n && (n = s.low), s.high > a && (a = s.high), s.volume > u && (u = s.volume));
  }
  if (!isFinite(n) || !isFinite(a) || n === a) {
    const f = isFinite(n) ? n : 0;
    return { min: f - 1, max: f + 1, maxVol: Math.max(1, u) };
  }
  const d = (a - n) * 0.04;
  return { min: n - d, max: a + d, maxVol: Math.max(1, u) };
}
function jl(t, l, e = !1) {
  const n = e ? Vl : xt, a = Math.max(1, t - tt - n - mt), u = Math.max(0, Math.round(a * l)), c = a - u;
  return {
    priceY0: tt,
    priceY1: tt + c,
    volumeY0: tt + c + mt,
    volumeY1: tt + c + mt + u
  };
}
function Ie(t, l, e, n) {
  const a = l.max - l.min;
  return a <= 0 ? (e + n) / 2 : e + (1 - (t - l.min) / a) * (n - e);
}
function Be(t, l, e) {
  return Re + (t - l + 0.5) * e;
}
function Ye(t) {
  const l = Math.abs(t), e = l >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : l >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : l >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : l >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function yt(t) {
  const l = new Date(t), e = String(l.getMonth() + 1).padStart(2, "0"), n = String(l.getDate()).padStart(2, "0"), a = String(l.getHours()).padStart(2, "0"), u = String(l.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${a}:${u}`;
}
function ql(t, l) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, l), n = Math.pow(10, Math.floor(Math.log10(e))), a = e / n;
  let u;
  return a < 1.5 ? u = 1 : a < 3 ? u = 2 : a < 7 ? u = 5 : u = 10, u * n;
}
function Wt(t, l) {
  var x, g, m, v, h;
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, u = at[l.theme] ?? at.none, c = l.colors ? { ...u, ...l.colors } : u, d = !!l.compact;
  if (e.clearRect(0, 0, n, a), e.fillStyle = c.bg, e.fillRect(0, 0, n, a), !l.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const f = Gl(l.candles.length, n, l.slotW, l.scrollX, d), s = Ul(l.candles, f.firstIdx, f.count), i = jl(a, l.showVolume ? l.volumeFraction : 0, d), w = Math.max(Xl, Math.floor(l.slotW * 0.7)), b = Math.min(l.candles.length, f.firstIdx + f.count);
  for (let y = f.firstIdx; y < b; y++) {
    const M = l.candles[y];
    if (!M) continue;
    const K = Be(y, f.firstIdx, l.slotW), S = Ie(M.open, s, i.priceY0, i.priceY1), D = Ie(M.close, s, i.priceY0, i.priceY1), L = Ie(M.high, s, i.priceY0, i.priceY1), R = Ie(M.low, s, i.priceY0, i.priceY1), P = M.close >= M.open, q = P ? c.wickBull : c.wickBear, U = P ? c.candleBull : c.candleBear;
    l.glow && (e.shadowBlur = 10, e.shadowColor = U), e.strokeStyle = q, e.lineWidth = Kl, e.beginPath(), e.moveTo(Math.round(K) + 0.5, L), e.lineTo(Math.round(K) + 0.5, R), e.stroke(), e.fillStyle = U;
    const te = Math.min(S, D), j = Math.max(1, Math.abs(D - S)), Y = Math.round(K - w / 2), W = Math.round(te), Q = Math.round(j);
    if (e.fillRect(Y, W, w, Q), l.glow && (e.shadowBlur = 4, e.fillRect(Y, W, w, Q)), e.shadowBlur = 0, l.showVolume && s.maxVol > 0) {
      const H = Math.round(M.volume / s.maxVol * (i.volumeY1 - i.volumeY0));
      H > 0 && (e.fillStyle = P ? c.volumeBull : c.volumeBear, e.fillRect(
        Math.round(K - w / 2),
        i.volumeY1 - H,
        w,
        H
      ));
    }
  }
  if ((x = l.overlays) != null && x.length)
    for (const y of l.overlays) Zl(e, y, f, s, i, l.slotW);
  (g = l.markers) != null && g.length && an(e, c, l.markers, l.candles, f, s, i, l.slotW), rn(e, c, s, i, n, d), d || (sn(e, c, l.candles, f, l.slotW, a), nn(e, c, l.candles, n, a)), (m = l.overlays) != null && m.length && Ql(e, c, l.overlays, i), l.hover && (cn(e, c, l.candles, f, s, i, l.slotW, l.hover, n), en(e, c, l.candles, f, l.slotW, l.hover, i, ((v = l.overlays) == null ? void 0 : v.length) ?? 0), (h = l.markers) != null && h.length && ln(e, c, l.markers, l.candles, f, s, i, l.slotW, l.hover, n)), e.restore();
}
function Zl(t, l, e, n, a, u) {
  var d;
  const c = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Re,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), l.kind === "line")
    lt(t, l.data, e.firstIdx, c, u, n, a, l.color, l.lineWidth ?? 1, l.dashed === !0);
  else {
    const f = Kt(l.color, l.fillAlpha ?? 0.08);
    Jl(t, l.upper, l.lower, e.firstIdx, c, u, n, a, f), lt(t, l.upper, e.firstIdx, c, u, n, a, l.color, 1, !1), lt(t, l.lower, e.firstIdx, c, u, n, a, l.color, 1, !1), (d = l.middle) != null && d.length && lt(t, l.middle, e.firstIdx, c, u, n, a, l.color, 1, l.middleDashed !== !1);
  }
  t.restore();
}
function lt(t, l, e, n, a, u, c, d, f, s) {
  if (!l || !l.length) return;
  t.strokeStyle = d, t.lineWidth = f, t.setLineDash(s ? [4, 3] : []), t.beginPath();
  let i = !1;
  for (let w = e; w < n; w++) {
    const b = l[w];
    if (typeof b != "number" || !isFinite(b)) {
      i && (t.stroke(), t.beginPath(), i = !1);
      continue;
    }
    const x = Be(w, e, a), g = Ie(b, u, c.priceY0, c.priceY1);
    i ? t.lineTo(x, g) : (t.moveTo(x, g), i = !0);
  }
  i && t.stroke(), t.setLineDash([]);
}
function Jl(t, l, e, n, a, u, c, d, f) {
  if (!(l != null && l.length) || !(e != null && e.length)) return;
  t.fillStyle = f;
  let s = !1, i = -1;
  for (let w = n; w <= a; w++) {
    const b = l[w], x = e[w], g = w < a && typeof b == "number" && typeof x == "number" && isFinite(b) && isFinite(x);
    if (g && !s && (i = w, s = !0), !g && s || w === a && s) {
      const m = g ? w + 1 : w;
      t.beginPath();
      for (let v = i; v < m; v++) {
        const h = Be(v, n, u), y = Ie(l[v], c, d.priceY0, d.priceY1);
        v === i ? t.moveTo(h, y) : t.lineTo(h, y);
      }
      for (let v = m - 1; v >= i; v--) {
        const h = Be(v, n, u), y = Ie(e[v], c, d.priceY0, d.priceY1);
        t.lineTo(h, y);
      }
      t.closePath(), t.fill(), s = !1;
    }
  }
}
function Kt(t, l) {
  const e = Math.max(0, Math.min(1, l));
  if (t.startsWith("#") && t.length === 7) {
    const n = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), u = parseInt(t.slice(5, 7), 16);
    return `rgba(${n},${a},${u},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Ql(t, l, e, n) {
  const a = e.filter((m) => !!m.label);
  if (!a.length) return;
  t.save(), t.font = Fe;
  const u = 8, c = 5, d = 12, f = 6, s = 14;
  let i = 0;
  for (const m of a) {
    const v = t.measureText(m.label).width;
    v > i && (i = v);
  }
  const w = u * 2 + d + f + i, b = c * 2 + s * a.length, x = Re + 4, g = n.priceY0 + 4;
  t.fillStyle = l.panelBg, t.fillRect(x, g, w, b), t.textBaseline = "middle", t.textAlign = "left";
  for (let m = 0; m < a.length; m++) {
    const v = a[m], h = g + c + s * (m + 0.5), y = x + u;
    v.kind === "line" ? (t.strokeStyle = v.color, t.lineWidth = v.lineWidth ?? 1, t.setLineDash(v.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(y, h), t.lineTo(y + d, h), t.stroke(), t.setLineDash([])) : (t.fillStyle = Kt(v.color, v.fillAlpha ?? 0.2), t.fillRect(y, h - 4, d, 8), t.strokeStyle = v.color, t.lineWidth = 1, t.strokeRect(y + 0.5, h - 4 + 0.5, d - 1, 7)), t.fillStyle = l.text, t.fillText(v.label, y + d + f, h);
  }
  t.restore();
}
function en(t, l, e, n, a, u, c, d) {
  const f = Math.floor((u.x - Re) / a), s = n.firstIdx + f;
  if (s < 0 || s >= e.length) return;
  const i = e[s];
  if (!i) return;
  const w = i.close - i.open, b = i.open !== 0 ? w / i.open * 100 : 0, x = w >= 0 ? "+" : "", g = [
    ["O", Ye(i.open), void 0],
    ["H", Ye(i.high), void 0],
    ["L", Ye(i.low), void 0],
    ["C", Ye(i.close), void 0],
    ["V", tn(i.volume), void 0],
    ["", `${x}${b.toFixed(2)}%`, w >= 0 ? l.candleBull : l.candleBear]
  ];
  t.save(), t.font = Fe, t.textBaseline = "middle", t.textAlign = "left";
  const m = 8, v = 4, h = 14;
  let y = m;
  for (const [D, L] of g) {
    const R = D ? `${D} ${L}` : L, P = t.measureText(R).width + 12;
    y += P;
  }
  y += m - 12;
  const M = c.priceY0 + 4 + (d > 0 ? v * 2 + 14 * d + 4 : 0), K = Re + 4;
  t.fillStyle = l.panelBg, t.fillRect(K, M, y, h + v * 2);
  let S = K + m;
  for (let D = 0; D < g.length; D++) {
    const [L, R, P] = g[D];
    t.fillStyle = l.text, L && (t.globalAlpha = 0.6, t.fillText(L + " ", S, M + v + h / 2), t.globalAlpha = 1, S += t.measureText(L + " ").width), P && (t.fillStyle = P), t.fillText(R, S, M + v + h / 2), S += t.measureText(R).width + 12;
  }
  t.restore();
}
function tn(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function ln(t, l, e, n, a, u, c, d, f, s) {
  if (!n.length) return;
  const i = n.length > 1 ? n[1].start - n[0].start : 6e4, w = Math.max(1, i * 0.5), b = Math.min(n.length, a.firstIdx + a.count), x = 9;
  let g = null;
  for (const R of e) {
    let P = 0, q = n.length - 1, U = -1;
    for (; P <= q; ) {
      const Y = P + q >> 1, W = n[Y].start - R.timestamp;
      if (Math.abs(W) <= w) {
        U = Y;
        break;
      }
      W < 0 ? P = Y + 1 : q = Y - 1;
    }
    if (U < 0 || U < a.firstIdx || U >= b) continue;
    const te = Be(U, a.firstIdx, d), j = Ie(R.price, u, c.priceY0, c.priceY1);
    if (Math.abs(f.x - te) <= x && Math.abs(f.y - j) <= x) {
      g = { m: R, x: te, y: j };
      break;
    }
  }
  if (!g) return;
  const m = yt(g.m.timestamp), v = [
    `${g.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${m}`,
    `@ ${Ye(g.m.price)}`
  ];
  g.m.label && v.push(g.m.label), t.save(), t.font = Fe, t.textBaseline = "top", t.textAlign = "left";
  const h = 6, y = 14;
  let M = 0;
  for (const R of v) {
    const P = t.measureText(R).width;
    P > M && (M = P);
  }
  const K = M + h * 2, S = v.length * y + h * 2;
  let D = g.x + 12;
  D + K > s - We && (D = g.x - 12 - K);
  let L = g.y - S / 2;
  L < c.priceY0 && (L = c.priceY0), L + S > c.priceY1 && (L = c.priceY1 - S), t.fillStyle = l.panelBgSolid, t.strokeStyle = g.m.kind === "entry" ? l.markerEntry : l.markerExit, t.lineWidth = 1, t.fillRect(D, L, K, S), t.strokeRect(D + 0.5, L + 0.5, K - 1, S - 1);
  for (let R = 0; R < v.length; R++) {
    const P = v[R];
    t.fillStyle = R === 0 ? g.m.kind === "entry" ? l.markerEntry : l.markerExit : l.text, t.fillText(P, D + h, L + h + R * y);
  }
  t.restore();
}
function nn(t, l, e, n, a) {
  if (e.length < 2) return;
  const u = e[1].start - e[0].start, c = on(u);
  if (!c) return;
  t.save(), t.font = Fe, t.textBaseline = "top", t.textAlign = "right";
  const d = 6, f = 3, s = t.measureText(c).width, i = n - We - d, w = a - xt + 4;
  t.fillStyle = l.accent, t.fillRect(i - s - d, w - f, s + d * 2, 14 + f * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(c, i, w), t.restore();
}
function on(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const l = 1e3, e = 60 * l, n = 60 * e, a = 24 * n, u = 7 * a;
  return t >= u && t % u === 0 ? t / u + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= n && t % n === 0 ? t / n + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= l && t % l === 0 ? t / l + "s" : Math.round(t / e) + "m";
}
function an(t, l, e, n, a, u, c, d) {
  if (!n.length) return;
  const f = n.length > 1 ? n[1].start - n[0].start : 6e4, s = Math.max(1, f * 0.5), i = Math.min(n.length, a.firstIdx + a.count), w = (x) => {
    let g = 0, m = n.length - 1;
    for (; g <= m; ) {
      const v = g + m >> 1, h = n[v].start - x;
      if (Math.abs(h) <= s) return v;
      h < 0 ? g = v + 1 : m = v - 1;
    }
    return -1;
  }, b = 7;
  for (const x of e) {
    const g = w(x.timestamp);
    if (g < 0 || g < a.firstIdx || g >= i) continue;
    const m = Be(g, a.firstIdx, d), v = Ie(x.price, u, c.priceY0, c.priceY1);
    if (v < c.priceY0 || v > c.priceY1) continue;
    const h = x.color ?? (x.kind === "entry" ? l.markerEntry : l.markerExit);
    t.fillStyle = h, t.strokeStyle = l.panelBgSolid, t.lineWidth = 1, t.beginPath(), x.kind === "entry" ? (t.moveTo(m, v - b), t.lineTo(m - b, v + b - 1), t.lineTo(m + b, v + b - 1)) : (t.moveTo(m, v + b), t.lineTo(m - b, v - b + 1), t.lineTo(m + b, v - b + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function rn(t, l, e, n, a, u = !1) {
  const c = e.max - e.min;
  if (c <= 0) return;
  const d = n.priceY1 - n.priceY0, f = u ? Math.max(2, Math.min(4, Math.round(d / 36))) : 6, s = ql(c, f), i = Math.ceil(e.min / s) * s, w = u ? Xt : We;
  t.font = u ? Nl : Fe, t.fillStyle = l.text, t.strokeStyle = l.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let b = i; b <= e.max; b += s) {
    const x = Ie(b, e, n.priceY0, n.priceY1);
    x < n.priceY0 || x > n.priceY1 || (t.beginPath(), t.moveTo(Re, Math.round(x) + 0.5), t.lineTo(a - w, Math.round(x) + 0.5), t.stroke(), t.fillText(Ye(b), a - w + 3, x));
  }
  t.globalAlpha = 1;
}
function sn(t, l, e, n, a, u) {
  if (n.count <= 0 || !e.length) return;
  const d = Math.max(1, Math.floor(n.count / 6));
  t.font = Fe, t.fillStyle = l.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const f = Math.min(e.length, n.firstIdx + n.count);
  for (let s = n.firstIdx; s < f; s += d) {
    const i = e[s];
    if (!i) continue;
    const w = Be(s, n.firstIdx, a);
    t.fillText(yt(i.start), w, u - xt + 4);
  }
  t.globalAlpha = 1;
}
function cn(t, l, e, n, a, u, c, d, f) {
  const s = Math.floor((d.x - Re) / c), i = Math.max(0, Math.min(e.length - 1, n.firstIdx + s)), w = e[i];
  if (!w) return;
  const b = Be(i, n.firstIdx, c);
  t.save(), t.strokeStyle = l.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(b) + 0.5, u.priceY0), t.lineTo(Math.round(b) + 0.5, u.volumeY1 || u.priceY1), t.stroke();
  const x = Math.max(u.priceY0, Math.min(u.priceY1, d.y));
  t.beginPath(), t.moveTo(Re, Math.round(x) + 0.5), t.lineTo(f - We, Math.round(x) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const g = a.max - a.min;
  if (g > 0) {
    const h = a.max - (x - u.priceY0) / (u.priceY1 - u.priceY0) * g, y = Ye(h);
    t.font = Fe, t.textBaseline = "middle", t.textAlign = "left";
    const M = t.measureText(y).width, K = 4, S = 2;
    t.fillStyle = l.accent, t.fillRect(f - We + 2, x - 7 - S, M + K * 2, 14 + S * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(y, f - We + 2 + K, x);
  }
  t.font = Fe, t.textBaseline = "top", t.textAlign = "center";
  const m = yt(w.start), v = t.measureText(m).width;
  t.fillStyle = l.accent, t.fillRect(b - v / 2 - 4, u.volumeY1 + 2, v + 8, 14), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(m, b, u.volumeY1 + 4), t.restore();
}
const zt = 0.25, Pt = 6, un = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, fn = `
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

    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;   // softened falloff — see CathodeLog for rationale
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`, dn = /* @__PURE__ */ Ge({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Ol },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {}
  },
  setup(t) {
    const l = t, e = B(null), n = B(null), a = B(0), u = B(0), c = B(0), d = B(1), f = B(null), s = ee(() => Math.max(1, l.slotW * d.value));
    let i = null, w = !1, b, x, g, m, v;
    function h() {
      if (!(!n.value || !e.value)) {
        if (v = document.createElement("canvas"), l.flat) {
          w = !0, y();
          return;
        }
        try {
          i = new X.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0 });
        } catch {
          w = !0;
        }
        if (!w && !i.getContext() && (i.dispose(), i = null, w = !0), w) {
          y();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), b = new X.Scene(), x = new X.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new X.CanvasTexture(v), m.minFilter = X.LinearFilter, m.magFilter = X.LinearFilter, g = new X.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: un,
          fragmentShader: fn,
          transparent: !0
        }), b.add(new X.Mesh(new X.PlaneGeometry(2, 2), g)), y();
      }
    }
    function y() {
      if (!e.value || !i && !w) return;
      const k = e.value.clientWidth, A = e.value.clientHeight;
      !k || !A || !(v.width !== k || v.height !== A) || (v.width = k, v.height = A, a.value = k, u.value = A, i ? (m && (m.dispose(), m = new X.CanvasTexture(v), m.minFilter = X.LinearFilter, m.magFilter = X.LinearFilter, g && (g.uniforms.uTex.value = m)), i.setPixelRatio(window.devicePixelRatio || 1), i.setSize(k, A)) : n.value && (n.value.width = k, n.value.height = A, n.value.style.width = k + "px", n.value.style.height = A + "px"), M());
    }
    function M() {
      if (!(v != null && v.width)) return;
      if (w) {
        if (!n.value) return;
        Wt(v, {
          candles: l.candles,
          slotW: s.value,
          scrollX: c.value,
          theme: l.theme,
          glow: !1,
          showVolume: l.showVolume,
          volumeFraction: l.volumeFraction,
          hover: f.value,
          overlays: l.overlays,
          markers: l.markers,
          compact: l.compact,
          colors: l.colors
        });
        const A = n.value.getContext("2d");
        A && (A.clearRect(0, 0, n.value.width, n.value.height), A.drawImage(v, 0, 0));
        return;
      }
      if (!i || !g || !m) return;
      const k = l.theme === "paper";
      g.uniforms.uStrength.value = l.curvature / 45 * 0.55, g.uniforms.uScanlines.value = l.scanlines && !k ? 1 : 0, g.uniforms.uVignette.value = k ? 0 : 1, Wt(v, {
        candles: l.candles,
        slotW: s.value,
        scrollX: c.value,
        theme: l.theme,
        glow: l.glow,
        showVolume: l.showVolume,
        volumeFraction: l.volumeFraction,
        hover: f.value,
        overlays: l.overlays,
        markers: l.markers,
        compact: l.compact,
        colors: l.colors
      }), m.needsUpdate = !0, i.render(b, x);
    }
    V(() => l.theme, () => M()), V(() => l.curvature, () => M()), V(() => l.scanlines, () => M()), V(() => l.glow, () => M()), V(() => l.showVolume, () => M()), V(() => l.volumeFraction, () => M()), V(() => l.slotW, () => M()), V(() => l.candles, () => M(), { deep: !1 }), V(() => l.overlays, () => M(), { deep: !1 }), V(() => l.markers, () => M(), { deep: !1 }), V(() => l.compact, () => M()), V(() => l.colors, () => M(), { deep: !0 }), V(() => l.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), V(c, () => M()), V(d, () => M()), V(f, () => M()), V(s, () => M());
    let K = null, S = null, D = 0;
    const L = st("cathodeResetTick", B(0));
    V(L, () => R());
    function R() {
      cancelAnimationFrame(D), D = requestAnimationFrame(y);
    }
    function P(k) {
      k.preventDefault();
    }
    function q() {
      i == null || i.dispose(), i = null, w = !1, h();
    }
    function U(k) {
      if (!n.value) return [-1, -1];
      const A = n.value.getBoundingClientRect();
      return [k.clientX - A.left, k.clientY - A.top];
    }
    function te(k) {
      var xe;
      const A = s.value;
      if (A <= 0) return 0;
      const z = ((xe = l.candles) == null ? void 0 : xe.length) ?? 0, ve = Math.max(1, Math.floor((a.value || 1) / A)), he = Math.max(0, z - ve);
      return Math.max(0, Math.min(k, he * A));
    }
    function j(k) {
      var ve;
      if (k.deltaX !== 0 || k.shiftKey && k.deltaY !== 0) {
        const he = k.deltaX !== 0 ? k.deltaX : k.deltaY;
        c.value = te(c.value + he);
        return;
      }
      if (k.deltaY === 0) return;
      const [A] = U(k), z = s.value;
      if (A >= 0 && z > 0 && ((ve = l.candles) != null && ve.length)) {
        const he = Math.max(1, Math.floor((a.value || 1) / z)), Ee = Math.max(0, l.candles.length - he - Math.floor(c.value / z)) + (A - 8) / z, F = Math.exp(-k.deltaY * 15e-4), $ = Math.max(zt, Math.min(Pt, d.value * F));
        d.value = $;
        const oe = l.slotW * $, ye = Math.max(1, Math.floor((a.value || 1) / oe)), _e = Ee - (A - 8) / oe, Me = Math.max(0, l.candles.length - ye - _e);
        c.value = te(Me * oe);
      } else {
        const he = Math.exp(-k.deltaY * 15e-4);
        d.value = Math.max(zt, Math.min(Pt, d.value * he));
      }
    }
    let Y = !1, W = 0, Q = 0;
    function H(k) {
      k.button === 0 && (Y = !0, W = k.clientX, Q = c.value, f.value = null);
    }
    function O(k) {
      if (Y) {
        const A = k.clientX - W;
        c.value = te(Q + A);
        return;
      }
    }
    function Z() {
      Y = !1;
    }
    function E(k) {
      if (Y) return;
      const [A, z] = U(k);
      if (A < 0 || z < 0) {
        f.value = null;
        return;
      }
      f.value = { x: A, y: z };
    }
    function N() {
      f.value = null;
    }
    ze(() => {
      document.addEventListener("mousemove", O), document.addEventListener("mouseup", Z), ke(() => {
        var k;
        h(), n.value && (n.value.addEventListener("webglcontextlost", P), n.value.addEventListener("webglcontextrestored", q)), e.value && (K = new ResizeObserver(() => y()), K.observe(e.value), S = new IntersectionObserver((A) => {
          A.some((z) => z.isIntersecting) && R();
        }), S.observe(e.value)), window.addEventListener("resize", R), (k = window.visualViewport) == null || k.addEventListener("resize", R);
      });
    }), Ue(() => {
      var k, A, z;
      document.removeEventListener("mousemove", O), document.removeEventListener("mouseup", Z), (k = n.value) == null || k.removeEventListener("webglcontextlost", P), (A = n.value) == null || A.removeEventListener("webglcontextrestored", q), K == null || K.disconnect(), S == null || S.disconnect(), window.removeEventListener("resize", R), (z = window.visualViewport) == null || z.removeEventListener("resize", R), cancelAnimationFrame(D), i == null || i.dispose();
    });
    const J = ee(() => at[l.theme] ?? at.none), le = ee(() => ({
      background: J.value.bg
    }));
    return (k, A) => (ue(), fe("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: Se(le.value)
    }, [
      ne("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-candle-canvas",
        onWheel: De(j, ["prevent"]),
        onMousedown: H,
        onMousemove: E,
        onMouseleave: N
      }, null, 544)
    ], 4));
  }
}), Wn = /* @__PURE__ */ je(dn, [["__scopeId", "data-v-19358e05"]]), Mt = B(0), pt = 28, Ne = 12;
let wt = 10, it = "cathode.layout", rt = !1;
const de = B({});
function vn(t, l = "cathode.layout") {
  if (!rt) {
    rt = !0, it = l;
    try {
      const e = localStorage.getItem(it);
      if (e) {
        de.value = JSON.parse(e), Ht();
        return;
      }
    } catch {
    }
    de.value = { ...t }, Ht();
  }
}
function Ht() {
  let t = 10;
  for (const l of Object.values(de.value))
    typeof (l == null ? void 0 : l.zIndex) == "number" && l.zIndex > t && (t = l.zIndex);
  wt = t;
}
function Pe() {
  localStorage.setItem(it, JSON.stringify(de.value));
}
function hn(t) {
  rt = !1, localStorage.removeItem(it), de.value = { ...t }, Pe(), rt = !0, Mt.value++;
}
function Gt(t) {
  wt++, de.value[t] && (de.value[t].zIndex = wt);
}
function mn(t, l) {
  de.value[t].visible = l, Pe();
}
function gn(t, l) {
  de.value[t].minimized = l, l && (de.value[t].maximized = !1), Pe();
}
function pn(t, l) {
  de.value[t].maximized = l, l && (de.value[t].minimized = !1, Gt(t)), Pe();
}
function wn(t, l, e) {
  de.value[t].x = Math.round(l), de.value[t].y = Math.round(e), Pe();
}
function bn(t, l, e) {
  de.value[t].w = Math.round(l), de.value[t].h = Math.round(e), Pe();
}
function zn(t, l, e) {
  const n = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / n), u = Math.floor((t - Ne * (n + 1)) / n), c = Math.floor((l - Ne * (a + 1)) / a), d = {};
  return e.forEach((f, s) => {
    const i = s % n, w = Math.floor(s / n);
    d[f] = {
      x: Ne + i * (u + Ne),
      y: Ne + w * (c + Ne),
      w: u,
      h: c,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: s + 1
    };
  }), d;
}
function Ut() {
  return {
    containers: de,
    TITLEBAR_H: pt,
    load: vn,
    save: Pe,
    reset: hn,
    bringToFront: Gt,
    setVisible: mn,
    setMinimized: gn,
    setMaximized: pn,
    updatePos: wn,
    updateSize: bn
  };
}
const xn = { class: "ws-toolbar" }, yn = {
  key: 0,
  class: "ws-restore-menu"
}, Mn = {
  key: 0,
  class: "ws-restore-empty"
}, Sn = ["onClick"], Cn = /* @__PURE__ */ Ge({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const l = t, { containers: e, load: n, reset: a, setVisible: u } = Ut(), c = B(null);
    Et("cathodeWorkspace", c), Et("cathodeResetTick", Mt), ze(() => {
      if (!c.value) return;
      const { clientWidth: v, clientHeight: h } = c.value, y = l.initialLayout ?? {};
      n(y, l.storageKey ?? "cathode.layout");
      const M = Object.keys(e.value)[0];
      M && d(M);
    });
    function d(v) {
      var y;
      document.querySelectorAll(".cc").forEach((M) => M.classList.remove("cc-focused"));
      const h = (y = c.value) == null ? void 0 : y.querySelector(`#cc-${v}`);
      h && h.classList.add("cc-focused");
    }
    function f() {
      !c.value || !l.initialLayout || a(l.initialLayout);
    }
    function s(v) {
      const h = v.target.closest(".cc");
      h && (document.querySelectorAll(".cc").forEach((y) => y.classList.remove("cc-focused")), h.classList.add("cc-focused"));
    }
    const i = B(!1), w = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function b(v) {
      u(v, !0), i.value = !1;
    }
    function x(v) {
      if (!i.value) return;
      const h = v.target;
      !h.closest(".ws-restore-menu") && !h.closest(".ws-btn-restore") && (i.value = !1);
    }
    function g(v) {
      v.key === "Escape" && (i.value = !1);
    }
    ze(() => {
      document.addEventListener("click", x), document.addEventListener("keydown", g);
    }), Ue(() => {
      document.removeEventListener("click", x), document.removeEventListener("keydown", g);
    });
    function m(v) {
      var h;
      return ((h = l.containerTitles) == null ? void 0 : h[v]) ?? v;
    }
    return (v, h) => (ue(), fe("div", {
      ref_key: "workspaceEl",
      ref: c,
      class: "cathode-workspace",
      onMousedown: s
    }, [
      gt(v.$slots, "default", {}, void 0, !0),
      gt(v.$slots, "overlay", {}, void 0, !0),
      ne("div", xn, [
        t.initialLayout ? (ue(), fe("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: f
        }, " ↺ Reset Layout ")) : Te("", !0),
        h[1] || (h[1] = ne("div", { class: "ws-sep" }, null, -1)),
        ne("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: h[0] || (h[0] = (y) => i.value = !i.value)
        }, " ⊞ Restore Panel ")
      ]),
      Ot(dl, { name: "menu" }, {
        default: vl(() => [
          i.value ? (ue(), fe("div", yn, [
            h[3] || (h[3] = ne("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            w().length ? Te("", !0) : (ue(), fe("div", Mn, " No closed panels ")),
            (ue(!0), fe(hl, null, ml(w(), (y) => (ue(), fe("div", {
              key: y,
              class: "ws-restore-item",
              onClick: (M) => b(y)
            }, [
              h[2] || (h[2] = ne("span", { class: "ws-restore-icon" }, "⊞", -1)),
              gl(" " + Ce(m(y)), 1)
            ], 8, Sn))), 128))
          ])) : Te("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Pn = /* @__PURE__ */ je(Cn, [["__scopeId", "data-v-5838d04b"]]), Tn = ["id"], In = { class: "cc-title" }, kn = {
  key: 0,
  class: "cc-size-badge"
}, Ln = { class: "cc-controls" }, Rn = ["title"], En = { class: "cc-body" }, Dn = 200, Fn = 80, $t = 60, Bn = /* @__PURE__ */ Ge({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const l = t, { containers: e, bringToFront: n, setVisible: a, setMinimized: u, setMaximized: c, updatePos: d, updateSize: f } = Ut(), s = st("cathodeWorkspace", B(null)), i = ee(() => e.value[l.id]), w = ee(() => {
      const E = i.value, N = l.curvature ?? 0;
      if (!E) return {};
      const J = { "--curvature": N };
      return E.maximized ? { ...J, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: E.zIndex } : {
        ...J,
        left: E.x + "px",
        top: E.y + "px",
        width: E.w + "px",
        height: E.minimized ? pt + "px" : E.h + "px",
        zIndex: E.zIndex,
        display: E.visible ? "flex" : "none"
      };
    });
    let b = !1, x = 0, g = 0;
    function m(E) {
      var le;
      if (E.target.closest(".cc-btn") || i.value.maximized) return;
      n(l.id), b = !0;
      const N = (le = s.value) == null ? void 0 : le.querySelector(`#cc-${l.id}`);
      if (!N) return;
      const J = N.getBoundingClientRect();
      x = E.clientX - J.left, g = E.clientY - J.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", h), E.preventDefault();
    }
    function v(E) {
      var A;
      if (!b || !s.value) return;
      const N = s.value.getBoundingClientRect(), J = ((A = i.value) == null ? void 0 : A.w) ?? 300;
      let le = E.clientX - N.left - x, k = E.clientY - N.top - g;
      le = Math.max($t - J, Math.min(N.width - $t, le)), k = Math.max(0, Math.min(N.height - pt, k)), d(l.id, le, k);
    }
    function h() {
      b = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", h);
    }
    let y = !1, M = 0, K = 0, S = 0, D = 0;
    const L = B("");
    function R(E) {
      i.value.maximized || (n(l.id), y = !0, M = E.clientX, K = E.clientY, S = i.value.w, D = i.value.h, document.addEventListener("mousemove", P), document.addEventListener("mouseup", q), E.preventDefault(), E.stopPropagation());
    }
    function P(E) {
      if (!y) return;
      const N = Math.max(Dn, S + (E.clientX - M)), J = Math.max(Fn, D + (E.clientY - K));
      f(l.id, N, J), L.value = `${Math.round(N)}×${Math.round(J)}`;
    }
    function q() {
      y = !1, L.value = "", document.removeEventListener("mousemove", P), document.removeEventListener("mouseup", q), U.value++;
    }
    const U = B(0);
    V(Mt, () => {
      U.value++;
    }), Ue(() => {
      var E;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", h), document.removeEventListener("mousemove", P), document.removeEventListener("mouseup", q), (E = te.value) == null || E.removeEventListener("scroll", Y), W();
    });
    const te = B(null);
    function j(E) {
      if (l.canvas) return [];
      const N = E.children[0];
      return N ? Array.from(N.children) : [];
    }
    function Y() {
      const E = te.value, N = l.curvature ?? 0;
      if (!E) return;
      const J = j(E);
      if (!J.length) return;
      const le = E.clientHeight, k = le / 2, A = N * 38e-4;
      J.forEach((z) => {
        if (!z.dataset.origFs) {
          const _e = getComputedStyle(z);
          z.dataset.origFs = _e.fontSize, z.dataset.origLh = _e.lineHeight;
        }
        if (N === 0) {
          z.style.fontSize = "", z.style.lineHeight = "";
          return;
        }
        const ve = z.getBoundingClientRect(), he = E.getBoundingClientRect(), xe = ve.top - he.top + ve.height / 2, Ee = Math.min(1, Math.abs(xe - k) / (le / 2)), F = 1 + A * Math.cos(Ee * Math.PI / 2), $ = parseFloat(z.dataset.origFs), oe = z.dataset.origLh, ye = oe === "normal" ? $ * 1.4 : parseFloat(oe);
        isNaN($) || (z.style.fontSize = `${($ * F).toFixed(2)}px`), isNaN(ye) || (z.style.lineHeight = `${(ye * F).toFixed(2)}px`);
      });
    }
    function W() {
      const E = te.value;
      E && j(E).forEach((N) => {
        N.style.fontSize = "", N.style.lineHeight = "", delete N.dataset.origFs, delete N.dataset.origLh;
      });
    }
    V(() => l.curvature, (E) => {
      (E ?? 0) === 0 ? W() : Y();
    }), ze(() => {
      var E;
      (E = te.value) == null || E.addEventListener("scroll", Y, { passive: !0 }), ke(Y);
    });
    function Q() {
      u(l.id, !i.value.minimized), ke(() => {
        U.value++;
      });
    }
    function H() {
      c(l.id, !i.value.maximized), ke(() => {
        U.value++;
      });
    }
    function O() {
      a(l.id, !1);
    }
    function Z() {
      n(l.id);
    }
    return (E, N) => i.value && i.value.visible ? (ue(), fe("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: pl(["cc", { "cc-minimized": i.value.minimized, "cc-maximized": i.value.maximized, "cc-has-canvas": t.canvas }]),
      style: Se(w.value),
      onMousedown: Z
    }, [
      ne("div", {
        class: "cc-titlebar",
        onMousedown: m
      }, [
        N[0] || (N[0] = ne("span", { class: "cc-status-dot" }, null, -1)),
        ne("span", In, Ce(t.title), 1),
        L.value ? (ue(), fe("span", kn, Ce(L.value), 1)) : Te("", !0),
        ne("div", Ln, [
          ne("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: De(Q, ["stop"])
          }, "─"),
          ne("button", {
            class: "cc-btn cc-btn-max",
            title: i.value.maximized ? "Restore" : "Maximize",
            onClick: De(H, ["stop"])
          }, Ce(i.value.maximized ? "⤡" : "⤢"), 9, Rn),
          ne("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: De(O, ["stop"])
          }, "✕")
        ])
      ], 32),
      Vt(ne("div", En, [
        ne("div", {
          ref_key: "bodyEl",
          ref: te,
          class: "cc-screen",
          onScroll: Y
        }, [
          gt(E.$slots, "default", { resizeKey: U.value }, void 0, !0),
          N[1] || (N[1] = ne("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [wl, !i.value.minimized]
      ]),
      !i.value.minimized && !i.value.maximized ? (ue(), fe("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: De(R, ["stop"])
      }, null, 32)) : Te("", !0)
    ], 46, Tn)) : Te("", !0);
  }
}), Hn = /* @__PURE__ */ je(Bn, [["__scopeId", "data-v-d8a49f79"]]);
export {
  at as CANDLE_THEME_COLORS,
  Wn as CathodeCandle,
  Hn as CathodeContainer,
  An as CathodeGrid,
  Pl as CathodeLog,
  Yn as CathodeTerminal,
  Pn as CathodeWorkspace,
  ot as LOG_THEME_COLORS,
  zn as buildDefaultLayout,
  Ut as useCathodeLayout
};
