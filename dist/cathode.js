import { defineComponent as Ue, ref as Y, reactive as it, computed as K, watch as O, inject as lt, nextTick as Le, onMounted as Ve, onUnmounted as Ke, openBlock as ie, createElementBlock as se, normalizeStyle as ye, createElementVNode as J, withModifiers as De, withKeys as el, createCommentVNode as Se, toDisplayString as Me, provide as kt, renderSlot as ut, createVNode as tl, Transition as ll, withCtx as nl, Fragment as ol, renderList as al, createTextVNode as rl, normalizeClass as il, withDirectives as sl, vShow as cl } from "vue";
import * as $ from "three";
const $e = {
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
}, ae = 30, Tt = 12, ul = 10;
function It(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, i = $e[l.theme] ?? $e.none, { cols: u, rows: v, pinnedRows: f, rowHeight: c, scrollY: s, scrollX: x, glow: y } = l;
  e.clearRect(0, 0, n, a), e.fillStyle = i.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const S = f.length * c, g = a - ae - S;
  e.fillStyle = i.headerBg, e.fillRect(0, 0, n, ae), e.textBaseline = "middle", e.textAlign = "left";
  let m = -x;
  for (let p = 0; p < u.length; p++) {
    const M = u[p];
    if (m + M.width <= 0) {
      m += M.width;
      continue;
    }
    if (m >= n) break;
    const F = !!l.colFilters[M.colId], k = l.sortColId === M.colId, C = (M.colDef.headerName ?? M.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(m, 0, M.width, ae), e.clip(), e.font = `bold ${ul}px system-ui, -apple-system, sans-serif`, e.fillStyle = F ? i.accent : i.textHeader, y && (e.shadowBlur = 6, e.shadowColor = i.textHeader), e.fillText(C, m + 8, ae / 2), e.shadowBlur = 0, k) {
      const w = e.measureText(C).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = i.accent, e.fillText(l.sortDir === "asc" ? "▲" : "▼", m + 8 + w + 4, ae / 2);
    }
    M.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = F ? i.accent : i.textHeader, e.globalAlpha = F ? 1 : 0.38, e.fillText("⌕", m + M.width - 20, ae / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(m + M.width - 0.5, 0), e.lineTo(m + M.width - 0.5, ae), e.stroke(), m += M.width;
  }
  e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, ae - 0.5), e.lineTo(n, ae - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ae, n, g), e.clip();
  const d = Math.max(0, Math.floor(s / c)), h = Math.min(v.length, Math.ceil((s + g) / c));
  for (let p = d; p < h; p++) {
    const M = v[p], F = ae + p * c - s;
    p % 2 === 1 && (e.fillStyle = i.rowAlt, e.fillRect(0, F, n, c)), p === l.hoveredRow && p !== l.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, F, n, c)), p === l.selectedRow && (e.fillStyle = fl(i.accent, 0.1), e.fillRect(0, F, n, c)), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, F + c - 0.5), e.lineTo(n, F + c - 0.5), e.stroke();
    let k = -x;
    for (let C = 0; C < u.length; C++) {
      const w = u[C];
      if (k + w.width <= 0) {
        k += w.width;
        continue;
      }
      if (k >= n) break;
      const _ = l.getCellStyle(w, M), A = _.color ?? i.text, V = _.textAlign ?? "left", G = l.formatCell(w, M);
      e.save(), e.beginPath(), e.rect(k + 1, F, w.width - 2, c), e.clip(), e.font = `${Tt}px system-ui, -apple-system, sans-serif`, e.fillStyle = A, e.textBaseline = "middle", y && (e.shadowBlur = 4, e.shadowColor = A), V === "right" ? (e.textAlign = "right", e.fillText(G, k + w.width - 8, F + c / 2)) : (e.textAlign = "left", e.fillText(G, k + 8, F + c / 2)), e.shadowBlur = 0, e.restore(), p === l.selectedRow && C === l.selectedCol && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(k + 1.5, F + 1.5, w.width - 3, c - 3)), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(k + w.width - 0.5, F), e.lineTo(k + w.width - 0.5, F + c), e.stroke(), k += w.width;
    }
  }
  if (e.restore(), f.length > 0) {
    const p = a - S;
    e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, p - 0.5), e.lineTo(n, p - 0.5), e.stroke();
    for (let M = 0; M < f.length; M++) {
      const F = f[M], k = p + M * c;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, k, n, c);
      let C = -x;
      for (let w = 0; w < u.length; w++) {
        const _ = u[w];
        if (C + _.width <= 0) {
          C += _.width;
          continue;
        }
        if (C >= n) break;
        const A = l.getCellStyle(_, F), V = A.color ?? i.text, G = A.textAlign ?? "left", U = l.formatCell(_, F);
        e.save(), e.beginPath(), e.rect(C + 1, k, _.width - 2, c), e.clip(), e.font = `bold ${Tt}px system-ui, -apple-system, sans-serif`, e.fillStyle = V, e.textBaseline = "middle", G === "right" ? (e.textAlign = "right", e.fillText(U, C + _.width - 8, k + c / 2)) : (e.textAlign = "left", e.fillText(U, C + 8, k + c / 2)), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(C + _.width - 0.5, k), e.lineTo(C + _.width - 0.5, k + c), e.stroke(), C += _.width;
      }
      e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, k + c - 0.5), e.lineTo(n, k + c - 0.5), e.stroke();
    }
  }
  e.restore();
}
function fl(t, l) {
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
function dl(t, l, e) {
  return t >= l + e - 24 && t < l + e;
}
function Lt(t, l, e) {
  const n = l + e;
  return t >= n - 6 && t <= n + 1;
}
function Et(t, l, e, n, a, i, u, v, f) {
  const c = t + f;
  let s = -1, x = 0;
  for (let m = 0; m < e.length; m++) {
    if (c >= x && c < x + e[m].width) {
      s = m;
      break;
    }
    x += e[m].width;
  }
  if (l < ae) return { area: "header", colIdx: s, rowIdx: -1 };
  const y = v * a;
  if (y > 0 && l >= u - y) {
    const m = Math.floor((l - (u - y)) / a);
    return { area: "pinned", colIdx: s, rowIdx: m };
  }
  const S = l - ae + i, g = Math.floor(S / a);
  return g >= 0 && g < n ? { area: "body", colIdx: s, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const vl = ["value"], hl = ["disabled"], ml = ["disabled"], gl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, pl = `
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
`, wl = 28, bl = 600, xl = /* @__PURE__ */ Ue({
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
    const e = t, n = l, a = Y(e.rowData ?? []), i = Y(e.pinnedBottomRowData ?? []), u = Y(""), v = Y(null), f = it({}), c = it({}), s = it(/* @__PURE__ */ new Set()), x = Y(0), y = Y(0), S = Y(0), g = Y(0), m = Y(0), d = Y(-1), h = Y(null), p = Y(null), M = Y({ x: 0, y: ae }), F = Y("");
    function k(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const C = K(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((r) => !s.has(k(r))).map((r) => {
        const b = k(r), T = { ...o, ...r };
        return { colId: b, colDef: T, width: c[b] ?? T.width ?? 100 };
      });
    }), w = K(() => {
      const o = y.value;
      if (!o) return C.value;
      const r = C.value.reduce((I, L) => I + L.width, 0);
      if (!r || r >= o) return C.value;
      const b = o / r;
      let T = 0;
      return C.value.map((I, L) => {
        const X = L === C.value.length - 1 ? o - T : Math.max(8, Math.round(I.width * b));
        return T += X, { ...I, width: X };
      });
    }), _ = K(() => {
      const o = w.value.reduce((r, b) => r + b.width, 0);
      return Math.max(0, o - y.value);
    }), A = K(() => {
      const o = i.value.length * e.rowHeight;
      return Math.max(0, S.value - ae - o);
    }), V = K(
      () => Math.max(0, q.value.length * e.rowHeight - A.value)
    ), G = K(
      () => Math.max(1, Math.floor(A.value / e.rowHeight))
    ), U = K(
      () => q.value.length === 0 ? 0 : Math.min(q.value.length - 1, Math.floor(g.value / e.rowHeight))
    ), ge = K(
      () => Math.min(q.value.length - 1, U.value + G.value - 1)
    );
    function N(o, r) {
      if (r.colDef.valueGetter) return r.colDef.valueGetter({ data: o, colDef: r.colDef });
      if (r.colDef.field) return o[r.colDef.field];
    }
    function oe(o, r) {
      const b = N(r, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: b, data: r, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: b, data: r, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : b == null ? "" : String(b);
    }
    function we(o, r) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: N(r, o), data: r, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const q = K(() => {
      x.value;
      let o = a.value;
      const r = u.value.trim().toLowerCase();
      r && (o = o.filter(
        (b) => C.value.some(
          (T) => String(N(b, T) ?? "").toLowerCase().includes(r)
        )
      ));
      for (const [b, T] of Object.entries(f)) {
        if (!T) continue;
        const I = C.value.find((L) => L.colId === b);
        if (I)
          if (T.startsWith("__eq__")) {
            const L = T.slice(6).toLowerCase();
            o = o.filter((z) => String(N(z, I) ?? "").toLowerCase() === L);
          } else {
            const L = T.toLowerCase();
            o = o.filter((z) => String(N(z, I) ?? "").toLowerCase().includes(L));
          }
      }
      if (v.value) {
        const { colId: b, dir: T } = v.value, I = C.value.find((L) => L.colId === b);
        I && (o = [...o].sort((L, z) => {
          const X = N(L, I), le = N(z, I);
          let ne = 0;
          return I.colDef.comparator ? ne = I.colDef.comparator(X, le) : typeof X == "number" && typeof le == "number" ? ne = X - le : ne = String(X ?? "").localeCompare(String(le ?? ""), void 0, { numeric: !0 }), T === "asc" ? ne : -ne;
        }));
      }
      return o;
    });
    O(q, () => {
      g.value = 0, h.value = null;
    }), O(_, () => {
      m.value = Math.min(m.value, _.value);
    }), O(V, () => {
      g.value = Math.min(g.value, V.value);
    });
    function ke(o) {
      const r = o * e.rowHeight, b = r + e.rowHeight;
      r < g.value ? g.value = r : b > g.value + A.value && (g.value = Math.min(V.value, b - A.value));
    }
    function Te() {
      g.value = Math.max(0, g.value - A.value), fe();
    }
    function D() {
      g.value = Math.min(V.value, g.value + A.value), fe();
    }
    let H = !1, j = "", ee = 0, E = 0, W = !1, P = !1, de = 0, ce = 0, be = 0, Re = 0, R = !1;
    function B(o, r) {
      var b;
      H = !0, j = o, ee = r, E = ((b = w.value.find((T) => T.colId === o)) == null ? void 0 : b.width) ?? 100, W = !1;
    }
    function Q(o) {
      if (P) {
        const L = de - o.clientX, z = ce - o.clientY;
        (Math.abs(L) > 4 || Math.abs(z) > 4) && (R = !0), m.value = Math.max(0, Math.min(_.value, be + L)), g.value = Math.max(0, Math.min(V.value, Re + z)), fe();
        return;
      }
      if (!H) return;
      const r = y.value, b = Math.max(30, E + (o.clientX - ee)), T = C.value.filter((L) => L.colId !== j).reduce((L, z) => L + z.width, 0), I = r - b;
      I > 10 && (c[j] = Math.max(10, Math.round(b * T / I))), fe();
    }
    function xe() {
      P && (R && (W = !0), P = !1), H && (H = !1, W = !0, n("column-resized"));
    }
    const ve = Y(null), Z = Y(null), Pt = lt("cathodeResetTick", Y(0));
    O(Pt, () => He());
    let te = null, ze = !1, nt, pt, Ie, he, ue;
    function wt() {
      if (!(!Z.value || !ve.value)) {
        ue = document.createElement("canvas");
        try {
          te = new $.WebGLRenderer({ canvas: Z.value, antialias: !1, alpha: !0 });
        } catch {
          ze = !0;
        }
        if (!ze && !te.getContext() && (te.dispose(), te = null, ze = !0), ze) {
          Be();
          return;
        }
        te.setPixelRatio(1), te.setClearColor(0, 0), nt = new $.Scene(), pt = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), he = new $.CanvasTexture(ue), he.minFilter = $.LinearFilter, he.magFilter = $.LinearFilter, Ie = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: he },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new $.Color(0) }
          },
          vertexShader: gl,
          fragmentShader: pl,
          transparent: !0
        }), nt.add(new $.Mesh(new $.PlaneGeometry(2, 2), Ie)), Be();
      }
    }
    function Be() {
      if (!ve.value || !te && !ze) return;
      const o = ve.value.clientWidth, r = ve.value.clientHeight - (e.pagination ? wl : 0);
      if (!o || !r) return;
      const b = ue.width !== o || ue.height !== r;
      ue.width = o, ue.height = r, y.value = o, S.value = r, m.value = Math.max(0, Math.min(_.value, m.value)), g.value = Math.max(0, Math.min(V.value, g.value)), te ? (b && he && (he.dispose(), he = new $.CanvasTexture(ue), he.minFilter = $.LinearFilter, he.magFilter = $.LinearFilter, Ie && (Ie.uniforms.uTex.value = he)), te.setPixelRatio(window.devicePixelRatio || 1), te.setSize(o, r)) : Z.value && (Z.value.width = o, Z.value.height = r, Z.value.style.width = o + "px", Z.value.style.height = r + "px"), fe();
    }
    function fe() {
      var b, T, I, L, z, X, le, ne;
      if (!(ue != null && ue.width)) return;
      if (ze) {
        if (!Z.value) return;
        It(ue, {
          cols: w.value,
          rows: q.value,
          pinnedRows: i.value,
          rowHeight: e.rowHeight,
          scrollY: g.value,
          scrollX: m.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((b = v.value) == null ? void 0 : b.colId) ?? null,
          sortDir: ((T = v.value) == null ? void 0 : T.dir) ?? null,
          colFilters: f,
          hoveredRow: d.value,
          selectedRow: ((I = h.value) == null ? void 0 : I.row) ?? -1,
          selectedCol: ((L = h.value) == null ? void 0 : L.col) ?? -1,
          formatCell: oe,
          getCellStyle: we
        });
        const Ct = Z.value.getContext("2d");
        Ct && Ct.drawImage(ue, 0, 0);
        return;
      }
      if (!te || !Ie || !he) return;
      const o = $e[e.theme] ?? $e.none, r = e.theme === "paper";
      Ie.uniforms.uStrength.value = e.curvature / 45 * 0.55, Ie.uniforms.uScanlines.value = e.scanlines && !r ? 1 : 0, Ie.uniforms.uVignette.value = r ? 0 : 1, Ie.uniforms.uBezel.value.set(o.bg), It(ue, {
        cols: w.value,
        rows: q.value,
        pinnedRows: i.value,
        rowHeight: e.rowHeight,
        scrollY: g.value,
        scrollX: m.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((z = v.value) == null ? void 0 : z.colId) ?? null,
        sortDir: ((X = v.value) == null ? void 0 : X.dir) ?? null,
        colFilters: f,
        hoveredRow: d.value,
        selectedRow: ((le = h.value) == null ? void 0 : le.row) ?? -1,
        selectedCol: ((ne = h.value) == null ? void 0 : ne.col) ?? -1,
        formatCell: oe,
        getCellStyle: we
      }), he.needsUpdate = !0, te.render(nt, pt);
    }
    function ot(o) {
      if (!Z.value) return [-1, -1];
      const r = Z.value.getBoundingClientRect();
      return [o.clientX - r.left, o.clientY - r.top];
    }
    let at = 0;
    function $t(o) {
      p.value = null;
      const r = Date.now();
      if (o.deltaX !== 0) {
        at = r, m.value = Math.max(0, Math.min(_.value, m.value + o.deltaX)), fe();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        at = r, m.value = Math.max(0, Math.min(_.value, m.value + o.deltaY)), fe();
        return;
      }
      r - at < bl || (g.value = Math.max(0, Math.min(V.value, g.value + o.deltaY)), fe());
    }
    function Ot(o) {
      if (H) return;
      const [r, b] = ot(o);
      if (r < 0) {
        d.value = -1, fe();
        return;
      }
      const T = Et(
        r,
        b,
        w.value,
        q.value.length,
        e.rowHeight,
        g.value,
        ue.height,
        i.value.length,
        m.value
      );
      if (d.value = T.area === "body" ? T.rowIdx : -1, T.area === "header" && T.colIdx >= 0) {
        const I = w.value[T.colIdx], L = st(T.colIdx, w.value), z = r + m.value;
        Z.value.style.cursor = I && Lt(z, L, I.width) ? "col-resize" : "pointer";
      } else T.area === "body" ? Z.value.style.cursor = "pointer" : Z.value.style.cursor = "default";
      fe();
    }
    function Vt() {
      d.value = -1, fe();
    }
    function Xt(o) {
      const [r, b] = ot(o);
      if (r < 0) return;
      if (b >= ae) {
        P = !0, R = !1, de = o.clientX, ce = o.clientY, be = m.value, Re = g.value;
        return;
      }
      const T = r + m.value;
      for (let I = 0; I < w.value.length; I++) {
        const L = w.value[I], z = st(I, w.value);
        if (L.colDef.resizable !== !1 && Lt(T, z, L.width)) {
          B(L.colId, o.clientX);
          return;
        }
      }
    }
    function Nt(o) {
      var I, L, z;
      if (W) {
        W = !1;
        return;
      }
      if (H) return;
      const [r, b] = ot(o);
      if (r < 0) {
        p.value = null;
        return;
      }
      const T = Et(
        r,
        b,
        w.value,
        q.value.length,
        e.rowHeight,
        g.value,
        ue.height,
        i.value.length,
        m.value
      );
      if (T.area === "header" && T.colIdx >= 0) {
        const X = w.value[T.colIdx], le = st(T.colIdx, w.value), ne = r + m.value;
        X.colDef.filter && dl(ne, le, X.width) ? (o.stopPropagation(), p.value === X.colId ? p.value = null : (p.value = X.colId, F.value = (I = f[X.colId]) != null && I.startsWith("__eq__") ? f[X.colId].slice(6) : f[X.colId] ?? "", M.value = { x: Math.max(0, le - m.value), y: ae })) : X.colDef.sortable !== !1 && (p.value = null, v.value = ((L = v.value) == null ? void 0 : L.colId) === X.colId ? v.value.dir === "asc" ? { colId: X.colId, dir: "desc" } : null : { colId: X.colId, dir: "asc" }, n("sort-changed"));
        return;
      }
      if (p.value = null, T.area === "body" && T.rowIdx >= 0 && T.colIdx >= 0) {
        const X = T.rowIdx;
        h.value = { row: X, col: T.colIdx }, (z = Z.value) == null || z.focus();
        const le = q.value[X], ne = w.value[T.colIdx];
        le && ne && (n("row-clicked", { data: le, event: o }), n("cell-selected", { data: le, row: X, col: T.colIdx, colId: ne.colId }));
      }
    }
    function bt(o) {
      var r, b;
      p.value && ((b = (r = o.target).closest) != null && b.call(r, ".cathode-filter-popup") || (p.value = null));
    }
    function Gt(o) {
      var I;
      if (!y.value) return;
      let r = 0;
      for (let L = 0; L < o; L++) r += w.value[L].width;
      const b = ((I = w.value[o]) == null ? void 0 : I.width) ?? 0, T = r - m.value;
      T < 0 ? m.value = Math.max(0, r) : T + b > y.value && (m.value = Math.min(_.value, r + b - y.value));
    }
    function Ut(o) {
      var X;
      const r = w.value, b = r.length - 1, T = q.value.length - 1;
      if (!h.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), h.value = { row: U.value, col: 0 });
        return;
      }
      let { row: I, col: L } = h.value;
      const z = (le, ne) => {
        I = Math.max(0, Math.min(T, le)), L = Math.max(0, Math.min(b, ne)), h.value = { row: I, col: L }, ke(I), Gt(L);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), z(I + 1, L);
          break;
        case "ArrowUp":
          o.preventDefault(), z(I - 1, L);
          break;
        case "ArrowRight":
          o.preventDefault(), L < b ? z(I, L + 1) : z(I + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), L > 0 ? z(I, L - 1) : z(I - 1, b);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? L > 0 ? z(I, L - 1) : z(I - 1, b) : L < b ? z(I, L + 1) : z(I + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? z(I - 1, L) : z(I + 1, L);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? z(0, 0) : z(I, 0);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? z(T, b) : z(I, b);
          break;
        case "PageDown":
          o.preventDefault(), z(Math.min(T, I + G.value), L);
          break;
        case "PageUp":
          o.preventDefault(), z(Math.max(0, I - G.value), L);
          break;
        case "Escape":
          h.value = null;
          break;
        case "c":
        case "C":
          if (o.ctrlKey || o.metaKey) {
            o.preventDefault();
            const le = q.value[I], ne = r[L];
            le && ne && ((X = navigator.clipboard) == null || X.writeText(oe(ne, le)).catch(() => {
            }));
          }
          break;
      }
    }
    function Kt(o) {
      const r = o.target.value;
      F.value = r, r ? f[p.value] = r : delete f[p.value], n("filter-changed");
    }
    function xt() {
      p.value && delete f[p.value], F.value = "", p.value = null, n("filter-changed");
    }
    const qt = {
      setGridOption(o, r) {
        o === "rowData" ? a.value = r : o === "pinnedBottomRowData" ? i.value = r : o === "quickFilterText" && (u.value = r);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var b, T;
          const r = k(o);
          return {
            colId: r,
            hide: s.has(r),
            sort: ((b = v.value) == null ? void 0 : b.colId) === r ? v.value.dir : null,
            sortIndex: ((T = v.value) == null ? void 0 : T.colId) === r ? 0 : null,
            width: c[r] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const r of o)
          r.hide === !0 && s.add(r.colId), r.hide === !1 && s.delete(r.colId), r.sort && (v.value = { colId: r.colId, dir: r.sort }), r.width && (c[r.colId] = r.width);
      },
      setFilterModel(o) {
        for (const r of Object.keys(f)) delete f[r];
        if (o)
          for (const [r, b] of Object.entries(o))
            (b == null ? void 0 : b.type) === "equals" ? f[r] = `__eq__${b.filter}` : b != null && b.filter && (f[r] = b.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [r, b] of Object.entries(f))
          b && (o[r] = b.startsWith("__eq__") ? { type: "equals", filter: b.slice(6) } : { type: "contains", filter: b });
        return o;
      },
      async setColumnFilterModel(o, r) {
        r ? r.type === "equals" ? f[o] = `__eq__${r.filter}` : f[o] = r.filter ?? "" : delete f[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        x.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const r = C.value, b = r.map((z) => z.colDef.headerName ?? z.colId).join(","), T = q.value.map(
          (z) => r.map((X) => `"${String(oe(X, z)).replace(/"/g, '""')}"`).join(",")
        ), I = new Blob([[b, ...T].join(`
`)], { type: "text/csv" }), L = URL.createObjectURL(I);
        Object.assign(document.createElement("a"), { href: L, download: o }).click(), URL.revokeObjectURL(L);
      },
      resize() {
        Be();
      },
      resetColumnState() {
        s.clear();
        for (const r of e.columnDefs)
          r.hide && s.add(k(r));
        const o = e.columnDefs.find((r) => r.sort);
        v.value = o ? { colId: k(o), dir: o.sort } : null;
        for (const r of Object.keys(c)) delete c[r];
        for (const r of Object.keys(f)) delete f[r];
        u.value = "", g.value = 0, h.value = null, p.value = null;
      }
    };
    O(
      [q, () => i.value, w, g, d, h],
      () => Le(fe)
    ), O(() => e.theme, () => fe()), O(() => e.curvature, () => Le(Be)), O(() => e.scanlines, () => fe()), O(() => e.glow, () => fe()), O(h, (o) => {
      if (!o) return;
      const r = q.value[o.row], b = w.value[o.col];
      r && b && n("cell-selected", { data: r, row: o.row, col: o.col, colId: b.colId });
    });
    let Xe = null, Ne = null, rt = 0;
    function He() {
      cancelAnimationFrame(rt), rt = requestAnimationFrame(Be);
    }
    function yt(o) {
      o.preventDefault();
    }
    function Mt() {
      te == null || te.dispose(), te = null, ze = !1, wt();
    }
    Ve(() => {
      for (const o of e.columnDefs)
        o.hide && s.add(k(o)), o.sort && !v.value && (v.value = { colId: k(o), dir: o.sort });
      a.value = e.rowData ?? [], i.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", bt), document.addEventListener("mousemove", Q), document.addEventListener("mouseup", xe), Le(() => {
        var o;
        wt(), Z.value && (Z.value.addEventListener("webglcontextlost", yt), Z.value.addEventListener("webglcontextrestored", Mt)), ve.value && (Xe = new ResizeObserver(() => Be()), Xe.observe(ve.value), Ne = new IntersectionObserver((r) => {
          r.some((b) => b.isIntersecting) && He();
        }), Ne.observe(ve.value)), window.addEventListener("resize", He), (o = window.visualViewport) == null || o.addEventListener("resize", He), n("grid-ready", { api: qt });
      });
    }), Ke(() => {
      var o, r, b;
      document.removeEventListener("click", bt, !0), document.removeEventListener("mousemove", Q), document.removeEventListener("mouseup", xe), (o = Z.value) == null || o.removeEventListener("webglcontextlost", yt), (r = Z.value) == null || r.removeEventListener("webglcontextrestored", Mt), Xe == null || Xe.disconnect(), Ne == null || Ne.disconnect(), window.removeEventListener("resize", He), (b = window.visualViewport) == null || b.removeEventListener("resize", He), cancelAnimationFrame(rt), te == null || te.dispose();
    });
    const me = K(() => $e[e.theme] ?? $e.none), jt = K(() => ({
      position: "absolute",
      left: `${M.value.x}px`,
      top: `${M.value.y}px`,
      zIndex: 100,
      background: me.value.headerBg,
      border: `1px solid ${me.value.accent}`,
      color: me.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Zt = K(() => ({
      background: me.value.bg,
      border: `1px solid ${me.value.border}`,
      color: me.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Jt = K(() => ({
      background: me.value.headerBg,
      borderTop: `1px solid ${me.value.border}`,
      color: me.value.text
    })), Qt = K(() => ({
      background: me.value.bg
    })), St = K(() => me.value.accent);
    return (o, r) => {
      var b, T;
      return ie(), se("div", {
        ref_key: "wrapEl",
        ref: ve,
        class: "cathode-wrap",
        style: ye(Qt.value)
      }, [
        J("canvas", {
          ref_key: "canvasEl",
          ref: Z,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: De($t, ["prevent"]),
          onMousemove: Ot,
          onMouseleave: Vt,
          onMousedown: Xt,
          onClick: Nt,
          onKeydown: Ut
        }, null, 544),
        p.value ? (ie(), se("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: ye(jt.value),
          onClick: r[0] || (r[0] = De(() => {
          }, ["stop"]))
        }, [
          J("input", {
            style: ye(Zt.value),
            value: F.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Kt,
            onKeydown: el(xt, ["escape"])
          }, null, 44, vl),
          F.value ? (ie(), se("button", {
            key: 0,
            style: ye({
              background: "none",
              border: "none",
              color: me.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: xt
          }, "✕", 4)) : Se("", !0)
        ], 4)) : Se("", !0),
        t.pagination ? (ie(), se("div", {
          key: 1,
          class: "cathode-pagination",
          style: ye(Jt.value)
        }, [
          J("button", {
            disabled: g.value <= 0,
            onClick: r[1] || (r[1] = (I) => Te())
          }, "◀", 8, hl),
          J("span", null, Me((U.value + 1).toLocaleString()) + "–" + Me(Math.min(q.value.length, ge.value + 1).toLocaleString()) + " / " + Me(q.value.length.toLocaleString()), 1),
          J("button", {
            disabled: g.value >= V.value,
            onClick: r[2] || (r[2] = (I) => D())
          }, "▶", 8, ml),
          J("span", {
            class: "cathode-page-info",
            style: ye({ color: St.value })
          }, Me(q.value.length.toLocaleString()) + " rows ", 5),
          h.value ? (ie(), se("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: ye({ color: St.value })
          }, Me(((b = w.value[h.value.col]) == null ? void 0 : b.colDef.headerName) ?? ((T = w.value[h.value.col]) == null ? void 0 : T.colId)) + " : " + Me(oe(w.value[h.value.col], q.value[h.value.row])), 5)) : Se("", !0)
        ], 4)) : Se("", !0)
      ], 4);
    };
  }
}), qe = (t, l) => {
  const e = t.__vccOpts || t;
  for (const [n, a] of l)
    e[n] = a;
  return e;
}, Mn = /* @__PURE__ */ qe(xl, [["__scopeId", "data-v-07901c91"]]), Je = {
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
function yl(t, l) {
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
const Ml = 12, pe = 18, Ze = 10, Oe = 6, vt = `${Ml}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Sl(t, l, e) {
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
    let u = "";
    for (const v of i) {
      const f = u + v;
      if (t.measureText(f).width <= e)
        u = f;
      else if (u && (n.push(u.replace(/\s+$/, "")), u = ""), t.measureText(v).width > e) {
        let c = "";
        for (const s of v)
          t.measureText(c + s).width > e ? (c && n.push(c), c = s) : c += s;
        u = c;
      } else
        u = v.replace(/^\s+/, "");
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
function Cl(t, l) {
  return Math.ceil(t.measureText(l).width) + 12;
}
function kl(t) {
  const { entries: l, ctx: e, textMaxWidth: n, showTimestamps: a, wordWrap: i } = t, u = t.formatTs ?? Yt;
  e.font = vt;
  const v = [];
  for (let f = 0; f < l.length; f++) {
    const c = l[f], s = c.level ?? "info", x = a && c.ts != null ? u(c.ts) : "", y = i ? Sl(e, c.text, n) : c.text.split(`
`);
    for (let S = 0; S < y.length; S++)
      v.push({
        entryIdx: f,
        text: y[S],
        level: s,
        timestamp: S === 0 ? x : "",
        isFirstFrag: S === 0
      });
  }
  return v;
}
function Rt(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, i = Je[l.theme] ?? Je.none;
  e.clearRect(0, 0, n, a), e.fillStyle = i.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip(), e.font = vt, e.textBaseline = "middle";
  const u = l.visualLines, v = Ze, f = l.showTimestamps ? Ze + l.timestampWidth : Ze, c = Math.max(0, Math.floor((l.scrollY - Oe) / pe)), s = Math.min(u.length, Math.ceil((l.scrollY + a - Oe) / pe) + 1);
  for (let x = c; x < s; x++) {
    const y = u[x], S = Oe + x * pe - l.scrollY + pe / 2;
    if (y.entryIdx % 2 === 1 && y.isFirstFrag) {
      e.fillStyle = i.rowAlt;
      let m = 1;
      for (; x + m < s && u[x + m].entryIdx === y.entryIdx; ) m++;
      e.fillRect(0, S - pe / 2, n, pe * m);
    }
    x === l.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, S - pe / 2, n, pe)), l.showTimestamps && y.timestamp && (e.fillStyle = i.timestamp, e.textAlign = "left", l.glow && (e.shadowBlur = 3, e.shadowColor = i.timestamp), e.fillText(y.timestamp, v, S), e.shadowBlur = 0);
    const g = yl(i, y.level);
    e.fillStyle = g, e.textAlign = "left", l.glow && (e.shadowBlur = 4, e.shadowColor = g), e.fillText(y.text, f, S), e.shadowBlur = 0;
  }
  e.restore();
}
function Tl(t, l, e) {
  if (t < 0) return -1;
  const n = Math.floor((t + l - Oe) / pe);
  return n < 0 || n >= e ? -1 : n;
}
function Il(t) {
  return Oe * 2 + t * pe;
}
const Ll = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, El = `
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
`, Rl = /* @__PURE__ */ Ue({
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
    const e = t, n = Y(null), a = Y(null), i = Y(0), u = Y(0), v = Y(0), f = Y(-1), c = Y(!0), s = K(() => {
      const R = e.entries ?? [];
      return e.maxLines > 0 && R.length > e.maxLines ? R.slice(R.length - e.maxLines) : R;
    }), x = K(() => {
      if (!e.showTimestamps) return "";
      const R = e.formatTs ?? Yt;
      let B = "00:00:00";
      for (const Q of s.value) {
        if (Q.ts == null) continue;
        const xe = R(Q.ts);
        xe.length > B.length && (B = xe);
      }
      return B;
    }), y = Y(0), S = Y([]);
    function g() {
      if (!w) return;
      const R = w.getContext("2d");
      if (!R) return;
      R.font = vt;
      const B = e.showTimestamps ? Cl(R, x.value) : 0;
      y.value = B;
      const Q = Math.max(
        1,
        i.value - Ze * 2 - B
      );
      S.value = kl({
        entries: s.value,
        ctx: R,
        textMaxWidth: Q,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const m = K(() => Il(S.value.length)), d = K(() => Math.max(0, m.value - u.value));
    O(d, () => {
      c.value ? v.value = d.value : v.value = Math.min(v.value, d.value);
    }), O(
      [s, i, () => e.showTimestamps, () => e.wordWrap, x],
      () => {
        g(), Le(V);
      },
      { deep: !1 }
    );
    let h = null, p = !1, M, F, k, C, w;
    function _() {
      if (!(!a.value || !n.value)) {
        w = document.createElement("canvas");
        try {
          h = new $.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          p = !0;
        }
        if (!p && !h.getContext() && (h.dispose(), h = null, p = !0), p) {
          A();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), M = new $.Scene(), F = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), C = new $.CanvasTexture(w), C.minFilter = $.LinearFilter, C.magFilter = $.LinearFilter, k = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: C },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Ll,
          fragmentShader: El,
          transparent: !0
        }), M.add(new $.Mesh(new $.PlaneGeometry(2, 2), k)), A();
      }
    }
    function A() {
      if (!n.value || !h && !p) return;
      const R = n.value.clientWidth, B = n.value.clientHeight;
      if (!R || !B) return;
      const Q = w.width !== R || w.height !== B;
      Q && (w.width = R, w.height = B, i.value = R, u.value = B, g(), h ? (Q && C && (C.dispose(), C = new $.CanvasTexture(w), C.minFilter = $.LinearFilter, C.magFilter = $.LinearFilter, k && (k.uniforms.uTex.value = C)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(R, B)) : a.value && (a.value.width = R, a.value.height = B, a.value.style.width = R + "px", a.value.style.height = B + "px"), c.value && (v.value = Math.max(0, m.value - u.value)), V());
    }
    function V() {
      if (!(w != null && w.width)) return;
      if (p) {
        if (!a.value) return;
        Rt(w, {
          visualLines: S.value,
          scrollY: v.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: y.value,
          hoveredLine: f.value
        });
        const B = a.value.getContext("2d");
        B && B.drawImage(w, 0, 0);
        return;
      }
      if (!h || !k || !C) return;
      const R = e.theme === "paper";
      k.uniforms.uStrength.value = e.curvature / 45 * 0.55, k.uniforms.uScanlines.value = e.scanlines && !R ? 1 : 0, k.uniforms.uVignette.value = R ? 0 : 1, Rt(w, {
        visualLines: S.value,
        scrollY: v.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: y.value,
        hoveredLine: f.value
      }), C.needsUpdate = !0, h.render(M, F);
    }
    O(() => e.theme, () => V()), O(() => e.curvature, () => V()), O(() => e.scanlines, () => V()), O(() => e.glow, () => V()), O(v, () => V()), O(f, () => V());
    function G(R) {
      if (!a.value) return [-1, -1];
      const B = a.value.getBoundingClientRect();
      return [R.clientX - B.left, R.clientY - B.top];
    }
    function U(R) {
      v.value = Math.max(0, Math.min(d.value, R)), c.value = v.value >= d.value - 4;
    }
    function ge(R) {
      U(v.value + R.deltaY);
    }
    let N = !1, oe = 0, we = 0;
    function q(R) {
      N = !0, oe = R.clientY, we = v.value;
    }
    function ke(R) {
      if (N) {
        const B = oe - R.clientY;
        U(we + B);
      }
    }
    function Te() {
      N && (N = !1);
    }
    function D(R) {
      const [, B] = G(R);
      if (B < 0) {
        f.value = -1;
        return;
      }
      f.value = Tl(B, v.value, S.value.length);
    }
    function H() {
      f.value = -1;
    }
    l({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        c.value = !0, v.value = d.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(R) {
        U(Oe + R * pe);
      }
    });
    let j = null, ee = null, E = 0;
    const W = lt("cathodeResetTick", Y(0));
    O(W, () => P());
    function P() {
      cancelAnimationFrame(E), E = requestAnimationFrame(A);
    }
    function de(R) {
      R.preventDefault();
    }
    function ce() {
      h == null || h.dispose(), h = null, p = !1, _();
    }
    Ve(() => {
      document.addEventListener("mousemove", ke), document.addEventListener("mouseup", Te), Le(() => {
        var R;
        _(), a.value && (a.value.addEventListener("webglcontextlost", de), a.value.addEventListener("webglcontextrestored", ce)), n.value && (j = new ResizeObserver(() => A()), j.observe(n.value), ee = new IntersectionObserver((B) => {
          B.some((Q) => Q.isIntersecting) && P();
        }), ee.observe(n.value)), window.addEventListener("resize", P), (R = window.visualViewport) == null || R.addEventListener("resize", P), v.value = d.value;
      });
    }), Ke(() => {
      var R, B, Q;
      document.removeEventListener("mousemove", ke), document.removeEventListener("mouseup", Te), (R = a.value) == null || R.removeEventListener("webglcontextlost", de), (B = a.value) == null || B.removeEventListener("webglcontextrestored", ce), j == null || j.disconnect(), ee == null || ee.disconnect(), window.removeEventListener("resize", P), (Q = window.visualViewport) == null || Q.removeEventListener("resize", P), cancelAnimationFrame(E), h == null || h.dispose();
    });
    const be = K(() => Je[e.theme] ?? Je.none), Re = K(() => ({
      background: be.value.bg
    }));
    return (R, B) => (ie(), se("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: ye(Re.value)
    }, [
      J("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: De(ge, ["prevent"]),
        onMousemove: D,
        onMouseleave: H,
        onMousedown: q
      }, null, 544)
    ], 4));
  }
}), Sn = /* @__PURE__ */ qe(Rl, [["__scopeId", "data-v-d2d092f3"]]), Qe = {
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
    markerExit: "#e74c3c"
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
    markerExit: "#d93025"
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
    markerExit: "#ff8080"
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
    markerExit: "#ff7030"
  }
}, Dl = 0.18, Ge = 8, ht = 22, Ee = 8, _e = 56, Fe = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ct = 4, _l = 1, Fl = 1;
function Wl(t, l, e, n = 0) {
  const a = Math.max(0, l - Ee - _e), i = Math.max(1, Math.floor(a / e)), u = Math.min(i, t);
  return { firstIdx: Math.max(0, t - u - Math.floor(n / e)), count: u, slotW: e };
}
function zl(t, l, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, a = -1 / 0, i = 0;
  const u = Math.min(t.length, l + e);
  for (let f = l; f < u; f++) {
    const c = t[f];
    c && (c.low < n && (n = c.low), c.high > a && (a = c.high), c.volume > i && (i = c.volume));
  }
  if (!isFinite(n) || !isFinite(a) || n === a) {
    const f = isFinite(n) ? n : 0;
    return { min: f - 1, max: f + 1, maxVol: Math.max(1, i) };
  }
  const v = (a - n) * 0.04;
  return { min: n - v, max: a + v, maxVol: Math.max(1, i) };
}
function Yl(t, l) {
  const e = Math.max(1, t - Ge - ht - ct), n = Math.max(0, Math.round(e * l)), a = e - n;
  return {
    priceY0: Ge,
    priceY1: Ge + a,
    volumeY0: Ge + a + ct,
    volumeY1: Ge + a + ct + n
  };
}
function Ce(t, l, e, n) {
  const a = l.max - l.min;
  return a <= 0 ? (e + n) / 2 : e + (1 - (t - l.min) / a) * (n - e);
}
function We(t, l, e) {
  return Ee + (t - l + 0.5) * e;
}
function Ye(t) {
  return t >= 1e4 ? t.toFixed(0) : t >= 100 ? t.toFixed(1) : t >= 1 ? t.toFixed(2) : t >= 0.01 ? t.toFixed(4) : t.toFixed(6);
}
function mt(t) {
  const l = new Date(t), e = String(l.getMonth() + 1).padStart(2, "0"), n = String(l.getDate()).padStart(2, "0"), a = String(l.getHours()).padStart(2, "0"), i = String(l.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${a}:${i}`;
}
function Al(t, l) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, l), n = Math.pow(10, Math.floor(Math.log10(e))), a = e / n;
  let i;
  return a < 1.5 ? i = 1 : a < 3 ? i = 2 : a < 7 ? i = 5 : i = 10, i * n;
}
function Dt(t, l) {
  var x, y, S, g, m;
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, i = Qe[l.theme] ?? Qe.none;
  if (e.clearRect(0, 0, n, a), e.fillStyle = i.bg, e.fillRect(0, 0, n, a), !l.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const u = Wl(l.candles.length, n, l.slotW, l.scrollX), v = zl(l.candles, u.firstIdx, u.count), f = Yl(a, l.showVolume ? l.volumeFraction : 0), c = Math.max(_l, Math.floor(l.slotW * 0.7)), s = Math.min(l.candles.length, u.firstIdx + u.count);
  for (let d = u.firstIdx; d < s; d++) {
    const h = l.candles[d];
    if (!h) continue;
    const p = We(d, u.firstIdx, l.slotW), M = Ce(h.open, v, f.priceY0, f.priceY1), F = Ce(h.close, v, f.priceY0, f.priceY1), k = Ce(h.high, v, f.priceY0, f.priceY1), C = Ce(h.low, v, f.priceY0, f.priceY1), w = h.close >= h.open, _ = w ? i.wickBull : i.wickBear, A = w ? i.candleBull : i.candleBear;
    l.glow && (e.shadowBlur = 4, e.shadowColor = A), e.strokeStyle = _, e.lineWidth = Fl, e.beginPath(), e.moveTo(Math.round(p) + 0.5, k), e.lineTo(Math.round(p) + 0.5, C), e.stroke(), e.fillStyle = A;
    const V = Math.min(M, F), G = Math.max(1, Math.abs(F - M));
    if (e.fillRect(
      Math.round(p - c / 2),
      Math.round(V),
      c,
      Math.round(G)
    ), e.shadowBlur = 0, l.showVolume && v.maxVol > 0) {
      const U = Math.round(h.volume / v.maxVol * (f.volumeY1 - f.volumeY0));
      U > 0 && (e.fillStyle = w ? i.volumeBull : i.volumeBear, e.fillRect(
        Math.round(p - c / 2),
        f.volumeY1 - U,
        c,
        U
      ));
    }
  }
  if ((x = l.overlays) != null && x.length)
    for (const d of l.overlays) Bl(e, d, u, v, f, l.slotW);
  (y = l.markers) != null && y.length && Gl(e, i, l.markers, l.candles, u, v, f, l.slotW), Ul(e, i, v, f, n), Kl(e, i, l.candles, u, l.slotW, a), Xl(e, i, l.candles, n, a), (S = l.overlays) != null && S.length && Pl(e, i, l.overlays, f), l.hover && (ql(e, i, l.candles, u, v, f, l.slotW, l.hover, n), $l(e, i, l.candles, u, l.slotW, l.hover, f, ((g = l.overlays) == null ? void 0 : g.length) ?? 0), (m = l.markers) != null && m.length && Vl(e, i, l.markers, l.candles, u, v, f, l.slotW, l.hover, n)), e.restore();
}
function Bl(t, l, e, n, a, i) {
  var v;
  const u = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    Ee,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), l.kind === "line")
    je(t, l.data, e.firstIdx, u, i, n, a, l.color, l.lineWidth ?? 1, l.dashed === !0);
  else {
    const f = At(l.color, l.fillAlpha ?? 0.08);
    Hl(t, l.upper, l.lower, e.firstIdx, u, i, n, a, f), je(t, l.upper, e.firstIdx, u, i, n, a, l.color, 1, !1), je(t, l.lower, e.firstIdx, u, i, n, a, l.color, 1, !1), (v = l.middle) != null && v.length && je(t, l.middle, e.firstIdx, u, i, n, a, l.color, 1, l.middleDashed !== !1);
  }
  t.restore();
}
function je(t, l, e, n, a, i, u, v, f, c) {
  if (!l || !l.length) return;
  t.strokeStyle = v, t.lineWidth = f, t.setLineDash(c ? [4, 3] : []), t.beginPath();
  let s = !1;
  for (let x = e; x < n; x++) {
    const y = l[x];
    if (typeof y != "number" || !isFinite(y)) {
      s && (t.stroke(), t.beginPath(), s = !1);
      continue;
    }
    const S = We(x, e, a), g = Ce(y, i, u.priceY0, u.priceY1);
    s ? t.lineTo(S, g) : (t.moveTo(S, g), s = !0);
  }
  s && t.stroke(), t.setLineDash([]);
}
function Hl(t, l, e, n, a, i, u, v, f) {
  if (!(l != null && l.length) || !(e != null && e.length)) return;
  t.fillStyle = f;
  let c = !1, s = -1;
  for (let x = n; x <= a; x++) {
    const y = l[x], S = e[x], g = x < a && typeof y == "number" && typeof S == "number" && isFinite(y) && isFinite(S);
    if (g && !c && (s = x, c = !0), !g && c || x === a && c) {
      const m = g ? x + 1 : x;
      t.beginPath();
      for (let d = s; d < m; d++) {
        const h = We(d, n, i), p = Ce(l[d], u, v.priceY0, v.priceY1);
        d === s ? t.moveTo(h, p) : t.lineTo(h, p);
      }
      for (let d = m - 1; d >= s; d--) {
        const h = We(d, n, i), p = Ce(e[d], u, v.priceY0, v.priceY1);
        t.lineTo(h, p);
      }
      t.closePath(), t.fill(), c = !1;
    }
  }
}
function At(t, l) {
  const e = Math.max(0, Math.min(1, l));
  if (t.startsWith("#") && t.length === 7) {
    const n = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), i = parseInt(t.slice(5, 7), 16);
    return `rgba(${n},${a},${i},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Pl(t, l, e, n) {
  const a = e.filter((m) => !!m.label);
  if (!a.length) return;
  t.save(), t.font = Fe;
  const i = 8, u = 5, v = 12, f = 6, c = 14;
  let s = 0;
  for (const m of a) {
    const d = t.measureText(m.label).width;
    d > s && (s = d);
  }
  const x = i * 2 + v + f + s, y = u * 2 + c * a.length, S = Ee + 4, g = n.priceY0 + 4;
  t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "rgba(13,21,32,0.55)" : "rgba(0,0,0,0.30)", t.fillRect(S, g, x, y), t.textBaseline = "middle", t.textAlign = "left";
  for (let m = 0; m < a.length; m++) {
    const d = a[m], h = g + u + c * (m + 0.5), p = S + i;
    d.kind === "line" ? (t.strokeStyle = d.color, t.lineWidth = d.lineWidth ?? 1, t.setLineDash(d.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(p, h), t.lineTo(p + v, h), t.stroke(), t.setLineDash([])) : (t.fillStyle = At(d.color, d.fillAlpha ?? 0.2), t.fillRect(p, h - 4, v, 8), t.strokeStyle = d.color, t.lineWidth = 1, t.strokeRect(p + 0.5, h - 4 + 0.5, v - 1, 7)), t.fillStyle = l.text, t.fillText(d.label, p + v + f, h);
  }
  t.restore();
}
function $l(t, l, e, n, a, i, u, v) {
  const f = Math.floor((i.x - Ee) / a), c = n.firstIdx + f;
  if (c < 0 || c >= e.length) return;
  const s = e[c];
  if (!s) return;
  const x = s.close - s.open, y = s.open !== 0 ? x / s.open * 100 : 0, S = x >= 0 ? "+" : "", g = [
    ["O", Ye(s.open), void 0],
    ["H", Ye(s.high), void 0],
    ["L", Ye(s.low), void 0],
    ["C", Ye(s.close), void 0],
    ["V", Ol(s.volume), void 0],
    ["", `${S}${y.toFixed(2)}%`, x >= 0 ? l.candleBull : l.candleBear]
  ];
  t.save(), t.font = Fe, t.textBaseline = "middle", t.textAlign = "left";
  const m = 8, d = 4, h = 14;
  let p = m;
  for (const [C, w] of g) {
    const _ = C ? `${C} ${w}` : w, A = t.measureText(_).width + 12;
    p += A;
  }
  p += m - 12;
  const M = u.priceY0 + 4 + (v > 0 ? d * 2 + 14 * v + 4 : 0), F = Ee + 4;
  t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "rgba(13,21,32,0.55)" : "rgba(0,0,0,0.30)", t.fillRect(F, M, p, h + d * 2);
  let k = F + m;
  for (let C = 0; C < g.length; C++) {
    const [w, _, A] = g[C];
    t.fillStyle = l.text, w && (t.globalAlpha = 0.6, t.fillText(w + " ", k, M + d + h / 2), t.globalAlpha = 1, k += t.measureText(w + " ").width), A && (t.fillStyle = A), t.fillText(_, k, M + d + h / 2), k += t.measureText(_).width + 12;
  }
  t.restore();
}
function Ol(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function Vl(t, l, e, n, a, i, u, v, f, c) {
  if (!n.length) return;
  const s = n.length > 1 ? n[1].start - n[0].start : 6e4, x = Math.max(1, s * 0.5), y = Math.min(n.length, a.firstIdx + a.count), S = 9;
  let g = null;
  for (const _ of e) {
    let A = 0, V = n.length - 1, G = -1;
    for (; A <= V; ) {
      const N = A + V >> 1, oe = n[N].start - _.timestamp;
      if (Math.abs(oe) <= x) {
        G = N;
        break;
      }
      oe < 0 ? A = N + 1 : V = N - 1;
    }
    if (G < 0 || G < a.firstIdx || G >= y) continue;
    const U = We(G, a.firstIdx, v), ge = Ce(_.price, i, u.priceY0, u.priceY1);
    if (Math.abs(f.x - U) <= S && Math.abs(f.y - ge) <= S) {
      g = { m: _, x: U, y: ge };
      break;
    }
  }
  if (!g) return;
  const m = mt(g.m.timestamp), d = [
    `${g.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${m}`,
    `@ ${Ye(g.m.price)}`
  ];
  g.m.label && d.push(g.m.label), t.save(), t.font = Fe, t.textBaseline = "top", t.textAlign = "left";
  const h = 6, p = 14;
  let M = 0;
  for (const _ of d) {
    const A = t.measureText(_).width;
    A > M && (M = A);
  }
  const F = M + h * 2, k = d.length * p + h * 2;
  let C = g.x + 12;
  C + F > c - _e && (C = g.x - 12 - F);
  let w = g.y - k / 2;
  w < u.priceY0 && (w = u.priceY0), w + k > u.priceY1 && (w = u.priceY1 - k), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "rgba(13,21,32,0.92)" : "rgba(0,0,0,0.78)", t.strokeStyle = g.m.kind === "entry" ? l.markerEntry : l.markerExit, t.lineWidth = 1, t.fillRect(C, w, F, k), t.strokeRect(C + 0.5, w + 0.5, F - 1, k - 1);
  for (let _ = 0; _ < d.length; _++) {
    const A = d[_];
    t.fillStyle = _ === 0 ? g.m.kind === "entry" ? l.markerEntry : l.markerExit : l.text, t.fillText(A, C + h, w + h + _ * p);
  }
  t.restore();
}
function Xl(t, l, e, n, a) {
  if (e.length < 2) return;
  const i = e[1].start - e[0].start, u = Nl(i);
  if (!u) return;
  t.save(), t.font = Fe, t.textBaseline = "top", t.textAlign = "right";
  const v = 6, f = 3, c = t.measureText(u).width, s = n - _e - v, x = a - ht + 4;
  t.fillStyle = l.accent, t.fillRect(s - c - v, x - f, c + v * 2, 14 + f * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(u, s, x), t.restore();
}
function Nl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const l = 1e3, e = 60 * l, n = 60 * e, a = 24 * n, i = 7 * a;
  return t >= i && t % i === 0 ? t / i + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= n && t % n === 0 ? t / n + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= l && t % l === 0 ? t / l + "s" : Math.round(t / e) + "m";
}
function Gl(t, l, e, n, a, i, u, v) {
  if (!n.length) return;
  const f = n.length > 1 ? n[1].start - n[0].start : 6e4, c = Math.max(1, f * 0.5), s = Math.min(n.length, a.firstIdx + a.count), x = (S) => {
    let g = 0, m = n.length - 1;
    for (; g <= m; ) {
      const d = g + m >> 1, h = n[d].start - S;
      if (Math.abs(h) <= c) return d;
      h < 0 ? g = d + 1 : m = d - 1;
    }
    return -1;
  }, y = 7;
  for (const S of e) {
    const g = x(S.timestamp);
    if (g < 0 || g < a.firstIdx || g >= s) continue;
    const m = We(g, a.firstIdx, v), d = Ce(S.price, i, u.priceY0, u.priceY1);
    if (d < u.priceY0 || d > u.priceY1) continue;
    const h = S.color ?? (S.kind === "entry" ? l.markerEntry : l.markerExit);
    t.fillStyle = h, t.strokeStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.lineWidth = 1.5, t.beginPath(), S.kind === "entry" ? (t.moveTo(m, d - y), t.lineTo(m - y, d + y - 1), t.lineTo(m + y, d + y - 1)) : (t.moveTo(m, d + y), t.lineTo(m - y, d - y + 1), t.lineTo(m + y, d - y + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function Ul(t, l, e, n, a) {
  const i = e.max - e.min;
  if (i <= 0) return;
  const u = Al(i, 6), v = Math.ceil(e.min / u) * u;
  t.font = Fe, t.fillStyle = l.text, t.strokeStyle = l.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let f = v; f <= e.max; f += u) {
    const c = Ce(f, e, n.priceY0, n.priceY1);
    c < n.priceY0 || c > n.priceY1 || (t.beginPath(), t.moveTo(Ee, Math.round(c) + 0.5), t.lineTo(a - _e, Math.round(c) + 0.5), t.stroke(), t.fillText(Ye(f), a - _e + 4, c));
  }
  t.globalAlpha = 1;
}
function Kl(t, l, e, n, a, i) {
  if (n.count <= 0 || !e.length) return;
  const v = Math.max(1, Math.floor(n.count / 6));
  t.font = Fe, t.fillStyle = l.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const f = Math.min(e.length, n.firstIdx + n.count);
  for (let c = n.firstIdx; c < f; c += v) {
    const s = e[c];
    if (!s) continue;
    const x = We(c, n.firstIdx, a);
    t.fillText(mt(s.start), x, i - ht + 4);
  }
  t.globalAlpha = 1;
}
function ql(t, l, e, n, a, i, u, v, f) {
  const c = Math.floor((v.x - Ee) / u), s = Math.max(0, Math.min(e.length - 1, n.firstIdx + c)), x = e[s];
  if (!x) return;
  const y = We(s, n.firstIdx, u);
  t.save(), t.strokeStyle = l.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(y) + 0.5, i.priceY0), t.lineTo(Math.round(y) + 0.5, i.volumeY1 || i.priceY1), t.stroke();
  const S = Math.max(i.priceY0, Math.min(i.priceY1, v.y));
  t.beginPath(), t.moveTo(Ee, Math.round(S) + 0.5), t.lineTo(f - _e, Math.round(S) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const g = a.max - a.min;
  if (g > 0) {
    const h = a.max - (S - i.priceY0) / (i.priceY1 - i.priceY0) * g, p = Ye(h);
    t.font = Fe, t.textBaseline = "middle", t.textAlign = "left";
    const M = t.measureText(p).width, F = 4, k = 2;
    t.fillStyle = l.accent, t.fillRect(f - _e + 2, S - 7 - k, M + F * 2, 14 + k * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(p, f - _e + 2 + F, S);
  }
  t.font = Fe, t.textBaseline = "top", t.textAlign = "center";
  const m = mt(x.start), d = t.measureText(m).width;
  t.fillStyle = l.accent, t.fillRect(y - d / 2 - 4, i.volumeY1 + 2, d + 8, 14), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(m, y, i.volumeY1 + 4), t.restore();
}
const _t = 0.25, Ft = 6, jl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Zl = `
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
`, Jl = /* @__PURE__ */ Ue({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Dl },
    slotW: { default: 8 },
    overlays: {},
    markers: {}
  },
  setup(t) {
    const l = t, e = Y(null), n = Y(null), a = Y(0), i = Y(0), u = Y(0), v = Y(1), f = Y(null), c = K(() => Math.max(1, l.slotW * v.value));
    let s = null, x = !1, y, S, g, m, d;
    function h() {
      if (!(!n.value || !e.value)) {
        d = document.createElement("canvas");
        try {
          s = new $.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0 });
        } catch {
          x = !0;
        }
        if (!x && !s.getContext() && (s.dispose(), s = null, x = !0), x) {
          p();
          return;
        }
        s.setPixelRatio(1), s.setClearColor(0, 0), y = new $.Scene(), S = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new $.CanvasTexture(d), m.minFilter = $.LinearFilter, m.magFilter = $.LinearFilter, g = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: jl,
          fragmentShader: Zl,
          transparent: !0
        }), y.add(new $.Mesh(new $.PlaneGeometry(2, 2), g)), p();
      }
    }
    function p() {
      if (!e.value || !s && !x) return;
      const E = e.value.clientWidth, W = e.value.clientHeight;
      !E || !W || !(d.width !== E || d.height !== W) || (d.width = E, d.height = W, a.value = E, i.value = W, s ? (m && (m.dispose(), m = new $.CanvasTexture(d), m.minFilter = $.LinearFilter, m.magFilter = $.LinearFilter, g && (g.uniforms.uTex.value = m)), s.setPixelRatio(window.devicePixelRatio || 1), s.setSize(E, W)) : n.value && (n.value.width = E, n.value.height = W, n.value.style.width = E + "px", n.value.style.height = W + "px"), M());
    }
    function M() {
      if (!(d != null && d.width)) return;
      if (x) {
        if (!n.value) return;
        Dt(d, {
          candles: l.candles,
          slotW: c.value,
          scrollX: u.value,
          theme: l.theme,
          glow: !1,
          showVolume: l.showVolume,
          volumeFraction: l.volumeFraction,
          hover: f.value,
          overlays: l.overlays,
          markers: l.markers
        });
        const W = n.value.getContext("2d");
        W && W.drawImage(d, 0, 0);
        return;
      }
      if (!s || !g || !m) return;
      const E = l.theme === "paper";
      g.uniforms.uStrength.value = l.curvature / 45 * 0.55, g.uniforms.uScanlines.value = l.scanlines && !E ? 1 : 0, g.uniforms.uVignette.value = E ? 0 : 1, Dt(d, {
        candles: l.candles,
        slotW: c.value,
        scrollX: u.value,
        theme: l.theme,
        glow: l.glow,
        showVolume: l.showVolume,
        volumeFraction: l.volumeFraction,
        hover: f.value,
        overlays: l.overlays,
        markers: l.markers
      }), m.needsUpdate = !0, s.render(y, S);
    }
    O(() => l.theme, () => M()), O(() => l.curvature, () => M()), O(() => l.scanlines, () => M()), O(() => l.glow, () => M()), O(() => l.showVolume, () => M()), O(() => l.volumeFraction, () => M()), O(() => l.slotW, () => M()), O(() => l.candles, () => M(), { deep: !1 }), O(() => l.overlays, () => M(), { deep: !1 }), O(() => l.markers, () => M(), { deep: !1 }), O(u, () => M()), O(v, () => M()), O(f, () => M()), O(c, () => M());
    let F = null, k = null, C = 0;
    const w = lt("cathodeResetTick", Y(0));
    O(w, () => _());
    function _() {
      cancelAnimationFrame(C), C = requestAnimationFrame(p);
    }
    function A(E) {
      E.preventDefault();
    }
    function V() {
      s == null || s.dispose(), s = null, x = !1, h();
    }
    function G(E) {
      if (!n.value) return [-1, -1];
      const W = n.value.getBoundingClientRect();
      return [E.clientX - W.left, E.clientY - W.top];
    }
    function U(E) {
      var be;
      const W = c.value;
      if (W <= 0) return 0;
      const P = ((be = l.candles) == null ? void 0 : be.length) ?? 0, de = Math.max(1, Math.floor((a.value || 1) / W)), ce = Math.max(0, P - de);
      return Math.max(0, Math.min(E, ce * W));
    }
    function ge(E) {
      var de;
      if (E.deltaX !== 0 || E.shiftKey && E.deltaY !== 0) {
        const ce = E.deltaX !== 0 ? E.deltaX : E.deltaY;
        u.value = U(u.value + ce);
        return;
      }
      if (E.deltaY === 0) return;
      const [W] = G(E), P = c.value;
      if (W >= 0 && P > 0 && ((de = l.candles) != null && de.length)) {
        const ce = Math.max(1, Math.floor((a.value || 1) / P)), Re = Math.max(0, l.candles.length - ce - Math.floor(u.value / P)) + (W - 8) / P, R = Math.exp(-E.deltaY * 15e-4), B = Math.max(_t, Math.min(Ft, v.value * R));
        v.value = B;
        const Q = l.slotW * B, xe = Math.max(1, Math.floor((a.value || 1) / Q)), ve = Re - (W - 8) / Q, Z = Math.max(0, l.candles.length - xe - ve);
        u.value = U(Z * Q);
      } else {
        const ce = Math.exp(-E.deltaY * 15e-4);
        v.value = Math.max(_t, Math.min(Ft, v.value * ce));
      }
    }
    let N = !1, oe = 0, we = 0;
    function q(E) {
      E.button === 0 && (N = !0, oe = E.clientX, we = u.value, f.value = null);
    }
    function ke(E) {
      if (N) {
        const W = E.clientX - oe;
        u.value = U(we + W);
        return;
      }
    }
    function Te() {
      N = !1;
    }
    function D(E) {
      if (N) return;
      const [W, P] = G(E);
      if (W < 0 || P < 0) {
        f.value = null;
        return;
      }
      f.value = { x: W, y: P };
    }
    function H() {
      f.value = null;
    }
    Ve(() => {
      document.addEventListener("mousemove", ke), document.addEventListener("mouseup", Te), Le(() => {
        var E;
        h(), n.value && (n.value.addEventListener("webglcontextlost", A), n.value.addEventListener("webglcontextrestored", V)), e.value && (F = new ResizeObserver(() => p()), F.observe(e.value), k = new IntersectionObserver((W) => {
          W.some((P) => P.isIntersecting) && _();
        }), k.observe(e.value)), window.addEventListener("resize", _), (E = window.visualViewport) == null || E.addEventListener("resize", _);
      });
    }), Ke(() => {
      var E, W, P;
      document.removeEventListener("mousemove", ke), document.removeEventListener("mouseup", Te), (E = n.value) == null || E.removeEventListener("webglcontextlost", A), (W = n.value) == null || W.removeEventListener("webglcontextrestored", V), F == null || F.disconnect(), k == null || k.disconnect(), window.removeEventListener("resize", _), (P = window.visualViewport) == null || P.removeEventListener("resize", _), cancelAnimationFrame(C), s == null || s.dispose();
    });
    const j = K(() => Qe[l.theme] ?? Qe.none), ee = K(() => ({
      background: j.value.bg
    }));
    return (E, W) => (ie(), se("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: ye(ee.value)
    }, [
      J("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-candle-canvas",
        onWheel: De(ge, ["prevent"]),
        onMousedown: q,
        onMousemove: D,
        onMouseleave: H
      }, null, 544)
    ], 4));
  }
}), Cn = /* @__PURE__ */ qe(Jl, [["__scopeId", "data-v-f6f8dffc"]]), gt = Y(0), ft = 28, Pe = 12;
let dt = 10, et = "cathode.layout", tt = !1;
const re = Y({});
function Ql(t, l = "cathode.layout") {
  if (!tt) {
    tt = !0, et = l;
    try {
      const e = localStorage.getItem(et);
      if (e) {
        re.value = JSON.parse(e), Wt();
        return;
      }
    } catch {
    }
    re.value = { ...t }, Wt();
  }
}
function Wt() {
  let t = 10;
  for (const l of Object.values(re.value))
    typeof (l == null ? void 0 : l.zIndex) == "number" && l.zIndex > t && (t = l.zIndex);
  dt = t;
}
function Ae() {
  localStorage.setItem(et, JSON.stringify(re.value));
}
function en(t) {
  tt = !1, localStorage.removeItem(et), re.value = { ...t }, Ae(), tt = !0, gt.value++;
}
function Bt(t) {
  dt++, re.value[t] && (re.value[t].zIndex = dt);
}
function tn(t, l) {
  re.value[t].visible = l, Ae();
}
function ln(t, l) {
  re.value[t].minimized = l, l && (re.value[t].maximized = !1), Ae();
}
function nn(t, l) {
  re.value[t].maximized = l, l && (re.value[t].minimized = !1, Bt(t)), Ae();
}
function on(t, l, e) {
  re.value[t].x = Math.round(l), re.value[t].y = Math.round(e), Ae();
}
function an(t, l, e) {
  re.value[t].w = Math.round(l), re.value[t].h = Math.round(e), Ae();
}
function kn(t, l, e) {
  const n = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / n), i = Math.floor((t - Pe * (n + 1)) / n), u = Math.floor((l - Pe * (a + 1)) / a), v = {};
  return e.forEach((f, c) => {
    const s = c % n, x = Math.floor(c / n);
    v[f] = {
      x: Pe + s * (i + Pe),
      y: Pe + x * (u + Pe),
      w: i,
      h: u,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: c + 1
    };
  }), v;
}
function Ht() {
  return {
    containers: re,
    TITLEBAR_H: ft,
    load: Ql,
    save: Ae,
    reset: en,
    bringToFront: Bt,
    setVisible: tn,
    setMinimized: ln,
    setMaximized: nn,
    updatePos: on,
    updateSize: an
  };
}
const rn = { class: "ws-toolbar" }, sn = {
  key: 0,
  class: "ws-restore-menu"
}, cn = {
  key: 0,
  class: "ws-restore-empty"
}, un = ["onClick"], fn = /* @__PURE__ */ Ue({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const l = t, { containers: e, load: n, reset: a, setVisible: i } = Ht(), u = Y(null);
    kt("cathodeWorkspace", u), kt("cathodeResetTick", gt), Ve(() => {
      if (!u.value) return;
      const { clientWidth: d, clientHeight: h } = u.value, p = l.initialLayout ?? {};
      n(p, l.storageKey ?? "cathode.layout");
      const M = Object.keys(e.value)[0];
      M && v(M);
    });
    function v(d) {
      var p;
      document.querySelectorAll(".cc").forEach((M) => M.classList.remove("cc-focused"));
      const h = (p = u.value) == null ? void 0 : p.querySelector(`#cc-${d}`);
      h && h.classList.add("cc-focused");
    }
    function f() {
      !u.value || !l.initialLayout || a(l.initialLayout);
    }
    function c(d) {
      const h = d.target.closest(".cc");
      h && (document.querySelectorAll(".cc").forEach((p) => p.classList.remove("cc-focused")), h.classList.add("cc-focused"));
    }
    const s = Y(!1), x = () => Object.entries(e.value).filter(([, d]) => !d.visible).map(([d]) => d);
    function y(d) {
      i(d, !0), s.value = !1;
    }
    function S(d) {
      if (!s.value) return;
      const h = d.target;
      !h.closest(".ws-restore-menu") && !h.closest(".ws-btn-restore") && (s.value = !1);
    }
    function g(d) {
      d.key === "Escape" && (s.value = !1);
    }
    Ve(() => {
      document.addEventListener("click", S), document.addEventListener("keydown", g);
    }), Ke(() => {
      document.removeEventListener("click", S), document.removeEventListener("keydown", g);
    });
    function m(d) {
      var h;
      return ((h = l.containerTitles) == null ? void 0 : h[d]) ?? d;
    }
    return (d, h) => (ie(), se("div", {
      ref_key: "workspaceEl",
      ref: u,
      class: "cathode-workspace",
      onMousedown: c
    }, [
      ut(d.$slots, "default", {}, void 0, !0),
      ut(d.$slots, "overlay", {}, void 0, !0),
      J("div", rn, [
        t.initialLayout ? (ie(), se("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: f
        }, " ↺ Reset Layout ")) : Se("", !0),
        h[1] || (h[1] = J("div", { class: "ws-sep" }, null, -1)),
        J("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, " ⊞ Restore Panel ")
      ]),
      tl(ll, { name: "menu" }, {
        default: nl(() => [
          s.value ? (ie(), se("div", sn, [
            h[3] || (h[3] = J("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            x().length ? Se("", !0) : (ie(), se("div", cn, " No closed panels ")),
            (ie(!0), se(ol, null, al(x(), (p) => (ie(), se("div", {
              key: p,
              class: "ws-restore-item",
              onClick: (M) => y(p)
            }, [
              h[2] || (h[2] = J("span", { class: "ws-restore-icon" }, "⊞", -1)),
              rl(" " + Me(m(p)), 1)
            ], 8, un))), 128))
          ])) : Se("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Tn = /* @__PURE__ */ qe(fn, [["__scopeId", "data-v-5838d04b"]]), dn = ["id"], vn = { class: "cc-title" }, hn = {
  key: 0,
  class: "cc-size-badge"
}, mn = { class: "cc-controls" }, gn = ["title"], pn = { class: "cc-body" }, wn = 200, bn = 80, zt = 60, xn = /* @__PURE__ */ Ue({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const l = t, { containers: e, bringToFront: n, setVisible: a, setMinimized: i, setMaximized: u, updatePos: v, updateSize: f } = Ht(), c = lt("cathodeWorkspace", Y(null)), s = K(() => e.value[l.id]), x = K(() => {
      const D = s.value, H = l.curvature ?? 0;
      if (!D) return {};
      const j = { "--curvature": H };
      return D.maximized ? { ...j, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: D.zIndex } : {
        ...j,
        left: D.x + "px",
        top: D.y + "px",
        width: D.w + "px",
        height: D.minimized ? ft + "px" : D.h + "px",
        zIndex: D.zIndex,
        display: D.visible ? "flex" : "none"
      };
    });
    let y = !1, S = 0, g = 0;
    function m(D) {
      var ee;
      if (D.target.closest(".cc-btn") || s.value.maximized) return;
      n(l.id), y = !0;
      const H = (ee = c.value) == null ? void 0 : ee.querySelector(`#cc-${l.id}`);
      if (!H) return;
      const j = H.getBoundingClientRect();
      S = D.clientX - j.left, g = D.clientY - j.top, document.addEventListener("mousemove", d), document.addEventListener("mouseup", h), D.preventDefault();
    }
    function d(D) {
      var W;
      if (!y || !c.value) return;
      const H = c.value.getBoundingClientRect(), j = ((W = s.value) == null ? void 0 : W.w) ?? 300;
      let ee = D.clientX - H.left - S, E = D.clientY - H.top - g;
      ee = Math.max(zt - j, Math.min(H.width - zt, ee)), E = Math.max(0, Math.min(H.height - ft, E)), v(l.id, ee, E);
    }
    function h() {
      y = !1, document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", h);
    }
    let p = !1, M = 0, F = 0, k = 0, C = 0;
    const w = Y("");
    function _(D) {
      s.value.maximized || (n(l.id), p = !0, M = D.clientX, F = D.clientY, k = s.value.w, C = s.value.h, document.addEventListener("mousemove", A), document.addEventListener("mouseup", V), D.preventDefault(), D.stopPropagation());
    }
    function A(D) {
      if (!p) return;
      const H = Math.max(wn, k + (D.clientX - M)), j = Math.max(bn, C + (D.clientY - F));
      f(l.id, H, j), w.value = `${Math.round(H)}×${Math.round(j)}`;
    }
    function V() {
      p = !1, w.value = "", document.removeEventListener("mousemove", A), document.removeEventListener("mouseup", V), G.value++;
    }
    const G = Y(0);
    O(gt, () => {
      G.value++;
    }), Ke(() => {
      var D;
      document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", h), document.removeEventListener("mousemove", A), document.removeEventListener("mouseup", V), (D = U.value) == null || D.removeEventListener("scroll", N), oe();
    });
    const U = Y(null);
    function ge(D) {
      if (l.canvas) return [];
      const H = D.children[0];
      return H ? Array.from(H.children) : [];
    }
    function N() {
      const D = U.value, H = l.curvature ?? 0;
      if (!D) return;
      const j = ge(D);
      if (!j.length) return;
      const ee = D.clientHeight, E = ee / 2, W = H * 38e-4;
      j.forEach((P) => {
        if (!P.dataset.origFs) {
          const ve = getComputedStyle(P);
          P.dataset.origFs = ve.fontSize, P.dataset.origLh = ve.lineHeight;
        }
        if (H === 0) {
          P.style.fontSize = "", P.style.lineHeight = "";
          return;
        }
        const de = P.getBoundingClientRect(), ce = D.getBoundingClientRect(), be = de.top - ce.top + de.height / 2, Re = Math.min(1, Math.abs(be - E) / (ee / 2)), R = 1 + W * Math.cos(Re * Math.PI / 2), B = parseFloat(P.dataset.origFs), Q = P.dataset.origLh, xe = Q === "normal" ? B * 1.4 : parseFloat(Q);
        isNaN(B) || (P.style.fontSize = `${(B * R).toFixed(2)}px`), isNaN(xe) || (P.style.lineHeight = `${(xe * R).toFixed(2)}px`);
      });
    }
    function oe() {
      const D = U.value;
      D && ge(D).forEach((H) => {
        H.style.fontSize = "", H.style.lineHeight = "", delete H.dataset.origFs, delete H.dataset.origLh;
      });
    }
    O(() => l.curvature, (D) => {
      (D ?? 0) === 0 ? oe() : N();
    }), Ve(() => {
      var D;
      (D = U.value) == null || D.addEventListener("scroll", N, { passive: !0 }), Le(N);
    });
    function we() {
      i(l.id, !s.value.minimized), Le(() => {
        G.value++;
      });
    }
    function q() {
      u(l.id, !s.value.maximized), Le(() => {
        G.value++;
      });
    }
    function ke() {
      a(l.id, !1);
    }
    function Te() {
      n(l.id);
    }
    return (D, H) => s.value && s.value.visible ? (ie(), se("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: il(["cc", { "cc-minimized": s.value.minimized, "cc-maximized": s.value.maximized, "cc-has-canvas": t.canvas }]),
      style: ye(x.value),
      onMousedown: Te
    }, [
      J("div", {
        class: "cc-titlebar",
        onMousedown: m
      }, [
        H[0] || (H[0] = J("span", { class: "cc-status-dot" }, null, -1)),
        J("span", vn, Me(t.title), 1),
        w.value ? (ie(), se("span", hn, Me(w.value), 1)) : Se("", !0),
        J("div", mn, [
          J("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: De(we, ["stop"])
          }, "─"),
          J("button", {
            class: "cc-btn cc-btn-max",
            title: s.value.maximized ? "Restore" : "Maximize",
            onClick: De(q, ["stop"])
          }, Me(s.value.maximized ? "⤡" : "⤢"), 9, gn),
          J("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: De(ke, ["stop"])
          }, "✕")
        ])
      ], 32),
      sl(J("div", pn, [
        J("div", {
          ref_key: "bodyEl",
          ref: U,
          class: "cc-screen",
          onScroll: N
        }, [
          ut(D.$slots, "default", { resizeKey: G.value }, void 0, !0),
          H[1] || (H[1] = J("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [cl, !s.value.minimized]
      ]),
      !s.value.minimized && !s.value.maximized ? (ie(), se("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: De(_, ["stop"])
      }, null, 32)) : Se("", !0)
    ], 46, dn)) : Se("", !0);
  }
}), In = /* @__PURE__ */ qe(xn, [["__scopeId", "data-v-d8a49f79"]]);
export {
  Qe as CANDLE_THEME_COLORS,
  Cn as CathodeCandle,
  In as CathodeContainer,
  Mn as CathodeGrid,
  Sn as CathodeLog,
  Tn as CathodeWorkspace,
  Je as LOG_THEME_COLORS,
  kn as buildDefaultLayout,
  Ht as useCathodeLayout
};
