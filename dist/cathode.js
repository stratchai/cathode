import { defineComponent as je, ref as L, reactive as Ne, computed as X, watch as le, inject as ht, nextTick as Me, onMounted as He, onUnmounted as Ge, openBlock as Z, createElementBlock as J, normalizeStyle as he, createElementVNode as H, withModifiers as ye, withKeys as Et, createCommentVNode as ue, toDisplayString as ce, provide as rt, renderSlot as Ve, createVNode as _t, Transition as Tt, withCtx as Ft, Fragment as Ht, renderList as $t, createTextVNode as Bt, normalizeClass as At, withDirectives as Wt, vShow as Pt } from "vue";
import * as te from "three";
const Ce = {
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
  const c = a.width, E = a.height, x = Ce[n.theme] ?? Ce.none, { cols: R, rows: z, pinnedRows: M, rowHeight: p, scrollY: h, scrollX: P, glow: $ } = n;
  e.clearRect(0, 0, c, E), e.fillStyle = x.bg, e.fillRect(0, 0, c, E), e.save(), e.beginPath(), e.rect(0, 0, c, E), e.clip();
  const Q = M.length * p, w = E - K - Q;
  e.fillStyle = x.headerBg, e.fillRect(0, 0, c, K), e.textBaseline = "middle", e.textAlign = "left";
  let m = -P;
  for (let u = 0; u < R.length; u++) {
    const C = R[u];
    if (m + C.width <= 0) {
      m += C.width;
      continue;
    }
    if (m >= c) break;
    const D = !!n.colFilters[C.colId], S = n.sortColId === C.colId, k = (C.colDef.headerName ?? C.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(m, 0, C.width, K), e.clip(), e.font = `bold ${Ot}px system-ui, -apple-system, sans-serif`, e.fillStyle = D ? x.accent : x.textHeader, $ && (e.shadowBlur = 6, e.shadowColor = x.textHeader), e.fillText(k, m + 8, K / 2), e.shadowBlur = 0, S) {
      const g = e.measureText(k).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = x.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", m + 8 + g + 4, K / 2);
    }
    C.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = D ? x.accent : x.textHeader, e.globalAlpha = D ? 1 : 0.38, e.fillText("⌕", m + C.width - 20, K / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(m + C.width - 0.5, 0), e.lineTo(m + C.width - 0.5, K), e.stroke(), m += C.width;
  }
  e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, K - 0.5), e.lineTo(c, K - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, K, c, w), e.clip();
  const y = Math.max(0, Math.floor(h / p)), v = Math.min(z.length, Math.ceil((h + w) / p));
  for (let u = y; u < v; u++) {
    const C = z[u], D = K + u * p - h;
    u % 2 === 1 && (e.fillStyle = x.rowAlt, e.fillRect(0, D, c, p)), u === n.hoveredRow && u !== n.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, D, c, p)), u === n.selectedRow && (e.fillStyle = Xt(x.accent, 0.1), e.fillRect(0, D, c, p)), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, D + p - 0.5), e.lineTo(c, D + p - 0.5), e.stroke();
    let S = -P;
    for (let k = 0; k < R.length; k++) {
      const g = R[k];
      if (S + g.width <= 0) {
        S += g.width;
        continue;
      }
      if (S >= c) break;
      const _ = n.getCellStyle(g, C), Y = _.color ?? x.text, V = _.textAlign ?? "left", q = n.formatCell(g, C);
      e.save(), e.beginPath(), e.rect(S + 1, D, g.width - 2, p), e.clip(), e.font = `${st}px system-ui, -apple-system, sans-serif`, e.fillStyle = Y, e.textBaseline = "middle", $ && (e.shadowBlur = 4, e.shadowColor = Y), V === "right" ? (e.textAlign = "right", e.fillText(q, S + g.width - 8, D + p / 2)) : (e.textAlign = "left", e.fillText(q, S + 8, D + p / 2)), e.shadowBlur = 0, e.restore(), u === n.selectedRow && k === n.selectedCol && (e.strokeStyle = x.accent, e.lineWidth = 2, e.strokeRect(S + 1.5, D + 1.5, g.width - 3, p - 3)), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(S + g.width - 0.5, D), e.lineTo(S + g.width - 0.5, D + p), e.stroke(), S += g.width;
    }
  }
  if (e.restore(), M.length > 0) {
    const u = E - Q;
    e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, u - 0.5), e.lineTo(c, u - 0.5), e.stroke();
    for (let C = 0; C < M.length; C++) {
      const D = M[C], S = u + C * p;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, S, c, p);
      let k = -P;
      for (let g = 0; g < R.length; g++) {
        const _ = R[g];
        if (k + _.width <= 0) {
          k += _.width;
          continue;
        }
        if (k >= c) break;
        const Y = n.getCellStyle(_, D), V = Y.color ?? x.text, q = Y.textAlign ?? "left", oe = n.formatCell(_, D);
        e.save(), e.beginPath(), e.rect(k + 1, S, _.width - 2, p), e.clip(), e.font = `bold ${st}px system-ui, -apple-system, sans-serif`, e.fillStyle = V, e.textBaseline = "middle", q === "right" ? (e.textAlign = "right", e.fillText(oe, k + _.width - 8, S + p / 2)) : (e.textAlign = "left", e.fillText(oe, k + 8, S + p / 2)), e.restore(), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(k + _.width - 0.5, S), e.lineTo(k + _.width - 0.5, S + p), e.stroke(), k += _.width;
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
function dt(a, n, e, c, E, x, R, z, M) {
  const p = a + M;
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
  const Q = n - K + x, w = Math.floor(Q / E);
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
    const e = a, c = n, E = L(e.rowData ?? []), x = L(e.pinnedBottomRowData ?? []), R = L(""), z = L(null), M = Ne({}), p = Ne({}), h = Ne(/* @__PURE__ */ new Set()), P = L(0), $ = L(0), Q = L(0), w = L(0), m = L(0), y = L(-1), v = L(null), u = L(null), C = L({ x: 0, y: K }), D = L("");
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
      return Math.max(0, Q.value - K - t);
    }), V = X(
      () => Math.max(0, T.value.length * e.rowHeight - Y.value)
    ), q = X(
      () => Math.max(1, Math.floor(Y.value / e.rowHeight))
    ), oe = X(
      () => T.value.length === 0 ? 0 : Math.min(T.value.length - 1, Math.floor(w.value / e.rowHeight))
    ), Le = X(
      () => Math.min(T.value.length - 1, oe.value + q.value - 1)
    );
    function ee(t, l) {
      if (l.colDef.valueGetter) return l.colDef.valueGetter({ data: t, colDef: l.colDef });
      if (l.colDef.field) return t[l.colDef.field];
    }
    function ve(t, l) {
      const o = ee(l, t);
      return t.colDef.valueFormatter ? t.colDef.valueFormatter({ value: o, data: l, colDef: t.colDef }) ?? "" : t.colDef.cellRenderer ? (t.colDef.cellRenderer({ value: o, data: l, colDef: t.colDef }) ?? "").replace(/<[^>]+>/g, "") : o == null ? "" : String(o);
    }
    function Ee(t, l) {
      return t.colDef.cellStyle ? typeof t.colDef.cellStyle == "function" ? t.colDef.cellStyle({ value: ee(l, t), data: l, colDef: t.colDef }) ?? {} : t.colDef.cellStyle : {};
    }
    const T = X(() => {
      P.value;
      let t = E.value;
      const l = R.value.trim().toLowerCase();
      l && (t = t.filter(
        (o) => k.value.some(
          (i) => String(ee(o, i) ?? "").toLowerCase().includes(l)
        )
      ));
      for (const [o, i] of Object.entries(M)) {
        if (!i) continue;
        const r = k.value.find((s) => s.colId === o);
        if (r)
          if (i.startsWith("__eq__")) {
            const s = i.slice(6).toLowerCase();
            t = t.filter((f) => String(ee(f, r) ?? "").toLowerCase() === s);
          } else {
            const s = i.toLowerCase();
            t = t.filter((f) => String(ee(f, r) ?? "").toLowerCase().includes(s));
          }
      }
      if (z.value) {
        const { colId: o, dir: i } = z.value, r = k.value.find((s) => s.colId === o);
        r && (t = [...t].sort((s, f) => {
          const I = ee(s, r), A = ee(f, r);
          let W = 0;
          return r.colDef.comparator ? W = r.colDef.comparator(I, A) : typeof I == "number" && typeof A == "number" ? W = I - A : W = String(I ?? "").localeCompare(String(A ?? ""), void 0, { numeric: !0 }), i === "asc" ? W : -W;
        }));
      }
      return t;
    });
    le(T, () => {
      w.value = 0, v.value = null;
    }), le(_, () => {
      m.value = Math.min(m.value, _.value);
    }), le(V, () => {
      w.value = Math.min(w.value, V.value);
    });
    function Ae(t) {
      const l = t * e.rowHeight, o = l + e.rowHeight;
      l < w.value ? w.value = l : o > w.value + Y.value && (w.value = Math.min(V.value, o - Y.value));
    }
    function We() {
      w.value = Math.max(0, w.value - Y.value), G();
    }
    function d() {
      w.value = Math.min(V.value, w.value + Y.value), G();
    }
    let b = !1, O = "", ne = 0, fe = 0, se = !1, U = !1, Se = 0, _e = 0, Te = 0, Fe = 0, pe = !1;
    function ke(t, l) {
      var o;
      b = !0, O = t, ne = l, fe = ((o = g.value.find((i) => i.colId === t)) == null ? void 0 : o.width) ?? 100, se = !1;
    }
    function Ie(t) {
      if (U) {
        const s = Se - t.clientX, f = _e - t.clientY;
        (Math.abs(s) > 4 || Math.abs(f) > 4) && (pe = !0), m.value = Math.max(0, Math.min(_.value, Te + s)), w.value = Math.max(0, Math.min(V.value, Fe + f)), G();
        return;
      }
      if (!b) return;
      const l = $.value, o = Math.max(30, fe + (t.clientX - ne)), i = k.value.filter((s) => s.colId !== O).reduce((s, f) => s + f.width, 0), r = l - o;
      r > 10 && (p[O] = Math.max(10, Math.round(o * i / r))), G();
    }
    function ze() {
      U && (pe && (se = !0), U = !1), b && (b = !1, se = !0, c("column-resized"));
    }
    const re = L(null), F = L(null), pt = ht("cathodeResetTick", L(0));
    le(pt, () => xe());
    let B = null, me = !1, Pe, Qe, de, ae, j;
    function et() {
      if (!(!F.value || !re.value)) {
        j = document.createElement("canvas");
        try {
          B = new te.WebGLRenderer({ canvas: F.value, antialias: !1, alpha: !0 });
        } catch {
          me = !0;
        }
        if (!me && !B.getContext() && (B.dispose(), B = null, me = !0), me) {
          we();
          return;
        }
        B.setPixelRatio(1), B.setClearColor(0, 0), Pe = new te.Scene(), Qe = new te.OrthographicCamera(-1, 1, 1, -1, 0, 1), ae = new te.CanvasTexture(j), ae.minFilter = te.LinearFilter, ae.magFilter = te.LinearFilter, de = new te.ShaderMaterial({
          uniforms: {
            uTex: { value: ae },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new te.Color(0) }
          },
          vertexShader: Ut,
          fragmentShader: qt,
          transparent: !0
        }), Pe.add(new te.Mesh(new te.PlaneGeometry(2, 2), de)), we();
      }
    }
    function we() {
      if (!re.value || !B && !me) return;
      const t = re.value.clientWidth, l = re.value.clientHeight - (e.pagination ? jt : 0);
      if (!t || !l) return;
      const o = j.width !== t || j.height !== l;
      j.width = t, j.height = l, $.value = t, Q.value = l, m.value = Math.max(0, Math.min(_.value, m.value)), w.value = Math.max(0, Math.min(V.value, w.value)), B ? (o && ae && (ae.dispose(), ae = new te.CanvasTexture(j), ae.minFilter = te.LinearFilter, ae.magFilter = te.LinearFilter, de && (de.uniforms.uTex.value = ae)), B.setPixelRatio(window.devicePixelRatio || 1), B.setSize(t, l)) : F.value && (F.value.width = t, F.value.height = l, F.value.style.width = t + "px", F.value.style.height = l + "px"), G();
    }
    function G() {
      var o, i, r, s, f, I, A, W;
      if (!(j != null && j.width)) return;
      if (me) {
        if (!F.value) return;
        ct(j, {
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
          colFilters: M,
          hoveredRow: y.value,
          selectedRow: ((r = v.value) == null ? void 0 : r.row) ?? -1,
          selectedCol: ((s = v.value) == null ? void 0 : s.col) ?? -1,
          formatCell: ve,
          getCellStyle: Ee
        });
        const it = F.value.getContext("2d");
        it && it.drawImage(j, 0, 0);
        return;
      }
      if (!B || !de || !ae) return;
      const t = Ce[e.theme] ?? Ce.none, l = e.theme === "paper";
      de.uniforms.uStrength.value = e.curvature / 45 * 0.55, de.uniforms.uScanlines.value = e.scanlines && !l ? 1 : 0, de.uniforms.uVignette.value = l ? 0 : 1, de.uniforms.uBezel.value.set(t.bg), ct(j, {
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
        colFilters: M,
        hoveredRow: y.value,
        selectedRow: ((A = v.value) == null ? void 0 : A.row) ?? -1,
        selectedCol: ((W = v.value) == null ? void 0 : W.col) ?? -1,
        formatCell: ve,
        getCellStyle: Ee
      }), ae.needsUpdate = !0, B.render(Pe, Qe);
    }
    function Oe(t) {
      if (!F.value) return [-1, -1];
      const l = F.value.getBoundingClientRect();
      return [t.clientX - l.left, t.clientY - l.top];
    }
    let Xe = 0;
    function wt(t) {
      u.value = null;
      const l = Date.now();
      if (t.deltaX !== 0) {
        Xe = l, m.value = Math.max(0, Math.min(_.value, m.value + t.deltaX)), G();
        return;
      }
      if (t.shiftKey && t.deltaY !== 0) {
        Xe = l, m.value = Math.max(0, Math.min(_.value, m.value + t.deltaY)), G();
        return;
      }
      l - Xe < Gt || (w.value = Math.max(0, Math.min(V.value, w.value + t.deltaY)), G());
    }
    function xt(t) {
      if (b) return;
      const [l, o] = Oe(t);
      if (l < 0) {
        y.value = -1, G();
        return;
      }
      const i = dt(
        l,
        o,
        g.value,
        T.value.length,
        e.rowHeight,
        w.value,
        j.height,
        x.value.length,
        m.value
      );
      if (y.value = i.area === "body" ? i.rowIdx : -1, i.area === "header" && i.colIdx >= 0) {
        const r = g.value[i.colIdx], s = Ye(i.colIdx, g.value), f = l + m.value;
        F.value.style.cursor = r && ut(f, s, r.width) ? "col-resize" : "pointer";
      } else i.area === "body" ? F.value.style.cursor = "pointer" : F.value.style.cursor = "default";
      G();
    }
    function bt() {
      y.value = -1, G();
    }
    function yt(t) {
      const [l, o] = Oe(t);
      if (l < 0) return;
      if (o >= K) {
        U = !0, pe = !1, Se = t.clientX, _e = t.clientY, Te = m.value, Fe = w.value;
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
    function Ct(t) {
      var r, s, f;
      if (se) {
        se = !1;
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
        j.height,
        x.value.length,
        m.value
      );
      if (i.area === "header" && i.colIdx >= 0) {
        const I = g.value[i.colIdx], A = Ye(i.colIdx, g.value), W = l + m.value;
        I.colDef.filter && Kt(W, A, I.width) ? (t.stopPropagation(), u.value === I.colId ? u.value = null : (u.value = I.colId, D.value = (r = M[I.colId]) != null && r.startsWith("__eq__") ? M[I.colId].slice(6) : M[I.colId] ?? "", C.value = { x: Math.max(0, A - m.value), y: K })) : I.colDef.sortable !== !1 && (u.value = null, z.value = ((s = z.value) == null ? void 0 : s.colId) === I.colId ? z.value.dir === "asc" ? { colId: I.colId, dir: "desc" } : null : { colId: I.colId, dir: "asc" }, c("sort-changed"));
        return;
      }
      if (u.value = null, i.area === "body" && i.rowIdx >= 0 && i.colIdx >= 0) {
        const I = i.rowIdx;
        v.value = { row: I, col: i.colIdx }, (f = F.value) == null || f.focus();
        const A = T.value[I], W = g.value[i.colIdx];
        A && W && (c("row-clicked", { data: A, event: t }), c("cell-selected", { data: A, row: I, col: i.colIdx, colId: W.colId }));
      }
    }
    function tt(t) {
      var l, o;
      u.value && ((o = (l = t.target).closest) != null && o.call(l, ".cathode-filter-popup") || (u.value = null));
    }
    function Mt(t) {
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
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(t.key) && (t.preventDefault(), v.value = { row: oe.value, col: 0 });
        return;
      }
      let { row: r, col: s } = v.value;
      const f = (A, W) => {
        r = Math.max(0, Math.min(i, A)), s = Math.max(0, Math.min(o, W)), v.value = { row: r, col: s }, Ae(r), Mt(s);
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
            A && W && ((I = navigator.clipboard) == null || I.writeText(ve(W, A)).catch(() => {
            }));
          }
          break;
      }
    }
    function kt(t) {
      const l = t.target.value;
      D.value = l, l ? M[u.value] = l : delete M[u.value], c("filter-changed");
    }
    function lt() {
      u.value && delete M[u.value], D.value = "", u.value = null, c("filter-changed");
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
        for (const l of Object.keys(M)) delete M[l];
        if (t)
          for (const [l, o] of Object.entries(t))
            (o == null ? void 0 : o.type) === "equals" ? M[l] = `__eq__${o.filter}` : o != null && o.filter && (M[l] = o.filter);
      },
      getFilterModel() {
        const t = {};
        for (const [l, o] of Object.entries(M))
          o && (t[l] = o.startsWith("__eq__") ? { type: "equals", filter: o.slice(6) } : { type: "contains", filter: o });
        return t;
      },
      async setColumnFilterModel(t, l) {
        l ? l.type === "equals" ? M[t] = `__eq__${l.filter}` : M[t] = l.filter ?? "" : delete M[t];
      },
      onFilterChanged() {
      },
      refreshCells() {
        P.value++;
      },
      exportDataAsCsv({ fileName: t = "export.csv" } = {}) {
        const l = k.value, o = l.map((f) => f.colDef.headerName ?? f.colId).join(","), i = T.value.map(
          (f) => l.map((I) => `"${String(ve(I, f)).replace(/"/g, '""')}"`).join(",")
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
        for (const l of Object.keys(M)) delete M[l];
        R.value = "", w.value = 0, v.value = null, u.value = null;
      }
    };
    le(
      [T, () => x.value, g, w, y, v],
      () => Me(G)
    ), le(() => e.theme, () => G()), le(() => e.curvature, () => Me(we)), le(() => e.scanlines, () => G()), le(() => e.glow, () => G()), le(v, (t) => {
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
      B == null || B.dispose(), B = null, me = !1, et();
    }
    He(() => {
      for (const t of e.columnDefs)
        t.hide && h.add(S(t)), t.sort && !z.value && (z.value = { colId: S(t), dir: t.sort });
      E.value = e.rowData ?? [], x.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", tt), document.addEventListener("mousemove", Ie), document.addEventListener("mouseup", ze), Me(() => {
        var t;
        et(), F.value && (F.value.addEventListener("webglcontextlost", ot), F.value.addEventListener("webglcontextrestored", nt)), re.value && (De = new ResizeObserver(() => we()), De.observe(re.value), Re = new IntersectionObserver((l) => {
          l.some((o) => o.isIntersecting) && xe();
        }), Re.observe(re.value)), window.addEventListener("resize", xe), (t = window.visualViewport) == null || t.addEventListener("resize", xe), c("grid-ready", { api: It });
      });
    }), Ge(() => {
      var t, l, o;
      document.removeEventListener("click", tt, !0), document.removeEventListener("mousemove", Ie), document.removeEventListener("mouseup", ze), (t = F.value) == null || t.removeEventListener("webglcontextlost", ot), (l = F.value) == null || l.removeEventListener("webglcontextrestored", nt), De == null || De.disconnect(), Re == null || Re.disconnect(), window.removeEventListener("resize", xe), (o = window.visualViewport) == null || o.removeEventListener("resize", xe), cancelAnimationFrame(Ke), B == null || B.dispose();
    });
    const ie = X(() => Ce[e.theme] ?? Ce.none), zt = X(() => ({
      position: "absolute",
      left: `${C.value.x}px`,
      top: `${C.value.y}px`,
      zIndex: 100,
      background: ie.value.headerBg,
      border: `1px solid ${ie.value.accent}`,
      color: ie.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Dt = X(() => ({
      background: ie.value.bg,
      border: `1px solid ${ie.value.border}`,
      color: ie.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Rt = X(() => ({
      background: ie.value.headerBg,
      borderTop: `1px solid ${ie.value.border}`,
      color: ie.value.text
    })), Lt = X(() => ({
      background: ie.value.bg
    })), at = X(() => ie.value.accent);
    return (t, l) => {
      var o, i;
      return Z(), J("div", {
        ref_key: "wrapEl",
        ref: re,
        class: "cathode-wrap",
        style: he(Lt.value)
      }, [
        H("canvas", {
          ref_key: "canvasEl",
          ref: F,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: ye(wt, ["prevent"]),
          onMousemove: xt,
          onMouseleave: bt,
          onMousedown: yt,
          onClick: Ct,
          onKeydown: St
        }, null, 544),
        u.value ? (Z(), J("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: he(zt.value),
          onClick: l[0] || (l[0] = ye(() => {
          }, ["stop"]))
        }, [
          H("input", {
            style: he(Dt.value),
            value: D.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: kt,
            onKeydown: Et(lt, ["escape"])
          }, null, 44, Nt),
          D.value ? (Z(), J("button", {
            key: 0,
            style: he({
              background: "none",
              border: "none",
              color: ie.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: lt
          }, "✕", 4)) : ue("", !0)
        ], 4)) : ue("", !0),
        a.pagination ? (Z(), J("div", {
          key: 1,
          class: "cathode-pagination",
          style: he(Rt.value)
        }, [
          H("button", {
            disabled: w.value <= 0,
            onClick: l[1] || (l[1] = (r) => We())
          }, "◀", 8, Yt),
          H("span", null, ce((oe.value + 1).toLocaleString()) + "–" + ce(Math.min(T.value.length, Le.value + 1).toLocaleString()) + " / " + ce(T.value.length.toLocaleString()), 1),
          H("button", {
            disabled: w.value >= V.value,
            onClick: l[2] || (l[2] = (r) => d())
          }, "▶", 8, Vt),
          H("span", {
            class: "cathode-page-info",
            style: he({ color: at.value })
          }, ce(T.value.length.toLocaleString()) + " rows ", 5),
          v.value ? (Z(), J("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: he({ color: at.value })
          }, ce(((o = g.value[v.value.col]) == null ? void 0 : o.colDef.headerName) ?? ((i = g.value[v.value.col]) == null ? void 0 : i.colId)) + " : " + ce(ve(g.value[v.value.col], T.value[v.value.row])), 5)) : ue("", !0)
        ], 4)) : ue("", !0)
      ], 4);
    };
  }
}), Ze = (a, n) => {
  const e = a.__vccOpts || a;
  for (const [c, E] of n)
    e[c] = E;
  return e;
}, bl = /* @__PURE__ */ Ze(Zt, [["__scopeId", "data-v-07901c91"]]), Je = L(0), Ue = 28, be = 12;
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
function ge() {
  localStorage.setItem($e, JSON.stringify(N.value));
}
function Qt(a) {
  Be = !1, localStorage.removeItem($e), N.value = { ...a }, ge(), Be = !0, Je.value++;
}
function mt(a) {
  qe++, N.value[a] && (N.value[a].zIndex = qe);
}
function el(a, n) {
  N.value[a].visible = n, ge();
}
function tl(a, n) {
  N.value[a].minimized = n, n && (N.value[a].maximized = !1), ge();
}
function ll(a, n) {
  N.value[a].maximized = n, n && (N.value[a].minimized = !1, mt(a)), ge();
}
function ol(a, n, e) {
  N.value[a].x = Math.round(n), N.value[a].y = Math.round(e), ge();
}
function nl(a, n, e) {
  N.value[a].w = Math.round(n), N.value[a].h = Math.round(e), ge();
}
function yl(a, n, e) {
  const c = Math.ceil(Math.sqrt(e.length)), E = Math.ceil(e.length / c), x = Math.floor((a - be * (c + 1)) / c), R = Math.floor((n - be * (E + 1)) / E), z = {};
  return e.forEach((M, p) => {
    const h = p % c, P = Math.floor(p / c);
    z[M] = {
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
    save: ge,
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
    rt("cathodeWorkspace", R), rt("cathodeResetTick", Je), He(() => {
      if (!R.value) return;
      const { clientWidth: y, clientHeight: v } = R.value, u = n.initialLayout ?? {};
      c(u, n.storageKey ?? "cathode.layout");
      const C = Object.keys(e.value)[0];
      C && z(C);
    });
    function z(y) {
      var u;
      document.querySelectorAll(".cc").forEach((C) => C.classList.remove("cc-focused"));
      const v = (u = R.value) == null ? void 0 : u.querySelector(`#cc-${y}`);
      v && v.classList.add("cc-focused");
    }
    function M() {
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
    function Q(y) {
      if (!h.value) return;
      const v = y.target;
      !v.closest(".ws-restore-menu") && !v.closest(".ws-btn-restore") && (h.value = !1);
    }
    function w(y) {
      y.key === "Escape" && (h.value = !1);
    }
    He(() => {
      document.addEventListener("click", Q), document.addEventListener("keydown", w);
    }), Ge(() => {
      document.removeEventListener("click", Q), document.removeEventListener("keydown", w);
    });
    function m(y) {
      var v;
      return ((v = n.containerTitles) == null ? void 0 : v[y]) ?? y;
    }
    return (y, v) => (Z(), J("div", {
      ref_key: "workspaceEl",
      ref: R,
      class: "cathode-workspace",
      onMousedown: p
    }, [
      Ve(y.$slots, "default", {}, void 0, !0),
      Ve(y.$slots, "overlay", {}, void 0, !0),
      H("div", al, [
        a.initialLayout ? (Z(), J("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: M
        }, " ↺ Reset Layout ")) : ue("", !0),
        v[1] || (v[1] = H("div", { class: "ws-sep" }, null, -1)),
        H("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: v[0] || (v[0] = (u) => h.value = !h.value)
        }, " ⊞ Restore Panel ")
      ]),
      _t(Tt, { name: "menu" }, {
        default: Ft(() => [
          h.value ? (Z(), J("div", il, [
            v[3] || (v[3] = H("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            P().length ? ue("", !0) : (Z(), J("div", rl, " No closed panels ")),
            (Z(!0), J(Ht, null, $t(P(), (u) => (Z(), J("div", {
              key: u,
              class: "ws-restore-item",
              onClick: (C) => $(u)
            }, [
              v[2] || (v[2] = H("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Bt(" " + ce(m(u)), 1)
            ], 8, sl))), 128))
          ])) : ue("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Cl = /* @__PURE__ */ Ze(cl, [["__scopeId", "data-v-5838d04b"]]), ul = ["id"], dl = { class: "cc-title" }, vl = {
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
    const n = a, { containers: e, bringToFront: c, setVisible: E, setMinimized: x, setMaximized: R, updatePos: z, updateSize: M } = gt(), p = ht("cathodeWorkspace", L(null)), h = X(() => e.value[n.id]), P = X(() => {
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
    let $ = !1, Q = 0, w = 0;
    function m(d) {
      var ne;
      if (d.target.closest(".cc-btn") || h.value.maximized) return;
      c(n.id), $ = !0;
      const b = (ne = p.value) == null ? void 0 : ne.querySelector(`#cc-${n.id}`);
      if (!b) return;
      const O = b.getBoundingClientRect();
      Q = d.clientX - O.left, w = d.clientY - O.top, document.addEventListener("mousemove", y), document.addEventListener("mouseup", v), d.preventDefault();
    }
    function y(d) {
      var se;
      if (!$ || !p.value) return;
      const b = p.value.getBoundingClientRect(), O = ((se = h.value) == null ? void 0 : se.w) ?? 300;
      let ne = d.clientX - b.left - Q, fe = d.clientY - b.top - w;
      ne = Math.max(ft - O, Math.min(b.width - ft, ne)), fe = Math.max(0, Math.min(b.height - Ue, fe)), z(n.id, ne, fe);
    }
    function v() {
      $ = !1, document.removeEventListener("mousemove", y), document.removeEventListener("mouseup", v);
    }
    let u = !1, C = 0, D = 0, S = 0, k = 0;
    const g = L("");
    function _(d) {
      h.value.maximized || (c(n.id), u = !0, C = d.clientX, D = d.clientY, S = h.value.w, k = h.value.h, document.addEventListener("mousemove", Y), document.addEventListener("mouseup", V), d.preventDefault(), d.stopPropagation());
    }
    function Y(d) {
      if (!u) return;
      const b = Math.max(gl, S + (d.clientX - C)), O = Math.max(pl, k + (d.clientY - D));
      M(n.id, b, O), g.value = `${Math.round(b)}×${Math.round(O)}`;
    }
    function V() {
      u = !1, g.value = "", document.removeEventListener("mousemove", Y), document.removeEventListener("mouseup", V), q.value++;
    }
    const q = L(0);
    le(Je, () => {
      q.value++;
    }), le(() => n.curvature, () => {
      q.value++;
    }), Ge(() => {
      var d;
      document.removeEventListener("mousemove", y), document.removeEventListener("mouseup", v), document.removeEventListener("mousemove", Y), document.removeEventListener("mouseup", V), (d = oe.value) == null || d.removeEventListener("scroll", ee), ve();
    });
    const oe = L(null);
    function Le(d) {
      if (n.canvas) return [];
      const b = d.children[0];
      return b ? Array.from(b.children) : [];
    }
    function ee() {
      const d = oe.value, b = n.curvature ?? 0;
      if (!d) return;
      const O = Le(d);
      if (!O.length) return;
      const ne = d.clientHeight, fe = ne / 2, se = b * 38e-4;
      O.forEach((U) => {
        if (!U.dataset.origFs) {
          const re = getComputedStyle(U);
          U.dataset.origFs = re.fontSize, U.dataset.origLh = re.lineHeight;
        }
        if (b === 0) {
          U.style.fontSize = "", U.style.lineHeight = "";
          return;
        }
        const Se = U.getBoundingClientRect(), _e = d.getBoundingClientRect(), Te = Se.top - _e.top + Se.height / 2, Fe = Math.min(1, Math.abs(Te - fe) / (ne / 2)), pe = 1 + se * Math.cos(Fe * Math.PI / 2), ke = parseFloat(U.dataset.origFs), Ie = U.dataset.origLh, ze = Ie === "normal" ? ke * 1.4 : parseFloat(Ie);
        isNaN(ke) || (U.style.fontSize = `${(ke * pe).toFixed(2)}px`), isNaN(ze) || (U.style.lineHeight = `${(ze * pe).toFixed(2)}px`);
      });
    }
    function ve() {
      const d = oe.value;
      d && Le(d).forEach((b) => {
        b.style.fontSize = "", b.style.lineHeight = "", delete b.dataset.origFs, delete b.dataset.origLh;
      });
    }
    le(() => n.curvature, (d) => {
      (d ?? 0) === 0 ? ve() : ee();
    }), He(() => {
      var d;
      (d = oe.value) == null || d.addEventListener("scroll", ee, { passive: !0 }), Me(ee);
    });
    function Ee() {
      x(n.id, !h.value.minimized), Me(() => {
        q.value++;
      });
    }
    function T() {
      R(n.id, !h.value.maximized), Me(() => {
        q.value++;
      });
    }
    function Ae() {
      E(n.id, !1);
    }
    function We() {
      c(n.id);
    }
    return (d, b) => h.value && h.value.visible ? (Z(), J("div", {
      key: 0,
      id: `cc-${a.id}`,
      class: At(["cc", { "cc-minimized": h.value.minimized, "cc-maximized": h.value.maximized, "cc-has-canvas": a.canvas }]),
      style: he(P.value),
      onMousedown: We
    }, [
      H("div", {
        class: "cc-titlebar",
        onMousedown: m
      }, [
        b[0] || (b[0] = H("span", { class: "cc-status-dot" }, null, -1)),
        H("span", dl, ce(a.title), 1),
        g.value ? (Z(), J("span", vl, ce(g.value), 1)) : ue("", !0),
        H("div", fl, [
          H("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: ye(Ee, ["stop"])
          }, "─"),
          H("button", {
            class: "cc-btn cc-btn-max",
            title: h.value.maximized ? "Restore" : "Maximize",
            onClick: ye(T, ["stop"])
          }, ce(h.value.maximized ? "⤡" : "⤢"), 9, hl),
          H("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: ye(Ae, ["stop"])
          }, "✕")
        ])
      ], 32),
      Wt(H("div", ml, [
        H("div", {
          ref_key: "bodyEl",
          ref: oe,
          class: "cc-screen",
          onScroll: ee
        }, [
          Ve(d.$slots, "default", { resizeKey: q.value }, void 0, !0),
          b[1] || (b[1] = H("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Pt, !h.value.minimized]
      ]),
      !h.value.minimized && !h.value.maximized ? (Z(), J("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: ye(_, ["stop"])
      }, null, 32)) : ue("", !0)
    ], 46, ul)) : ue("", !0);
  }
}), Ml = /* @__PURE__ */ Ze(wl, [["__scopeId", "data-v-a6501b86"]]);
export {
  Ml as CathodeContainer,
  bl as CathodeGrid,
  Cl as CathodeWorkspace,
  yl as buildDefaultLayout,
  gt as useCathodeLayout
};
