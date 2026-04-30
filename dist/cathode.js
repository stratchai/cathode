import { defineComponent as Ue, ref as A, reactive as rt, computed as U, watch as $, inject as lt, nextTick as Le, onMounted as Ve, onUnmounted as Ke, openBlock as re, createElementBlock as se, normalizeStyle as ye, createElementVNode as J, withModifiers as Re, withKeys as tl, createCommentVNode as Se, toDisplayString as Me, provide as Tt, renderSlot as ut, createVNode as ll, Transition as nl, withCtx as ol, Fragment as al, renderList as il, createTextVNode as rl, normalizeClass as sl, withDirectives as cl, vShow as ul } from "vue";
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
}, ae = 30, kt = 12, fl = 10;
function It(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, c = $e[l.theme] ?? $e.none, { cols: u, rows: v, pinnedRows: d, rowHeight: s, scrollY: r, scrollX: b, glow: y } = l;
  e.clearRect(0, 0, n, a), e.fillStyle = c.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const S = d.length * s, g = a - ae - S;
  e.fillStyle = c.headerBg, e.fillRect(0, 0, n, ae), e.textBaseline = "middle", e.textAlign = "left";
  let m = -b;
  for (let p = 0; p < u.length; p++) {
    const M = u[p];
    if (m + M.width <= 0) {
      m += M.width;
      continue;
    }
    if (m >= n) break;
    const R = !!l.colFilters[M.colId], T = l.sortColId === M.colId, C = (M.colDef.headerName ?? M.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(m, 0, M.width, ae), e.clip(), e.font = `bold ${fl}px system-ui, -apple-system, sans-serif`, e.fillStyle = R ? c.accent : c.textHeader, y && (e.shadowBlur = 6, e.shadowColor = c.textHeader), e.fillText(C, m + 8, ae / 2), e.shadowBlur = 0, T) {
      const x = e.measureText(C).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = c.accent, e.fillText(l.sortDir === "asc" ? "▲" : "▼", m + 8 + x + 4, ae / 2);
    }
    M.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = R ? c.accent : c.textHeader, e.globalAlpha = R ? 1 : 0.38, e.fillText("⌕", m + M.width - 20, ae / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(m + M.width - 0.5, 0), e.lineTo(m + M.width - 0.5, ae), e.stroke(), m += M.width;
  }
  e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, ae - 0.5), e.lineTo(n, ae - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ae, n, g), e.clip();
  const f = Math.max(0, Math.floor(r / s)), h = Math.min(v.length, Math.ceil((r + g) / s));
  for (let p = f; p < h; p++) {
    const M = v[p], R = ae + p * s - r;
    p % 2 === 1 && (e.fillStyle = c.rowAlt, e.fillRect(0, R, n, s)), p === l.hoveredRow && p !== l.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, R, n, s)), p === l.selectedRow && (e.fillStyle = dl(c.accent, 0.1), e.fillRect(0, R, n, s)), e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, R + s - 0.5), e.lineTo(n, R + s - 0.5), e.stroke();
    let T = -b;
    for (let C = 0; C < u.length; C++) {
      const x = u[C];
      if (T + x.width <= 0) {
        T += x.width;
        continue;
      }
      if (T >= n) break;
      const F = l.getCellStyle(x, M), W = F.color ?? c.text, V = F.textAlign ?? "left", G = l.formatCell(x, M);
      e.save(), e.beginPath(), e.rect(T + 1, R, x.width - 2, s), e.clip(), e.font = `${kt}px system-ui, -apple-system, sans-serif`, e.fillStyle = W, e.textBaseline = "middle", y && (e.shadowBlur = 4, e.shadowColor = W), V === "right" ? (e.textAlign = "right", e.fillText(G, T + x.width - 8, R + s / 2)) : (e.textAlign = "left", e.fillText(G, T + 8, R + s / 2)), e.shadowBlur = 0, e.restore(), p === l.selectedRow && C === l.selectedCol && (e.strokeStyle = c.accent, e.lineWidth = 2, e.strokeRect(T + 1.5, R + 1.5, x.width - 3, s - 3)), e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(T + x.width - 0.5, R), e.lineTo(T + x.width - 0.5, R + s), e.stroke(), T += x.width;
    }
  }
  if (e.restore(), d.length > 0) {
    const p = a - S;
    e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, p - 0.5), e.lineTo(n, p - 0.5), e.stroke();
    for (let M = 0; M < d.length; M++) {
      const R = d[M], T = p + M * s;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, T, n, s);
      let C = -b;
      for (let x = 0; x < u.length; x++) {
        const F = u[x];
        if (C + F.width <= 0) {
          C += F.width;
          continue;
        }
        if (C >= n) break;
        const W = l.getCellStyle(F, R), V = W.color ?? c.text, G = W.textAlign ?? "left", K = l.formatCell(F, R);
        e.save(), e.beginPath(), e.rect(C + 1, T, F.width - 2, s), e.clip(), e.font = `bold ${kt}px system-ui, -apple-system, sans-serif`, e.fillStyle = V, e.textBaseline = "middle", G === "right" ? (e.textAlign = "right", e.fillText(K, C + F.width - 8, T + s / 2)) : (e.textAlign = "left", e.fillText(K, C + 8, T + s / 2)), e.restore(), e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(C + F.width - 0.5, T), e.lineTo(C + F.width - 0.5, T + s), e.stroke(), C += F.width;
      }
      e.strokeStyle = c.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, T + s - 0.5), e.lineTo(n, T + s - 0.5), e.stroke();
    }
  }
  e.restore();
}
function dl(t, l) {
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
function vl(t, l, e) {
  return t >= l + e - 24 && t < l + e;
}
function Lt(t, l, e) {
  const n = l + e;
  return t >= n - 6 && t <= n + 1;
}
function Dt(t, l, e, n, a, c, u, v, d) {
  const s = t + d;
  let r = -1, b = 0;
  for (let m = 0; m < e.length; m++) {
    if (s >= b && s < b + e[m].width) {
      r = m;
      break;
    }
    b += e[m].width;
  }
  if (l < ae) return { area: "header", colIdx: r, rowIdx: -1 };
  const y = v * a;
  if (y > 0 && l >= u - y) {
    const m = Math.floor((l - (u - y)) / a);
    return { area: "pinned", colIdx: r, rowIdx: m };
  }
  const S = l - ae + c, g = Math.floor(S / a);
  return g >= 0 && g < n ? { area: "body", colIdx: r, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const ml = ["value"], hl = ["disabled"], gl = ["disabled"], pl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, wl = `
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
`, bl = 28, xl = 600, yl = /* @__PURE__ */ Ue({
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
    const e = t, n = l, a = A(e.rowData ?? []), c = A(e.pinnedBottomRowData ?? []), u = A(""), v = A(null), d = rt({}), s = rt({}), r = rt(/* @__PURE__ */ new Set()), b = A(0), y = A(0), S = A(0), g = A(0), m = A(0), f = A(-1), h = A(null), p = A(null), M = A({ x: 0, y: ae }), R = A("");
    function T(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const C = U(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((i) => !r.has(T(i))).map((i) => {
        const w = T(i), k = { ...o, ...i };
        return { colId: w, colDef: k, width: s[w] ?? k.width ?? 100 };
      });
    }), x = U(() => {
      const o = y.value;
      if (!o) return C.value;
      const i = C.value.reduce((I, L) => I + L.width, 0);
      if (!i || i >= o) return C.value;
      const w = o / i;
      let k = 0;
      return C.value.map((I, L) => {
        const N = L === C.value.length - 1 ? o - k : Math.max(8, Math.round(I.width * w));
        return k += N, { ...I, width: N };
      });
    }), F = U(() => {
      const o = x.value.reduce((i, w) => i + w.width, 0);
      return Math.max(0, o - y.value);
    }), W = U(() => {
      const o = c.value.length * e.rowHeight;
      return Math.max(0, S.value - ae - o);
    }), V = U(
      () => Math.max(0, q.value.length * e.rowHeight - W.value)
    ), G = U(
      () => Math.max(1, Math.floor(W.value / e.rowHeight))
    ), K = U(
      () => q.value.length === 0 ? 0 : Math.min(q.value.length - 1, Math.floor(g.value / e.rowHeight))
    ), de = U(
      () => Math.min(q.value.length - 1, K.value + G.value - 1)
    );
    function X(o, i) {
      if (i.colDef.valueGetter) return i.colDef.valueGetter({ data: o, colDef: i.colDef });
      if (i.colDef.field) return o[i.colDef.field];
    }
    function oe(o, i) {
      const w = X(i, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: w, data: i, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: w, data: i, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : w == null ? "" : String(w);
    }
    function we(o, i) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: X(i, o), data: i, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const q = U(() => {
      b.value;
      let o = a.value;
      const i = u.value.trim().toLowerCase();
      i && (o = o.filter(
        (w) => C.value.some(
          (k) => String(X(w, k) ?? "").toLowerCase().includes(i)
        )
      ));
      for (const [w, k] of Object.entries(d)) {
        if (!k) continue;
        const I = C.value.find((L) => L.colId === w);
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
        const { colId: w, dir: k } = v.value, I = C.value.find((L) => L.colId === w);
        I && (o = [...o].sort((L, z) => {
          const N = X(L, I), le = X(z, I);
          let ne = 0;
          return I.colDef.comparator ? ne = I.colDef.comparator(N, le) : typeof N == "number" && typeof le == "number" ? ne = N - le : ne = String(N ?? "").localeCompare(String(le ?? ""), void 0, { numeric: !0 }), k === "asc" ? ne : -ne;
        }));
      }
      return o;
    });
    $(q, () => {
      g.value = 0, h.value = null;
    }), $(F, () => {
      m.value = Math.min(m.value, F.value);
    }), $(V, () => {
      g.value = Math.min(g.value, V.value);
    });
    function Te(o) {
      const i = o * e.rowHeight, w = i + e.rowHeight;
      i < g.value ? g.value = i : w > g.value + W.value && (g.value = Math.min(V.value, w - W.value));
    }
    function ke() {
      g.value = Math.max(0, g.value - W.value), fe();
    }
    function _() {
      g.value = Math.min(V.value, g.value + W.value), fe();
    }
    let H = !1, j = "", ee = 0, D = 0, B = !1, P = !1, ve = 0, ce = 0, be = 0, Ee = 0, E = !1;
    function Y(o, i) {
      var w;
      H = !0, j = o, ee = i, D = ((w = x.value.find((k) => k.colId === o)) == null ? void 0 : w.width) ?? 100, B = !1;
    }
    function Q(o) {
      if (P) {
        const L = ve - o.clientX, z = ce - o.clientY;
        (Math.abs(L) > 4 || Math.abs(z) > 4) && (E = !0), m.value = Math.max(0, Math.min(F.value, be + L)), g.value = Math.max(0, Math.min(V.value, Ee + z)), fe();
        return;
      }
      if (!H) return;
      const i = y.value, w = Math.max(30, D + (o.clientX - ee)), k = C.value.filter((L) => L.colId !== j).reduce((L, z) => L + z.width, 0), I = i - w;
      I > 10 && (s[j] = Math.max(10, Math.round(w * k / I))), fe();
    }
    function xe() {
      P && (E && (B = !0), P = !1), H && (H = !1, B = !0, n("column-resized"));
    }
    const me = A(null), Z = A(null), $t = lt("cathodeResetTick", A(0));
    $($t, () => He());
    let te = null, Be = !1, nt, pt, Ie, he, ue;
    function wt() {
      if (!(!Z.value || !me.value)) {
        ue = document.createElement("canvas");
        try {
          te = new O.WebGLRenderer({ canvas: Z.value, antialias: !1, alpha: !0 });
        } catch {
          Be = !0;
        }
        if (!Be && !te.getContext() && (te.dispose(), te = null, Be = !0), Be) {
          Ye();
          return;
        }
        te.setPixelRatio(1), te.setClearColor(0, 0), nt = new O.Scene(), pt = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), he = new O.CanvasTexture(ue), he.minFilter = O.LinearFilter, he.magFilter = O.LinearFilter, Ie = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: he },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new O.Color(0) }
          },
          vertexShader: pl,
          fragmentShader: wl,
          transparent: !0
        }), nt.add(new O.Mesh(new O.PlaneGeometry(2, 2), Ie)), Ye();
      }
    }
    function Ye() {
      if (!me.value || !te && !Be) return;
      const o = me.value.clientWidth, i = me.value.clientHeight - (e.pagination ? bl : 0);
      if (!o || !i) return;
      const w = ue.width !== o || ue.height !== i;
      ue.width = o, ue.height = i, y.value = o, S.value = i, m.value = Math.max(0, Math.min(F.value, m.value)), g.value = Math.max(0, Math.min(V.value, g.value)), te ? (w && he && (he.dispose(), he = new O.CanvasTexture(ue), he.minFilter = O.LinearFilter, he.magFilter = O.LinearFilter, Ie && (Ie.uniforms.uTex.value = he)), te.setPixelRatio(window.devicePixelRatio || 1), te.setSize(o, i)) : Z.value && (Z.value.width = o, Z.value.height = i, Z.value.style.width = o + "px", Z.value.style.height = i + "px"), fe();
    }
    function fe() {
      var w, k, I, L, z, N, le, ne;
      if (!(ue != null && ue.width)) return;
      if (Be) {
        if (!Z.value) return;
        It(ue, {
          cols: x.value,
          rows: q.value,
          pinnedRows: c.value,
          rowHeight: e.rowHeight,
          scrollY: g.value,
          scrollX: m.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((w = v.value) == null ? void 0 : w.colId) ?? null,
          sortDir: ((k = v.value) == null ? void 0 : k.dir) ?? null,
          colFilters: d,
          hoveredRow: f.value,
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
      const o = $e[e.theme] ?? $e.none, i = e.theme === "paper";
      Ie.uniforms.uStrength.value = e.curvature / 45 * 0.55, Ie.uniforms.uScanlines.value = e.scanlines && !i ? 1 : 0, Ie.uniforms.uVignette.value = i ? 0 : 1, Ie.uniforms.uBezel.value.set(o.bg), It(ue, {
        cols: x.value,
        rows: q.value,
        pinnedRows: c.value,
        rowHeight: e.rowHeight,
        scrollY: g.value,
        scrollX: m.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((z = v.value) == null ? void 0 : z.colId) ?? null,
        sortDir: ((N = v.value) == null ? void 0 : N.dir) ?? null,
        colFilters: d,
        hoveredRow: f.value,
        selectedRow: ((le = h.value) == null ? void 0 : le.row) ?? -1,
        selectedCol: ((ne = h.value) == null ? void 0 : ne.col) ?? -1,
        formatCell: oe,
        getCellStyle: we
      }), he.needsUpdate = !0, te.render(nt, pt);
    }
    function ot(o) {
      if (!Z.value) return [-1, -1];
      const i = Z.value.getBoundingClientRect();
      return [o.clientX - i.left, o.clientY - i.top];
    }
    let at = 0;
    function Ot(o) {
      p.value = null;
      const i = Date.now();
      if (o.deltaX !== 0) {
        at = i, m.value = Math.max(0, Math.min(F.value, m.value + o.deltaX)), fe();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        at = i, m.value = Math.max(0, Math.min(F.value, m.value + o.deltaY)), fe();
        return;
      }
      i - at < xl || (g.value = Math.max(0, Math.min(V.value, g.value + o.deltaY)), fe());
    }
    function Vt(o) {
      if (H) return;
      const [i, w] = ot(o);
      if (i < 0) {
        f.value = -1, fe();
        return;
      }
      const k = Dt(
        i,
        w,
        x.value,
        q.value.length,
        e.rowHeight,
        g.value,
        ue.height,
        c.value.length,
        m.value
      );
      if (f.value = k.area === "body" ? k.rowIdx : -1, k.area === "header" && k.colIdx >= 0) {
        const I = x.value[k.colIdx], L = st(k.colIdx, x.value), z = i + m.value;
        Z.value.style.cursor = I && Lt(z, L, I.width) ? "col-resize" : "pointer";
      } else k.area === "body" ? Z.value.style.cursor = "pointer" : Z.value.style.cursor = "default";
      fe();
    }
    function Xt() {
      f.value = -1, fe();
    }
    function Nt(o) {
      const [i, w] = ot(o);
      if (i < 0) return;
      if (w >= ae) {
        P = !0, E = !1, ve = o.clientX, ce = o.clientY, be = m.value, Ee = g.value;
        return;
      }
      const k = i + m.value;
      for (let I = 0; I < x.value.length; I++) {
        const L = x.value[I], z = st(I, x.value);
        if (L.colDef.resizable !== !1 && Lt(k, z, L.width)) {
          Y(L.colId, o.clientX);
          return;
        }
      }
    }
    function Gt(o) {
      var I, L, z;
      if (B) {
        B = !1;
        return;
      }
      if (H) return;
      const [i, w] = ot(o);
      if (i < 0) {
        p.value = null;
        return;
      }
      const k = Dt(
        i,
        w,
        x.value,
        q.value.length,
        e.rowHeight,
        g.value,
        ue.height,
        c.value.length,
        m.value
      );
      if (k.area === "header" && k.colIdx >= 0) {
        const N = x.value[k.colIdx], le = st(k.colIdx, x.value), ne = i + m.value;
        N.colDef.filter && vl(ne, le, N.width) ? (o.stopPropagation(), p.value === N.colId ? p.value = null : (p.value = N.colId, R.value = (I = d[N.colId]) != null && I.startsWith("__eq__") ? d[N.colId].slice(6) : d[N.colId] ?? "", M.value = { x: Math.max(0, le - m.value), y: ae })) : N.colDef.sortable !== !1 && (p.value = null, v.value = ((L = v.value) == null ? void 0 : L.colId) === N.colId ? v.value.dir === "asc" ? { colId: N.colId, dir: "desc" } : null : { colId: N.colId, dir: "asc" }, n("sort-changed"));
        return;
      }
      if (p.value = null, k.area === "body" && k.rowIdx >= 0 && k.colIdx >= 0) {
        const N = k.rowIdx;
        h.value = { row: N, col: k.colIdx }, (z = Z.value) == null || z.focus();
        const le = q.value[N], ne = x.value[k.colIdx];
        le && ne && (n("row-clicked", { data: le, event: o }), n("cell-selected", { data: le, row: N, col: k.colIdx, colId: ne.colId }));
      }
    }
    function bt(o) {
      var i, w;
      p.value && ((w = (i = o.target).closest) != null && w.call(i, ".cathode-filter-popup") || (p.value = null));
    }
    function Ut(o) {
      var I;
      if (!y.value) return;
      let i = 0;
      for (let L = 0; L < o; L++) i += x.value[L].width;
      const w = ((I = x.value[o]) == null ? void 0 : I.width) ?? 0, k = i - m.value;
      k < 0 ? m.value = Math.max(0, i) : k + w > y.value && (m.value = Math.min(F.value, i + w - y.value));
    }
    function Kt(o) {
      var N;
      const i = x.value, w = i.length - 1, k = q.value.length - 1;
      if (!h.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), h.value = { row: K.value, col: 0 });
        return;
      }
      let { row: I, col: L } = h.value;
      const z = (le, ne) => {
        I = Math.max(0, Math.min(k, le)), L = Math.max(0, Math.min(w, ne)), h.value = { row: I, col: L }, Te(I), Ut(L);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), z(I + 1, L);
          break;
        case "ArrowUp":
          o.preventDefault(), z(I - 1, L);
          break;
        case "ArrowRight":
          o.preventDefault(), L < w ? z(I, L + 1) : z(I + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), L > 0 ? z(I, L - 1) : z(I - 1, w);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? L > 0 ? z(I, L - 1) : z(I - 1, w) : L < w ? z(I, L + 1) : z(I + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? z(I - 1, L) : z(I + 1, L);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? z(0, 0) : z(I, 0);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? z(k, w) : z(I, w);
          break;
        case "PageDown":
          o.preventDefault(), z(Math.min(k, I + G.value), L);
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
            const le = q.value[I], ne = i[L];
            le && ne && ((N = navigator.clipboard) == null || N.writeText(oe(ne, le)).catch(() => {
            }));
          }
          break;
      }
    }
    function qt(o) {
      const i = o.target.value;
      R.value = i, i ? d[p.value] = i : delete d[p.value], n("filter-changed");
    }
    function xt() {
      p.value && delete d[p.value], R.value = "", p.value = null, n("filter-changed");
    }
    const jt = {
      setGridOption(o, i) {
        o === "rowData" ? a.value = i : o === "pinnedBottomRowData" ? c.value = i : o === "quickFilterText" && (u.value = i);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var w, k;
          const i = T(o);
          return {
            colId: i,
            hide: r.has(i),
            sort: ((w = v.value) == null ? void 0 : w.colId) === i ? v.value.dir : null,
            sortIndex: ((k = v.value) == null ? void 0 : k.colId) === i ? 0 : null,
            width: s[i] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const i of o)
          i.hide === !0 && r.add(i.colId), i.hide === !1 && r.delete(i.colId), i.sort && (v.value = { colId: i.colId, dir: i.sort }), i.width && (s[i.colId] = i.width);
      },
      setFilterModel(o) {
        for (const i of Object.keys(d)) delete d[i];
        if (o)
          for (const [i, w] of Object.entries(o))
            (w == null ? void 0 : w.type) === "equals" ? d[i] = `__eq__${w.filter}` : w != null && w.filter && (d[i] = w.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [i, w] of Object.entries(d))
          w && (o[i] = w.startsWith("__eq__") ? { type: "equals", filter: w.slice(6) } : { type: "contains", filter: w });
        return o;
      },
      async setColumnFilterModel(o, i) {
        i ? i.type === "equals" ? d[o] = `__eq__${i.filter}` : d[o] = i.filter ?? "" : delete d[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        b.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const i = C.value, w = i.map((z) => z.colDef.headerName ?? z.colId).join(","), k = q.value.map(
          (z) => i.map((N) => `"${String(oe(N, z)).replace(/"/g, '""')}"`).join(",")
        ), I = new Blob([[w, ...k].join(`
`)], { type: "text/csv" }), L = URL.createObjectURL(I);
        Object.assign(document.createElement("a"), { href: L, download: o }).click(), URL.revokeObjectURL(L);
      },
      resize() {
        Ye();
      },
      resetColumnState() {
        r.clear();
        for (const i of e.columnDefs)
          i.hide && r.add(T(i));
        const o = e.columnDefs.find((i) => i.sort);
        v.value = o ? { colId: T(o), dir: o.sort } : null;
        for (const i of Object.keys(s)) delete s[i];
        for (const i of Object.keys(d)) delete d[i];
        u.value = "", g.value = 0, h.value = null, p.value = null;
      }
    };
    $(
      [q, () => c.value, x, g, f, h],
      () => Le(fe)
    ), $(() => e.theme, () => fe()), $(() => e.curvature, () => Le(Ye)), $(() => e.scanlines, () => fe()), $(() => e.glow, () => fe()), $(h, (o) => {
      if (!o) return;
      const i = q.value[o.row], w = x.value[o.col];
      i && w && n("cell-selected", { data: i, row: o.row, col: o.col, colId: w.colId });
    });
    let Xe = null, Ne = null, it = 0;
    function He() {
      cancelAnimationFrame(it), it = requestAnimationFrame(Ye);
    }
    function yt(o) {
      o.preventDefault();
    }
    function Mt() {
      te == null || te.dispose(), te = null, Be = !1, wt();
    }
    Ve(() => {
      for (const o of e.columnDefs)
        o.hide && r.add(T(o)), o.sort && !v.value && (v.value = { colId: T(o), dir: o.sort });
      a.value = e.rowData ?? [], c.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", bt), document.addEventListener("mousemove", Q), document.addEventListener("mouseup", xe), Le(() => {
        var o;
        wt(), Z.value && (Z.value.addEventListener("webglcontextlost", yt), Z.value.addEventListener("webglcontextrestored", Mt)), me.value && (Xe = new ResizeObserver(() => Ye()), Xe.observe(me.value), Ne = new IntersectionObserver((i) => {
          i.some((w) => w.isIntersecting) && He();
        }), Ne.observe(me.value)), window.addEventListener("resize", He), (o = window.visualViewport) == null || o.addEventListener("resize", He), n("grid-ready", { api: jt });
      });
    }), Ke(() => {
      var o, i, w;
      document.removeEventListener("click", bt, !0), document.removeEventListener("mousemove", Q), document.removeEventListener("mouseup", xe), (o = Z.value) == null || o.removeEventListener("webglcontextlost", yt), (i = Z.value) == null || i.removeEventListener("webglcontextrestored", Mt), Xe == null || Xe.disconnect(), Ne == null || Ne.disconnect(), window.removeEventListener("resize", He), (w = window.visualViewport) == null || w.removeEventListener("resize", He), cancelAnimationFrame(it), te == null || te.dispose();
    });
    const ge = U(() => $e[e.theme] ?? $e.none), Zt = U(() => ({
      position: "absolute",
      left: `${M.value.x}px`,
      top: `${M.value.y}px`,
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
    })), Jt = U(() => ({
      background: ge.value.bg,
      border: `1px solid ${ge.value.border}`,
      color: ge.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Qt = U(() => ({
      background: ge.value.headerBg,
      borderTop: `1px solid ${ge.value.border}`,
      color: ge.value.text
    })), el = U(() => ({
      background: ge.value.bg
    })), St = U(() => ge.value.accent);
    return (o, i) => {
      var w, k;
      return re(), se("div", {
        ref_key: "wrapEl",
        ref: me,
        class: "cathode-wrap",
        style: ye(el.value)
      }, [
        J("canvas", {
          ref_key: "canvasEl",
          ref: Z,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Re(Ot, ["prevent"]),
          onMousemove: Vt,
          onMouseleave: Xt,
          onMousedown: Nt,
          onClick: Gt,
          onKeydown: Kt
        }, null, 544),
        p.value ? (re(), se("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: ye(Zt.value),
          onClick: i[0] || (i[0] = Re(() => {
          }, ["stop"]))
        }, [
          J("input", {
            style: ye(Jt.value),
            value: R.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: qt,
            onKeydown: tl(xt, ["escape"])
          }, null, 44, ml),
          R.value ? (re(), se("button", {
            key: 0,
            style: ye({
              background: "none",
              border: "none",
              color: ge.value.text,
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
          style: ye(Qt.value)
        }, [
          J("button", {
            disabled: g.value <= 0,
            onClick: i[1] || (i[1] = (I) => ke())
          }, "◀", 8, hl),
          J("span", null, Me((K.value + 1).toLocaleString()) + "–" + Me(Math.min(q.value.length, de.value + 1).toLocaleString()) + " / " + Me(q.value.length.toLocaleString()), 1),
          J("button", {
            disabled: g.value >= V.value,
            onClick: i[2] || (i[2] = (I) => _())
          }, "▶", 8, gl),
          J("span", {
            class: "cathode-page-info",
            style: ye({ color: St.value })
          }, Me(q.value.length.toLocaleString()) + " rows ", 5),
          h.value ? (re(), se("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: ye({ color: St.value })
          }, Me(((w = x.value[h.value.col]) == null ? void 0 : w.colDef.headerName) ?? ((k = x.value[h.value.col]) == null ? void 0 : k.colId)) + " : " + Me(oe(x.value[h.value.col], q.value[h.value.row])), 5)) : Se("", !0)
        ], 4)) : Se("", !0)
      ], 4);
    };
  }
}), qe = (t, l) => {
  const e = t.__vccOpts || t;
  for (const [n, a] of l)
    e[n] = a;
  return e;
}, Tn = /* @__PURE__ */ qe(yl, [["__scopeId", "data-v-07901c91"]]), Je = {
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
function Ml(t, l) {
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
const Sl = 12, pe = 18, Ze = 10, Oe = 6, vt = `${Sl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Cl(t, l, e) {
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
    for (const v of c) {
      const d = u + v;
      if (t.measureText(d).width <= e)
        u = d;
      else if (u && (n.push(u.replace(/\s+$/, "")), u = ""), t.measureText(v).width > e) {
        let s = "";
        for (const r of v)
          t.measureText(s + r).width > e ? (s && n.push(s), s = r) : s += r;
        u = s;
      } else
        u = v.replace(/^\s+/, "");
    }
    u && n.push(u.replace(/\s+$/, ""));
  }
  return n.length ? n : [""];
}
function At(t) {
  if (typeof t == "number") {
    const l = new Date(t), e = String(l.getHours()).padStart(2, "0"), n = String(l.getMinutes()).padStart(2, "0"), a = String(l.getSeconds()).padStart(2, "0");
    return `${e}:${n}:${a}`;
  }
  return t;
}
function Tl(t, l) {
  return Math.ceil(t.measureText(l).width) + 12;
}
function kl(t) {
  const { entries: l, ctx: e, textMaxWidth: n, showTimestamps: a, wordWrap: c } = t, u = t.formatTs ?? At;
  e.font = vt;
  const v = [];
  for (let d = 0; d < l.length; d++) {
    const s = l[d], r = s.level ?? "info", b = a && s.ts != null ? u(s.ts) : "", y = c ? Cl(e, s.text, n) : s.text.split(`
`);
    for (let S = 0; S < y.length; S++)
      v.push({
        entryIdx: d,
        text: y[S],
        level: r,
        timestamp: S === 0 ? b : "",
        isFirstFrag: S === 0
      });
  }
  return v;
}
function Et(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, c = Je[l.theme] ?? Je.none;
  e.clearRect(0, 0, n, a), e.fillStyle = c.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip(), e.font = vt, e.textBaseline = "middle";
  const u = l.visualLines, v = Ze, d = l.showTimestamps ? Ze + l.timestampWidth : Ze, s = Math.max(0, Math.floor((l.scrollY - Oe) / pe)), r = Math.min(u.length, Math.ceil((l.scrollY + a - Oe) / pe) + 1);
  for (let b = s; b < r; b++) {
    const y = u[b], S = Oe + b * pe - l.scrollY + pe / 2;
    if (y.entryIdx % 2 === 1 && y.isFirstFrag) {
      e.fillStyle = c.rowAlt;
      let m = 1;
      for (; b + m < r && u[b + m].entryIdx === y.entryIdx; ) m++;
      e.fillRect(0, S - pe / 2, n, pe * m);
    }
    b === l.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, S - pe / 2, n, pe)), l.showTimestamps && y.timestamp && (e.fillStyle = c.timestamp, e.textAlign = "left", l.glow && (e.shadowBlur = 3, e.shadowColor = c.timestamp), e.fillText(y.timestamp, v, S), e.shadowBlur = 0);
    const g = Ml(c, y.level);
    e.fillStyle = g, e.textAlign = "left", l.glow && (e.shadowBlur = 4, e.shadowColor = g), e.fillText(y.text, d, S), e.shadowBlur = 0;
  }
  e.restore();
}
function Il(t, l, e) {
  if (t < 0) return -1;
  const n = Math.floor((t + l - Oe) / pe);
  return n < 0 || n >= e ? -1 : n;
}
function Ll(t) {
  return Oe * 2 + t * pe;
}
const Dl = `
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
    const e = t, n = A(null), a = A(null), c = A(0), u = A(0), v = A(0), d = A(-1), s = A(!0), r = U(() => {
      const E = e.entries ?? [];
      return e.maxLines > 0 && E.length > e.maxLines ? E.slice(E.length - e.maxLines) : E;
    }), b = U(() => {
      if (!e.showTimestamps) return "";
      const E = e.formatTs ?? At;
      let Y = "00:00:00";
      for (const Q of r.value) {
        if (Q.ts == null) continue;
        const xe = E(Q.ts);
        xe.length > Y.length && (Y = xe);
      }
      return Y;
    }), y = A(0), S = A([]);
    function g() {
      if (!x) return;
      const E = x.getContext("2d");
      if (!E) return;
      E.font = vt;
      const Y = e.showTimestamps ? Tl(E, b.value) : 0;
      y.value = Y;
      const Q = Math.max(
        1,
        c.value - Ze * 2 - Y
      );
      S.value = kl({
        entries: r.value,
        ctx: E,
        textMaxWidth: Q,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const m = U(() => Ll(S.value.length)), f = U(() => Math.max(0, m.value - u.value));
    $(f, () => {
      s.value ? v.value = f.value : v.value = Math.min(v.value, f.value);
    }), $(
      [r, c, () => e.showTimestamps, () => e.wordWrap, b],
      () => {
        g(), Le(V);
      },
      { deep: !1 }
    );
    let h = null, p = !1, M, R, T, C, x;
    function F() {
      if (!(!a.value || !n.value)) {
        x = document.createElement("canvas");
        try {
          h = new O.WebGLRenderer({ canvas: a.value, antialias: !1, alpha: !0 });
        } catch {
          p = !0;
        }
        if (!p && !h.getContext() && (h.dispose(), h = null, p = !0), p) {
          W();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), M = new O.Scene(), R = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), C = new O.CanvasTexture(x), C.minFilter = O.LinearFilter, C.magFilter = O.LinearFilter, T = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: C },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Dl,
          fragmentShader: El,
          transparent: !0
        }), M.add(new O.Mesh(new O.PlaneGeometry(2, 2), T)), W();
      }
    }
    function W() {
      if (!n.value || !h && !p) return;
      const E = n.value.clientWidth, Y = n.value.clientHeight;
      if (!E || !Y) return;
      const Q = x.width !== E || x.height !== Y;
      Q && (x.width = E, x.height = Y, c.value = E, u.value = Y, g(), h ? (Q && C && (C.dispose(), C = new O.CanvasTexture(x), C.minFilter = O.LinearFilter, C.magFilter = O.LinearFilter, T && (T.uniforms.uTex.value = C)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(E, Y)) : a.value && (a.value.width = E, a.value.height = Y, a.value.style.width = E + "px", a.value.style.height = Y + "px"), s.value && (v.value = Math.max(0, m.value - u.value)), V());
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
          timestampWidth: y.value,
          hoveredLine: d.value
        });
        const Y = a.value.getContext("2d");
        Y && Y.drawImage(x, 0, 0);
        return;
      }
      if (!h || !T || !C) return;
      const E = e.theme === "paper";
      T.uniforms.uStrength.value = e.curvature / 45 * 0.55, T.uniforms.uScanlines.value = e.scanlines && !E ? 1 : 0, T.uniforms.uVignette.value = E ? 0 : 1, Et(x, {
        visualLines: S.value,
        scrollY: v.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: y.value,
        hoveredLine: d.value
      }), C.needsUpdate = !0, h.render(M, R);
    }
    $(() => e.theme, () => V()), $(() => e.curvature, () => V()), $(() => e.scanlines, () => V()), $(() => e.glow, () => V()), $(v, () => V()), $(d, () => V());
    function G(E) {
      if (!a.value) return [-1, -1];
      const Y = a.value.getBoundingClientRect();
      return [E.clientX - Y.left, E.clientY - Y.top];
    }
    function K(E) {
      v.value = Math.max(0, Math.min(f.value, E)), s.value = v.value >= f.value - 4;
    }
    function de(E) {
      K(v.value + E.deltaY);
    }
    let X = !1, oe = 0, we = 0;
    function q(E) {
      X = !0, oe = E.clientY, we = v.value;
    }
    function Te(E) {
      if (X) {
        const Y = oe - E.clientY;
        K(we + Y);
      }
    }
    function ke() {
      X && (X = !1);
    }
    function _(E) {
      const [, Y] = G(E);
      if (Y < 0) {
        d.value = -1;
        return;
      }
      d.value = Il(Y, v.value, S.value.length);
    }
    function H() {
      d.value = -1;
    }
    l({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        s.value = !0, v.value = f.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(E) {
        K(Oe + E * pe);
      }
    });
    let j = null, ee = null, D = 0;
    const B = lt("cathodeResetTick", A(0));
    $(B, () => P());
    function P() {
      cancelAnimationFrame(D), D = requestAnimationFrame(W);
    }
    function ve(E) {
      E.preventDefault();
    }
    function ce() {
      h == null || h.dispose(), h = null, p = !1, F();
    }
    Ve(() => {
      document.addEventListener("mousemove", Te), document.addEventListener("mouseup", ke), Le(() => {
        var E;
        F(), a.value && (a.value.addEventListener("webglcontextlost", ve), a.value.addEventListener("webglcontextrestored", ce)), n.value && (j = new ResizeObserver(() => W()), j.observe(n.value), ee = new IntersectionObserver((Y) => {
          Y.some((Q) => Q.isIntersecting) && P();
        }), ee.observe(n.value)), window.addEventListener("resize", P), (E = window.visualViewport) == null || E.addEventListener("resize", P), v.value = f.value;
      });
    }), Ke(() => {
      var E, Y, Q;
      document.removeEventListener("mousemove", Te), document.removeEventListener("mouseup", ke), (E = a.value) == null || E.removeEventListener("webglcontextlost", ve), (Y = a.value) == null || Y.removeEventListener("webglcontextrestored", ce), j == null || j.disconnect(), ee == null || ee.disconnect(), window.removeEventListener("resize", P), (Q = window.visualViewport) == null || Q.removeEventListener("resize", P), cancelAnimationFrame(D), h == null || h.dispose();
    });
    const be = U(() => Je[e.theme] ?? Je.none), Ee = U(() => ({
      background: be.value.bg
    }));
    return (E, Y) => (re(), se("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: ye(Ee.value)
    }, [
      J("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: Re(de, ["prevent"]),
        onMousemove: _,
        onMouseleave: H,
        onMousedown: q
      }, null, 544)
    ], 4));
  }
}), kn = /* @__PURE__ */ qe(Rl, [["__scopeId", "data-v-d2d092f3"]]), Qe = {
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
}, _l = 0.18, Ge = 8, mt = 22, Fl = 4, De = 8, Ae = 56, Wt = 42, _e = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Bl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ct = 4, zl = 1, Al = 1;
function Wl(t, l, e, n = 0, a = !1) {
  const c = a ? Wt : Ae, u = Math.max(0, l - De - c), v = Math.max(1, Math.floor(u / e)), d = Math.min(v, t);
  return { firstIdx: Math.max(0, t - d - Math.floor(n / e)), count: d, slotW: e };
}
function Yl(t, l, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, a = -1 / 0, c = 0;
  const u = Math.min(t.length, l + e);
  for (let d = l; d < u; d++) {
    const s = t[d];
    s && (s.low < n && (n = s.low), s.high > a && (a = s.high), s.volume > c && (c = s.volume));
  }
  if (!isFinite(n) || !isFinite(a) || n === a) {
    const d = isFinite(n) ? n : 0;
    return { min: d - 1, max: d + 1, maxVol: Math.max(1, c) };
  }
  const v = (a - n) * 0.04;
  return { min: n - v, max: a + v, maxVol: Math.max(1, c) };
}
function Hl(t, l, e = !1) {
  const n = e ? Fl : mt, a = Math.max(1, t - Ge - n - ct), c = Math.max(0, Math.round(a * l)), u = a - c;
  return {
    priceY0: Ge,
    priceY1: Ge + u,
    volumeY0: Ge + u + ct,
    volumeY1: Ge + u + ct + c
  };
}
function Ce(t, l, e, n) {
  const a = l.max - l.min;
  return a <= 0 ? (e + n) / 2 : e + (1 - (t - l.min) / a) * (n - e);
}
function Fe(t, l, e) {
  return De + (t - l + 0.5) * e;
}
function ze(t) {
  const l = Math.abs(t), e = l >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : l >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : l >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : l >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function ht(t) {
  const l = new Date(t), e = String(l.getMonth() + 1).padStart(2, "0"), n = String(l.getDate()).padStart(2, "0"), a = String(l.getHours()).padStart(2, "0"), c = String(l.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${a}:${c}`;
}
function Pl(t, l) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, l), n = Math.pow(10, Math.floor(Math.log10(e))), a = e / n;
  let c;
  return a < 1.5 ? c = 1 : a < 3 ? c = 2 : a < 7 ? c = 5 : c = 10, c * n;
}
function Rt(t, l) {
  var S, g, m, f, h;
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, c = Qe[l.theme] ?? Qe.none, u = l.colors ? { ...c, ...l.colors } : c, v = !!l.compact;
  if (e.clearRect(0, 0, n, a), e.fillStyle = u.bg, e.fillRect(0, 0, n, a), !l.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const d = Wl(l.candles.length, n, l.slotW, l.scrollX, v), s = Yl(l.candles, d.firstIdx, d.count), r = Hl(a, l.showVolume ? l.volumeFraction : 0, v), b = Math.max(zl, Math.floor(l.slotW * 0.7)), y = Math.min(l.candles.length, d.firstIdx + d.count);
  for (let p = d.firstIdx; p < y; p++) {
    const M = l.candles[p];
    if (!M) continue;
    const R = Fe(p, d.firstIdx, l.slotW), T = Ce(M.open, s, r.priceY0, r.priceY1), C = Ce(M.close, s, r.priceY0, r.priceY1), x = Ce(M.high, s, r.priceY0, r.priceY1), F = Ce(M.low, s, r.priceY0, r.priceY1), W = M.close >= M.open, V = W ? u.wickBull : u.wickBear, G = W ? u.candleBull : u.candleBear;
    l.glow && (e.shadowBlur = 4, e.shadowColor = G), e.strokeStyle = V, e.lineWidth = Al, e.beginPath(), e.moveTo(Math.round(R) + 0.5, x), e.lineTo(Math.round(R) + 0.5, F), e.stroke(), e.fillStyle = G;
    const K = Math.min(T, C), de = Math.max(1, Math.abs(C - T));
    if (e.fillRect(
      Math.round(R - b / 2),
      Math.round(K),
      b,
      Math.round(de)
    ), e.shadowBlur = 0, l.showVolume && s.maxVol > 0) {
      const X = Math.round(M.volume / s.maxVol * (r.volumeY1 - r.volumeY0));
      X > 0 && (e.fillStyle = W ? u.volumeBull : u.volumeBear, e.fillRect(
        Math.round(R - b / 2),
        r.volumeY1 - X,
        b,
        X
      ));
    }
  }
  if ((S = l.overlays) != null && S.length)
    for (const p of l.overlays) $l(e, p, d, s, r, l.slotW);
  (g = l.markers) != null && g.length && ql(e, u, l.markers, l.candles, d, s, r, l.slotW), jl(e, u, s, r, n, v), v || (Zl(e, u, l.candles, d, l.slotW, a), Ul(e, u, l.candles, n, a)), (m = l.overlays) != null && m.length && Vl(e, u, l.overlays, r), l.hover && (Jl(e, u, l.candles, d, s, r, l.slotW, l.hover, n), Xl(e, u, l.candles, d, l.slotW, l.hover, r, ((f = l.overlays) == null ? void 0 : f.length) ?? 0), (h = l.markers) != null && h.length && Gl(e, u, l.markers, l.candles, d, s, r, l.slotW, l.hover, n)), e.restore();
}
function $l(t, l, e, n, a, c) {
  var v;
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
    const d = Yt(l.color, l.fillAlpha ?? 0.08);
    Ol(t, l.upper, l.lower, e.firstIdx, u, c, n, a, d), je(t, l.upper, e.firstIdx, u, c, n, a, l.color, 1, !1), je(t, l.lower, e.firstIdx, u, c, n, a, l.color, 1, !1), (v = l.middle) != null && v.length && je(t, l.middle, e.firstIdx, u, c, n, a, l.color, 1, l.middleDashed !== !1);
  }
  t.restore();
}
function je(t, l, e, n, a, c, u, v, d, s) {
  if (!l || !l.length) return;
  t.strokeStyle = v, t.lineWidth = d, t.setLineDash(s ? [4, 3] : []), t.beginPath();
  let r = !1;
  for (let b = e; b < n; b++) {
    const y = l[b];
    if (typeof y != "number" || !isFinite(y)) {
      r && (t.stroke(), t.beginPath(), r = !1);
      continue;
    }
    const S = Fe(b, e, a), g = Ce(y, c, u.priceY0, u.priceY1);
    r ? t.lineTo(S, g) : (t.moveTo(S, g), r = !0);
  }
  r && t.stroke(), t.setLineDash([]);
}
function Ol(t, l, e, n, a, c, u, v, d) {
  if (!(l != null && l.length) || !(e != null && e.length)) return;
  t.fillStyle = d;
  let s = !1, r = -1;
  for (let b = n; b <= a; b++) {
    const y = l[b], S = e[b], g = b < a && typeof y == "number" && typeof S == "number" && isFinite(y) && isFinite(S);
    if (g && !s && (r = b, s = !0), !g && s || b === a && s) {
      const m = g ? b + 1 : b;
      t.beginPath();
      for (let f = r; f < m; f++) {
        const h = Fe(f, n, c), p = Ce(l[f], u, v.priceY0, v.priceY1);
        f === r ? t.moveTo(h, p) : t.lineTo(h, p);
      }
      for (let f = m - 1; f >= r; f--) {
        const h = Fe(f, n, c), p = Ce(e[f], u, v.priceY0, v.priceY1);
        t.lineTo(h, p);
      }
      t.closePath(), t.fill(), s = !1;
    }
  }
}
function Yt(t, l) {
  const e = Math.max(0, Math.min(1, l));
  if (t.startsWith("#") && t.length === 7) {
    const n = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), c = parseInt(t.slice(5, 7), 16);
    return `rgba(${n},${a},${c},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Vl(t, l, e, n) {
  const a = e.filter((m) => !!m.label);
  if (!a.length) return;
  t.save(), t.font = _e;
  const c = 8, u = 5, v = 12, d = 6, s = 14;
  let r = 0;
  for (const m of a) {
    const f = t.measureText(m.label).width;
    f > r && (r = f);
  }
  const b = c * 2 + v + d + r, y = u * 2 + s * a.length, S = De + 4, g = n.priceY0 + 4;
  t.fillStyle = l.panelBg, t.fillRect(S, g, b, y), t.textBaseline = "middle", t.textAlign = "left";
  for (let m = 0; m < a.length; m++) {
    const f = a[m], h = g + u + s * (m + 0.5), p = S + c;
    f.kind === "line" ? (t.strokeStyle = f.color, t.lineWidth = f.lineWidth ?? 1, t.setLineDash(f.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(p, h), t.lineTo(p + v, h), t.stroke(), t.setLineDash([])) : (t.fillStyle = Yt(f.color, f.fillAlpha ?? 0.2), t.fillRect(p, h - 4, v, 8), t.strokeStyle = f.color, t.lineWidth = 1, t.strokeRect(p + 0.5, h - 4 + 0.5, v - 1, 7)), t.fillStyle = l.text, t.fillText(f.label, p + v + d, h);
  }
  t.restore();
}
function Xl(t, l, e, n, a, c, u, v) {
  const d = Math.floor((c.x - De) / a), s = n.firstIdx + d;
  if (s < 0 || s >= e.length) return;
  const r = e[s];
  if (!r) return;
  const b = r.close - r.open, y = r.open !== 0 ? b / r.open * 100 : 0, S = b >= 0 ? "+" : "", g = [
    ["O", ze(r.open), void 0],
    ["H", ze(r.high), void 0],
    ["L", ze(r.low), void 0],
    ["C", ze(r.close), void 0],
    ["V", Nl(r.volume), void 0],
    ["", `${S}${y.toFixed(2)}%`, b >= 0 ? l.candleBull : l.candleBear]
  ];
  t.save(), t.font = _e, t.textBaseline = "middle", t.textAlign = "left";
  const m = 8, f = 4, h = 14;
  let p = m;
  for (const [C, x] of g) {
    const F = C ? `${C} ${x}` : x, W = t.measureText(F).width + 12;
    p += W;
  }
  p += m - 12;
  const M = u.priceY0 + 4 + (v > 0 ? f * 2 + 14 * v + 4 : 0), R = De + 4;
  t.fillStyle = l.panelBg, t.fillRect(R, M, p, h + f * 2);
  let T = R + m;
  for (let C = 0; C < g.length; C++) {
    const [x, F, W] = g[C];
    t.fillStyle = l.text, x && (t.globalAlpha = 0.6, t.fillText(x + " ", T, M + f + h / 2), t.globalAlpha = 1, T += t.measureText(x + " ").width), W && (t.fillStyle = W), t.fillText(F, T, M + f + h / 2), T += t.measureText(F).width + 12;
  }
  t.restore();
}
function Nl(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function Gl(t, l, e, n, a, c, u, v, d, s) {
  if (!n.length) return;
  const r = n.length > 1 ? n[1].start - n[0].start : 6e4, b = Math.max(1, r * 0.5), y = Math.min(n.length, a.firstIdx + a.count), S = 9;
  let g = null;
  for (const F of e) {
    let W = 0, V = n.length - 1, G = -1;
    for (; W <= V; ) {
      const X = W + V >> 1, oe = n[X].start - F.timestamp;
      if (Math.abs(oe) <= b) {
        G = X;
        break;
      }
      oe < 0 ? W = X + 1 : V = X - 1;
    }
    if (G < 0 || G < a.firstIdx || G >= y) continue;
    const K = Fe(G, a.firstIdx, v), de = Ce(F.price, c, u.priceY0, u.priceY1);
    if (Math.abs(d.x - K) <= S && Math.abs(d.y - de) <= S) {
      g = { m: F, x: K, y: de };
      break;
    }
  }
  if (!g) return;
  const m = ht(g.m.timestamp), f = [
    `${g.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${m}`,
    `@ ${ze(g.m.price)}`
  ];
  g.m.label && f.push(g.m.label), t.save(), t.font = _e, t.textBaseline = "top", t.textAlign = "left";
  const h = 6, p = 14;
  let M = 0;
  for (const F of f) {
    const W = t.measureText(F).width;
    W > M && (M = W);
  }
  const R = M + h * 2, T = f.length * p + h * 2;
  let C = g.x + 12;
  C + R > s - Ae && (C = g.x - 12 - R);
  let x = g.y - T / 2;
  x < u.priceY0 && (x = u.priceY0), x + T > u.priceY1 && (x = u.priceY1 - T), t.fillStyle = l.panelBgSolid, t.strokeStyle = g.m.kind === "entry" ? l.markerEntry : l.markerExit, t.lineWidth = 1, t.fillRect(C, x, R, T), t.strokeRect(C + 0.5, x + 0.5, R - 1, T - 1);
  for (let F = 0; F < f.length; F++) {
    const W = f[F];
    t.fillStyle = F === 0 ? g.m.kind === "entry" ? l.markerEntry : l.markerExit : l.text, t.fillText(W, C + h, x + h + F * p);
  }
  t.restore();
}
function Ul(t, l, e, n, a) {
  if (e.length < 2) return;
  const c = e[1].start - e[0].start, u = Kl(c);
  if (!u) return;
  t.save(), t.font = _e, t.textBaseline = "top", t.textAlign = "right";
  const v = 6, d = 3, s = t.measureText(u).width, r = n - Ae - v, b = a - mt + 4;
  t.fillStyle = l.accent, t.fillRect(r - s - v, b - d, s + v * 2, 14 + d * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(u, r, b), t.restore();
}
function Kl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const l = 1e3, e = 60 * l, n = 60 * e, a = 24 * n, c = 7 * a;
  return t >= c && t % c === 0 ? t / c + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= n && t % n === 0 ? t / n + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= l && t % l === 0 ? t / l + "s" : Math.round(t / e) + "m";
}
function ql(t, l, e, n, a, c, u, v) {
  if (!n.length) return;
  const d = n.length > 1 ? n[1].start - n[0].start : 6e4, s = Math.max(1, d * 0.5), r = Math.min(n.length, a.firstIdx + a.count), b = (S) => {
    let g = 0, m = n.length - 1;
    for (; g <= m; ) {
      const f = g + m >> 1, h = n[f].start - S;
      if (Math.abs(h) <= s) return f;
      h < 0 ? g = f + 1 : m = f - 1;
    }
    return -1;
  }, y = 7;
  for (const S of e) {
    const g = b(S.timestamp);
    if (g < 0 || g < a.firstIdx || g >= r) continue;
    const m = Fe(g, a.firstIdx, v), f = Ce(S.price, c, u.priceY0, u.priceY1);
    if (f < u.priceY0 || f > u.priceY1) continue;
    const h = S.color ?? (S.kind === "entry" ? l.markerEntry : l.markerExit);
    t.fillStyle = h, t.strokeStyle = l.panelBgSolid, t.lineWidth = 1, t.beginPath(), S.kind === "entry" ? (t.moveTo(m, f - y), t.lineTo(m - y, f + y - 1), t.lineTo(m + y, f + y - 1)) : (t.moveTo(m, f + y), t.lineTo(m - y, f - y + 1), t.lineTo(m + y, f - y + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function jl(t, l, e, n, a, c = !1) {
  const u = e.max - e.min;
  if (u <= 0) return;
  const v = n.priceY1 - n.priceY0, d = c ? Math.max(2, Math.min(4, Math.round(v / 36))) : 6, s = Pl(u, d), r = Math.ceil(e.min / s) * s, b = c ? Wt : Ae;
  t.font = c ? Bl : _e, t.fillStyle = l.text, t.strokeStyle = l.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let y = r; y <= e.max; y += s) {
    const S = Ce(y, e, n.priceY0, n.priceY1);
    S < n.priceY0 || S > n.priceY1 || (t.beginPath(), t.moveTo(De, Math.round(S) + 0.5), t.lineTo(a - b, Math.round(S) + 0.5), t.stroke(), t.fillText(ze(y), a - b + 3, S));
  }
  t.globalAlpha = 1;
}
function Zl(t, l, e, n, a, c) {
  if (n.count <= 0 || !e.length) return;
  const v = Math.max(1, Math.floor(n.count / 6));
  t.font = _e, t.fillStyle = l.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const d = Math.min(e.length, n.firstIdx + n.count);
  for (let s = n.firstIdx; s < d; s += v) {
    const r = e[s];
    if (!r) continue;
    const b = Fe(s, n.firstIdx, a);
    t.fillText(ht(r.start), b, c - mt + 4);
  }
  t.globalAlpha = 1;
}
function Jl(t, l, e, n, a, c, u, v, d) {
  const s = Math.floor((v.x - De) / u), r = Math.max(0, Math.min(e.length - 1, n.firstIdx + s)), b = e[r];
  if (!b) return;
  const y = Fe(r, n.firstIdx, u);
  t.save(), t.strokeStyle = l.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(y) + 0.5, c.priceY0), t.lineTo(Math.round(y) + 0.5, c.volumeY1 || c.priceY1), t.stroke();
  const S = Math.max(c.priceY0, Math.min(c.priceY1, v.y));
  t.beginPath(), t.moveTo(De, Math.round(S) + 0.5), t.lineTo(d - Ae, Math.round(S) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const g = a.max - a.min;
  if (g > 0) {
    const h = a.max - (S - c.priceY0) / (c.priceY1 - c.priceY0) * g, p = ze(h);
    t.font = _e, t.textBaseline = "middle", t.textAlign = "left";
    const M = t.measureText(p).width, R = 4, T = 2;
    t.fillStyle = l.accent, t.fillRect(d - Ae + 2, S - 7 - T, M + R * 2, 14 + T * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(p, d - Ae + 2 + R, S);
  }
  t.font = _e, t.textBaseline = "top", t.textAlign = "center";
  const m = ht(b.start), f = t.measureText(m).width;
  t.fillStyle = l.accent, t.fillRect(y - f / 2 - 4, c.volumeY1 + 2, f + 8, 14), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(m, y, c.volumeY1 + 4), t.restore();
}
const _t = 0.25, Ft = 6, Ql = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, en = `
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
`, tn = /* @__PURE__ */ Ue({
  __name: "CathodeCandle",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: _l },
    slotW: { default: 8 },
    overlays: {},
    markers: {},
    flat: { type: Boolean, default: !1 },
    compact: { type: Boolean, default: !1 },
    colors: {}
  },
  setup(t) {
    const l = t, e = A(null), n = A(null), a = A(0), c = A(0), u = A(0), v = A(1), d = A(null), s = U(() => Math.max(1, l.slotW * v.value));
    let r = null, b = !1, y, S, g, m, f;
    function h() {
      if (!(!n.value || !e.value)) {
        if (f = document.createElement("canvas"), l.flat) {
          b = !0, p();
          return;
        }
        try {
          r = new O.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0 });
        } catch {
          b = !0;
        }
        if (!b && !r.getContext() && (r.dispose(), r = null, b = !0), b) {
          p();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), y = new O.Scene(), S = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new O.CanvasTexture(f), m.minFilter = O.LinearFilter, m.magFilter = O.LinearFilter, g = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Ql,
          fragmentShader: en,
          transparent: !0
        }), y.add(new O.Mesh(new O.PlaneGeometry(2, 2), g)), p();
      }
    }
    function p() {
      if (!e.value || !r && !b) return;
      const D = e.value.clientWidth, B = e.value.clientHeight;
      !D || !B || !(f.width !== D || f.height !== B) || (f.width = D, f.height = B, a.value = D, c.value = B, r ? (m && (m.dispose(), m = new O.CanvasTexture(f), m.minFilter = O.LinearFilter, m.magFilter = O.LinearFilter, g && (g.uniforms.uTex.value = m)), r.setPixelRatio(window.devicePixelRatio || 1), r.setSize(D, B)) : n.value && (n.value.width = D, n.value.height = B, n.value.style.width = D + "px", n.value.style.height = B + "px"), M());
    }
    function M() {
      if (!(f != null && f.width)) return;
      if (b) {
        if (!n.value) return;
        Rt(f, {
          candles: l.candles,
          slotW: s.value,
          scrollX: u.value,
          theme: l.theme,
          glow: !1,
          showVolume: l.showVolume,
          volumeFraction: l.volumeFraction,
          hover: d.value,
          overlays: l.overlays,
          markers: l.markers,
          compact: l.compact,
          colors: l.colors
        });
        const B = n.value.getContext("2d");
        B && (B.clearRect(0, 0, n.value.width, n.value.height), B.drawImage(f, 0, 0));
        return;
      }
      if (!r || !g || !m) return;
      const D = l.theme === "paper";
      g.uniforms.uStrength.value = l.curvature / 45 * 0.55, g.uniforms.uScanlines.value = l.scanlines && !D ? 1 : 0, g.uniforms.uVignette.value = D ? 0 : 1, Rt(f, {
        candles: l.candles,
        slotW: s.value,
        scrollX: u.value,
        theme: l.theme,
        glow: l.glow,
        showVolume: l.showVolume,
        volumeFraction: l.volumeFraction,
        hover: d.value,
        overlays: l.overlays,
        markers: l.markers,
        compact: l.compact,
        colors: l.colors
      }), m.needsUpdate = !0, r.render(y, S);
    }
    $(() => l.theme, () => M()), $(() => l.curvature, () => M()), $(() => l.scanlines, () => M()), $(() => l.glow, () => M()), $(() => l.showVolume, () => M()), $(() => l.volumeFraction, () => M()), $(() => l.slotW, () => M()), $(() => l.candles, () => M(), { deep: !1 }), $(() => l.overlays, () => M(), { deep: !1 }), $(() => l.markers, () => M(), { deep: !1 }), $(() => l.compact, () => M()), $(() => l.colors, () => M(), { deep: !0 }), $(() => l.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), $(u, () => M()), $(v, () => M()), $(d, () => M()), $(s, () => M());
    let R = null, T = null, C = 0;
    const x = lt("cathodeResetTick", A(0));
    $(x, () => F());
    function F() {
      cancelAnimationFrame(C), C = requestAnimationFrame(p);
    }
    function W(D) {
      D.preventDefault();
    }
    function V() {
      r == null || r.dispose(), r = null, b = !1, h();
    }
    function G(D) {
      if (!n.value) return [-1, -1];
      const B = n.value.getBoundingClientRect();
      return [D.clientX - B.left, D.clientY - B.top];
    }
    function K(D) {
      var be;
      const B = s.value;
      if (B <= 0) return 0;
      const P = ((be = l.candles) == null ? void 0 : be.length) ?? 0, ve = Math.max(1, Math.floor((a.value || 1) / B)), ce = Math.max(0, P - ve);
      return Math.max(0, Math.min(D, ce * B));
    }
    function de(D) {
      var ve;
      if (D.deltaX !== 0 || D.shiftKey && D.deltaY !== 0) {
        const ce = D.deltaX !== 0 ? D.deltaX : D.deltaY;
        u.value = K(u.value + ce);
        return;
      }
      if (D.deltaY === 0) return;
      const [B] = G(D), P = s.value;
      if (B >= 0 && P > 0 && ((ve = l.candles) != null && ve.length)) {
        const ce = Math.max(1, Math.floor((a.value || 1) / P)), Ee = Math.max(0, l.candles.length - ce - Math.floor(u.value / P)) + (B - 8) / P, E = Math.exp(-D.deltaY * 15e-4), Y = Math.max(_t, Math.min(Ft, v.value * E));
        v.value = Y;
        const Q = l.slotW * Y, xe = Math.max(1, Math.floor((a.value || 1) / Q)), me = Ee - (B - 8) / Q, Z = Math.max(0, l.candles.length - xe - me);
        u.value = K(Z * Q);
      } else {
        const ce = Math.exp(-D.deltaY * 15e-4);
        v.value = Math.max(_t, Math.min(Ft, v.value * ce));
      }
    }
    let X = !1, oe = 0, we = 0;
    function q(D) {
      D.button === 0 && (X = !0, oe = D.clientX, we = u.value, d.value = null);
    }
    function Te(D) {
      if (X) {
        const B = D.clientX - oe;
        u.value = K(we + B);
        return;
      }
    }
    function ke() {
      X = !1;
    }
    function _(D) {
      if (X) return;
      const [B, P] = G(D);
      if (B < 0 || P < 0) {
        d.value = null;
        return;
      }
      d.value = { x: B, y: P };
    }
    function H() {
      d.value = null;
    }
    Ve(() => {
      document.addEventListener("mousemove", Te), document.addEventListener("mouseup", ke), Le(() => {
        var D;
        h(), n.value && (n.value.addEventListener("webglcontextlost", W), n.value.addEventListener("webglcontextrestored", V)), e.value && (R = new ResizeObserver(() => p()), R.observe(e.value), T = new IntersectionObserver((B) => {
          B.some((P) => P.isIntersecting) && F();
        }), T.observe(e.value)), window.addEventListener("resize", F), (D = window.visualViewport) == null || D.addEventListener("resize", F);
      });
    }), Ke(() => {
      var D, B, P;
      document.removeEventListener("mousemove", Te), document.removeEventListener("mouseup", ke), (D = n.value) == null || D.removeEventListener("webglcontextlost", W), (B = n.value) == null || B.removeEventListener("webglcontextrestored", V), R == null || R.disconnect(), T == null || T.disconnect(), window.removeEventListener("resize", F), (P = window.visualViewport) == null || P.removeEventListener("resize", F), cancelAnimationFrame(C), r == null || r.dispose();
    });
    const j = U(() => Qe[l.theme] ?? Qe.none), ee = U(() => ({
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
        onWheel: Re(de, ["prevent"]),
        onMousedown: q,
        onMousemove: _,
        onMouseleave: H
      }, null, 544)
    ], 4));
  }
}), In = /* @__PURE__ */ qe(tn, [["__scopeId", "data-v-4673e639"]]), gt = A(0), ft = 28, Pe = 12;
let dt = 10, et = "cathode.layout", tt = !1;
const ie = A({});
function ln(t, l = "cathode.layout") {
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
function We() {
  localStorage.setItem(et, JSON.stringify(ie.value));
}
function nn(t) {
  tt = !1, localStorage.removeItem(et), ie.value = { ...t }, We(), tt = !0, gt.value++;
}
function Ht(t) {
  dt++, ie.value[t] && (ie.value[t].zIndex = dt);
}
function on(t, l) {
  ie.value[t].visible = l, We();
}
function an(t, l) {
  ie.value[t].minimized = l, l && (ie.value[t].maximized = !1), We();
}
function rn(t, l) {
  ie.value[t].maximized = l, l && (ie.value[t].minimized = !1, Ht(t)), We();
}
function sn(t, l, e) {
  ie.value[t].x = Math.round(l), ie.value[t].y = Math.round(e), We();
}
function cn(t, l, e) {
  ie.value[t].w = Math.round(l), ie.value[t].h = Math.round(e), We();
}
function Ln(t, l, e) {
  const n = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / n), c = Math.floor((t - Pe * (n + 1)) / n), u = Math.floor((l - Pe * (a + 1)) / a), v = {};
  return e.forEach((d, s) => {
    const r = s % n, b = Math.floor(s / n);
    v[d] = {
      x: Pe + r * (c + Pe),
      y: Pe + b * (u + Pe),
      w: c,
      h: u,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: s + 1
    };
  }), v;
}
function Pt() {
  return {
    containers: ie,
    TITLEBAR_H: ft,
    load: ln,
    save: We,
    reset: nn,
    bringToFront: Ht,
    setVisible: on,
    setMinimized: an,
    setMaximized: rn,
    updatePos: sn,
    updateSize: cn
  };
}
const un = { class: "ws-toolbar" }, fn = {
  key: 0,
  class: "ws-restore-menu"
}, dn = {
  key: 0,
  class: "ws-restore-empty"
}, vn = ["onClick"], mn = /* @__PURE__ */ Ue({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const l = t, { containers: e, load: n, reset: a, setVisible: c } = Pt(), u = A(null);
    Tt("cathodeWorkspace", u), Tt("cathodeResetTick", gt), Ve(() => {
      if (!u.value) return;
      const { clientWidth: f, clientHeight: h } = u.value, p = l.initialLayout ?? {};
      n(p, l.storageKey ?? "cathode.layout");
      const M = Object.keys(e.value)[0];
      M && v(M);
    });
    function v(f) {
      var p;
      document.querySelectorAll(".cc").forEach((M) => M.classList.remove("cc-focused"));
      const h = (p = u.value) == null ? void 0 : p.querySelector(`#cc-${f}`);
      h && h.classList.add("cc-focused");
    }
    function d() {
      !u.value || !l.initialLayout || a(l.initialLayout);
    }
    function s(f) {
      const h = f.target.closest(".cc");
      h && (document.querySelectorAll(".cc").forEach((p) => p.classList.remove("cc-focused")), h.classList.add("cc-focused"));
    }
    const r = A(!1), b = () => Object.entries(e.value).filter(([, f]) => !f.visible).map(([f]) => f);
    function y(f) {
      c(f, !0), r.value = !1;
    }
    function S(f) {
      if (!r.value) return;
      const h = f.target;
      !h.closest(".ws-restore-menu") && !h.closest(".ws-btn-restore") && (r.value = !1);
    }
    function g(f) {
      f.key === "Escape" && (r.value = !1);
    }
    Ve(() => {
      document.addEventListener("click", S), document.addEventListener("keydown", g);
    }), Ke(() => {
      document.removeEventListener("click", S), document.removeEventListener("keydown", g);
    });
    function m(f) {
      var h;
      return ((h = l.containerTitles) == null ? void 0 : h[f]) ?? f;
    }
    return (f, h) => (re(), se("div", {
      ref_key: "workspaceEl",
      ref: u,
      class: "cathode-workspace",
      onMousedown: s
    }, [
      ut(f.$slots, "default", {}, void 0, !0),
      ut(f.$slots, "overlay", {}, void 0, !0),
      J("div", un, [
        t.initialLayout ? (re(), se("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: d
        }, " ↺ Reset Layout ")) : Se("", !0),
        h[1] || (h[1] = J("div", { class: "ws-sep" }, null, -1)),
        J("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: h[0] || (h[0] = (p) => r.value = !r.value)
        }, " ⊞ Restore Panel ")
      ]),
      ll(nl, { name: "menu" }, {
        default: ol(() => [
          r.value ? (re(), se("div", fn, [
            h[3] || (h[3] = J("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            b().length ? Se("", !0) : (re(), se("div", dn, " No closed panels ")),
            (re(!0), se(al, null, il(b(), (p) => (re(), se("div", {
              key: p,
              class: "ws-restore-item",
              onClick: (M) => y(p)
            }, [
              h[2] || (h[2] = J("span", { class: "ws-restore-icon" }, "⊞", -1)),
              rl(" " + Me(m(p)), 1)
            ], 8, vn))), 128))
          ])) : Se("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Dn = /* @__PURE__ */ qe(mn, [["__scopeId", "data-v-5838d04b"]]), hn = ["id"], gn = { class: "cc-title" }, pn = {
  key: 0,
  class: "cc-size-badge"
}, wn = { class: "cc-controls" }, bn = ["title"], xn = { class: "cc-body" }, yn = 200, Mn = 80, zt = 60, Sn = /* @__PURE__ */ Ue({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const l = t, { containers: e, bringToFront: n, setVisible: a, setMinimized: c, setMaximized: u, updatePos: v, updateSize: d } = Pt(), s = lt("cathodeWorkspace", A(null)), r = U(() => e.value[l.id]), b = U(() => {
      const _ = r.value, H = l.curvature ?? 0;
      if (!_) return {};
      const j = { "--curvature": H };
      return _.maximized ? { ...j, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: _.zIndex } : {
        ...j,
        left: _.x + "px",
        top: _.y + "px",
        width: _.w + "px",
        height: _.minimized ? ft + "px" : _.h + "px",
        zIndex: _.zIndex,
        display: _.visible ? "flex" : "none"
      };
    });
    let y = !1, S = 0, g = 0;
    function m(_) {
      var ee;
      if (_.target.closest(".cc-btn") || r.value.maximized) return;
      n(l.id), y = !0;
      const H = (ee = s.value) == null ? void 0 : ee.querySelector(`#cc-${l.id}`);
      if (!H) return;
      const j = H.getBoundingClientRect();
      S = _.clientX - j.left, g = _.clientY - j.top, document.addEventListener("mousemove", f), document.addEventListener("mouseup", h), _.preventDefault();
    }
    function f(_) {
      var B;
      if (!y || !s.value) return;
      const H = s.value.getBoundingClientRect(), j = ((B = r.value) == null ? void 0 : B.w) ?? 300;
      let ee = _.clientX - H.left - S, D = _.clientY - H.top - g;
      ee = Math.max(zt - j, Math.min(H.width - zt, ee)), D = Math.max(0, Math.min(H.height - ft, D)), v(l.id, ee, D);
    }
    function h() {
      y = !1, document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", h);
    }
    let p = !1, M = 0, R = 0, T = 0, C = 0;
    const x = A("");
    function F(_) {
      r.value.maximized || (n(l.id), p = !0, M = _.clientX, R = _.clientY, T = r.value.w, C = r.value.h, document.addEventListener("mousemove", W), document.addEventListener("mouseup", V), _.preventDefault(), _.stopPropagation());
    }
    function W(_) {
      if (!p) return;
      const H = Math.max(yn, T + (_.clientX - M)), j = Math.max(Mn, C + (_.clientY - R));
      d(l.id, H, j), x.value = `${Math.round(H)}×${Math.round(j)}`;
    }
    function V() {
      p = !1, x.value = "", document.removeEventListener("mousemove", W), document.removeEventListener("mouseup", V), G.value++;
    }
    const G = A(0);
    $(gt, () => {
      G.value++;
    }), Ke(() => {
      var _;
      document.removeEventListener("mousemove", f), document.removeEventListener("mouseup", h), document.removeEventListener("mousemove", W), document.removeEventListener("mouseup", V), (_ = K.value) == null || _.removeEventListener("scroll", X), oe();
    });
    const K = A(null);
    function de(_) {
      if (l.canvas) return [];
      const H = _.children[0];
      return H ? Array.from(H.children) : [];
    }
    function X() {
      const _ = K.value, H = l.curvature ?? 0;
      if (!_) return;
      const j = de(_);
      if (!j.length) return;
      const ee = _.clientHeight, D = ee / 2, B = H * 38e-4;
      j.forEach((P) => {
        if (!P.dataset.origFs) {
          const me = getComputedStyle(P);
          P.dataset.origFs = me.fontSize, P.dataset.origLh = me.lineHeight;
        }
        if (H === 0) {
          P.style.fontSize = "", P.style.lineHeight = "";
          return;
        }
        const ve = P.getBoundingClientRect(), ce = _.getBoundingClientRect(), be = ve.top - ce.top + ve.height / 2, Ee = Math.min(1, Math.abs(be - D) / (ee / 2)), E = 1 + B * Math.cos(Ee * Math.PI / 2), Y = parseFloat(P.dataset.origFs), Q = P.dataset.origLh, xe = Q === "normal" ? Y * 1.4 : parseFloat(Q);
        isNaN(Y) || (P.style.fontSize = `${(Y * E).toFixed(2)}px`), isNaN(xe) || (P.style.lineHeight = `${(xe * E).toFixed(2)}px`);
      });
    }
    function oe() {
      const _ = K.value;
      _ && de(_).forEach((H) => {
        H.style.fontSize = "", H.style.lineHeight = "", delete H.dataset.origFs, delete H.dataset.origLh;
      });
    }
    $(() => l.curvature, (_) => {
      (_ ?? 0) === 0 ? oe() : X();
    }), Ve(() => {
      var _;
      (_ = K.value) == null || _.addEventListener("scroll", X, { passive: !0 }), Le(X);
    });
    function we() {
      c(l.id, !r.value.minimized), Le(() => {
        G.value++;
      });
    }
    function q() {
      u(l.id, !r.value.maximized), Le(() => {
        G.value++;
      });
    }
    function Te() {
      a(l.id, !1);
    }
    function ke() {
      n(l.id);
    }
    return (_, H) => r.value && r.value.visible ? (re(), se("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: sl(["cc", { "cc-minimized": r.value.minimized, "cc-maximized": r.value.maximized, "cc-has-canvas": t.canvas }]),
      style: ye(b.value),
      onMousedown: ke
    }, [
      J("div", {
        class: "cc-titlebar",
        onMousedown: m
      }, [
        H[0] || (H[0] = J("span", { class: "cc-status-dot" }, null, -1)),
        J("span", gn, Me(t.title), 1),
        x.value ? (re(), se("span", pn, Me(x.value), 1)) : Se("", !0),
        J("div", wn, [
          J("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Re(we, ["stop"])
          }, "─"),
          J("button", {
            class: "cc-btn cc-btn-max",
            title: r.value.maximized ? "Restore" : "Maximize",
            onClick: Re(q, ["stop"])
          }, Me(r.value.maximized ? "⤡" : "⤢"), 9, bn),
          J("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Re(Te, ["stop"])
          }, "✕")
        ])
      ], 32),
      cl(J("div", xn, [
        J("div", {
          ref_key: "bodyEl",
          ref: K,
          class: "cc-screen",
          onScroll: X
        }, [
          ut(_.$slots, "default", { resizeKey: G.value }, void 0, !0),
          H[1] || (H[1] = J("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [ul, !r.value.minimized]
      ]),
      !r.value.minimized && !r.value.maximized ? (re(), se("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Re(F, ["stop"])
      }, null, 32)) : Se("", !0)
    ], 46, hn)) : Se("", !0);
  }
}), En = /* @__PURE__ */ qe(Sn, [["__scopeId", "data-v-d8a49f79"]]);
export {
  Qe as CANDLE_THEME_COLORS,
  In as CathodeCandle,
  En as CathodeContainer,
  Tn as CathodeGrid,
  kn as CathodeLog,
  Dn as CathodeWorkspace,
  Je as LOG_THEME_COLORS,
  Ln as buildDefaultLayout,
  Pt as useCathodeLayout
};
