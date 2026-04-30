import { defineComponent as Ue, ref as W, reactive as rt, computed as K, watch as $, inject as lt, nextTick as Le, onMounted as Ve, onUnmounted as Ke, openBlock as re, createElementBlock as se, normalizeStyle as ye, createElementVNode as J, withModifiers as Re, withKeys as el, createCommentVNode as Se, toDisplayString as Me, provide as kt, renderSlot as ut, createVNode as tl, Transition as ll, withCtx as nl, Fragment as ol, renderList as al, createTextVNode as il, normalizeClass as rl, withDirectives as sl, vShow as cl } from "vue";
import * as O from "three";
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
  const n = t.width, a = t.height, r = $e[l.theme] ?? $e.none, { cols: u, rows: v, pinnedRows: f, rowHeight: c, scrollY: s, scrollX: x, glow: y } = l;
  e.clearRect(0, 0, n, a), e.fillStyle = r.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const S = f.length * c, g = a - ae - S;
  e.fillStyle = r.headerBg, e.fillRect(0, 0, n, ae), e.textBaseline = "middle", e.textAlign = "left";
  let h = -x;
  for (let p = 0; p < u.length; p++) {
    const M = u[p];
    if (h + M.width <= 0) {
      h += M.width;
      continue;
    }
    if (h >= n) break;
    const _ = !!l.colFilters[M.colId], k = l.sortColId === M.colId, C = (M.colDef.headerName ?? M.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(h, 0, M.width, ae), e.clip(), e.font = `bold ${ul}px system-ui, -apple-system, sans-serif`, e.fillStyle = _ ? r.accent : r.textHeader, y && (e.shadowBlur = 6, e.shadowColor = r.textHeader), e.fillText(C, h + 8, ae / 2), e.shadowBlur = 0, k) {
      const w = e.measureText(C).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = r.accent, e.fillText(l.sortDir === "asc" ? "▲" : "▼", h + 8 + w + 4, ae / 2);
    }
    M.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = _ ? r.accent : r.textHeader, e.globalAlpha = _ ? 1 : 0.38, e.fillText("⌕", h + M.width - 20, ae / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(h + M.width - 0.5, 0), e.lineTo(h + M.width - 0.5, ae), e.stroke(), h += M.width;
  }
  e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, ae - 0.5), e.lineTo(n, ae - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ae, n, g), e.clip();
  const d = Math.max(0, Math.floor(s / c)), m = Math.min(v.length, Math.ceil((s + g) / c));
  for (let p = d; p < m; p++) {
    const M = v[p], _ = ae + p * c - s;
    p % 2 === 1 && (e.fillStyle = r.rowAlt, e.fillRect(0, _, n, c)), p === l.hoveredRow && p !== l.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, _, n, c)), p === l.selectedRow && (e.fillStyle = fl(r.accent, 0.1), e.fillRect(0, _, n, c)), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, _ + c - 0.5), e.lineTo(n, _ + c - 0.5), e.stroke();
    let k = -x;
    for (let C = 0; C < u.length; C++) {
      const w = u[C];
      if (k + w.width <= 0) {
        k += w.width;
        continue;
      }
      if (k >= n) break;
      const F = l.getCellStyle(w, M), Y = F.color ?? r.text, V = F.textAlign ?? "left", G = l.formatCell(w, M);
      e.save(), e.beginPath(), e.rect(k + 1, _, w.width - 2, c), e.clip(), e.font = `${Tt}px system-ui, -apple-system, sans-serif`, e.fillStyle = Y, e.textBaseline = "middle", y && (e.shadowBlur = 4, e.shadowColor = Y), V === "right" ? (e.textAlign = "right", e.fillText(G, k + w.width - 8, _ + c / 2)) : (e.textAlign = "left", e.fillText(G, k + 8, _ + c / 2)), e.shadowBlur = 0, e.restore(), p === l.selectedRow && C === l.selectedCol && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(k + 1.5, _ + 1.5, w.width - 3, c - 3)), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(k + w.width - 0.5, _), e.lineTo(k + w.width - 0.5, _ + c), e.stroke(), k += w.width;
    }
  }
  if (e.restore(), f.length > 0) {
    const p = a - S;
    e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, p - 0.5), e.lineTo(n, p - 0.5), e.stroke();
    for (let M = 0; M < f.length; M++) {
      const _ = f[M], k = p + M * c;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, k, n, c);
      let C = -x;
      for (let w = 0; w < u.length; w++) {
        const F = u[w];
        if (C + F.width <= 0) {
          C += F.width;
          continue;
        }
        if (C >= n) break;
        const Y = l.getCellStyle(F, _), V = Y.color ?? r.text, G = Y.textAlign ?? "left", U = l.formatCell(F, _);
        e.save(), e.beginPath(), e.rect(C + 1, k, F.width - 2, c), e.clip(), e.font = `bold ${Tt}px system-ui, -apple-system, sans-serif`, e.fillStyle = V, e.textBaseline = "middle", G === "right" ? (e.textAlign = "right", e.fillText(U, C + F.width - 8, k + c / 2)) : (e.textAlign = "left", e.fillText(U, C + 8, k + c / 2)), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(C + F.width - 0.5, k), e.lineTo(C + F.width - 0.5, k + c), e.stroke(), C += F.width;
      }
      e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, k + c - 0.5), e.lineTo(n, k + c - 0.5), e.stroke();
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
function Dt(t, l, e, n, a, r, u, v, f) {
  const c = t + f;
  let s = -1, x = 0;
  for (let h = 0; h < e.length; h++) {
    if (c >= x && c < x + e[h].width) {
      s = h;
      break;
    }
    x += e[h].width;
  }
  if (l < ae) return { area: "header", colIdx: s, rowIdx: -1 };
  const y = v * a;
  if (y > 0 && l >= u - y) {
    const h = Math.floor((l - (u - y)) / a);
    return { area: "pinned", colIdx: s, rowIdx: h };
  }
  const S = l - ae + r, g = Math.floor(S / a);
  return g >= 0 && g < n ? { area: "body", colIdx: s, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const vl = ["value"], ml = ["disabled"], hl = ["disabled"], gl = `
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
    const e = t, n = l, a = W(e.rowData ?? []), r = W(e.pinnedBottomRowData ?? []), u = W(""), v = W(null), f = rt({}), c = rt({}), s = rt(/* @__PURE__ */ new Set()), x = W(0), y = W(0), S = W(0), g = W(0), h = W(0), d = W(-1), m = W(null), p = W(null), M = W({ x: 0, y: ae }), _ = W("");
    function k(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const C = K(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((i) => !s.has(k(i))).map((i) => {
        const b = k(i), T = { ...o, ...i };
        return { colId: b, colDef: T, width: c[b] ?? T.width ?? 100 };
      });
    }), w = K(() => {
      const o = y.value;
      if (!o) return C.value;
      const i = C.value.reduce((I, L) => I + L.width, 0);
      if (!i || i >= o) return C.value;
      const b = o / i;
      let T = 0;
      return C.value.map((I, L) => {
        const X = L === C.value.length - 1 ? o - T : Math.max(8, Math.round(I.width * b));
        return T += X, { ...I, width: X };
      });
    }), F = K(() => {
      const o = w.value.reduce((i, b) => i + b.width, 0);
      return Math.max(0, o - y.value);
    }), Y = K(() => {
      const o = r.value.length * e.rowHeight;
      return Math.max(0, S.value - ae - o);
    }), V = K(
      () => Math.max(0, q.value.length * e.rowHeight - Y.value)
    ), G = K(
      () => Math.max(1, Math.floor(Y.value / e.rowHeight))
    ), U = K(
      () => q.value.length === 0 ? 0 : Math.min(q.value.length - 1, Math.floor(g.value / e.rowHeight))
    ), ge = K(
      () => Math.min(q.value.length - 1, U.value + G.value - 1)
    );
    function N(o, i) {
      if (i.colDef.valueGetter) return i.colDef.valueGetter({ data: o, colDef: i.colDef });
      if (i.colDef.field) return o[i.colDef.field];
    }
    function oe(o, i) {
      const b = N(i, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: b, data: i, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: b, data: i, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : b == null ? "" : String(b);
    }
    function we(o, i) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: N(i, o), data: i, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const q = K(() => {
      x.value;
      let o = a.value;
      const i = u.value.trim().toLowerCase();
      i && (o = o.filter(
        (b) => C.value.some(
          (T) => String(N(b, T) ?? "").toLowerCase().includes(i)
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
    $(q, () => {
      g.value = 0, m.value = null;
    }), $(F, () => {
      h.value = Math.min(h.value, F.value);
    }), $(V, () => {
      g.value = Math.min(g.value, V.value);
    });
    function ke(o) {
      const i = o * e.rowHeight, b = i + e.rowHeight;
      i < g.value ? g.value = i : b > g.value + Y.value && (g.value = Math.min(V.value, b - Y.value));
    }
    function Te() {
      g.value = Math.max(0, g.value - Y.value), fe();
    }
    function R() {
      g.value = Math.min(V.value, g.value + Y.value), fe();
    }
    let H = !1, j = "", ee = 0, D = 0, B = !1, P = !1, de = 0, ce = 0, be = 0, Ee = 0, E = !1;
    function A(o, i) {
      var b;
      H = !0, j = o, ee = i, D = ((b = w.value.find((T) => T.colId === o)) == null ? void 0 : b.width) ?? 100, B = !1;
    }
    function Q(o) {
      if (P) {
        const L = de - o.clientX, z = ce - o.clientY;
        (Math.abs(L) > 4 || Math.abs(z) > 4) && (E = !0), h.value = Math.max(0, Math.min(F.value, be + L)), g.value = Math.max(0, Math.min(V.value, Ee + z)), fe();
        return;
      }
      if (!H) return;
      const i = y.value, b = Math.max(30, D + (o.clientX - ee)), T = C.value.filter((L) => L.colId !== j).reduce((L, z) => L + z.width, 0), I = i - b;
      I > 10 && (c[j] = Math.max(10, Math.round(b * T / I))), fe();
    }
    function xe() {
      P && (E && (B = !0), P = !1), H && (H = !1, B = !0, n("column-resized"));
    }
    const ve = W(null), Z = W(null), Pt = lt("cathodeResetTick", W(0));
    $(Pt, () => He());
    let te = null, ze = !1, nt, pt, Ie, me, ue;
    function wt() {
      if (!(!Z.value || !ve.value)) {
        ue = document.createElement("canvas");
        try {
          te = new O.WebGLRenderer({ canvas: Z.value, antialias: !1, alpha: !0 });
        } catch {
          ze = !0;
        }
        if (!ze && !te.getContext() && (te.dispose(), te = null, ze = !0), ze) {
          Ae();
          return;
        }
        te.setPixelRatio(1), te.setClearColor(0, 0), nt = new O.Scene(), pt = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), me = new O.CanvasTexture(ue), me.minFilter = O.LinearFilter, me.magFilter = O.LinearFilter, Ie = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: me },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new O.Color(0) }
          },
          vertexShader: gl,
          fragmentShader: pl,
          transparent: !0
        }), nt.add(new O.Mesh(new O.PlaneGeometry(2, 2), Ie)), Ae();
      }
    }
    function Ae() {
      if (!ve.value || !te && !ze) return;
      const o = ve.value.clientWidth, i = ve.value.clientHeight - (e.pagination ? wl : 0);
      if (!o || !i) return;
      const b = ue.width !== o || ue.height !== i;
      ue.width = o, ue.height = i, y.value = o, S.value = i, h.value = Math.max(0, Math.min(F.value, h.value)), g.value = Math.max(0, Math.min(V.value, g.value)), te ? (b && me && (me.dispose(), me = new O.CanvasTexture(ue), me.minFilter = O.LinearFilter, me.magFilter = O.LinearFilter, Ie && (Ie.uniforms.uTex.value = me)), te.setPixelRatio(window.devicePixelRatio || 1), te.setSize(o, i)) : Z.value && (Z.value.width = o, Z.value.height = i, Z.value.style.width = o + "px", Z.value.style.height = i + "px"), fe();
    }
    function fe() {
      var b, T, I, L, z, X, le, ne;
      if (!(ue != null && ue.width)) return;
      if (ze) {
        if (!Z.value) return;
        It(ue, {
          cols: w.value,
          rows: q.value,
          pinnedRows: r.value,
          rowHeight: e.rowHeight,
          scrollY: g.value,
          scrollX: h.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((b = v.value) == null ? void 0 : b.colId) ?? null,
          sortDir: ((T = v.value) == null ? void 0 : T.dir) ?? null,
          colFilters: f,
          hoveredRow: d.value,
          selectedRow: ((I = m.value) == null ? void 0 : I.row) ?? -1,
          selectedCol: ((L = m.value) == null ? void 0 : L.col) ?? -1,
          formatCell: oe,
          getCellStyle: we
        });
        const Ct = Z.value.getContext("2d");
        Ct && Ct.drawImage(ue, 0, 0);
        return;
      }
      if (!te || !Ie || !me) return;
      const o = $e[e.theme] ?? $e.none, i = e.theme === "paper";
      Ie.uniforms.uStrength.value = e.curvature / 45 * 0.55, Ie.uniforms.uScanlines.value = e.scanlines && !i ? 1 : 0, Ie.uniforms.uVignette.value = i ? 0 : 1, Ie.uniforms.uBezel.value.set(o.bg), It(ue, {
        cols: w.value,
        rows: q.value,
        pinnedRows: r.value,
        rowHeight: e.rowHeight,
        scrollY: g.value,
        scrollX: h.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((z = v.value) == null ? void 0 : z.colId) ?? null,
        sortDir: ((X = v.value) == null ? void 0 : X.dir) ?? null,
        colFilters: f,
        hoveredRow: d.value,
        selectedRow: ((le = m.value) == null ? void 0 : le.row) ?? -1,
        selectedCol: ((ne = m.value) == null ? void 0 : ne.col) ?? -1,
        formatCell: oe,
        getCellStyle: we
      }), me.needsUpdate = !0, te.render(nt, pt);
    }
    function ot(o) {
      if (!Z.value) return [-1, -1];
      const i = Z.value.getBoundingClientRect();
      return [o.clientX - i.left, o.clientY - i.top];
    }
    let at = 0;
    function $t(o) {
      p.value = null;
      const i = Date.now();
      if (o.deltaX !== 0) {
        at = i, h.value = Math.max(0, Math.min(F.value, h.value + o.deltaX)), fe();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        at = i, h.value = Math.max(0, Math.min(F.value, h.value + o.deltaY)), fe();
        return;
      }
      i - at < bl || (g.value = Math.max(0, Math.min(V.value, g.value + o.deltaY)), fe());
    }
    function Ot(o) {
      if (H) return;
      const [i, b] = ot(o);
      if (i < 0) {
        d.value = -1, fe();
        return;
      }
      const T = Dt(
        i,
        b,
        w.value,
        q.value.length,
        e.rowHeight,
        g.value,
        ue.height,
        r.value.length,
        h.value
      );
      if (d.value = T.area === "body" ? T.rowIdx : -1, T.area === "header" && T.colIdx >= 0) {
        const I = w.value[T.colIdx], L = st(T.colIdx, w.value), z = i + h.value;
        Z.value.style.cursor = I && Lt(z, L, I.width) ? "col-resize" : "pointer";
      } else T.area === "body" ? Z.value.style.cursor = "pointer" : Z.value.style.cursor = "default";
      fe();
    }
    function Vt() {
      d.value = -1, fe();
    }
    function Xt(o) {
      const [i, b] = ot(o);
      if (i < 0) return;
      if (b >= ae) {
        P = !0, E = !1, de = o.clientX, ce = o.clientY, be = h.value, Ee = g.value;
        return;
      }
      const T = i + h.value;
      for (let I = 0; I < w.value.length; I++) {
        const L = w.value[I], z = st(I, w.value);
        if (L.colDef.resizable !== !1 && Lt(T, z, L.width)) {
          A(L.colId, o.clientX);
          return;
        }
      }
    }
    function Nt(o) {
      var I, L, z;
      if (B) {
        B = !1;
        return;
      }
      if (H) return;
      const [i, b] = ot(o);
      if (i < 0) {
        p.value = null;
        return;
      }
      const T = Dt(
        i,
        b,
        w.value,
        q.value.length,
        e.rowHeight,
        g.value,
        ue.height,
        r.value.length,
        h.value
      );
      if (T.area === "header" && T.colIdx >= 0) {
        const X = w.value[T.colIdx], le = st(T.colIdx, w.value), ne = i + h.value;
        X.colDef.filter && dl(ne, le, X.width) ? (o.stopPropagation(), p.value === X.colId ? p.value = null : (p.value = X.colId, _.value = (I = f[X.colId]) != null && I.startsWith("__eq__") ? f[X.colId].slice(6) : f[X.colId] ?? "", M.value = { x: Math.max(0, le - h.value), y: ae })) : X.colDef.sortable !== !1 && (p.value = null, v.value = ((L = v.value) == null ? void 0 : L.colId) === X.colId ? v.value.dir === "asc" ? { colId: X.colId, dir: "desc" } : null : { colId: X.colId, dir: "asc" }, n("sort-changed"));
        return;
      }
      if (p.value = null, T.area === "body" && T.rowIdx >= 0 && T.colIdx >= 0) {
        const X = T.rowIdx;
        m.value = { row: X, col: T.colIdx }, (z = Z.value) == null || z.focus();
        const le = q.value[X], ne = w.value[T.colIdx];
        le && ne && (n("row-clicked", { data: le, event: o }), n("cell-selected", { data: le, row: X, col: T.colIdx, colId: ne.colId }));
      }
    }
    function bt(o) {
      var i, b;
      p.value && ((b = (i = o.target).closest) != null && b.call(i, ".cathode-filter-popup") || (p.value = null));
    }
    function Gt(o) {
      var I;
      if (!y.value) return;
      let i = 0;
      for (let L = 0; L < o; L++) i += w.value[L].width;
      const b = ((I = w.value[o]) == null ? void 0 : I.width) ?? 0, T = i - h.value;
      T < 0 ? h.value = Math.max(0, i) : T + b > y.value && (h.value = Math.min(F.value, i + b - y.value));
    }
    function Ut(o) {
      var X;
      const i = w.value, b = i.length - 1, T = q.value.length - 1;
      if (!m.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), m.value = { row: U.value, col: 0 });
        return;
      }
      let { row: I, col: L } = m.value;
      const z = (le, ne) => {
        I = Math.max(0, Math.min(T, le)), L = Math.max(0, Math.min(b, ne)), m.value = { row: I, col: L }, ke(I), Gt(L);
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
          m.value = null;
          break;
        case "c":
        case "C":
          if (o.ctrlKey || o.metaKey) {
            o.preventDefault();
            const le = q.value[I], ne = i[L];
            le && ne && ((X = navigator.clipboard) == null || X.writeText(oe(ne, le)).catch(() => {
            }));
          }
          break;
      }
    }
    function Kt(o) {
      const i = o.target.value;
      _.value = i, i ? f[p.value] = i : delete f[p.value], n("filter-changed");
    }
    function xt() {
      p.value && delete f[p.value], _.value = "", p.value = null, n("filter-changed");
    }
    const qt = {
      setGridOption(o, i) {
        o === "rowData" ? a.value = i : o === "pinnedBottomRowData" ? r.value = i : o === "quickFilterText" && (u.value = i);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var b, T;
          const i = k(o);
          return {
            colId: i,
            hide: s.has(i),
            sort: ((b = v.value) == null ? void 0 : b.colId) === i ? v.value.dir : null,
            sortIndex: ((T = v.value) == null ? void 0 : T.colId) === i ? 0 : null,
            width: c[i] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const i of o)
          i.hide === !0 && s.add(i.colId), i.hide === !1 && s.delete(i.colId), i.sort && (v.value = { colId: i.colId, dir: i.sort }), i.width && (c[i.colId] = i.width);
      },
      setFilterModel(o) {
        for (const i of Object.keys(f)) delete f[i];
        if (o)
          for (const [i, b] of Object.entries(o))
            (b == null ? void 0 : b.type) === "equals" ? f[i] = `__eq__${b.filter}` : b != null && b.filter && (f[i] = b.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [i, b] of Object.entries(f))
          b && (o[i] = b.startsWith("__eq__") ? { type: "equals", filter: b.slice(6) } : { type: "contains", filter: b });
        return o;
      },
      async setColumnFilterModel(o, i) {
        i ? i.type === "equals" ? f[o] = `__eq__${i.filter}` : f[o] = i.filter ?? "" : delete f[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        x.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const i = C.value, b = i.map((z) => z.colDef.headerName ?? z.colId).join(","), T = q.value.map(
          (z) => i.map((X) => `"${String(oe(X, z)).replace(/"/g, '""')}"`).join(",")
        ), I = new Blob([[b, ...T].join(`
`)], { type: "text/csv" }), L = URL.createObjectURL(I);
        Object.assign(document.createElement("a"), { href: L, download: o }).click(), URL.revokeObjectURL(L);
      },
      resize() {
        Ae();
      },
      resetColumnState() {
        s.clear();
        for (const i of e.columnDefs)
          i.hide && s.add(k(i));
        const o = e.columnDefs.find((i) => i.sort);
        v.value = o ? { colId: k(o), dir: o.sort } : null;
        for (const i of Object.keys(c)) delete c[i];
        for (const i of Object.keys(f)) delete f[i];
        u.value = "", g.value = 0, m.value = null, p.value = null;
      }
    };
    $(
      [q, () => r.value, w, g, d, m],
      () => Le(fe)
    ), $(() => e.theme, () => fe()), $(() => e.curvature, () => Le(Ae)), $(() => e.scanlines, () => fe()), $(() => e.glow, () => fe()), $(m, (o) => {
      if (!o) return;
      const i = q.value[o.row], b = w.value[o.col];
      i && b && n("cell-selected", { data: i, row: o.row, col: o.col, colId: b.colId });
    });
    let Xe = null, Ne = null, it = 0;
    function He() {
      cancelAnimationFrame(it), it = requestAnimationFrame(Ae);
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
      a.value = e.rowData ?? [], r.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", bt), document.addEventListener("mousemove", Q), document.addEventListener("mouseup", xe), Le(() => {
        var o;
        wt(), Z.value && (Z.value.addEventListener("webglcontextlost", yt), Z.value.addEventListener("webglcontextrestored", Mt)), ve.value && (Xe = new ResizeObserver(() => Ae()), Xe.observe(ve.value), Ne = new IntersectionObserver((i) => {
          i.some((b) => b.isIntersecting) && He();
        }), Ne.observe(ve.value)), window.addEventListener("resize", He), (o = window.visualViewport) == null || o.addEventListener("resize", He), n("grid-ready", { api: qt });
      });
    }), Ke(() => {
      var o, i, b;
      document.removeEventListener("click", bt, !0), document.removeEventListener("mousemove", Q), document.removeEventListener("mouseup", xe), (o = Z.value) == null || o.removeEventListener("webglcontextlost", yt), (i = Z.value) == null || i.removeEventListener("webglcontextrestored", Mt), Xe == null || Xe.disconnect(), Ne == null || Ne.disconnect(), window.removeEventListener("resize", He), (b = window.visualViewport) == null || b.removeEventListener("resize", He), cancelAnimationFrame(it), te == null || te.dispose();
    });
    const he = K(() => $e[e.theme] ?? $e.none), jt = K(() => ({
      position: "absolute",
      left: `${M.value.x}px`,
      top: `${M.value.y}px`,
      zIndex: 100,
      background: he.value.headerBg,
      border: `1px solid ${he.value.accent}`,
      color: he.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Zt = K(() => ({
      background: he.value.bg,
      border: `1px solid ${he.value.border}`,
      color: he.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Jt = K(() => ({
      background: he.value.headerBg,
      borderTop: `1px solid ${he.value.border}`,
      color: he.value.text
    })), Qt = K(() => ({
      background: he.value.bg
    })), St = K(() => he.value.accent);
    return (o, i) => {
      var b, T;
      return re(), se("div", {
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
          onWheel: Re($t, ["prevent"]),
          onMousemove: Ot,
          onMouseleave: Vt,
          onMousedown: Xt,
          onClick: Nt,
          onKeydown: Ut
        }, null, 544),
        p.value ? (re(), se("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: ye(jt.value),
          onClick: i[0] || (i[0] = Re(() => {
          }, ["stop"]))
        }, [
          J("input", {
            style: ye(Zt.value),
            value: _.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Kt,
            onKeydown: el(xt, ["escape"])
          }, null, 44, vl),
          _.value ? (re(), se("button", {
            key: 0,
            style: ye({
              background: "none",
              border: "none",
              color: he.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: xt
          }, "✕", 4)) : Se("", !0)
        ], 4)) : Se("", !0),
        t.pagination ? (re(), se("div", {
          key: 1,
          class: "cathode-pagination",
          style: ye(Jt.value)
        }, [
          J("button", {
            disabled: g.value <= 0,
            onClick: i[1] || (i[1] = (I) => Te())
          }, "◀", 8, ml),
          J("span", null, Me((U.value + 1).toLocaleString()) + "–" + Me(Math.min(q.value.length, ge.value + 1).toLocaleString()) + " / " + Me(q.value.length.toLocaleString()), 1),
          J("button", {
            disabled: g.value >= V.value,
            onClick: i[2] || (i[2] = (I) => R())
          }, "▶", 8, hl),
          J("span", {
            class: "cathode-page-info",
            style: ye({ color: St.value })
          }, Me(q.value.length.toLocaleString()) + " rows ", 5),
          m.value ? (re(), se("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: ye({ color: St.value })
          }, Me(((b = w.value[m.value.col]) == null ? void 0 : b.colDef.headerName) ?? ((T = w.value[m.value.col]) == null ? void 0 : T.colId)) + " : " + Me(oe(w.value[m.value.col], q.value[m.value.row])), 5)) : Se("", !0)
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
    const r = a.split(/(\s+)/);
    let u = "";
    for (const v of r) {
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
function Wt(t) {
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
  const { entries: l, ctx: e, textMaxWidth: n, showTimestamps: a, wordWrap: r } = t, u = t.formatTs ?? Wt;
  e.font = vt;
  const v = [];
  for (let f = 0; f < l.length; f++) {
    const c = l[f], s = c.level ?? "info", x = a && c.ts != null ? u(c.ts) : "", y = r ? Sl(e, c.text, n) : c.text.split(`
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
function Et(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, r = Je[l.theme] ?? Je.none;
  e.clearRect(0, 0, n, a), e.fillStyle = r.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip(), e.font = vt, e.textBaseline = "middle";
  const u = l.visualLines, v = Ze, f = l.showTimestamps ? Ze + l.timestampWidth : Ze, c = Math.max(0, Math.floor((l.scrollY - Oe) / pe)), s = Math.min(u.length, Math.ceil((l.scrollY + a - Oe) / pe) + 1);
  for (let x = c; x < s; x++) {
    const y = u[x], S = Oe + x * pe - l.scrollY + pe / 2;
    if (y.entryIdx % 2 === 1 && y.isFirstFrag) {
      e.fillStyle = r.rowAlt;
      let h = 1;
      for (; x + h < s && u[x + h].entryIdx === y.entryIdx; ) h++;
      e.fillRect(0, S - pe / 2, n, pe * h);
    }
    x === l.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, S - pe / 2, n, pe)), l.showTimestamps && y.timestamp && (e.fillStyle = r.timestamp, e.textAlign = "left", l.glow && (e.shadowBlur = 3, e.shadowColor = r.timestamp), e.fillText(y.timestamp, v, S), e.shadowBlur = 0);
    const g = yl(r, y.level);
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
`, Dl = `
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
`, El = /* @__PURE__ */ Ue({
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
    const e = t, n = W(null), a = W(null), r = W(0), u = W(0), v = W(0), f = W(-1), c = W(!0), s = K(() => {
      const E = e.entries ?? [];
      return e.maxLines > 0 && E.length > e.maxLines ? E.slice(E.length - e.maxLines) : E;
    }), x = K(() => {
      if (!e.showTimestamps) return "";
      const E = e.formatTs ?? Wt;
      let A = "00:00:00";
      for (const Q of s.value) {
        if (Q.ts == null) continue;
        const xe = E(Q.ts);
        xe.length > A.length && (A = xe);
      }
      return A;
    }), y = W(0), S = W([]);
    function g() {
      if (!w) return;
      const E = w.getContext("2d");
      if (!E) return;
      E.font = vt;
      const A = e.showTimestamps ? Cl(E, x.value) : 0;
      y.value = A;
      const Q = Math.max(
        1,
        r.value - Ze * 2 - A
      );
      S.value = kl({
        entries: s.value,
        ctx: E,
        textMaxWidth: Q,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const h = K(() => Il(S.value.length)), d = K(() => Math.max(0, h.value - u.value));
    $(d, () => {
      c.value ? v.value = d.value : v.value = Math.min(v.value, d.value);
    }), $(
      [s, r, () => e.showTimestamps, () => e.wordWrap, x],
      () => {
        g(), Le(V);
      },
      { deep: !1 }
    );
    let m = null, p = !1, M, _, k, C, w;
    function F() {
      if (!(!a.value || !n.value)) {
        w = document.createElement("canvas");
        try {
          m = new O.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          p = !0;
        }
        if (!p && !m.getContext() && (m.dispose(), m = null, p = !0), p) {
          Y();
          return;
        }
        m.setPixelRatio(1), m.setClearColor(0, 0), M = new O.Scene(), _ = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), C = new O.CanvasTexture(w), C.minFilter = O.LinearFilter, C.magFilter = O.LinearFilter, k = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: C },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Ll,
          fragmentShader: Dl,
          transparent: !0
        }), M.add(new O.Mesh(new O.PlaneGeometry(2, 2), k)), Y();
      }
    }
    function Y() {
      if (!n.value || !m && !p) return;
      const E = n.value.clientWidth, A = n.value.clientHeight;
      if (!E || !A) return;
      const Q = w.width !== E || w.height !== A;
      Q && (w.width = E, w.height = A, r.value = E, u.value = A, g(), m ? (Q && C && (C.dispose(), C = new O.CanvasTexture(w), C.minFilter = O.LinearFilter, C.magFilter = O.LinearFilter, k && (k.uniforms.uTex.value = C)), m.setPixelRatio(window.devicePixelRatio || 1), m.setSize(E, A)) : a.value && (a.value.width = E, a.value.height = A, a.value.style.width = E + "px", a.value.style.height = A + "px"), c.value && (v.value = Math.max(0, h.value - u.value)), V());
    }
    function V() {
      if (!(w != null && w.width)) return;
      if (p) {
        if (!a.value) return;
        Et(w, {
          visualLines: S.value,
          scrollY: v.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: y.value,
          hoveredLine: f.value
        });
        const A = a.value.getContext("2d");
        A && A.drawImage(w, 0, 0);
        return;
      }
      if (!m || !k || !C) return;
      const E = e.theme === "paper";
      k.uniforms.uStrength.value = e.curvature / 45 * 0.55, k.uniforms.uScanlines.value = e.scanlines && !E ? 1 : 0, k.uniforms.uVignette.value = E ? 0 : 1, Et(w, {
        visualLines: S.value,
        scrollY: v.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: y.value,
        hoveredLine: f.value
      }), C.needsUpdate = !0, m.render(M, _);
    }
    $(() => e.theme, () => V()), $(() => e.curvature, () => V()), $(() => e.scanlines, () => V()), $(() => e.glow, () => V()), $(v, () => V()), $(f, () => V());
    function G(E) {
      if (!a.value) return [-1, -1];
      const A = a.value.getBoundingClientRect();
      return [E.clientX - A.left, E.clientY - A.top];
    }
    function U(E) {
      v.value = Math.max(0, Math.min(d.value, E)), c.value = v.value >= d.value - 4;
    }
    function ge(E) {
      U(v.value + E.deltaY);
    }
    let N = !1, oe = 0, we = 0;
    function q(E) {
      N = !0, oe = E.clientY, we = v.value;
    }
    function ke(E) {
      if (N) {
        const A = oe - E.clientY;
        U(we + A);
      }
    }
    function Te() {
      N && (N = !1);
    }
    function R(E) {
      const [, A] = G(E);
      if (A < 0) {
        f.value = -1;
        return;
      }
      f.value = Tl(A, v.value, S.value.length);
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
      scrollToLine(E) {
        U(Oe + E * pe);
      }
    });
    let j = null, ee = null, D = 0;
    const B = lt("cathodeResetTick", W(0));
    $(B, () => P());
    function P() {
      cancelAnimationFrame(D), D = requestAnimationFrame(Y);
    }
    function de(E) {
      E.preventDefault();
    }
    function ce() {
      m == null || m.dispose(), m = null, p = !1, F();
    }
    Ve(() => {
      document.addEventListener("mousemove", ke), document.addEventListener("mouseup", Te), Le(() => {
        var E;
        F(), a.value && (a.value.addEventListener("webglcontextlost", de), a.value.addEventListener("webglcontextrestored", ce)), n.value && (j = new ResizeObserver(() => Y()), j.observe(n.value), ee = new IntersectionObserver((A) => {
          A.some((Q) => Q.isIntersecting) && P();
        }), ee.observe(n.value)), window.addEventListener("resize", P), (E = window.visualViewport) == null || E.addEventListener("resize", P), v.value = d.value;
      });
    }), Ke(() => {
      var E, A, Q;
      document.removeEventListener("mousemove", ke), document.removeEventListener("mouseup", Te), (E = a.value) == null || E.removeEventListener("webglcontextlost", de), (A = a.value) == null || A.removeEventListener("webglcontextrestored", ce), j == null || j.disconnect(), ee == null || ee.disconnect(), window.removeEventListener("resize", P), (Q = window.visualViewport) == null || Q.removeEventListener("resize", P), cancelAnimationFrame(D), m == null || m.dispose();
    });
    const be = K(() => Je[e.theme] ?? Je.none), Ee = K(() => ({
      background: be.value.bg
    }));
    return (E, A) => (re(), se("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: ye(Ee.value)
    }, [
      J("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: Re(ge, ["prevent"]),
        onMousemove: R,
        onMouseleave: H,
        onMousedown: q
      }, null, 544)
    ], 4));
  }
}), Sn = /* @__PURE__ */ qe(El, [["__scopeId", "data-v-d2d092f3"]]), Qe = {
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
}, Rl = 0.18, Ge = 8, mt = 22, De = 8, Fe = 56, _e = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ct = 4, Fl = 1, _l = 1;
function Bl(t, l, e, n = 0) {
  const a = Math.max(0, l - De - Fe), r = Math.max(1, Math.floor(a / e)), u = Math.min(r, t);
  return { firstIdx: Math.max(0, t - u - Math.floor(n / e)), count: u, slotW: e };
}
function zl(t, l, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, a = -1 / 0, r = 0;
  const u = Math.min(t.length, l + e);
  for (let f = l; f < u; f++) {
    const c = t[f];
    c && (c.low < n && (n = c.low), c.high > a && (a = c.high), c.volume > r && (r = c.volume));
  }
  if (!isFinite(n) || !isFinite(a) || n === a) {
    const f = isFinite(n) ? n : 0;
    return { min: f - 1, max: f + 1, maxVol: Math.max(1, r) };
  }
  const v = (a - n) * 0.04;
  return { min: n - v, max: a + v, maxVol: Math.max(1, r) };
}
function Wl(t, l) {
  const e = Math.max(1, t - Ge - mt - ct), n = Math.max(0, Math.round(e * l)), a = e - n;
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
function Be(t, l, e) {
  return De + (t - l + 0.5) * e;
}
function We(t) {
  const l = Math.abs(t), e = l >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : l >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : l >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : l >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function ht(t) {
  const l = new Date(t), e = String(l.getMonth() + 1).padStart(2, "0"), n = String(l.getDate()).padStart(2, "0"), a = String(l.getHours()).padStart(2, "0"), r = String(l.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${a}:${r}`;
}
function Yl(t, l) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, l), n = Math.pow(10, Math.floor(Math.log10(e))), a = e / n;
  let r;
  return a < 1.5 ? r = 1 : a < 3 ? r = 2 : a < 7 ? r = 5 : r = 10, r * n;
}
function Rt(t, l) {
  var x, y, S, g, h;
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, r = Qe[l.theme] ?? Qe.none;
  if (e.clearRect(0, 0, n, a), e.fillStyle = r.bg, e.fillRect(0, 0, n, a), !l.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const u = Bl(l.candles.length, n, l.slotW, l.scrollX), v = zl(l.candles, u.firstIdx, u.count), f = Wl(a, l.showVolume ? l.volumeFraction : 0), c = Math.max(Fl, Math.floor(l.slotW * 0.7)), s = Math.min(l.candles.length, u.firstIdx + u.count);
  for (let d = u.firstIdx; d < s; d++) {
    const m = l.candles[d];
    if (!m) continue;
    const p = Be(d, u.firstIdx, l.slotW), M = Ce(m.open, v, f.priceY0, f.priceY1), _ = Ce(m.close, v, f.priceY0, f.priceY1), k = Ce(m.high, v, f.priceY0, f.priceY1), C = Ce(m.low, v, f.priceY0, f.priceY1), w = m.close >= m.open, F = w ? r.wickBull : r.wickBear, Y = w ? r.candleBull : r.candleBear;
    l.glow && (e.shadowBlur = 4, e.shadowColor = Y), e.strokeStyle = F, e.lineWidth = _l, e.beginPath(), e.moveTo(Math.round(p) + 0.5, k), e.lineTo(Math.round(p) + 0.5, C), e.stroke(), e.fillStyle = Y;
    const V = Math.min(M, _), G = Math.max(1, Math.abs(_ - M));
    if (e.fillRect(
      Math.round(p - c / 2),
      Math.round(V),
      c,
      Math.round(G)
    ), e.shadowBlur = 0, l.showVolume && v.maxVol > 0) {
      const U = Math.round(m.volume / v.maxVol * (f.volumeY1 - f.volumeY0));
      U > 0 && (e.fillStyle = w ? r.volumeBull : r.volumeBear, e.fillRect(
        Math.round(p - c / 2),
        f.volumeY1 - U,
        c,
        U
      ));
    }
  }
  if ((x = l.overlays) != null && x.length)
    for (const d of l.overlays) Al(e, d, u, v, f, l.slotW);
  (y = l.markers) != null && y.length && Gl(e, r, l.markers, l.candles, u, v, f, l.slotW), Ul(e, r, v, f, n), Kl(e, r, l.candles, u, l.slotW, a), Xl(e, r, l.candles, n, a), (S = l.overlays) != null && S.length && Pl(e, r, l.overlays, f), l.hover && (ql(e, r, l.candles, u, v, f, l.slotW, l.hover, n), $l(e, r, l.candles, u, l.slotW, l.hover, f, ((g = l.overlays) == null ? void 0 : g.length) ?? 0), (h = l.markers) != null && h.length && Vl(e, r, l.markers, l.candles, u, v, f, l.slotW, l.hover, n)), e.restore();
}
function Al(t, l, e, n, a, r) {
  var v;
  const u = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    De,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), l.kind === "line")
    je(t, l.data, e.firstIdx, u, r, n, a, l.color, l.lineWidth ?? 1, l.dashed === !0);
  else {
    const f = Yt(l.color, l.fillAlpha ?? 0.08);
    Hl(t, l.upper, l.lower, e.firstIdx, u, r, n, a, f), je(t, l.upper, e.firstIdx, u, r, n, a, l.color, 1, !1), je(t, l.lower, e.firstIdx, u, r, n, a, l.color, 1, !1), (v = l.middle) != null && v.length && je(t, l.middle, e.firstIdx, u, r, n, a, l.color, 1, l.middleDashed !== !1);
  }
  t.restore();
}
function je(t, l, e, n, a, r, u, v, f, c) {
  if (!l || !l.length) return;
  t.strokeStyle = v, t.lineWidth = f, t.setLineDash(c ? [4, 3] : []), t.beginPath();
  let s = !1;
  for (let x = e; x < n; x++) {
    const y = l[x];
    if (typeof y != "number" || !isFinite(y)) {
      s && (t.stroke(), t.beginPath(), s = !1);
      continue;
    }
    const S = Be(x, e, a), g = Ce(y, r, u.priceY0, u.priceY1);
    s ? t.lineTo(S, g) : (t.moveTo(S, g), s = !0);
  }
  s && t.stroke(), t.setLineDash([]);
}
function Hl(t, l, e, n, a, r, u, v, f) {
  if (!(l != null && l.length) || !(e != null && e.length)) return;
  t.fillStyle = f;
  let c = !1, s = -1;
  for (let x = n; x <= a; x++) {
    const y = l[x], S = e[x], g = x < a && typeof y == "number" && typeof S == "number" && isFinite(y) && isFinite(S);
    if (g && !c && (s = x, c = !0), !g && c || x === a && c) {
      const h = g ? x + 1 : x;
      t.beginPath();
      for (let d = s; d < h; d++) {
        const m = Be(d, n, r), p = Ce(l[d], u, v.priceY0, v.priceY1);
        d === s ? t.moveTo(m, p) : t.lineTo(m, p);
      }
      for (let d = h - 1; d >= s; d--) {
        const m = Be(d, n, r), p = Ce(e[d], u, v.priceY0, v.priceY1);
        t.lineTo(m, p);
      }
      t.closePath(), t.fill(), c = !1;
    }
  }
}
function Yt(t, l) {
  const e = Math.max(0, Math.min(1, l));
  if (t.startsWith("#") && t.length === 7) {
    const n = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), r = parseInt(t.slice(5, 7), 16);
    return `rgba(${n},${a},${r},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Pl(t, l, e, n) {
  const a = e.filter((h) => !!h.label);
  if (!a.length) return;
  t.save(), t.font = _e;
  const r = 8, u = 5, v = 12, f = 6, c = 14;
  let s = 0;
  for (const h of a) {
    const d = t.measureText(h.label).width;
    d > s && (s = d);
  }
  const x = r * 2 + v + f + s, y = u * 2 + c * a.length, S = De + 4, g = n.priceY0 + 4;
  t.fillStyle = l.panelBg, t.fillRect(S, g, x, y), t.textBaseline = "middle", t.textAlign = "left";
  for (let h = 0; h < a.length; h++) {
    const d = a[h], m = g + u + c * (h + 0.5), p = S + r;
    d.kind === "line" ? (t.strokeStyle = d.color, t.lineWidth = d.lineWidth ?? 1, t.setLineDash(d.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(p, m), t.lineTo(p + v, m), t.stroke(), t.setLineDash([])) : (t.fillStyle = Yt(d.color, d.fillAlpha ?? 0.2), t.fillRect(p, m - 4, v, 8), t.strokeStyle = d.color, t.lineWidth = 1, t.strokeRect(p + 0.5, m - 4 + 0.5, v - 1, 7)), t.fillStyle = l.text, t.fillText(d.label, p + v + f, m);
  }
  t.restore();
}
function $l(t, l, e, n, a, r, u, v) {
  const f = Math.floor((r.x - De) / a), c = n.firstIdx + f;
  if (c < 0 || c >= e.length) return;
  const s = e[c];
  if (!s) return;
  const x = s.close - s.open, y = s.open !== 0 ? x / s.open * 100 : 0, S = x >= 0 ? "+" : "", g = [
    ["O", We(s.open), void 0],
    ["H", We(s.high), void 0],
    ["L", We(s.low), void 0],
    ["C", We(s.close), void 0],
    ["V", Ol(s.volume), void 0],
    ["", `${S}${y.toFixed(2)}%`, x >= 0 ? l.candleBull : l.candleBear]
  ];
  t.save(), t.font = _e, t.textBaseline = "middle", t.textAlign = "left";
  const h = 8, d = 4, m = 14;
  let p = h;
  for (const [C, w] of g) {
    const F = C ? `${C} ${w}` : w, Y = t.measureText(F).width + 12;
    p += Y;
  }
  p += h - 12;
  const M = u.priceY0 + 4 + (v > 0 ? d * 2 + 14 * v + 4 : 0), _ = De + 4;
  t.fillStyle = l.panelBg, t.fillRect(_, M, p, m + d * 2);
  let k = _ + h;
  for (let C = 0; C < g.length; C++) {
    const [w, F, Y] = g[C];
    t.fillStyle = l.text, w && (t.globalAlpha = 0.6, t.fillText(w + " ", k, M + d + m / 2), t.globalAlpha = 1, k += t.measureText(w + " ").width), Y && (t.fillStyle = Y), t.fillText(F, k, M + d + m / 2), k += t.measureText(F).width + 12;
  }
  t.restore();
}
function Ol(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function Vl(t, l, e, n, a, r, u, v, f, c) {
  if (!n.length) return;
  const s = n.length > 1 ? n[1].start - n[0].start : 6e4, x = Math.max(1, s * 0.5), y = Math.min(n.length, a.firstIdx + a.count), S = 9;
  let g = null;
  for (const F of e) {
    let Y = 0, V = n.length - 1, G = -1;
    for (; Y <= V; ) {
      const N = Y + V >> 1, oe = n[N].start - F.timestamp;
      if (Math.abs(oe) <= x) {
        G = N;
        break;
      }
      oe < 0 ? Y = N + 1 : V = N - 1;
    }
    if (G < 0 || G < a.firstIdx || G >= y) continue;
    const U = Be(G, a.firstIdx, v), ge = Ce(F.price, r, u.priceY0, u.priceY1);
    if (Math.abs(f.x - U) <= S && Math.abs(f.y - ge) <= S) {
      g = { m: F, x: U, y: ge };
      break;
    }
  }
  if (!g) return;
  const h = ht(g.m.timestamp), d = [
    `${g.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${h}`,
    `@ ${We(g.m.price)}`
  ];
  g.m.label && d.push(g.m.label), t.save(), t.font = _e, t.textBaseline = "top", t.textAlign = "left";
  const m = 6, p = 14;
  let M = 0;
  for (const F of d) {
    const Y = t.measureText(F).width;
    Y > M && (M = Y);
  }
  const _ = M + m * 2, k = d.length * p + m * 2;
  let C = g.x + 12;
  C + _ > c - Fe && (C = g.x - 12 - _);
  let w = g.y - k / 2;
  w < u.priceY0 && (w = u.priceY0), w + k > u.priceY1 && (w = u.priceY1 - k), t.fillStyle = l.panelBgSolid, t.strokeStyle = g.m.kind === "entry" ? l.markerEntry : l.markerExit, t.lineWidth = 1, t.fillRect(C, w, _, k), t.strokeRect(C + 0.5, w + 0.5, _ - 1, k - 1);
  for (let F = 0; F < d.length; F++) {
    const Y = d[F];
    t.fillStyle = F === 0 ? g.m.kind === "entry" ? l.markerEntry : l.markerExit : l.text, t.fillText(Y, C + m, w + m + F * p);
  }
  t.restore();
}
function Xl(t, l, e, n, a) {
  if (e.length < 2) return;
  const r = e[1].start - e[0].start, u = Nl(r);
  if (!u) return;
  t.save(), t.font = _e, t.textBaseline = "top", t.textAlign = "right";
  const v = 6, f = 3, c = t.measureText(u).width, s = n - Fe - v, x = a - mt + 4;
  t.fillStyle = l.accent, t.fillRect(s - c - v, x - f, c + v * 2, 14 + f * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(u, s, x), t.restore();
}
function Nl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const l = 1e3, e = 60 * l, n = 60 * e, a = 24 * n, r = 7 * a;
  return t >= r && t % r === 0 ? t / r + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= n && t % n === 0 ? t / n + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= l && t % l === 0 ? t / l + "s" : Math.round(t / e) + "m";
}
function Gl(t, l, e, n, a, r, u, v) {
  if (!n.length) return;
  const f = n.length > 1 ? n[1].start - n[0].start : 6e4, c = Math.max(1, f * 0.5), s = Math.min(n.length, a.firstIdx + a.count), x = (S) => {
    let g = 0, h = n.length - 1;
    for (; g <= h; ) {
      const d = g + h >> 1, m = n[d].start - S;
      if (Math.abs(m) <= c) return d;
      m < 0 ? g = d + 1 : h = d - 1;
    }
    return -1;
  }, y = 7;
  for (const S of e) {
    const g = x(S.timestamp);
    if (g < 0 || g < a.firstIdx || g >= s) continue;
    const h = Be(g, a.firstIdx, v), d = Ce(S.price, r, u.priceY0, u.priceY1);
    if (d < u.priceY0 || d > u.priceY1) continue;
    const m = S.color ?? (S.kind === "entry" ? l.markerEntry : l.markerExit);
    t.fillStyle = m, t.strokeStyle = l.panelBgSolid, t.lineWidth = 1, t.beginPath(), S.kind === "entry" ? (t.moveTo(h, d - y), t.lineTo(h - y, d + y - 1), t.lineTo(h + y, d + y - 1)) : (t.moveTo(h, d + y), t.lineTo(h - y, d - y + 1), t.lineTo(h + y, d - y + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function Ul(t, l, e, n, a) {
  const r = e.max - e.min;
  if (r <= 0) return;
  const u = Yl(r, 6), v = Math.ceil(e.min / u) * u;
  t.font = _e, t.fillStyle = l.text, t.strokeStyle = l.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let f = v; f <= e.max; f += u) {
    const c = Ce(f, e, n.priceY0, n.priceY1);
    c < n.priceY0 || c > n.priceY1 || (t.beginPath(), t.moveTo(De, Math.round(c) + 0.5), t.lineTo(a - Fe, Math.round(c) + 0.5), t.stroke(), t.fillText(We(f), a - Fe + 4, c));
  }
  t.globalAlpha = 1;
}
function Kl(t, l, e, n, a, r) {
  if (n.count <= 0 || !e.length) return;
  const v = Math.max(1, Math.floor(n.count / 6));
  t.font = _e, t.fillStyle = l.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const f = Math.min(e.length, n.firstIdx + n.count);
  for (let c = n.firstIdx; c < f; c += v) {
    const s = e[c];
    if (!s) continue;
    const x = Be(c, n.firstIdx, a);
    t.fillText(ht(s.start), x, r - mt + 4);
  }
  t.globalAlpha = 1;
}
function ql(t, l, e, n, a, r, u, v, f) {
  const c = Math.floor((v.x - De) / u), s = Math.max(0, Math.min(e.length - 1, n.firstIdx + c)), x = e[s];
  if (!x) return;
  const y = Be(s, n.firstIdx, u);
  t.save(), t.strokeStyle = l.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(y) + 0.5, r.priceY0), t.lineTo(Math.round(y) + 0.5, r.volumeY1 || r.priceY1), t.stroke();
  const S = Math.max(r.priceY0, Math.min(r.priceY1, v.y));
  t.beginPath(), t.moveTo(De, Math.round(S) + 0.5), t.lineTo(f - Fe, Math.round(S) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const g = a.max - a.min;
  if (g > 0) {
    const m = a.max - (S - r.priceY0) / (r.priceY1 - r.priceY0) * g, p = We(m);
    t.font = _e, t.textBaseline = "middle", t.textAlign = "left";
    const M = t.measureText(p).width, _ = 4, k = 2;
    t.fillStyle = l.accent, t.fillRect(f - Fe + 2, S - 7 - k, M + _ * 2, 14 + k * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(p, f - Fe + 2 + _, S);
  }
  t.font = _e, t.textBaseline = "top", t.textAlign = "center";
  const h = ht(x.start), d = t.measureText(h).width;
  t.fillStyle = l.accent, t.fillRect(y - d / 2 - 4, r.volumeY1 + 2, d + 8, 14), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(h, y, r.volumeY1 + 4), t.restore();
}
const Ft = 0.25, _t = 6, jl = `
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
    volumeFraction: { default: Rl },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 }
  },
  setup(t) {
    const l = t, e = W(null), n = W(null), a = W(0), r = W(0), u = W(0), v = W(1), f = W(null), c = K(() => Math.max(1, l.slotW * v.value));
    let s = null, x = !1, y, S, g, h, d;
    function m() {
      if (!(!n.value || !e.value)) {
        if (d = document.createElement("canvas"), l.flat) {
          x = !0, p();
          return;
        }
        try {
          s = new O.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0 });
        } catch {
          x = !0;
        }
        if (!x && !s.getContext() && (s.dispose(), s = null, x = !0), x) {
          p();
          return;
        }
        s.setPixelRatio(1), s.setClearColor(0, 0), y = new O.Scene(), S = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new O.CanvasTexture(d), h.minFilter = O.LinearFilter, h.magFilter = O.LinearFilter, g = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: jl,
          fragmentShader: Zl,
          transparent: !0
        }), y.add(new O.Mesh(new O.PlaneGeometry(2, 2), g)), p();
      }
    }
    function p() {
      if (!e.value || !s && !x) return;
      const D = e.value.clientWidth, B = e.value.clientHeight;
      !D || !B || !(d.width !== D || d.height !== B) || (d.width = D, d.height = B, a.value = D, r.value = B, s ? (h && (h.dispose(), h = new O.CanvasTexture(d), h.minFilter = O.LinearFilter, h.magFilter = O.LinearFilter, g && (g.uniforms.uTex.value = h)), s.setPixelRatio(window.devicePixelRatio || 1), s.setSize(D, B)) : n.value && (n.value.width = D, n.value.height = B, n.value.style.width = D + "px", n.value.style.height = B + "px"), M());
    }
    function M() {
      if (!(d != null && d.width)) return;
      if (x) {
        if (!n.value) return;
        Rt(d, {
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
        const B = n.value.getContext("2d");
        B && B.drawImage(d, 0, 0);
        return;
      }
      if (!s || !g || !h) return;
      const D = l.theme === "paper";
      g.uniforms.uStrength.value = l.curvature / 45 * 0.55, g.uniforms.uScanlines.value = l.scanlines && !D ? 1 : 0, g.uniforms.uVignette.value = D ? 0 : 1, Rt(d, {
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
      }), h.needsUpdate = !0, s.render(y, S);
    }
    $(() => l.theme, () => M()), $(() => l.curvature, () => M()), $(() => l.scanlines, () => M()), $(() => l.glow, () => M()), $(() => l.showVolume, () => M()), $(() => l.volumeFraction, () => M()), $(() => l.slotW, () => M()), $(() => l.candles, () => M(), { deep: !1 }), $(() => l.overlays, () => M(), { deep: !1 }), $(() => l.markers, () => M(), { deep: !1 }), $(() => l.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), $(u, () => M()), $(v, () => M()), $(f, () => M()), $(c, () => M());
    let _ = null, k = null, C = 0;
    const w = lt("cathodeResetTick", W(0));
    $(w, () => F());
    function F() {
      cancelAnimationFrame(C), C = requestAnimationFrame(p);
    }
    function Y(D) {
      D.preventDefault();
    }
    function V() {
      s == null || s.dispose(), s = null, x = !1, m();
    }
    function G(D) {
      if (!n.value) return [-1, -1];
      const B = n.value.getBoundingClientRect();
      return [D.clientX - B.left, D.clientY - B.top];
    }
    function U(D) {
      var be;
      const B = c.value;
      if (B <= 0) return 0;
      const P = ((be = l.candles) == null ? void 0 : be.length) ?? 0, de = Math.max(1, Math.floor((a.value || 1) / B)), ce = Math.max(0, P - de);
      return Math.max(0, Math.min(D, ce * B));
    }
    function ge(D) {
      var de;
      if (D.deltaX !== 0 || D.shiftKey && D.deltaY !== 0) {
        const ce = D.deltaX !== 0 ? D.deltaX : D.deltaY;
        u.value = U(u.value + ce);
        return;
      }
      if (D.deltaY === 0) return;
      const [B] = G(D), P = c.value;
      if (B >= 0 && P > 0 && ((de = l.candles) != null && de.length)) {
        const ce = Math.max(1, Math.floor((a.value || 1) / P)), Ee = Math.max(0, l.candles.length - ce - Math.floor(u.value / P)) + (B - 8) / P, E = Math.exp(-D.deltaY * 15e-4), A = Math.max(Ft, Math.min(_t, v.value * E));
        v.value = A;
        const Q = l.slotW * A, xe = Math.max(1, Math.floor((a.value || 1) / Q)), ve = Ee - (B - 8) / Q, Z = Math.max(0, l.candles.length - xe - ve);
        u.value = U(Z * Q);
      } else {
        const ce = Math.exp(-D.deltaY * 15e-4);
        v.value = Math.max(Ft, Math.min(_t, v.value * ce));
      }
    }
    let N = !1, oe = 0, we = 0;
    function q(D) {
      D.button === 0 && (N = !0, oe = D.clientX, we = u.value, f.value = null);
    }
    function ke(D) {
      if (N) {
        const B = D.clientX - oe;
        u.value = U(we + B);
        return;
      }
    }
    function Te() {
      N = !1;
    }
    function R(D) {
      if (N) return;
      const [B, P] = G(D);
      if (B < 0 || P < 0) {
        f.value = null;
        return;
      }
      f.value = { x: B, y: P };
    }
    function H() {
      f.value = null;
    }
    Ve(() => {
      document.addEventListener("mousemove", ke), document.addEventListener("mouseup", Te), Le(() => {
        var D;
        m(), n.value && (n.value.addEventListener("webglcontextlost", Y), n.value.addEventListener("webglcontextrestored", V)), e.value && (_ = new ResizeObserver(() => p()), _.observe(e.value), k = new IntersectionObserver((B) => {
          B.some((P) => P.isIntersecting) && F();
        }), k.observe(e.value)), window.addEventListener("resize", F), (D = window.visualViewport) == null || D.addEventListener("resize", F);
      });
    }), Ke(() => {
      var D, B, P;
      document.removeEventListener("mousemove", ke), document.removeEventListener("mouseup", Te), (D = n.value) == null || D.removeEventListener("webglcontextlost", Y), (B = n.value) == null || B.removeEventListener("webglcontextrestored", V), _ == null || _.disconnect(), k == null || k.disconnect(), window.removeEventListener("resize", F), (P = window.visualViewport) == null || P.removeEventListener("resize", F), cancelAnimationFrame(C), s == null || s.dispose();
    });
    const j = K(() => Qe[l.theme] ?? Qe.none), ee = K(() => ({
      background: j.value.bg
    }));
    return (D, B) => (re(), se("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: ye(ee.value)
    }, [
      J("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-candle-canvas",
        onWheel: Re(ge, ["prevent"]),
        onMousedown: q,
        onMousemove: R,
        onMouseleave: H
      }, null, 544)
    ], 4));
  }
}), Cn = /* @__PURE__ */ qe(Jl, [["__scopeId", "data-v-a6eef348"]]), gt = W(0), ft = 28, Pe = 12;
let dt = 10, et = "cathode.layout", tt = !1;
const ie = W({});
function Ql(t, l = "cathode.layout") {
  if (!tt) {
    tt = !0, et = l;
    try {
      const e = localStorage.getItem(et);
      if (e) {
        ie.value = JSON.parse(e), Bt();
        return;
      }
    } catch {
    }
    ie.value = { ...t }, Bt();
  }
}
function Bt() {
  let t = 10;
  for (const l of Object.values(ie.value))
    typeof (l == null ? void 0 : l.zIndex) == "number" && l.zIndex > t && (t = l.zIndex);
  dt = t;
}
function Ye() {
  localStorage.setItem(et, JSON.stringify(ie.value));
}
function en(t) {
  tt = !1, localStorage.removeItem(et), ie.value = { ...t }, Ye(), tt = !0, gt.value++;
}
function At(t) {
  dt++, ie.value[t] && (ie.value[t].zIndex = dt);
}
function tn(t, l) {
  ie.value[t].visible = l, Ye();
}
function ln(t, l) {
  ie.value[t].minimized = l, l && (ie.value[t].maximized = !1), Ye();
}
function nn(t, l) {
  ie.value[t].maximized = l, l && (ie.value[t].minimized = !1, At(t)), Ye();
}
function on(t, l, e) {
  ie.value[t].x = Math.round(l), ie.value[t].y = Math.round(e), Ye();
}
function an(t, l, e) {
  ie.value[t].w = Math.round(l), ie.value[t].h = Math.round(e), Ye();
}
function kn(t, l, e) {
  const n = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / n), r = Math.floor((t - Pe * (n + 1)) / n), u = Math.floor((l - Pe * (a + 1)) / a), v = {};
  return e.forEach((f, c) => {
    const s = c % n, x = Math.floor(c / n);
    v[f] = {
      x: Pe + s * (r + Pe),
      y: Pe + x * (u + Pe),
      w: r,
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
    containers: ie,
    TITLEBAR_H: ft,
    load: Ql,
    save: Ye,
    reset: en,
    bringToFront: At,
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
    const l = t, { containers: e, load: n, reset: a, setVisible: r } = Ht(), u = W(null);
    kt("cathodeWorkspace", u), kt("cathodeResetTick", gt), Ve(() => {
      if (!u.value) return;
      const { clientWidth: d, clientHeight: m } = u.value, p = l.initialLayout ?? {};
      n(p, l.storageKey ?? "cathode.layout");
      const M = Object.keys(e.value)[0];
      M && v(M);
    });
    function v(d) {
      var p;
      document.querySelectorAll(".cc").forEach((M) => M.classList.remove("cc-focused"));
      const m = (p = u.value) == null ? void 0 : p.querySelector(`#cc-${d}`);
      m && m.classList.add("cc-focused");
    }
    function f() {
      !u.value || !l.initialLayout || a(l.initialLayout);
    }
    function c(d) {
      const m = d.target.closest(".cc");
      m && (document.querySelectorAll(".cc").forEach((p) => p.classList.remove("cc-focused")), m.classList.add("cc-focused"));
    }
    const s = W(!1), x = () => Object.entries(e.value).filter(([, d]) => !d.visible).map(([d]) => d);
    function y(d) {
      r(d, !0), s.value = !1;
    }
    function S(d) {
      if (!s.value) return;
      const m = d.target;
      !m.closest(".ws-restore-menu") && !m.closest(".ws-btn-restore") && (s.value = !1);
    }
    function g(d) {
      d.key === "Escape" && (s.value = !1);
    }
    Ve(() => {
      document.addEventListener("click", S), document.addEventListener("keydown", g);
    }), Ke(() => {
      document.removeEventListener("click", S), document.removeEventListener("keydown", g);
    });
    function h(d) {
      var m;
      return ((m = l.containerTitles) == null ? void 0 : m[d]) ?? d;
    }
    return (d, m) => (re(), se("div", {
      ref_key: "workspaceEl",
      ref: u,
      class: "cathode-workspace",
      onMousedown: c
    }, [
      ut(d.$slots, "default", {}, void 0, !0),
      ut(d.$slots, "overlay", {}, void 0, !0),
      J("div", rn, [
        t.initialLayout ? (re(), se("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: f
        }, " ↺ Reset Layout ")) : Se("", !0),
        m[1] || (m[1] = J("div", { class: "ws-sep" }, null, -1)),
        J("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: m[0] || (m[0] = (p) => s.value = !s.value)
        }, " ⊞ Restore Panel ")
      ]),
      tl(ll, { name: "menu" }, {
        default: nl(() => [
          s.value ? (re(), se("div", sn, [
            m[3] || (m[3] = J("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            x().length ? Se("", !0) : (re(), se("div", cn, " No closed panels ")),
            (re(!0), se(ol, null, al(x(), (p) => (re(), se("div", {
              key: p,
              class: "ws-restore-item",
              onClick: (M) => y(p)
            }, [
              m[2] || (m[2] = J("span", { class: "ws-restore-icon" }, "⊞", -1)),
              il(" " + Me(h(p)), 1)
            ], 8, un))), 128))
          ])) : Se("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Tn = /* @__PURE__ */ qe(fn, [["__scopeId", "data-v-5838d04b"]]), dn = ["id"], vn = { class: "cc-title" }, mn = {
  key: 0,
  class: "cc-size-badge"
}, hn = { class: "cc-controls" }, gn = ["title"], pn = { class: "cc-body" }, wn = 200, bn = 80, zt = 60, xn = /* @__PURE__ */ Ue({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const l = t, { containers: e, bringToFront: n, setVisible: a, setMinimized: r, setMaximized: u, updatePos: v, updateSize: f } = Ht(), c = lt("cathodeWorkspace", W(null)), s = K(() => e.value[l.id]), x = K(() => {
      const R = s.value, H = l.curvature ?? 0;
      if (!R) return {};
      const j = { "--curvature": H };
      return R.maximized ? { ...j, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: R.zIndex } : {
        ...j,
        left: R.x + "px",
        top: R.y + "px",
        width: R.w + "px",
        height: R.minimized ? ft + "px" : R.h + "px",
        zIndex: R.zIndex,
        display: R.visible ? "flex" : "none"
      };
    });
    let y = !1, S = 0, g = 0;
    function h(R) {
      var ee;
      if (R.target.closest(".cc-btn") || s.value.maximized) return;
      n(l.id), y = !0;
      const H = (ee = c.value) == null ? void 0 : ee.querySelector(`#cc-${l.id}`);
      if (!H) return;
      const j = H.getBoundingClientRect();
      S = R.clientX - j.left, g = R.clientY - j.top, document.addEventListener("mousemove", d), document.addEventListener("mouseup", m), R.preventDefault();
    }
    function d(R) {
      var B;
      if (!y || !c.value) return;
      const H = c.value.getBoundingClientRect(), j = ((B = s.value) == null ? void 0 : B.w) ?? 300;
      let ee = R.clientX - H.left - S, D = R.clientY - H.top - g;
      ee = Math.max(zt - j, Math.min(H.width - zt, ee)), D = Math.max(0, Math.min(H.height - ft, D)), v(l.id, ee, D);
    }
    function m() {
      y = !1, document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", m);
    }
    let p = !1, M = 0, _ = 0, k = 0, C = 0;
    const w = W("");
    function F(R) {
      s.value.maximized || (n(l.id), p = !0, M = R.clientX, _ = R.clientY, k = s.value.w, C = s.value.h, document.addEventListener("mousemove", Y), document.addEventListener("mouseup", V), R.preventDefault(), R.stopPropagation());
    }
    function Y(R) {
      if (!p) return;
      const H = Math.max(wn, k + (R.clientX - M)), j = Math.max(bn, C + (R.clientY - _));
      f(l.id, H, j), w.value = `${Math.round(H)}×${Math.round(j)}`;
    }
    function V() {
      p = !1, w.value = "", document.removeEventListener("mousemove", Y), document.removeEventListener("mouseup", V), G.value++;
    }
    const G = W(0);
    $(gt, () => {
      G.value++;
    }), Ke(() => {
      var R;
      document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", m), document.removeEventListener("mousemove", Y), document.removeEventListener("mouseup", V), (R = U.value) == null || R.removeEventListener("scroll", N), oe();
    });
    const U = W(null);
    function ge(R) {
      if (l.canvas) return [];
      const H = R.children[0];
      return H ? Array.from(H.children) : [];
    }
    function N() {
      const R = U.value, H = l.curvature ?? 0;
      if (!R) return;
      const j = ge(R);
      if (!j.length) return;
      const ee = R.clientHeight, D = ee / 2, B = H * 38e-4;
      j.forEach((P) => {
        if (!P.dataset.origFs) {
          const ve = getComputedStyle(P);
          P.dataset.origFs = ve.fontSize, P.dataset.origLh = ve.lineHeight;
        }
        if (H === 0) {
          P.style.fontSize = "", P.style.lineHeight = "";
          return;
        }
        const de = P.getBoundingClientRect(), ce = R.getBoundingClientRect(), be = de.top - ce.top + de.height / 2, Ee = Math.min(1, Math.abs(be - D) / (ee / 2)), E = 1 + B * Math.cos(Ee * Math.PI / 2), A = parseFloat(P.dataset.origFs), Q = P.dataset.origLh, xe = Q === "normal" ? A * 1.4 : parseFloat(Q);
        isNaN(A) || (P.style.fontSize = `${(A * E).toFixed(2)}px`), isNaN(xe) || (P.style.lineHeight = `${(xe * E).toFixed(2)}px`);
      });
    }
    function oe() {
      const R = U.value;
      R && ge(R).forEach((H) => {
        H.style.fontSize = "", H.style.lineHeight = "", delete H.dataset.origFs, delete H.dataset.origLh;
      });
    }
    $(() => l.curvature, (R) => {
      (R ?? 0) === 0 ? oe() : N();
    }), Ve(() => {
      var R;
      (R = U.value) == null || R.addEventListener("scroll", N, { passive: !0 }), Le(N);
    });
    function we() {
      r(l.id, !s.value.minimized), Le(() => {
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
    return (R, H) => s.value && s.value.visible ? (re(), se("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: rl(["cc", { "cc-minimized": s.value.minimized, "cc-maximized": s.value.maximized, "cc-has-canvas": t.canvas }]),
      style: ye(x.value),
      onMousedown: Te
    }, [
      J("div", {
        class: "cc-titlebar",
        onMousedown: h
      }, [
        H[0] || (H[0] = J("span", { class: "cc-status-dot" }, null, -1)),
        J("span", vn, Me(t.title), 1),
        w.value ? (re(), se("span", mn, Me(w.value), 1)) : Se("", !0),
        J("div", hn, [
          J("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Re(we, ["stop"])
          }, "─"),
          J("button", {
            class: "cc-btn cc-btn-max",
            title: s.value.maximized ? "Restore" : "Maximize",
            onClick: Re(q, ["stop"])
          }, Me(s.value.maximized ? "⤡" : "⤢"), 9, gn),
          J("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Re(ke, ["stop"])
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
          ut(R.$slots, "default", { resizeKey: G.value }, void 0, !0),
          H[1] || (H[1] = J("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [cl, !s.value.minimized]
      ]),
      !s.value.minimized && !s.value.maximized ? (re(), se("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Re(F, ["stop"])
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
