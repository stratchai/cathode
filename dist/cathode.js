import { defineComponent as Xe, ref as R, reactive as we, computed as B, watch as K, nextTick as me, onMounted as Ze, onUnmounted as Je, openBlock as ae, createElementBlock as re, normalizeStyle as Z, createElementVNode as ee, withModifiers as Me, withKeys as Qe, createCommentVNode as de, toDisplayString as te } from "vue";
import * as W from "three";
const le = {
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
}, S = 30, He = 12, et = 10;
function tt(g, u) {
  const e = g.getContext("2d");
  if (!e) return;
  const i = g.width, D = g.height, d = le[u.theme] ?? le.none, { cols: T, rows: y, pinnedRows: p, rowHeight: h, scrollY: _, glow: m } = u;
  e.fillStyle = d.bg, e.fillRect(0, 0, i, D);
  const O = p.length * h, M = D - S - O;
  e.fillStyle = d.headerBg, e.fillRect(0, 0, i, S), e.textBaseline = "middle", e.textAlign = "left";
  let F = 0;
  for (let s = 0; s < T.length; s++) {
    const f = T[s], C = !!u.colFilters[f.colId], b = u.sortColId === f.colId, I = (f.colDef.headerName ?? f.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(F, 0, f.width, S), e.clip(), e.font = `bold ${et}px 'Courier New', Courier, monospace`, e.fillStyle = C ? d.accent : d.textHeader, m && (e.shadowBlur = 6, e.shadowColor = d.textHeader), e.fillText(I, F + 8, S / 2), e.shadowBlur = 0, b) {
      const x = e.measureText(I).width;
      e.font = "8px 'Courier New', Courier, monospace", e.fillStyle = d.accent, e.fillText(u.sortDir === "asc" ? "▲" : "▼", F + 8 + x + 4, S / 2);
    }
    f.colDef.filter && (e.font = "13px 'Courier New', Courier, monospace", e.fillStyle = C ? d.accent : d.textHeader, e.globalAlpha = C ? 1 : 0.38, e.fillText("⌕", F + f.width - 20, S / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(F + f.width - 0.5, 0), e.lineTo(F + f.width - 0.5, S), e.stroke(), F += f.width;
  }
  e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, S - 0.5), e.lineTo(i, S - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, S, i, M), e.clip();
  const $ = Math.max(0, Math.floor(_ / h)), Y = Math.min(y.length, Math.ceil((_ + M) / h));
  for (let s = $; s < Y; s++) {
    const f = y[s], C = S + s * h - _;
    s % 2 === 1 && (e.fillStyle = d.rowAlt, e.fillRect(0, C, i, h)), s === u.hoveredRow && s !== u.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, C, i, h)), s === u.selectedRow && (e.fillStyle = lt(d.accent, 0.1), e.fillRect(0, C, i, h)), e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, C + h - 0.5), e.lineTo(i, C + h - 0.5), e.stroke();
    let b = 0;
    for (let I = 0; I < T.length; I++) {
      const x = T[I], w = u.getCellStyle(x, f), A = w.color ?? d.text, z = w.textAlign ?? "left", U = u.formatCell(x, f);
      e.save(), e.beginPath(), e.rect(b + 1, C, x.width - 2, h), e.clip(), e.font = `${He}px 'Courier New', Courier, monospace`, e.fillStyle = A, e.textBaseline = "middle", m && (e.shadowBlur = 4, e.shadowColor = A), z === "right" ? (e.textAlign = "right", e.fillText(U, b + x.width - 8, C + h / 2)) : (e.textAlign = "left", e.fillText(U, b + 8, C + h / 2)), e.shadowBlur = 0, e.restore(), s === u.selectedRow && I === u.selectedCol && (e.strokeStyle = d.accent, e.lineWidth = 2, e.strokeRect(b + 1.5, C + 1.5, x.width - 3, h - 3)), e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(b + x.width - 0.5, C), e.lineTo(b + x.width - 0.5, C + h), e.stroke(), b += x.width;
    }
  }
  if (e.restore(), p.length > 0) {
    const s = D - O;
    e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, s - 0.5), e.lineTo(i, s - 0.5), e.stroke();
    for (let f = 0; f < p.length; f++) {
      const C = p[f], b = s + f * h;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, b, i, h);
      let I = 0;
      for (let x = 0; x < T.length; x++) {
        const w = T[x], A = u.getCellStyle(w, C), z = A.color ?? d.text, U = A.textAlign ?? "left", ie = u.formatCell(w, C);
        e.save(), e.beginPath(), e.rect(I + 1, b, w.width - 2, h), e.clip(), e.font = `bold ${He}px 'Courier New', Courier, monospace`, e.fillStyle = z, e.textBaseline = "middle", U === "right" ? (e.textAlign = "right", e.fillText(ie, I + w.width - 8, b + h / 2)) : (e.textAlign = "left", e.fillText(ie, I + 8, b + h / 2)), e.restore(), e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(I + w.width - 0.5, b), e.lineTo(I + w.width - 0.5, b + h), e.stroke(), I += w.width;
      }
      e.strokeStyle = d.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, b + h - 0.5), e.lineTo(i, b + h - 0.5), e.stroke();
    }
  }
}
function lt(g, u) {
  if (g.startsWith("rgba") || g.startsWith("rgb"))
    return g.replace(/[\d.]+\)$/, `${u})`);
  const e = parseInt(g.slice(1, 3), 16), i = parseInt(g.slice(3, 5), 16), D = parseInt(g.slice(5, 7), 16);
  return `rgba(${e},${i},${D},${u})`;
}
function ot(g, u, e) {
  const i = g - 0.5, D = u - 0.5, d = (i * i + D * D) * e;
  return [g + i * (1 + d) * d, u + D * (1 + d) * d];
}
function nt(g, u, e, i, D) {
  const d = g / e, T = 1 - u / i, [y, p] = ot(d, T, D);
  return y < 0 || y > 1 || p < 0 || p > 1 ? [-1, -1] : [y * e, (1 - p) * i];
}
function xe(g, u) {
  let e = 0;
  for (let i = 0; i < g; i++) e += u[i].width;
  return e;
}
function at(g, u, e) {
  return g >= u + e - 24 && g < u + e;
}
function Ae(g, u, e) {
  const i = u + e;
  return g >= i - 6 && g <= i + 1;
}
function Pe(g, u, e, i, D, d, T, y) {
  let p = -1, h = 0;
  for (let M = 0; M < e.length; M++) {
    if (g >= h && g < h + e[M].width) {
      p = M;
      break;
    }
    h += e[M].width;
  }
  if (u < S) return { area: "header", colIdx: p, rowIdx: -1 };
  const _ = y * D;
  if (_ > 0 && u >= T - _) {
    const M = Math.floor((u - (T - _)) / D);
    return { area: "pinned", colIdx: p, rowIdx: M };
  }
  const m = u - S + d, O = Math.floor(m / D);
  return O >= 0 && O < i ? { area: "body", colIdx: p, rowIdx: O } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const rt = ["value"], it = ["disabled"], ct = ["disabled"], st = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, ut = `
  uniform sampler2D uTex;
  uniform float     uStrength;   // barrel strength 0..~0.55
  uniform float     uScanlines;  // 1.0 = on
  uniform float     uVignette;   // 1.0 = on  (off for paper theme)
  uniform vec3      uBezel;      // bezel / outside-screen colour

  varying vec2 vUv;

  vec2 barrel(vec2 uv) {
    vec2  cc   = uv - 0.5;
    float dist = dot(cc, cc) * uStrength;
    return uv + cc * (1.0 + dist) * dist;
  }

  void main() {
    vec2 uv = barrel(vUv);

    // Outside the curved screen → theme-coloured bezel
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(uBezel, 1.0);
      return;
    }

    // Three.js CanvasTexture flipY=true flips the canvas before GPU upload,
    // placing canvas row 0 (header/top) at UV y=1 and bottom at UV y=0.
    // vUv.y=1 is screen-top, so sampling at (uv.x, uv.y) gives correct orientation.
    vec4 color = texture2D(uTex, uv);

    // Scanlines
    if (uScanlines > 0.5) {
      if (mod(gl_FragCoord.y, 2.0) < 1.0) color.rgb *= 0.87;
    }

    // Vignette — CRT phosphor edge falloff (skip for light/paper theme)
    if (uVignette > 0.5) {
      vec2  vc   = uv - 0.5;
      float vign = 1.0 - dot(vc, vc) * 1.5;
      color.rgb  *= clamp(vign, 0.0, 1.0);
    }

    gl_FragColor = color;
  }
`, dt = 28, ft = /* @__PURE__ */ Xe({
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
  setup(g, { emit: u }) {
    const e = g, i = u, D = R(e.rowData ?? []), d = R(e.pinnedBottomRowData ?? []), T = R(""), y = R(null), p = we({}), h = we({}), _ = we(/* @__PURE__ */ new Set()), m = R(0), O = R(0), M = R(0), F = R(0), $ = R(0), Y = R(-1), s = R(null), f = R(null), C = R({ x: 0, y: S }), b = R("");
    function I(t) {
      return t.colId ?? t.field ?? (t.headerName ? t.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const x = B(() => {
      const t = e.defaultColDef ?? {};
      return e.columnDefs.filter((l) => !_.has(I(l))).map((l) => {
        const n = I(l), o = { ...t, ...l };
        return { colId: n, colDef: o, width: h[n] ?? o.width ?? 100 };
      });
    }), w = B(() => {
      const t = M.value;
      if (!t) return x.value;
      const l = x.value.reduce((c, a) => c + a.width, 0);
      if (!l) return x.value;
      const n = t / l;
      let o = 0;
      return x.value.map((c, a) => {
        const r = a === x.value.length - 1 ? t - o : Math.max(8, Math.round(c.width * n));
        return o += r, { ...c, width: r };
      });
    }), A = B(() => {
      const t = F.value;
      if (!t) return e.paginationPageSize;
      const l = d.value.length * e.rowHeight, n = t - S - l, o = Math.max(1, Math.floor(n / e.rowHeight));
      return Math.min(o, e.paginationPageSize);
    });
    function z(t, l) {
      if (l.colDef.valueGetter) return l.colDef.valueGetter({ data: t, colDef: l.colDef });
      if (l.colDef.field) return t[l.colDef.field];
    }
    function U(t, l) {
      const n = z(l, t);
      return t.colDef.valueFormatter ? t.colDef.valueFormatter({ value: n, data: l, colDef: t.colDef }) ?? "" : t.colDef.cellRenderer ? (t.colDef.cellRenderer({ value: n, data: l, colDef: t.colDef }) ?? "").replace(/<[^>]+>/g, "") : n == null ? "" : String(n);
    }
    function ie(t, l) {
      return t.colDef.cellStyle ? typeof t.colDef.cellStyle == "function" ? t.colDef.cellStyle({ value: z(l, t), data: l, colDef: t.colDef }) ?? {} : t.colDef.cellStyle : {};
    }
    const q = B(() => {
      O.value;
      let t = D.value;
      const l = T.value.trim().toLowerCase();
      l && (t = t.filter(
        (n) => x.value.some(
          (o) => String(z(n, o) ?? "").toLowerCase().includes(l)
        )
      ));
      for (const [n, o] of Object.entries(p)) {
        if (!o) continue;
        const c = x.value.find((a) => a.colId === n);
        if (c)
          if (o.startsWith("__eq__")) {
            const a = o.slice(6).toLowerCase();
            t = t.filter((v) => String(z(v, c) ?? "").toLowerCase() === a);
          } else {
            const a = o.toLowerCase();
            t = t.filter((v) => String(z(v, c) ?? "").toLowerCase().includes(a));
          }
      }
      if (y.value) {
        const { colId: n, dir: o } = y.value, c = x.value.find((a) => a.colId === n);
        c && (t = [...t].sort((a, v) => {
          const r = z(a, c), k = z(v, c);
          let E = 0;
          return c.colDef.comparator ? E = c.colDef.comparator(r, k) : typeof r == "number" && typeof k == "number" ? E = r - k : E = String(r ?? "").localeCompare(String(k ?? ""), void 0, { numeric: !0 }), o === "asc" ? E : -E;
        }));
      }
      return t;
    }), oe = B(
      () => Math.max(1, Math.ceil(q.value.length / A.value))
    ), N = B(
      () => e.pagination ? q.value.slice(
        m.value * A.value,
        (m.value + 1) * A.value
      ) : q.value
    );
    K(q, () => {
      m.value = 0, s.value = null;
    }), K(A, () => {
      m.value = 0;
    });
    let J = !1, fe = "", be = 0, ye = 0, ce = !1;
    function Be(t, l) {
      var n;
      J = !0, fe = t, be = l, ye = ((n = w.value.find((o) => o.colId === t)) == null ? void 0 : n.width) ?? 100, ce = !1;
    }
    function Ce(t) {
      if (!J) return;
      const l = M.value, n = Math.max(30, ye + (t.clientX - be)), o = x.value.filter((a) => a.colId !== fe).reduce((a, v) => a + v.width, 0), c = l - n;
      c > 10 && (h[fe] = Math.max(10, Math.round(n * o / c))), H();
    }
    function Ie() {
      J && (J = !1, ce = !0, i("column-resized"));
    }
    const V = R(null), L = R(null);
    let j = null, ve, De, X, Q, G;
    function Fe() {
      !L.value || !V.value || (G = document.createElement("canvas"), j = new W.WebGLRenderer({ canvas: L.value, antialias: !1 }), j.setPixelRatio(1), ve = new W.Scene(), De = new W.OrthographicCamera(-1, 1, 1, -1, 0, 1), Q = new W.CanvasTexture(G), Q.minFilter = W.LinearFilter, Q.magFilter = W.LinearFilter, X = new W.ShaderMaterial({
        uniforms: {
          uTex: { value: Q },
          uStrength: { value: 0 },
          uScanlines: { value: 1 },
          uVignette: { value: 1 },
          uBezel: { value: new W.Color(0) }
        },
        vertexShader: st,
        fragmentShader: ut
      }), ve.add(new W.Mesh(new W.PlaneGeometry(2, 2), X)), he());
    }
    function he() {
      if (!j || !V.value) return;
      const t = V.value.clientWidth, l = V.value.clientHeight - (e.pagination ? dt : 0);
      !t || !l || (j.setSize(t, l), G.width = t, G.height = l, M.value = t, F.value = l, H());
    }
    function H() {
      var n, o, c, a;
      if (!j || !X || !Q || !G.width) return;
      const t = le[e.theme] ?? le.none, l = e.theme === "paper";
      X.uniforms.uStrength.value = e.curvature / 45 * 0.55, X.uniforms.uScanlines.value = e.scanlines && !l ? 1 : 0, X.uniforms.uVignette.value = l ? 0 : 1, X.uniforms.uBezel.value.set(t.bg), tt(G, {
        cols: w.value,
        rows: N.value,
        pinnedRows: d.value,
        rowHeight: e.rowHeight,
        scrollY: $.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((n = y.value) == null ? void 0 : n.colId) ?? null,
        sortDir: ((o = y.value) == null ? void 0 : o.dir) ?? null,
        colFilters: p,
        hoveredRow: Y.value,
        selectedRow: ((c = s.value) == null ? void 0 : c.row) ?? -1,
        selectedCol: ((a = s.value) == null ? void 0 : a.col) ?? -1,
        formatCell: U,
        getCellStyle: ie
      }), Q.needsUpdate = !0, j.render(ve, De);
    }
    function ze() {
      return e.curvature / 45 * 0.55;
    }
    function ge(t) {
      if (!L.value) return [-1, -1];
      const l = L.value.getBoundingClientRect();
      return nt(
        t.clientX - l.left,
        t.clientY - l.top,
        L.value.width,
        L.value.height,
        ze()
      );
    }
    let Se = 0;
    function Le(t) {
      if (f.value = null, e.pagination) {
        const l = Date.now();
        if (l - Se < 120) return;
        Se = l, t.deltaY > 0 && m.value < oe.value - 1 ? (m.value++, s.value = null) : t.deltaY < 0 && m.value > 0 && (m.value--, s.value = null), H();
      } else {
        const l = d.value.length * e.rowHeight, n = F.value - S - l, o = Math.max(0, q.value.length * e.rowHeight - n);
        $.value = Math.max(0, Math.min(o, $.value + t.deltaY)), H();
      }
    }
    function Ee(t) {
      if (J) return;
      const [l, n] = ge(t);
      if (l < 0) {
        Y.value = -1, H();
        return;
      }
      const o = Pe(
        l,
        n,
        w.value,
        N.value.length,
        e.rowHeight,
        $.value,
        G.height,
        d.value.length
      );
      if (Y.value = o.area === "body" ? o.rowIdx : -1, o.area === "header" && o.colIdx >= 0) {
        const c = w.value[o.colIdx], a = xe(o.colIdx, w.value);
        L.value.style.cursor = c && Ae(l, a, c.width) ? "col-resize" : "pointer";
      } else o.area === "body" ? L.value.style.cursor = "pointer" : L.value.style.cursor = "default";
      H();
    }
    function We() {
      Y.value = -1, H();
    }
    function Oe(t) {
      const [l, n] = ge(t);
      if (!(l < 0 || n >= S))
        for (let o = 0; o < w.value.length; o++) {
          const c = w.value[o], a = xe(o, w.value);
          if (c.colDef.resizable !== !1 && Ae(l, a, c.width)) {
            Be(c.colId, t.clientX);
            return;
          }
        }
    }
    function $e(t) {
      var c, a, v;
      if (ce) {
        ce = !1;
        return;
      }
      if (J) return;
      const [l, n] = ge(t);
      if (l < 0) {
        f.value = null;
        return;
      }
      const o = Pe(
        l,
        n,
        w.value,
        N.value.length,
        e.rowHeight,
        $.value,
        G.height,
        d.value.length
      );
      if (o.area === "header" && o.colIdx >= 0) {
        const r = w.value[o.colIdx], k = xe(o.colIdx, w.value);
        r.colDef.filter && at(l, k, r.width) ? f.value === r.colId ? f.value = null : (f.value = r.colId, b.value = (c = p[r.colId]) != null && c.startsWith("__eq__") ? p[r.colId].slice(6) : p[r.colId] ?? "", C.value = { x: Math.max(0, k), y: S }) : r.colDef.sortable !== !1 && (f.value = null, y.value = ((a = y.value) == null ? void 0 : a.colId) === r.colId ? y.value.dir === "asc" ? { colId: r.colId, dir: "desc" } : null : { colId: r.colId, dir: "asc" }, i("sort-changed"));
        return;
      }
      if (f.value = null, o.area === "body" && o.rowIdx >= 0 && o.colIdx >= 0) {
        s.value = { row: o.rowIdx, col: o.colIdx }, (v = L.value) == null || v.focus();
        const r = N.value[o.rowIdx], k = w.value[o.colIdx];
        r && k && (i("row-clicked", { data: r, event: t }), i("cell-selected", { data: r, row: o.rowIdx, col: o.colIdx, colId: k.colId }));
      }
    }
    function ke(t) {
      var l, n;
      f.value && ((n = (l = t.target).closest) != null && n.call(l, ".cathode-filter-popup") || (f.value = null));
    }
    function Ue(t) {
      var _e;
      const l = w.value, n = N.value, o = l.length - 1, c = n.length - 1;
      if (!s.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(t.key) && (t.preventDefault(), s.value = { row: 0, col: 0 });
        return;
      }
      let { row: a, col: v } = s.value;
      const r = (se, ue) => {
        a = Math.max(0, Math.min(c, se)), v = Math.max(0, Math.min(o, ue)), s.value = { row: a, col: v };
      }, k = () => {
        m.value > 0 && (m.value--, r(A.value - 1, v));
      }, E = () => {
        m.value < oe.value - 1 && (m.value++, r(0, v));
      };
      switch (t.key) {
        case "ArrowDown":
          t.preventDefault(), a < c ? r(a + 1, v) : E();
          break;
        case "ArrowUp":
          t.preventDefault(), a > 0 ? r(a - 1, v) : k();
          break;
        case "ArrowRight":
          t.preventDefault(), v < o ? r(a, v + 1) : a < c ? r(a + 1, 0) : E();
          break;
        case "ArrowLeft":
          t.preventDefault(), v > 0 ? r(a, v - 1) : a > 0 ? r(a - 1, o) : k();
          break;
        case "Tab":
          t.preventDefault(), t.shiftKey ? v > 0 ? r(a, v - 1) : a > 0 ? r(a - 1, o) : k() : v < o ? r(a, v + 1) : a < c ? r(a + 1, 0) : E();
          break;
        case "Enter":
          t.preventDefault(), t.shiftKey ? a > 0 ? r(a - 1, v) : k() : a < c ? r(a + 1, v) : E();
          break;
        case "Home":
          t.preventDefault(), t.ctrlKey || t.metaKey ? (m.value = 0, r(0, 0)) : r(a, 0);
          break;
        case "End":
          t.preventDefault(), t.ctrlKey || t.metaKey ? (m.value = oe.value - 1, me(() => r(N.value.length - 1, o))) : r(a, o);
          break;
        case "PageDown":
          t.preventDefault(), E();
          break;
        case "PageUp":
          t.preventDefault(), k();
          break;
        case "Escape":
          s.value = null;
          break;
        case "c":
        case "C":
          if (t.ctrlKey || t.metaKey) {
            t.preventDefault();
            const se = n[a], ue = l[v];
            if (se && ue) {
              const Ve = U(ue, se);
              (_e = navigator.clipboard) == null || _e.writeText(Ve).catch(() => {
              });
            }
          }
          break;
      }
    }
    function Ne(t) {
      const l = t.target.value;
      b.value = l, l ? p[f.value] = l : delete p[f.value], m.value = 0, i("filter-changed");
    }
    function Re() {
      f.value && delete p[f.value], b.value = "", f.value = null, m.value = 0, i("filter-changed");
    }
    const je = {
      setGridOption(t, l) {
        t === "rowData" ? D.value = l : t === "pinnedBottomRowData" ? d.value = l : t === "quickFilterText" && (T.value = l);
      },
      getColumnState() {
        return e.columnDefs.map((t) => {
          var n, o;
          const l = I(t);
          return {
            colId: l,
            hide: _.has(l),
            sort: ((n = y.value) == null ? void 0 : n.colId) === l ? y.value.dir : null,
            sortIndex: ((o = y.value) == null ? void 0 : o.colId) === l ? 0 : null,
            width: h[l] ?? t.width
          };
        });
      },
      applyColumnState({ state: t }) {
        for (const l of t)
          l.hide === !0 && _.add(l.colId), l.hide === !1 && _.delete(l.colId), l.sort && (y.value = { colId: l.colId, dir: l.sort }), l.width && (h[l.colId] = l.width);
      },
      setFilterModel(t) {
        for (const l of Object.keys(p)) delete p[l];
        if (t)
          for (const [l, n] of Object.entries(t))
            (n == null ? void 0 : n.type) === "equals" ? p[l] = `__eq__${n.filter}` : n != null && n.filter && (p[l] = n.filter);
      },
      getFilterModel() {
        const t = {};
        for (const [l, n] of Object.entries(p))
          n && (t[l] = n.startsWith("__eq__") ? { type: "equals", filter: n.slice(6) } : { type: "contains", filter: n });
        return t;
      },
      async setColumnFilterModel(t, l) {
        l ? l.type === "equals" ? p[t] = `__eq__${l.filter}` : p[t] = l.filter ?? "" : delete p[t];
      },
      onFilterChanged() {
      },
      refreshCells() {
        O.value++;
      },
      exportDataAsCsv({ fileName: t = "export.csv" } = {}) {
        const l = x.value, n = l.map((v) => v.colDef.headerName ?? v.colId).join(","), o = q.value.map(
          (v) => l.map((r) => `"${String(U(r, v)).replace(/"/g, '""')}"`).join(",")
        ), c = new Blob([[n, ...o].join(`
`)], { type: "text/csv" }), a = URL.createObjectURL(c);
        Object.assign(document.createElement("a"), { href: a, download: t }).click(), URL.revokeObjectURL(a);
      },
      resize() {
        he();
      },
      resetColumnState() {
        _.clear();
        for (const l of e.columnDefs)
          l.hide && _.add(I(l));
        const t = e.columnDefs.find((l) => l.sort);
        y.value = t ? { colId: I(t), dir: t.sort } : null;
        for (const l of Object.keys(h)) delete h[l];
        for (const l of Object.keys(p)) delete p[l];
        T.value = "", $.value = 0, m.value = 0, s.value = null, f.value = null;
      }
    };
    K(
      [N, () => d.value, w, $, Y, s],
      () => me(H)
    ), K(() => e.theme, () => H()), K(() => e.curvature, () => H()), K(() => e.scanlines, () => H()), K(() => e.glow, () => H()), K(s, (t) => {
      if (!t) return;
      const l = N.value[t.row], n = w.value[t.col];
      l && n && i("cell-selected", { data: l, row: t.row, col: t.col, colId: n.colId });
    });
    let ne = null, pe = 0;
    Ze(() => {
      for (const t of e.columnDefs)
        t.hide && _.add(I(t)), t.sort && !y.value && (y.value = { colId: I(t), dir: t.sort });
      D.value = e.rowData ?? [], d.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", ke, !0), document.addEventListener("mousemove", Ce), document.addEventListener("mouseup", Ie), me(() => {
        Fe(), V.value && (ne = new ResizeObserver(() => {
          cancelAnimationFrame(pe), pe = requestAnimationFrame(he);
        }), ne.observe(V.value)), i("grid-ready", { api: je });
      });
    }), Je(() => {
      document.removeEventListener("click", ke, !0), document.removeEventListener("mousemove", Ce), document.removeEventListener("mouseup", Ie), ne == null || ne.disconnect(), cancelAnimationFrame(pe), j == null || j.dispose();
    });
    const P = B(() => le[e.theme] ?? le.none), Ge = B(() => ({
      position: "absolute",
      left: `${C.value.x}px`,
      top: `${C.value.y}px`,
      zIndex: 100,
      background: P.value.headerBg,
      border: `1px solid ${P.value.accent}`,
      color: P.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Ke = B(() => ({
      background: P.value.bg,
      border: `1px solid ${P.value.border}`,
      color: P.value.text,
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Ye = B(() => ({
      background: P.value.headerBg,
      borderTop: `1px solid ${P.value.border}`,
      color: P.value.text
    })), qe = B(() => ({
      background: P.value.bg
    })), Te = B(() => P.value.accent);
    return (t, l) => {
      var n, o;
      return ae(), re("div", {
        ref_key: "wrapEl",
        ref: V,
        class: "cathode-wrap",
        style: Z(qe.value)
      }, [
        ee("canvas", {
          ref_key: "canvasEl",
          ref: L,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Me(Le, ["prevent"]),
          onMousemove: Ee,
          onMouseleave: We,
          onMousedown: Oe,
          onClick: $e,
          onKeydown: Ue
        }, null, 544),
        f.value ? (ae(), re("div", {
          key: 0,
          style: Z(Ge.value),
          onClick: l[0] || (l[0] = Me(() => {
          }, ["stop"]))
        }, [
          ee("input", {
            style: Z(Ke.value),
            value: b.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Ne,
            onKeydown: Qe(Re, ["escape"])
          }, null, 44, rt),
          b.value ? (ae(), re("button", {
            key: 0,
            style: Z({
              background: "none",
              border: "none",
              color: P.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: Re
          }, "✕", 4)) : de("", !0)
        ], 4)) : de("", !0),
        g.pagination ? (ae(), re("div", {
          key: 1,
          class: "cathode-pagination",
          style: Z(Ye.value)
        }, [
          ee("button", {
            disabled: m.value === 0,
            onClick: l[1] || (l[1] = (c) => {
              m.value--, s.value = null, H();
            })
          }, "◀", 8, it),
          ee("span", null, te(m.value + 1) + " / " + te(oe.value), 1),
          ee("button", {
            disabled: m.value >= oe.value - 1,
            onClick: l[2] || (l[2] = (c) => {
              m.value++, s.value = null, H();
            })
          }, "▶", 8, ct),
          ee("span", {
            class: "cathode-page-info",
            style: Z({ color: Te.value })
          }, te(q.value.length.toLocaleString()) + " rows · " + te(A.value) + " per page ", 5),
          s.value ? (ae(), re("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Z({ color: Te.value })
          }, te(((n = w.value[s.value.col]) == null ? void 0 : n.colDef.headerName) ?? ((o = w.value[s.value.col]) == null ? void 0 : o.colId)) + " : " + te(U(w.value[s.value.col], N.value[s.value.row])), 5)) : de("", !0)
        ], 4)) : de("", !0)
      ], 4);
    };
  }
}), vt = (g, u) => {
  const e = g.__vccOpts || g;
  for (const [i, D] of u)
    e[i] = D;
  return e;
}, gt = /* @__PURE__ */ vt(ft, [["__scopeId", "data-v-149b3534"]]);
export {
  gt as CathodeGrid
};
