import { defineComponent as Xe, ref as z, reactive as ot, computed as X, watch as P, inject as Qe, nextTick as Te, onMounted as He, onUnmounted as Ne, openBlock as ie, createElementBlock as re, normalizeStyle as be, createElementVNode as j, withModifiers as Re, withKeys as Jt, createCommentVNode as Me, toDisplayString as ye, provide as yt, renderSlot as rt, createVNode as Qt, Transition as el, withCtx as tl, Fragment as ll, renderList as nl, createTextVNode as ol, normalizeClass as al, withDirectives as il, vShow as rl } from "vue";
import * as Y from "three";
const Be = {
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
}, oe = 30, Mt = 12, sl = 10;
function St(l, t) {
  const e = l.getContext("2d");
  if (!e) return;
  const o = l.width, i = l.height, r = Be[t.theme] ?? Be.none, { cols: f, rows: v, pinnedRows: c, rowHeight: s, scrollY: u, scrollX: E, glow: T } = t;
  e.clearRect(0, 0, o, i), e.fillStyle = r.bg, e.fillRect(0, 0, o, i), e.save(), e.beginPath(), e.rect(0, 0, o, i), e.clip();
  const F = c.length * s, w = i - oe - F;
  e.fillStyle = r.headerBg, e.fillRect(0, 0, o, oe), e.textBaseline = "middle", e.textAlign = "left";
  let h = -E;
  for (let g = 0; g < f.length; g++) {
    const S = f[g];
    if (h + S.width <= 0) {
      h += S.width;
      continue;
    }
    if (h >= o) break;
    const B = !!t.colFilters[S.colId], I = t.sortColId === S.colId, R = (S.colDef.headerName ?? S.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(h, 0, S.width, oe), e.clip(), e.font = `bold ${sl}px system-ui, -apple-system, sans-serif`, e.fillStyle = B ? r.accent : r.textHeader, T && (e.shadowBlur = 6, e.shadowColor = r.textHeader), e.fillText(R, h + 8, oe / 2), e.shadowBlur = 0, I) {
      const p = e.measureText(R).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = r.accent, e.fillText(t.sortDir === "asc" ? "▲" : "▼", h + 8 + p + 4, oe / 2);
    }
    S.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = B ? r.accent : r.textHeader, e.globalAlpha = B ? 1 : 0.38, e.fillText("⌕", h + S.width - 20, oe / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(h + S.width - 0.5, 0), e.lineTo(h + S.width - 0.5, oe), e.stroke(), h += S.width;
  }
  e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, oe - 0.5), e.lineTo(o, oe - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, oe, o, w), e.clip();
  const x = Math.max(0, Math.floor(u / s)), m = Math.min(v.length, Math.ceil((u + w) / s));
  for (let g = x; g < m; g++) {
    const S = v[g], B = oe + g * s - u;
    g % 2 === 1 && (e.fillStyle = r.rowAlt, e.fillRect(0, B, o, s)), g === t.hoveredRow && g !== t.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, B, o, s)), g === t.selectedRow && (e.fillStyle = cl(r.accent, 0.1), e.fillRect(0, B, o, s)), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, B + s - 0.5), e.lineTo(o, B + s - 0.5), e.stroke();
    let I = -E;
    for (let R = 0; R < f.length; R++) {
      const p = f[R];
      if (I + p.width <= 0) {
        I += p.width;
        continue;
      }
      if (I >= o) break;
      const $ = t.getCellStyle(p, S), U = $.color ?? r.text, O = $.textAlign ?? "left", ee = t.formatCell(p, S);
      e.save(), e.beginPath(), e.rect(I + 1, B, p.width - 2, s), e.clip(), e.font = `${Mt}px system-ui, -apple-system, sans-serif`, e.fillStyle = U, e.textBaseline = "middle", T && (e.shadowBlur = 4, e.shadowColor = U), O === "right" ? (e.textAlign = "right", e.fillText(ee, I + p.width - 8, B + s / 2)) : (e.textAlign = "left", e.fillText(ee, I + 8, B + s / 2)), e.shadowBlur = 0, e.restore(), g === t.selectedRow && R === t.selectedCol && (e.strokeStyle = r.accent, e.lineWidth = 2, e.strokeRect(I + 1.5, B + 1.5, p.width - 3, s - 3)), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(I + p.width - 0.5, B), e.lineTo(I + p.width - 0.5, B + s), e.stroke(), I += p.width;
    }
  }
  if (e.restore(), c.length > 0) {
    const g = i - F;
    e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, g - 0.5), e.lineTo(o, g - 0.5), e.stroke();
    for (let S = 0; S < c.length; S++) {
      const B = c[S], I = g + S * s;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, I, o, s);
      let R = -E;
      for (let p = 0; p < f.length; p++) {
        const $ = f[p];
        if (R + $.width <= 0) {
          R += $.width;
          continue;
        }
        if (R >= o) break;
        const U = t.getCellStyle($, B), O = U.color ?? r.text, ee = U.textAlign ?? "left", J = t.formatCell($, B);
        e.save(), e.beginPath(), e.rect(R + 1, I, $.width - 2, s), e.clip(), e.font = `bold ${Mt}px system-ui, -apple-system, sans-serif`, e.fillStyle = O, e.textBaseline = "middle", ee === "right" ? (e.textAlign = "right", e.fillText(J, R + $.width - 8, I + s / 2)) : (e.textAlign = "left", e.fillText(J, R + 8, I + s / 2)), e.restore(), e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(R + $.width - 0.5, I), e.lineTo(R + $.width - 0.5, I + s), e.stroke(), R += $.width;
      }
      e.strokeStyle = r.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, I + s - 0.5), e.lineTo(o, I + s - 0.5), e.stroke();
    }
  }
  e.restore();
}
function cl(l, t) {
  if (l.startsWith("rgba") || l.startsWith("rgb"))
    return l.replace(/[\d.]+\)$/, `${t})`);
  const e = parseInt(l.slice(1, 3), 16), o = parseInt(l.slice(3, 5), 16), i = parseInt(l.slice(5, 7), 16);
  return `rgba(${e},${o},${i},${t})`;
}
function at(l, t) {
  let e = 0;
  for (let o = 0; o < l; o++) e += t[o].width;
  return e;
}
function ul(l, t, e) {
  return l >= t + e - 24 && l < t + e;
}
function Ct(l, t, e) {
  const o = t + e;
  return l >= o - 6 && l <= o + 1;
}
function Lt(l, t, e, o, i, r, f, v, c) {
  const s = l + c;
  let u = -1, E = 0;
  for (let h = 0; h < e.length; h++) {
    if (s >= E && s < E + e[h].width) {
      u = h;
      break;
    }
    E += e[h].width;
  }
  if (t < oe) return { area: "header", colIdx: u, rowIdx: -1 };
  const T = v * i;
  if (T > 0 && t >= f - T) {
    const h = Math.floor((t - (f - T)) / i);
    return { area: "pinned", colIdx: u, rowIdx: h };
  }
  const F = t - oe + r, w = Math.floor(F / i);
  return w >= 0 && w < o ? { area: "body", colIdx: u, rowIdx: w } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const dl = ["value"], vl = ["disabled"], fl = ["disabled"], ml = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, hl = `
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
`, gl = 28, pl = 600, wl = /* @__PURE__ */ Xe({
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
  setup(l, { emit: t }) {
    const e = l, o = t, i = z(e.rowData ?? []), r = z(e.pinnedBottomRowData ?? []), f = z(""), v = z(null), c = ot({}), s = ot({}), u = ot(/* @__PURE__ */ new Set()), E = z(0), T = z(0), F = z(0), w = z(0), h = z(0), x = z(-1), m = z(null), g = z(null), S = z({ x: 0, y: oe }), B = z("");
    function I(n) {
      return n.colId ?? n.field ?? (n.headerName ? n.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const R = X(() => {
      const n = e.defaultColDef ?? {};
      return e.columnDefs.filter((a) => !u.has(I(a))).map((a) => {
        const d = I(a), b = { ...n, ...a };
        return { colId: d, colDef: b, width: s[d] ?? b.width ?? 100 };
      });
    }), p = X(() => {
      const n = T.value;
      if (!n) return R.value;
      const a = R.value.reduce((y, M) => y + M.width, 0);
      if (!a || a >= n) return R.value;
      const d = n / a;
      let b = 0;
      return R.value.map((y, M) => {
        const V = M === R.value.length - 1 ? n - b : Math.max(8, Math.round(y.width * d));
        return b += V, { ...y, width: V };
      });
    }), $ = X(() => {
      const n = p.value.reduce((a, d) => a + d.width, 0);
      return Math.max(0, n - T.value);
    }), U = X(() => {
      const n = r.value.length * e.rowHeight;
      return Math.max(0, F.value - oe - n);
    }), O = X(
      () => Math.max(0, N.value.length * e.rowHeight - U.value)
    ), ee = X(
      () => Math.max(1, Math.floor(U.value / e.rowHeight))
    ), J = X(
      () => N.value.length === 0 ? 0 : Math.min(N.value.length - 1, Math.floor(w.value / e.rowHeight))
    ), Ie = X(
      () => Math.min(N.value.length - 1, J.value + ee.value - 1)
    );
    function K(n, a) {
      if (a.colDef.valueGetter) return a.colDef.valueGetter({ data: n, colDef: a.colDef });
      if (a.colDef.field) return n[a.colDef.field];
    }
    function de(n, a) {
      const d = K(a, n);
      return n.colDef.valueFormatter ? n.colDef.valueFormatter({ value: d, data: a, colDef: n.colDef }) ?? "" : n.colDef.cellRenderer ? (n.colDef.cellRenderer({ value: d, data: a, colDef: n.colDef }) ?? "").replace(/<[^>]+>/g, "") : d == null ? "" : String(d);
    }
    function pe(n, a) {
      return n.colDef.cellStyle ? typeof n.colDef.cellStyle == "function" ? n.colDef.cellStyle({ value: K(a, n), data: a, colDef: n.colDef }) ?? {} : n.colDef.cellStyle : {};
    }
    const N = X(() => {
      E.value;
      let n = i.value;
      const a = f.value.trim().toLowerCase();
      a && (n = n.filter(
        (d) => R.value.some(
          (b) => String(K(d, b) ?? "").toLowerCase().includes(a)
        )
      ));
      for (const [d, b] of Object.entries(c)) {
        if (!b) continue;
        const y = R.value.find((M) => M.colId === d);
        if (y)
          if (b.startsWith("__eq__")) {
            const M = b.slice(6).toLowerCase();
            n = n.filter((_) => String(K(_, y) ?? "").toLowerCase() === M);
          } else {
            const M = b.toLowerCase();
            n = n.filter((_) => String(K(_, y) ?? "").toLowerCase().includes(M));
          }
      }
      if (v.value) {
        const { colId: d, dir: b } = v.value, y = R.value.find((M) => M.colId === d);
        y && (n = [...n].sort((M, _) => {
          const V = K(M, y), le = K(_, y);
          let ne = 0;
          return y.colDef.comparator ? ne = y.colDef.comparator(V, le) : typeof V == "number" && typeof le == "number" ? ne = V - le : ne = String(V ?? "").localeCompare(String(le ?? ""), void 0, { numeric: !0 }), b === "asc" ? ne : -ne;
        }));
      }
      return n;
    });
    P(N, () => {
      w.value = 0, m.value = null;
    }), P($, () => {
      h.value = Math.min(h.value, $.value);
    }), P(O, () => {
      w.value = Math.min(w.value, O.value);
    });
    function Se(n) {
      const a = n * e.rowHeight, d = a + e.rowHeight;
      a < w.value ? w.value = a : d > w.value + U.value && (w.value = Math.min(O.value, d - U.value));
    }
    function Ce() {
      w.value = Math.max(0, w.value - U.value), ue();
    }
    function k() {
      w.value = Math.min(O.value, w.value + U.value), ue();
    }
    let A = !1, G = "", Q = 0, C = 0, D = !1, H = !1, ve = 0, se = 0, we = 0, ke = 0, L = !1;
    function W(n, a) {
      var d;
      A = !0, G = n, Q = a, C = ((d = p.value.find((b) => b.colId === n)) == null ? void 0 : d.width) ?? 100, D = !1;
    }
    function Z(n) {
      if (H) {
        const M = ve - n.clientX, _ = se - n.clientY;
        (Math.abs(M) > 4 || Math.abs(_) > 4) && (L = !0), h.value = Math.max(0, Math.min($.value, we + M)), w.value = Math.max(0, Math.min(O.value, ke + _)), ue();
        return;
      }
      if (!A) return;
      const a = T.value, d = Math.max(30, C + (n.clientX - Q)), b = R.value.filter((M) => M.colId !== G).reduce((M, _) => M + _.width, 0), y = a - d;
      y > 10 && (s[G] = Math.max(10, Math.round(d * b / y))), ue();
    }
    function xe() {
      H && (L && (D = !0), H = !1), A && (A = !1, D = !0, o("column-resized"));
    }
    const fe = z(null), q = z(null), Ht = Qe("cathodeResetTick", z(0));
    P(Ht, () => Fe());
    let te = null, Ee = !1, et, ft, Le, me, ce;
    function mt() {
      if (!(!q.value || !fe.value)) {
        ce = document.createElement("canvas");
        try {
          te = new Y.WebGLRenderer({ canvas: q.value, antialias: !1, alpha: !0 });
        } catch {
          Ee = !0;
        }
        if (!Ee && !te.getContext() && (te.dispose(), te = null, Ee = !0), Ee) {
          _e();
          return;
        }
        te.setPixelRatio(1), te.setClearColor(0, 0), et = new Y.Scene(), ft = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), me = new Y.CanvasTexture(ce), me.minFilter = Y.LinearFilter, me.magFilter = Y.LinearFilter, Le = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: me },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new Y.Color(0) }
          },
          vertexShader: ml,
          fragmentShader: hl,
          transparent: !0
        }), et.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), Le)), _e();
      }
    }
    function _e() {
      if (!fe.value || !te && !Ee) return;
      const n = fe.value.clientWidth, a = fe.value.clientHeight - (e.pagination ? gl : 0);
      if (!n || !a) return;
      const d = ce.width !== n || ce.height !== a;
      ce.width = n, ce.height = a, T.value = n, F.value = a, h.value = Math.max(0, Math.min($.value, h.value)), w.value = Math.max(0, Math.min(O.value, w.value)), te ? (d && me && (me.dispose(), me = new Y.CanvasTexture(ce), me.minFilter = Y.LinearFilter, me.magFilter = Y.LinearFilter, Le && (Le.uniforms.uTex.value = me)), te.setPixelRatio(window.devicePixelRatio || 1), te.setSize(n, a)) : q.value && (q.value.width = n, q.value.height = a, q.value.style.width = n + "px", q.value.style.height = a + "px"), ue();
    }
    function ue() {
      var d, b, y, M, _, V, le, ne;
      if (!(ce != null && ce.width)) return;
      if (Ee) {
        if (!q.value) return;
        St(ce, {
          cols: p.value,
          rows: N.value,
          pinnedRows: r.value,
          rowHeight: e.rowHeight,
          scrollY: w.value,
          scrollX: h.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((d = v.value) == null ? void 0 : d.colId) ?? null,
          sortDir: ((b = v.value) == null ? void 0 : b.dir) ?? null,
          colFilters: c,
          hoveredRow: x.value,
          selectedRow: ((y = m.value) == null ? void 0 : y.row) ?? -1,
          selectedCol: ((M = m.value) == null ? void 0 : M.col) ?? -1,
          formatCell: de,
          getCellStyle: pe
        });
        const bt = q.value.getContext("2d");
        bt && bt.drawImage(ce, 0, 0);
        return;
      }
      if (!te || !Le || !me) return;
      const n = Be[e.theme] ?? Be.none, a = e.theme === "paper";
      Le.uniforms.uStrength.value = e.curvature / 45 * 0.55, Le.uniforms.uScanlines.value = e.scanlines && !a ? 1 : 0, Le.uniforms.uVignette.value = a ? 0 : 1, Le.uniforms.uBezel.value.set(n.bg), St(ce, {
        cols: p.value,
        rows: N.value,
        pinnedRows: r.value,
        rowHeight: e.rowHeight,
        scrollY: w.value,
        scrollX: h.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((_ = v.value) == null ? void 0 : _.colId) ?? null,
        sortDir: ((V = v.value) == null ? void 0 : V.dir) ?? null,
        colFilters: c,
        hoveredRow: x.value,
        selectedRow: ((le = m.value) == null ? void 0 : le.row) ?? -1,
        selectedCol: ((ne = m.value) == null ? void 0 : ne.col) ?? -1,
        formatCell: de,
        getCellStyle: pe
      }), me.needsUpdate = !0, te.render(et, ft);
    }
    function tt(n) {
      if (!q.value) return [-1, -1];
      const a = q.value.getBoundingClientRect();
      return [n.clientX - a.left, n.clientY - a.top];
    }
    let lt = 0;
    function Yt(n) {
      g.value = null;
      const a = Date.now();
      if (n.deltaX !== 0) {
        lt = a, h.value = Math.max(0, Math.min($.value, h.value + n.deltaX)), ue();
        return;
      }
      if (n.shiftKey && n.deltaY !== 0) {
        lt = a, h.value = Math.max(0, Math.min($.value, h.value + n.deltaY)), ue();
        return;
      }
      a - lt < pl || (w.value = Math.max(0, Math.min(O.value, w.value + n.deltaY)), ue());
    }
    function Pt(n) {
      if (A) return;
      const [a, d] = tt(n);
      if (a < 0) {
        x.value = -1, ue();
        return;
      }
      const b = Lt(
        a,
        d,
        p.value,
        N.value.length,
        e.rowHeight,
        w.value,
        ce.height,
        r.value.length,
        h.value
      );
      if (x.value = b.area === "body" ? b.rowIdx : -1, b.area === "header" && b.colIdx >= 0) {
        const y = p.value[b.colIdx], M = at(b.colIdx, p.value), _ = a + h.value;
        q.value.style.cursor = y && Ct(_, M, y.width) ? "col-resize" : "pointer";
      } else b.area === "body" ? q.value.style.cursor = "pointer" : q.value.style.cursor = "default";
      ue();
    }
    function $t() {
      x.value = -1, ue();
    }
    function Vt(n) {
      const [a, d] = tt(n);
      if (a < 0) return;
      if (d >= oe) {
        H = !0, L = !1, ve = n.clientX, se = n.clientY, we = h.value, ke = w.value;
        return;
      }
      const b = a + h.value;
      for (let y = 0; y < p.value.length; y++) {
        const M = p.value[y], _ = at(y, p.value);
        if (M.colDef.resizable !== !1 && Ct(b, _, M.width)) {
          W(M.colId, n.clientX);
          return;
        }
      }
    }
    function Ot(n) {
      var y, M, _;
      if (D) {
        D = !1;
        return;
      }
      if (A) return;
      const [a, d] = tt(n);
      if (a < 0) {
        g.value = null;
        return;
      }
      const b = Lt(
        a,
        d,
        p.value,
        N.value.length,
        e.rowHeight,
        w.value,
        ce.height,
        r.value.length,
        h.value
      );
      if (b.area === "header" && b.colIdx >= 0) {
        const V = p.value[b.colIdx], le = at(b.colIdx, p.value), ne = a + h.value;
        V.colDef.filter && ul(ne, le, V.width) ? (n.stopPropagation(), g.value === V.colId ? g.value = null : (g.value = V.colId, B.value = (y = c[V.colId]) != null && y.startsWith("__eq__") ? c[V.colId].slice(6) : c[V.colId] ?? "", S.value = { x: Math.max(0, le - h.value), y: oe })) : V.colDef.sortable !== !1 && (g.value = null, v.value = ((M = v.value) == null ? void 0 : M.colId) === V.colId ? v.value.dir === "asc" ? { colId: V.colId, dir: "desc" } : null : { colId: V.colId, dir: "asc" }, o("sort-changed"));
        return;
      }
      if (g.value = null, b.area === "body" && b.rowIdx >= 0 && b.colIdx >= 0) {
        const V = b.rowIdx;
        m.value = { row: V, col: b.colIdx }, (_ = q.value) == null || _.focus();
        const le = N.value[V], ne = p.value[b.colIdx];
        le && ne && (o("row-clicked", { data: le, event: n }), o("cell-selected", { data: le, row: V, col: b.colIdx, colId: ne.colId }));
      }
    }
    function ht(n) {
      var a, d;
      g.value && ((d = (a = n.target).closest) != null && d.call(a, ".cathode-filter-popup") || (g.value = null));
    }
    function Xt(n) {
      var y;
      if (!T.value) return;
      let a = 0;
      for (let M = 0; M < n; M++) a += p.value[M].width;
      const d = ((y = p.value[n]) == null ? void 0 : y.width) ?? 0, b = a - h.value;
      b < 0 ? h.value = Math.max(0, a) : b + d > T.value && (h.value = Math.min($.value, a + d - T.value));
    }
    function Nt(n) {
      var V;
      const a = p.value, d = a.length - 1, b = N.value.length - 1;
      if (!m.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(n.key) && (n.preventDefault(), m.value = { row: J.value, col: 0 });
        return;
      }
      let { row: y, col: M } = m.value;
      const _ = (le, ne) => {
        y = Math.max(0, Math.min(b, le)), M = Math.max(0, Math.min(d, ne)), m.value = { row: y, col: M }, Se(y), Xt(M);
      };
      switch (n.key) {
        case "ArrowDown":
          n.preventDefault(), _(y + 1, M);
          break;
        case "ArrowUp":
          n.preventDefault(), _(y - 1, M);
          break;
        case "ArrowRight":
          n.preventDefault(), M < d ? _(y, M + 1) : _(y + 1, 0);
          break;
        case "ArrowLeft":
          n.preventDefault(), M > 0 ? _(y, M - 1) : _(y - 1, d);
          break;
        case "Tab":
          n.preventDefault(), n.shiftKey ? M > 0 ? _(y, M - 1) : _(y - 1, d) : M < d ? _(y, M + 1) : _(y + 1, 0);
          break;
        case "Enter":
          n.preventDefault(), n.shiftKey ? _(y - 1, M) : _(y + 1, M);
          break;
        case "Home":
          n.preventDefault(), n.ctrlKey || n.metaKey ? _(0, 0) : _(y, 0);
          break;
        case "End":
          n.preventDefault(), n.ctrlKey || n.metaKey ? _(b, d) : _(y, d);
          break;
        case "PageDown":
          n.preventDefault(), _(Math.min(b, y + ee.value), M);
          break;
        case "PageUp":
          n.preventDefault(), _(Math.max(0, y - ee.value), M);
          break;
        case "Escape":
          m.value = null;
          break;
        case "c":
        case "C":
          if (n.ctrlKey || n.metaKey) {
            n.preventDefault();
            const le = N.value[y], ne = a[M];
            le && ne && ((V = navigator.clipboard) == null || V.writeText(de(ne, le)).catch(() => {
            }));
          }
          break;
      }
    }
    function Gt(n) {
      const a = n.target.value;
      B.value = a, a ? c[g.value] = a : delete c[g.value], o("filter-changed");
    }
    function gt() {
      g.value && delete c[g.value], B.value = "", g.value = null, o("filter-changed");
    }
    const Ut = {
      setGridOption(n, a) {
        n === "rowData" ? i.value = a : n === "pinnedBottomRowData" ? r.value = a : n === "quickFilterText" && (f.value = a);
      },
      getColumnState() {
        return e.columnDefs.map((n) => {
          var d, b;
          const a = I(n);
          return {
            colId: a,
            hide: u.has(a),
            sort: ((d = v.value) == null ? void 0 : d.colId) === a ? v.value.dir : null,
            sortIndex: ((b = v.value) == null ? void 0 : b.colId) === a ? 0 : null,
            width: s[a] ?? n.width
          };
        });
      },
      applyColumnState({ state: n }) {
        for (const a of n)
          a.hide === !0 && u.add(a.colId), a.hide === !1 && u.delete(a.colId), a.sort && (v.value = { colId: a.colId, dir: a.sort }), a.width && (s[a.colId] = a.width);
      },
      setFilterModel(n) {
        for (const a of Object.keys(c)) delete c[a];
        if (n)
          for (const [a, d] of Object.entries(n))
            (d == null ? void 0 : d.type) === "equals" ? c[a] = `__eq__${d.filter}` : d != null && d.filter && (c[a] = d.filter);
      },
      getFilterModel() {
        const n = {};
        for (const [a, d] of Object.entries(c))
          d && (n[a] = d.startsWith("__eq__") ? { type: "equals", filter: d.slice(6) } : { type: "contains", filter: d });
        return n;
      },
      async setColumnFilterModel(n, a) {
        a ? a.type === "equals" ? c[n] = `__eq__${a.filter}` : c[n] = a.filter ?? "" : delete c[n];
      },
      onFilterChanged() {
      },
      refreshCells() {
        E.value++;
      },
      exportDataAsCsv({ fileName: n = "export.csv" } = {}) {
        const a = R.value, d = a.map((_) => _.colDef.headerName ?? _.colId).join(","), b = N.value.map(
          (_) => a.map((V) => `"${String(de(V, _)).replace(/"/g, '""')}"`).join(",")
        ), y = new Blob([[d, ...b].join(`
`)], { type: "text/csv" }), M = URL.createObjectURL(y);
        Object.assign(document.createElement("a"), { href: M, download: n }).click(), URL.revokeObjectURL(M);
      },
      resize() {
        _e();
      },
      resetColumnState() {
        u.clear();
        for (const a of e.columnDefs)
          a.hide && u.add(I(a));
        const n = e.columnDefs.find((a) => a.sort);
        v.value = n ? { colId: I(n), dir: n.sort } : null;
        for (const a of Object.keys(s)) delete s[a];
        for (const a of Object.keys(c)) delete c[a];
        f.value = "", w.value = 0, m.value = null, g.value = null;
      }
    };
    P(
      [N, () => r.value, p, w, x, m],
      () => Te(ue)
    ), P(() => e.theme, () => ue()), P(() => e.curvature, () => Te(_e)), P(() => e.scanlines, () => ue()), P(() => e.glow, () => ue()), P(m, (n) => {
      if (!n) return;
      const a = N.value[n.row], d = p.value[n.col];
      a && d && o("cell-selected", { data: a, row: n.row, col: n.col, colId: d.colId });
    });
    let Ye = null, Pe = null, nt = 0;
    function Fe() {
      cancelAnimationFrame(nt), nt = requestAnimationFrame(_e);
    }
    function pt(n) {
      n.preventDefault();
    }
    function wt() {
      te == null || te.dispose(), te = null, Ee = !1, mt();
    }
    He(() => {
      for (const n of e.columnDefs)
        n.hide && u.add(I(n)), n.sort && !v.value && (v.value = { colId: I(n), dir: n.sort });
      i.value = e.rowData ?? [], r.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", ht), document.addEventListener("mousemove", Z), document.addEventListener("mouseup", xe), Te(() => {
        var n;
        mt(), q.value && (q.value.addEventListener("webglcontextlost", pt), q.value.addEventListener("webglcontextrestored", wt)), fe.value && (Ye = new ResizeObserver(() => _e()), Ye.observe(fe.value), Pe = new IntersectionObserver((a) => {
          a.some((d) => d.isIntersecting) && Fe();
        }), Pe.observe(fe.value)), window.addEventListener("resize", Fe), (n = window.visualViewport) == null || n.addEventListener("resize", Fe), o("grid-ready", { api: Ut });
      });
    }), Ne(() => {
      var n, a, d;
      document.removeEventListener("click", ht, !0), document.removeEventListener("mousemove", Z), document.removeEventListener("mouseup", xe), (n = q.value) == null || n.removeEventListener("webglcontextlost", pt), (a = q.value) == null || a.removeEventListener("webglcontextrestored", wt), Ye == null || Ye.disconnect(), Pe == null || Pe.disconnect(), window.removeEventListener("resize", Fe), (d = window.visualViewport) == null || d.removeEventListener("resize", Fe), cancelAnimationFrame(nt), te == null || te.dispose();
    });
    const he = X(() => Be[e.theme] ?? Be.none), Kt = X(() => ({
      position: "absolute",
      left: `${S.value.x}px`,
      top: `${S.value.y}px`,
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
    })), qt = X(() => ({
      background: he.value.bg,
      border: `1px solid ${he.value.border}`,
      color: he.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), jt = X(() => ({
      background: he.value.headerBg,
      borderTop: `1px solid ${he.value.border}`,
      color: he.value.text
    })), Zt = X(() => ({
      background: he.value.bg
    })), xt = X(() => he.value.accent);
    return (n, a) => {
      var d, b;
      return ie(), re("div", {
        ref_key: "wrapEl",
        ref: fe,
        class: "cathode-wrap",
        style: be(Zt.value)
      }, [
        j("canvas", {
          ref_key: "canvasEl",
          ref: q,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Re(Yt, ["prevent"]),
          onMousemove: Pt,
          onMouseleave: $t,
          onMousedown: Vt,
          onClick: Ot,
          onKeydown: Nt
        }, null, 544),
        g.value ? (ie(), re("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: be(Kt.value),
          onClick: a[0] || (a[0] = Re(() => {
          }, ["stop"]))
        }, [
          j("input", {
            style: be(qt.value),
            value: B.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Gt,
            onKeydown: Jt(gt, ["escape"])
          }, null, 44, dl),
          B.value ? (ie(), re("button", {
            key: 0,
            style: be({
              background: "none",
              border: "none",
              color: he.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: gt
          }, "✕", 4)) : Me("", !0)
        ], 4)) : Me("", !0),
        l.pagination ? (ie(), re("div", {
          key: 1,
          class: "cathode-pagination",
          style: be(jt.value)
        }, [
          j("button", {
            disabled: w.value <= 0,
            onClick: a[1] || (a[1] = (y) => Ce())
          }, "◀", 8, vl),
          j("span", null, ye((J.value + 1).toLocaleString()) + "–" + ye(Math.min(N.value.length, Ie.value + 1).toLocaleString()) + " / " + ye(N.value.length.toLocaleString()), 1),
          j("button", {
            disabled: w.value >= O.value,
            onClick: a[2] || (a[2] = (y) => k())
          }, "▶", 8, fl),
          j("span", {
            class: "cathode-page-info",
            style: be({ color: xt.value })
          }, ye(N.value.length.toLocaleString()) + " rows ", 5),
          m.value ? (ie(), re("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: be({ color: xt.value })
          }, ye(((d = p.value[m.value.col]) == null ? void 0 : d.colDef.headerName) ?? ((b = p.value[m.value.col]) == null ? void 0 : b.colId)) + " : " + ye(de(p.value[m.value.col], N.value[m.value.row])), 5)) : Me("", !0)
        ], 4)) : Me("", !0)
      ], 4);
    };
  }
}), Ge = (l, t) => {
  const e = l.__vccOpts || l;
  for (const [o, i] of t)
    e[o] = i;
  return e;
}, dn = /* @__PURE__ */ Ge(wl, [["__scopeId", "data-v-07901c91"]]), Ke = {
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
function xl(l, t) {
  switch (t) {
    case "warn":
      return l.levelWarn;
    case "error":
      return l.levelError;
    case "debug":
      return l.levelDebug;
    case "success":
      return l.levelSuccess;
    case "info":
    default:
      return l.levelInfo;
  }
}
const bl = 12, ge = 18, Ue = 10, We = 6, ut = `${bl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function yl(l, t, e) {
  if (e <= 0 || !t) return [t];
  const o = [];
  for (const i of t.split(`
`)) {
    if (!i) {
      o.push("");
      continue;
    }
    if (l.measureText(i).width <= e) {
      o.push(i);
      continue;
    }
    const r = i.split(/(\s+)/);
    let f = "";
    for (const v of r) {
      const c = f + v;
      if (l.measureText(c).width <= e)
        f = c;
      else if (f && (o.push(f.replace(/\s+$/, "")), f = ""), l.measureText(v).width > e) {
        let s = "";
        for (const u of v)
          l.measureText(s + u).width > e ? (s && o.push(s), s = u) : s += u;
        f = s;
      } else
        f = v.replace(/^\s+/, "");
    }
    f && o.push(f.replace(/\s+$/, ""));
  }
  return o.length ? o : [""];
}
function _t(l) {
  if (typeof l == "number") {
    const t = new Date(l), e = String(t.getHours()).padStart(2, "0"), o = String(t.getMinutes()).padStart(2, "0"), i = String(t.getSeconds()).padStart(2, "0");
    return `${e}:${o}:${i}`;
  }
  return l;
}
function Ml(l, t) {
  return Math.ceil(l.measureText(t).width) + 12;
}
function Sl(l) {
  const { entries: t, ctx: e, textMaxWidth: o, showTimestamps: i, wordWrap: r } = l, f = l.formatTs ?? _t;
  e.font = ut;
  const v = [];
  for (let c = 0; c < t.length; c++) {
    const s = t[c], u = s.level ?? "info", E = i && s.ts != null ? f(s.ts) : "", T = r ? yl(e, s.text, o) : s.text.split(`
`);
    for (let F = 0; F < T.length; F++)
      v.push({
        entryIdx: c,
        text: T[F],
        level: u,
        timestamp: F === 0 ? E : "",
        isFirstFrag: F === 0
      });
  }
  return v;
}
function Tt(l, t) {
  const e = l.getContext("2d");
  if (!e) return;
  const o = l.width, i = l.height, r = Ke[t.theme] ?? Ke.none;
  e.clearRect(0, 0, o, i), e.fillStyle = r.bg, e.fillRect(0, 0, o, i), e.save(), e.beginPath(), e.rect(0, 0, o, i), e.clip(), e.font = ut, e.textBaseline = "middle";
  const f = t.visualLines, v = Ue, c = t.showTimestamps ? Ue + t.timestampWidth : Ue, s = Math.max(0, Math.floor((t.scrollY - We) / ge)), u = Math.min(f.length, Math.ceil((t.scrollY + i - We) / ge) + 1);
  for (let E = s; E < u; E++) {
    const T = f[E], F = We + E * ge - t.scrollY + ge / 2;
    if (T.entryIdx % 2 === 1 && T.isFirstFrag) {
      e.fillStyle = r.rowAlt;
      let h = 1;
      for (; E + h < u && f[E + h].entryIdx === T.entryIdx; ) h++;
      e.fillRect(0, F - ge / 2, o, ge * h);
    }
    E === t.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, F - ge / 2, o, ge)), t.showTimestamps && T.timestamp && (e.fillStyle = r.timestamp, e.textAlign = "left", t.glow && (e.shadowBlur = 3, e.shadowColor = r.timestamp), e.fillText(T.timestamp, v, F), e.shadowBlur = 0);
    const w = xl(r, T.level);
    e.fillStyle = w, e.textAlign = "left", t.glow && (e.shadowBlur = 4, e.shadowColor = w), e.fillText(T.text, c, F), e.shadowBlur = 0;
  }
  e.restore();
}
function Cl(l, t, e) {
  if (l < 0) return -1;
  const o = Math.floor((l + t - We) / ge);
  return o < 0 || o >= e ? -1 : o;
}
function Ll(l) {
  return We * 2 + l * ge;
}
const Tl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Il = `
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
`, kl = /* @__PURE__ */ Xe({
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
  setup(l, { expose: t }) {
    const e = l, o = z(null), i = z(null), r = z(0), f = z(0), v = z(0), c = z(-1), s = z(!0), u = X(() => {
      const L = e.entries ?? [];
      return e.maxLines > 0 && L.length > e.maxLines ? L.slice(L.length - e.maxLines) : L;
    }), E = X(() => {
      if (!e.showTimestamps) return "";
      const L = e.formatTs ?? _t;
      let W = "00:00:00";
      for (const Z of u.value) {
        if (Z.ts == null) continue;
        const xe = L(Z.ts);
        xe.length > W.length && (W = xe);
      }
      return W;
    }), T = z(0), F = z([]);
    function w() {
      if (!p) return;
      const L = p.getContext("2d");
      if (!L) return;
      L.font = ut;
      const W = e.showTimestamps ? Ml(L, E.value) : 0;
      T.value = W;
      const Z = Math.max(
        1,
        r.value - Ue * 2 - W
      );
      F.value = Sl({
        entries: u.value,
        ctx: L,
        textMaxWidth: Z,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const h = X(() => Ll(F.value.length)), x = X(() => Math.max(0, h.value - f.value));
    P(x, () => {
      s.value ? v.value = x.value : v.value = Math.min(v.value, x.value);
    }), P(
      [u, r, () => e.showTimestamps, () => e.wordWrap, E],
      () => {
        w(), Te(O);
      },
      { deep: !1 }
    );
    let m = null, g = !1, S, B, I, R, p;
    function $() {
      if (!(!i.value || !o.value)) {
        p = document.createElement("canvas");
        try {
          m = new Y.WebGLRenderer({ canvas: i.value, antialias: !1, alpha: !0 });
        } catch {
          g = !0;
        }
        if (!g && !m.getContext() && (m.dispose(), m = null, g = !0), g) {
          U();
          return;
        }
        m.setPixelRatio(1), m.setClearColor(0, 0), S = new Y.Scene(), B = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), R = new Y.CanvasTexture(p), R.minFilter = Y.LinearFilter, R.magFilter = Y.LinearFilter, I = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: R },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Tl,
          fragmentShader: Il,
          transparent: !0
        }), S.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), I)), U();
      }
    }
    function U() {
      if (!o.value || !m && !g) return;
      const L = o.value.clientWidth, W = o.value.clientHeight;
      if (!L || !W) return;
      const Z = p.width !== L || p.height !== W;
      Z && (p.width = L, p.height = W, r.value = L, f.value = W, w(), m ? (Z && R && (R.dispose(), R = new Y.CanvasTexture(p), R.minFilter = Y.LinearFilter, R.magFilter = Y.LinearFilter, I && (I.uniforms.uTex.value = R)), m.setPixelRatio(window.devicePixelRatio || 1), m.setSize(L, W)) : i.value && (i.value.width = L, i.value.height = W, i.value.style.width = L + "px", i.value.style.height = W + "px"), s.value && (v.value = Math.max(0, h.value - f.value)), O());
    }
    function O() {
      if (!(p != null && p.width)) return;
      if (g) {
        if (!i.value) return;
        Tt(p, {
          visualLines: F.value,
          scrollY: v.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: T.value,
          hoveredLine: c.value
        });
        const W = i.value.getContext("2d");
        W && W.drawImage(p, 0, 0);
        return;
      }
      if (!m || !I || !R) return;
      const L = e.theme === "paper";
      I.uniforms.uStrength.value = e.curvature / 45 * 0.55, I.uniforms.uScanlines.value = e.scanlines && !L ? 1 : 0, I.uniforms.uVignette.value = L ? 0 : 1, Tt(p, {
        visualLines: F.value,
        scrollY: v.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: T.value,
        hoveredLine: c.value
      }), R.needsUpdate = !0, m.render(S, B);
    }
    P(() => e.theme, () => O()), P(() => e.curvature, () => O()), P(() => e.scanlines, () => O()), P(() => e.glow, () => O()), P(v, () => O()), P(c, () => O());
    function ee(L) {
      if (!i.value) return [-1, -1];
      const W = i.value.getBoundingClientRect();
      return [L.clientX - W.left, L.clientY - W.top];
    }
    function J(L) {
      v.value = Math.max(0, Math.min(x.value, L)), s.value = v.value >= x.value - 4;
    }
    function Ie(L) {
      J(v.value + L.deltaY);
    }
    let K = !1, de = 0, pe = 0;
    function N(L) {
      K = !0, de = L.clientY, pe = v.value;
    }
    function Se(L) {
      if (K) {
        const W = de - L.clientY;
        J(pe + W);
      }
    }
    function Ce() {
      K && (K = !1);
    }
    function k(L) {
      const [, W] = ee(L);
      if (W < 0) {
        c.value = -1;
        return;
      }
      c.value = Cl(W, v.value, F.value.length);
    }
    function A() {
      c.value = -1;
    }
    t({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        s.value = !0, v.value = x.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(L) {
        J(We + L * ge);
      }
    });
    let G = null, Q = null, C = 0;
    const D = Qe("cathodeResetTick", z(0));
    P(D, () => H());
    function H() {
      cancelAnimationFrame(C), C = requestAnimationFrame(U);
    }
    function ve(L) {
      L.preventDefault();
    }
    function se() {
      m == null || m.dispose(), m = null, g = !1, $();
    }
    He(() => {
      document.addEventListener("mousemove", Se), document.addEventListener("mouseup", Ce), Te(() => {
        var L;
        $(), i.value && (i.value.addEventListener("webglcontextlost", ve), i.value.addEventListener("webglcontextrestored", se)), o.value && (G = new ResizeObserver(() => U()), G.observe(o.value), Q = new IntersectionObserver((W) => {
          W.some((Z) => Z.isIntersecting) && H();
        }), Q.observe(o.value)), window.addEventListener("resize", H), (L = window.visualViewport) == null || L.addEventListener("resize", H), v.value = x.value;
      });
    }), Ne(() => {
      var L, W, Z;
      document.removeEventListener("mousemove", Se), document.removeEventListener("mouseup", Ce), (L = i.value) == null || L.removeEventListener("webglcontextlost", ve), (W = i.value) == null || W.removeEventListener("webglcontextrestored", se), G == null || G.disconnect(), Q == null || Q.disconnect(), window.removeEventListener("resize", H), (Z = window.visualViewport) == null || Z.removeEventListener("resize", H), cancelAnimationFrame(C), m == null || m.dispose();
    });
    const we = X(() => Ke[e.theme] ?? Ke.none), ke = X(() => ({
      background: we.value.bg
    }));
    return (L, W) => (ie(), re("div", {
      ref_key: "wrapEl",
      ref: o,
      class: "cathode-log-wrap",
      style: be(ke.value)
    }, [
      j("canvas", {
        ref_key: "canvasEl",
        ref: i,
        class: "cathode-log-canvas",
        onWheel: Re(Ie, ["prevent"]),
        onMousemove: k,
        onMouseleave: A,
        onMousedown: N
      }, null, 544)
    ], 4));
  }
}), vn = /* @__PURE__ */ Ge(kl, [["__scopeId", "data-v-d2d092f3"]]), qe = {
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
    accent: "#40a0f0"
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
    accent: "#158cba"
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
    accent: "#80ff80"
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
    accent: "#ffd060"
  }
}, Rl = 0.18, $e = 8, Ft = 22, Oe = 8, Ae = 56, je = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", it = 4, El = 1, Dl = 1;
function _l(l, t, e, o = 0) {
  const i = Math.max(0, t - Oe - Ae), r = Math.max(1, Math.floor(i / e)), f = Math.min(r, l);
  return { firstIdx: Math.max(0, l - f - Math.floor(o / e)), count: f, slotW: e };
}
function Fl(l, t, e) {
  if (!l.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let o = 1 / 0, i = -1 / 0, r = 0;
  const f = Math.min(l.length, t + e);
  for (let c = t; c < f; c++) {
    const s = l[c];
    s && (s.low < o && (o = s.low), s.high > i && (i = s.high), s.volume > r && (r = s.volume));
  }
  if (!isFinite(o) || !isFinite(i) || o === i) {
    const c = isFinite(o) ? o : 0;
    return { min: c - 1, max: c + 1, maxVol: Math.max(1, r) };
  }
  const v = (i - o) * 0.04;
  return { min: o - v, max: i + v, maxVol: Math.max(1, r) };
}
function zl(l, t) {
  const e = Math.max(1, l - $e - Ft - it), o = Math.max(0, Math.round(e * t)), i = e - o;
  return {
    priceY0: $e,
    priceY1: $e + i,
    volumeY0: $e + i + it,
    volumeY1: $e + i + it + o
  };
}
function Ve(l, t, e, o) {
  const i = t.max - t.min;
  return i <= 0 ? (e + o) / 2 : e + (1 - (l - t.min) / i) * (o - e);
}
function dt(l, t, e) {
  return Oe + (l - t + 0.5) * e;
}
function zt(l) {
  return l >= 1e4 ? l.toFixed(0) : l >= 100 ? l.toFixed(1) : l >= 1 ? l.toFixed(2) : l >= 0.01 ? l.toFixed(4) : l.toFixed(6);
}
function Bt(l) {
  const t = new Date(l), e = String(t.getMonth() + 1).padStart(2, "0"), o = String(t.getDate()).padStart(2, "0"), i = String(t.getHours()).padStart(2, "0"), r = String(t.getMinutes()).padStart(2, "0");
  return `${e}-${o} ${i}:${r}`;
}
function Bl(l, t) {
  if (l <= 0 || !isFinite(l)) return 1;
  const e = l / Math.max(1, t), o = Math.pow(10, Math.floor(Math.log10(e))), i = e / o;
  let r;
  return i < 1.5 ? r = 1 : i < 3 ? r = 2 : i < 7 ? r = 5 : r = 10, r * o;
}
function It(l, t) {
  const e = l.getContext("2d");
  if (!e) return;
  const o = l.width, i = l.height, r = qe[t.theme] ?? qe.none;
  if (e.clearRect(0, 0, o, i), e.fillStyle = r.bg, e.fillRect(0, 0, o, i), !t.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, o, i), e.clip();
  const f = _l(t.candles.length, o, t.slotW, t.scrollX), v = Fl(t.candles, f.firstIdx, f.count), c = zl(i, t.showVolume ? t.volumeFraction : 0), s = Math.max(El, Math.floor(t.slotW * 0.7)), u = Math.min(t.candles.length, f.firstIdx + f.count);
  for (let E = f.firstIdx; E < u; E++) {
    const T = t.candles[E];
    if (!T) continue;
    const F = dt(E, f.firstIdx, t.slotW), w = Ve(T.open, v, c.priceY0, c.priceY1), h = Ve(T.close, v, c.priceY0, c.priceY1), x = Ve(T.high, v, c.priceY0, c.priceY1), m = Ve(T.low, v, c.priceY0, c.priceY1), g = T.close >= T.open, S = g ? r.wickBull : r.wickBear, B = g ? r.candleBull : r.candleBear;
    t.glow && (e.shadowBlur = 4, e.shadowColor = B), e.strokeStyle = S, e.lineWidth = Dl, e.beginPath(), e.moveTo(Math.round(F) + 0.5, x), e.lineTo(Math.round(F) + 0.5, m), e.stroke(), e.fillStyle = B;
    const I = Math.min(w, h), R = Math.max(1, Math.abs(h - w));
    if (e.fillRect(
      Math.round(F - s / 2),
      Math.round(I),
      s,
      Math.round(R)
    ), e.shadowBlur = 0, t.showVolume && v.maxVol > 0) {
      const p = Math.round(T.volume / v.maxVol * (c.volumeY1 - c.volumeY0));
      p > 0 && (e.fillStyle = g ? r.volumeBull : r.volumeBear, e.fillRect(
        Math.round(F - s / 2),
        c.volumeY1 - p,
        s,
        p
      ));
    }
  }
  Wl(e, r, v, c, o), Al(e, r, t.candles, f, t.slotW, i), t.hover && Hl(e, r, t.candles, f, v, c, t.slotW, t.hover, o), e.restore();
}
function Wl(l, t, e, o, i) {
  const r = e.max - e.min;
  if (r <= 0) return;
  const f = Bl(r, 6), v = Math.ceil(e.min / f) * f;
  l.font = je, l.fillStyle = t.text, l.strokeStyle = t.gridline, l.textBaseline = "middle", l.textAlign = "left", l.lineWidth = 1, l.globalAlpha = 0.7;
  for (let c = v; c <= e.max; c += f) {
    const s = Ve(c, e, o.priceY0, o.priceY1);
    s < o.priceY0 || s > o.priceY1 || (l.beginPath(), l.moveTo(Oe, Math.round(s) + 0.5), l.lineTo(i - Ae, Math.round(s) + 0.5), l.stroke(), l.fillText(zt(c), i - Ae + 4, s));
  }
  l.globalAlpha = 1;
}
function Al(l, t, e, o, i, r) {
  if (o.count <= 0 || !e.length) return;
  const v = Math.max(1, Math.floor(o.count / 6));
  l.font = je, l.fillStyle = t.text, l.textBaseline = "top", l.textAlign = "center", l.globalAlpha = 0.7;
  const c = Math.min(e.length, o.firstIdx + o.count);
  for (let s = o.firstIdx; s < c; s += v) {
    const u = e[s];
    if (!u) continue;
    const E = dt(s, o.firstIdx, i);
    l.fillText(Bt(u.start), E, r - Ft + 4);
  }
  l.globalAlpha = 1;
}
function Hl(l, t, e, o, i, r, f, v, c) {
  const s = Math.floor((v.x - Oe) / f), u = Math.max(0, Math.min(e.length - 1, o.firstIdx + s)), E = e[u];
  if (!E) return;
  const T = dt(u, o.firstIdx, f);
  l.save(), l.strokeStyle = t.accent, l.lineWidth = 1, l.setLineDash([3, 3]), l.globalAlpha = 0.6, l.beginPath(), l.moveTo(Math.round(T) + 0.5, r.priceY0), l.lineTo(Math.round(T) + 0.5, r.volumeY1 || r.priceY1), l.stroke();
  const F = Math.max(r.priceY0, Math.min(r.priceY1, v.y));
  l.beginPath(), l.moveTo(Oe, Math.round(F) + 0.5), l.lineTo(c - Ae, Math.round(F) + 0.5), l.stroke(), l.setLineDash([]), l.globalAlpha = 1;
  const w = i.max - i.min;
  if (w > 0) {
    const m = i.max - (F - r.priceY0) / (r.priceY1 - r.priceY0) * w, g = zt(m);
    l.font = je, l.textBaseline = "middle", l.textAlign = "left";
    const S = l.measureText(g).width, B = 4, I = 2;
    l.fillStyle = t.accent, l.fillRect(c - Ae + 2, F - 7 - I, S + B * 2, 14 + I * 2), l.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, l.fillText(g, c - Ae + 2 + B, F);
  }
  l.font = je, l.textBaseline = "top", l.textAlign = "center";
  const h = Bt(E.start), x = l.measureText(h).width;
  l.fillStyle = t.accent, l.fillRect(T - x / 2 - 4, r.volumeY1 + 2, x + 8, 14), l.fillStyle = t.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : t.bg, l.fillText(h, T, r.volumeY1 + 4), l.restore();
}
const kt = 0.25, Rt = 6, Yl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Pl = `
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
`, $l = /* @__PURE__ */ Xe({
  __name: "CathodeKLine",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: Rl },
    slotW: { default: 8 }
  },
  setup(l) {
    const t = l, e = z(null), o = z(null), i = z(0), r = z(0), f = z(0), v = z(1), c = z(null), s = X(() => Math.max(1, t.slotW * v.value));
    let u = null, E = !1, T, F, w, h, x;
    function m() {
      if (!(!o.value || !e.value)) {
        x = document.createElement("canvas");
        try {
          u = new Y.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          E = !0;
        }
        if (!E && !u.getContext() && (u.dispose(), u = null, E = !0), E) {
          g();
          return;
        }
        u.setPixelRatio(1), u.setClearColor(0, 0), T = new Y.Scene(), F = new Y.OrthographicCamera(-1, 1, 1, -1, 0, 1), h = new Y.CanvasTexture(x), h.minFilter = Y.LinearFilter, h.magFilter = Y.LinearFilter, w = new Y.ShaderMaterial({
          uniforms: {
            uTex: { value: h },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Yl,
          fragmentShader: Pl,
          transparent: !0
        }), T.add(new Y.Mesh(new Y.PlaneGeometry(2, 2), w)), g();
      }
    }
    function g() {
      if (!e.value || !u && !E) return;
      const C = e.value.clientWidth, D = e.value.clientHeight;
      !C || !D || !(x.width !== C || x.height !== D) || (x.width = C, x.height = D, i.value = C, r.value = D, u ? (h && (h.dispose(), h = new Y.CanvasTexture(x), h.minFilter = Y.LinearFilter, h.magFilter = Y.LinearFilter, w && (w.uniforms.uTex.value = h)), u.setPixelRatio(window.devicePixelRatio || 1), u.setSize(C, D)) : o.value && (o.value.width = C, o.value.height = D, o.value.style.width = C + "px", o.value.style.height = D + "px"), S());
    }
    function S() {
      if (!(x != null && x.width)) return;
      if (E) {
        if (!o.value) return;
        It(x, {
          candles: t.candles,
          slotW: s.value,
          scrollX: f.value,
          theme: t.theme,
          glow: !1,
          showVolume: t.showVolume,
          volumeFraction: t.volumeFraction,
          hover: c.value
        });
        const D = o.value.getContext("2d");
        D && D.drawImage(x, 0, 0);
        return;
      }
      if (!u || !w || !h) return;
      const C = t.theme === "paper";
      w.uniforms.uStrength.value = t.curvature / 45 * 0.55, w.uniforms.uScanlines.value = t.scanlines && !C ? 1 : 0, w.uniforms.uVignette.value = C ? 0 : 1, It(x, {
        candles: t.candles,
        slotW: s.value,
        scrollX: f.value,
        theme: t.theme,
        glow: t.glow,
        showVolume: t.showVolume,
        volumeFraction: t.volumeFraction,
        hover: c.value
      }), h.needsUpdate = !0, u.render(T, F);
    }
    P(() => t.theme, () => S()), P(() => t.curvature, () => S()), P(() => t.scanlines, () => S()), P(() => t.glow, () => S()), P(() => t.showVolume, () => S()), P(() => t.volumeFraction, () => S()), P(() => t.slotW, () => S()), P(() => t.candles, () => S(), { deep: !1 }), P(f, () => S()), P(v, () => S()), P(c, () => S()), P(s, () => S());
    let B = null, I = null, R = 0;
    const p = Qe("cathodeResetTick", z(0));
    P(p, () => $());
    function $() {
      cancelAnimationFrame(R), R = requestAnimationFrame(g);
    }
    function U(C) {
      C.preventDefault();
    }
    function O() {
      u == null || u.dispose(), u = null, E = !1, m();
    }
    function ee(C) {
      if (!o.value) return [-1, -1];
      const D = o.value.getBoundingClientRect();
      return [C.clientX - D.left, C.clientY - D.top];
    }
    function J(C) {
      var we;
      const D = s.value;
      if (D <= 0) return 0;
      const H = ((we = t.candles) == null ? void 0 : we.length) ?? 0, ve = Math.max(1, Math.floor((i.value || 1) / D)), se = Math.max(0, H - ve);
      return Math.max(0, Math.min(C, se * D));
    }
    function Ie(C) {
      var ve;
      if (C.deltaX !== 0 || C.shiftKey && C.deltaY !== 0) {
        const se = C.deltaX !== 0 ? C.deltaX : C.deltaY;
        f.value = J(f.value + se);
        return;
      }
      if (C.deltaY === 0) return;
      const [D] = ee(C), H = s.value;
      if (D >= 0 && H > 0 && ((ve = t.candles) != null && ve.length)) {
        const se = Math.max(1, Math.floor((i.value || 1) / H)), ke = Math.max(0, t.candles.length - se - Math.floor(f.value / H)) + (D - 8) / H, L = Math.exp(-C.deltaY * 15e-4), W = Math.max(kt, Math.min(Rt, v.value * L));
        v.value = W;
        const Z = t.slotW * W, xe = Math.max(1, Math.floor((i.value || 1) / Z)), fe = ke - (D - 8) / Z, q = Math.max(0, t.candles.length - xe - fe);
        f.value = J(q * Z);
      } else {
        const se = Math.exp(-C.deltaY * 15e-4);
        v.value = Math.max(kt, Math.min(Rt, v.value * se));
      }
    }
    let K = !1, de = 0, pe = 0;
    function N(C) {
      C.button === 0 && (K = !0, de = C.clientX, pe = f.value, c.value = null);
    }
    function Se(C) {
      if (K) {
        const D = C.clientX - de;
        f.value = J(pe + D);
        return;
      }
    }
    function Ce() {
      K = !1;
    }
    function k(C) {
      if (K) return;
      const [D, H] = ee(C);
      if (D < 0 || H < 0) {
        c.value = null;
        return;
      }
      c.value = { x: D, y: H };
    }
    function A() {
      c.value = null;
    }
    He(() => {
      document.addEventListener("mousemove", Se), document.addEventListener("mouseup", Ce), Te(() => {
        var C;
        m(), o.value && (o.value.addEventListener("webglcontextlost", U), o.value.addEventListener("webglcontextrestored", O)), e.value && (B = new ResizeObserver(() => g()), B.observe(e.value), I = new IntersectionObserver((D) => {
          D.some((H) => H.isIntersecting) && $();
        }), I.observe(e.value)), window.addEventListener("resize", $), (C = window.visualViewport) == null || C.addEventListener("resize", $);
      });
    }), Ne(() => {
      var C, D, H;
      document.removeEventListener("mousemove", Se), document.removeEventListener("mouseup", Ce), (C = o.value) == null || C.removeEventListener("webglcontextlost", U), (D = o.value) == null || D.removeEventListener("webglcontextrestored", O), B == null || B.disconnect(), I == null || I.disconnect(), window.removeEventListener("resize", $), (H = window.visualViewport) == null || H.removeEventListener("resize", $), cancelAnimationFrame(R), u == null || u.dispose();
    });
    const G = X(() => qe[t.theme] ?? qe.none), Q = X(() => ({
      background: G.value.bg
    }));
    return (C, D) => (ie(), re("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-kline-wrap",
      style: be(Q.value)
    }, [
      j("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-kline-canvas",
        onWheel: Re(Ie, ["prevent"]),
        onMousedown: N,
        onMousemove: k,
        onMouseleave: A
      }, null, 544)
    ], 4));
  }
}), fn = /* @__PURE__ */ Ge($l, [["__scopeId", "data-v-6541fdc1"]]), vt = z(0), st = 28, ze = 12;
let ct = 10, Ze = "cathode.layout", Je = !1;
const ae = z({});
function Vl(l, t = "cathode.layout") {
  if (!Je) {
    Je = !0, Ze = t;
    try {
      const e = localStorage.getItem(Ze);
      if (e) {
        ae.value = JSON.parse(e), Et();
        return;
      }
    } catch {
    }
    ae.value = { ...l }, Et();
  }
}
function Et() {
  let l = 10;
  for (const t of Object.values(ae.value))
    typeof (t == null ? void 0 : t.zIndex) == "number" && t.zIndex > l && (l = t.zIndex);
  ct = l;
}
function De() {
  localStorage.setItem(Ze, JSON.stringify(ae.value));
}
function Ol(l) {
  Je = !1, localStorage.removeItem(Ze), ae.value = { ...l }, De(), Je = !0, vt.value++;
}
function Wt(l) {
  ct++, ae.value[l] && (ae.value[l].zIndex = ct);
}
function Xl(l, t) {
  ae.value[l].visible = t, De();
}
function Nl(l, t) {
  ae.value[l].minimized = t, t && (ae.value[l].maximized = !1), De();
}
function Gl(l, t) {
  ae.value[l].maximized = t, t && (ae.value[l].minimized = !1, Wt(l)), De();
}
function Ul(l, t, e) {
  ae.value[l].x = Math.round(t), ae.value[l].y = Math.round(e), De();
}
function Kl(l, t, e) {
  ae.value[l].w = Math.round(t), ae.value[l].h = Math.round(e), De();
}
function mn(l, t, e) {
  const o = Math.ceil(Math.sqrt(e.length)), i = Math.ceil(e.length / o), r = Math.floor((l - ze * (o + 1)) / o), f = Math.floor((t - ze * (i + 1)) / i), v = {};
  return e.forEach((c, s) => {
    const u = s % o, E = Math.floor(s / o);
    v[c] = {
      x: ze + u * (r + ze),
      y: ze + E * (f + ze),
      w: r,
      h: f,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: s + 1
    };
  }), v;
}
function At() {
  return {
    containers: ae,
    TITLEBAR_H: st,
    load: Vl,
    save: De,
    reset: Ol,
    bringToFront: Wt,
    setVisible: Xl,
    setMinimized: Nl,
    setMaximized: Gl,
    updatePos: Ul,
    updateSize: Kl
  };
}
const ql = { class: "ws-toolbar" }, jl = {
  key: 0,
  class: "ws-restore-menu"
}, Zl = {
  key: 0,
  class: "ws-restore-empty"
}, Jl = ["onClick"], Ql = /* @__PURE__ */ Xe({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(l) {
    const t = l, { containers: e, load: o, reset: i, setVisible: r } = At(), f = z(null);
    yt("cathodeWorkspace", f), yt("cathodeResetTick", vt), He(() => {
      if (!f.value) return;
      const { clientWidth: x, clientHeight: m } = f.value, g = t.initialLayout ?? {};
      o(g, t.storageKey ?? "cathode.layout");
      const S = Object.keys(e.value)[0];
      S && v(S);
    });
    function v(x) {
      var g;
      document.querySelectorAll(".cc").forEach((S) => S.classList.remove("cc-focused"));
      const m = (g = f.value) == null ? void 0 : g.querySelector(`#cc-${x}`);
      m && m.classList.add("cc-focused");
    }
    function c() {
      !f.value || !t.initialLayout || i(t.initialLayout);
    }
    function s(x) {
      const m = x.target.closest(".cc");
      m && (document.querySelectorAll(".cc").forEach((g) => g.classList.remove("cc-focused")), m.classList.add("cc-focused"));
    }
    const u = z(!1), E = () => Object.entries(e.value).filter(([, x]) => !x.visible).map(([x]) => x);
    function T(x) {
      r(x, !0), u.value = !1;
    }
    function F(x) {
      if (!u.value) return;
      const m = x.target;
      !m.closest(".ws-restore-menu") && !m.closest(".ws-btn-restore") && (u.value = !1);
    }
    function w(x) {
      x.key === "Escape" && (u.value = !1);
    }
    He(() => {
      document.addEventListener("click", F), document.addEventListener("keydown", w);
    }), Ne(() => {
      document.removeEventListener("click", F), document.removeEventListener("keydown", w);
    });
    function h(x) {
      var m;
      return ((m = t.containerTitles) == null ? void 0 : m[x]) ?? x;
    }
    return (x, m) => (ie(), re("div", {
      ref_key: "workspaceEl",
      ref: f,
      class: "cathode-workspace",
      onMousedown: s
    }, [
      rt(x.$slots, "default", {}, void 0, !0),
      rt(x.$slots, "overlay", {}, void 0, !0),
      j("div", ql, [
        l.initialLayout ? (ie(), re("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
        }, " ↺ Reset Layout ")) : Me("", !0),
        m[1] || (m[1] = j("div", { class: "ws-sep" }, null, -1)),
        j("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: m[0] || (m[0] = (g) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      Qt(el, { name: "menu" }, {
        default: tl(() => [
          u.value ? (ie(), re("div", jl, [
            m[3] || (m[3] = j("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            E().length ? Me("", !0) : (ie(), re("div", Zl, " No closed panels ")),
            (ie(!0), re(ll, null, nl(E(), (g) => (ie(), re("div", {
              key: g,
              class: "ws-restore-item",
              onClick: (S) => T(g)
            }, [
              m[2] || (m[2] = j("span", { class: "ws-restore-icon" }, "⊞", -1)),
              ol(" " + ye(h(g)), 1)
            ], 8, Jl))), 128))
          ])) : Me("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), hn = /* @__PURE__ */ Ge(Ql, [["__scopeId", "data-v-5838d04b"]]), en = ["id"], tn = { class: "cc-title" }, ln = {
  key: 0,
  class: "cc-size-badge"
}, nn = { class: "cc-controls" }, on = ["title"], an = { class: "cc-body" }, rn = 200, sn = 80, Dt = 60, cn = /* @__PURE__ */ Xe({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(l) {
    const t = l, { containers: e, bringToFront: o, setVisible: i, setMinimized: r, setMaximized: f, updatePos: v, updateSize: c } = At(), s = Qe("cathodeWorkspace", z(null)), u = X(() => e.value[t.id]), E = X(() => {
      const k = u.value, A = t.curvature ?? 0;
      if (!k) return {};
      const G = { "--curvature": A };
      return k.maximized ? { ...G, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: k.zIndex } : {
        ...G,
        left: k.x + "px",
        top: k.y + "px",
        width: k.w + "px",
        height: k.minimized ? st + "px" : k.h + "px",
        zIndex: k.zIndex,
        display: k.visible ? "flex" : "none"
      };
    });
    let T = !1, F = 0, w = 0;
    function h(k) {
      var Q;
      if (k.target.closest(".cc-btn") || u.value.maximized) return;
      o(t.id), T = !0;
      const A = (Q = s.value) == null ? void 0 : Q.querySelector(`#cc-${t.id}`);
      if (!A) return;
      const G = A.getBoundingClientRect();
      F = k.clientX - G.left, w = k.clientY - G.top, document.addEventListener("mousemove", x), document.addEventListener("mouseup", m), k.preventDefault();
    }
    function x(k) {
      var D;
      if (!T || !s.value) return;
      const A = s.value.getBoundingClientRect(), G = ((D = u.value) == null ? void 0 : D.w) ?? 300;
      let Q = k.clientX - A.left - F, C = k.clientY - A.top - w;
      Q = Math.max(Dt - G, Math.min(A.width - Dt, Q)), C = Math.max(0, Math.min(A.height - st, C)), v(t.id, Q, C);
    }
    function m() {
      T = !1, document.removeEventListener("mousemove", x), document.removeEventListener("mouseup", m);
    }
    let g = !1, S = 0, B = 0, I = 0, R = 0;
    const p = z("");
    function $(k) {
      u.value.maximized || (o(t.id), g = !0, S = k.clientX, B = k.clientY, I = u.value.w, R = u.value.h, document.addEventListener("mousemove", U), document.addEventListener("mouseup", O), k.preventDefault(), k.stopPropagation());
    }
    function U(k) {
      if (!g) return;
      const A = Math.max(rn, I + (k.clientX - S)), G = Math.max(sn, R + (k.clientY - B));
      c(t.id, A, G), p.value = `${Math.round(A)}×${Math.round(G)}`;
    }
    function O() {
      g = !1, p.value = "", document.removeEventListener("mousemove", U), document.removeEventListener("mouseup", O), ee.value++;
    }
    const ee = z(0);
    P(vt, () => {
      ee.value++;
    }), Ne(() => {
      var k;
      document.removeEventListener("mousemove", x), document.removeEventListener("mouseup", m), document.removeEventListener("mousemove", U), document.removeEventListener("mouseup", O), (k = J.value) == null || k.removeEventListener("scroll", K), de();
    });
    const J = z(null);
    function Ie(k) {
      if (t.canvas) return [];
      const A = k.children[0];
      return A ? Array.from(A.children) : [];
    }
    function K() {
      const k = J.value, A = t.curvature ?? 0;
      if (!k) return;
      const G = Ie(k);
      if (!G.length) return;
      const Q = k.clientHeight, C = Q / 2, D = A * 38e-4;
      G.forEach((H) => {
        if (!H.dataset.origFs) {
          const fe = getComputedStyle(H);
          H.dataset.origFs = fe.fontSize, H.dataset.origLh = fe.lineHeight;
        }
        if (A === 0) {
          H.style.fontSize = "", H.style.lineHeight = "";
          return;
        }
        const ve = H.getBoundingClientRect(), se = k.getBoundingClientRect(), we = ve.top - se.top + ve.height / 2, ke = Math.min(1, Math.abs(we - C) / (Q / 2)), L = 1 + D * Math.cos(ke * Math.PI / 2), W = parseFloat(H.dataset.origFs), Z = H.dataset.origLh, xe = Z === "normal" ? W * 1.4 : parseFloat(Z);
        isNaN(W) || (H.style.fontSize = `${(W * L).toFixed(2)}px`), isNaN(xe) || (H.style.lineHeight = `${(xe * L).toFixed(2)}px`);
      });
    }
    function de() {
      const k = J.value;
      k && Ie(k).forEach((A) => {
        A.style.fontSize = "", A.style.lineHeight = "", delete A.dataset.origFs, delete A.dataset.origLh;
      });
    }
    P(() => t.curvature, (k) => {
      (k ?? 0) === 0 ? de() : K();
    }), He(() => {
      var k;
      (k = J.value) == null || k.addEventListener("scroll", K, { passive: !0 }), Te(K);
    });
    function pe() {
      r(t.id, !u.value.minimized), Te(() => {
        ee.value++;
      });
    }
    function N() {
      f(t.id, !u.value.maximized), Te(() => {
        ee.value++;
      });
    }
    function Se() {
      i(t.id, !1);
    }
    function Ce() {
      o(t.id);
    }
    return (k, A) => u.value && u.value.visible ? (ie(), re("div", {
      key: 0,
      id: `cc-${l.id}`,
      class: al(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": l.canvas }]),
      style: be(E.value),
      onMousedown: Ce
    }, [
      j("div", {
        class: "cc-titlebar",
        onMousedown: h
      }, [
        A[0] || (A[0] = j("span", { class: "cc-status-dot" }, null, -1)),
        j("span", tn, ye(l.title), 1),
        p.value ? (ie(), re("span", ln, ye(p.value), 1)) : Me("", !0),
        j("div", nn, [
          j("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Re(pe, ["stop"])
          }, "─"),
          j("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: Re(N, ["stop"])
          }, ye(u.value.maximized ? "⤡" : "⤢"), 9, on),
          j("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Re(Se, ["stop"])
          }, "✕")
        ])
      ], 32),
      il(j("div", an, [
        j("div", {
          ref_key: "bodyEl",
          ref: J,
          class: "cc-screen",
          onScroll: K
        }, [
          rt(k.$slots, "default", { resizeKey: ee.value }, void 0, !0),
          A[1] || (A[1] = j("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [rl, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (ie(), re("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Re($, ["stop"])
      }, null, 32)) : Me("", !0)
    ], 46, en)) : Me("", !0);
  }
}), gn = /* @__PURE__ */ Ge(cn, [["__scopeId", "data-v-d8a49f79"]]);
export {
  gn as CathodeContainer,
  dn as CathodeGrid,
  fn as CathodeKLine,
  vn as CathodeLog,
  hn as CathodeWorkspace,
  qe as KLINE_THEME_COLORS,
  Ke as LOG_THEME_COLORS,
  mn as buildDefaultLayout,
  At as useCathodeLayout
};
