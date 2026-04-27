import { defineComponent as je, ref as L, reactive as Ne, computed as X, watch as ee, inject as ht, nextTick as Ce, onMounted as Fe, onUnmounted as Ge, openBlock as G, createElementBlock as Z, normalizeStyle as ve, createElementVNode as F, withModifiers as ye, withKeys as Et, createCommentVNode as ce, toDisplayString as se, provide as rt, renderSlot as Ve, createVNode as _t, Transition as Tt, withCtx as Ht, Fragment as Ft, renderList as $t, createTextVNode as Bt, normalizeClass as At, withDirectives as Wt, vShow as Pt } from "vue";
import * as re from "three";
const Me = {
  none: {
    bg: "rgba(17,24,39,0.82)",
    headerBg: "rgba(18,18,42,0.88)",
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
    bg: "#f6f6f6",
    headerBg: "#ffffff",
    text: "#222222",
    textHeader: "#158cba",
    border: "#dee2e6",
    accent: "#158cba",
    rowAlt: "rgba(21,140,186,0.04)"
  }
}, K = 30, st = 12, Ot = 10;
function ct(a, n) {
  const e = a.getContext("2d");
  if (!e) return;
  const c = a.width, E = a.height, x = Me[n.theme] ?? Me.none, { cols: R, rows: z, pinnedRows: C, rowHeight: p, scrollY: h, scrollX: P, glow: $ } = n;
  e.clearRect(0, 0, c, E), e.fillStyle = x.bg, e.fillRect(0, 0, c, E), e.save(), e.beginPath(), e.rect(0, 0, c, E), e.clip();
  const J = C.length * p, w = E - K - J;
  e.fillStyle = x.headerBg, e.fillRect(0, 0, c, K), e.textBaseline = "middle", e.textAlign = "left";
  let m = -P;
  for (let u = 0; u < R.length; u++) {
    const M = R[u];
    if (m + M.width <= 0) {
      m += M.width;
      continue;
    }
    if (m >= c) break;
    const D = !!n.colFilters[M.colId], S = n.sortColId === M.colId, k = (M.colDef.headerName ?? M.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(m, 0, M.width, K), e.clip(), e.font = `bold ${Ot}px system-ui, -apple-system, sans-serif`, e.fillStyle = D ? x.accent : x.textHeader, $ && (e.shadowBlur = 6, e.shadowColor = x.textHeader), e.fillText(k, m + 8, K / 2), e.shadowBlur = 0, S) {
      const g = e.measureText(k).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = x.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", m + 8 + g + 4, K / 2);
    }
    M.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = D ? x.accent : x.textHeader, e.globalAlpha = D ? 1 : 0.38, e.fillText("⌕", m + M.width - 20, K / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(m + M.width - 0.5, 0), e.lineTo(m + M.width - 0.5, K), e.stroke(), m += M.width;
  }
  e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, K - 0.5), e.lineTo(c, K - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, K, c, w), e.clip();
  const y = Math.max(0, Math.floor(h / p)), v = Math.min(z.length, Math.ceil((h + w) / p));
  for (let u = y; u < v; u++) {
    const M = z[u], D = K + u * p - h;
    u % 2 === 1 && (e.fillStyle = x.rowAlt, e.fillRect(0, D, c, p)), u === n.hoveredRow && u !== n.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, D, c, p)), u === n.selectedRow && (e.fillStyle = Xt(x.accent, 0.1), e.fillRect(0, D, c, p)), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, D + p - 0.5), e.lineTo(c, D + p - 0.5), e.stroke();
    let S = -P;
    for (let k = 0; k < R.length; k++) {
      const g = R[k];
      if (S + g.width <= 0) {
        S += g.width;
        continue;
      }
      if (S >= c) break;
      const _ = n.getCellStyle(g, M), Y = _.color ?? x.text, V = _.textAlign ?? "left", q = n.formatCell(g, M);
      e.save(), e.beginPath(), e.rect(S + 1, D, g.width - 2, p), e.clip(), e.font = `${st}px system-ui, -apple-system, sans-serif`, e.fillStyle = Y, e.textBaseline = "middle", $ && (e.shadowBlur = 4, e.shadowColor = Y), V === "right" ? (e.textAlign = "right", e.fillText(q, S + g.width - 8, D + p / 2)) : (e.textAlign = "left", e.fillText(q, S + 8, D + p / 2)), e.shadowBlur = 0, e.restore(), u === n.selectedRow && k === n.selectedCol && (e.strokeStyle = x.accent, e.lineWidth = 2, e.strokeRect(S + 1.5, D + 1.5, g.width - 3, p - 3)), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(S + g.width - 0.5, D), e.lineTo(S + g.width - 0.5, D + p), e.stroke(), S += g.width;
    }
  }
  if (e.restore(), C.length > 0) {
    const u = E - J;
    e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, u - 0.5), e.lineTo(c, u - 0.5), e.stroke();
    for (let M = 0; M < C.length; M++) {
      const D = C[M], S = u + M * p;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, S, c, p);
      let k = -P;
      for (let g = 0; g < R.length; g++) {
        const _ = R[g];
        if (k + _.width <= 0) {
          k += _.width;
          continue;
        }
        if (k >= c) break;
        const Y = n.getCellStyle(_, D), V = Y.color ?? x.text, q = Y.textAlign ?? "left", te = n.formatCell(_, D);
        e.save(), e.beginPath(), e.rect(k + 1, S, _.width - 2, p), e.clip(), e.font = `bold ${st}px system-ui, -apple-system, sans-serif`, e.fillStyle = V, e.textBaseline = "middle", q === "right" ? (e.textAlign = "right", e.fillText(te, k + _.width - 8, S + p / 2)) : (e.textAlign = "left", e.fillText(te, k + 8, S + p / 2)), e.restore(), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(k + _.width - 0.5, S), e.lineTo(k + _.width - 0.5, S + p), e.stroke(), k += _.width;
      }
      e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, S + p - 0.5), e.lineTo(c, S + p - 0.5), e.stroke();
    }
  }
  e.restore();
}
function Xt(a, n) {
  if (a.startsWith("rgba") || a.startsWith("rgb"))
    return a.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(a.slice(1, 3), 16), c = parseInt(a.slice(3, 5), 16), E = parseInt(a.slice(5, 7), 16);
  return `rgba(${e},${c},${E},${n})`;
}
function Ye(a, n) {
  let e = 0;
  for (let c = 0; c < a; c++) e += n[c].width;
  return e;
}
function Kt(a, n, e) {
  return a >= n + e - 24 && a < n + e;
}
function ut(a, n, e) {
  const c = n + e;
  return a >= c - 6 && a <= c + 1;
}
function dt(a, n, e, c, E, x, R, z, C) {
  const p = a + C;
  let h = -1, P = 0;
  for (let m = 0; m < e.length; m++) {
    if (p >= P && p < P + e[m].width) {
      h = m;
      break;
    }
    P += e[m].width;
  }
  if (n < K) return { area: "header", colIdx: h, rowIdx: -1 };
  const $ = z * E;
  if ($ > 0 && n >= R - $) {
    const m = Math.floor((n - (R - $)) / E);
    return { area: "pinned", colIdx: h, rowIdx: m };
  }
  const J = n - K + x, w = Math.floor(J / E);
  return w >= 0 && w < c ? { area: "body", colIdx: h, rowIdx: w } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const Nt = ["value"], Yt = ["disabled"], Vt = ["disabled"], Ut = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, qt = `
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
      float vign = 1.0 - dot(vc, vc) * 1.5;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`, jt = 28, Gt = 600, Zt = /* @__PURE__ */ je({
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
  setup(a, { emit: n }) {
    const e = a, c = n, E = L(e.rowData ?? []), x = L(e.pinnedBottomRowData ?? []), R = L(""), z = L(null), C = Ne({}), p = Ne({}), h = Ne(/* @__PURE__ */ new Set()), P = L(0), $ = L(0), J = L(0), w = L(0), m = L(0), y = L(-1), v = L(null), u = L(null), M = L({ x: 0, y: K }), D = L("");
    function S(t) {
      return t.colId ?? t.field ?? (t.headerName ? t.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const k = X(() => {
      const t = e.defaultColDef ?? {};
      return e.columnDefs.filter((l) => !h.has(S(l))).map((l) => {
        const o = S(l), i = { ...t, ...l };
        return { colId: o, colDef: i, width: p[o] ?? i.width ?? 100 };
      });
    }), g = X(() => {
      const t = $.value;
      if (!t) return k.value;
      const l = k.value.reduce((r, s) => r + s.width, 0);
      if (!l || l >= t) return k.value;
      const o = t / l;
      let i = 0;
      return k.value.map((r, s) => {
        const I = s === k.value.length - 1 ? t - i : Math.max(8, Math.round(r.width * o));
        return i += I, { ...r, width: I };
      });
    }), _ = X(() => {
      const t = g.value.reduce((l, o) => l + o.width, 0);
      return Math.max(0, t - $.value);
    }), Y = X(() => {
      const t = x.value.length * e.rowHeight;
      return Math.max(0, J.value - K - t);
    }), V = X(
      () => Math.max(0, T.value.length * e.rowHeight - Y.value)
    ), q = X(
      () => Math.max(1, Math.floor(Y.value / e.rowHeight))
    ), te = X(
      () => T.value.length === 0 ? 0 : Math.min(T.value.length - 1, Math.floor(w.value / e.rowHeight))
    ), Le = X(
      () => Math.min(T.value.length - 1, te.value + q.value - 1)
    );
    function Q(t, l) {
      if (l.colDef.valueGetter) return l.colDef.valueGetter({ data: t, colDef: l.colDef });
      if (l.colDef.field) return t[l.colDef.field];
    }
    function ue(t, l) {
      const o = Q(l, t);
      return t.colDef.valueFormatter ? t.colDef.valueFormatter({ value: o, data: l, colDef: t.colDef }) ?? "" : t.colDef.cellRenderer ? (t.colDef.cellRenderer({ value: o, data: l, colDef: t.colDef }) ?? "").replace(/<[^>]+>/g, "") : o == null ? "" : String(o);
    }
    function Ee(t, l) {
      return t.colDef.cellStyle ? typeof t.colDef.cellStyle == "function" ? t.colDef.cellStyle({ value: Q(l, t), data: l, colDef: t.colDef }) ?? {} : t.colDef.cellStyle : {};
    }
    const T = X(() => {
      P.value;
      let t = E.value;
      const l = R.value.trim().toLowerCase();
      l && (t = t.filter(
        (o) => k.value.some(
          (i) => String(Q(o, i) ?? "").toLowerCase().includes(l)
        )
      ));
      for (const [o, i] of Object.entries(C)) {
        if (!i) continue;
        const r = k.value.find((s) => s.colId === o);
        if (r)
          if (i.startsWith("__eq__")) {
            const s = i.slice(6).toLowerCase();
            t = t.filter((f) => String(Q(f, r) ?? "").toLowerCase() === s);
          } else {
            const s = i.toLowerCase();
            t = t.filter((f) => String(Q(f, r) ?? "").toLowerCase().includes(s));
          }
      }
      if (z.value) {
        const { colId: o, dir: i } = z.value, r = k.value.find((s) => s.colId === o);
        r && (t = [...t].sort((s, f) => {
          const I = Q(s, r), A = Q(f, r);
          let W = 0;
          return r.colDef.comparator ? W = r.colDef.comparator(I, A) : typeof I == "number" && typeof A == "number" ? W = I - A : W = String(I ?? "").localeCompare(String(A ?? ""), void 0, { numeric: !0 }), i === "asc" ? W : -W;
        }));
      }
      return t;
    });
    ee(T, () => {
      w.value = 0, v.value = null;
    }), ee(_, () => {
      m.value = Math.min(m.value, _.value);
    }), ee(V, () => {
      w.value = Math.min(w.value, V.value);
    });
    function Ae(t) {
      const l = t * e.rowHeight, o = l + e.rowHeight;
      l < w.value ? w.value = l : o > w.value + Y.value && (w.value = Math.min(V.value, o - Y.value));
    }
    function We() {
      w.value = Math.max(0, w.value - Y.value), j();
    }
    function d() {
      w.value = Math.min(V.value, w.value + Y.value), j();
    }
    let b = !1, O = "", le = 0, de = 0, ie = !1, U = !1, Se = 0, _e = 0, Te = 0, He = 0, ge = !1;
    function ke(t, l) {
      var o;
      b = !0, O = t, le = l, de = ((o = g.value.find((i) => i.colId === t)) == null ? void 0 : o.width) ?? 100, ie = !1;
    }
    function Ie(t) {
      if (U) {
        const s = Se - t.clientX, f = _e - t.clientY;
        (Math.abs(s) > 4 || Math.abs(f) > 4) && (ge = !0), m.value = Math.max(0, Math.min(_.value, Te + s)), w.value = Math.max(0, Math.min(V.value, He + f)), j();
        return;
      }
      if (!b) return;
      const l = $.value, o = Math.max(30, de + (t.clientX - le)), i = k.value.filter((s) => s.colId !== O).reduce((s, f) => s + f.width, 0), r = l - o;
      r > 10 && (p[O] = Math.max(10, Math.round(o * i / r))), j();
    }
    function ze() {
      U && (ge && (ie = !0), U = !1), b && (b = !1, ie = !0, c("column-resized"));
    }
    const ae = L(null), H = L(null), pt = ht("cathodeResetTick", L(0));
    ee(pt, () => xe());
    let B = null, fe = !1, Pe, Qe, he, pe, oe;
    function et() {
      if (!(!H.value || !ae.value)) {
        oe = document.createElement("canvas");
        try {
          B = new re.WebGLRenderer({ canvas: H.value, antialias: !1, alpha: !0 });
        } catch {
          fe = !0;
        }
        if (!fe && !B.getContext() && (B.dispose(), B = null, fe = !0), fe) {
          we();
          return;
        }
        B.setPixelRatio(1), B.setClearColor(0, 0), Pe = new re.Scene(), Qe = new re.OrthographicCamera(-1, 1, 1, -1, 0, 1), pe = new re.CanvasTexture(oe), pe.minFilter = re.LinearFilter, pe.magFilter = re.LinearFilter, he = new re.ShaderMaterial({
          uniforms: {
            uTex: { value: pe },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new re.Color(0) }
          },
          vertexShader: Ut,
          fragmentShader: qt,
          transparent: !0
        }), Pe.add(new re.Mesh(new re.PlaneGeometry(2, 2), he)), we();
      }
    }
    function we() {
      if (!ae.value || !B && !fe) return;
      const t = ae.value.clientWidth, l = ae.value.clientHeight - (e.pagination ? jt : 0);
      !t || !l || (oe.width = t, oe.height = l, $.value = t, J.value = l, m.value = Math.max(0, Math.min(_.value, m.value)), w.value = Math.max(0, Math.min(V.value, w.value)), B ? (B.setPixelRatio(window.devicePixelRatio || 1), B.setSize(t, l)) : H.value && (H.value.width = t, H.value.height = l, H.value.style.width = t + "px", H.value.style.height = l + "px"), j());
    }
    function j() {
      var o, i, r, s, f, I, A, W;
      if (!(oe != null && oe.width)) return;
      if (fe) {
        if (!H.value) return;
        ct(oe, {
          cols: g.value,
          rows: T.value,
          pinnedRows: x.value,
          rowHeight: e.rowHeight,
          scrollY: w.value,
          scrollX: m.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((o = z.value) == null ? void 0 : o.colId) ?? null,
          sortDir: ((i = z.value) == null ? void 0 : i.dir) ?? null,
          colFilters: C,
          hoveredRow: y.value,
          selectedRow: ((r = v.value) == null ? void 0 : r.row) ?? -1,
          selectedCol: ((s = v.value) == null ? void 0 : s.col) ?? -1,
          formatCell: ue,
          getCellStyle: Ee
        });
        const it = H.value.getContext("2d");
        it && it.drawImage(oe, 0, 0);
        return;
      }
      if (!B || !he || !pe) return;
      const t = Me[e.theme] ?? Me.none, l = e.theme === "paper";
      he.uniforms.uStrength.value = e.curvature / 45 * 0.55, he.uniforms.uScanlines.value = e.scanlines && !l ? 1 : 0, he.uniforms.uVignette.value = l ? 0 : 1, he.uniforms.uBezel.value.set(t.bg), ct(oe, {
        cols: g.value,
        rows: T.value,
        pinnedRows: x.value,
        rowHeight: e.rowHeight,
        scrollY: w.value,
        scrollX: m.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((f = z.value) == null ? void 0 : f.colId) ?? null,
        sortDir: ((I = z.value) == null ? void 0 : I.dir) ?? null,
        colFilters: C,
        hoveredRow: y.value,
        selectedRow: ((A = v.value) == null ? void 0 : A.row) ?? -1,
        selectedCol: ((W = v.value) == null ? void 0 : W.col) ?? -1,
        formatCell: ue,
        getCellStyle: Ee
      }), pe.needsUpdate = !0, B.render(Pe, Qe);
    }
    function Oe(t) {
      if (!H.value) return [-1, -1];
      const l = H.value.getBoundingClientRect();
      return [t.clientX - l.left, t.clientY - l.top];
    }
    let Xe = 0;
    function wt(t) {
      u.value = null;
      const l = Date.now();
      if (t.deltaX !== 0) {
        Xe = l, m.value = Math.max(0, Math.min(_.value, m.value + t.deltaX)), j();
        return;
      }
      if (t.shiftKey && t.deltaY !== 0) {
        Xe = l, m.value = Math.max(0, Math.min(_.value, m.value + t.deltaY)), j();
        return;
      }
      l - Xe < Gt || (w.value = Math.max(0, Math.min(V.value, w.value + t.deltaY)), j());
    }
    function xt(t) {
      if (b) return;
      const [l, o] = Oe(t);
      if (l < 0) {
        y.value = -1, j();
        return;
      }
      const i = dt(
        l,
        o,
        g.value,
        T.value.length,
        e.rowHeight,
        w.value,
        oe.height,
        x.value.length,
        m.value
      );
      if (y.value = i.area === "body" ? i.rowIdx : -1, i.area === "header" && i.colIdx >= 0) {
        const r = g.value[i.colIdx], s = Ye(i.colIdx, g.value), f = l + m.value;
        H.value.style.cursor = r && ut(f, s, r.width) ? "col-resize" : "pointer";
      } else i.area === "body" ? H.value.style.cursor = "pointer" : H.value.style.cursor = "default";
      j();
    }
    function bt() {
      y.value = -1, j();
    }
    function yt(t) {
      const [l, o] = Oe(t);
      if (l < 0) return;
      if (o >= K) {
        U = !0, ge = !1, Se = t.clientX, _e = t.clientY, Te = m.value, He = w.value;
        return;
      }
      const i = l + m.value;
      for (let r = 0; r < g.value.length; r++) {
        const s = g.value[r], f = Ye(r, g.value);
        if (s.colDef.resizable !== !1 && ut(i, f, s.width)) {
          ke(s.colId, t.clientX);
          return;
        }
      }
    }
    function Mt(t) {
      var r, s, f;
      if (ie) {
        ie = !1;
        return;
      }
      if (b) return;
      const [l, o] = Oe(t);
      if (l < 0) {
        u.value = null;
        return;
      }
      const i = dt(
        l,
        o,
        g.value,
        T.value.length,
        e.rowHeight,
        w.value,
        oe.height,
        x.value.length,
        m.value
      );
      if (i.area === "header" && i.colIdx >= 0) {
        const I = g.value[i.colIdx], A = Ye(i.colIdx, g.value), W = l + m.value;
        I.colDef.filter && Kt(W, A, I.width) ? (t.stopPropagation(), u.value === I.colId ? u.value = null : (u.value = I.colId, D.value = (r = C[I.colId]) != null && r.startsWith("__eq__") ? C[I.colId].slice(6) : C[I.colId] ?? "", M.value = { x: Math.max(0, A - m.value), y: K })) : I.colDef.sortable !== !1 && (u.value = null, z.value = ((s = z.value) == null ? void 0 : s.colId) === I.colId ? z.value.dir === "asc" ? { colId: I.colId, dir: "desc" } : null : { colId: I.colId, dir: "asc" }, c("sort-changed"));
        return;
      }
      if (u.value = null, i.area === "body" && i.rowIdx >= 0 && i.colIdx >= 0) {
        const I = i.rowIdx;
        v.value = { row: I, col: i.colIdx }, (f = H.value) == null || f.focus();
        const A = T.value[I], W = g.value[i.colIdx];
        A && W && (c("row-clicked", { data: A, event: t }), c("cell-selected", { data: A, row: I, col: i.colIdx, colId: W.colId }));
      }
    }
    function tt(t) {
      var l, o;
      u.value && ((o = (l = t.target).closest) != null && o.call(l, ".cathode-filter-popup") || (u.value = null));
    }
    function Ct(t) {
      var r;
      if (!$.value) return;
      let l = 0;
      for (let s = 0; s < t; s++) l += g.value[s].width;
      const o = ((r = g.value[t]) == null ? void 0 : r.width) ?? 0, i = l - m.value;
      i < 0 ? m.value = Math.max(0, l) : i + o > $.value && (m.value = Math.min(_.value, l + o - $.value));
    }
    function St(t) {
      var I;
      const l = g.value, o = l.length - 1, i = T.value.length - 1;
      if (!v.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(t.key) && (t.preventDefault(), v.value = { row: te.value, col: 0 });
        return;
      }
      let { row: r, col: s } = v.value;
      const f = (A, W) => {
        r = Math.max(0, Math.min(i, A)), s = Math.max(0, Math.min(o, W)), v.value = { row: r, col: s }, Ae(r), Ct(s);
      };
      switch (t.key) {
        case "ArrowDown":
          t.preventDefault(), f(r + 1, s);
          break;
        case "ArrowUp":
          t.preventDefault(), f(r - 1, s);
          break;
        case "ArrowRight":
          t.preventDefault(), s < o ? f(r, s + 1) : f(r + 1, 0);
          break;
        case "ArrowLeft":
          t.preventDefault(), s > 0 ? f(r, s - 1) : f(r - 1, o);
          break;
        case "Tab":
          t.preventDefault(), t.shiftKey ? s > 0 ? f(r, s - 1) : f(r - 1, o) : s < o ? f(r, s + 1) : f(r + 1, 0);
          break;
        case "Enter":
          t.preventDefault(), t.shiftKey ? f(r - 1, s) : f(r + 1, s);
          break;
        case "Home":
          t.preventDefault(), t.ctrlKey || t.metaKey ? f(0, 0) : f(r, 0);
          break;
        case "End":
          t.preventDefault(), t.ctrlKey || t.metaKey ? f(i, o) : f(r, o);
          break;
        case "PageDown":
          t.preventDefault(), f(Math.min(i, r + q.value), s);
          break;
        case "PageUp":
          t.preventDefault(), f(Math.max(0, r - q.value), s);
          break;
        case "Escape":
          v.value = null;
          break;
        case "c":
        case "C":
          if (t.ctrlKey || t.metaKey) {
            t.preventDefault();
            const A = T.value[r], W = l[s];
            A && W && ((I = navigator.clipboard) == null || I.writeText(ue(W, A)).catch(() => {
            }));
          }
          break;
      }
    }
    function kt(t) {
      const l = t.target.value;
      D.value = l, l ? C[u.value] = l : delete C[u.value], c("filter-changed");
    }
    function lt() {
      u.value && delete C[u.value], D.value = "", u.value = null, c("filter-changed");
    }
    const It = {
      setGridOption(t, l) {
        t === "rowData" ? E.value = l : t === "pinnedBottomRowData" ? x.value = l : t === "quickFilterText" && (R.value = l);
      },
      getColumnState() {
        return e.columnDefs.map((t) => {
          var o, i;
          const l = S(t);
          return {
            colId: l,
            hide: h.has(l),
            sort: ((o = z.value) == null ? void 0 : o.colId) === l ? z.value.dir : null,
            sortIndex: ((i = z.value) == null ? void 0 : i.colId) === l ? 0 : null,
            width: p[l] ?? t.width
          };
        });
      },
      applyColumnState({ state: t }) {
        for (const l of t)
          l.hide === !0 && h.add(l.colId), l.hide === !1 && h.delete(l.colId), l.sort && (z.value = { colId: l.colId, dir: l.sort }), l.width && (p[l.colId] = l.width);
      },
      setFilterModel(t) {
        for (const l of Object.keys(C)) delete C[l];
        if (t)
          for (const [l, o] of Object.entries(t))
            (o == null ? void 0 : o.type) === "equals" ? C[l] = `__eq__${o.filter}` : o != null && o.filter && (C[l] = o.filter);
      },
      getFilterModel() {
        const t = {};
        for (const [l, o] of Object.entries(C))
          o && (t[l] = o.startsWith("__eq__") ? { type: "equals", filter: o.slice(6) } : { type: "contains", filter: o });
        return t;
      },
      async setColumnFilterModel(t, l) {
        l ? l.type === "equals" ? C[t] = `__eq__${l.filter}` : C[t] = l.filter ?? "" : delete C[t];
      },
      onFilterChanged() {
      },
      refreshCells() {
        P.value++;
      },
      exportDataAsCsv({ fileName: t = "export.csv" } = {}) {
        const l = k.value, o = l.map((f) => f.colDef.headerName ?? f.colId).join(","), i = T.value.map(
          (f) => l.map((I) => `"${String(ue(I, f)).replace(/"/g, '""')}"`).join(",")
        ), r = new Blob([[o, ...i].join(`
`)], { type: "text/csv" }), s = URL.createObjectURL(r);
        Object.assign(document.createElement("a"), { href: s, download: t }).click(), URL.revokeObjectURL(s);
      },
      resize() {
        we();
      },
      resetColumnState() {
        h.clear();
        for (const l of e.columnDefs)
          l.hide && h.add(S(l));
        const t = e.columnDefs.find((l) => l.sort);
        z.value = t ? { colId: S(t), dir: t.sort } : null;
        for (const l of Object.keys(p)) delete p[l];
        for (const l of Object.keys(C)) delete C[l];
        R.value = "", w.value = 0, v.value = null, u.value = null;
      }
    };
    ee(
      [T, () => x.value, g, w, y, v],
      () => Ce(j)
    ), ee(() => e.theme, () => j()), ee(() => e.curvature, () => Ce(we)), ee(() => e.scanlines, () => j()), ee(() => e.glow, () => j()), ee(v, (t) => {
      if (!t) return;
      const l = T.value[t.row], o = g.value[t.col];
      l && o && c("cell-selected", { data: l, row: t.row, col: t.col, colId: o.colId });
    });
    let De = null, Re = null, Ke = 0;
    function xe() {
      cancelAnimationFrame(Ke), Ke = requestAnimationFrame(we);
    }
    function ot(t) {
      t.preventDefault();
    }
    function nt() {
      B == null || B.dispose(), B = null, fe = !1, et();
    }
    Fe(() => {
      for (const t of e.columnDefs)
        t.hide && h.add(S(t)), t.sort && !z.value && (z.value = { colId: S(t), dir: t.sort });
      E.value = e.rowData ?? [], x.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", tt), document.addEventListener("mousemove", Ie), document.addEventListener("mouseup", ze), Ce(() => {
        var t;
        et(), H.value && (H.value.addEventListener("webglcontextlost", ot), H.value.addEventListener("webglcontextrestored", nt)), ae.value && (De = new ResizeObserver(() => we()), De.observe(ae.value), Re = new IntersectionObserver((l) => {
          l.some((o) => o.isIntersecting) && xe();
        }), Re.observe(ae.value)), window.addEventListener("resize", xe), (t = window.visualViewport) == null || t.addEventListener("resize", xe), c("grid-ready", { api: It });
      });
    }), Ge(() => {
      var t, l, o;
      document.removeEventListener("click", tt, !0), document.removeEventListener("mousemove", Ie), document.removeEventListener("mouseup", ze), (t = H.value) == null || t.removeEventListener("webglcontextlost", ot), (l = H.value) == null || l.removeEventListener("webglcontextrestored", nt), De == null || De.disconnect(), Re == null || Re.disconnect(), window.removeEventListener("resize", xe), (o = window.visualViewport) == null || o.removeEventListener("resize", xe), cancelAnimationFrame(Ke), B == null || B.dispose();
    });
    const ne = X(() => Me[e.theme] ?? Me.none), zt = X(() => ({
      position: "absolute",
      left: `${M.value.x}px`,
      top: `${M.value.y}px`,
      zIndex: 100,
      background: ne.value.headerBg,
      border: `1px solid ${ne.value.accent}`,
      color: ne.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Dt = X(() => ({
      background: ne.value.bg,
      border: `1px solid ${ne.value.border}`,
      color: ne.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Rt = X(() => ({
      background: ne.value.headerBg,
      borderTop: `1px solid ${ne.value.border}`,
      color: ne.value.text
    })), Lt = X(() => ({
      background: ne.value.bg
    })), at = X(() => ne.value.accent);
    return (t, l) => {
      var o, i;
      return G(), Z("div", {
        ref_key: "wrapEl",
        ref: ae,
        class: "cathode-wrap",
        style: ve(Lt.value)
      }, [
        F("canvas", {
          ref_key: "canvasEl",
          ref: H,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: ye(wt, ["prevent"]),
          onMousemove: xt,
          onMouseleave: bt,
          onMousedown: yt,
          onClick: Mt,
          onKeydown: St
        }, null, 544),
        u.value ? (G(), Z("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: ve(zt.value),
          onClick: l[0] || (l[0] = ye(() => {
          }, ["stop"]))
        }, [
          F("input", {
            style: ve(Dt.value),
            value: D.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: kt,
            onKeydown: Et(lt, ["escape"])
          }, null, 44, Nt),
          D.value ? (G(), Z("button", {
            key: 0,
            style: ve({
              background: "none",
              border: "none",
              color: ne.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: lt
          }, "✕", 4)) : ce("", !0)
        ], 4)) : ce("", !0),
        a.pagination ? (G(), Z("div", {
          key: 1,
          class: "cathode-pagination",
          style: ve(Rt.value)
        }, [
          F("button", {
            disabled: w.value <= 0,
            onClick: l[1] || (l[1] = (r) => We())
          }, "◀", 8, Yt),
          F("span", null, se((te.value + 1).toLocaleString()) + "–" + se(Math.min(T.value.length, Le.value + 1).toLocaleString()) + " / " + se(T.value.length.toLocaleString()), 1),
          F("button", {
            disabled: w.value >= V.value,
            onClick: l[2] || (l[2] = (r) => d())
          }, "▶", 8, Vt),
          F("span", {
            class: "cathode-page-info",
            style: ve({ color: at.value })
          }, se(T.value.length.toLocaleString()) + " rows ", 5),
          v.value ? (G(), Z("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: ve({ color: at.value })
          }, se(((o = g.value[v.value.col]) == null ? void 0 : o.colDef.headerName) ?? ((i = g.value[v.value.col]) == null ? void 0 : i.colId)) + " : " + se(ue(g.value[v.value.col], T.value[v.value.row])), 5)) : ce("", !0)
        ], 4)) : ce("", !0)
      ], 4);
    };
  }
}), Ze = (a, n) => {
  const e = a.__vccOpts || a;
  for (const [c, E] of n)
    e[c] = E;
  return e;
}, bl = /* @__PURE__ */ Ze(Zt, [["__scopeId", "data-v-0a5d018b"]]), Je = L(0), Ue = 28, be = 12;
let qe = 10, $e = "cathode.layout", Be = !1;
const N = L({});
function Jt(a, n = "cathode.layout") {
  if (!Be) {
    Be = !0, $e = n;
    try {
      const e = localStorage.getItem($e);
      if (e) {
        N.value = JSON.parse(e), vt();
        return;
      }
    } catch {
    }
    N.value = { ...a }, vt();
  }
}
function vt() {
  let a = 10;
  for (const n of Object.values(N.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > a && (a = n.zIndex);
  qe = a;
}
function me() {
  localStorage.setItem($e, JSON.stringify(N.value));
}
function Qt(a) {
  Be = !1, localStorage.removeItem($e), N.value = { ...a }, me(), Be = !0, Je.value++;
}
function mt(a) {
  qe++, N.value[a] && (N.value[a].zIndex = qe);
}
function el(a, n) {
  N.value[a].visible = n, me();
}
function tl(a, n) {
  N.value[a].minimized = n, n && (N.value[a].maximized = !1), me();
}
function ll(a, n) {
  N.value[a].maximized = n, n && (N.value[a].minimized = !1, mt(a)), me();
}
function ol(a, n, e) {
  N.value[a].x = Math.round(n), N.value[a].y = Math.round(e), me();
}
function nl(a, n, e) {
  N.value[a].w = Math.round(n), N.value[a].h = Math.round(e), me();
}
function yl(a, n, e) {
  const c = Math.ceil(Math.sqrt(e.length)), E = Math.ceil(e.length / c), x = Math.floor((a - be * (c + 1)) / c), R = Math.floor((n - be * (E + 1)) / E), z = {};
  return e.forEach((C, p) => {
    const h = p % c, P = Math.floor(p / c);
    z[C] = {
      x: be + h * (x + be),
      y: be + P * (R + be),
      w: x,
      h: R,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: p + 1
    };
  }), z;
}
function gt() {
  return {
    containers: N,
    TITLEBAR_H: Ue,
    load: Jt,
    save: me,
    reset: Qt,
    bringToFront: mt,
    setVisible: el,
    setMinimized: tl,
    setMaximized: ll,
    updatePos: ol,
    updateSize: nl
  };
}
const al = { class: "ws-toolbar" }, il = {
  key: 0,
  class: "ws-restore-menu"
}, rl = {
  key: 0,
  class: "ws-restore-empty"
}, sl = ["onClick"], cl = /* @__PURE__ */ je({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(a) {
    const n = a, { containers: e, load: c, reset: E, setVisible: x } = gt(), R = L(null);
    rt("cathodeWorkspace", R), rt("cathodeResetTick", Je), Fe(() => {
      if (!R.value) return;
      const { clientWidth: y, clientHeight: v } = R.value, u = n.initialLayout ?? {};
      c(u, n.storageKey ?? "cathode.layout");
      const M = Object.keys(e.value)[0];
      M && z(M);
    });
    function z(y) {
      var u;
      document.querySelectorAll(".cc").forEach((M) => M.classList.remove("cc-focused"));
      const v = (u = R.value) == null ? void 0 : u.querySelector(`#cc-${y}`);
      v && v.classList.add("cc-focused");
    }
    function C() {
      !R.value || !n.initialLayout || E(n.initialLayout);
    }
    function p(y) {
      const v = y.target.closest(".cc");
      v && (document.querySelectorAll(".cc").forEach((u) => u.classList.remove("cc-focused")), v.classList.add("cc-focused"));
    }
    const h = L(!1), P = () => Object.entries(e.value).filter(([, y]) => !y.visible).map(([y]) => y);
    function $(y) {
      x(y, !0), h.value = !1;
    }
    function J(y) {
      if (!h.value) return;
      const v = y.target;
      !v.closest(".ws-restore-menu") && !v.closest(".ws-btn-restore") && (h.value = !1);
    }
    function w(y) {
      y.key === "Escape" && (h.value = !1);
    }
    Fe(() => {
      document.addEventListener("click", J), document.addEventListener("keydown", w);
    }), Ge(() => {
      document.removeEventListener("click", J), document.removeEventListener("keydown", w);
    });
    function m(y) {
      var v;
      return ((v = n.containerTitles) == null ? void 0 : v[y]) ?? y;
    }
    return (y, v) => (G(), Z("div", {
      ref_key: "workspaceEl",
      ref: R,
      class: "cathode-workspace",
      onMousedown: p
    }, [
      Ve(y.$slots, "default", {}, void 0, !0),
      Ve(y.$slots, "overlay", {}, void 0, !0),
      F("div", al, [
        a.initialLayout ? (G(), Z("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: C
        }, " ↺ Reset Layout ")) : ce("", !0),
        v[1] || (v[1] = F("div", { class: "ws-sep" }, null, -1)),
        F("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: v[0] || (v[0] = (u) => h.value = !h.value)
        }, " ⊞ Restore Panel ")
      ]),
      _t(Tt, { name: "menu" }, {
        default: Ht(() => [
          h.value ? (G(), Z("div", il, [
            v[3] || (v[3] = F("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            P().length ? ce("", !0) : (G(), Z("div", rl, " No closed panels ")),
            (G(!0), Z(Ft, null, $t(P(), (u) => (G(), Z("div", {
              key: u,
              class: "ws-restore-item",
              onClick: (M) => $(u)
            }, [
              v[2] || (v[2] = F("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Bt(" " + se(m(u)), 1)
            ], 8, sl))), 128))
          ])) : ce("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Ml = /* @__PURE__ */ Ze(cl, [["__scopeId", "data-v-5838d04b"]]), ul = ["id"], dl = { class: "cc-title" }, vl = {
  key: 0,
  class: "cc-size-badge"
}, fl = { class: "cc-controls" }, hl = ["title"], ml = { class: "cc-body" }, gl = 200, pl = 80, ft = 60, wl = /* @__PURE__ */ je({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(a) {
    const n = a, { containers: e, bringToFront: c, setVisible: E, setMinimized: x, setMaximized: R, updatePos: z, updateSize: C } = gt(), p = ht("cathodeWorkspace", L(null)), h = X(() => e.value[n.id]), P = X(() => {
      const d = h.value, b = n.curvature ?? 0;
      if (!d) return {};
      const O = { "--curvature": b };
      return d.maximized ? { ...O, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: d.zIndex } : {
        ...O,
        left: d.x + "px",
        top: d.y + "px",
        width: d.w + "px",
        height: d.minimized ? Ue + "px" : d.h + "px",
        zIndex: d.zIndex,
        display: d.visible ? "flex" : "none"
      };
    });
    let $ = !1, J = 0, w = 0;
    function m(d) {
      var le;
      if (d.target.closest(".cc-btn") || h.value.maximized) return;
      c(n.id), $ = !0;
      const b = (le = p.value) == null ? void 0 : le.querySelector(`#cc-${n.id}`);
      if (!b) return;
      const O = b.getBoundingClientRect();
      J = d.clientX - O.left, w = d.clientY - O.top, document.addEventListener("mousemove", y), document.addEventListener("mouseup", v), d.preventDefault();
    }
    function y(d) {
      var ie;
      if (!$ || !p.value) return;
      const b = p.value.getBoundingClientRect(), O = ((ie = h.value) == null ? void 0 : ie.w) ?? 300;
      let le = d.clientX - b.left - J, de = d.clientY - b.top - w;
      le = Math.max(ft - O, Math.min(b.width - ft, le)), de = Math.max(0, Math.min(b.height - Ue, de)), z(n.id, le, de);
    }
    function v() {
      $ = !1, document.removeEventListener("mousemove", y), document.removeEventListener("mouseup", v);
    }
    let u = !1, M = 0, D = 0, S = 0, k = 0;
    const g = L("");
    function _(d) {
      h.value.maximized || (c(n.id), u = !0, M = d.clientX, D = d.clientY, S = h.value.w, k = h.value.h, document.addEventListener("mousemove", Y), document.addEventListener("mouseup", V), d.preventDefault(), d.stopPropagation());
    }
    function Y(d) {
      if (!u) return;
      const b = Math.max(gl, S + (d.clientX - M)), O = Math.max(pl, k + (d.clientY - D));
      C(n.id, b, O), g.value = `${Math.round(b)}×${Math.round(O)}`;
    }
    function V() {
      u = !1, g.value = "", document.removeEventListener("mousemove", Y), document.removeEventListener("mouseup", V), q.value++;
    }
    const q = L(0);
    ee(Je, () => {
      q.value++;
    }), ee(() => n.curvature, () => {
      q.value++;
    }), Ge(() => {
      var d;
      document.removeEventListener("mousemove", y), document.removeEventListener("mouseup", v), document.removeEventListener("mousemove", Y), document.removeEventListener("mouseup", V), (d = te.value) == null || d.removeEventListener("scroll", Q), ue();
    });
    const te = L(null);
    function Le(d) {
      if (n.canvas) return [];
      const b = d.children[0];
      return b ? Array.from(b.children) : [];
    }
    function Q() {
      const d = te.value, b = n.curvature ?? 0;
      if (!d) return;
      const O = Le(d);
      if (!O.length) return;
      const le = d.clientHeight, de = le / 2, ie = b * 38e-4;
      O.forEach((U) => {
        if (!U.dataset.origFs) {
          const ae = getComputedStyle(U);
          U.dataset.origFs = ae.fontSize, U.dataset.origLh = ae.lineHeight;
        }
        if (b === 0) {
          U.style.fontSize = "", U.style.lineHeight = "";
          return;
        }
        const Se = U.getBoundingClientRect(), _e = d.getBoundingClientRect(), Te = Se.top - _e.top + Se.height / 2, He = Math.min(1, Math.abs(Te - de) / (le / 2)), ge = 1 + ie * Math.cos(He * Math.PI / 2), ke = parseFloat(U.dataset.origFs), Ie = U.dataset.origLh, ze = Ie === "normal" ? ke * 1.4 : parseFloat(Ie);
        isNaN(ke) || (U.style.fontSize = `${(ke * ge).toFixed(2)}px`), isNaN(ze) || (U.style.lineHeight = `${(ze * ge).toFixed(2)}px`);
      });
    }
    function ue() {
      const d = te.value;
      d && Le(d).forEach((b) => {
        b.style.fontSize = "", b.style.lineHeight = "", delete b.dataset.origFs, delete b.dataset.origLh;
      });
    }
    ee(() => n.curvature, (d) => {
      (d ?? 0) === 0 ? ue() : Q();
    }), Fe(() => {
      var d;
      (d = te.value) == null || d.addEventListener("scroll", Q, { passive: !0 }), Ce(Q);
    });
    function Ee() {
      x(n.id, !h.value.minimized), Ce(() => {
        q.value++;
      });
    }
    function T() {
      R(n.id, !h.value.maximized), Ce(() => {
        q.value++;
      });
    }
    function Ae() {
      E(n.id, !1);
    }
    function We() {
      c(n.id);
    }
    return (d, b) => h.value && h.value.visible ? (G(), Z("div", {
      key: 0,
      id: `cc-${a.id}`,
      class: At(["cc", { "cc-minimized": h.value.minimized, "cc-maximized": h.value.maximized, "cc-has-canvas": a.canvas }]),
      style: ve(P.value),
      onMousedown: We
    }, [
      F("div", {
        class: "cc-titlebar",
        onMousedown: m
      }, [
        b[0] || (b[0] = F("span", { class: "cc-status-dot" }, null, -1)),
        F("span", dl, se(a.title), 1),
        g.value ? (G(), Z("span", vl, se(g.value), 1)) : ce("", !0),
        F("div", fl, [
          F("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: ye(Ee, ["stop"])
          }, "─"),
          F("button", {
            class: "cc-btn cc-btn-max",
            title: h.value.maximized ? "Restore" : "Maximize",
            onClick: ye(T, ["stop"])
          }, se(h.value.maximized ? "⤡" : "⤢"), 9, hl),
          F("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: ye(Ae, ["stop"])
          }, "✕")
        ])
      ], 32),
      Wt(F("div", ml, [
        F("div", {
          ref_key: "bodyEl",
          ref: te,
          class: "cc-screen",
          onScroll: Q
        }, [
          Ve(d.$slots, "default", { resizeKey: q.value }, void 0, !0),
          b[1] || (b[1] = F("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Pt, !h.value.minimized]
      ]),
      !h.value.minimized && !h.value.maximized ? (G(), Z("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: ye(_, ["stop"])
      }, null, 32)) : ce("", !0)
    ], 46, ul)) : ce("", !0);
  }
}), Cl = /* @__PURE__ */ Ze(wl, [["__scopeId", "data-v-a6501b86"]]);
export {
  Cl as CathodeContainer,
  bl as CathodeGrid,
  Ml as CathodeWorkspace,
  yl as buildDefaultLayout,
  gt as useCathodeLayout
};
