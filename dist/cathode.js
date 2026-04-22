import { defineComponent as qe, ref as L, reactive as Ne, computed as X, watch as ee, inject as ft, nextTick as Ce, onMounted as Fe, onUnmounted as je, openBlock as G, createElementBlock as Z, normalizeStyle as ve, createElementVNode as F, withModifiers as ye, withKeys as Rt, createCommentVNode as ce, toDisplayString as se, provide as it, renderSlot as Ve, createVNode as Lt, Transition as Et, withCtx as _t, Fragment as Tt, renderList as Ht, createTextVNode as Ft, normalizeClass as $t, withDirectives as Bt, vShow as At } from "vue";
import * as re from "three";
const Me = {
  none: {
    bg: "#111827",
    headerBg: "#12122a",
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
}, K = 30, rt = 12, Wt = 10;
function st(s, n) {
  const e = s.getContext("2d");
  if (!e) return;
  const u = s.width, E = s.height, x = Me[n.theme] ?? Me.none, { cols: R, rows: D, pinnedRows: C, rowHeight: p, scrollY: h, scrollX: P, glow: $ } = n;
  e.fillStyle = x.bg, e.fillRect(0, 0, u, E), e.save(), e.beginPath(), e.rect(0, 0, u, E), e.clip();
  const J = C.length * p, w = E - K - J;
  e.fillStyle = x.headerBg, e.fillRect(0, 0, u, K), e.textBaseline = "middle", e.textAlign = "left";
  let m = -P;
  for (let c = 0; c < R.length; c++) {
    const M = R[c];
    if (m + M.width <= 0) {
      m += M.width;
      continue;
    }
    if (m >= u) break;
    const z = !!n.colFilters[M.colId], S = n.sortColId === M.colId, k = (M.colDef.headerName ?? M.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(m, 0, M.width, K), e.clip(), e.font = `bold ${Wt}px system-ui, -apple-system, sans-serif`, e.fillStyle = z ? x.accent : x.textHeader, $ && (e.shadowBlur = 6, e.shadowColor = x.textHeader), e.fillText(k, m + 8, K / 2), e.shadowBlur = 0, S) {
      const g = e.measureText(k).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = x.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", m + 8 + g + 4, K / 2);
    }
    M.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = z ? x.accent : x.textHeader, e.globalAlpha = z ? 1 : 0.38, e.fillText("⌕", m + M.width - 20, K / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(m + M.width - 0.5, 0), e.lineTo(m + M.width - 0.5, K), e.stroke(), m += M.width;
  }
  e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, K - 0.5), e.lineTo(u, K - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, K, u, w), e.clip();
  const y = Math.max(0, Math.floor(h / p)), v = Math.min(D.length, Math.ceil((h + w) / p));
  for (let c = y; c < v; c++) {
    const M = D[c], z = K + c * p - h;
    c % 2 === 1 && (e.fillStyle = x.rowAlt, e.fillRect(0, z, u, p)), c === n.hoveredRow && c !== n.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, z, u, p)), c === n.selectedRow && (e.fillStyle = Pt(x.accent, 0.1), e.fillRect(0, z, u, p)), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, z + p - 0.5), e.lineTo(u, z + p - 0.5), e.stroke();
    let S = -P;
    for (let k = 0; k < R.length; k++) {
      const g = R[k];
      if (S + g.width <= 0) {
        S += g.width;
        continue;
      }
      if (S >= u) break;
      const _ = n.getCellStyle(g, M), N = _.color ?? x.text, Y = _.textAlign ?? "left", q = n.formatCell(g, M);
      e.save(), e.beginPath(), e.rect(S + 1, z, g.width - 2, p), e.clip(), e.font = `${rt}px system-ui, -apple-system, sans-serif`, e.fillStyle = N, e.textBaseline = "middle", $ && (e.shadowBlur = 4, e.shadowColor = N), Y === "right" ? (e.textAlign = "right", e.fillText(q, S + g.width - 8, z + p / 2)) : (e.textAlign = "left", e.fillText(q, S + 8, z + p / 2)), e.shadowBlur = 0, e.restore(), c === n.selectedRow && k === n.selectedCol && (e.strokeStyle = x.accent, e.lineWidth = 2, e.strokeRect(S + 1.5, z + 1.5, g.width - 3, p - 3)), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(S + g.width - 0.5, z), e.lineTo(S + g.width - 0.5, z + p), e.stroke(), S += g.width;
    }
  }
  if (e.restore(), C.length > 0) {
    const c = E - J;
    e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, c - 0.5), e.lineTo(u, c - 0.5), e.stroke();
    for (let M = 0; M < C.length; M++) {
      const z = C[M], S = c + M * p;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, S, u, p);
      let k = -P;
      for (let g = 0; g < R.length; g++) {
        const _ = R[g];
        if (k + _.width <= 0) {
          k += _.width;
          continue;
        }
        if (k >= u) break;
        const N = n.getCellStyle(_, z), Y = N.color ?? x.text, q = N.textAlign ?? "left", te = n.formatCell(_, z);
        e.save(), e.beginPath(), e.rect(k + 1, S, _.width - 2, p), e.clip(), e.font = `bold ${rt}px system-ui, -apple-system, sans-serif`, e.fillStyle = Y, e.textBaseline = "middle", q === "right" ? (e.textAlign = "right", e.fillText(te, k + _.width - 8, S + p / 2)) : (e.textAlign = "left", e.fillText(te, k + 8, S + p / 2)), e.restore(), e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(k + _.width - 0.5, S), e.lineTo(k + _.width - 0.5, S + p), e.stroke(), k += _.width;
      }
      e.strokeStyle = x.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, S + p - 0.5), e.lineTo(u, S + p - 0.5), e.stroke();
    }
  }
  e.restore();
}
function Pt(s, n) {
  if (s.startsWith("rgba") || s.startsWith("rgb"))
    return s.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(s.slice(1, 3), 16), u = parseInt(s.slice(3, 5), 16), E = parseInt(s.slice(5, 7), 16);
  return `rgba(${e},${u},${E},${n})`;
}
function Ye(s, n) {
  let e = 0;
  for (let u = 0; u < s; u++) e += n[u].width;
  return e;
}
function Ot(s, n, e) {
  return s >= n + e - 24 && s < n + e;
}
function ct(s, n, e) {
  const u = n + e;
  return s >= u - 6 && s <= u + 1;
}
function ut(s, n, e, u, E, x, R, D, C) {
  const p = s + C;
  let h = -1, P = 0;
  for (let m = 0; m < e.length; m++) {
    if (p >= P && p < P + e[m].width) {
      h = m;
      break;
    }
    P += e[m].width;
  }
  if (n < K) return { area: "header", colIdx: h, rowIdx: -1 };
  const $ = D * E;
  if ($ > 0 && n >= R - $) {
    const m = Math.floor((n - (R - $)) / E);
    return { area: "pinned", colIdx: h, rowIdx: m };
  }
  const J = n - K + x, w = Math.floor(J / E);
  return w >= 0 && w < u ? { area: "body", colIdx: h, rowIdx: w } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const Xt = ["value"], Kt = ["disabled"], Nt = ["disabled"], Yt = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Vt = `
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
      gl_FragColor = vec4(uBezel, 1.0);
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
`, Ut = 28, qt = 600, jt = /* @__PURE__ */ qe({
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
  setup(s, { emit: n }) {
    const e = s, u = n, E = L(e.rowData ?? []), x = L(e.pinnedBottomRowData ?? []), R = L(""), D = L(null), C = Ne({}), p = Ne({}), h = Ne(/* @__PURE__ */ new Set()), P = L(0), $ = L(0), J = L(0), w = L(0), m = L(0), y = L(-1), v = L(null), c = L(null), M = L({ x: 0, y: K }), z = L("");
    function S(t) {
      return t.colId ?? t.field ?? (t.headerName ? t.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const k = X(() => {
      const t = e.defaultColDef ?? {};
      return e.columnDefs.filter((l) => !h.has(S(l))).map((l) => {
        const o = S(l), a = { ...t, ...l };
        return { colId: o, colDef: a, width: p[o] ?? a.width ?? 100 };
      });
    }), g = X(() => {
      const t = $.value;
      if (!t) return k.value;
      const l = k.value.reduce((i, r) => i + r.width, 0);
      if (!l || l >= t) return k.value;
      const o = t / l;
      let a = 0;
      return k.value.map((i, r) => {
        const I = r === k.value.length - 1 ? t - a : Math.max(8, Math.round(i.width * o));
        return a += I, { ...i, width: I };
      });
    }), _ = X(() => {
      const t = g.value.reduce((l, o) => l + o.width, 0);
      return Math.max(0, t - $.value);
    }), N = X(() => {
      const t = x.value.length * e.rowHeight;
      return Math.max(0, J.value - K - t);
    }), Y = X(
      () => Math.max(0, T.value.length * e.rowHeight - N.value)
    ), q = X(
      () => Math.max(1, Math.floor(N.value / e.rowHeight))
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
          (a) => String(Q(o, a) ?? "").toLowerCase().includes(l)
        )
      ));
      for (const [o, a] of Object.entries(C)) {
        if (!a) continue;
        const i = k.value.find((r) => r.colId === o);
        if (i)
          if (a.startsWith("__eq__")) {
            const r = a.slice(6).toLowerCase();
            t = t.filter((f) => String(Q(f, i) ?? "").toLowerCase() === r);
          } else {
            const r = a.toLowerCase();
            t = t.filter((f) => String(Q(f, i) ?? "").toLowerCase().includes(r));
          }
      }
      if (D.value) {
        const { colId: o, dir: a } = D.value, i = k.value.find((r) => r.colId === o);
        i && (t = [...t].sort((r, f) => {
          const I = Q(r, i), B = Q(f, i);
          let W = 0;
          return i.colDef.comparator ? W = i.colDef.comparator(I, B) : typeof I == "number" && typeof B == "number" ? W = I - B : W = String(I ?? "").localeCompare(String(B ?? ""), void 0, { numeric: !0 }), a === "asc" ? W : -W;
        }));
      }
      return t;
    });
    ee(T, () => {
      w.value = 0, v.value = null;
    }), ee(_, () => {
      m.value = Math.min(m.value, _.value);
    }), ee(Y, () => {
      w.value = Math.min(w.value, Y.value);
    });
    function Ae(t) {
      const l = t * e.rowHeight, o = l + e.rowHeight;
      l < w.value ? w.value = l : o > w.value + N.value && (w.value = Math.min(Y.value, o - N.value));
    }
    function We() {
      w.value = Math.max(0, w.value - N.value), j();
    }
    function d() {
      w.value = Math.min(Y.value, w.value + N.value), j();
    }
    let b = !1, O = "", le = 0, de = 0, ie = !1, V = !1, Se = 0, _e = 0, Te = 0, He = 0, ge = !1;
    function ke(t, l) {
      var o;
      b = !0, O = t, le = l, de = ((o = g.value.find((a) => a.colId === t)) == null ? void 0 : o.width) ?? 100, ie = !1;
    }
    function Ie(t) {
      if (V) {
        const r = Se - t.clientX, f = _e - t.clientY;
        (Math.abs(r) > 4 || Math.abs(f) > 4) && (ge = !0), m.value = Math.max(0, Math.min(_.value, Te + r)), w.value = Math.max(0, Math.min(Y.value, He + f)), j();
        return;
      }
      if (!b) return;
      const l = $.value, o = Math.max(30, de + (t.clientX - le)), a = k.value.filter((r) => r.colId !== O).reduce((r, f) => r + f.width, 0), i = l - o;
      i > 10 && (p[O] = Math.max(10, Math.round(o * a / i))), j();
    }
    function De() {
      V && (ge && (ie = !0), V = !1), b && (b = !1, ie = !0, u("column-resized"));
    }
    const ae = L(null), H = L(null), mt = ft("cathodeResetTick", L(0));
    ee(mt, () => xe());
    let A = null, fe = !1, Pe, Je, he, pe, oe;
    function Qe() {
      if (!(!H.value || !ae.value)) {
        oe = document.createElement("canvas");
        try {
          A = new re.WebGLRenderer({ canvas: H.value, antialias: !1 });
        } catch {
          fe = !0;
        }
        if (!fe && !A.getContext() && (A.dispose(), A = null, fe = !0), fe) {
          we();
          return;
        }
        A.setPixelRatio(1), Pe = new re.Scene(), Je = new re.OrthographicCamera(-1, 1, 1, -1, 0, 1), pe = new re.CanvasTexture(oe), pe.minFilter = re.LinearFilter, pe.magFilter = re.LinearFilter, he = new re.ShaderMaterial({
          uniforms: {
            uTex: { value: pe },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new re.Color(0) }
          },
          vertexShader: Yt,
          fragmentShader: Vt
        }), Pe.add(new re.Mesh(new re.PlaneGeometry(2, 2), he)), we();
      }
    }
    function we() {
      if (!ae.value || !A && !fe) return;
      const t = ae.value.clientWidth, l = ae.value.clientHeight - (e.pagination ? Ut : 0);
      !t || !l || (oe.width = t, oe.height = l, $.value = t, J.value = l, m.value = Math.max(0, Math.min(_.value, m.value)), w.value = Math.max(0, Math.min(Y.value, w.value)), A ? (A.setPixelRatio(window.devicePixelRatio || 1), A.setSize(t, l)) : H.value && (H.value.width = t, H.value.height = l, H.value.style.width = t + "px", H.value.style.height = l + "px"), j());
    }
    function j() {
      var o, a, i, r, f, I, B, W;
      if (!(oe != null && oe.width)) return;
      if (fe) {
        if (!H.value) return;
        st(oe, {
          cols: g.value,
          rows: T.value,
          pinnedRows: x.value,
          rowHeight: e.rowHeight,
          scrollY: w.value,
          scrollX: m.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((o = D.value) == null ? void 0 : o.colId) ?? null,
          sortDir: ((a = D.value) == null ? void 0 : a.dir) ?? null,
          colFilters: C,
          hoveredRow: y.value,
          selectedRow: ((i = v.value) == null ? void 0 : i.row) ?? -1,
          selectedCol: ((r = v.value) == null ? void 0 : r.col) ?? -1,
          formatCell: ue,
          getCellStyle: Ee
        });
        const at = H.value.getContext("2d");
        at && at.drawImage(oe, 0, 0);
        return;
      }
      if (!A || !he || !pe) return;
      const t = Me[e.theme] ?? Me.none, l = e.theme === "paper";
      he.uniforms.uStrength.value = e.curvature / 45 * 0.55, he.uniforms.uScanlines.value = e.scanlines && !l ? 1 : 0, he.uniforms.uVignette.value = l ? 0 : 1, he.uniforms.uBezel.value.set(t.bg), st(oe, {
        cols: g.value,
        rows: T.value,
        pinnedRows: x.value,
        rowHeight: e.rowHeight,
        scrollY: w.value,
        scrollX: m.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((f = D.value) == null ? void 0 : f.colId) ?? null,
        sortDir: ((I = D.value) == null ? void 0 : I.dir) ?? null,
        colFilters: C,
        hoveredRow: y.value,
        selectedRow: ((B = v.value) == null ? void 0 : B.row) ?? -1,
        selectedCol: ((W = v.value) == null ? void 0 : W.col) ?? -1,
        formatCell: ue,
        getCellStyle: Ee
      }), pe.needsUpdate = !0, A.render(Pe, Je);
    }
    function Oe(t) {
      if (!H.value) return [-1, -1];
      const l = H.value.getBoundingClientRect();
      return [t.clientX - l.left, t.clientY - l.top];
    }
    let Xe = 0;
    function gt(t) {
      c.value = null;
      const l = Date.now();
      if (t.deltaX !== 0) {
        Xe = l, m.value = Math.max(0, Math.min(_.value, m.value + t.deltaX)), j();
        return;
      }
      if (t.shiftKey && t.deltaY !== 0) {
        Xe = l, m.value = Math.max(0, Math.min(_.value, m.value + t.deltaY)), j();
        return;
      }
      l - Xe < qt || (w.value = Math.max(0, Math.min(Y.value, w.value + t.deltaY)), j());
    }
    function pt(t) {
      if (b) return;
      const [l, o] = Oe(t);
      if (l < 0) {
        y.value = -1, j();
        return;
      }
      const a = ut(
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
      if (y.value = a.area === "body" ? a.rowIdx : -1, a.area === "header" && a.colIdx >= 0) {
        const i = g.value[a.colIdx], r = Ye(a.colIdx, g.value), f = l + m.value;
        H.value.style.cursor = i && ct(f, r, i.width) ? "col-resize" : "pointer";
      } else a.area === "body" ? H.value.style.cursor = "pointer" : H.value.style.cursor = "default";
      j();
    }
    function wt() {
      y.value = -1, j();
    }
    function xt(t) {
      const [l, o] = Oe(t);
      if (l < 0) return;
      if (o >= K) {
        t.stopPropagation(), V = !0, ge = !1, Se = t.clientX, _e = t.clientY, Te = m.value, He = w.value;
        return;
      }
      const a = l + m.value;
      for (let i = 0; i < g.value.length; i++) {
        const r = g.value[i], f = Ye(i, g.value);
        if (r.colDef.resizable !== !1 && ct(a, f, r.width)) {
          ke(r.colId, t.clientX);
          return;
        }
      }
    }
    function bt(t) {
      var i, r, f;
      if (ie) {
        ie = !1;
        return;
      }
      if (b) return;
      const [l, o] = Oe(t);
      if (l < 0) {
        c.value = null;
        return;
      }
      const a = ut(
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
      if (a.area === "header" && a.colIdx >= 0) {
        const I = g.value[a.colIdx], B = Ye(a.colIdx, g.value), W = l + m.value;
        I.colDef.filter && Ot(W, B, I.width) ? (t.stopPropagation(), c.value === I.colId ? c.value = null : (c.value = I.colId, z.value = (i = C[I.colId]) != null && i.startsWith("__eq__") ? C[I.colId].slice(6) : C[I.colId] ?? "", M.value = { x: Math.max(0, B - m.value), y: K })) : I.colDef.sortable !== !1 && (c.value = null, D.value = ((r = D.value) == null ? void 0 : r.colId) === I.colId ? D.value.dir === "asc" ? { colId: I.colId, dir: "desc" } : null : { colId: I.colId, dir: "asc" }, u("sort-changed"));
        return;
      }
      if (c.value = null, a.area === "body" && a.rowIdx >= 0 && a.colIdx >= 0) {
        const I = a.rowIdx;
        v.value = { row: I, col: a.colIdx }, (f = H.value) == null || f.focus();
        const B = T.value[I], W = g.value[a.colIdx];
        B && W && (u("row-clicked", { data: B, event: t }), u("cell-selected", { data: B, row: I, col: a.colIdx, colId: W.colId }));
      }
    }
    function et(t) {
      var l, o;
      c.value && ((o = (l = t.target).closest) != null && o.call(l, ".cathode-filter-popup") || (c.value = null));
    }
    function yt(t) {
      var i;
      if (!$.value) return;
      let l = 0;
      for (let r = 0; r < t; r++) l += g.value[r].width;
      const o = ((i = g.value[t]) == null ? void 0 : i.width) ?? 0, a = l - m.value;
      a < 0 ? m.value = Math.max(0, l) : a + o > $.value && (m.value = Math.min(_.value, l + o - $.value));
    }
    function Mt(t) {
      var I;
      const l = g.value, o = l.length - 1, a = T.value.length - 1;
      if (!v.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(t.key) && (t.preventDefault(), v.value = { row: te.value, col: 0 });
        return;
      }
      let { row: i, col: r } = v.value;
      const f = (B, W) => {
        i = Math.max(0, Math.min(a, B)), r = Math.max(0, Math.min(o, W)), v.value = { row: i, col: r }, Ae(i), yt(r);
      };
      switch (t.key) {
        case "ArrowDown":
          t.preventDefault(), f(i + 1, r);
          break;
        case "ArrowUp":
          t.preventDefault(), f(i - 1, r);
          break;
        case "ArrowRight":
          t.preventDefault(), r < o ? f(i, r + 1) : f(i + 1, 0);
          break;
        case "ArrowLeft":
          t.preventDefault(), r > 0 ? f(i, r - 1) : f(i - 1, o);
          break;
        case "Tab":
          t.preventDefault(), t.shiftKey ? r > 0 ? f(i, r - 1) : f(i - 1, o) : r < o ? f(i, r + 1) : f(i + 1, 0);
          break;
        case "Enter":
          t.preventDefault(), t.shiftKey ? f(i - 1, r) : f(i + 1, r);
          break;
        case "Home":
          t.preventDefault(), t.ctrlKey || t.metaKey ? f(0, 0) : f(i, 0);
          break;
        case "End":
          t.preventDefault(), t.ctrlKey || t.metaKey ? f(a, o) : f(i, o);
          break;
        case "PageDown":
          t.preventDefault(), f(Math.min(a, i + q.value), r);
          break;
        case "PageUp":
          t.preventDefault(), f(Math.max(0, i - q.value), r);
          break;
        case "Escape":
          v.value = null;
          break;
        case "c":
        case "C":
          if (t.ctrlKey || t.metaKey) {
            t.preventDefault();
            const B = T.value[i], W = l[r];
            B && W && ((I = navigator.clipboard) == null || I.writeText(ue(W, B)).catch(() => {
            }));
          }
          break;
      }
    }
    function Ct(t) {
      const l = t.target.value;
      z.value = l, l ? C[c.value] = l : delete C[c.value], u("filter-changed");
    }
    function tt() {
      c.value && delete C[c.value], z.value = "", c.value = null, u("filter-changed");
    }
    const St = {
      setGridOption(t, l) {
        t === "rowData" ? E.value = l : t === "pinnedBottomRowData" ? x.value = l : t === "quickFilterText" && (R.value = l);
      },
      getColumnState() {
        return e.columnDefs.map((t) => {
          var o, a;
          const l = S(t);
          return {
            colId: l,
            hide: h.has(l),
            sort: ((o = D.value) == null ? void 0 : o.colId) === l ? D.value.dir : null,
            sortIndex: ((a = D.value) == null ? void 0 : a.colId) === l ? 0 : null,
            width: p[l] ?? t.width
          };
        });
      },
      applyColumnState({ state: t }) {
        for (const l of t)
          l.hide === !0 && h.add(l.colId), l.hide === !1 && h.delete(l.colId), l.sort && (D.value = { colId: l.colId, dir: l.sort }), l.width && (p[l.colId] = l.width);
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
        const l = k.value, o = l.map((f) => f.colDef.headerName ?? f.colId).join(","), a = T.value.map(
          (f) => l.map((I) => `"${String(ue(I, f)).replace(/"/g, '""')}"`).join(",")
        ), i = new Blob([[o, ...a].join(`
`)], { type: "text/csv" }), r = URL.createObjectURL(i);
        Object.assign(document.createElement("a"), { href: r, download: t }).click(), URL.revokeObjectURL(r);
      },
      resize() {
        we();
      },
      resetColumnState() {
        h.clear();
        for (const l of e.columnDefs)
          l.hide && h.add(S(l));
        const t = e.columnDefs.find((l) => l.sort);
        D.value = t ? { colId: S(t), dir: t.sort } : null;
        for (const l of Object.keys(p)) delete p[l];
        for (const l of Object.keys(C)) delete C[l];
        R.value = "", w.value = 0, v.value = null, c.value = null;
      }
    };
    ee(
      [T, () => x.value, g, w, y, v],
      () => Ce(j)
    ), ee(() => e.theme, () => j()), ee(() => e.curvature, () => Ce(we)), ee(() => e.scanlines, () => j()), ee(() => e.glow, () => j()), ee(v, (t) => {
      if (!t) return;
      const l = T.value[t.row], o = g.value[t.col];
      l && o && u("cell-selected", { data: l, row: t.row, col: t.col, colId: o.colId });
    });
    let ze = null, Re = null, Ke = 0;
    function xe() {
      cancelAnimationFrame(Ke), Ke = requestAnimationFrame(we);
    }
    function lt(t) {
      t.preventDefault();
    }
    function ot() {
      A == null || A.dispose(), A = null, fe = !1, Qe();
    }
    Fe(() => {
      for (const t of e.columnDefs)
        t.hide && h.add(S(t)), t.sort && !D.value && (D.value = { colId: S(t), dir: t.sort });
      E.value = e.rowData ?? [], x.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", et), document.addEventListener("mousemove", Ie), document.addEventListener("mouseup", De), Ce(() => {
        var t;
        Qe(), H.value && (H.value.addEventListener("webglcontextlost", lt), H.value.addEventListener("webglcontextrestored", ot)), ae.value && (ze = new ResizeObserver(() => we()), ze.observe(ae.value), Re = new IntersectionObserver((l) => {
          l.some((o) => o.isIntersecting) && xe();
        }), Re.observe(ae.value)), window.addEventListener("resize", xe), (t = window.visualViewport) == null || t.addEventListener("resize", xe), u("grid-ready", { api: St });
      });
    }), je(() => {
      var t, l, o;
      document.removeEventListener("click", et, !0), document.removeEventListener("mousemove", Ie), document.removeEventListener("mouseup", De), (t = H.value) == null || t.removeEventListener("webglcontextlost", lt), (l = H.value) == null || l.removeEventListener("webglcontextrestored", ot), ze == null || ze.disconnect(), Re == null || Re.disconnect(), window.removeEventListener("resize", xe), (o = window.visualViewport) == null || o.removeEventListener("resize", xe), cancelAnimationFrame(Ke), A == null || A.dispose();
    });
    const ne = X(() => Me[e.theme] ?? Me.none), kt = X(() => ({
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
    })), It = X(() => ({
      background: ne.value.bg,
      border: `1px solid ${ne.value.border}`,
      color: ne.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Dt = X(() => ({
      background: ne.value.headerBg,
      borderTop: `1px solid ${ne.value.border}`,
      color: ne.value.text
    })), zt = X(() => ({
      background: ne.value.bg
    })), nt = X(() => ne.value.accent);
    return (t, l) => {
      var o, a;
      return G(), Z("div", {
        ref_key: "wrapEl",
        ref: ae,
        class: "cathode-wrap",
        style: ve(zt.value)
      }, [
        F("canvas", {
          ref_key: "canvasEl",
          ref: H,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: ye(gt, ["prevent"]),
          onMousemove: pt,
          onMouseleave: wt,
          onMousedown: xt,
          onClick: bt,
          onKeydown: Mt
        }, null, 544),
        c.value ? (G(), Z("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: ve(kt.value),
          onClick: l[0] || (l[0] = ye(() => {
          }, ["stop"]))
        }, [
          F("input", {
            style: ve(It.value),
            value: z.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Ct,
            onKeydown: Rt(tt, ["escape"])
          }, null, 44, Xt),
          z.value ? (G(), Z("button", {
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
            onClick: tt
          }, "✕", 4)) : ce("", !0)
        ], 4)) : ce("", !0),
        s.pagination ? (G(), Z("div", {
          key: 1,
          class: "cathode-pagination",
          style: ve(Dt.value)
        }, [
          F("button", {
            disabled: w.value <= 0,
            onClick: l[1] || (l[1] = (i) => We())
          }, "◀", 8, Kt),
          F("span", null, se((te.value + 1).toLocaleString()) + "–" + se(Math.min(T.value.length, Le.value + 1).toLocaleString()) + " / " + se(T.value.length.toLocaleString()), 1),
          F("button", {
            disabled: w.value >= Y.value,
            onClick: l[2] || (l[2] = (i) => d())
          }, "▶", 8, Nt),
          F("span", {
            class: "cathode-page-info",
            style: ve({ color: nt.value })
          }, se(T.value.length.toLocaleString()) + " rows ", 5),
          v.value ? (G(), Z("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: ve({ color: nt.value })
          }, se(((o = g.value[v.value.col]) == null ? void 0 : o.colDef.headerName) ?? ((a = g.value[v.value.col]) == null ? void 0 : a.colId)) + " : " + se(ue(g.value[v.value.col], T.value[v.value.row])), 5)) : ce("", !0)
        ], 4)) : ce("", !0)
      ], 4);
    };
  }
}), Ge = (s, n) => {
  const e = s.__vccOpts || s;
  for (const [u, E] of n)
    e[u] = E;
  return e;
}, xl = /* @__PURE__ */ Ge(jt, [["__scopeId", "data-v-d48309bb"]]), Ze = L(0), Ue = 28, be = 12;
let dt = 10, $e = "cathode.layout", Be = !1;
const U = L({});
function Gt(s, n = "cathode.layout") {
  if (!Be) {
    Be = !0, $e = n;
    try {
      const e = localStorage.getItem($e);
      if (e) {
        U.value = JSON.parse(e);
        return;
      }
    } catch {
    }
    U.value = { ...s };
  }
}
function me() {
  localStorage.setItem($e, JSON.stringify(U.value));
}
function Zt(s) {
  Be = !1, localStorage.removeItem($e), U.value = { ...s }, me(), Be = !0, Ze.value++;
}
function Jt(s) {
  dt++, U.value[s] && (U.value[s].zIndex = dt);
}
function Qt(s, n) {
  U.value[s].visible = n, me();
}
function el(s, n) {
  U.value[s].minimized = n, n && (U.value[s].maximized = !1), me();
}
function tl(s, n) {
  U.value[s].maximized = n, n && (U.value[s].minimized = !1), me();
}
function ll(s, n, e) {
  U.value[s].x = Math.round(n), U.value[s].y = Math.round(e), me();
}
function ol(s, n, e) {
  U.value[s].w = Math.round(n), U.value[s].h = Math.round(e), me();
}
function bl(s, n, e) {
  const u = Math.ceil(Math.sqrt(e.length)), E = Math.ceil(e.length / u), x = Math.floor((s - be * (u + 1)) / u), R = Math.floor((n - be * (E + 1)) / E), D = {};
  return e.forEach((C, p) => {
    const h = p % u, P = Math.floor(p / u);
    D[C] = {
      x: be + h * (x + be),
      y: be + P * (R + be),
      w: x,
      h: R,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: p + 1
    };
  }), D;
}
function ht() {
  return {
    containers: U,
    TITLEBAR_H: Ue,
    load: Gt,
    save: me,
    reset: Zt,
    bringToFront: Jt,
    setVisible: Qt,
    setMinimized: el,
    setMaximized: tl,
    updatePos: ll,
    updateSize: ol
  };
}
const nl = { class: "ws-toolbar" }, al = {
  key: 0,
  class: "ws-restore-menu"
}, il = {
  key: 0,
  class: "ws-restore-empty"
}, rl = ["onClick"], sl = /* @__PURE__ */ qe({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(s) {
    const n = s, { containers: e, load: u, reset: E, setVisible: x } = ht(), R = L(null);
    it("cathodeWorkspace", R), it("cathodeResetTick", Ze), Fe(() => {
      if (!R.value) return;
      const { clientWidth: y, clientHeight: v } = R.value, c = n.initialLayout ?? {};
      u(c, n.storageKey ?? "cathode.layout");
      const M = Object.keys(e.value)[0];
      M && D(M);
    });
    function D(y) {
      var c;
      document.querySelectorAll(".cc").forEach((M) => M.classList.remove("cc-focused"));
      const v = (c = R.value) == null ? void 0 : c.querySelector(`#cc-${y}`);
      v && v.classList.add("cc-focused");
    }
    function C() {
      !R.value || !n.initialLayout || E(n.initialLayout);
    }
    function p(y) {
      const v = y.target.closest(".cc");
      v && (document.querySelectorAll(".cc").forEach((c) => c.classList.remove("cc-focused")), v.classList.add("cc-focused"));
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
    }), je(() => {
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
      F("div", nl, [
        s.initialLayout ? (G(), Z("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: C
        }, " ↺ Reset Layout ")) : ce("", !0),
        v[1] || (v[1] = F("div", { class: "ws-sep" }, null, -1)),
        F("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: v[0] || (v[0] = (c) => h.value = !h.value)
        }, " ⊞ Restore Panel ")
      ]),
      Lt(Et, { name: "menu" }, {
        default: _t(() => [
          h.value ? (G(), Z("div", al, [
            v[3] || (v[3] = F("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            P().length ? ce("", !0) : (G(), Z("div", il, " No closed panels ")),
            (G(!0), Z(Tt, null, Ht(P(), (c) => (G(), Z("div", {
              key: c,
              class: "ws-restore-item",
              onClick: (M) => $(c)
            }, [
              v[2] || (v[2] = F("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Ft(" " + se(m(c)), 1)
            ], 8, rl))), 128))
          ])) : ce("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), yl = /* @__PURE__ */ Ge(sl, [["__scopeId", "data-v-5838d04b"]]), cl = ["id"], ul = { class: "cc-title" }, dl = {
  key: 0,
  class: "cc-size-badge"
}, vl = { class: "cc-controls" }, fl = ["title"], hl = { class: "cc-body" }, ml = 200, gl = 80, vt = 60, pl = /* @__PURE__ */ qe({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(s) {
    const n = s, { containers: e, bringToFront: u, setVisible: E, setMinimized: x, setMaximized: R, updatePos: D, updateSize: C } = ht(), p = ft("cathodeWorkspace", L(null)), h = X(() => e.value[n.id]), P = X(() => {
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
      u(n.id), $ = !0;
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
      le = Math.max(vt - O, Math.min(b.width - vt, le)), de = Math.max(0, Math.min(b.height - Ue, de)), D(n.id, le, de);
    }
    function v() {
      $ = !1, document.removeEventListener("mousemove", y), document.removeEventListener("mouseup", v);
    }
    let c = !1, M = 0, z = 0, S = 0, k = 0;
    const g = L("");
    function _(d) {
      h.value.maximized || (u(n.id), c = !0, M = d.clientX, z = d.clientY, S = h.value.w, k = h.value.h, document.addEventListener("mousemove", N), document.addEventListener("mouseup", Y), d.preventDefault(), d.stopPropagation());
    }
    function N(d) {
      if (!c) return;
      const b = Math.max(ml, S + (d.clientX - M)), O = Math.max(gl, k + (d.clientY - z));
      C(n.id, b, O), g.value = `${Math.round(b)}×${Math.round(O)}`;
    }
    function Y() {
      c = !1, g.value = "", document.removeEventListener("mousemove", N), document.removeEventListener("mouseup", Y), q.value++;
    }
    const q = L(0);
    ee(Ze, () => {
      q.value++;
    }), ee(() => n.curvature, () => {
      q.value++;
    }), je(() => {
      var d;
      document.removeEventListener("mousemove", y), document.removeEventListener("mouseup", v), document.removeEventListener("mousemove", N), document.removeEventListener("mouseup", Y), (d = te.value) == null || d.removeEventListener("scroll", Q), ue();
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
      O.forEach((V) => {
        if (!V.dataset.origFs) {
          const ae = getComputedStyle(V);
          V.dataset.origFs = ae.fontSize, V.dataset.origLh = ae.lineHeight;
        }
        if (b === 0) {
          V.style.fontSize = "", V.style.lineHeight = "";
          return;
        }
        const Se = V.getBoundingClientRect(), _e = d.getBoundingClientRect(), Te = Se.top - _e.top + Se.height / 2, He = Math.min(1, Math.abs(Te - de) / (le / 2)), ge = 1 + ie * Math.cos(He * Math.PI / 2), ke = parseFloat(V.dataset.origFs), Ie = V.dataset.origLh, De = Ie === "normal" ? ke * 1.4 : parseFloat(Ie);
        isNaN(ke) || (V.style.fontSize = `${(ke * ge).toFixed(2)}px`), isNaN(De) || (V.style.lineHeight = `${(De * ge).toFixed(2)}px`);
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
      u(n.id);
    }
    return (d, b) => h.value && h.value.visible ? (G(), Z("div", {
      key: 0,
      id: `cc-${s.id}`,
      class: $t(["cc", { "cc-minimized": h.value.minimized, "cc-maximized": h.value.maximized, "cc-has-canvas": s.canvas }]),
      style: ve(P.value),
      onMousedown: We
    }, [
      F("div", {
        class: "cc-titlebar",
        onMousedown: m
      }, [
        b[0] || (b[0] = F("span", { class: "cc-status-dot" }, null, -1)),
        F("span", ul, se(s.title), 1),
        g.value ? (G(), Z("span", dl, se(g.value), 1)) : ce("", !0),
        F("div", vl, [
          F("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: ye(Ee, ["stop"])
          }, "─"),
          F("button", {
            class: "cc-btn cc-btn-max",
            title: h.value.maximized ? "Restore" : "Maximize",
            onClick: ye(T, ["stop"])
          }, se(h.value.maximized ? "⤡" : "⤢"), 9, fl),
          F("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: ye(Ae, ["stop"])
          }, "✕")
        ])
      ], 32),
      Bt(F("div", hl, [
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
        [At, !h.value.minimized]
      ]),
      !h.value.minimized && !h.value.maximized ? (G(), Z("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: ye(_, ["stop"])
      }, null, 32)) : ce("", !0)
    ], 46, cl)) : ce("", !0);
  }
}), Ml = /* @__PURE__ */ Ge(pl, [["__scopeId", "data-v-a6501b86"]]);
export {
  Ml as CathodeContainer,
  xl as CathodeGrid,
  yl as CathodeWorkspace,
  bl as buildDefaultLayout,
  ht as useCathodeLayout
};
