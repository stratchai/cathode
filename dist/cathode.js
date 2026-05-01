import { defineComponent as Xe, ref as _, reactive as rt, computed as q, watch as H, inject as lt, nextTick as Ce, onMounted as We, onUnmounted as Ne, openBlock as re, createElementBlock as se, normalizeStyle as ye, createElementVNode as Z, withModifiers as Re, withKeys as nl, createCommentVNode as Se, toDisplayString as Me, createVNode as zt, withDirectives as Wt, vModelText as ol, provide as Ct, renderSlot as ct, Transition as al, withCtx as il, Fragment as rl, renderList as sl, createTextVNode as ul, normalizeClass as cl, vShow as fl } from "vue";
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
}, oe = 30, kt = 12, dl = 10;
function It(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, f = Oe[l.theme] ?? Oe.none, { cols: u, rows: d, pinnedRows: c, rowHeight: s, scrollY: i, scrollX: x, glow: M } = l;
  e.clearRect(0, 0, n, a), e.fillStyle = f.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const S = c.length * s, h = a - oe - S;
  e.fillStyle = f.headerBg, e.fillRect(0, 0, n, oe), e.textBaseline = "middle", e.textAlign = "left";
  let m = -x;
  for (let p = 0; p < u.length; p++) {
    const T = u[p];
    if (m + T.width <= 0) {
      m += T.width;
      continue;
    }
    if (m >= n) break;
    const R = !!l.colFilters[T.colId], w = l.sortColId === T.colId, C = (T.colDef.headerName ?? T.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(m, 0, T.width, oe), e.clip(), e.font = `bold ${dl}px system-ui, -apple-system, sans-serif`, e.fillStyle = R ? f.accent : f.textHeader, M ? (e.shadowColor = f.textHeader, e.shadowBlur = 10, e.fillText(C, m + 8, oe / 2), e.shadowBlur = 4, e.fillText(C, m + 8, oe / 2), e.shadowBlur = 0) : e.fillText(C, m + 8, oe / 2), w) {
      const b = e.measureText(C).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = f.accent, e.fillText(l.sortDir === "asc" ? "▲" : "▼", m + 8 + b + 4, oe / 2);
    }
    T.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = R ? f.accent : f.textHeader, e.globalAlpha = R ? 1 : 0.38, e.fillText("⌕", m + T.width - 20, oe / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = f.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(m + T.width - 0.5, 0), e.lineTo(m + T.width - 0.5, oe), e.stroke(), m += T.width;
  }
  e.strokeStyle = f.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, oe - 0.5), e.lineTo(n, oe - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, oe, n, h), e.clip();
  const v = Math.max(0, Math.floor(i / s)), g = Math.min(d.length, Math.ceil((i + h) / s));
  for (let p = v; p < g; p++) {
    const T = d[p], R = oe + p * s - i;
    p % 2 === 1 && (e.fillStyle = f.rowAlt, e.fillRect(0, R, n, s)), p === l.hoveredRow && p !== l.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, R, n, s)), p === l.selectedRow && (e.fillStyle = vl(f.accent, 0.1), e.fillRect(0, R, n, s)), e.strokeStyle = f.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, R + s - 0.5), e.lineTo(n, R + s - 0.5), e.stroke();
    let w = -x;
    for (let C = 0; C < u.length; C++) {
      const b = u[C];
      if (w + b.width <= 0) {
        w += b.width;
        continue;
      }
      if (w >= n) break;
      const F = l.getCellStyle(b, T), W = F.color ?? f.text, V = F.textAlign ?? "left", G = l.formatCell(b, T);
      e.save(), e.beginPath(), e.rect(w + 1, R, b.width - 2, s), e.clip(), e.font = `${kt}px system-ui, -apple-system, sans-serif`, e.fillStyle = W, e.textBaseline = "middle";
      const U = V === "right" ? w + b.width - 8 : w + 8;
      e.textAlign = V === "right" ? "right" : "left";
      const ae = R + s / 2;
      M ? (e.shadowColor = W, e.shadowBlur = 12, e.fillText(G, U, ae), e.shadowBlur = 6, e.fillText(G, U, ae), e.shadowBlur = 2, e.fillText(G, U, ae), e.shadowBlur = 0) : e.fillText(G, U, ae), e.restore(), p === l.selectedRow && C === l.selectedCol && (e.strokeStyle = f.accent, e.lineWidth = 2, e.strokeRect(w + 1.5, R + 1.5, b.width - 3, s - 3)), e.strokeStyle = f.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(w + b.width - 0.5, R), e.lineTo(w + b.width - 0.5, R + s), e.stroke(), w += b.width;
    }
  }
  if (e.restore(), c.length > 0) {
    const p = a - S;
    e.strokeStyle = f.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, p - 0.5), e.lineTo(n, p - 0.5), e.stroke();
    for (let T = 0; T < c.length; T++) {
      const R = c[T], w = p + T * s;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, w, n, s);
      let C = -x;
      for (let b = 0; b < u.length; b++) {
        const F = u[b];
        if (C + F.width <= 0) {
          C += F.width;
          continue;
        }
        if (C >= n) break;
        const W = l.getCellStyle(F, R), V = W.color ?? f.text, G = W.textAlign ?? "left", U = l.formatCell(F, R);
        e.save(), e.beginPath(), e.rect(C + 1, w, F.width - 2, s), e.clip(), e.font = `bold ${kt}px system-ui, -apple-system, sans-serif`, e.fillStyle = V, e.textBaseline = "middle", G === "right" ? (e.textAlign = "right", e.fillText(U, C + F.width - 8, w + s / 2)) : (e.textAlign = "left", e.fillText(U, C + 8, w + s / 2)), e.restore(), e.strokeStyle = f.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(C + F.width - 0.5, w), e.lineTo(C + F.width - 0.5, w + s), e.stroke(), C += F.width;
      }
      e.strokeStyle = f.border, e.lineWidth = 1.5, e.beginPath(), e.moveTo(0, w + s - 0.5), e.lineTo(n, w + s - 0.5), e.stroke();
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
function Dt(t, l, e, n, a, f, u, d, c) {
  const s = t + c;
  let i = -1, x = 0;
  for (let m = 0; m < e.length; m++) {
    if (s >= x && s < x + e[m].width) {
      i = m;
      break;
    }
    x += e[m].width;
  }
  if (l < oe) return { area: "header", colIdx: i, rowIdx: -1 };
  const M = d * a;
  if (M > 0 && l >= u - M) {
    const m = Math.floor((l - (u - M)) / a);
    return { area: "pinned", colIdx: i, rowIdx: m };
  }
  const S = l - oe + f, h = Math.floor(S / a);
  return h >= 0 && h < n ? { area: "body", colIdx: i, rowIdx: h } : { area: "none", colIdx: -1, rowIdx: -1 };
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
      float vign = 1.0 - dot(vc, vc) * 0.6;   // softened falloff — see CathodeLog for rationale
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`, xl = 28, yl = 600, Ml = /* @__PURE__ */ Xe({
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
    const e = t, n = l, a = _(e.rowData ?? []), f = _(e.pinnedBottomRowData ?? []), u = _(""), d = _(null), c = rt({}), s = rt({}), i = rt(/* @__PURE__ */ new Set()), x = _(0), M = _(0), S = _(0), h = _(0), m = _(0), v = _(-1), g = _(null), p = _(null), T = _({ x: 0, y: oe }), R = _("");
    function w(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const C = q(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((r) => !i.has(w(r))).map((r) => {
        const y = w(r), k = { ...o, ...r };
        return { colId: y, colDef: k, width: s[y] ?? k.width ?? 100 };
      });
    }), b = q(() => {
      const o = M.value;
      if (!o) return C.value;
      const r = C.value.reduce((I, L) => I + L.width, 0);
      if (!r || r >= o) return C.value;
      const y = o / r;
      let k = 0;
      return C.value.map((I, L) => {
        const N = L === C.value.length - 1 ? o - k : Math.max(8, Math.round(I.width * y));
        return k += N, { ...I, width: N };
      });
    }), F = q(() => {
      const o = b.value.reduce((r, y) => r + y.width, 0);
      return Math.max(0, o - M.value);
    }), W = q(() => {
      const o = f.value.length * e.rowHeight;
      return Math.max(0, S.value - oe - o);
    }), V = q(
      () => Math.max(0, K.value.length * e.rowHeight - W.value)
    ), G = q(
      () => Math.max(1, Math.floor(W.value / e.rowHeight))
    ), U = q(
      () => K.value.length === 0 ? 0 : Math.min(K.value.length - 1, Math.floor(h.value / e.rowHeight))
    ), ae = q(
      () => Math.min(K.value.length - 1, U.value + G.value - 1)
    );
    function X(o, r) {
      if (r.colDef.valueGetter) return r.colDef.valueGetter({ data: o, colDef: r.colDef });
      if (r.colDef.field) return o[r.colDef.field];
    }
    function ee(o, r) {
      const y = X(r, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: y, data: r, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: y, data: r, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : y == null ? "" : String(y);
    }
    function ve(o, r) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: X(r, o), data: r, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const K = q(() => {
      x.value;
      let o = a.value;
      const r = u.value.trim().toLowerCase();
      r && (o = o.filter(
        (y) => C.value.some(
          (k) => String(X(y, k) ?? "").toLowerCase().includes(r)
        )
      ));
      for (const [y, k] of Object.entries(c)) {
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
      if (d.value) {
        const { colId: y, dir: k } = d.value, I = C.value.find((L) => L.colId === y);
        I && (o = [...o].sort((L, z) => {
          const N = X(L, I), ne = X(z, I);
          let ie = 0;
          return I.colDef.comparator ? ie = I.colDef.comparator(N, ne) : typeof N == "number" && typeof ne == "number" ? ie = N - ne : ie = String(N ?? "").localeCompare(String(ne ?? ""), void 0, { numeric: !0 }), k === "asc" ? ie : -ie;
        }));
      }
      return o;
    });
    H(K, () => {
      h.value = 0, g.value = null;
    }), H(F, () => {
      m.value = Math.min(m.value, F.value);
    }), H(V, () => {
      h.value = Math.min(h.value, V.value);
    });
    function ke(o) {
      const r = o * e.rowHeight, y = r + e.rowHeight;
      r < h.value ? h.value = r : y > h.value + W.value && (h.value = Math.min(V.value, y - W.value));
    }
    function Ie() {
      h.value = Math.max(0, h.value - W.value), de();
    }
    function B() {
      h.value = Math.min(V.value, h.value + W.value), de();
    }
    let P = !1, j = "", te = 0, D = 0, A = !1, $ = !1, me = 0, ce = 0, be = 0, Ee = 0, E = !1;
    function Y(o, r) {
      var y;
      P = !0, j = o, te = r, D = ((y = b.value.find((k) => k.colId === o)) == null ? void 0 : y.width) ?? 100, A = !1;
    }
    function Q(o) {
      if ($) {
        const L = me - o.clientX, z = ce - o.clientY;
        (Math.abs(L) > 4 || Math.abs(z) > 4) && (E = !0), m.value = Math.max(0, Math.min(F.value, be + L)), h.value = Math.max(0, Math.min(V.value, Ee + z)), de();
        return;
      }
      if (!P) return;
      const r = M.value, y = Math.max(30, D + (o.clientX - te)), k = C.value.filter((L) => L.colId !== j).reduce((L, z) => L + z.width, 0), I = r - y;
      I > 10 && (s[j] = Math.max(10, Math.round(y * k / I))), de();
    }
    function xe() {
      $ && (E && (A = !0), $ = !1), P && (P = !1, A = !0, n("column-resized"));
    }
    const he = _(null), J = _(null), Vt = lt("cathodeResetTick", _(0));
    H(Vt, () => Pe());
    let le = null, _e = !1, nt, pt, Le, ge, fe;
    function wt() {
      if (!(!J.value || !he.value)) {
        fe = document.createElement("canvas");
        try {
          le = new O.WebGLRenderer({ canvas: J.value, antialias: !1, alpha: !0 });
        } catch {
          _e = !0;
        }
        if (!_e && !le.getContext() && (le.dispose(), le = null, _e = !0), _e) {
          He();
          return;
        }
        le.setPixelRatio(1), le.setClearColor(0, 0), nt = new O.Scene(), pt = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), ge = new O.CanvasTexture(fe), ge.minFilter = O.LinearFilter, ge.magFilter = O.LinearFilter, Le = new O.ShaderMaterial({
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
        }), nt.add(new O.Mesh(new O.PlaneGeometry(2, 2), Le)), He();
      }
    }
    function He() {
      if (!he.value || !le && !_e) return;
      const o = he.value.clientWidth, r = he.value.clientHeight - (e.pagination ? xl : 0);
      if (!o || !r) return;
      const y = fe.width !== o || fe.height !== r;
      fe.width = o, fe.height = r, M.value = o, S.value = r, m.value = Math.max(0, Math.min(F.value, m.value)), h.value = Math.max(0, Math.min(V.value, h.value)), le ? (y && ge && (ge.dispose(), ge = new O.CanvasTexture(fe), ge.minFilter = O.LinearFilter, ge.magFilter = O.LinearFilter, Le && (Le.uniforms.uTex.value = ge)), le.setPixelRatio(window.devicePixelRatio || 1), le.setSize(o, r)) : J.value && (J.value.width = o, J.value.height = r, J.value.style.width = o + "px", J.value.style.height = r + "px"), de();
    }
    function de() {
      var y, k, I, L, z, N, ne, ie;
      if (!(fe != null && fe.width)) return;
      if (_e) {
        if (!J.value) return;
        It(fe, {
          cols: b.value,
          rows: K.value,
          pinnedRows: f.value,
          rowHeight: e.rowHeight,
          scrollY: h.value,
          scrollX: m.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((y = d.value) == null ? void 0 : y.colId) ?? null,
          sortDir: ((k = d.value) == null ? void 0 : k.dir) ?? null,
          colFilters: c,
          hoveredRow: v.value,
          selectedRow: ((I = g.value) == null ? void 0 : I.row) ?? -1,
          selectedCol: ((L = g.value) == null ? void 0 : L.col) ?? -1,
          formatCell: ee,
          getCellStyle: ve
        });
        const Tt = J.value.getContext("2d");
        Tt && Tt.drawImage(fe, 0, 0);
        return;
      }
      if (!le || !Le || !ge) return;
      const o = Oe[e.theme] ?? Oe.none, r = e.theme === "paper";
      Le.uniforms.uStrength.value = e.curvature / 45 * 0.55, Le.uniforms.uScanlines.value = e.scanlines && !r ? 1 : 0, Le.uniforms.uVignette.value = r ? 0 : 1, Le.uniforms.uBezel.value.set(o.bg), It(fe, {
        cols: b.value,
        rows: K.value,
        pinnedRows: f.value,
        rowHeight: e.rowHeight,
        scrollY: h.value,
        scrollX: m.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((z = d.value) == null ? void 0 : z.colId) ?? null,
        sortDir: ((N = d.value) == null ? void 0 : N.dir) ?? null,
        colFilters: c,
        hoveredRow: v.value,
        selectedRow: ((ne = g.value) == null ? void 0 : ne.row) ?? -1,
        selectedCol: ((ie = g.value) == null ? void 0 : ie.col) ?? -1,
        formatCell: ee,
        getCellStyle: ve
      }), ge.needsUpdate = !0, le.render(nt, pt);
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
        at = r, m.value = Math.max(0, Math.min(F.value, m.value + o.deltaX)), de();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        at = r, m.value = Math.max(0, Math.min(F.value, m.value + o.deltaY)), de();
        return;
      }
      r - at < yl || (h.value = Math.max(0, Math.min(V.value, h.value + o.deltaY)), de());
    }
    function Nt(o) {
      if (P) return;
      const [r, y] = ot(o);
      if (r < 0) {
        v.value = -1, de();
        return;
      }
      const k = Dt(
        r,
        y,
        b.value,
        K.value.length,
        e.rowHeight,
        h.value,
        fe.height,
        f.value.length,
        m.value
      );
      if (v.value = k.area === "body" ? k.rowIdx : -1, k.area === "header" && k.colIdx >= 0) {
        const I = b.value[k.colIdx], L = st(k.colIdx, b.value), z = r + m.value;
        J.value.style.cursor = I && Lt(z, L, I.width) ? "col-resize" : "pointer";
      } else k.area === "body" ? J.value.style.cursor = "pointer" : J.value.style.cursor = "default";
      de();
    }
    function Gt() {
      v.value = -1, de();
    }
    function Ut(o) {
      const [r, y] = ot(o);
      if (r < 0) return;
      if (y >= oe) {
        $ = !0, E = !1, me = o.clientX, ce = o.clientY, be = m.value, Ee = h.value;
        return;
      }
      const k = r + m.value;
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
      const [r, y] = ot(o);
      if (r < 0) {
        p.value = null;
        return;
      }
      const k = Dt(
        r,
        y,
        b.value,
        K.value.length,
        e.rowHeight,
        h.value,
        fe.height,
        f.value.length,
        m.value
      );
      if (k.area === "header" && k.colIdx >= 0) {
        const N = b.value[k.colIdx], ne = st(k.colIdx, b.value), ie = r + m.value;
        N.colDef.filter && ml(ie, ne, N.width) ? (o.stopPropagation(), p.value === N.colId ? p.value = null : (p.value = N.colId, R.value = (I = c[N.colId]) != null && I.startsWith("__eq__") ? c[N.colId].slice(6) : c[N.colId] ?? "", T.value = { x: Math.max(0, ne - m.value), y: oe })) : N.colDef.sortable !== !1 && (p.value = null, d.value = ((L = d.value) == null ? void 0 : L.colId) === N.colId ? d.value.dir === "asc" ? { colId: N.colId, dir: "desc" } : null : { colId: N.colId, dir: "asc" }, n("sort-changed"));
        return;
      }
      if (p.value = null, k.area === "body" && k.rowIdx >= 0 && k.colIdx >= 0) {
        const N = k.rowIdx;
        g.value = { row: N, col: k.colIdx }, (z = J.value) == null || z.focus();
        const ne = K.value[N], ie = b.value[k.colIdx];
        ne && ie && (n("row-clicked", { data: ne, event: o }), n("cell-selected", { data: ne, row: N, col: k.colIdx, colId: ie.colId }));
      }
    }
    function bt(o) {
      var r, y;
      p.value && ((y = (r = o.target).closest) != null && y.call(r, ".cathode-filter-popup") || (p.value = null));
    }
    function qt(o) {
      var I;
      if (!M.value) return;
      let r = 0;
      for (let L = 0; L < o; L++) r += b.value[L].width;
      const y = ((I = b.value[o]) == null ? void 0 : I.width) ?? 0, k = r - m.value;
      k < 0 ? m.value = Math.max(0, r) : k + y > M.value && (m.value = Math.min(F.value, r + y - M.value));
    }
    function jt(o) {
      var N;
      const r = b.value, y = r.length - 1, k = K.value.length - 1;
      if (!g.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), g.value = { row: U.value, col: 0 });
        return;
      }
      let { row: I, col: L } = g.value;
      const z = (ne, ie) => {
        I = Math.max(0, Math.min(k, ne)), L = Math.max(0, Math.min(y, ie)), g.value = { row: I, col: L }, ke(I), qt(L);
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
            const ne = K.value[I], ie = r[L];
            ne && ie && ((N = navigator.clipboard) == null || N.writeText(ee(ie, ne)).catch(() => {
            }));
          }
          break;
      }
    }
    function Zt(o) {
      const r = o.target.value;
      R.value = r, r ? c[p.value] = r : delete c[p.value], n("filter-changed");
    }
    function xt() {
      p.value && delete c[p.value], R.value = "", p.value = null, n("filter-changed");
    }
    const Jt = {
      setGridOption(o, r) {
        o === "rowData" ? a.value = r : o === "pinnedBottomRowData" ? f.value = r : o === "quickFilterText" && (u.value = r);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var y, k;
          const r = w(o);
          return {
            colId: r,
            hide: i.has(r),
            sort: ((y = d.value) == null ? void 0 : y.colId) === r ? d.value.dir : null,
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
        for (const r of Object.keys(c)) delete c[r];
        if (o)
          for (const [r, y] of Object.entries(o))
            (y == null ? void 0 : y.type) === "equals" ? c[r] = `__eq__${y.filter}` : y != null && y.filter && (c[r] = y.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [r, y] of Object.entries(c))
          y && (o[r] = y.startsWith("__eq__") ? { type: "equals", filter: y.slice(6) } : { type: "contains", filter: y });
        return o;
      },
      async setColumnFilterModel(o, r) {
        r ? r.type === "equals" ? c[o] = `__eq__${r.filter}` : c[o] = r.filter ?? "" : delete c[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        x.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const r = C.value, y = r.map((z) => z.colDef.headerName ?? z.colId).join(","), k = K.value.map(
          (z) => r.map((N) => `"${String(ee(N, z)).replace(/"/g, '""')}"`).join(",")
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
          r.hide && i.add(w(r));
        const o = e.columnDefs.find((r) => r.sort);
        d.value = o ? { colId: w(o), dir: o.sort } : null;
        for (const r of Object.keys(s)) delete s[r];
        for (const r of Object.keys(c)) delete c[r];
        u.value = "", h.value = 0, g.value = null, p.value = null;
      }
    };
    H(
      [K, () => f.value, b, h, v, g],
      () => Ce(de)
    ), H(() => e.theme, () => de()), H(() => e.curvature, () => Ce(He)), H(() => e.scanlines, () => de()), H(() => e.glow, () => de()), H(g, (o) => {
      if (!o) return;
      const r = K.value[o.row], y = b.value[o.col];
      r && y && n("cell-selected", { data: r, row: o.row, col: o.col, colId: y.colId });
    });
    let Ue = null, Ke = null, it = 0;
    function Pe() {
      cancelAnimationFrame(it), it = requestAnimationFrame(He);
    }
    function yt(o) {
      o.preventDefault();
    }
    function Mt() {
      le == null || le.dispose(), le = null, _e = !1, wt();
    }
    We(() => {
      for (const o of e.columnDefs)
        o.hide && i.add(w(o)), o.sort && !d.value && (d.value = { colId: w(o), dir: o.sort });
      a.value = e.rowData ?? [], f.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", bt), document.addEventListener("mousemove", Q), document.addEventListener("mouseup", xe), Ce(() => {
        var o;
        wt(), J.value && (J.value.addEventListener("webglcontextlost", yt), J.value.addEventListener("webglcontextrestored", Mt)), he.value && (Ue = new ResizeObserver(() => He()), Ue.observe(he.value), Ke = new IntersectionObserver((r) => {
          r.some((y) => y.isIntersecting) && Pe();
        }), Ke.observe(he.value)), window.addEventListener("resize", Pe), (o = window.visualViewport) == null || o.addEventListener("resize", Pe), n("grid-ready", { api: Jt });
      });
    }), Ne(() => {
      var o, r, y;
      document.removeEventListener("click", bt, !0), document.removeEventListener("mousemove", Q), document.removeEventListener("mouseup", xe), (o = J.value) == null || o.removeEventListener("webglcontextlost", yt), (r = J.value) == null || r.removeEventListener("webglcontextrestored", Mt), Ue == null || Ue.disconnect(), Ke == null || Ke.disconnect(), window.removeEventListener("resize", Pe), (y = window.visualViewport) == null || y.removeEventListener("resize", Pe), cancelAnimationFrame(it), le == null || le.dispose();
    });
    const pe = q(() => Oe[e.theme] ?? Oe.none), Qt = q(() => ({
      position: "absolute",
      left: `${T.value.x}px`,
      top: `${T.value.y}px`,
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
    })), el = q(() => ({
      background: pe.value.bg,
      border: `1px solid ${pe.value.border}`,
      color: pe.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), tl = q(() => ({
      background: pe.value.headerBg,
      borderTop: `1px solid ${pe.value.border}`,
      color: pe.value.text
    })), ll = q(() => ({
      background: pe.value.bg
    })), St = q(() => pe.value.accent);
    return (o, r) => {
      var y, k;
      return re(), se("div", {
        ref_key: "wrapEl",
        ref: he,
        class: "cathode-wrap",
        style: ye(ll.value)
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
        p.value ? (re(), se("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: ye(Qt.value),
          onClick: r[0] || (r[0] = Re(() => {
          }, ["stop"]))
        }, [
          Z("input", {
            style: ye(el.value),
            value: R.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Zt,
            onKeydown: nl(xt, ["escape"])
          }, null, 44, hl),
          R.value ? (re(), se("button", {
            key: 0,
            style: ye({
              background: "none",
              border: "none",
              color: pe.value.text,
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
          style: ye(tl.value)
        }, [
          Z("button", {
            disabled: h.value <= 0,
            onClick: r[1] || (r[1] = (I) => Ie())
          }, "◀", 8, gl),
          Z("span", null, Me((U.value + 1).toLocaleString()) + "–" + Me(Math.min(K.value.length, ae.value + 1).toLocaleString()) + " / " + Me(K.value.length.toLocaleString()), 1),
          Z("button", {
            disabled: h.value >= V.value,
            onClick: r[2] || (r[2] = (I) => B())
          }, "▶", 8, pl),
          Z("span", {
            class: "cathode-page-info",
            style: ye({ color: St.value })
          }, Me(K.value.length.toLocaleString()) + " rows ", 5),
          g.value ? (re(), se("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: ye({ color: St.value })
          }, Me(((y = b.value[g.value.col]) == null ? void 0 : y.colDef.headerName) ?? ((k = b.value[g.value.col]) == null ? void 0 : k.colId)) + " : " + Me(ee(b.value[g.value.col], K.value[g.value.row])), 5)) : Se("", !0)
        ], 4)) : Se("", !0)
      ], 4);
    };
  }
}), Ge = (t, l) => {
  const e = t.__vccOpts || t;
  for (const [n, a] of l)
    e[n] = a;
  return e;
}, Dn = /* @__PURE__ */ Ge(Ml, [["__scopeId", "data-v-1ce21ed2"]]), Je = {
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
const Tl = 12, we = 18, Ze = 10, Ve = 6, vt = `${Tl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
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
    const f = a.split(/(\s+)/);
    let u = "";
    for (const d of f) {
      const c = u + d;
      if (t.measureText(c).width <= e)
        u = c;
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
  const { entries: l, ctx: e, textMaxWidth: n, showTimestamps: a, wordWrap: f } = t, u = t.formatTs ?? Yt;
  e.font = vt;
  const d = [];
  for (let c = 0; c < l.length; c++) {
    const s = l[c], i = s.level ?? "info", x = a && s.ts != null ? u(s.ts) : "", M = f ? Cl(e, s.text, n) : s.text.split(`
`);
    for (let S = 0; S < M.length; S++)
      d.push({
        entryIdx: c,
        text: M[S],
        level: i,
        timestamp: S === 0 ? x : "",
        isFirstFrag: S === 0
      });
  }
  return d;
}
function Et(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, f = Je[l.theme] ?? Je.none;
  e.clearRect(0, 0, n, a), e.fillStyle = f.bg, e.fillRect(0, 0, n, a), e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip(), e.font = vt, e.textBaseline = "middle";
  const u = l.visualLines, d = Ze, c = l.showTimestamps ? Ze + l.timestampWidth : Ze, s = Math.max(0, Math.floor((l.scrollY - Ve) / we)), i = Math.min(u.length, Math.ceil((l.scrollY + a - Ve) / we) + 1);
  for (let x = s; x < i; x++) {
    const M = u[x], S = Ve + x * we - l.scrollY + we / 2;
    if (M.entryIdx % 2 === 1 && M.isFirstFrag) {
      e.fillStyle = f.rowAlt;
      let m = 1;
      for (; x + m < i && u[x + m].entryIdx === M.entryIdx; ) m++;
      e.fillRect(0, S - we / 2, n, we * m);
    }
    x === l.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, S - we / 2, n, we)), l.showTimestamps && M.timestamp && (e.fillStyle = f.timestamp, e.textAlign = "left", l.glow && (e.shadowBlur = 6, e.shadowColor = f.timestamp), e.fillText(M.timestamp, d, S), e.shadowBlur = 0);
    const h = Sl(f, M.level);
    e.fillStyle = h, e.textAlign = "left", l.glow ? (e.shadowColor = h, e.shadowBlur = 14, e.fillText(M.text, c, S), e.shadowBlur = 7, e.fillText(M.text, c, S), e.shadowBlur = 3, e.fillText(M.text, c, S), e.shadowBlur = 0) : e.fillText(M.text, c, S);
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
      // Falloff coefficient was 1.5 — corners darkened to ~25% of centre,
      // which crushed text brightness. Dropped to 0.6: corners now hold
      // ~70%+ luminance so text reads bright across the whole screen.
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 0.6;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`, Bl = /* @__PURE__ */ Xe({
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
    const e = t, n = _(null), a = _(null), f = _(0), u = _(0), d = _(0), c = _(-1), s = _(!0), i = q(() => {
      const E = e.entries ?? [];
      return e.maxLines > 0 && E.length > e.maxLines ? E.slice(E.length - e.maxLines) : E;
    }), x = q(() => {
      if (!e.showTimestamps) return "";
      const E = e.formatTs ?? Yt;
      let Y = "00:00:00";
      for (const Q of i.value) {
        if (Q.ts == null) continue;
        const xe = E(Q.ts);
        xe.length > Y.length && (Y = xe);
      }
      return Y;
    }), M = _(0), S = _([]);
    function h() {
      if (!b) return;
      const E = b.getContext("2d");
      if (!E) return;
      E.font = vt;
      const Y = e.showTimestamps ? kl(E, x.value) : 0;
      M.value = Y;
      const Q = Math.max(
        1,
        f.value - Ze * 2 - Y
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
    const m = q(() => Dl(S.value.length)), v = q(() => Math.max(0, m.value - u.value));
    H(v, () => {
      s.value ? d.value = v.value : d.value = Math.min(d.value, v.value);
    }), H(
      [i, f, () => e.showTimestamps, () => e.wordWrap, x],
      () => {
        h(), Ce(V);
      },
      { deep: !1 }
    );
    let g = null, p = !1, T, R, w, C, b;
    function F() {
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
        g.setPixelRatio(1), g.setClearColor(0, 0), T = new O.Scene(), R = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), C = new O.CanvasTexture(b), C.minFilter = O.LinearFilter, C.magFilter = O.LinearFilter, w = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: C },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: El,
          fragmentShader: Rl,
          transparent: !0
        }), T.add(new O.Mesh(new O.PlaneGeometry(2, 2), w)), W();
      }
    }
    function W() {
      if (!n.value || !g && !p) return;
      const E = n.value.clientWidth, Y = n.value.clientHeight;
      if (!E || !Y) return;
      const Q = b.width !== E || b.height !== Y;
      Q && (b.width = E, b.height = Y, f.value = E, u.value = Y, h(), g ? (Q && C && (C.dispose(), C = new O.CanvasTexture(b), C.minFilter = O.LinearFilter, C.magFilter = O.LinearFilter, w && (w.uniforms.uTex.value = C)), g.setPixelRatio(window.devicePixelRatio || 1), g.setSize(E, Y)) : a.value && (a.value.width = E, a.value.height = Y, a.value.style.width = E + "px", a.value.style.height = Y + "px"), s.value && (d.value = Math.max(0, m.value - u.value)), V());
    }
    function V() {
      if (!(b != null && b.width)) return;
      if (p) {
        if (!a.value) return;
        Et(b, {
          visualLines: S.value,
          scrollY: d.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: M.value,
          hoveredLine: c.value
        });
        const Y = a.value.getContext("2d");
        Y && Y.drawImage(b, 0, 0);
        return;
      }
      if (!g || !w || !C) return;
      const E = e.theme === "paper";
      w.uniforms.uStrength.value = e.curvature / 45 * 0.55, w.uniforms.uScanlines.value = e.scanlines && !E ? 1 : 0, w.uniforms.uVignette.value = E ? 0 : 1, Et(b, {
        visualLines: S.value,
        scrollY: d.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: M.value,
        hoveredLine: c.value
      }), C.needsUpdate = !0, g.render(T, R);
    }
    H(() => e.theme, () => V()), H(() => e.curvature, () => V()), H(() => e.scanlines, () => V()), H(() => e.glow, () => V()), H(d, () => V()), H(c, () => V());
    function G(E) {
      if (!a.value) return [-1, -1];
      const Y = a.value.getBoundingClientRect();
      return [E.clientX - Y.left, E.clientY - Y.top];
    }
    function U(E) {
      d.value = Math.max(0, Math.min(v.value, E)), s.value = d.value >= v.value - 4;
    }
    function ae(E) {
      U(d.value + E.deltaY);
    }
    let X = !1, ee = 0, ve = 0;
    function K(E) {
      X = !0, ee = E.clientY, ve = d.value;
    }
    function ke(E) {
      if (X) {
        const Y = ee - E.clientY;
        U(ve + Y);
      }
    }
    function Ie() {
      X && (X = !1);
    }
    function B(E) {
      const [, Y] = G(E);
      if (Y < 0) {
        c.value = -1;
        return;
      }
      c.value = Ll(Y, d.value, S.value.length);
    }
    function P() {
      c.value = -1;
    }
    l({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        s.value = !0, d.value = v.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(E) {
        U(Ve + E * we);
      }
    });
    let j = null, te = null, D = 0;
    const A = lt("cathodeResetTick", _(0));
    H(A, () => $());
    function $() {
      cancelAnimationFrame(D), D = requestAnimationFrame(W);
    }
    function me(E) {
      E.preventDefault();
    }
    function ce() {
      g == null || g.dispose(), g = null, p = !1, F();
    }
    We(() => {
      document.addEventListener("mousemove", ke), document.addEventListener("mouseup", Ie), Ce(() => {
        var E;
        F(), a.value && (a.value.addEventListener("webglcontextlost", me), a.value.addEventListener("webglcontextrestored", ce)), n.value && (j = new ResizeObserver(() => W()), j.observe(n.value), te = new IntersectionObserver((Y) => {
          Y.some((Q) => Q.isIntersecting) && $();
        }), te.observe(n.value)), window.addEventListener("resize", $), (E = window.visualViewport) == null || E.addEventListener("resize", $), d.value = v.value;
      });
    }), Ne(() => {
      var E, Y, Q;
      document.removeEventListener("mousemove", ke), document.removeEventListener("mouseup", Ie), (E = a.value) == null || E.removeEventListener("webglcontextlost", me), (Y = a.value) == null || Y.removeEventListener("webglcontextrestored", ce), j == null || j.disconnect(), te == null || te.disconnect(), window.removeEventListener("resize", $), (Q = window.visualViewport) == null || Q.removeEventListener("resize", $), cancelAnimationFrame(D), g == null || g.dispose();
    });
    const be = q(() => Je[e.theme] ?? Je.none), Ee = q(() => ({
      background: be.value.bg
    }));
    return (E, Y) => (re(), se("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: ye(Ee.value)
    }, [
      Z("canvas", {
        ref_key: "canvasEl",
        ref: a,
        class: "cathode-log-canvas",
        onWheel: Re(ae, ["prevent"]),
        onMousemove: B,
        onMouseleave: P,
        onMousedown: K
      }, null, 544)
    ], 4));
  }
}), Fl = /* @__PURE__ */ Ge(Bl, [["__scopeId", "data-v-669b69f1"]]), _l = ["disabled"], Al = /* @__PURE__ */ Xe({
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
    const n = t, a = e, f = _(null), u = _(null), d = _(""), c = _([]), s = _(-1);
    let i = "";
    function x(w) {
      w.trim() && (c.value.length && c.value[c.value.length - 1] === w || (c.value.push(w), c.value.length > n.historyLimit && c.value.splice(0, c.value.length - n.historyLimit)));
    }
    function M(w) {
      if (!n.disabled) {
        if (w.key === "Enter") {
          w.preventDefault();
          const C = d.value;
          C.trim() && x(C), s.value = -1, d.value = "", a("submit", C);
          return;
        }
        if (w.key === "ArrowUp") {
          if (!c.value.length) return;
          w.preventDefault(), s.value === -1 ? (i = d.value, s.value = c.value.length - 1) : s.value > 0 && s.value--, d.value = c.value[s.value];
          return;
        }
        if (w.key === "ArrowDown") {
          if (s.value === -1) return;
          w.preventDefault(), s.value < c.value.length - 1 ? (s.value++, d.value = c.value[s.value]) : (s.value = -1, d.value = i, i = "");
          return;
        }
      }
    }
    const S = _(!0);
    let h = null;
    function m() {
      h || (h = setInterval(() => {
        S.value = !S.value;
      }, 530));
    }
    function v() {
      h && (clearInterval(h), h = null), S.value = !0;
    }
    const g = q(() => {
      let w;
      return n.disabled ? w = " " : n.busy ? w = "█" : w = S.value ? "█" : " ", { level: "info", text: `${n.prompt}${d.value}${w}` };
    }), p = q(
      () => [...n.entries, g.value]
    );
    function T() {
      var w;
      n.disabled || (w = u.value) == null || w.focus();
    }
    H(() => n.busy, (w, C) => {
      C && !w && !n.disabled && Ce(() => {
        var b;
        return (b = u.value) == null ? void 0 : b.focus();
      });
    });
    function R() {
      var w;
      (w = u.value) == null || w.focus();
    }
    return l({ focus: R }), We(() => {
      m(), n.disabled || requestAnimationFrame(() => {
        var w;
        return (w = u.value) == null ? void 0 : w.focus();
      });
    }), Ne(() => {
      v();
    }), (w, C) => (re(), se("div", {
      ref_key: "wrapEl",
      ref: f,
      class: "cathode-terminal-wrap",
      onClick: T
    }, [
      zt(Fl, {
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
        "onUpdate:modelValue": C[0] || (C[0] = (b) => d.value = b),
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
}, zl = 0.18, qe = 8, mt = 22, Wl = 4, De = 8, ze = 56, Ht = 42, Be = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", Yl = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", ut = 4, Hl = 1, Pl = 1;
function $l(t, l, e, n = 0, a = !1) {
  const f = a ? Ht : ze, u = Math.max(0, l - De - f), d = Math.max(1, Math.floor(u / e)), c = Math.min(d, t);
  return { firstIdx: Math.max(0, t - c - Math.floor(n / e)), count: c, slotW: e };
}
function Ol(t, l, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, a = -1 / 0, f = 0;
  const u = Math.min(t.length, l + e);
  for (let c = l; c < u; c++) {
    const s = t[c];
    s && (s.low < n && (n = s.low), s.high > a && (a = s.high), s.volume > f && (f = s.volume));
  }
  if (!isFinite(n) || !isFinite(a) || n === a) {
    const c = isFinite(n) ? n : 0;
    return { min: c - 1, max: c + 1, maxVol: Math.max(1, f) };
  }
  const d = (a - n) * 0.04;
  return { min: n - d, max: a + d, maxVol: Math.max(1, f) };
}
function Vl(t, l, e = !1) {
  const n = e ? Wl : mt, a = Math.max(1, t - qe - n - ut), f = Math.max(0, Math.round(a * l)), u = a - f;
  return {
    priceY0: qe,
    priceY1: qe + u,
    volumeY0: qe + u + ut,
    volumeY1: qe + u + ut + f
  };
}
function Te(t, l, e, n) {
  const a = l.max - l.min;
  return a <= 0 ? (e + n) / 2 : e + (1 - (t - l.min) / a) * (n - e);
}
function Fe(t, l, e) {
  return De + (t - l + 0.5) * e;
}
function Ae(t) {
  const l = Math.abs(t), e = l >= 1e4 ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : l >= 100 ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : l >= 1 ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : l >= 0.01 ? { minimumFractionDigits: 4, maximumFractionDigits: 4 } : { minimumFractionDigits: 6, maximumFractionDigits: 6 };
  return t.toLocaleString("en-US", e);
}
function ht(t) {
  const l = new Date(t), e = String(l.getMonth() + 1).padStart(2, "0"), n = String(l.getDate()).padStart(2, "0"), a = String(l.getHours()).padStart(2, "0"), f = String(l.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${a}:${f}`;
}
function Xl(t, l) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, l), n = Math.pow(10, Math.floor(Math.log10(e))), a = e / n;
  let f;
  return a < 1.5 ? f = 1 : a < 3 ? f = 2 : a < 7 ? f = 5 : f = 10, f * n;
}
function Rt(t, l) {
  var S, h, m, v, g;
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, a = t.height, f = Qe[l.theme] ?? Qe.none, u = l.colors ? { ...f, ...l.colors } : f, d = !!l.compact;
  if (e.clearRect(0, 0, n, a), e.fillStyle = u.bg, e.fillRect(0, 0, n, a), !l.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, n, a), e.clip();
  const c = $l(l.candles.length, n, l.slotW, l.scrollX, d), s = Ol(l.candles, c.firstIdx, c.count), i = Vl(a, l.showVolume ? l.volumeFraction : 0, d), x = Math.max(Hl, Math.floor(l.slotW * 0.7)), M = Math.min(l.candles.length, c.firstIdx + c.count);
  for (let p = c.firstIdx; p < M; p++) {
    const T = l.candles[p];
    if (!T) continue;
    const R = Fe(p, c.firstIdx, l.slotW), w = Te(T.open, s, i.priceY0, i.priceY1), C = Te(T.close, s, i.priceY0, i.priceY1), b = Te(T.high, s, i.priceY0, i.priceY1), F = Te(T.low, s, i.priceY0, i.priceY1), W = T.close >= T.open, V = W ? u.wickBull : u.wickBear, G = W ? u.candleBull : u.candleBear;
    l.glow && (e.shadowBlur = 10, e.shadowColor = G), e.strokeStyle = V, e.lineWidth = Pl, e.beginPath(), e.moveTo(Math.round(R) + 0.5, b), e.lineTo(Math.round(R) + 0.5, F), e.stroke(), e.fillStyle = G;
    const U = Math.min(w, C), ae = Math.max(1, Math.abs(C - w)), X = Math.round(R - x / 2), ee = Math.round(U), ve = Math.round(ae);
    if (e.fillRect(X, ee, x, ve), l.glow && (e.shadowBlur = 4, e.fillRect(X, ee, x, ve)), e.shadowBlur = 0, l.showVolume && s.maxVol > 0) {
      const K = Math.round(T.volume / s.maxVol * (i.volumeY1 - i.volumeY0));
      K > 0 && (e.fillStyle = W ? u.volumeBull : u.volumeBear, e.fillRect(
        Math.round(R - x / 2),
        i.volumeY1 - K,
        x,
        K
      ));
    }
  }
  if ((S = l.overlays) != null && S.length)
    for (const p of l.overlays) Nl(e, p, c, s, i, l.slotW);
  (h = l.markers) != null && h.length && Ql(e, u, l.markers, l.candles, c, s, i, l.slotW), en(e, u, s, i, n, d), d || (tn(e, u, l.candles, c, l.slotW, a), Zl(e, u, l.candles, n, a)), (m = l.overlays) != null && m.length && Ul(e, u, l.overlays, i), l.hover && (ln(e, u, l.candles, c, s, i, l.slotW, l.hover, n), Kl(e, u, l.candles, c, l.slotW, l.hover, i, ((v = l.overlays) == null ? void 0 : v.length) ?? 0), (g = l.markers) != null && g.length && jl(e, u, l.markers, l.candles, c, s, i, l.slotW, l.hover, n)), e.restore();
}
function Nl(t, l, e, n, a, f) {
  var d;
  const u = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    De,
    a.priceY0,
    /* width: */
    999999,
    a.priceY1 - a.priceY0
  ), t.clip(), l.kind === "line")
    je(t, l.data, e.firstIdx, u, f, n, a, l.color, l.lineWidth ?? 1, l.dashed === !0);
  else {
    const c = Pt(l.color, l.fillAlpha ?? 0.08);
    Gl(t, l.upper, l.lower, e.firstIdx, u, f, n, a, c), je(t, l.upper, e.firstIdx, u, f, n, a, l.color, 1, !1), je(t, l.lower, e.firstIdx, u, f, n, a, l.color, 1, !1), (d = l.middle) != null && d.length && je(t, l.middle, e.firstIdx, u, f, n, a, l.color, 1, l.middleDashed !== !1);
  }
  t.restore();
}
function je(t, l, e, n, a, f, u, d, c, s) {
  if (!l || !l.length) return;
  t.strokeStyle = d, t.lineWidth = c, t.setLineDash(s ? [4, 3] : []), t.beginPath();
  let i = !1;
  for (let x = e; x < n; x++) {
    const M = l[x];
    if (typeof M != "number" || !isFinite(M)) {
      i && (t.stroke(), t.beginPath(), i = !1);
      continue;
    }
    const S = Fe(x, e, a), h = Te(M, f, u.priceY0, u.priceY1);
    i ? t.lineTo(S, h) : (t.moveTo(S, h), i = !0);
  }
  i && t.stroke(), t.setLineDash([]);
}
function Gl(t, l, e, n, a, f, u, d, c) {
  if (!(l != null && l.length) || !(e != null && e.length)) return;
  t.fillStyle = c;
  let s = !1, i = -1;
  for (let x = n; x <= a; x++) {
    const M = l[x], S = e[x], h = x < a && typeof M == "number" && typeof S == "number" && isFinite(M) && isFinite(S);
    if (h && !s && (i = x, s = !0), !h && s || x === a && s) {
      const m = h ? x + 1 : x;
      t.beginPath();
      for (let v = i; v < m; v++) {
        const g = Fe(v, n, f), p = Te(l[v], u, d.priceY0, d.priceY1);
        v === i ? t.moveTo(g, p) : t.lineTo(g, p);
      }
      for (let v = m - 1; v >= i; v--) {
        const g = Fe(v, n, f), p = Te(e[v], u, d.priceY0, d.priceY1);
        t.lineTo(g, p);
      }
      t.closePath(), t.fill(), s = !1;
    }
  }
}
function Pt(t, l) {
  const e = Math.max(0, Math.min(1, l));
  if (t.startsWith("#") && t.length === 7) {
    const n = parseInt(t.slice(1, 3), 16), a = parseInt(t.slice(3, 5), 16), f = parseInt(t.slice(5, 7), 16);
    return `rgba(${n},${a},${f},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Ul(t, l, e, n) {
  const a = e.filter((m) => !!m.label);
  if (!a.length) return;
  t.save(), t.font = Be;
  const f = 8, u = 5, d = 12, c = 6, s = 14;
  let i = 0;
  for (const m of a) {
    const v = t.measureText(m.label).width;
    v > i && (i = v);
  }
  const x = f * 2 + d + c + i, M = u * 2 + s * a.length, S = De + 4, h = n.priceY0 + 4;
  t.fillStyle = l.panelBg, t.fillRect(S, h, x, M), t.textBaseline = "middle", t.textAlign = "left";
  for (let m = 0; m < a.length; m++) {
    const v = a[m], g = h + u + s * (m + 0.5), p = S + f;
    v.kind === "line" ? (t.strokeStyle = v.color, t.lineWidth = v.lineWidth ?? 1, t.setLineDash(v.dashed ? [3, 3] : []), t.beginPath(), t.moveTo(p, g), t.lineTo(p + d, g), t.stroke(), t.setLineDash([])) : (t.fillStyle = Pt(v.color, v.fillAlpha ?? 0.2), t.fillRect(p, g - 4, d, 8), t.strokeStyle = v.color, t.lineWidth = 1, t.strokeRect(p + 0.5, g - 4 + 0.5, d - 1, 7)), t.fillStyle = l.text, t.fillText(v.label, p + d + c, g);
  }
  t.restore();
}
function Kl(t, l, e, n, a, f, u, d) {
  const c = Math.floor((f.x - De) / a), s = n.firstIdx + c;
  if (s < 0 || s >= e.length) return;
  const i = e[s];
  if (!i) return;
  const x = i.close - i.open, M = i.open !== 0 ? x / i.open * 100 : 0, S = x >= 0 ? "+" : "", h = [
    ["O", Ae(i.open), void 0],
    ["H", Ae(i.high), void 0],
    ["L", Ae(i.low), void 0],
    ["C", Ae(i.close), void 0],
    ["V", ql(i.volume), void 0],
    ["", `${S}${M.toFixed(2)}%`, x >= 0 ? l.candleBull : l.candleBear]
  ];
  t.save(), t.font = Be, t.textBaseline = "middle", t.textAlign = "left";
  const m = 8, v = 4, g = 14;
  let p = m;
  for (const [C, b] of h) {
    const F = C ? `${C} ${b}` : b, W = t.measureText(F).width + 12;
    p += W;
  }
  p += m - 12;
  const T = u.priceY0 + 4 + (d > 0 ? v * 2 + 14 * d + 4 : 0), R = De + 4;
  t.fillStyle = l.panelBg, t.fillRect(R, T, p, g + v * 2);
  let w = R + m;
  for (let C = 0; C < h.length; C++) {
    const [b, F, W] = h[C];
    t.fillStyle = l.text, b && (t.globalAlpha = 0.6, t.fillText(b + " ", w, T + v + g / 2), t.globalAlpha = 1, w += t.measureText(b + " ").width), W && (t.fillStyle = W), t.fillText(F, w, T + v + g / 2), w += t.measureText(F).width + 12;
  }
  t.restore();
}
function ql(t) {
  return !isFinite(t) || t <= 0 ? "0" : t >= 1e9 ? (t / 1e9).toFixed(2) + "B" : t >= 1e6 ? (t / 1e6).toFixed(2) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : Math.round(t).toString();
}
function jl(t, l, e, n, a, f, u, d, c, s) {
  if (!n.length) return;
  const i = n.length > 1 ? n[1].start - n[0].start : 6e4, x = Math.max(1, i * 0.5), M = Math.min(n.length, a.firstIdx + a.count), S = 9;
  let h = null;
  for (const F of e) {
    let W = 0, V = n.length - 1, G = -1;
    for (; W <= V; ) {
      const X = W + V >> 1, ee = n[X].start - F.timestamp;
      if (Math.abs(ee) <= x) {
        G = X;
        break;
      }
      ee < 0 ? W = X + 1 : V = X - 1;
    }
    if (G < 0 || G < a.firstIdx || G >= M) continue;
    const U = Fe(G, a.firstIdx, d), ae = Te(F.price, f, u.priceY0, u.priceY1);
    if (Math.abs(c.x - U) <= S && Math.abs(c.y - ae) <= S) {
      h = { m: F, x: U, y: ae };
      break;
    }
  }
  if (!h) return;
  const m = ht(h.m.timestamp), v = [
    `${h.m.kind === "entry" ? "▲ ENTRY" : "▼ EXIT"}`,
    `${m}`,
    `@ ${Ae(h.m.price)}`
  ];
  h.m.label && v.push(h.m.label), t.save(), t.font = Be, t.textBaseline = "top", t.textAlign = "left";
  const g = 6, p = 14;
  let T = 0;
  for (const F of v) {
    const W = t.measureText(F).width;
    W > T && (T = W);
  }
  const R = T + g * 2, w = v.length * p + g * 2;
  let C = h.x + 12;
  C + R > s - ze && (C = h.x - 12 - R);
  let b = h.y - w / 2;
  b < u.priceY0 && (b = u.priceY0), b + w > u.priceY1 && (b = u.priceY1 - w), t.fillStyle = l.panelBgSolid, t.strokeStyle = h.m.kind === "entry" ? l.markerEntry : l.markerExit, t.lineWidth = 1, t.fillRect(C, b, R, w), t.strokeRect(C + 0.5, b + 0.5, R - 1, w - 1);
  for (let F = 0; F < v.length; F++) {
    const W = v[F];
    t.fillStyle = F === 0 ? h.m.kind === "entry" ? l.markerEntry : l.markerExit : l.text, t.fillText(W, C + g, b + g + F * p);
  }
  t.restore();
}
function Zl(t, l, e, n, a) {
  if (e.length < 2) return;
  const f = e[1].start - e[0].start, u = Jl(f);
  if (!u) return;
  t.save(), t.font = Be, t.textBaseline = "top", t.textAlign = "right";
  const d = 6, c = 3, s = t.measureText(u).width, i = n - ze - d, x = a - mt + 4;
  t.fillStyle = l.accent, t.fillRect(i - s - d, x - c, s + d * 2, 14 + c * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(u, i, x), t.restore();
}
function Jl(t) {
  if (t <= 0 || !isFinite(t)) return "";
  const l = 1e3, e = 60 * l, n = 60 * e, a = 24 * n, f = 7 * a;
  return t >= f && t % f === 0 ? t / f + "W" : t >= a && t % a === 0 ? t / a + "D" : t >= n && t % n === 0 ? t / n + "h" : t >= e && t % e === 0 ? t / e + "m" : t >= l && t % l === 0 ? t / l + "s" : Math.round(t / e) + "m";
}
function Ql(t, l, e, n, a, f, u, d) {
  if (!n.length) return;
  const c = n.length > 1 ? n[1].start - n[0].start : 6e4, s = Math.max(1, c * 0.5), i = Math.min(n.length, a.firstIdx + a.count), x = (S) => {
    let h = 0, m = n.length - 1;
    for (; h <= m; ) {
      const v = h + m >> 1, g = n[v].start - S;
      if (Math.abs(g) <= s) return v;
      g < 0 ? h = v + 1 : m = v - 1;
    }
    return -1;
  }, M = 7;
  for (const S of e) {
    const h = x(S.timestamp);
    if (h < 0 || h < a.firstIdx || h >= i) continue;
    const m = Fe(h, a.firstIdx, d), v = Te(S.price, f, u.priceY0, u.priceY1);
    if (v < u.priceY0 || v > u.priceY1) continue;
    const g = S.color ?? (S.kind === "entry" ? l.markerEntry : l.markerExit);
    t.fillStyle = g, t.strokeStyle = l.panelBgSolid, t.lineWidth = 1, t.beginPath(), S.kind === "entry" ? (t.moveTo(m, v - M), t.lineTo(m - M, v + M - 1), t.lineTo(m + M, v + M - 1)) : (t.moveTo(m, v + M), t.lineTo(m - M, v - M + 1), t.lineTo(m + M, v - M + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function en(t, l, e, n, a, f = !1) {
  const u = e.max - e.min;
  if (u <= 0) return;
  const d = n.priceY1 - n.priceY0, c = f ? Math.max(2, Math.min(4, Math.round(d / 36))) : 6, s = Xl(u, c), i = Math.ceil(e.min / s) * s, x = f ? Ht : ze;
  t.font = f ? Yl : Be, t.fillStyle = l.text, t.strokeStyle = l.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let M = i; M <= e.max; M += s) {
    const S = Te(M, e, n.priceY0, n.priceY1);
    S < n.priceY0 || S > n.priceY1 || (t.beginPath(), t.moveTo(De, Math.round(S) + 0.5), t.lineTo(a - x, Math.round(S) + 0.5), t.stroke(), t.fillText(Ae(M), a - x + 3, S));
  }
  t.globalAlpha = 1;
}
function tn(t, l, e, n, a, f) {
  if (n.count <= 0 || !e.length) return;
  const d = Math.max(1, Math.floor(n.count / 6));
  t.font = Be, t.fillStyle = l.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const c = Math.min(e.length, n.firstIdx + n.count);
  for (let s = n.firstIdx; s < c; s += d) {
    const i = e[s];
    if (!i) continue;
    const x = Fe(s, n.firstIdx, a);
    t.fillText(ht(i.start), x, f - mt + 4);
  }
  t.globalAlpha = 1;
}
function ln(t, l, e, n, a, f, u, d, c) {
  const s = Math.floor((d.x - De) / u), i = Math.max(0, Math.min(e.length - 1, n.firstIdx + s)), x = e[i];
  if (!x) return;
  const M = Fe(i, n.firstIdx, u);
  t.save(), t.strokeStyle = l.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(M) + 0.5, f.priceY0), t.lineTo(Math.round(M) + 0.5, f.volumeY1 || f.priceY1), t.stroke();
  const S = Math.max(f.priceY0, Math.min(f.priceY1, d.y));
  t.beginPath(), t.moveTo(De, Math.round(S) + 0.5), t.lineTo(c - ze, Math.round(S) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const h = a.max - a.min;
  if (h > 0) {
    const g = a.max - (S - f.priceY0) / (f.priceY1 - f.priceY0) * h, p = Ae(g);
    t.font = Be, t.textBaseline = "middle", t.textAlign = "left";
    const T = t.measureText(p).width, R = 4, w = 2;
    t.fillStyle = l.accent, t.fillRect(c - ze + 2, S - 7 - w, T + R * 2, 14 + w * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(p, c - ze + 2 + R, S);
  }
  t.font = Be, t.textBaseline = "top", t.textAlign = "center";
  const m = ht(x.start), v = t.measureText(m).width;
  t.fillStyle = l.accent, t.fillRect(M - v / 2 - 4, f.volumeY1 + 2, v + 8, 14), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(m, M, f.volumeY1 + 4), t.restore();
}
const Bt = 0.25, Ft = 6, nn = `
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
      float vign = 1.0 - dot(vc, vc) * 0.6;   // softened falloff — see CathodeLog for rationale
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
    const l = t, e = _(null), n = _(null), a = _(0), f = _(0), u = _(0), d = _(1), c = _(null), s = q(() => Math.max(1, l.slotW * d.value));
    let i = null, x = !1, M, S, h, m, v;
    function g() {
      if (!(!n.value || !e.value)) {
        if (v = document.createElement("canvas"), l.flat) {
          x = !0, p();
          return;
        }
        try {
          i = new O.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0 });
        } catch {
          x = !0;
        }
        if (!x && !i.getContext() && (i.dispose(), i = null, x = !0), x) {
          p();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), M = new O.Scene(), S = new O.OrthographicCamera(-1, 1, 1, -1, 0, 1), m = new O.CanvasTexture(v), m.minFilter = O.LinearFilter, m.magFilter = O.LinearFilter, h = new O.ShaderMaterial({
          uniforms: {
            uTex: { value: m },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: nn,
          fragmentShader: on,
          transparent: !0
        }), M.add(new O.Mesh(new O.PlaneGeometry(2, 2), h)), p();
      }
    }
    function p() {
      if (!e.value || !i && !x) return;
      const D = e.value.clientWidth, A = e.value.clientHeight;
      !D || !A || !(v.width !== D || v.height !== A) || (v.width = D, v.height = A, a.value = D, f.value = A, i ? (m && (m.dispose(), m = new O.CanvasTexture(v), m.minFilter = O.LinearFilter, m.magFilter = O.LinearFilter, h && (h.uniforms.uTex.value = m)), i.setPixelRatio(window.devicePixelRatio || 1), i.setSize(D, A)) : n.value && (n.value.width = D, n.value.height = A, n.value.style.width = D + "px", n.value.style.height = A + "px"), T());
    }
    function T() {
      if (!(v != null && v.width)) return;
      if (x) {
        if (!n.value) return;
        Rt(v, {
          candles: l.candles,
          slotW: s.value,
          scrollX: u.value,
          theme: l.theme,
          glow: !1,
          showVolume: l.showVolume,
          volumeFraction: l.volumeFraction,
          hover: c.value,
          overlays: l.overlays,
          markers: l.markers,
          compact: l.compact,
          colors: l.colors
        });
        const A = n.value.getContext("2d");
        A && (A.clearRect(0, 0, n.value.width, n.value.height), A.drawImage(v, 0, 0));
        return;
      }
      if (!i || !h || !m) return;
      const D = l.theme === "paper";
      h.uniforms.uStrength.value = l.curvature / 45 * 0.55, h.uniforms.uScanlines.value = l.scanlines && !D ? 1 : 0, h.uniforms.uVignette.value = D ? 0 : 1, Rt(v, {
        candles: l.candles,
        slotW: s.value,
        scrollX: u.value,
        theme: l.theme,
        glow: l.glow,
        showVolume: l.showVolume,
        volumeFraction: l.volumeFraction,
        hover: c.value,
        overlays: l.overlays,
        markers: l.markers,
        compact: l.compact,
        colors: l.colors
      }), m.needsUpdate = !0, i.render(M, S);
    }
    H(() => l.theme, () => T()), H(() => l.curvature, () => T()), H(() => l.scanlines, () => T()), H(() => l.glow, () => T()), H(() => l.showVolume, () => T()), H(() => l.volumeFraction, () => T()), H(() => l.slotW, () => T()), H(() => l.candles, () => T(), { deep: !1 }), H(() => l.overlays, () => T(), { deep: !1 }), H(() => l.markers, () => T(), { deep: !1 }), H(() => l.compact, () => T()), H(() => l.colors, () => T(), { deep: !0 }), H(() => l.flat, () => {
      console.warn("[CathodeCandle] `flat` is mount-time only; remount the component (e.g. with :key) to switch pipelines.");
    }), H(u, () => T()), H(d, () => T()), H(c, () => T()), H(s, () => T());
    let R = null, w = null, C = 0;
    const b = lt("cathodeResetTick", _(0));
    H(b, () => F());
    function F() {
      cancelAnimationFrame(C), C = requestAnimationFrame(p);
    }
    function W(D) {
      D.preventDefault();
    }
    function V() {
      i == null || i.dispose(), i = null, x = !1, g();
    }
    function G(D) {
      if (!n.value) return [-1, -1];
      const A = n.value.getBoundingClientRect();
      return [D.clientX - A.left, D.clientY - A.top];
    }
    function U(D) {
      var be;
      const A = s.value;
      if (A <= 0) return 0;
      const $ = ((be = l.candles) == null ? void 0 : be.length) ?? 0, me = Math.max(1, Math.floor((a.value || 1) / A)), ce = Math.max(0, $ - me);
      return Math.max(0, Math.min(D, ce * A));
    }
    function ae(D) {
      var me;
      if (D.deltaX !== 0 || D.shiftKey && D.deltaY !== 0) {
        const ce = D.deltaX !== 0 ? D.deltaX : D.deltaY;
        u.value = U(u.value + ce);
        return;
      }
      if (D.deltaY === 0) return;
      const [A] = G(D), $ = s.value;
      if (A >= 0 && $ > 0 && ((me = l.candles) != null && me.length)) {
        const ce = Math.max(1, Math.floor((a.value || 1) / $)), Ee = Math.max(0, l.candles.length - ce - Math.floor(u.value / $)) + (A - 8) / $, E = Math.exp(-D.deltaY * 15e-4), Y = Math.max(Bt, Math.min(Ft, d.value * E));
        d.value = Y;
        const Q = l.slotW * Y, xe = Math.max(1, Math.floor((a.value || 1) / Q)), he = Ee - (A - 8) / Q, J = Math.max(0, l.candles.length - xe - he);
        u.value = U(J * Q);
      } else {
        const ce = Math.exp(-D.deltaY * 15e-4);
        d.value = Math.max(Bt, Math.min(Ft, d.value * ce));
      }
    }
    let X = !1, ee = 0, ve = 0;
    function K(D) {
      D.button === 0 && (X = !0, ee = D.clientX, ve = u.value, c.value = null);
    }
    function ke(D) {
      if (X) {
        const A = D.clientX - ee;
        u.value = U(ve + A);
        return;
      }
    }
    function Ie() {
      X = !1;
    }
    function B(D) {
      if (X) return;
      const [A, $] = G(D);
      if (A < 0 || $ < 0) {
        c.value = null;
        return;
      }
      c.value = { x: A, y: $ };
    }
    function P() {
      c.value = null;
    }
    We(() => {
      document.addEventListener("mousemove", ke), document.addEventListener("mouseup", Ie), Ce(() => {
        var D;
        g(), n.value && (n.value.addEventListener("webglcontextlost", W), n.value.addEventListener("webglcontextrestored", V)), e.value && (R = new ResizeObserver(() => p()), R.observe(e.value), w = new IntersectionObserver((A) => {
          A.some(($) => $.isIntersecting) && F();
        }), w.observe(e.value)), window.addEventListener("resize", F), (D = window.visualViewport) == null || D.addEventListener("resize", F);
      });
    }), Ne(() => {
      var D, A, $;
      document.removeEventListener("mousemove", ke), document.removeEventListener("mouseup", Ie), (D = n.value) == null || D.removeEventListener("webglcontextlost", W), (A = n.value) == null || A.removeEventListener("webglcontextrestored", V), R == null || R.disconnect(), w == null || w.disconnect(), window.removeEventListener("resize", F), ($ = window.visualViewport) == null || $.removeEventListener("resize", F), cancelAnimationFrame(C), i == null || i.dispose();
    });
    const j = q(() => Qe[l.theme] ?? Qe.none), te = q(() => ({
      background: j.value.bg
    }));
    return (D, A) => (re(), se("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: ye(te.value)
    }, [
      Z("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-candle-canvas",
        onWheel: Re(ae, ["prevent"]),
        onMousedown: K,
        onMousemove: B,
        onMouseleave: P
      }, null, 544)
    ], 4));
  }
}), Rn = /* @__PURE__ */ Ge(an, [["__scopeId", "data-v-19358e05"]]), gt = _(0), ft = 28, $e = 12;
let dt = 10, et = "cathode.layout", tt = !1;
const ue = _({});
function rn(t, l = "cathode.layout") {
  if (!tt) {
    tt = !0, et = l;
    try {
      const e = localStorage.getItem(et);
      if (e) {
        ue.value = JSON.parse(e), _t();
        return;
      }
    } catch {
    }
    ue.value = { ...t }, _t();
  }
}
function _t() {
  let t = 10;
  for (const l of Object.values(ue.value))
    typeof (l == null ? void 0 : l.zIndex) == "number" && l.zIndex > t && (t = l.zIndex);
  dt = t;
}
function Ye() {
  localStorage.setItem(et, JSON.stringify(ue.value));
}
function sn(t) {
  tt = !1, localStorage.removeItem(et), ue.value = { ...t }, Ye(), tt = !0, gt.value++;
}
function $t(t) {
  dt++, ue.value[t] && (ue.value[t].zIndex = dt);
}
function un(t, l) {
  ue.value[t].visible = l, Ye();
}
function cn(t, l) {
  ue.value[t].minimized = l, l && (ue.value[t].maximized = !1), Ye();
}
function fn(t, l) {
  ue.value[t].maximized = l, l && (ue.value[t].minimized = !1, $t(t)), Ye();
}
function dn(t, l, e) {
  ue.value[t].x = Math.round(l), ue.value[t].y = Math.round(e), Ye();
}
function vn(t, l, e) {
  ue.value[t].w = Math.round(l), ue.value[t].h = Math.round(e), Ye();
}
function Bn(t, l, e) {
  const n = Math.ceil(Math.sqrt(e.length)), a = Math.ceil(e.length / n), f = Math.floor((t - $e * (n + 1)) / n), u = Math.floor((l - $e * (a + 1)) / a), d = {};
  return e.forEach((c, s) => {
    const i = s % n, x = Math.floor(s / n);
    d[c] = {
      x: $e + i * (f + $e),
      y: $e + x * (u + $e),
      w: f,
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
    containers: ue,
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
    const l = t, { containers: e, load: n, reset: a, setVisible: f } = Ot(), u = _(null);
    Ct("cathodeWorkspace", u), Ct("cathodeResetTick", gt), We(() => {
      if (!u.value) return;
      const { clientWidth: v, clientHeight: g } = u.value, p = l.initialLayout ?? {};
      n(p, l.storageKey ?? "cathode.layout");
      const T = Object.keys(e.value)[0];
      T && d(T);
    });
    function d(v) {
      var p;
      document.querySelectorAll(".cc").forEach((T) => T.classList.remove("cc-focused"));
      const g = (p = u.value) == null ? void 0 : p.querySelector(`#cc-${v}`);
      g && g.classList.add("cc-focused");
    }
    function c() {
      !u.value || !l.initialLayout || a(l.initialLayout);
    }
    function s(v) {
      const g = v.target.closest(".cc");
      g && (document.querySelectorAll(".cc").forEach((p) => p.classList.remove("cc-focused")), g.classList.add("cc-focused"));
    }
    const i = _(!1), x = () => Object.entries(e.value).filter(([, v]) => !v.visible).map(([v]) => v);
    function M(v) {
      f(v, !0), i.value = !1;
    }
    function S(v) {
      if (!i.value) return;
      const g = v.target;
      !g.closest(".ws-restore-menu") && !g.closest(".ws-btn-restore") && (i.value = !1);
    }
    function h(v) {
      v.key === "Escape" && (i.value = !1);
    }
    We(() => {
      document.addEventListener("click", S), document.addEventListener("keydown", h);
    }), Ne(() => {
      document.removeEventListener("click", S), document.removeEventListener("keydown", h);
    });
    function m(v) {
      var g;
      return ((g = l.containerTitles) == null ? void 0 : g[v]) ?? v;
    }
    return (v, g) => (re(), se("div", {
      ref_key: "workspaceEl",
      ref: u,
      class: "cathode-workspace",
      onMousedown: s
    }, [
      ct(v.$slots, "default", {}, void 0, !0),
      ct(v.$slots, "overlay", {}, void 0, !0),
      Z("div", mn, [
        t.initialLayout ? (re(), se("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
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
          i.value ? (re(), se("div", hn, [
            g[3] || (g[3] = Z("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            x().length ? Se("", !0) : (re(), se("div", gn, " No closed panels ")),
            (re(!0), se(rl, null, sl(x(), (p) => (re(), se("div", {
              key: p,
              class: "ws-restore-item",
              onClick: (T) => M(p)
            }, [
              g[2] || (g[2] = Z("span", { class: "ws-restore-icon" }, "⊞", -1)),
              ul(" " + Me(m(p)), 1)
            ], 8, pn))), 128))
          ])) : Se("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Fn = /* @__PURE__ */ Ge(wn, [["__scopeId", "data-v-5838d04b"]]), bn = ["id"], xn = { class: "cc-title" }, yn = {
  key: 0,
  class: "cc-size-badge"
}, Mn = { class: "cc-controls" }, Sn = ["title"], Tn = { class: "cc-body" }, Cn = 200, kn = 80, At = 60, In = /* @__PURE__ */ Xe({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const l = t, { containers: e, bringToFront: n, setVisible: a, setMinimized: f, setMaximized: u, updatePos: d, updateSize: c } = Ot(), s = lt("cathodeWorkspace", _(null)), i = q(() => e.value[l.id]), x = q(() => {
      const B = i.value, P = l.curvature ?? 0;
      if (!B) return {};
      const j = { "--curvature": P };
      return B.maximized ? { ...j, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: B.zIndex } : {
        ...j,
        left: B.x + "px",
        top: B.y + "px",
        width: B.w + "px",
        height: B.minimized ? ft + "px" : B.h + "px",
        zIndex: B.zIndex,
        display: B.visible ? "flex" : "none"
      };
    });
    let M = !1, S = 0, h = 0;
    function m(B) {
      var te;
      if (B.target.closest(".cc-btn") || i.value.maximized) return;
      n(l.id), M = !0;
      const P = (te = s.value) == null ? void 0 : te.querySelector(`#cc-${l.id}`);
      if (!P) return;
      const j = P.getBoundingClientRect();
      S = B.clientX - j.left, h = B.clientY - j.top, document.addEventListener("mousemove", v), document.addEventListener("mouseup", g), B.preventDefault();
    }
    function v(B) {
      var A;
      if (!M || !s.value) return;
      const P = s.value.getBoundingClientRect(), j = ((A = i.value) == null ? void 0 : A.w) ?? 300;
      let te = B.clientX - P.left - S, D = B.clientY - P.top - h;
      te = Math.max(At - j, Math.min(P.width - At, te)), D = Math.max(0, Math.min(P.height - ft, D)), d(l.id, te, D);
    }
    function g() {
      M = !1, document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g);
    }
    let p = !1, T = 0, R = 0, w = 0, C = 0;
    const b = _("");
    function F(B) {
      i.value.maximized || (n(l.id), p = !0, T = B.clientX, R = B.clientY, w = i.value.w, C = i.value.h, document.addEventListener("mousemove", W), document.addEventListener("mouseup", V), B.preventDefault(), B.stopPropagation());
    }
    function W(B) {
      if (!p) return;
      const P = Math.max(Cn, w + (B.clientX - T)), j = Math.max(kn, C + (B.clientY - R));
      c(l.id, P, j), b.value = `${Math.round(P)}×${Math.round(j)}`;
    }
    function V() {
      p = !1, b.value = "", document.removeEventListener("mousemove", W), document.removeEventListener("mouseup", V), G.value++;
    }
    const G = _(0);
    H(gt, () => {
      G.value++;
    }), Ne(() => {
      var B;
      document.removeEventListener("mousemove", v), document.removeEventListener("mouseup", g), document.removeEventListener("mousemove", W), document.removeEventListener("mouseup", V), (B = U.value) == null || B.removeEventListener("scroll", X), ee();
    });
    const U = _(null);
    function ae(B) {
      if (l.canvas) return [];
      const P = B.children[0];
      return P ? Array.from(P.children) : [];
    }
    function X() {
      const B = U.value, P = l.curvature ?? 0;
      if (!B) return;
      const j = ae(B);
      if (!j.length) return;
      const te = B.clientHeight, D = te / 2, A = P * 38e-4;
      j.forEach(($) => {
        if (!$.dataset.origFs) {
          const he = getComputedStyle($);
          $.dataset.origFs = he.fontSize, $.dataset.origLh = he.lineHeight;
        }
        if (P === 0) {
          $.style.fontSize = "", $.style.lineHeight = "";
          return;
        }
        const me = $.getBoundingClientRect(), ce = B.getBoundingClientRect(), be = me.top - ce.top + me.height / 2, Ee = Math.min(1, Math.abs(be - D) / (te / 2)), E = 1 + A * Math.cos(Ee * Math.PI / 2), Y = parseFloat($.dataset.origFs), Q = $.dataset.origLh, xe = Q === "normal" ? Y * 1.4 : parseFloat(Q);
        isNaN(Y) || ($.style.fontSize = `${(Y * E).toFixed(2)}px`), isNaN(xe) || ($.style.lineHeight = `${(xe * E).toFixed(2)}px`);
      });
    }
    function ee() {
      const B = U.value;
      B && ae(B).forEach((P) => {
        P.style.fontSize = "", P.style.lineHeight = "", delete P.dataset.origFs, delete P.dataset.origLh;
      });
    }
    H(() => l.curvature, (B) => {
      (B ?? 0) === 0 ? ee() : X();
    }), We(() => {
      var B;
      (B = U.value) == null || B.addEventListener("scroll", X, { passive: !0 }), Ce(X);
    });
    function ve() {
      f(l.id, !i.value.minimized), Ce(() => {
        G.value++;
      });
    }
    function K() {
      u(l.id, !i.value.maximized), Ce(() => {
        G.value++;
      });
    }
    function ke() {
      a(l.id, !1);
    }
    function Ie() {
      n(l.id);
    }
    return (B, P) => i.value && i.value.visible ? (re(), se("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: cl(["cc", { "cc-minimized": i.value.minimized, "cc-maximized": i.value.maximized, "cc-has-canvas": t.canvas }]),
      style: ye(x.value),
      onMousedown: Ie
    }, [
      Z("div", {
        class: "cc-titlebar",
        onMousedown: m
      }, [
        P[0] || (P[0] = Z("span", { class: "cc-status-dot" }, null, -1)),
        Z("span", xn, Me(t.title), 1),
        b.value ? (re(), se("span", yn, Me(b.value), 1)) : Se("", !0),
        Z("div", Mn, [
          Z("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Re(ve, ["stop"])
          }, "─"),
          Z("button", {
            class: "cc-btn cc-btn-max",
            title: i.value.maximized ? "Restore" : "Maximize",
            onClick: Re(K, ["stop"])
          }, Me(i.value.maximized ? "⤡" : "⤢"), 9, Sn),
          Z("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Re(ke, ["stop"])
          }, "✕")
        ])
      ], 32),
      Wt(Z("div", Tn, [
        Z("div", {
          ref_key: "bodyEl",
          ref: U,
          class: "cc-screen",
          onScroll: X
        }, [
          ct(B.$slots, "default", { resizeKey: G.value }, void 0, !0),
          P[1] || (P[1] = Z("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [fl, !i.value.minimized]
      ]),
      !i.value.minimized && !i.value.maximized ? (re(), se("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Re(F, ["stop"])
      }, null, 32)) : Se("", !0)
    ], 46, bn)) : Se("", !0);
  }
}), _n = /* @__PURE__ */ Ge(In, [["__scopeId", "data-v-d8a49f79"]]);
export {
  Qe as CANDLE_THEME_COLORS,
  Rn as CathodeCandle,
  _n as CathodeContainer,
  Dn as CathodeGrid,
  Fl as CathodeLog,
  En as CathodeTerminal,
  Fn as CathodeWorkspace,
  Je as LOG_THEME_COLORS,
  Bn as buildDefaultLayout,
  Ot as useCathodeLayout
};
