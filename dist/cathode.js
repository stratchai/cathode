import { defineComponent as Ne, ref as _, reactive as rt, computed as G, watch as $, inject as lt, nextTick as Le, onMounted as We, onUnmounted as je, openBlock as oe, createElementBlock as ae, normalizeStyle as fe, createElementVNode as K, withModifiers as Re, withKeys as nl, createCommentVNode as ye, toDisplayString as be, createVNode as zt, withDirectives as Wt, vModelText as ol, provide as Tt, renderSlot as ut, Transition as al, withCtx as il, Fragment as rl, renderList as sl, createTextVNode as cl, normalizeClass as ul, vShow as dl } from "vue";
import * as O from "three";
const Oe = {
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
    bg: "rgba(0,0,0,0)",
    headerBg: "rgba(255,255,255,0.65)",
    text: "#222222",
    textHeader: "#158cba",
    border: "#dee2e6",
    accent: "#158cba",
    rowAlt: "rgba(21,140,186,0.04)"
  }
}, re = 30, kt = 12, fl = 10;
function It(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, d = Oe[l.theme] ?? Oe.none, { cols: s, rows: v, pinnedRows: f, rowHeight: u, scrollY: i, scrollX: w, glow: b } = l;
  e.clearRect(0, 0, n, a), e.fillStyle = d.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const S = f.length * u, g = a - re - S;
  e.fillStyle = d.headerBg, e.fillRect(0, 0, n, re), e.textBaseline = "middle", e.textAlign = "left";
  let h = -w;
  for (let p = 0; p < s.length; p++) {
    const M = s[p];
    if (h + M.width <= 0) {
      h += M.width;
      continue;
    }
    if (h >= n) break;
    const R = !!l.colFilters[M.colId], T = l.sortColId === M.colId, C = (M.colDef.headerName ?? M.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(h, 0, M.width, re), e.clip(), e.font = `bold ${fl}px system-ui, -apple-system, sans-serif`, e.fillStyle = R ? d.accent : d.textHeader, b && (e.shadowBlur = 6, e.shadowColor = d.textHeader), e.fillText(C, h + 8, re / 2), e.shadowBlur = 0, T) {
      const x = e.measureText(C).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = d.accent, e.fillText(l.sortDir === "asc" ? "▲" : "▼", h + 8 + x + 4, re / 2);
    }
    M.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = R ? d.accent : d.textHeader, e.globalAlpha = R ? 1 : 0.38, e.fillText("⌕", h + M.width - 20, re / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(h + M.width - 0.5, 0), e.lineTo(h + M.width - 0.5, re), e.stroke(), h += M.width;
  }
  e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, re - 0.5), e.lineTo(n, re - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, re, n, g), e.clip();
  const c = Math.max(0, Math.floor(i / u)), m = Math.min(v.length, Math.ceil((i + g) / u));
  for (let p = c; p < m; p++) {
    const M = v[p], R = re + p * u - i;
    p % 2 === 1 && (e.fillStyle = d.rowAlt, e.fillRect(0, R, n, u)), p === l.hoveredRow && p !== l.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, R, n, u)), p === l.selectedRow && (e.fillStyle = vl(d.accent, 0.1), e.fillRect(0, R, n, u)), e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, R + u - 0.5), e.lineTo(n, R + u - 0.5), e.stroke();
    let T = -w;
    for (let C = 0; C < s.length; C++) {
      const x = s[C];
      if (T + x.width <= 0) {
        T += x.width;
        continue;
      }
      if (T >= n) break;
      const B = l.getCellStyle(x, M), W = B.color ?? d.text, V = B.textAlign ?? "left", U = l.formatCell(x, M);
      e.save(), e.beginPath(), e.rect(T + 1, R, x.width - 2, u), e.clip(), e.font = `${kt}px system-ui, -apple-system, sans-serif`, e.fillStyle = W, e.textBaseline = "middle", b && (e.shadowBlur = 4, e.shadowColor = W), V === "right" ? (e.textAlign = "right", e.fillText(U, T + x.width - 8, R + u / 2)) : (e.textAlign = "left", e.fillText(U, T + 8, R + u / 2)), e.shadowBlur = 0, e.restore(), p === l.selectedRow && C === l.selectedCol && (e.strokeStyle = d.accent, e.lineWidth = 2, e.strokeRect(T + 1.5, R + 1.5, x.width - 3, u - 3)), e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(T + x.width - 0.5, R), e.lineTo(T + x.width - 0.5, R + u), e.stroke(), T += x.width;
    }
  }
  if (e.restore(), f.length > 0) {
    const p = a - S;
    e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, p - 0.5), e.lineTo(n, p - 0.5), e.stroke();
    for (let M = 0; M < f.length; M++) {
      const R = f[M], T = p + M * u;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, T, n, u);
      let C = -w;
      for (let x = 0; x < s.length; x++) {
        const B = s[x];
        if (C + B.width <= 0) {
          C += B.width;
          continue;
        }
        if (C >= n) break;
        const W = l.getCellStyle(B, R), V = W.color ?? d.text, U = W.textAlign ?? "left", q = l.formatCell(B, R);
        e.save(), e.beginPath(), e.rect(C + 1, T, B.width - 2, u), e.clip(), e.font = `bold ${kt}px system-ui, -apple-system, sans-serif`, e.fillStyle = V, e.textBaseline = "middle", U === "right" ? (e.textAlign = "right", e.fillText(q, C + B.width - 8, T + u / 2)) : (e.textAlign = "left", e.fillText(q, C + 8, T + u / 2)), e.restore(), e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(C + B.width - 0.5, T), e.lineTo(C + B.width - 0.5, T + u), e.stroke(), C += B.width;
      }
      e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, T + u - 0.5), e.lineTo(n, T + u - 0.5), e.stroke();
    }
  }
  e.restore();
}
function vl(t, l) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${l})`);
  const e = parseInt(t.slice(1, 3), 16), n = parseInt(t.slice(3, 5), 16), a = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${n},${a},${l})`;
}
function st(t, l) {
  let e = 0;
  for (let n = 0; n < t; n++) e += l[n].width;
  return e;
}
function ml(t, l, e) {
  return t >= l + e - 24 && t < l + e;
}
function Lt(t, l, e) {
  const n = l + e;
  return t >= n - 6 && t <= n + 1;
}
function Dt(t, l, e, n, a, d, s, v, f) {
  const u = t + f;
  let i = -1, w = 0;
  for (let h = 0; h < e.length; h++) {
    if (u >= w && u < w + e[h].width) {
      i = h;
      break;
    }
    w += e[h].width;
  }
  if (l < re) return { area: "header", colIdx: i, rowIdx: -1 };
  const b = v * a;
  if (b > 0 && l >= s - b) {
    const h = Math.floor((l - (s - b)) / a);
    return { area: "pinned", colIdx: i, rowIdx: h };
  }
  const S = l - re + d, g = Math.floor(S / a);
  return g >= 0 && g < n ? { area: "body", colIdx: i, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const hl = ["value"], gl = ["disabled"], pl = ["disabled"], wl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, bl = `
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
`, yl = 28, xl = 600, Ml = /* @__PURE__ */ Ne({
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
    const e = t, n = l, a = _(e.rowData ?? []), d = _(e.pinnedBottomRowData ?? []), s = _(""), v = _(null), f = rt({}), u = rt({}), i = rt(/* @__PURE__ */ new Set()), w = _(0), b = _(0), S = _(0), g = _(0), h = _(0), c = _(-1), m = _(null), p = _(null), M = _({ x: 0, y: re }), R = _("");
    function T(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const C = G(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((r) => !i.has(T(r))).map((r) => {
        const y = T(r), k = { ...o, ...r };
        return { colId: y, colDef: k, width: u[y] ?? k.width ?? 100 };
      });
    }), x = G(() => {
      const o = b.value;
      if (!o) return C.value;
      const r = C.value.reduce((I, L) => I + L.width, 0);
      if (!r || r >= o) return C.value;
      const y = o / r;
      let k = 0;
      return C.value.map((I, L) => {
        const N = L === C.value.length - 1 ? o - k : Math.max(8, Math.round(I.width * y));
        return k += N, { ...I, width: N };
      });
    }), B = G(() => {
      const o = x.value.reduce((r, y) => r + y.width, 0);
      return Math.max(0, o - b.value);
    }), W = G(() => {
      const o = d.value.length * e.rowHeight;
      return Math.max(0, S.value - re - o);
    }), V = G(
      () => Math.max(0, j.value.length * e.rowHeight - W.value)
    ), U = G(
      () => Math.max(1, Math.floor(W.value / e.rowHeight))
    ), q = G(
      () => j.value.length === 0 ? 0 : Math.min(j.value.length - 1, Math.floor(g.value / e.rowHeight))
    ), ve = G(
      () => Math.min(j.value.length - 1, q.value + U.value - 1)
    );
    function X(o, r) {
      if (r.colDef.valueGetter) return r.colDef.valueGetter({ data: o, colDef: r.colDef });
      if (r.colDef.field) return o[r.colDef.field];
    }
    function ie(o, r) {
      const y = X(r, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: y, data: r, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: y, data: r, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : y == null ? "" : String(y);
    }
    function xe(o, r) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: X(r, o), data: r, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const j = G(() => {
      w.value;
      let o = a.value;
      const r = s.value.trim().toLowerCase();
      r && (o = o.filter(
        (y) => C.value.some(
          (k) => String(X(y, k) ?? "").toLowerCase().includes(r)
        )
      ));
      for (const [y, k] of Object.entries(f)) {
        if (!k) continue;
        const I = C.value.find((L) => L.colId === y);
        if (I)
          if (k.startsWith("__eq__")) {
            const L = k.slice(6).toLowerCase();
            o = o.filter((z) => String(X(z, I) ?? "").toLowerCase() === L);
          } else {
            const L = k.toLowerCase();
            o = o.filter((z) => String(X(z, I) ?? "").toLowerCase().includes(L));
          }
      }
      if (v.value) {
        const { colId: y, dir: k } = v.value, I = C.value.find((L) => L.colId === y);
        I && (o = [...o].sort((L, z) => {
          const N = X(L, I), le = X(z, I);
          let ne = 0;
          return I.colDef.comparator ? ne = I.colDef.comparator(N, le) : typeof N == "number" && typeof le == "number" ? ne = N - le : ne = String(N ?? "").localeCompare(String(le ?? ""), void 0, { numeric: !0 }), k === "asc" ? ne : -ne;
        }));
      }
      return o;
    });
    $(j, () => {
      g.value = 0, m.value = null;
    }), $(B, () => {
      h.value = Math.min(h.value, B.value);
    }), $(V, () => {
      g.value = Math.min(g.value, V.value);
    });
    function Te(o) {
      const r = o * e.rowHeight, y = r + e.rowHeight;
      r < g.value ? g.value = r : y > g.value + W.value && (g.value = Math.min(V.value, y - W.value));
    }
    function ke() {
      g.value = Math.max(0, g.value - W.value), de();
    }
    function F() {
      g.value = Math.min(V.value, g.value + W.value), de();
    }
    let H = !1, Z = "", ee = 0, D = 0, A = !1, P = !1, me = 0, ce = 0, Me = 0, Ee = 0, E = !1;
    function Y(o, r) {
      var y;
      H = !0, Z = o, ee = r, D = ((y = x.value.find((k) => k.colId === o)) == null ? void 0 : y.width) ?? 100, A = !1;
    }
    function Q(o) {
      if (P) {
        const L = me - o.clientX, z = ce - o.clientY;
        (Math.abs(L) > 4 || Math.abs(z) > 4) && (E = !0), h.value = Math.max(0, Math.min(B.value, Me + L)), g.value = Math.max(0, Math.min(V.value, Ee + z)), de();
        return;
      }
      if (!H) return;
      const r = b.value, y = Math.max(30, D + (o.clientX - ee)), k = C.value.filter((L) => L.colId !== Z).reduce((L, z) => L + z.width, 0), I = r - y;
      I > 10 && (u[Z] = Math.max(10, Math.round(y * k / I))), de();
    }
    function Se() {
      P && (E && (A = !0), P = !1), H && (H = !1, A = !0, n("column-resized"));
    }
    const he = _(null), J = _(null), Vt = lt("cathodeResetTick", _(0));
    $(Vt, () => Pe());
    let te = null, _e = !1, nt, pt, Ie, ge, ue;
    function wt() {
      if (!(!J.value || !he.value)) {
        ue = document.createElement("canvas");
        try {
          te = new O.WebGLRenderer({ canvas: J.value, antialias: !1, alpha: !0 });
        } catch {
          _e = !0;
        }
        if (!_e && !te.getContext() && (te.dispose(), te = null, _e = !0), _e) {
          He();
          return;
        }
        te.setPixelRatio(1), te.setClearColor(0, 0), nt = new O.Scene(), pt = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), ge = new O.CanvasTexture(ue), ge.minFilter = O.LinearFilter, ge.magFilter = O.LinearFilter, Ie = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: ge },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new O.Color(0) }
          },
          vertexShader: wl,
          fragmentShader: bl,
          transparent: !0
        }), nt.add(new O.Mesh(new O.PlaneGeometry(2, 2), Ie)), He();
      }
    }
    function He() {
      if (!he.value || !te && !_e) return;
      const o = he.value.clientWidth, r = he.value.clientHeight - (e.pagination ? yl : 0);
      if (!o || !r) return;
      const y = ue.width !== o || ue.height !== r;
      ue.width = o, ue.height = r, b.value = o, S.value = r, h.value = Math.max(0, Math.min(B.value, h.value)), g.value = Math.max(0, Math.min(V.value, g.value)), te ? (y && ge && (ge.dispose(), ge = new O.CanvasTexture(ue), ge.minFilter = O.LinearFilter, ge.magFilter = O.LinearFilter, Ie && (Ie.uniforms.uTex.value = ge)), te.setPixelRatio(window.devicePixelRatio || 1), te.setSize(o, r)) : J.value && (J.value.width = o, J.value.height = r, J.value.style.width = o + "px", J.value.style.height = r + "px"), de();
    }
    function de() {
      var y, k, I, L, z, N, le, ne;
      if (!(ue != null && ue.width)) return;
      if (_e) {
        if (!J.value) return;
        It(ue, {
          cols: x.value,
          rows: j.value,
          pinnedRows: d.value,
          rowHeight: e.rowHeight,
          scrollY: g.value,
          scrollX: h.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((y = v.value) == null ? void 0 : y.colId) ?? null,
          sortDir: ((k = v.value) == null ? void 0 : k.dir) ?? null,
          colFilters: f,
          hoveredRow: c.value,
          selectedRow: ((I = m.value) == null ? void 0 : I.row) ?? -1,
          selectedCol: ((L = m.value) == null ? void 0 : L.col) ?? -1,
          formatCell: ie,
          getCellStyle: xe
        });
        const Ct = J.value.getContext("2d");
        Ct && Ct.drawImage(ue, 0, 0);
        return;
      }
      if (!te || !Ie || !ge) return;
      const o = Oe[e.theme] ?? Oe.none, r = e.theme === "paper";
      Ie.uniforms.uStrength.value = e.curvature / 45 * 0.55, Ie.uniforms.uScanlines.value = e.scanlines && !r ? 1 : 0, Ie.uniforms.uVignette.value = r ? 0 : 1, Ie.uniforms.uBezel.value.set(o.bg), It(ue, {
        cols: x.value,
        rows: j.value,
        pinnedRows: d.value,
        rowHeight: e.rowHeight,
        scrollY: g.value,
        scrollX: h.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((z = v.value) == null ? void 0 : z.colId) ?? null,
        sortDir: ((N = v.value) == null ? void 0 : N.dir) ?? null,
        colFilters: f,
        hoveredRow: c.value,
        selectedRow: ((le = m.value) == null ? void 0 : le.row) ?? -1,
        selectedCol: ((ne = m.value) == null ? void 0 : ne.col) ?? -1,
        formatCell: ie,
        getCellStyle: xe
      }), ge.needsUpdate = !0, te.render(nt, pt);
    }
    function ot(o) {
      if (!J.value) return [-1, -1];
      const r = J.value.getBoundingClientRect();
      return [o.clientX - r.left, o.clientY - r.top];
    }
    let at = 0;
    function Xt(o) {
      p.value = null;
      const r = Date.now();
      if (o.deltaX !== 0) {
        at = r, h.value = Math.max(0, Math.min(B.value, h.value + o.deltaX)), de();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        at = r, h.value = Math.max(0, Math.min(B.value, h.value + o.deltaY)), de();
        return;
      }
      r - at < xl || (g.value = Math.max(0, Math.min(V.value, g.value + o.deltaY)), de());
    }
    function Nt(o) {
      if (H) return;
      const [r, y] = ot(o);
      if (r < 0) {
        c.value = -1, de();
        return;
      }
      const k = Dt(
        r,
        y,
        x.value,
        j.value.length,
        e.rowHeight,
        g.value,
        ue.height,
        d.value.length,
        h.value
      );
      if (c.value = k.area === "body" ? k.rowIdx : -1, k.area === "header" && k.colIdx >= 0) {
        const I = x.value[k.colIdx], L = st(k.colIdx, x.value), z = r + h.value;
        J.value.style.cursor = I && Lt(z, L, I.width) ? "col-resize" : "pointer";
      } else k.area === "body" ? J.value.style.cursor = "pointer" : J.value.style.cursor = "default";
      de();
    }
    function Gt() {
      c.value = -1, de();
    }
    function Ut(o) {
      const [r, y] = ot(o);
      if (r < 0) return;
      if (y >= re) {
        P = !0, E = !1, me = o.clientX, ce = o.clientY, Me = h.value, Ee = g.value;
        return;
      }
      const k = r + h.value;
      for (let I = 0; I < x.value.length; I++) {
        const L = x.value[I], z = st(I, x.value);
        if (L.colDef.resizable !== !1 && Lt(k, z, L.width)) {
          Y(L.colId, o.clientX);
          return;
        }
      }
    }
    function Kt(o) {
      var I, L, z;
      if (A) {
        A = !1;
        return;
      }
      if (H) return;
      const [r, y] = ot(o);
      if (r < 0) {
        p.value = null;
        return;
      }
      const k = Dt(
        r,
        y,
        x.value,
        j.value.length,
        e.rowHeight,
        g.value,
        ue.height,
        d.value.length,
        h.value
      );
      if (k.area === "header" && k.colIdx >= 0) {
        const N = x.value[k.colIdx], le = st(k.colIdx, x.value), ne = r + h.value;
        N.colDef.filter && ml(ne, le, N.width) ? (o.stopPropagation(), p.value === N.colId ? p.value = null : (p.value = N.colId, R.value = (I = f[N.colId]) != null && I.startsWith("__eq__") ? f[N.colId].slice(6) : f[N.colId] ?? "", M.value = { x: Math.max(0, le - h.value), y: re })) : N.colDef.sortable !== !1 && (p.value = null, v.value = ((L = v.value) == null ? void 0 : L.colId) === N.colId ? v.value.dir === "asc" ? { colId: N.colId, dir: "desc" } : null : { colId: N.colId, dir: "asc" }, n("sort-changed"));
        return;
      }
      if (p.value = null, k.area === "body" && k.rowIdx >= 0 && k.colIdx >= 0) {
        const N = k.rowIdx;
        m.value = { row: N, col: k.colIdx }, (z = J.value) == null || z.focus();
        const le = j.value[N], ne = x.value[k.colIdx];
        le && ne && (n("row-clicked", { data: le, event: o }), n("cell-selected", { data: le, row: N, col: k.colIdx, colId: ne.colId }));
      }
    }
    function bt(o) {
      var r, y;
      p.value && ((y = (r = o.target).closest) != null && y.call(r, ".cathode-filter-popup") || (p.value = null));
    }
    function qt(o) {
      var I;
      if (!b.value) return;
      let r = 0;
      for (let L = 0; L < o; L++) r += x.value[L].width;
      const y = ((I = x.value[o]) == null ? void 0 : I.width) ?? 0, k = r - h.value;
      k < 0 ? h.value = Math.max(0, r) : k + y > b.value && (h.value = Math.min(B.value, r + y - b.value));
    }
    function jt(o) {
      var N;
      const r = x.value, y = r.length - 1, k = j.value.length - 1;
      if (!m.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), m.value = { row: q.value, col: 0 });
        return;
      }
      let { row: I, col: L } = m.value;
      const z = (le, ne) => {
        I = Math.max(0, Math.min(k, le)), L = Math.max(0, Math.min(y, ne)), m.value = { row: I, col: L }, Te(I), qt(L);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), z(I + 1, L);
          break;
        case "ArrowUp":
          o.preventDefault(), z(I - 1, L);
          break;
        case "ArrowRight":
          o.preventDefault(), L < y ? z(I, L + 1) : z(I + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), L > 0 ? z(I, L - 1) : z(I - 1, y);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? L > 0 ? z(I, L - 1) : z(I - 1, y) : L < y ? z(I, L + 1) : z(I + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? z(I - 1, L) : z(I + 1, L);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? z(0, 0) : z(I, 0);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? z(k, y) : z(I, y);
          break;
        case "PageDown":
          o.preventDefault(), z(Math.min(k, I + U.value), L);
          break;
        case "PageUp":
          o.preventDefault(), z(Math.max(0, I - U.value), L);
          break;
        case "Escape":
          m.value = null;
          break;
        case "c":
        case "C":
          if (o.ctrlKey || o.metaKey) {
            o.preventDefault();
            const le = j.value[I], ne = r[L];
            le && ne && ((N = navigator.clipboard) == null || N.writeText(ie(ne, le)).catch(() => {
            }));
          }
          break;
      }
    }
    function Zt(o) {
      const r = o.target.value;
      R.value = r, r ? f[p.value] = r : delete f[p.value], n("filter-changed");
    }
    function yt() {
      p.value && delete f[p.value], R.value = "", p.value = null, n("filter-changed");
    }
    const Jt = {
      setGridOption(o, r) {
        o === "rowData" ? a.value = r : o === "pinnedBottomRowData" ? d.value = r : o === "quickFilterText" && (s.value = r);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var y, k;
          const r = T(o);
          return {
            colId: r,
            hide: i.has(r),
            sort: ((y = v.value) == null ? void 0 : y.colId) === r ? v.value.dir : null,
            sortIndex: ((k = v.value) == null ? void 0 : k.colId) === r ? 0 : null,
            width: u[r] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const r of o)
          r.hide === !0 && i.add(r.colId), r.hide === !1 && i.delete(r.colId), r.sort && (v.value = { colId: r.colId, dir: r.sort }), r.width && (u[r.colId] = r.width);
      },
      setFilterModel(o) {
        for (const r of Object.keys(f)) delete f[r];
        if (o)
          for (const [r, y] of Object.entries(o))
            (y == null ? void 0 : y.type) === "equals" ? f[r] = `__eq__${y.filter}` : y != null && y.filter && (f[r] = y.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [r, y] of Object.entries(f))
          y && (o[r] = y.startsWith("__eq__") ? { type: "equals", filter: y.slice(6) } : { type: "contains", filter: y });
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
        const r = C.value, y = r.map((z) => z.colDef.headerName ?? z.colId).join(","), k = j.value.map(
          (z) => r.map((N) => `"${String(ie(N, z)).replace(/"/g, '""')}"`).join(",")
        ), I = new Blob([[y, ...k].join(`
`)], { type: "text/csv" }), L = URL.createObjectURL(I);
        Object.assign(document.createElement("a"), { href: L, download: o }).click(), URL.revokeObjectURL(L);
      },
      resize() {
        He();
      },
      resetColumnState() {
        i.clear();
        for (const r of e.columnDefs)
          r.hide && i.add(T(r));
        const o = e.columnDefs.find((r) => r.sort);
        v.value = o ? { colId: T(o), dir: o.sort } : null;
        for (const r of Object.keys(u)) delete u[r];
        for (const r of Object.keys(f)) delete f[r];
        s.value = "", g.value = 0, m.value = null, p.value = null;
      }
    };
    $(
      [j, () => d.value, x, g, c, m],
      () => Le(de)
    ), $(() => e.theme, () => de()), $(() => e.curvature, () => Le(He)), $(() => e.scanlines, () => de()), $(() => e.glow, () => de()), $(m, (o) => {
      if (!o) return;
      const r = j.value[o.row], y = x.value[o.col];
      r && y && n("cell-selected", { data: r, row: o.row, col: o.col, colId: y.colId });
    });
    let Ue = null, Ke = null, it = 0;
    function Pe() {
      cancelAnimationFrame(it), it = requestAnimationFrame(He);
    }
    function xt(o) {
      o.preventDefault();
    }
    function Mt() {
      te == null || te.dispose(), te = null, _e = !1, wt();
    }
    We(() => {
      for (const o of e.columnDefs)
        o.hide && i.add(T(o)), o.sort && !v.value && (v.value = { colId: T(o), dir: o.sort });
      a.value = e.rowData ?? [], d.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", bt), document.addEventListener("mousemove", Q), document.addEventListener("mouseup", Se), Le(() => {
        var o;
        wt(), J.value && (J.value.addEventListener("webglcontextlost", xt), J.value.addEventListener("webglcontextrestored", Mt)), he.value && (Ue = new ResizeObserver(() => He()), Ue.observe(he.value), Ke = new IntersectionObserver((r) => {
          r.some((y) => y.isIntersecting) && Pe();
        }), Ke.observe(he.value)), window.addEventListener("resize", Pe), (o = window.visualViewport) == null || o.addEventListener("resize", Pe), n("grid-ready", { api: Jt });
      });
    }), je(() => {
      var o, r, y;
      document.removeEventListener("click", bt, !0), document.removeEventListener("mousemove", Q), document.removeEventListener("mouseup", Se), (o = J.value) == null || o.removeEventListener("webglcontextlost", xt), (r = J.value) == null || r.removeEventListener("webglcontextrestored", Mt), Ue == null || Ue.disconnect(), Ke == null || Ke.disconnect(), window.removeEventListener("resize", Pe), (y = window.visualViewport) == null || y.removeEventListener("resize", Pe), cancelAnimationFrame(it), te == null || te.dispose();
    });
    const pe = G(() => Oe[e.theme] ?? Oe.none), Qt = G(() => ({
      position: "absolute",
      left: `${M.value.x}px`,
      top: `${M.value.y}px`,
      zIndex: 100,
      background: pe.value.headerBg,
      border: `1px solid ${pe.value.accent}`,
      color: pe.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), el = G(() => ({
      background: pe.value.bg,
      border: `1px solid ${pe.value.border}`,
      color: pe.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), tl = G(() => ({
      background: pe.value.headerBg,
      borderTop: `1px solid ${pe.value.border}`,
      color: pe.value.text
    })), ll = G(() => ({
      background: pe.value.bg
    })), St = G(() => pe.value.accent);
    return (o, r) => {
      var y, k;
      return oe(), ae("div", {
        ref_key: "wrapEl",
        ref: he,
        class: "cathode-wrap",
        style: fe(ll.value)
      }, [
        K("canvas", {
          ref_key: "canvasEl",
          ref: J,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Re(Xt, ["prevent"]),
          onMousemove: Nt,
          onMouseleave: Gt,
          onMousedown: Ut,
          onClick: Kt,
          onKeydown: jt
        }, null, 544),
        p.value ? (oe(), ae("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: fe(Qt.value),
          onClick: r[0] || (r[0] = Re(() => {
          }, ["stop"]))
        }, [
          K("input", {
            style: fe(el.value),
            value: R.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Zt,
            onKeydown: nl(yt, ["escape"])
          }, null, 44, hl),
          R.value ? (oe(), ae("button", {
            key: 0,
            style: fe({
              background: "none",
              border: "none",
              color: pe.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: yt
          }, "✕", 4)) : ye("", !0)
        ], 4)) : ye("", !0),
        t.pagination ? (oe(), ae("div", {
          key: 1,
          class: "cathode-pagination",
          style: fe(tl.value)
        }, [
          K("button", {
            disabled: g.value <= 0,
            onClick: r[1] || (r[1] = (I) => ke())
          }, "◀", 8, gl),
          K("span", null, be((q.value + 1).toLocaleString()) + "–" + be(Math.min(j.value.length, ve.value + 1).toLocaleString()) + " / " + be(j.value.length.toLocaleString()), 1),
          K("button", {
            disabled: g.value >= V.value,
            onClick: r[2] || (r[2] = (I) => F())
          }, "▶", 8, pl),
          K("span", {
            class: "cathode-page-info",
            style: fe({ color: St.value })
          }, be(j.value.length.toLocaleString()) + " rows ", 5),
          m.value ? (oe(), ae("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: fe({ color: St.value })
          }, be(((y = x.value[m.value.col]) == null ? void 0 : y.colDef.headerName) ?? ((k = x.value[m.value.col]) == null ? void 0 : k.colId)) + " : " + be(ie(x.value[m.value.col], j.value[m.value.row])), 5)) : ye("", !0)
        ], 4)) : ye("", !0)
      ], 4);
    };
  }
}), Ge = (t, l) => {
  const e = t.__vccOpts || t;
  for (const [n, a] of l)
    e[n] = a;
  return e;
}, Rn = /* @__PURE__ */ Ge(Ml, [["__scopeId", "data-v-07901c91"]]), Xe = {
  none: {
    // bg fully transparent so the parent (glass CathodeContainer) shows
    // through. Same propagation pattern as CanvasGrid's `none` theme.
    bg: "rgba(0,0,0,0)",
    text: "#e8f2ff",
    border: "#2a3a50",
    accent: "#40a0f0",
    rowAlt: "rgba(255,255,255,0.018)",
    levelInfo: "#c0d0e0",
    levelWarn: "#f0c878",
    levelError: "#f38080",
    levelDebug: "#7090a8",
    levelSuccess: "#80d0a0",
    timestamp: "#6a90b8"
  },
  paper: {
    // bg fully transparent for day-mode glass propagation.
    bg: "rgba(0,0,0,0)",
    text: "#222222",
    border: "#dee2e6",
    accent: "#158cba",
    rowAlt: "rgba(21,140,186,0.04)",
    levelInfo: "#444444",
    levelWarn: "#a06000",
    levelError: "#c0392b",
    levelDebug: "#888888",
    levelSuccess: "#1a8038",
    timestamp: "#888888"
  },
  phosphor: {
    bg: "#060d06",
    text: "#33ff33",
    border: "#0a250a",
    accent: "#80ff80",
    rowAlt: "rgba(51,255,51,0.025)",
    levelInfo: "#33ff33",
    levelWarn: "#bbff33",
    levelError: "#ff5050",
    levelDebug: "#22aa22",
    levelSuccess: "#00ff80",
    timestamp: "#00cc00"
  },
  amber: {
    bg: "#0a0700",
    text: "#ffb000",
    border: "#2a1500",
    accent: "#ffd060",
    rowAlt: "rgba(255,176,0,0.025)",
    levelInfo: "#ffb000",
    levelWarn: "#ffd000",
    levelError: "#ff5000",
    levelDebug: "#aa7000",
    levelSuccess: "#ffe040",
    timestamp: "#ffd000"
  }
};
function Sl(t, l) {
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
const Cl = 12, we = 18, Je = 10, Ve = 6, vt = `${Cl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Tl(t, l, e) {
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
    const d = a.split(/(\s+)/);
    let s = "";
    for (const v of d) {
      const f = s + v;
      if (t.measureText(f).width <= e)
        s = f;
      else if (s && (n.push(s.replace(/\s+$/, "")), s = ""), t.measureText(v).width > e) {
        let u = "";
        for (const i of v)
          t.measureText(u + i).width > e ? (u && n.push(u), u = i) : u += i;
        s = u;
      } else
        s = v.replace(/^\s+/, "");
    }
    s && n.push(s.replace(/\s+$/, ""));
  }
  return n.length ? n : [""];
}
function Yt(t) {
  if (typeof t == "number") {
    const l = new Date(t), e = String(l.getHours()).padStart(2, "0"), n = String(l.getMinutes()).padStart(2, "0"), a = String(l.getSeconds()).padStart(2, "0");
    return `${e}:${n}:${a}`;
  }
  return t;
}
function kl(t, l) {
  return Math.ceil(t.measureText(l).width) + 12;
}
function Il(t) {
  const { entries: l, ctx: e, textMaxWidth: n, showTimestamps: a, wordWrap: d } = t, s = t.formatTs ?? Yt;
  e.font = vt;
  const v = [];
  for (let f = 0; f < l.length; f++) {
    const u = l[f], i = u.level ?? "info", w = a && u.ts != null ? s(u.ts) : "", b = d ? Tl(e, u.text, n) : u.text.split(`
`);
    for (let S = 0; S < b.length; S++)
      v.push({
        entryIdx: f,
        text: b[S],
        level: i,
        timestamp: S === 0 ? w : "",
        isFirstFrag: S === 0
      });
  }
  return v;
}
function Et(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, d = Xe[l.theme] ?? Xe.none;
  e.clearRect(0, 0, n, a), e.fillStyle = d.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip(), e.font = vt, e.textBaseline = "middle";
  const s = l.visualLines, v = Je, f = l.showTimestamps ? Je + l.timestampWidth : Je, u = Math.max(0, Math.floor((l.scrollY - Ve) / we)), i = Math.min(s.length, Math.ceil((l.scrollY + a - Ve) / we) + 1);
  for (let w = u; w < i; w++) {
    const b = s[w], S = Ve + w * we - l.scrollY + we / 2;
    if (b.entryIdx % 2 === 1 && b.isFirstFrag) {
      e.fillStyle = d.rowAlt;
      let h = 1;
      for (; w + h < i && s[w + h].entryIdx === b.entryIdx; ) h++;
      e.fillRect(0, S - we / 2, n, we * h);
    }
    w === l.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, S - we / 2, n, we)), l.showTimestamps && b.timestamp && (e.fillStyle = d.timestamp, e.textAlign = "left", l.glow && (e.shadowBlur = 3, e.shadowColor = d.timestamp), e.fillText(b.timestamp, v, S), e.shadowBlur = 0);
    const g = Sl(d, b.level);
    e.fillStyle = g, e.textAlign = "left", l.glow && (e.shadowBlur = 4, e.shadowColor = g), e.fillText(b.text, f, S), e.shadowBlur = 0;
  }
  e.restore();
}
function Ll(t, l, e) {
  if (t < 0) return -1;
  const n = Math.floor((t + l - Ve) / we);
  return n < 0 || n >= e ? -1 : n;
}
function Dl(t) {
  return Ve * 2 + t * we;
}
const El = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Rl = `
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
      float vign = 1.0 - dot(vc, vc) * 1.5;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`, Fl = /* @__PURE__ */ Ne({
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
    const e = t, n = _(null), a = _(null), d = _(0), s = _(0), v = _(0), f = _(-1), u = _(!0), i = G(() => {
      const E = e.entries ?? [];
      return e.maxLines > 0 && E.length > e.maxLines ? E.slice(E.length - e.maxLines) : E;
    }), w = G(() => {
      if (!e.showTimestamps) return "";
      const E = e.formatTs ?? Yt;
      let Y = "00:00:00";
      for (const Q of i.value) {
        if (Q.ts == null) continue;
        const Se = E(Q.ts);
        Se.length > Y.length && (Y = Se);
      }
      return Y;
    }), b = _(0), S = _([]);
    function g() {
      if (!x) return;
      const E = x.getContext("2d");
      if (!E) return;
      E.font = vt;
      const Y = e.showTimestamps ? kl(E, w.value) : 0;
      b.value = Y;
      const Q = Math.max(
        1,
        d.value - Je * 2 - Y
      );
      S.value = Il({
        entries: i.value,
        ctx: E,
        textMaxWidth: Q,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const h = G(() => Dl(S.value.length)), c = G(() => Math.max(0, h.value - s.value));
    $(c, () => {
      u.value ? v.value = c.value : v.value = Math.min(v.value, c.value);
    }), $(
      [i, d, () => e.showTimestamps, () => e.wordWrap, w],
      () => {
        g(), Le(V);
      },
      { deep: !1 }
    );
    let m = null, p = !1, M, R, T, C, x;
    function B() {
      if (!(!a.value || !n.value)) {
        x = document.createElement("canvas");
        try {
          m = new O.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          p = !0;
        }
        if (!p && !m.getContext() && (m.dispose(), m = null, p = !0), p) {
          W();
          return;
        }
        m.setPixelRatio(1), m.setClearColor(0, 0), M = new O.Scene(), R = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), C = new O.CanvasTexture(x), C.minFilter = O.LinearFilter, C.magFilter = O.LinearFilter, T = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: C },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: El,
          fragmentShader: Rl,
          transparent: !0
        }), M.add(new O.Mesh(new O.PlaneGeometry(2, 2), T)), W();
      }
    }
    function W() {
      if (!n.value || !m && !p) return;
      const E = n.value.clientWidth, Y = n.value.clientHeight;
      if (!E || !Y) return;
      const Q = x.width !== E || x.height !== Y;
      Q && (x.width = E, x.height = Y, d.value = E, s.value = Y, g(), m ? (Q && C && (C.dispose(), C = new O.CanvasTexture(x), C.minFilter = O.LinearFilter, C.magFilter = O.LinearFilter, T && (T.uniforms.uTex.value = C)), m.setPixelRatio(window.devicePixelRatio || 1), m.setSize(E, Y)) : a.value && (a.value.width = E, a.value.height = Y, a.value.style.width = E + "px", a.value.style.height = Y + "px"), u.value && (v.value = Math.max(0, h.value - s.value)), V());
    }
    function V() {
      if (!(x != null && x.width)) return;
      if (p) {
        if (!a.value) return;
        Et(x, {
          visualLines: S.value,
          scrollY: v.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: b.value,
          hoveredLine: f.value
        });
        const Y = a.value.getContext("2d");
        Y && Y.drawImage(x, 0, 0);
        return;
      }
      if (!m || !T || !C) return;
      const E = e.theme === "paper";
      T.uniforms.uStrength.value = e.curvature / 45 * 0.55, T.uniforms.uScanlines.value = e.scanlines && !E ? 1 : 0, T.uniforms.uVignette.value = E ? 0 : 1, Et(x, {
        visualLines: S.value,
        scrollY: v.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: b.value,
        hoveredLine: f.value
      }), C.needsUpdate = !0, m.render(M, R);
    }
    $(() => e.theme, () => V()), $(() => e.curvature, () => V()), $(() => e.scanlines, () => V()), $(() => e.glow, () => V()), $(v, () => V()), $(f, () => V());
    function U(E) {
      if (!a.value) return [-1, -1];
      const Y = a.value.getBoundingClientRect();
      return [E.clientX - Y.left, E.clientY - Y.top];
    }
    function q(E) {
      v.value = Math.max(0, Math.min(c.value, E)), u.value = v.value >= c.value - 4;
    }
    function ve(E) {
      q(v.value + E.deltaY);
    }
    let X = !1, ie = 0, xe = 0;
    function j(E) {
      X = !0, ie = E.clientY, xe = v.value;
    }
    function Te(E) {
      if (X) {
        const Y = ie - E.clientY;
        q(xe + Y);
      }
    }
    function ke() {
      X && (X = !1);
    }
    function F(E) {
      const [, Y] = U(E);
      if (Y < 0) {
        f.value = -1;
        return;
      }
      f.value = Ll(Y, v.value, S.value.length);
    }
    function H() {
      f.value = -1;
    }
    l({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        u.value = !0, v.value = c.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(E) {
        q(Ve + E * we);
      }
    });
    let Z = null, ee = null, D = 0;
    const A = lt("cathodeResetTick", _(0));
    $(A, () => P());
    function P() {
      cancelAnimationFrame(D), D = requestAnimationFrame(W);
    }
    function me(E) {
      E.preventDefault();
    }
    function ce() {
      m == null || m.dispose(), m = null, p = !1, B();
    }
    We(() => {
      document.addEventListener("mousemove", Te), document.addEventListener("mouseup", ke), Le(() => {
        var E;
        B(), a.value && (a.value.addEventListener("webglcontextlost", me), a.value.addEventListener("webglcontextrestored", ce)), n.value && (Z = new ResizeObserver(() => W()), Z.observe(n.value), ee = new IntersectionObserver((Y) => {
          Y.some((Q) => Q.isIntersecting) && P();
        }), ee.observe(n.value)), window.addEventListener("resize", P), (E = window.visualViewport) == null || E.addEventListener("resize", P), v.value = c.value;
      });
    }), je(() => {
      var E, Y, Q;
      document.removeEventListener("mousemove", Te), document.removeEventListener("mouseup", ke), (E = a.value) == null || E.removeEventListener("webglcontextlost", me), (Y = a.value) == null || Y.removeEventListener("webglcontextrestored", ce), Z == null || Z.disconnect(), ee == null || ee.disconnect(), window.removeEventListener("resize", P), (Q = window.visualViewport) == null || Q.removeEventListener("resize", P), cancelAnimationFrame(D), m == null || m.dispose();
    });
    const Me = G(() => Xe[e.theme] ?? Xe.none), Ee = G(() => ({
      background: Me.value.bg
    }));
    return (E, Y) => (oe(), ae("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: fe(Ee.value)
    }, [
      K("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: Re(ve, ["prevent"]),
        onMousemove: F,
        onMouseleave: H,
        onMousedown: j
      }, null, 544)
    ], 4));
  }
}), Bl = /* @__PURE__ */ Ge(Fl, [["__scopeId", "data-v-d2d092f3"]]), _l = { class: "cathode-terminal-wrap" }, Al = { class: "cathode-terminal-scrollback" }, zl = ["placeholder", "disabled"], Wl = /* @__PURE__ */ Ne({
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
    placeholder: { default: "type a command…" },
    disabled: { type: Boolean, default: !1 },
    busy: { type: Boolean, default: !1 },
    historyLimit: { default: 100 }
  },
  emits: ["submit"],
  setup(t, { expose: l, emit: e }) {
    const n = t, a = e, d = _(null), s = _(""), v = _([]), f = _(-1);
    let u = "";
    function i(c) {
      c.trim() && (v.value.length && v.value[v.value.length - 1] === c || (v.value.push(c), v.value.length > n.historyLimit && v.value.splice(0, v.value.length - n.historyLimit)));
    }
    function w(c) {
      if (!n.disabled) {
        if (c.key === "Enter") {
          c.preventDefault();
          const m = s.value;
          if (!m.trim()) return;
          i(m), f.value = -1, s.value = "", a("submit", m);
          return;
        }
        if (c.key === "ArrowUp") {
          if (!v.value.length) return;
          c.preventDefault(), f.value === -1 ? (u = s.value, f.value = v.value.length - 1) : f.value > 0 && f.value--, s.value = v.value[f.value];
          return;
        }
        if (c.key === "ArrowDown") {
          if (f.value === -1) return;
          c.preventDefault(), f.value < v.value.length - 1 ? (f.value++, s.value = v.value[f.value]) : (f.value = -1, s.value = u, u = "");
          return;
        }
      }
    }
    const b = G(() => Xe[n.theme] ?? Xe.none), S = G(() => ({
      color: b.value.text,
      caretColor: b.value.text,
      // Subtle bottom border in the theme's accent (gridline) colour
      borderColor: b.value.border,
      background: "transparent"
    })), g = G(() => ({
      color: b.value.text,
      opacity: n.disabled || n.busy ? 0.5 : 1
    }));
    function h() {
      var c;
      (c = d.value) == null || c.focus();
    }
    return l({ focus: h }), We(() => {
      n.disabled || requestAnimationFrame(() => {
        var c;
        return (c = d.value) == null ? void 0 : c.focus();
      });
    }), (c, m) => (oe(), ae("div", _l, [
      K("div", Al, [
        zt(Bl, {
          entries: t.entries,
          theme: t.theme,
          curvature: t.curvature,
          scanlines: t.scanlines,
          glow: t.glow,
          "show-timestamps": t.showTimestamps,
          "format-ts": t.formatTs,
          "word-wrap": t.wordWrap,
          autoscroll: t.autoscroll,
          "max-lines": t.maxLines
        }, null, 8, ["entries", "theme", "curvature", "scanlines", "glow", "show-timestamps", "format-ts", "word-wrap", "autoscroll", "max-lines"])
      ]),
      K("div", {
        class: "cathode-terminal-inputrow",
        style: fe({ borderTopColor: b.value.border })
      }, [
        K("span", {
          class: "cathode-terminal-prompt",
          style: fe(g.value),
          "data-testid": "ct-prompt"
        }, be(t.prompt), 5),
        Wt(K("input", {
          ref_key: "inputEl",
          ref: d,
          "onUpdate:modelValue": m[0] || (m[0] = (p) => s.value = p),
          placeholder: t.busy ? "…" : t.placeholder,
          disabled: t.disabled || t.busy,
          style: fe(S.value),
          class: "cathode-terminal-input",
          spellcheck: "false",
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          type: "text",
          "data-testid": "ct-input",
          onKeydown: w
        }, null, 44, zl), [
          [ol, s.value]
        ]),
        t.busy ? (oe(), ae("span", {
          key: 0,
          class: "cathode-terminal-spinner",
          style: fe({ color: b.value.text })
        }, "▮", 4)) : ye("", !0)
      ], 4)
    ]));
  }
}), Fn = /* @__PURE__ */ Ge(Wl, [["__scopeId", "data-v-3290c5a2"]]), Qe = {
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
}, Yl = 0.18, qe = 8, mt = 22, Hl = 4, De = 8, ze = 56, Ht = 42, Fe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Pl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ct = 4, $l = 1, Ol = 1;
function Vl(t, l, e, n = 0, a = !1) {
  const d = a ? Ht : ze, s = Math.max(0, l - De - d), v = Math.max(1, Math.floor(s / e)), f = Math.min(v, t);
  return { firstIdx: Math.max(0, t - f - Math.floor(n / e)), count: f, slotW: e };
}
function Xl(t, l, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, a = -1 / 0, d = 0;
  const s = Math.min(t.length, l + e);
  for (let f = l; f < s; f++) {
    const u = t[f];
    u && (u.low < n && (n = u.low), u.high > a && (a = u.high), u.volume > d && (d = u.volume));
  }
  if (!isFinite(n) || !isFinite(a) || n === a) {
    const f = isFinite(n) ? n : 0;
    return { min: f - 1, max: f + 1, maxVol: Math.max(1, d) };
  }
  const v = (a - n) * 0.04;
  return { min: n - v, max: a + v, maxVol: Math.max(1, d) };
}
function Nl(t, l, e = !1) {
  const n = e ? Hl : mt, a = Math.max(1, t - qe - n - ct), d = Math.max(0, Math.round(a * l)), s = a - d;
  return {
    priceY0: qe,
    priceY1: qe + s,
    volumeY0: qe + s + ct,
    volumeY1: qe + s + ct + d
  };
}
function Ce(t, l, e, n) {
  const a = l.max - l.min;
  return a <= 0 ? (e + n) / 2 : e + (1 - (t - l.min) / a) * (n - e);
}
function Be(t, l, e) {
  return De + (t - l + 0.5) * e;
}
function Ae(t) {
  const l = Math.abs(t), e = l >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : l >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : l >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : l >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function ht(t) {
  const l = new Date(t), e = String(l.getMonth() + 1).padStart(2, "0"), n = String(l.getDate()).padStart(2, "0"), a = String(l.getHours()).padStart(2, "0"), d = String(l.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${a}:${d}`;
}
function Gl(t, l) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, l), n = Math.pow(10, Math.floor(Math.log10(e))), a = e / n;
  let d;
  return a < 1.5 ? d = 1 : a < 3 ? d = 2 : a < 7 ? d = 5 : d = 10, d * n;
}
function Rt(t, l) {
  var S, g, h, c, m;
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, d = Qe[l.theme] ?? Qe.none, s = l.colors ? { ...d, ...l.colors } : d, v = !!l.compact;
  if (e.clearRect(0, 0, n, a), e.fillStyle = s.bg, e.fillRect(0, 0, n, a), !l.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const f = Vl(l.candles.length, n, l.slotW, l.scrollX, v), u = Xl(l.candles, f.firstIdx, f.count), i = Nl(a, l.showVolume ? l.volumeFraction : 0, v), w = Math.max($l, Math.floor(l.slotW * 0.7)), b = Math.min(l.candles.length, f.firstIdx + f.count);
  for (let p = f.firstIdx; p < b; p++) {
    const M = l.candles[p];
    if (!M) continue;
    const R = Be(p, f.firstIdx, l.slotW), T = Ce(M.open, u, i.priceY0, i.priceY1), C = Ce(M.close, u, i.priceY0, i.priceY1), x = Ce(M.high, u, i.priceY0, i.priceY1), B = Ce(M.low, u, i.priceY0, i.priceY1), W = M.close >= M.open, V = W ? s.wickBull : s.wickBear, U = W ? s.candleBull : s.candleBear;
    l.glow && (e.shadowBlur = 4, e.shadowColor = U), e.strokeStyle = V, e.lineWidth = Ol, e.beginPath(), e.moveTo(Math.round(R) + 0.5, x), e.lineTo(Math.round(R) + 0.5, B), e.stroke(), e.fillStyle = U;
    const q = Math.min(T, C), ve = Math.max(1, Math.abs(C - T));
    if (e.fillRect(
      Math.round(R - w / 2),
      Math.round(q),
      w,
      Math.round(ve)
    ), e.shadowBlur = 0, l.showVolume && u.maxVol > 0) {
      const X = Math.round(M.volume / u.maxVol * (i.volumeY1 - i.volumeY0));
      X > 0 && (e.fillStyle = W ? s.volumeBull : s.volumeBear, e.fillRect(
        Math.round(R - w / 2),
        i.volumeY1 - X,
        w,
        X
      ));
    }
  }
  if ((S = l.overlays) != null && S.length)
    for (const p of l.overlays) Ul(e, p, f, u, i, l.slotW);
  (g = l.markers) != null && g.length && tn(e, s, l.markers, l.candles, f, u, i, l.slotW), ln(e, s, u, i, n, v), v || (nn(e, s, l.candles, f, l.slotW, a), Ql(e, s, l.candles, n, a)), (h = l.overlays) != null && h.length && ql(e, s, l.overlays, i), l.hover && (on(e, s, l.candles, f, u, i, l.slotW, l.hover, n), jl(e, s, l.candles, f, l.slotW, l.hover, i, ((c = l.overlays) == null ? void 0 : c.length) ?? 0), (m = l.markers) != null && m.length && Jl(e, s, l.markers, l.candles, f, u, i, l.slotW, l.hover, n)), e.restore();
}
function Ul(t, l, e, n, a, d) {
  var v;
  const s = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    De,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), l.kind === "line")
    Ze(t, l.data, e.firstIdx, s, d, n, a, l.color, l.lineWidth ?? 1, l.dashed === !0);
  else {
    const f = Pt(l.color, l.fillAlpha ?? 0.08);
    Kl(t, l.upper, l.lower, e.firstIdx, s, d, n, a, f), Ze(t, l.upper, e.firstIdx, s, d, n, a, l.color, 1, !1), Ze(t, l.lower, e.firstIdx, s, d, n, a, l.color, 1, !1), (v = l.middle) != null && v.length && Ze(t, l.middle, e.firstIdx, s, d, n, a, l.color, 1, l.middleDashed !== !1);
  }
  t.restore();
}
function Ze(t, l, e, n, a, d, s, v, f, u) {
  if (!l || !l.length) return;
  t.strokeStyle = v, t.lineWidth = f, t.setLineDash(u ? [4, 3] : []), t.beginPath();
  let i = !1;
  for (let w = e; w < n; w++) {
    const b = l[w];
    if (typeof b != "number" || !isFinite(b)) {
      i && (t.stroke(), t.beginPath(), i = !1);
      continue;
    }
    const S = Be(w, e, a), g = Ce(b, d, s.priceY0, s.priceY1);
    i ? t.lineTo(S, g) : (t.moveTo(S, g), i = !0);
  }
  i && t.stroke(), t.setLineDash([]);
}
function Kl(t, l, e, n, a, d, s, v, f) {
  if (!(l != null && l.length) || !(e != null && e.length)) return;
  t.fillStyle = f;
  let u = !1, i = -1;
  for (let w = n; w <= a; w++) {
    const b = l[w], S = e[w], g = w < a && typeof b == "number" && typeof S == "number" && isFinite(b) && isFinite(S);
    if (g && !u && (i = w, u = !0), !g && u || w === a && u) {
      const h = g ? w + 1 : w;
      t.beginPath();
      for (let c = i; c < h; c++) {
        const m = Be(c, n, d), p = Ce(l[c], s, v.priceY0, v.priceY1);
        c === i ? t.moveTo(m, p) : t.lineTo(m, p);
      }
      for (let c = h - 1; c >= i; c--) {
        const m = Be(c, n, d), p = Ce(e[c], s, v.priceY0, v.priceY1);
        t.lineTo(m, p);
      }
      t.closePath(), t.fill(), u = !1;
    }
  }
}
function Pt(t, l) {
  const e = Math.max(0, Math.min(1, l));
  if (t.startsWith("#") && t.length === 7) {
    const n = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), d = parseInt(t.slice(5, 7), 16);
    return `rgba(${n},${a},${d},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function ql(t, l, e, n) {
  const a = e.filter((h) => !!h.label);
  if (!a.length) return;
  t.save(), t.font = Fe;
  const d = 8, s = 5, v = 12, f = 6, u = 14;
  let i = 0;
  for (const h of a) {
    const c = t.measureText(h.label).width;
    c > i && (i = c);
  }
  const w = d * 2 + v + f + i, b = s * 2 + u * a.length, S = De + 4, g = n.priceY0 + 4;
  t.fillStyle = l.panelBg, t.fillRect(S, g, w, b), t.textBaseline = "middle", t.textAlign = "left";
  for (let h = 0; h < a.length; h++) {
    const c = a[h], m = g + s + u * (h + 0.5), p = S + d;
    c.kind === "line" ? (t.strokeStyle = c.color, t.lineWidth = c.lineWidth ?? 1, t.setLineDash(c.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(p, m), t.lineTo(p + v, m), t.stroke(), t.setLineDash([])) : (t.fillStyle = Pt(c.color, c.fillAlpha ?? 0.2), t.fillRect(p, m - 4, v, 8), t.strokeStyle = c.color, t.lineWidth = 1, t.strokeRect(p + 0.5, m - 4 + 0.5, v - 1, 7)), t.fillStyle = l.text, t.fillText(c.label, p + v + f, m);
  }
  t.restore();
}
function jl(t, l, e, n, a, d, s, v) {
  const f = Math.floor((d.x - De) / a), u = n.firstIdx + f;
  if (u < 0 || u >= e.length) return;
  const i = e[u];
  if (!i) return;
  const w = i.close - i.open, b = i.open !== 0 ? w / i.open * 100 : 0, S = w >= 0 ? "+" : "", g = [
    ["O", Ae(i.open), void 0],
    ["H", Ae(i.high), void 0],
    ["L", Ae(i.low), void 0],
    ["C", Ae(i.close), void 0],
    ["V", Zl(i.volume), void 0],
    ["", `${S}${b.toFixed(2)}%`, w >= 0 ? l.candleBull : l.candleBear]
  ];
  t.save(), t.font = Fe, t.textBaseline = "middle", t.textAlign = "left";
  const h = 8, c = 4, m = 14;
  let p = h;
  for (const [C, x] of g) {
    const B = C ? `${C} ${x}` : x, W = t.measureText(B).width + 12;
    p += W;
  }
  p += h - 12;
  const M = s.priceY0 + 4 + (v > 0 ? c * 2 + 14 * v + 4 : 0), R = De + 4;
  t.fillStyle = l.panelBg, t.fillRect(R, M, p, m + c * 2);
  let T = R + h;
  for (let C = 0; C < g.length; C++) {
    const [x, B, W] = g[C];
    t.fillStyle = l.text, x && (t.globalAlpha = 0.6, t.fillText(x + " ", T, M + c + m / 2), t.globalAlpha = 1, T += t.measureText(x + " ").width), W && (t.fillStyle = W), t.fillText(B, T, M + c + m / 2), T += t.measureText(B).width + 12;
  }
  t.restore();
}
function Zl(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function Jl(t, l, e, n, a, d, s, v, f, u) {
  if (!n.length) return;
  const i = n.length > 1 ? n[1].start - n[0].start : 6e4, w = Math.max(1, i * 0.5), b = Math.min(n.length, a.firstIdx + a.count), S = 9;
  let g = null;
  for (const B of e) {
    let W = 0, V = n.length - 1, U = -1;
    for (; W <= V; ) {
      const X = W + V >> 1, ie = n[X].start - B.timestamp;
      if (Math.abs(ie) <= w) {
        U = X;
        break;
      }
      ie < 0 ? W = X + 1 : V = X - 1;
    }
    if (U < 0 || U < a.firstIdx || U >= b) continue;
    const q = Be(U, a.firstIdx, v), ve = Ce(B.price, d, s.priceY0, s.priceY1);
    if (Math.abs(f.x - q) <= S && Math.abs(f.y - ve) <= S) {
      g = { m: B, x: q, y: ve };
      break;
    }
  }
  if (!g) return;
  const h = ht(g.m.timestamp), c = [
    `${g.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${h}`,
    `@ ${Ae(g.m.price)}`
  ];
  g.m.label && c.push(g.m.label), t.save(), t.font = Fe, t.textBaseline = "top", t.textAlign = "left";
  const m = 6, p = 14;
  let M = 0;
  for (const B of c) {
    const W = t.measureText(B).width;
    W > M && (M = W);
  }
  const R = M + m * 2, T = c.length * p + m * 2;
  let C = g.x + 12;
  C + R > u - ze && (C = g.x - 12 - R);
  let x = g.y - T / 2;
  x < s.priceY0 && (x = s.priceY0), x + T > s.priceY1 && (x = s.priceY1 - T), t.fillStyle = l.panelBgSolid, t.strokeStyle = g.m.kind === "entry" ? l.markerEntry : l.markerExit, t.lineWidth = 1, t.fillRect(C, x, R, T), t.strokeRect(C + 0.5, x + 0.5, R - 1, T - 1);
  for (let B = 0; B < c.length; B++) {
    const W = c[B];
    t.fillStyle = B === 0 ? g.m.kind === "entry" ? l.markerEntry : l.markerExit : l.text, t.fillText(W, C + m, x + m + B * p);
  }
  t.restore();
}
function Ql(t, l, e, n, a) {
  if (e.length < 2) return;
  const d = e[1].start - e[0].start, s = en(d);
  if (!s) return;
  t.save(), t.font = Fe, t.textBaseline = "top", t.textAlign = "right";
  const v = 6, f = 3, u = t.measureText(s).width, i = n - ze - v, w = a - mt + 4;
  t.fillStyle = l.accent, t.fillRect(i - u - v, w - f, u + v * 2, 14 + f * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(s, i, w), t.restore();
}
function en(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const l = 1e3, e = 60 * l, n = 60 * e, a = 24 * n, d = 7 * a;
  return t >= d && t % d === 0 ? t / d + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= n && t % n === 0 ? t / n + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= l && t % l === 0 ? t / l + "s" : Math.round(t / e) + "m";
}
function tn(t, l, e, n, a, d, s, v) {
  if (!n.length) return;
  const f = n.length > 1 ? n[1].start - n[0].start : 6e4, u = Math.max(1, f * 0.5), i = Math.min(n.length, a.firstIdx + a.count), w = (S) => {
    let g = 0, h = n.length - 1;
    for (; g <= h; ) {
      const c = g + h >> 1, m = n[c].start - S;
      if (Math.abs(m) <= u) return c;
      m < 0 ? g = c + 1 : h = c - 1;
    }
    return -1;
  }, b = 7;
  for (const S of e) {
    const g = w(S.timestamp);
    if (g < 0 || g < a.firstIdx || g >= i) continue;
    const h = Be(g, a.firstIdx, v), c = Ce(S.price, d, s.priceY0, s.priceY1);
    if (c < s.priceY0 || c > s.priceY1) continue;
    const m = S.color ?? (S.kind === "entry" ? l.markerEntry : l.markerExit);
    t.fillStyle = m, t.strokeStyle = l.panelBgSolid, t.lineWidth = 1, t.beginPath(), S.kind === "entry" ? (t.moveTo(h, c - b), t.lineTo(h - b, c + b - 1), t.lineTo(h + b, c + b - 1)) : (t.moveTo(h, c + b), t.lineTo(h - b, c - b + 1), t.lineTo(h + b, c - b + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function ln(t, l, e, n, a, d = !1) {
  const s = e.max - e.min;
  if (s <= 0) return;
  const v = n.priceY1 - n.priceY0, f = d ? Math.max(2, Math.min(4, Math.round(v / 36))) : 6, u = Gl(s, f), i = Math.ceil(e.min / u) * u, w = d ? Ht : ze;
  t.font = d ? Pl : Fe, t.fillStyle = l.text, t.strokeStyle = l.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let b = i; b <= e.max; b += u) {
    const S = Ce(b, e, n.priceY0, n.priceY1);
    S < n.priceY0 || S > n.priceY1 || (t.beginPath(), t.moveTo(De, Math.round(S) + 0.5), t.lineTo(a - w, Math.round(S) + 0.5), t.stroke(), t.fillText(Ae(b), a - w + 3, S));
  }
  t.globalAlpha = 1;
}
function nn(t, l, e, n, a, d) {
  if (n.count <= 0 || !e.length) return;
  const v = Math.max(1, Math.floor(n.count / 6));
  t.font = Fe, t.fillStyle = l.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const f = Math.min(e.length, n.firstIdx + n.count);
  for (let u = n.firstIdx; u < f; u += v) {
    const i = e[u];
    if (!i) continue;
    const w = Be(u, n.firstIdx, a);
    t.fillText(ht(i.start), w, d - mt + 4);
  }
  t.globalAlpha = 1;
}
function on(t, l, e, n, a, d, s, v, f) {
  const u = Math.floor((v.x - De) / s), i = Math.max(0, Math.min(e.length - 1, n.firstIdx + u)), w = e[i];
  if (!w) return;
  const b = Be(i, n.firstIdx, s);
  t.save(), t.strokeStyle = l.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(b) + 0.5, d.priceY0), t.lineTo(Math.round(b) + 0.5, d.volumeY1 || d.priceY1), t.stroke();
  const S = Math.max(d.priceY0, Math.min(d.priceY1, v.y));
  t.beginPath(), t.moveTo(De, Math.round(S) + 0.5), t.lineTo(f - ze, Math.round(S) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const g = a.max - a.min;
  if (g > 0) {
    const m = a.max - (S - d.priceY0) / (d.priceY1 - d.priceY0) * g, p = Ae(m);
    t.font = Fe, t.textBaseline = "middle", t.textAlign = "left";
    const M = t.measureText(p).width, R = 4, T = 2;
    t.fillStyle = l.accent, t.fillRect(f - ze + 2, S - 7 - T, M + R * 2, 14 + T * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(p, f - ze + 2 + R, S);
  }
  t.font = Fe, t.textBaseline = "top", t.textAlign = "center";
  const h = ht(w.start), c = t.measureText(h).width;
  t.fillStyle = l.accent, t.fillRect(b - c / 2 - 4, d.volumeY1 + 2, c + 8, 14), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(h, b, d.volumeY1 + 4), t.restore();
}
const Ft = 0.25, Bt = 6, an = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, rn = `
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
      float vign = 1.0 - dot(vc, vc) * 1.5;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`, sn = /* @__PURE__ */ Ne({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Yl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {}
  },
  setup(t) {
    const l = t, e = _(null), n = _(null), a = _(0), d = _(0), s = _(0), v = _(1), f = _(null), u = G(() => Math.max(1, l.slotW * v.value));
    let i = null, w = !1, b, S, g, h, c;
    function m() {
      if (!(!n.value || !e.value)) {
        if (c = document.createElement("canvas"), l.flat) {
          w = !0, p();
          return;
        }
        try {
          i = new O.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0 });
        } catch {
          w = !0;
        }
        if (!w && !i.getContext() && (i.dispose(), i = null, w = !0), w) {
          p();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), b = new O.Scene(), S = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new O.CanvasTexture(c), h.minFilter = O.LinearFilter, h.magFilter = O.LinearFilter, g = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: an,
          fragmentShader: rn,
          transparent: !0
        }), b.add(new O.Mesh(new O.PlaneGeometry(2, 2), g)), p();
      }
    }
    function p() {
      if (!e.value || !i && !w) return;
      const D = e.value.clientWidth, A = e.value.clientHeight;
      !D || !A || !(c.width !== D || c.height !== A) || (c.width = D, c.height = A, a.value = D, d.value = A, i ? (h && (h.dispose(), h = new O.CanvasTexture(c), h.minFilter = O.LinearFilter, h.magFilter = O.LinearFilter, g && (g.uniforms.uTex.value = h)), i.setPixelRatio(window.devicePixelRatio || 1), i.setSize(D, A)) : n.value && (n.value.width = D, n.value.height = A, n.value.style.width = D + "px", n.value.style.height = A + "px"), M());
    }
    function M() {
      if (!(c != null && c.width)) return;
      if (w) {
        if (!n.value) return;
        Rt(c, {
          candles: l.candles,
          slotW: u.value,
          scrollX: s.value,
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
        A && (A.clearRect(0, 0, n.value.width, n.value.height), A.drawImage(c, 0, 0));
        return;
      }
      if (!i || !g || !h) return;
      const D = l.theme === "paper";
      g.uniforms.uStrength.value = l.curvature / 45 * 0.55, g.uniforms.uScanlines.value = l.scanlines && !D ? 1 : 0, g.uniforms.uVignette.value = D ? 0 : 1, Rt(c, {
        candles: l.candles,
        slotW: u.value,
        scrollX: s.value,
        theme: l.theme,
        glow: l.glow,
        showVolume: l.showVolume,
        volumeFraction: l.volumeFraction,
        hover: f.value,
        overlays: l.overlays,
        markers: l.markers,
        compact: l.compact,
        colors: l.colors
      }), h.needsUpdate = !0, i.render(b, S);
    }
    $(() => l.theme, () => M()), $(() => l.curvature, () => M()), $(() => l.scanlines, () => M()), $(() => l.glow, () => M()), $(() => l.showVolume, () => M()), $(() => l.volumeFraction, () => M()), $(() => l.slotW, () => M()), $(() => l.candles, () => M(), { deep: !1 }), $(() => l.overlays, () => M(), { deep: !1 }), $(() => l.markers, () => M(), { deep: !1 }), $(() => l.compact, () => M()), $(() => l.colors, () => M(), { deep: !0 }), $(() => l.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), $(s, () => M()), $(v, () => M()), $(f, () => M()), $(u, () => M());
    let R = null, T = null, C = 0;
    const x = lt("cathodeResetTick", _(0));
    $(x, () => B());
    function B() {
      cancelAnimationFrame(C), C = requestAnimationFrame(p);
    }
    function W(D) {
      D.preventDefault();
    }
    function V() {
      i == null || i.dispose(), i = null, w = !1, m();
    }
    function U(D) {
      if (!n.value) return [-1, -1];
      const A = n.value.getBoundingClientRect();
      return [D.clientX - A.left, D.clientY - A.top];
    }
    function q(D) {
      var Me;
      const A = u.value;
      if (A <= 0) return 0;
      const P = ((Me = l.candles) == null ? void 0 : Me.length) ?? 0, me = Math.max(1, Math.floor((a.value || 1) / A)), ce = Math.max(0, P - me);
      return Math.max(0, Math.min(D, ce * A));
    }
    function ve(D) {
      var me;
      if (D.deltaX !== 0 || D.shiftKey && D.deltaY !== 0) {
        const ce = D.deltaX !== 0 ? D.deltaX : D.deltaY;
        s.value = q(s.value + ce);
        return;
      }
      if (D.deltaY === 0) return;
      const [A] = U(D), P = u.value;
      if (A >= 0 && P > 0 && ((me = l.candles) != null && me.length)) {
        const ce = Math.max(1, Math.floor((a.value || 1) / P)), Ee = Math.max(0, l.candles.length - ce - Math.floor(s.value / P)) + (A - 8) / P, E = Math.exp(-D.deltaY * 15e-4), Y = Math.max(Ft, Math.min(Bt, v.value * E));
        v.value = Y;
        const Q = l.slotW * Y, Se = Math.max(1, Math.floor((a.value || 1) / Q)), he = Ee - (A - 8) / Q, J = Math.max(0, l.candles.length - Se - he);
        s.value = q(J * Q);
      } else {
        const ce = Math.exp(-D.deltaY * 15e-4);
        v.value = Math.max(Ft, Math.min(Bt, v.value * ce));
      }
    }
    let X = !1, ie = 0, xe = 0;
    function j(D) {
      D.button === 0 && (X = !0, ie = D.clientX, xe = s.value, f.value = null);
    }
    function Te(D) {
      if (X) {
        const A = D.clientX - ie;
        s.value = q(xe + A);
        return;
      }
    }
    function ke() {
      X = !1;
    }
    function F(D) {
      if (X) return;
      const [A, P] = U(D);
      if (A < 0 || P < 0) {
        f.value = null;
        return;
      }
      f.value = { x: A, y: P };
    }
    function H() {
      f.value = null;
    }
    We(() => {
      document.addEventListener("mousemove", Te), document.addEventListener("mouseup", ke), Le(() => {
        var D;
        m(), n.value && (n.value.addEventListener("webglcontextlost", W), n.value.addEventListener("webglcontextrestored", V)), e.value && (R = new ResizeObserver(() => p()), R.observe(e.value), T = new IntersectionObserver((A) => {
          A.some((P) => P.isIntersecting) && B();
        }), T.observe(e.value)), window.addEventListener("resize", B), (D = window.visualViewport) == null || D.addEventListener("resize", B);
      });
    }), je(() => {
      var D, A, P;
      document.removeEventListener("mousemove", Te), document.removeEventListener("mouseup", ke), (D = n.value) == null || D.removeEventListener("webglcontextlost", W), (A = n.value) == null || A.removeEventListener("webglcontextrestored", V), R == null || R.disconnect(), T == null || T.disconnect(), window.removeEventListener("resize", B), (P = window.visualViewport) == null || P.removeEventListener("resize", B), cancelAnimationFrame(C), i == null || i.dispose();
    });
    const Z = G(() => Qe[l.theme] ?? Qe.none), ee = G(() => ({
      background: Z.value.bg
    }));
    return (D, A) => (oe(), ae("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: fe(ee.value)
    }, [
      K("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-candle-canvas",
        onWheel: Re(ve, ["prevent"]),
        onMousedown: j,
        onMousemove: F,
        onMouseleave: H
      }, null, 544)
    ], 4));
  }
}), Bn = /* @__PURE__ */ Ge(sn, [["__scopeId", "data-v-4673e639"]]), gt = _(0), dt = 28, $e = 12;
let ft = 10, et = "cathode.layout", tt = !1;
const se = _({});
function cn(t, l = "cathode.layout") {
  if (!tt) {
    tt = !0, et = l;
    try {
      const e = localStorage.getItem(et);
      if (e) {
        se.value = JSON.parse(e), _t();
        return;
      }
    } catch {
    }
    se.value = { ...t }, _t();
  }
}
function _t() {
  let t = 10;
  for (const l of Object.values(se.value))
    typeof (l == null ? void 0 : l.zIndex) == "number" && l.zIndex > t && (t = l.zIndex);
  ft = t;
}
function Ye() {
  localStorage.setItem(et, JSON.stringify(se.value));
}
function un(t) {
  tt = !1, localStorage.removeItem(et), se.value = { ...t }, Ye(), tt = !0, gt.value++;
}
function $t(t) {
  ft++, se.value[t] && (se.value[t].zIndex = ft);
}
function dn(t, l) {
  se.value[t].visible = l, Ye();
}
function fn(t, l) {
  se.value[t].minimized = l, l && (se.value[t].maximized = !1), Ye();
}
function vn(t, l) {
  se.value[t].maximized = l, l && (se.value[t].minimized = !1, $t(t)), Ye();
}
function mn(t, l, e) {
  se.value[t].x = Math.round(l), se.value[t].y = Math.round(e), Ye();
}
function hn(t, l, e) {
  se.value[t].w = Math.round(l), se.value[t].h = Math.round(e), Ye();
}
function _n(t, l, e) {
  const n = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / n), d = Math.floor((t - $e * (n + 1)) / n), s = Math.floor((l - $e * (a + 1)) / a), v = {};
  return e.forEach((f, u) => {
    const i = u % n, w = Math.floor(u / n);
    v[f] = {
      x: $e + i * (d + $e),
      y: $e + w * (s + $e),
      w: d,
      h: s,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: u + 1
    };
  }), v;
}
function Ot() {
  return {
    containers: se,
    TITLEBAR_H: dt,
    load: cn,
    save: Ye,
    reset: un,
    bringToFront: $t,
    setVisible: dn,
    setMinimized: fn,
    setMaximized: vn,
    updatePos: mn,
    updateSize: hn
  };
}
const gn = { class: "ws-toolbar" }, pn = {
  key: 0,
  class: "ws-restore-menu"
}, wn = {
  key: 0,
  class: "ws-restore-empty"
}, bn = ["onClick"], yn = /* @__PURE__ */ Ne({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const l = t, { containers: e, load: n, reset: a, setVisible: d } = Ot(), s = _(null);
    Tt("cathodeWorkspace", s), Tt("cathodeResetTick", gt), We(() => {
      if (!s.value) return;
      const { clientWidth: c, clientHeight: m } = s.value, p = l.initialLayout ?? {};
      n(p, l.storageKey ?? "cathode.layout");
      const M = Object.keys(e.value)[0];
      M && v(M);
    });
    function v(c) {
      var p;
      document.querySelectorAll(".cc").forEach((M) => M.classList.remove("cc-focused"));
      const m = (p = s.value) == null ? void 0 : p.querySelector(`#cc-${c}`);
      m && m.classList.add("cc-focused");
    }
    function f() {
      !s.value || !l.initialLayout || a(l.initialLayout);
    }
    function u(c) {
      const m = c.target.closest(".cc");
      m && (document.querySelectorAll(".cc").forEach((p) => p.classList.remove("cc-focused")), m.classList.add("cc-focused"));
    }
    const i = _(!1), w = () => Object.entries(e.value).filter(([, c]) => !c.visible).map(([c]) => c);
    function b(c) {
      d(c, !0), i.value = !1;
    }
    function S(c) {
      if (!i.value) return;
      const m = c.target;
      !m.closest(".ws-restore-menu") && !m.closest(".ws-btn-restore") && (i.value = !1);
    }
    function g(c) {
      c.key === "Escape" && (i.value = !1);
    }
    We(() => {
      document.addEventListener("click", S), document.addEventListener("keydown", g);
    }), je(() => {
      document.removeEventListener("click", S), document.removeEventListener("keydown", g);
    });
    function h(c) {
      var m;
      return ((m = l.containerTitles) == null ? void 0 : m[c]) ?? c;
    }
    return (c, m) => (oe(), ae("div", {
      ref_key: "workspaceEl",
      ref: s,
      class: "cathode-workspace",
      onMousedown: u
    }, [
      ut(c.$slots, "default", {}, void 0, !0),
      ut(c.$slots, "overlay", {}, void 0, !0),
      K("div", gn, [
        t.initialLayout ? (oe(), ae("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: f
        }, " ↺ Reset Layout ")) : ye("", !0),
        m[1] || (m[1] = K("div", { class: "ws-sep" }, null, -1)),
        K("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: m[0] || (m[0] = (p) => i.value = !i.value)
        }, " ⊞ Restore Panel ")
      ]),
      zt(al, { name: "menu" }, {
        default: il(() => [
          i.value ? (oe(), ae("div", pn, [
            m[3] || (m[3] = K("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            w().length ? ye("", !0) : (oe(), ae("div", wn, " No closed panels ")),
            (oe(!0), ae(rl, null, sl(w(), (p) => (oe(), ae("div", {
              key: p,
              class: "ws-restore-item",
              onClick: (M) => b(p)
            }, [
              m[2] || (m[2] = K("span", { class: "ws-restore-icon" }, "⊞", -1)),
              cl(" " + be(h(p)), 1)
            ], 8, bn))), 128))
          ])) : ye("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), An = /* @__PURE__ */ Ge(yn, [["__scopeId", "data-v-5838d04b"]]), xn = ["id"], Mn = { class: "cc-title" }, Sn = {
  key: 0,
  class: "cc-size-badge"
}, Cn = { class: "cc-controls" }, Tn = ["title"], kn = { class: "cc-body" }, In = 200, Ln = 80, At = 60, Dn = /* @__PURE__ */ Ne({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const l = t, { containers: e, bringToFront: n, setVisible: a, setMinimized: d, setMaximized: s, updatePos: v, updateSize: f } = Ot(), u = lt("cathodeWorkspace", _(null)), i = G(() => e.value[l.id]), w = G(() => {
      const F = i.value, H = l.curvature ?? 0;
      if (!F) return {};
      const Z = { "--curvature": H };
      return F.maximized ? { ...Z, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: F.zIndex } : {
        ...Z,
        left: F.x + "px",
        top: F.y + "px",
        width: F.w + "px",
        height: F.minimized ? dt + "px" : F.h + "px",
        zIndex: F.zIndex,
        display: F.visible ? "flex" : "none"
      };
    });
    let b = !1, S = 0, g = 0;
    function h(F) {
      var ee;
      if (F.target.closest(".cc-btn") || i.value.maximized) return;
      n(l.id), b = !0;
      const H = (ee = u.value) == null ? void 0 : ee.querySelector(`#cc-${l.id}`);
      if (!H) return;
      const Z = H.getBoundingClientRect();
      S = F.clientX - Z.left, g = F.clientY - Z.top, document.addEventListener("mousemove", c), document.addEventListener("mouseup", m), F.preventDefault();
    }
    function c(F) {
      var A;
      if (!b || !u.value) return;
      const H = u.value.getBoundingClientRect(), Z = ((A = i.value) == null ? void 0 : A.w) ?? 300;
      let ee = F.clientX - H.left - S, D = F.clientY - H.top - g;
      ee = Math.max(At - Z, Math.min(H.width - At, ee)), D = Math.max(0, Math.min(H.height - dt, D)), v(l.id, ee, D);
    }
    function m() {
      b = !1, document.removeEventListener("mousemove", c), document.removeEventListener("mouseup", m);
    }
    let p = !1, M = 0, R = 0, T = 0, C = 0;
    const x = _("");
    function B(F) {
      i.value.maximized || (n(l.id), p = !0, M = F.clientX, R = F.clientY, T = i.value.w, C = i.value.h, document.addEventListener("mousemove", W), document.addEventListener("mouseup", V), F.preventDefault(), F.stopPropagation());
    }
    function W(F) {
      if (!p) return;
      const H = Math.max(In, T + (F.clientX - M)), Z = Math.max(Ln, C + (F.clientY - R));
      f(l.id, H, Z), x.value = `${Math.round(H)}×${Math.round(Z)}`;
    }
    function V() {
      p = !1, x.value = "", document.removeEventListener("mousemove", W), document.removeEventListener("mouseup", V), U.value++;
    }
    const U = _(0);
    $(gt, () => {
      U.value++;
    }), je(() => {
      var F;
      document.removeEventListener("mousemove", c), document.removeEventListener("mouseup", m), document.removeEventListener("mousemove", W), document.removeEventListener("mouseup", V), (F = q.value) == null || F.removeEventListener("scroll", X), ie();
    });
    const q = _(null);
    function ve(F) {
      if (l.canvas) return [];
      const H = F.children[0];
      return H ? Array.from(H.children) : [];
    }
    function X() {
      const F = q.value, H = l.curvature ?? 0;
      if (!F) return;
      const Z = ve(F);
      if (!Z.length) return;
      const ee = F.clientHeight, D = ee / 2, A = H * 38e-4;
      Z.forEach((P) => {
        if (!P.dataset.origFs) {
          const he = getComputedStyle(P);
          P.dataset.origFs = he.fontSize, P.dataset.origLh = he.lineHeight;
        }
        if (H === 0) {
          P.style.fontSize = "", P.style.lineHeight = "";
          return;
        }
        const me = P.getBoundingClientRect(), ce = F.getBoundingClientRect(), Me = me.top - ce.top + me.height / 2, Ee = Math.min(1, Math.abs(Me - D) / (ee / 2)), E = 1 + A * Math.cos(Ee * Math.PI / 2), Y = parseFloat(P.dataset.origFs), Q = P.dataset.origLh, Se = Q === "normal" ? Y * 1.4 : parseFloat(Q);
        isNaN(Y) || (P.style.fontSize = `${(Y * E).toFixed(2)}px`), isNaN(Se) || (P.style.lineHeight = `${(Se * E).toFixed(2)}px`);
      });
    }
    function ie() {
      const F = q.value;
      F && ve(F).forEach((H) => {
        H.style.fontSize = "", H.style.lineHeight = "", delete H.dataset.origFs, delete H.dataset.origLh;
      });
    }
    $(() => l.curvature, (F) => {
      (F ?? 0) === 0 ? ie() : X();
    }), We(() => {
      var F;
      (F = q.value) == null || F.addEventListener("scroll", X, { passive: !0 }), Le(X);
    });
    function xe() {
      d(l.id, !i.value.minimized), Le(() => {
        U.value++;
      });
    }
    function j() {
      s(l.id, !i.value.maximized), Le(() => {
        U.value++;
      });
    }
    function Te() {
      a(l.id, !1);
    }
    function ke() {
      n(l.id);
    }
    return (F, H) => i.value && i.value.visible ? (oe(), ae("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: ul(["cc", { "cc-minimized": i.value.minimized, "cc-maximized": i.value.maximized, "cc-has-canvas": t.canvas }]),
      style: fe(w.value),
      onMousedown: ke
    }, [
      K("div", {
        class: "cc-titlebar",
        onMousedown: h
      }, [
        H[0] || (H[0] = K("span", { class: "cc-status-dot" }, null, -1)),
        K("span", Mn, be(t.title), 1),
        x.value ? (oe(), ae("span", Sn, be(x.value), 1)) : ye("", !0),
        K("div", Cn, [
          K("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Re(xe, ["stop"])
          }, "─"),
          K("button", {
            class: "cc-btn cc-btn-max",
            title: i.value.maximized ? "Restore" : "Maximize",
            onClick: Re(j, ["stop"])
          }, be(i.value.maximized ? "⤡" : "⤢"), 9, Tn),
          K("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Re(Te, ["stop"])
          }, "✕")
        ])
      ], 32),
      Wt(K("div", kn, [
        K("div", {
          ref_key: "bodyEl",
          ref: q,
          class: "cc-screen",
          onScroll: X
        }, [
          ut(F.$slots, "default", { resizeKey: U.value }, void 0, !0),
          H[1] || (H[1] = K("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [dl, !i.value.minimized]
      ]),
      !i.value.minimized && !i.value.maximized ? (oe(), ae("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Re(B, ["stop"])
      }, null, 32)) : ye("", !0)
    ], 46, xn)) : ye("", !0);
  }
}), zn = /* @__PURE__ */ Ge(Dn, [["__scopeId", "data-v-d8a49f79"]]);
export {
  Qe as CANDLE_THEME_COLORS,
  Bn as CathodeCandle,
  zn as CathodeContainer,
  Rn as CathodeGrid,
  Bl as CathodeLog,
  Fn as CathodeTerminal,
  An as CathodeWorkspace,
  Xe as LOG_THEME_COLORS,
  _n as buildDefaultLayout,
  Ot as useCathodeLayout
};
