import { defineComponent as Xe, ref as _, reactive as rt, computed as U, watch as H, inject as lt, nextTick as Te, onMounted as We, onUnmounted as Ne, openBlock as ie, createElementBlock as re, normalizeStyle as xe, createElementVNode as Z, withModifiers as Re, withKeys as nl, createCommentVNode as Se, toDisplayString as Me, createVNode as zt, withDirectives as Wt, vModelText as ol, provide as Tt, renderSlot as ct, Transition as al, withCtx as il, Fragment as rl, renderList as sl, createTextVNode as ul, normalizeClass as cl, vShow as fl } from "vue";
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
}, ae = 30, kt = 12, dl = 10;
function It(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, c = Oe[l.theme] ?? Oe.none, { cols: u, rows: d, pinnedRows: f, rowHeight: s, scrollY: i, scrollX: y, glow: M } = l;
  e.clearRect(0, 0, n, a), e.fillStyle = c.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const C = f.length * s, m = a - ae - C;
  e.fillStyle = c.headerBg, e.fillRect(0, 0, n, ae), e.textBaseline = "middle", e.textAlign = "left";
  let h = -y;
  for (let p = 0; p < u.length; p++) {
    const S = u[p];
    if (h + S.width <= 0) {
      h += S.width;
      continue;
    }
    if (h >= n) break;
    const R = !!l.colFilters[S.colId], w = l.sortColId === S.colId, T = (S.colDef.headerName ?? S.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(h, 0, S.width, ae), e.clip(), e.font = `bold ${dl}px system-ui, -apple-system, sans-serif`, e.fillStyle = R ? c.accent : c.textHeader, M && (e.shadowBlur = 6, e.shadowColor = c.textHeader), e.fillText(T, h + 8, ae / 2), e.shadowBlur = 0, w) {
      const b = e.measureText(T).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = c.accent, e.fillText(l.sortDir === "asc" ? "▲" : "▼", h + 8 + b + 4, ae / 2);
    }
    S.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = R ? c.accent : c.textHeader, e.globalAlpha = R ? 1 : 0.38, e.fillText("⌕", h + S.width - 20, ae / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(h + S.width - 0.5, 0), e.lineTo(h + S.width - 0.5, ae), e.stroke(), h += S.width;
  }
  e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, ae - 0.5), e.lineTo(n, ae - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ae, n, m), e.clip();
  const v = Math.max(0, Math.floor(i / s)), g = Math.min(d.length, Math.ceil((i + m) / s));
  for (let p = v; p < g; p++) {
    const S = d[p], R = ae + p * s - i;
    p % 2 === 1 && (e.fillStyle = c.rowAlt, e.fillRect(0, R, n, s)), p === l.hoveredRow && p !== l.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, R, n, s)), p === l.selectedRow && (e.fillStyle = vl(c.accent, 0.1), e.fillRect(0, R, n, s)), e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, R + s - 0.5), e.lineTo(n, R + s - 0.5), e.stroke();
    let w = -y;
    for (let T = 0; T < u.length; T++) {
      const b = u[T];
      if (w + b.width <= 0) {
        w += b.width;
        continue;
      }
      if (w >= n) break;
      const B = l.getCellStyle(b, S), W = B.color ?? c.text, V = B.textAlign ?? "left", G = l.formatCell(b, S);
      e.save(), e.beginPath(), e.rect(w + 1, R, b.width - 2, s), e.clip(), e.font = `${kt}px system-ui, -apple-system, sans-serif`, e.fillStyle = W, e.textBaseline = "middle", M && (e.shadowBlur = 4, e.shadowColor = W), V === "right" ? (e.textAlign = "right", e.fillText(G, w + b.width - 8, R + s / 2)) : (e.textAlign = "left", e.fillText(G, w + 8, R + s / 2)), e.shadowBlur = 0, e.restore(), p === l.selectedRow && T === l.selectedCol && (e.strokeStyle = c.accent, e.lineWidth = 2, e.strokeRect(w + 1.5, R + 1.5, b.width - 3, s - 3)), e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(w + b.width - 0.5, R), e.lineTo(w + b.width - 0.5, R + s), e.stroke(), w += b.width;
    }
  }
  if (e.restore(), f.length > 0) {
    const p = a - C;
    e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, p - 0.5), e.lineTo(n, p - 0.5), e.stroke();
    for (let S = 0; S < f.length; S++) {
      const R = f[S], w = p + S * s;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, w, n, s);
      let T = -y;
      for (let b = 0; b < u.length; b++) {
        const B = u[b];
        if (T + B.width <= 0) {
          T += B.width;
          continue;
        }
        if (T >= n) break;
        const W = l.getCellStyle(B, R), V = W.color ?? c.text, G = W.textAlign ?? "left", K = l.formatCell(B, R);
        e.save(), e.beginPath(), e.rect(T + 1, w, B.width - 2, s), e.clip(), e.font = `bold ${kt}px system-ui, -apple-system, sans-serif`, e.fillStyle = V, e.textBaseline = "middle", G === "right" ? (e.textAlign = "right", e.fillText(K, T + B.width - 8, w + s / 2)) : (e.textAlign = "left", e.fillText(K, T + 8, w + s / 2)), e.restore(), e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(T + B.width - 0.5, w), e.lineTo(T + B.width - 0.5, w + s), e.stroke(), T += B.width;
      }
      e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, w + s - 0.5), e.lineTo(n, w + s - 0.5), e.stroke();
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
function Dt(t, l, e, n, a, c, u, d, f) {
  const s = t + f;
  let i = -1, y = 0;
  for (let h = 0; h < e.length; h++) {
    if (s >= y && s < y + e[h].width) {
      i = h;
      break;
    }
    y += e[h].width;
  }
  if (l < ae) return { area: "header", colIdx: i, rowIdx: -1 };
  const M = d * a;
  if (M > 0 && l >= u - M) {
    const h = Math.floor((l - (u - M)) / a);
    return { area: "pinned", colIdx: i, rowIdx: h };
  }
  const C = l - ae + c, m = Math.floor(C / a);
  return m >= 0 && m < n ? { area: "body", colIdx: i, rowIdx: m } : { area: "none", colIdx: -1, rowIdx: -1 };
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
`, yl = 28, xl = 600, Ml = /* @__PURE__ */ Xe({
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
    const e = t, n = l, a = _(e.rowData ?? []), c = _(e.pinnedBottomRowData ?? []), u = _(""), d = _(null), f = rt({}), s = rt({}), i = rt(/* @__PURE__ */ new Set()), y = _(0), M = _(0), C = _(0), m = _(0), h = _(0), v = _(-1), g = _(null), p = _(null), S = _({ x: 0, y: ae }), R = _("");
    function w(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const T = U(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((r) => !i.has(w(r))).map((r) => {
        const x = w(r), k = { ...o, ...r };
        return { colId: x, colDef: k, width: s[x] ?? k.width ?? 100 };
      });
    }), b = U(() => {
      const o = M.value;
      if (!o) return T.value;
      const r = T.value.reduce((I, L) => I + L.width, 0);
      if (!r || r >= o) return T.value;
      const x = o / r;
      let k = 0;
      return T.value.map((I, L) => {
        const N = L === T.value.length - 1 ? o - k : Math.max(8, Math.round(I.width * x));
        return k += N, { ...I, width: N };
      });
    }), B = U(() => {
      const o = b.value.reduce((r, x) => r + x.width, 0);
      return Math.max(0, o - M.value);
    }), W = U(() => {
      const o = c.value.length * e.rowHeight;
      return Math.max(0, C.value - ae - o);
    }), V = U(
      () => Math.max(0, q.value.length * e.rowHeight - W.value)
    ), G = U(
      () => Math.max(1, Math.floor(W.value / e.rowHeight))
    ), K = U(
      () => q.value.length === 0 ? 0 : Math.min(q.value.length - 1, Math.floor(m.value / e.rowHeight))
    ), de = U(
      () => Math.min(q.value.length - 1, K.value + G.value - 1)
    );
    function X(o, r) {
      if (r.colDef.valueGetter) return r.colDef.valueGetter({ data: o, colDef: r.colDef });
      if (r.colDef.field) return o[r.colDef.field];
    }
    function oe(o, r) {
      const x = X(r, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: x, data: r, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: x, data: r, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : x == null ? "" : String(x);
    }
    function we(o, r) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: X(r, o), data: r, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const q = U(() => {
      y.value;
      let o = a.value;
      const r = u.value.trim().toLowerCase();
      r && (o = o.filter(
        (x) => T.value.some(
          (k) => String(X(x, k) ?? "").toLowerCase().includes(r)
        )
      ));
      for (const [x, k] of Object.entries(f)) {
        if (!k) continue;
        const I = T.value.find((L) => L.colId === x);
        if (I)
          if (k.startsWith("__eq__")) {
            const L = k.slice(6).toLowerCase();
            o = o.filter((z) => String(X(z, I) ?? "").toLowerCase() === L);
          } else {
            const L = k.toLowerCase();
            o = o.filter((z) => String(X(z, I) ?? "").toLowerCase().includes(L));
          }
      }
      if (d.value) {
        const { colId: x, dir: k } = d.value, I = T.value.find((L) => L.colId === x);
        I && (o = [...o].sort((L, z) => {
          const N = X(L, I), le = X(z, I);
          let ne = 0;
          return I.colDef.comparator ? ne = I.colDef.comparator(N, le) : typeof N == "number" && typeof le == "number" ? ne = N - le : ne = String(N ?? "").localeCompare(String(le ?? ""), void 0, { numeric: !0 }), k === "asc" ? ne : -ne;
        }));
      }
      return o;
    });
    H(q, () => {
      m.value = 0, g.value = null;
    }), H(B, () => {
      h.value = Math.min(h.value, B.value);
    }), H(V, () => {
      m.value = Math.min(m.value, V.value);
    });
    function ke(o) {
      const r = o * e.rowHeight, x = r + e.rowHeight;
      r < m.value ? m.value = r : x > m.value + W.value && (m.value = Math.min(V.value, x - W.value));
    }
    function Ie() {
      m.value = Math.max(0, m.value - W.value), fe();
    }
    function F() {
      m.value = Math.min(V.value, m.value + W.value), fe();
    }
    let P = !1, j = "", ee = 0, D = 0, A = !1, $ = !1, ve = 0, ue = 0, be = 0, Ee = 0, E = !1;
    function Y(o, r) {
      var x;
      P = !0, j = o, ee = r, D = ((x = b.value.find((k) => k.colId === o)) == null ? void 0 : x.width) ?? 100, A = !1;
    }
    function Q(o) {
      if ($) {
        const L = ve - o.clientX, z = ue - o.clientY;
        (Math.abs(L) > 4 || Math.abs(z) > 4) && (E = !0), h.value = Math.max(0, Math.min(B.value, be + L)), m.value = Math.max(0, Math.min(V.value, Ee + z)), fe();
        return;
      }
      if (!P) return;
      const r = M.value, x = Math.max(30, D + (o.clientX - ee)), k = T.value.filter((L) => L.colId !== j).reduce((L, z) => L + z.width, 0), I = r - x;
      I > 10 && (s[j] = Math.max(10, Math.round(x * k / I))), fe();
    }
    function ye() {
      $ && (E && (A = !0), $ = !1), P && (P = !1, A = !0, n("column-resized"));
    }
    const me = _(null), J = _(null), Vt = lt("cathodeResetTick", _(0));
    H(Vt, () => Pe());
    let te = null, _e = !1, nt, pt, Le, he, ce;
    function wt() {
      if (!(!J.value || !me.value)) {
        ce = document.createElement("canvas");
        try {
          te = new O.WebGLRenderer({ canvas: J.value, antialias: !1, alpha: !0 });
        } catch {
          _e = !0;
        }
        if (!_e && !te.getContext() && (te.dispose(), te = null, _e = !0), _e) {
          He();
          return;
        }
        te.setPixelRatio(1), te.setClearColor(0, 0), nt = new O.Scene(), pt = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), he = new O.CanvasTexture(ce), he.minFilter = O.LinearFilter, he.magFilter = O.LinearFilter, Le = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: he },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new O.Color(0) }
          },
          vertexShader: wl,
          fragmentShader: bl,
          transparent: !0
        }), nt.add(new O.Mesh(new O.PlaneGeometry(2, 2), Le)), He();
      }
    }
    function He() {
      if (!me.value || !te && !_e) return;
      const o = me.value.clientWidth, r = me.value.clientHeight - (e.pagination ? yl : 0);
      if (!o || !r) return;
      const x = ce.width !== o || ce.height !== r;
      ce.width = o, ce.height = r, M.value = o, C.value = r, h.value = Math.max(0, Math.min(B.value, h.value)), m.value = Math.max(0, Math.min(V.value, m.value)), te ? (x && he && (he.dispose(), he = new O.CanvasTexture(ce), he.minFilter = O.LinearFilter, he.magFilter = O.LinearFilter, Le && (Le.uniforms.uTex.value = he)), te.setPixelRatio(window.devicePixelRatio || 1), te.setSize(o, r)) : J.value && (J.value.width = o, J.value.height = r, J.value.style.width = o + "px", J.value.style.height = r + "px"), fe();
    }
    function fe() {
      var x, k, I, L, z, N, le, ne;
      if (!(ce != null && ce.width)) return;
      if (_e) {
        if (!J.value) return;
        It(ce, {
          cols: b.value,
          rows: q.value,
          pinnedRows: c.value,
          rowHeight: e.rowHeight,
          scrollY: m.value,
          scrollX: h.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((x = d.value) == null ? void 0 : x.colId) ?? null,
          sortDir: ((k = d.value) == null ? void 0 : k.dir) ?? null,
          colFilters: f,
          hoveredRow: v.value,
          selectedRow: ((I = g.value) == null ? void 0 : I.row) ?? -1,
          selectedCol: ((L = g.value) == null ? void 0 : L.col) ?? -1,
          formatCell: oe,
          getCellStyle: we
        });
        const Ct = J.value.getContext("2d");
        Ct && Ct.drawImage(ce, 0, 0);
        return;
      }
      if (!te || !Le || !he) return;
      const o = Oe[e.theme] ?? Oe.none, r = e.theme === "paper";
      Le.uniforms.uStrength.value = e.curvature / 45 * 0.55, Le.uniforms.uScanlines.value = e.scanlines && !r ? 1 : 0, Le.uniforms.uVignette.value = r ? 0 : 1, Le.uniforms.uBezel.value.set(o.bg), It(ce, {
        cols: b.value,
        rows: q.value,
        pinnedRows: c.value,
        rowHeight: e.rowHeight,
        scrollY: m.value,
        scrollX: h.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((z = d.value) == null ? void 0 : z.colId) ?? null,
        sortDir: ((N = d.value) == null ? void 0 : N.dir) ?? null,
        colFilters: f,
        hoveredRow: v.value,
        selectedRow: ((le = g.value) == null ? void 0 : le.row) ?? -1,
        selectedCol: ((ne = g.value) == null ? void 0 : ne.col) ?? -1,
        formatCell: oe,
        getCellStyle: we
      }), he.needsUpdate = !0, te.render(nt, pt);
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
        at = r, h.value = Math.max(0, Math.min(B.value, h.value + o.deltaX)), fe();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        at = r, h.value = Math.max(0, Math.min(B.value, h.value + o.deltaY)), fe();
        return;
      }
      r - at < xl || (m.value = Math.max(0, Math.min(V.value, m.value + o.deltaY)), fe());
    }
    function Nt(o) {
      if (P) return;
      const [r, x] = ot(o);
      if (r < 0) {
        v.value = -1, fe();
        return;
      }
      const k = Dt(
        r,
        x,
        b.value,
        q.value.length,
        e.rowHeight,
        m.value,
        ce.height,
        c.value.length,
        h.value
      );
      if (v.value = k.area === "body" ? k.rowIdx : -1, k.area === "header" && k.colIdx >= 0) {
        const I = b.value[k.colIdx], L = st(k.colIdx, b.value), z = r + h.value;
        J.value.style.cursor = I && Lt(z, L, I.width) ? "col-resize" : "pointer";
      } else k.area === "body" ? J.value.style.cursor = "pointer" : J.value.style.cursor = "default";
      fe();
    }
    function Gt() {
      v.value = -1, fe();
    }
    function Ut(o) {
      const [r, x] = ot(o);
      if (r < 0) return;
      if (x >= ae) {
        $ = !0, E = !1, ve = o.clientX, ue = o.clientY, be = h.value, Ee = m.value;
        return;
      }
      const k = r + h.value;
      for (let I = 0; I < b.value.length; I++) {
        const L = b.value[I], z = st(I, b.value);
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
      if (P) return;
      const [r, x] = ot(o);
      if (r < 0) {
        p.value = null;
        return;
      }
      const k = Dt(
        r,
        x,
        b.value,
        q.value.length,
        e.rowHeight,
        m.value,
        ce.height,
        c.value.length,
        h.value
      );
      if (k.area === "header" && k.colIdx >= 0) {
        const N = b.value[k.colIdx], le = st(k.colIdx, b.value), ne = r + h.value;
        N.colDef.filter && ml(ne, le, N.width) ? (o.stopPropagation(), p.value === N.colId ? p.value = null : (p.value = N.colId, R.value = (I = f[N.colId]) != null && I.startsWith("__eq__") ? f[N.colId].slice(6) : f[N.colId] ?? "", S.value = { x: Math.max(0, le - h.value), y: ae })) : N.colDef.sortable !== !1 && (p.value = null, d.value = ((L = d.value) == null ? void 0 : L.colId) === N.colId ? d.value.dir === "asc" ? { colId: N.colId, dir: "desc" } : null : { colId: N.colId, dir: "asc" }, n("sort-changed"));
        return;
      }
      if (p.value = null, k.area === "body" && k.rowIdx >= 0 && k.colIdx >= 0) {
        const N = k.rowIdx;
        g.value = { row: N, col: k.colIdx }, (z = J.value) == null || z.focus();
        const le = q.value[N], ne = b.value[k.colIdx];
        le && ne && (n("row-clicked", { data: le, event: o }), n("cell-selected", { data: le, row: N, col: k.colIdx, colId: ne.colId }));
      }
    }
    function bt(o) {
      var r, x;
      p.value && ((x = (r = o.target).closest) != null && x.call(r, ".cathode-filter-popup") || (p.value = null));
    }
    function qt(o) {
      var I;
      if (!M.value) return;
      let r = 0;
      for (let L = 0; L < o; L++) r += b.value[L].width;
      const x = ((I = b.value[o]) == null ? void 0 : I.width) ?? 0, k = r - h.value;
      k < 0 ? h.value = Math.max(0, r) : k + x > M.value && (h.value = Math.min(B.value, r + x - M.value));
    }
    function jt(o) {
      var N;
      const r = b.value, x = r.length - 1, k = q.value.length - 1;
      if (!g.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), g.value = { row: K.value, col: 0 });
        return;
      }
      let { row: I, col: L } = g.value;
      const z = (le, ne) => {
        I = Math.max(0, Math.min(k, le)), L = Math.max(0, Math.min(x, ne)), g.value = { row: I, col: L }, ke(I), qt(L);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), z(I + 1, L);
          break;
        case "ArrowUp":
          o.preventDefault(), z(I - 1, L);
          break;
        case "ArrowRight":
          o.preventDefault(), L < x ? z(I, L + 1) : z(I + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), L > 0 ? z(I, L - 1) : z(I - 1, x);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? L > 0 ? z(I, L - 1) : z(I - 1, x) : L < x ? z(I, L + 1) : z(I + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? z(I - 1, L) : z(I + 1, L);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? z(0, 0) : z(I, 0);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? z(k, x) : z(I, x);
          break;
        case "PageDown":
          o.preventDefault(), z(Math.min(k, I + G.value), L);
          break;
        case "PageUp":
          o.preventDefault(), z(Math.max(0, I - G.value), L);
          break;
        case "Escape":
          g.value = null;
          break;
        case "c":
        case "C":
          if (o.ctrlKey || o.metaKey) {
            o.preventDefault();
            const le = q.value[I], ne = r[L];
            le && ne && ((N = navigator.clipboard) == null || N.writeText(oe(ne, le)).catch(() => {
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
        o === "rowData" ? a.value = r : o === "pinnedBottomRowData" ? c.value = r : o === "quickFilterText" && (u.value = r);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var x, k;
          const r = w(o);
          return {
            colId: r,
            hide: i.has(r),
            sort: ((x = d.value) == null ? void 0 : x.colId) === r ? d.value.dir : null,
            sortIndex: ((k = d.value) == null ? void 0 : k.colId) === r ? 0 : null,
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
          for (const [r, x] of Object.entries(o))
            (x == null ? void 0 : x.type) === "equals" ? f[r] = `__eq__${x.filter}` : x != null && x.filter && (f[r] = x.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [r, x] of Object.entries(f))
          x && (o[r] = x.startsWith("__eq__") ? { type: "equals", filter: x.slice(6) } : { type: "contains", filter: x });
        return o;
      },
      async setColumnFilterModel(o, r) {
        r ? r.type === "equals" ? f[o] = `__eq__${r.filter}` : f[o] = r.filter ?? "" : delete f[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        y.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const r = T.value, x = r.map((z) => z.colDef.headerName ?? z.colId).join(","), k = q.value.map(
          (z) => r.map((N) => `"${String(oe(N, z)).replace(/"/g, '""')}"`).join(",")
        ), I = new Blob([[x, ...k].join(`
`)], { type: "text/csv" }), L = URL.createObjectURL(I);
        Object.assign(document.createElement("a"), { href: L, download: o }).click(), URL.revokeObjectURL(L);
      },
      resize() {
        He();
      },
      resetColumnState() {
        i.clear();
        for (const r of e.columnDefs)
          r.hide && i.add(w(r));
        const o = e.columnDefs.find((r) => r.sort);
        d.value = o ? { colId: w(o), dir: o.sort } : null;
        for (const r of Object.keys(s)) delete s[r];
        for (const r of Object.keys(f)) delete f[r];
        u.value = "", m.value = 0, g.value = null, p.value = null;
      }
    };
    H(
      [q, () => c.value, b, m, v, g],
      () => Te(fe)
    ), H(() => e.theme, () => fe()), H(() => e.curvature, () => Te(He)), H(() => e.scanlines, () => fe()), H(() => e.glow, () => fe()), H(g, (o) => {
      if (!o) return;
      const r = q.value[o.row], x = b.value[o.col];
      r && x && n("cell-selected", { data: r, row: o.row, col: o.col, colId: x.colId });
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
        o.hide && i.add(w(o)), o.sort && !d.value && (d.value = { colId: w(o), dir: o.sort });
      a.value = e.rowData ?? [], c.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", bt), document.addEventListener("mousemove", Q), document.addEventListener("mouseup", ye), Te(() => {
        var o;
        wt(), J.value && (J.value.addEventListener("webglcontextlost", xt), J.value.addEventListener("webglcontextrestored", Mt)), me.value && (Ue = new ResizeObserver(() => He()), Ue.observe(me.value), Ke = new IntersectionObserver((r) => {
          r.some((x) => x.isIntersecting) && Pe();
        }), Ke.observe(me.value)), window.addEventListener("resize", Pe), (o = window.visualViewport) == null || o.addEventListener("resize", Pe), n("grid-ready", { api: Jt });
      });
    }), Ne(() => {
      var o, r, x;
      document.removeEventListener("click", bt, !0), document.removeEventListener("mousemove", Q), document.removeEventListener("mouseup", ye), (o = J.value) == null || o.removeEventListener("webglcontextlost", xt), (r = J.value) == null || r.removeEventListener("webglcontextrestored", Mt), Ue == null || Ue.disconnect(), Ke == null || Ke.disconnect(), window.removeEventListener("resize", Pe), (x = window.visualViewport) == null || x.removeEventListener("resize", Pe), cancelAnimationFrame(it), te == null || te.dispose();
    });
    const ge = U(() => Oe[e.theme] ?? Oe.none), Qt = U(() => ({
      position: "absolute",
      left: `${S.value.x}px`,
      top: `${S.value.y}px`,
      zIndex: 100,
      background: ge.value.headerBg,
      border: `1px solid ${ge.value.accent}`,
      color: ge.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), el = U(() => ({
      background: ge.value.bg,
      border: `1px solid ${ge.value.border}`,
      color: ge.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), tl = U(() => ({
      background: ge.value.headerBg,
      borderTop: `1px solid ${ge.value.border}`,
      color: ge.value.text
    })), ll = U(() => ({
      background: ge.value.bg
    })), St = U(() => ge.value.accent);
    return (o, r) => {
      var x, k;
      return ie(), re("div", {
        ref_key: "wrapEl",
        ref: me,
        class: "cathode-wrap",
        style: xe(ll.value)
      }, [
        Z("canvas", {
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
        p.value ? (ie(), re("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: xe(Qt.value),
          onClick: r[0] || (r[0] = Re(() => {
          }, ["stop"]))
        }, [
          Z("input", {
            style: xe(el.value),
            value: R.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Zt,
            onKeydown: nl(yt, ["escape"])
          }, null, 44, hl),
          R.value ? (ie(), re("button", {
            key: 0,
            style: xe({
              background: "none",
              border: "none",
              color: ge.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: yt
          }, "✕", 4)) : Se("", !0)
        ], 4)) : Se("", !0),
        t.pagination ? (ie(), re("div", {
          key: 1,
          class: "cathode-pagination",
          style: xe(tl.value)
        }, [
          Z("button", {
            disabled: m.value <= 0,
            onClick: r[1] || (r[1] = (I) => Ie())
          }, "◀", 8, gl),
          Z("span", null, Me((K.value + 1).toLocaleString()) + "–" + Me(Math.min(q.value.length, de.value + 1).toLocaleString()) + " / " + Me(q.value.length.toLocaleString()), 1),
          Z("button", {
            disabled: m.value >= V.value,
            onClick: r[2] || (r[2] = (I) => F())
          }, "▶", 8, pl),
          Z("span", {
            class: "cathode-page-info",
            style: xe({ color: St.value })
          }, Me(q.value.length.toLocaleString()) + " rows ", 5),
          g.value ? (ie(), re("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: xe({ color: St.value })
          }, Me(((x = b.value[g.value.col]) == null ? void 0 : x.colDef.headerName) ?? ((k = b.value[g.value.col]) == null ? void 0 : k.colId)) + " : " + Me(oe(b.value[g.value.col], q.value[g.value.row])), 5)) : Se("", !0)
        ], 4)) : Se("", !0)
      ], 4);
    };
  }
}), Ge = (t, l) => {
  const e = t.__vccOpts || t;
  for (const [n, a] of l)
    e[n] = a;
  return e;
}, Dn = /* @__PURE__ */ Ge(Ml, [["__scopeId", "data-v-07901c91"]]), Je = {
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
const Cl = 12, pe = 18, Ze = 10, Ve = 6, vt = `${Cl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
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
    const c = a.split(/(\s+)/);
    let u = "";
    for (const d of c) {
      const f = u + d;
      if (t.measureText(f).width <= e)
        u = f;
      else if (u && (n.push(u.replace(/\s+$/, "")), u = ""), t.measureText(d).width > e) {
        let s = "";
        for (const i of d)
          t.measureText(s + i).width > e ? (s && n.push(s), s = i) : s += i;
        u = s;
      } else
        u = d.replace(/^\s+/, "");
    }
    u && n.push(u.replace(/\s+$/, ""));
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
  const { entries: l, ctx: e, textMaxWidth: n, showTimestamps: a, wordWrap: c } = t, u = t.formatTs ?? Yt;
  e.font = vt;
  const d = [];
  for (let f = 0; f < l.length; f++) {
    const s = l[f], i = s.level ?? "info", y = a && s.ts != null ? u(s.ts) : "", M = c ? Tl(e, s.text, n) : s.text.split(`
`);
    for (let C = 0; C < M.length; C++)
      d.push({
        entryIdx: f,
        text: M[C],
        level: i,
        timestamp: C === 0 ? y : "",
        isFirstFrag: C === 0
      });
  }
  return d;
}
function Et(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, c = Je[l.theme] ?? Je.none;
  e.clearRect(0, 0, n, a), e.fillStyle = c.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip(), e.font = vt, e.textBaseline = "middle";
  const u = l.visualLines, d = Ze, f = l.showTimestamps ? Ze + l.timestampWidth : Ze, s = Math.max(0, Math.floor((l.scrollY - Ve) / pe)), i = Math.min(u.length, Math.ceil((l.scrollY + a - Ve) / pe) + 1);
  for (let y = s; y < i; y++) {
    const M = u[y], C = Ve + y * pe - l.scrollY + pe / 2;
    if (M.entryIdx % 2 === 1 && M.isFirstFrag) {
      e.fillStyle = c.rowAlt;
      let h = 1;
      for (; y + h < i && u[y + h].entryIdx === M.entryIdx; ) h++;
      e.fillRect(0, C - pe / 2, n, pe * h);
    }
    y === l.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, C - pe / 2, n, pe)), l.showTimestamps && M.timestamp && (e.fillStyle = c.timestamp, e.textAlign = "left", l.glow && (e.shadowBlur = 3, e.shadowColor = c.timestamp), e.fillText(M.timestamp, d, C), e.shadowBlur = 0);
    const m = Sl(c, M.level);
    e.fillStyle = m, e.textAlign = "left", l.glow && (e.shadowBlur = 4, e.shadowColor = m), e.fillText(M.text, f, C), e.shadowBlur = 0;
  }
  e.restore();
}
function Ll(t, l, e) {
  if (t < 0) return -1;
  const n = Math.floor((t + l - Ve) / pe);
  return n < 0 || n >= e ? -1 : n;
}
function Dl(t) {
  return Ve * 2 + t * pe;
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
`, Fl = /* @__PURE__ */ Xe({
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
    const e = t, n = _(null), a = _(null), c = _(0), u = _(0), d = _(0), f = _(-1), s = _(!0), i = U(() => {
      const E = e.entries ?? [];
      return e.maxLines > 0 && E.length > e.maxLines ? E.slice(E.length - e.maxLines) : E;
    }), y = U(() => {
      if (!e.showTimestamps) return "";
      const E = e.formatTs ?? Yt;
      let Y = "00:00:00";
      for (const Q of i.value) {
        if (Q.ts == null) continue;
        const ye = E(Q.ts);
        ye.length > Y.length && (Y = ye);
      }
      return Y;
    }), M = _(0), C = _([]);
    function m() {
      if (!b) return;
      const E = b.getContext("2d");
      if (!E) return;
      E.font = vt;
      const Y = e.showTimestamps ? kl(E, y.value) : 0;
      M.value = Y;
      const Q = Math.max(
        1,
        c.value - Ze * 2 - Y
      );
      C.value = Il({
        entries: i.value,
        ctx: E,
        textMaxWidth: Q,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const h = U(() => Dl(C.value.length)), v = U(() => Math.max(0, h.value - u.value));
    H(v, () => {
      s.value ? d.value = v.value : d.value = Math.min(d.value, v.value);
    }), H(
      [i, c, () => e.showTimestamps, () => e.wordWrap, y],
      () => {
        m(), Te(V);
      },
      { deep: !1 }
    );
    let g = null, p = !1, S, R, w, T, b;
    function B() {
      if (!(!a.value || !n.value)) {
        b = document.createElement("canvas");
        try {
          g = new O.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          p = !0;
        }
        if (!p && !g.getContext() && (g.dispose(), g = null, p = !0), p) {
          W();
          return;
        }
        g.setPixelRatio(1), g.setClearColor(0, 0), S = new O.Scene(), R = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), T = new O.CanvasTexture(b), T.minFilter = O.LinearFilter, T.magFilter = O.LinearFilter, w = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: T },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: El,
          fragmentShader: Rl,
          transparent: !0
        }), S.add(new O.Mesh(new O.PlaneGeometry(2, 2), w)), W();
      }
    }
    function W() {
      if (!n.value || !g && !p) return;
      const E = n.value.clientWidth, Y = n.value.clientHeight;
      if (!E || !Y) return;
      const Q = b.width !== E || b.height !== Y;
      Q && (b.width = E, b.height = Y, c.value = E, u.value = Y, m(), g ? (Q && T && (T.dispose(), T = new O.CanvasTexture(b), T.minFilter = O.LinearFilter, T.magFilter = O.LinearFilter, w && (w.uniforms.uTex.value = T)), g.setPixelRatio(window.devicePixelRatio || 1), g.setSize(E, Y)) : a.value && (a.value.width = E, a.value.height = Y, a.value.style.width = E + "px", a.value.style.height = Y + "px"), s.value && (d.value = Math.max(0, h.value - u.value)), V());
    }
    function V() {
      if (!(b != null && b.width)) return;
      if (p) {
        if (!a.value) return;
        Et(b, {
          visualLines: C.value,
          scrollY: d.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: M.value,
          hoveredLine: f.value
        });
        const Y = a.value.getContext("2d");
        Y && Y.drawImage(b, 0, 0);
        return;
      }
      if (!g || !w || !T) return;
      const E = e.theme === "paper";
      w.uniforms.uStrength.value = e.curvature / 45 * 0.55, w.uniforms.uScanlines.value = e.scanlines && !E ? 1 : 0, w.uniforms.uVignette.value = E ? 0 : 1, Et(b, {
        visualLines: C.value,
        scrollY: d.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: M.value,
        hoveredLine: f.value
      }), T.needsUpdate = !0, g.render(S, R);
    }
    H(() => e.theme, () => V()), H(() => e.curvature, () => V()), H(() => e.scanlines, () => V()), H(() => e.glow, () => V()), H(d, () => V()), H(f, () => V());
    function G(E) {
      if (!a.value) return [-1, -1];
      const Y = a.value.getBoundingClientRect();
      return [E.clientX - Y.left, E.clientY - Y.top];
    }
    function K(E) {
      d.value = Math.max(0, Math.min(v.value, E)), s.value = d.value >= v.value - 4;
    }
    function de(E) {
      K(d.value + E.deltaY);
    }
    let X = !1, oe = 0, we = 0;
    function q(E) {
      X = !0, oe = E.clientY, we = d.value;
    }
    function ke(E) {
      if (X) {
        const Y = oe - E.clientY;
        K(we + Y);
      }
    }
    function Ie() {
      X && (X = !1);
    }
    function F(E) {
      const [, Y] = G(E);
      if (Y < 0) {
        f.value = -1;
        return;
      }
      f.value = Ll(Y, d.value, C.value.length);
    }
    function P() {
      f.value = -1;
    }
    l({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        s.value = !0, d.value = v.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(E) {
        K(Ve + E * pe);
      }
    });
    let j = null, ee = null, D = 0;
    const A = lt("cathodeResetTick", _(0));
    H(A, () => $());
    function $() {
      cancelAnimationFrame(D), D = requestAnimationFrame(W);
    }
    function ve(E) {
      E.preventDefault();
    }
    function ue() {
      g == null || g.dispose(), g = null, p = !1, B();
    }
    We(() => {
      document.addEventListener("mousemove", ke), document.addEventListener("mouseup", Ie), Te(() => {
        var E;
        B(), a.value && (a.value.addEventListener("webglcontextlost", ve), a.value.addEventListener("webglcontextrestored", ue)), n.value && (j = new ResizeObserver(() => W()), j.observe(n.value), ee = new IntersectionObserver((Y) => {
          Y.some((Q) => Q.isIntersecting) && $();
        }), ee.observe(n.value)), window.addEventListener("resize", $), (E = window.visualViewport) == null || E.addEventListener("resize", $), d.value = v.value;
      });
    }), Ne(() => {
      var E, Y, Q;
      document.removeEventListener("mousemove", ke), document.removeEventListener("mouseup", Ie), (E = a.value) == null || E.removeEventListener("webglcontextlost", ve), (Y = a.value) == null || Y.removeEventListener("webglcontextrestored", ue), j == null || j.disconnect(), ee == null || ee.disconnect(), window.removeEventListener("resize", $), (Q = window.visualViewport) == null || Q.removeEventListener("resize", $), cancelAnimationFrame(D), g == null || g.dispose();
    });
    const be = U(() => Je[e.theme] ?? Je.none), Ee = U(() => ({
      background: be.value.bg
    }));
    return (E, Y) => (ie(), re("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: xe(Ee.value)
    }, [
      Z("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: Re(de, ["prevent"]),
        onMousemove: F,
        onMouseleave: P,
        onMousedown: q
      }, null, 544)
    ], 4));
  }
}), Bl = /* @__PURE__ */ Ge(Fl, [["__scopeId", "data-v-d2d092f3"]]), _l = ["disabled"], Al = /* @__PURE__ */ Xe({
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
    const n = t, a = e, c = _(null), u = _(null), d = _(""), f = _([]), s = _(-1);
    let i = "";
    function y(w) {
      w.trim() && (f.value.length && f.value[f.value.length - 1] === w || (f.value.push(w), f.value.length > n.historyLimit && f.value.splice(0, f.value.length - n.historyLimit)));
    }
    function M(w) {
      if (!n.disabled) {
        if (w.key === "Enter") {
          w.preventDefault();
          const T = d.value;
          T.trim() && y(T), s.value = -1, d.value = "", a("submit", T);
          return;
        }
        if (w.key === "ArrowUp") {
          if (!f.value.length) return;
          w.preventDefault(), s.value === -1 ? (i = d.value, s.value = f.value.length - 1) : s.value > 0 && s.value--, d.value = f.value[s.value];
          return;
        }
        if (w.key === "ArrowDown") {
          if (s.value === -1) return;
          w.preventDefault(), s.value < f.value.length - 1 ? (s.value++, d.value = f.value[s.value]) : (s.value = -1, d.value = i, i = "");
          return;
        }
      }
    }
    const C = _(!0);
    let m = null;
    function h() {
      m || (m = setInterval(() => {
        C.value = !C.value;
      }, 530));
    }
    function v() {
      m && (clearInterval(m), m = null), C.value = !0;
    }
    const g = U(() => {
      let w;
      return n.disabled ? w = " " : n.busy ? w = "█" : w = C.value ? "█" : " ", { level: "info", text: `${n.prompt}${d.value}${w}` };
    }), p = U(
      () => [...n.entries, g.value]
    );
    function S() {
      var w;
      n.disabled || (w = u.value) == null || w.focus();
    }
    H(() => n.busy, (w, T) => {
      T && !w && !n.disabled && Te(() => {
        var b;
        return (b = u.value) == null ? void 0 : b.focus();
      });
    });
    function R() {
      var w;
      (w = u.value) == null || w.focus();
    }
    return l({ focus: R }), We(() => {
      h(), n.disabled || requestAnimationFrame(() => {
        var w;
        return (w = u.value) == null ? void 0 : w.focus();
      });
    }), Ne(() => {
      v();
    }), (w, T) => (ie(), re("div", {
      ref_key: "wrapEl",
      ref: c,
      class: "cathode-terminal-wrap",
      onClick: S
    }, [
      zt(Bl, {
        entries: p.value,
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
      Wt(Z("input", {
        ref_key: "inputEl",
        ref: u,
        "onUpdate:modelValue": T[0] || (T[0] = (b) => d.value = b),
        disabled: t.disabled || t.busy,
        class: "cathode-terminal-input-hidden",
        spellcheck: "false",
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        type: "text",
        "data-testid": "ct-input",
        onKeydown: M
      }, null, 40, _l), [
        [ol, d.value]
      ])
    ], 512));
  }
}), En = /* @__PURE__ */ Ge(Al, [["__scopeId", "data-v-90cf2990"]]), Qe = {
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
}, zl = 0.18, qe = 8, mt = 22, Wl = 4, De = 8, ze = 56, Ht = 42, Fe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Yl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ut = 4, Hl = 1, Pl = 1;
function $l(t, l, e, n = 0, a = !1) {
  const c = a ? Ht : ze, u = Math.max(0, l - De - c), d = Math.max(1, Math.floor(u / e)), f = Math.min(d, t);
  return { firstIdx: Math.max(0, t - f - Math.floor(n / e)), count: f, slotW: e };
}
function Ol(t, l, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, a = -1 / 0, c = 0;
  const u = Math.min(t.length, l + e);
  for (let f = l; f < u; f++) {
    const s = t[f];
    s && (s.low < n && (n = s.low), s.high > a && (a = s.high), s.volume > c && (c = s.volume));
  }
  if (!isFinite(n) || !isFinite(a) || n === a) {
    const f = isFinite(n) ? n : 0;
    return { min: f - 1, max: f + 1, maxVol: Math.max(1, c) };
  }
  const d = (a - n) * 0.04;
  return { min: n - d, max: a + d, maxVol: Math.max(1, c) };
}
function Vl(t, l, e = !1) {
  const n = e ? Wl : mt, a = Math.max(1, t - qe - n - ut), c = Math.max(0, Math.round(a * l)), u = a - c;
  return {
    priceY0: qe,
    priceY1: qe + u,
    volumeY0: qe + u + ut,
    volumeY1: qe + u + ut + c
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
  const l = new Date(t), e = String(l.getMonth() + 1).padStart(2, "0"), n = String(l.getDate()).padStart(2, "0"), a = String(l.getHours()).padStart(2, "0"), c = String(l.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${a}:${c}`;
}
function Xl(t, l) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, l), n = Math.pow(10, Math.floor(Math.log10(e))), a = e / n;
  let c;
  return a < 1.5 ? c = 1 : a < 3 ? c = 2 : a < 7 ? c = 5 : c = 10, c * n;
}
function Rt(t, l) {
  var C, m, h, v, g;
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, c = Qe[l.theme] ?? Qe.none, u = l.colors ? { ...c, ...l.colors } : c, d = !!l.compact;
  if (e.clearRect(0, 0, n, a), e.fillStyle = u.bg, e.fillRect(0, 0, n, a), !l.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const f = $l(l.candles.length, n, l.slotW, l.scrollX, d), s = Ol(l.candles, f.firstIdx, f.count), i = Vl(a, l.showVolume ? l.volumeFraction : 0, d), y = Math.max(Hl, Math.floor(l.slotW * 0.7)), M = Math.min(l.candles.length, f.firstIdx + f.count);
  for (let p = f.firstIdx; p < M; p++) {
    const S = l.candles[p];
    if (!S) continue;
    const R = Be(p, f.firstIdx, l.slotW), w = Ce(S.open, s, i.priceY0, i.priceY1), T = Ce(S.close, s, i.priceY0, i.priceY1), b = Ce(S.high, s, i.priceY0, i.priceY1), B = Ce(S.low, s, i.priceY0, i.priceY1), W = S.close >= S.open, V = W ? u.wickBull : u.wickBear, G = W ? u.candleBull : u.candleBear;
    l.glow && (e.shadowBlur = 4, e.shadowColor = G), e.strokeStyle = V, e.lineWidth = Pl, e.beginPath(), e.moveTo(Math.round(R) + 0.5, b), e.lineTo(Math.round(R) + 0.5, B), e.stroke(), e.fillStyle = G;
    const K = Math.min(w, T), de = Math.max(1, Math.abs(T - w));
    if (e.fillRect(
      Math.round(R - y / 2),
      Math.round(K),
      y,
      Math.round(de)
    ), e.shadowBlur = 0, l.showVolume && s.maxVol > 0) {
      const X = Math.round(S.volume / s.maxVol * (i.volumeY1 - i.volumeY0));
      X > 0 && (e.fillStyle = W ? u.volumeBull : u.volumeBear, e.fillRect(
        Math.round(R - y / 2),
        i.volumeY1 - X,
        y,
        X
      ));
    }
  }
  if ((C = l.overlays) != null && C.length)
    for (const p of l.overlays) Nl(e, p, f, s, i, l.slotW);
  (m = l.markers) != null && m.length && Ql(e, u, l.markers, l.candles, f, s, i, l.slotW), en(e, u, s, i, n, d), d || (tn(e, u, l.candles, f, l.slotW, a), Zl(e, u, l.candles, n, a)), (h = l.overlays) != null && h.length && Ul(e, u, l.overlays, i), l.hover && (ln(e, u, l.candles, f, s, i, l.slotW, l.hover, n), Kl(e, u, l.candles, f, l.slotW, l.hover, i, ((v = l.overlays) == null ? void 0 : v.length) ?? 0), (g = l.markers) != null && g.length && jl(e, u, l.markers, l.candles, f, s, i, l.slotW, l.hover, n)), e.restore();
}
function Nl(t, l, e, n, a, c) {
  var d;
  const u = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    De,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), l.kind === "line")
    je(t, l.data, e.firstIdx, u, c, n, a, l.color, l.lineWidth ?? 1, l.dashed === !0);
  else {
    const f = Pt(l.color, l.fillAlpha ?? 0.08);
    Gl(t, l.upper, l.lower, e.firstIdx, u, c, n, a, f), je(t, l.upper, e.firstIdx, u, c, n, a, l.color, 1, !1), je(t, l.lower, e.firstIdx, u, c, n, a, l.color, 1, !1), (d = l.middle) != null && d.length && je(t, l.middle, e.firstIdx, u, c, n, a, l.color, 1, l.middleDashed !== !1);
  }
  t.restore();
}
function je(t, l, e, n, a, c, u, d, f, s) {
  if (!l || !l.length) return;
  t.strokeStyle = d, t.lineWidth = f, t.setLineDash(s ? [4, 3] : []), t.beginPath();
  let i = !1;
  for (let y = e; y < n; y++) {
    const M = l[y];
    if (typeof M != "number" || !isFinite(M)) {
      i && (t.stroke(), t.beginPath(), i = !1);
      continue;
    }
    const C = Be(y, e, a), m = Ce(M, c, u.priceY0, u.priceY1);
    i ? t.lineTo(C, m) : (t.moveTo(C, m), i = !0);
  }
  i && t.stroke(), t.setLineDash([]);
}
function Gl(t, l, e, n, a, c, u, d, f) {
  if (!(l != null && l.length) || !(e != null && e.length)) return;
  t.fillStyle = f;
  let s = !1, i = -1;
  for (let y = n; y <= a; y++) {
    const M = l[y], C = e[y], m = y < a && typeof M == "number" && typeof C == "number" && isFinite(M) && isFinite(C);
    if (m && !s && (i = y, s = !0), !m && s || y === a && s) {
      const h = m ? y + 1 : y;
      t.beginPath();
      for (let v = i; v < h; v++) {
        const g = Be(v, n, c), p = Ce(l[v], u, d.priceY0, d.priceY1);
        v === i ? t.moveTo(g, p) : t.lineTo(g, p);
      }
      for (let v = h - 1; v >= i; v--) {
        const g = Be(v, n, c), p = Ce(e[v], u, d.priceY0, d.priceY1);
        t.lineTo(g, p);
      }
      t.closePath(), t.fill(), s = !1;
    }
  }
}
function Pt(t, l) {
  const e = Math.max(0, Math.min(1, l));
  if (t.startsWith("#") && t.length === 7) {
    const n = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), c = parseInt(t.slice(5, 7), 16);
    return `rgba(${n},${a},${c},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Ul(t, l, e, n) {
  const a = e.filter((h) => !!h.label);
  if (!a.length) return;
  t.save(), t.font = Fe;
  const c = 8, u = 5, d = 12, f = 6, s = 14;
  let i = 0;
  for (const h of a) {
    const v = t.measureText(h.label).width;
    v > i && (i = v);
  }
  const y = c * 2 + d + f + i, M = u * 2 + s * a.length, C = De + 4, m = n.priceY0 + 4;
  t.fillStyle = l.panelBg, t.fillRect(C, m, y, M), t.textBaseline = "middle", t.textAlign = "left";
  for (let h = 0; h < a.length; h++) {
    const v = a[h], g = m + u + s * (h + 0.5), p = C + c;
    v.kind === "line" ? (t.strokeStyle = v.color, t.lineWidth = v.lineWidth ?? 1, t.setLineDash(v.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(p, g), t.lineTo(p + d, g), t.stroke(), t.setLineDash([])) : (t.fillStyle = Pt(v.color, v.fillAlpha ?? 0.2), t.fillRect(p, g - 4, d, 8), t.strokeStyle = v.color, t.lineWidth = 1, t.strokeRect(p + 0.5, g - 4 + 0.5, d - 1, 7)), t.fillStyle = l.text, t.fillText(v.label, p + d + f, g);
  }
  t.restore();
}
function Kl(t, l, e, n, a, c, u, d) {
  const f = Math.floor((c.x - De) / a), s = n.firstIdx + f;
  if (s < 0 || s >= e.length) return;
  const i = e[s];
  if (!i) return;
  const y = i.close - i.open, M = i.open !== 0 ? y / i.open * 100 : 0, C = y >= 0 ? "+" : "", m = [
    ["O", Ae(i.open), void 0],
    ["H", Ae(i.high), void 0],
    ["L", Ae(i.low), void 0],
    ["C", Ae(i.close), void 0],
    ["V", ql(i.volume), void 0],
    ["", `${C}${M.toFixed(2)}%`, y >= 0 ? l.candleBull : l.candleBear]
  ];
  t.save(), t.font = Fe, t.textBaseline = "middle", t.textAlign = "left";
  const h = 8, v = 4, g = 14;
  let p = h;
  for (const [T, b] of m) {
    const B = T ? `${T} ${b}` : b, W = t.measureText(B).width + 12;
    p += W;
  }
  p += h - 12;
  const S = u.priceY0 + 4 + (d > 0 ? v * 2 + 14 * d + 4 : 0), R = De + 4;
  t.fillStyle = l.panelBg, t.fillRect(R, S, p, g + v * 2);
  let w = R + h;
  for (let T = 0; T < m.length; T++) {
    const [b, B, W] = m[T];
    t.fillStyle = l.text, b && (t.globalAlpha = 0.6, t.fillText(b + " ", w, S + v + g / 2), t.globalAlpha = 1, w += t.measureText(b + " ").width), W && (t.fillStyle = W), t.fillText(B, w, S + v + g / 2), w += t.measureText(B).width + 12;
  }
  t.restore();
}
function ql(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function jl(t, l, e, n, a, c, u, d, f, s) {
  if (!n.length) return;
  const i = n.length > 1 ? n[1].start - n[0].start : 6e4, y = Math.max(1, i * 0.5), M = Math.min(n.length, a.firstIdx + a.count), C = 9;
  let m = null;
  for (const B of e) {
    let W = 0, V = n.length - 1, G = -1;
    for (; W <= V; ) {
      const X = W + V >> 1, oe = n[X].start - B.timestamp;
      if (Math.abs(oe) <= y) {
        G = X;
        break;
      }
      oe < 0 ? W = X + 1 : V = X - 1;
    }
    if (G < 0 || G < a.firstIdx || G >= M) continue;
    const K = Be(G, a.firstIdx, d), de = Ce(B.price, c, u.priceY0, u.priceY1);
    if (Math.abs(f.x - K) <= C && Math.abs(f.y - de) <= C) {
      m = { m: B, x: K, y: de };
      break;
    }
  }
  if (!m) return;
  const h = ht(m.m.timestamp), v = [
    `${m.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${h}`,
    `@ ${Ae(m.m.price)}`
  ];
  m.m.label && v.push(m.m.label), t.save(), t.font = Fe, t.textBaseline = "top", t.textAlign = "left";
  const g = 6, p = 14;
  let S = 0;
  for (const B of v) {
    const W = t.measureText(B).width;
    W > S && (S = W);
  }
  const R = S + g * 2, w = v.length * p + g * 2;
  let T = m.x + 12;
  T + R > s - ze && (T = m.x - 12 - R);
  let b = m.y - w / 2;
  b < u.priceY0 && (b = u.priceY0), b + w > u.priceY1 && (b = u.priceY1 - w), t.fillStyle = l.panelBgSolid, t.strokeStyle = m.m.kind === "entry" ? l.markerEntry : l.markerExit, t.lineWidth = 1, t.fillRect(T, b, R, w), t.strokeRect(T + 0.5, b + 0.5, R - 1, w - 1);
  for (let B = 0; B < v.length; B++) {
    const W = v[B];
    t.fillStyle = B === 0 ? m.m.kind === "entry" ? l.markerEntry : l.markerExit : l.text, t.fillText(W, T + g, b + g + B * p);
  }
  t.restore();
}
function Zl(t, l, e, n, a) {
  if (e.length < 2) return;
  const c = e[1].start - e[0].start, u = Jl(c);
  if (!u) return;
  t.save(), t.font = Fe, t.textBaseline = "top", t.textAlign = "right";
  const d = 6, f = 3, s = t.measureText(u).width, i = n - ze - d, y = a - mt + 4;
  t.fillStyle = l.accent, t.fillRect(i - s - d, y - f, s + d * 2, 14 + f * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(u, i, y), t.restore();
}
function Jl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const l = 1e3, e = 60 * l, n = 60 * e, a = 24 * n, c = 7 * a;
  return t >= c && t % c === 0 ? t / c + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= n && t % n === 0 ? t / n + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= l && t % l === 0 ? t / l + "s" : Math.round(t / e) + "m";
}
function Ql(t, l, e, n, a, c, u, d) {
  if (!n.length) return;
  const f = n.length > 1 ? n[1].start - n[0].start : 6e4, s = Math.max(1, f * 0.5), i = Math.min(n.length, a.firstIdx + a.count), y = (C) => {
    let m = 0, h = n.length - 1;
    for (; m <= h; ) {
      const v = m + h >> 1, g = n[v].start - C;
      if (Math.abs(g) <= s) return v;
      g < 0 ? m = v + 1 : h = v - 1;
    }
    return -1;
  }, M = 7;
  for (const C of e) {
    const m = y(C.timestamp);
    if (m < 0 || m < a.firstIdx || m >= i) continue;
    const h = Be(m, a.firstIdx, d), v = Ce(C.price, c, u.priceY0, u.priceY1);
    if (v < u.priceY0 || v > u.priceY1) continue;
    const g = C.color ?? (C.kind === "entry" ? l.markerEntry : l.markerExit);
    t.fillStyle = g, t.strokeStyle = l.panelBgSolid, t.lineWidth = 1, t.beginPath(), C.kind === "entry" ? (t.moveTo(h, v - M), t.lineTo(h - M, v + M - 1), t.lineTo(h + M, v + M - 1)) : (t.moveTo(h, v + M), t.lineTo(h - M, v - M + 1), t.lineTo(h + M, v - M + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function en(t, l, e, n, a, c = !1) {
  const u = e.max - e.min;
  if (u <= 0) return;
  const d = n.priceY1 - n.priceY0, f = c ? Math.max(2, Math.min(4, Math.round(d / 36))) : 6, s = Xl(u, f), i = Math.ceil(e.min / s) * s, y = c ? Ht : ze;
  t.font = c ? Yl : Fe, t.fillStyle = l.text, t.strokeStyle = l.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let M = i; M <= e.max; M += s) {
    const C = Ce(M, e, n.priceY0, n.priceY1);
    C < n.priceY0 || C > n.priceY1 || (t.beginPath(), t.moveTo(De, Math.round(C) + 0.5), t.lineTo(a - y, Math.round(C) + 0.5), t.stroke(), t.fillText(Ae(M), a - y + 3, C));
  }
  t.globalAlpha = 1;
}
function tn(t, l, e, n, a, c) {
  if (n.count <= 0 || !e.length) return;
  const d = Math.max(1, Math.floor(n.count / 6));
  t.font = Fe, t.fillStyle = l.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const f = Math.min(e.length, n.firstIdx + n.count);
  for (let s = n.firstIdx; s < f; s += d) {
    const i = e[s];
    if (!i) continue;
    const y = Be(s, n.firstIdx, a);
    t.fillText(ht(i.start), y, c - mt + 4);
  }
  t.globalAlpha = 1;
}
function ln(t, l, e, n, a, c, u, d, f) {
  const s = Math.floor((d.x - De) / u), i = Math.max(0, Math.min(e.length - 1, n.firstIdx + s)), y = e[i];
  if (!y) return;
  const M = Be(i, n.firstIdx, u);
  t.save(), t.strokeStyle = l.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(M) + 0.5, c.priceY0), t.lineTo(Math.round(M) + 0.5, c.volumeY1 || c.priceY1), t.stroke();
  const C = Math.max(c.priceY0, Math.min(c.priceY1, d.y));
  t.beginPath(), t.moveTo(De, Math.round(C) + 0.5), t.lineTo(f - ze, Math.round(C) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const m = a.max - a.min;
  if (m > 0) {
    const g = a.max - (C - c.priceY0) / (c.priceY1 - c.priceY0) * m, p = Ae(g);
    t.font = Fe, t.textBaseline = "middle", t.textAlign = "left";
    const S = t.measureText(p).width, R = 4, w = 2;
    t.fillStyle = l.accent, t.fillRect(f - ze + 2, C - 7 - w, S + R * 2, 14 + w * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(p, f - ze + 2 + R, C);
  }
  t.font = Fe, t.textBaseline = "top", t.textAlign = "center";
  const h = ht(y.start), v = t.measureText(h).width;
  t.fillStyle = l.accent, t.fillRect(M - v / 2 - 4, c.volumeY1 + 2, v + 8, 14), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(h, M, c.volumeY1 + 4), t.restore();
}
const Ft = 0.25, Bt = 6, nn = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, on = `
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
`, an = /* @__PURE__ */ Xe({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: zl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {}
  },
  setup(t) {
    const l = t, e = _(null), n = _(null), a = _(0), c = _(0), u = _(0), d = _(1), f = _(null), s = U(() => Math.max(1, l.slotW * d.value));
    let i = null, y = !1, M, C, m, h, v;
    function g() {
      if (!(!n.value || !e.value)) {
        if (v = document.createElement("canvas"), l.flat) {
          y = !0, p();
          return;
        }
        try {
          i = new O.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0 });
        } catch {
          y = !0;
        }
        if (!y && !i.getContext() && (i.dispose(), i = null, y = !0), y) {
          p();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), M = new O.Scene(), C = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new O.CanvasTexture(v), h.minFilter = O.LinearFilter, h.magFilter = O.LinearFilter, m = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: nn,
          fragmentShader: on,
          transparent: !0
        }), M.add(new O.Mesh(new O.PlaneGeometry(2, 2), m)), p();
      }
    }
    function p() {
      if (!e.value || !i && !y) return;
      const D = e.value.clientWidth, A = e.value.clientHeight;
      !D || !A || !(v.width !== D || v.height !== A) || (v.width = D, v.height = A, a.value = D, c.value = A, i ? (h && (h.dispose(), h = new O.CanvasTexture(v), h.minFilter = O.LinearFilter, h.magFilter = O.LinearFilter, m && (m.uniforms.uTex.value = h)), i.setPixelRatio(window.devicePixelRatio || 1), i.setSize(D, A)) : n.value && (n.value.width = D, n.value.height = A, n.value.style.width = D + "px", n.value.style.height = A + "px"), S());
    }
    function S() {
      if (!(v != null && v.width)) return;
      if (y) {
        if (!n.value) return;
        Rt(v, {
          candles: l.candles,
          slotW: s.value,
          scrollX: u.value,
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
      if (!i || !m || !h) return;
      const D = l.theme === "paper";
      m.uniforms.uStrength.value = l.curvature / 45 * 0.55, m.uniforms.uScanlines.value = l.scanlines && !D ? 1 : 0, m.uniforms.uVignette.value = D ? 0 : 1, Rt(v, {
        candles: l.candles,
        slotW: s.value,
        scrollX: u.value,
        theme: l.theme,
        glow: l.glow,
        showVolume: l.showVolume,
        volumeFraction: l.volumeFraction,
        hover: f.value,
        overlays: l.overlays,
        markers: l.markers,
        compact: l.compact,
        colors: l.colors
      }), h.needsUpdate = !0, i.render(M, C);
    }
    H(() => l.theme, () => S()), H(() => l.curvature, () => S()), H(() => l.scanlines, () => S()), H(() => l.glow, () => S()), H(() => l.showVolume, () => S()), H(() => l.volumeFraction, () => S()), H(() => l.slotW, () => S()), H(() => l.candles, () => S(), { deep: !1 }), H(() => l.overlays, () => S(), { deep: !1 }), H(() => l.markers, () => S(), { deep: !1 }), H(() => l.compact, () => S()), H(() => l.colors, () => S(), { deep: !0 }), H(() => l.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), H(u, () => S()), H(d, () => S()), H(f, () => S()), H(s, () => S());
    let R = null, w = null, T = 0;
    const b = lt("cathodeResetTick", _(0));
    H(b, () => B());
    function B() {
      cancelAnimationFrame(T), T = requestAnimationFrame(p);
    }
    function W(D) {
      D.preventDefault();
    }
    function V() {
      i == null || i.dispose(), i = null, y = !1, g();
    }
    function G(D) {
      if (!n.value) return [-1, -1];
      const A = n.value.getBoundingClientRect();
      return [D.clientX - A.left, D.clientY - A.top];
    }
    function K(D) {
      var be;
      const A = s.value;
      if (A <= 0) return 0;
      const $ = ((be = l.candles) == null ? void 0 : be.length) ?? 0, ve = Math.max(1, Math.floor((a.value || 1) / A)), ue = Math.max(0, $ - ve);
      return Math.max(0, Math.min(D, ue * A));
    }
    function de(D) {
      var ve;
      if (D.deltaX !== 0 || D.shiftKey && D.deltaY !== 0) {
        const ue = D.deltaX !== 0 ? D.deltaX : D.deltaY;
        u.value = K(u.value + ue);
        return;
      }
      if (D.deltaY === 0) return;
      const [A] = G(D), $ = s.value;
      if (A >= 0 && $ > 0 && ((ve = l.candles) != null && ve.length)) {
        const ue = Math.max(1, Math.floor((a.value || 1) / $)), Ee = Math.max(0, l.candles.length - ue - Math.floor(u.value / $)) + (A - 8) / $, E = Math.exp(-D.deltaY * 15e-4), Y = Math.max(Ft, Math.min(Bt, d.value * E));
        d.value = Y;
        const Q = l.slotW * Y, ye = Math.max(1, Math.floor((a.value || 1) / Q)), me = Ee - (A - 8) / Q, J = Math.max(0, l.candles.length - ye - me);
        u.value = K(J * Q);
      } else {
        const ue = Math.exp(-D.deltaY * 15e-4);
        d.value = Math.max(Ft, Math.min(Bt, d.value * ue));
      }
    }
    let X = !1, oe = 0, we = 0;
    function q(D) {
      D.button === 0 && (X = !0, oe = D.clientX, we = u.value, f.value = null);
    }
    function ke(D) {
      if (X) {
        const A = D.clientX - oe;
        u.value = K(we + A);
        return;
      }
    }
    function Ie() {
      X = !1;
    }
    function F(D) {
      if (X) return;
      const [A, $] = G(D);
      if (A < 0 || $ < 0) {
        f.value = null;
        return;
      }
      f.value = { x: A, y: $ };
    }
    function P() {
      f.value = null;
    }
    We(() => {
      document.addEventListener("mousemove", ke), document.addEventListener("mouseup", Ie), Te(() => {
        var D;
        g(), n.value && (n.value.addEventListener("webglcontextlost", W), n.value.addEventListener("webglcontextrestored", V)), e.value && (R = new ResizeObserver(() => p()), R.observe(e.value), w = new IntersectionObserver((A) => {
          A.some(($) => $.isIntersecting) && B();
        }), w.observe(e.value)), window.addEventListener("resize", B), (D = window.visualViewport) == null || D.addEventListener("resize", B);
      });
    }), Ne(() => {
      var D, A, $;
      document.removeEventListener("mousemove", ke), document.removeEventListener("mouseup", Ie), (D = n.value) == null || D.removeEventListener("webglcontextlost", W), (A = n.value) == null || A.removeEventListener("webglcontextrestored", V), R == null || R.disconnect(), w == null || w.disconnect(), window.removeEventListener("resize", B), ($ = window.visualViewport) == null || $.removeEventListener("resize", B), cancelAnimationFrame(T), i == null || i.dispose();
    });
    const j = U(() => Qe[l.theme] ?? Qe.none), ee = U(() => ({
      background: j.value.bg
    }));
    return (D, A) => (ie(), re("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: xe(ee.value)
    }, [
      Z("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-candle-canvas",
        onWheel: Re(de, ["prevent"]),
        onMousedown: q,
        onMousemove: F,
        onMouseleave: P
      }, null, 544)
    ], 4));
  }
}), Rn = /* @__PURE__ */ Ge(an, [["__scopeId", "data-v-4673e639"]]), gt = _(0), ft = 28, $e = 12;
let dt = 10, et = "cathode.layout", tt = !1;
const se = _({});
function rn(t, l = "cathode.layout") {
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
  dt = t;
}
function Ye() {
  localStorage.setItem(et, JSON.stringify(se.value));
}
function sn(t) {
  tt = !1, localStorage.removeItem(et), se.value = { ...t }, Ye(), tt = !0, gt.value++;
}
function $t(t) {
  dt++, se.value[t] && (se.value[t].zIndex = dt);
}
function un(t, l) {
  se.value[t].visible = l, Ye();
}
function cn(t, l) {
  se.value[t].minimized = l, l && (se.value[t].maximized = !1), Ye();
}
function fn(t, l) {
  se.value[t].maximized = l, l && (se.value[t].minimized = !1, $t(t)), Ye();
}
function dn(t, l, e) {
  se.value[t].x = Math.round(l), se.value[t].y = Math.round(e), Ye();
}
function vn(t, l, e) {
  se.value[t].w = Math.round(l), se.value[t].h = Math.round(e), Ye();
}
function Fn(t, l, e) {
  const n = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / n), c = Math.floor((t - $e * (n + 1)) / n), u = Math.floor((l - $e * (a + 1)) / a), d = {};
  return e.forEach((f, s) => {
    const i = s % n, y = Math.floor(s / n);
    d[f] = {
      x: $e + i * (c + $e),
      y: $e + y * (u + $e),
      w: c,
      h: u,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: s + 1
    };
  }), d;
}
function Ot() {
  return {
    containers: se,
    TITLEBAR_H: ft,
    load: rn,
    save: Ye,
    reset: sn,
    bringToFront: $t,
    setVisible: un,
    setMinimized: cn,
    setMaximized: fn,
    updatePos: dn,
    updateSize: vn
  };
}
const mn = { class: "ws-toolbar" }, hn = {
  key: 0,
  class: "ws-restore-menu"
}, gn = {
  key: 0,
  class: "ws-restore-empty"
}, pn = ["onClick"], wn = /* @__PURE__ */ Xe({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const l = t, { containers: e, load: n, reset: a, setVisible: c } = Ot(), u = _(null);
    Tt("cathodeWorkspace", u), Tt("cathodeResetTick", gt), We(() => {
      if (!u.value) return;
      const { clientWidth: v, clientHeight: g } = u.value, p = l.initialLayout ?? {};
      n(p, l.storageKey ?? "cathode.layout");
      const S = Object.keys(e.value)[0];
      S && d(S);
    });
    function d(v) {
      var p;
      document.querySelectorAll(".cc").forEach((S) => S.classList.remove("cc-focused"));
      const g = (p = u.value) == null ? void 0 : p.querySelector(`#cc-${v}`);
      g && g.classList.add("cc-focused");
    }
    function f() {
      !u.value || !l.initialLayout || a(l.initialLayout);
    }
    function s(v) {
      const g = v.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((p) => p.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const i = _(!1), y = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function M(v) {
      c(v, !0), i.value = !1;
    }
    function C(v) {
      if (!i.value) return;
      const g = v.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (i.value = !1);
    }
    function m(v) {
      v.key === "Escape" && (i.value = !1);
    }
    We(() => {
      document.addEventListener("click", C), document.addEventListener("keydown", m);
    }), Ne(() => {
      document.removeEventListener("click", C), document.removeEventListener("keydown", m);
    });
    function h(v) {
      var g;
      return ((g = l.containerTitles) == null ? void 0 : g[v]) ?? v;
    }
    return (v, g) => (ie(), re("div", {
      ref_key: "workspaceEl",
      ref: u,
      class: "cathode-workspace",
      onMousedown: s
    }, [
      ct(v.$slots, "default", {}, void 0, !0),
      ct(v.$slots, "overlay", {}, void 0, !0),
      Z("div", mn, [
        t.initialLayout ? (ie(), re("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: f
        }, " ↺ Reset Layout ")) : Se("", !0),
        g[1] || (g[1] = Z("div", { class: "ws-sep" }, null, -1)),
        Z("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: g[0] || (g[0] = (p) => i.value = !i.value)
        }, " ⊞ Restore Panel ")
      ]),
      zt(al, { name: "menu" }, {
        default: il(() => [
          i.value ? (ie(), re("div", hn, [
            g[3] || (g[3] = Z("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            y().length ? Se("", !0) : (ie(), re("div", gn, " No closed panels ")),
            (ie(!0), re(rl, null, sl(y(), (p) => (ie(), re("div", {
              key: p,
              class: "ws-restore-item",
              onClick: (S) => M(p)
            }, [
              g[2] || (g[2] = Z("span", { class: "ws-restore-icon" }, "⊞", -1)),
              ul(" " + Me(h(p)), 1)
            ], 8, pn))), 128))
          ])) : Se("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Bn = /* @__PURE__ */ Ge(wn, [["__scopeId", "data-v-5838d04b"]]), bn = ["id"], yn = { class: "cc-title" }, xn = {
  key: 0,
  class: "cc-size-badge"
}, Mn = { class: "cc-controls" }, Sn = ["title"], Cn = { class: "cc-body" }, Tn = 200, kn = 80, At = 60, In = /* @__PURE__ */ Xe({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const l = t, { containers: e, bringToFront: n, setVisible: a, setMinimized: c, setMaximized: u, updatePos: d, updateSize: f } = Ot(), s = lt("cathodeWorkspace", _(null)), i = U(() => e.value[l.id]), y = U(() => {
      const F = i.value, P = l.curvature ?? 0;
      if (!F) return {};
      const j = { "--curvature": P };
      return F.maximized ? { ...j, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: F.zIndex } : {
        ...j,
        left: F.x + "px",
        top: F.y + "px",
        width: F.w + "px",
        height: F.minimized ? ft + "px" : F.h + "px",
        zIndex: F.zIndex,
        display: F.visible ? "flex" : "none"
      };
    });
    let M = !1, C = 0, m = 0;
    function h(F) {
      var ee;
      if (F.target.closest(".cc-btn") || i.value.maximized) return;
      n(l.id), M = !0;
      const P = (ee = s.value) == null ? void 0 : ee.querySelector(`#cc-${l.id}`);
      if (!P) return;
      const j = P.getBoundingClientRect();
      C = F.clientX - j.left, m = F.clientY - j.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", g), F.preventDefault();
    }
    function v(F) {
      var A;
      if (!M || !s.value) return;
      const P = s.value.getBoundingClientRect(), j = ((A = i.value) == null ? void 0 : A.w) ?? 300;
      let ee = F.clientX - P.left - C, D = F.clientY - P.top - m;
      ee = Math.max(At - j, Math.min(P.width - At, ee)), D = Math.max(0, Math.min(P.height - ft, D)), d(l.id, ee, D);
    }
    function g() {
      M = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g);
    }
    let p = !1, S = 0, R = 0, w = 0, T = 0;
    const b = _("");
    function B(F) {
      i.value.maximized || (n(l.id), p = !0, S = F.clientX, R = F.clientY, w = i.value.w, T = i.value.h, document.addEventListener("mousemove", W), document.addEventListener("mouseup", V), F.preventDefault(), F.stopPropagation());
    }
    function W(F) {
      if (!p) return;
      const P = Math.max(Tn, w + (F.clientX - S)), j = Math.max(kn, T + (F.clientY - R));
      f(l.id, P, j), b.value = `${Math.round(P)}×${Math.round(j)}`;
    }
    function V() {
      p = !1, b.value = "", document.removeEventListener("mousemove", W), document.removeEventListener("mouseup", V), G.value++;
    }
    const G = _(0);
    H(gt, () => {
      G.value++;
    }), Ne(() => {
      var F;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", W), document.removeEventListener("mouseup", V), (F = K.value) == null || F.removeEventListener("scroll", X), oe();
    });
    const K = _(null);
    function de(F) {
      if (l.canvas) return [];
      const P = F.children[0];
      return P ? Array.from(P.children) : [];
    }
    function X() {
      const F = K.value, P = l.curvature ?? 0;
      if (!F) return;
      const j = de(F);
      if (!j.length) return;
      const ee = F.clientHeight, D = ee / 2, A = P * 38e-4;
      j.forEach(($) => {
        if (!$.dataset.origFs) {
          const me = getComputedStyle($);
          $.dataset.origFs = me.fontSize, $.dataset.origLh = me.lineHeight;
        }
        if (P === 0) {
          $.style.fontSize = "", $.style.lineHeight = "";
          return;
        }
        const ve = $.getBoundingClientRect(), ue = F.getBoundingClientRect(), be = ve.top - ue.top + ve.height / 2, Ee = Math.min(1, Math.abs(be - D) / (ee / 2)), E = 1 + A * Math.cos(Ee * Math.PI / 2), Y = parseFloat($.dataset.origFs), Q = $.dataset.origLh, ye = Q === "normal" ? Y * 1.4 : parseFloat(Q);
        isNaN(Y) || ($.style.fontSize = `${(Y * E).toFixed(2)}px`), isNaN(ye) || ($.style.lineHeight = `${(ye * E).toFixed(2)}px`);
      });
    }
    function oe() {
      const F = K.value;
      F && de(F).forEach((P) => {
        P.style.fontSize = "", P.style.lineHeight = "", delete P.dataset.origFs, delete P.dataset.origLh;
      });
    }
    H(() => l.curvature, (F) => {
      (F ?? 0) === 0 ? oe() : X();
    }), We(() => {
      var F;
      (F = K.value) == null || F.addEventListener("scroll", X, { passive: !0 }), Te(X);
    });
    function we() {
      c(l.id, !i.value.minimized), Te(() => {
        G.value++;
      });
    }
    function q() {
      u(l.id, !i.value.maximized), Te(() => {
        G.value++;
      });
    }
    function ke() {
      a(l.id, !1);
    }
    function Ie() {
      n(l.id);
    }
    return (F, P) => i.value && i.value.visible ? (ie(), re("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: cl(["cc", { "cc-minimized": i.value.minimized, "cc-maximized": i.value.maximized, "cc-has-canvas": t.canvas }]),
      style: xe(y.value),
      onMousedown: Ie
    }, [
      Z("div", {
        class: "cc-titlebar",
        onMousedown: h
      }, [
        P[0] || (P[0] = Z("span", { class: "cc-status-dot" }, null, -1)),
        Z("span", yn, Me(t.title), 1),
        b.value ? (ie(), re("span", xn, Me(b.value), 1)) : Se("", !0),
        Z("div", Mn, [
          Z("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Re(we, ["stop"])
          }, "─"),
          Z("button", {
            class: "cc-btn cc-btn-max",
            title: i.value.maximized ? "Restore" : "Maximize",
            onClick: Re(q, ["stop"])
          }, Me(i.value.maximized ? "⤡" : "⤢"), 9, Sn),
          Z("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Re(ke, ["stop"])
          }, "✕")
        ])
      ], 32),
      Wt(Z("div", Cn, [
        Z("div", {
          ref_key: "bodyEl",
          ref: K,
          class: "cc-screen",
          onScroll: X
        }, [
          ct(F.$slots, "default", { resizeKey: G.value }, void 0, !0),
          P[1] || (P[1] = Z("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [fl, !i.value.minimized]
      ]),
      !i.value.minimized && !i.value.maximized ? (ie(), re("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Re(B, ["stop"])
      }, null, 32)) : Se("", !0)
    ], 46, bn)) : Se("", !0);
  }
}), _n = /* @__PURE__ */ Ge(In, [["__scopeId", "data-v-d8a49f79"]]);
export {
  Qe as CANDLE_THEME_COLORS,
  Rn as CathodeCandle,
  _n as CathodeContainer,
  Dn as CathodeGrid,
  Bl as CathodeLog,
  En as CathodeTerminal,
  Bn as CathodeWorkspace,
  Je as LOG_THEME_COLORS,
  Fn as buildDefaultLayout,
  Ot as useCathodeLayout
};
