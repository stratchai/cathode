import { defineComponent as Ne, ref as E, reactive as Ze, computed as V, watch as K, inject as lt, nextTick as ye, onMounted as $e, onUnmounted as Xe, openBlock as re, createElementBlock as ie, normalizeStyle as we, createElementVNode as N, withModifiers as Le, withKeys as Bt, createCommentVNode as ge, toDisplayString as he, provide as ft, renderSlot as Qe, createVNode as $t, Transition as Pt, withCtx as Ot, Fragment as Yt, renderList as Vt, createTextVNode as Nt, normalizeClass as Xt, withDirectives as Ut, vShow as Kt } from "vue";
import * as $ from "three";
const He = {
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
}, ee = 30, mt = 12, Gt = 10;
function ht(o, n) {
  const e = o.getContext("2d");
  if (!e) return;
  const a = o.width, h = o.height, w = He[n.theme] ?? He.none, { cols: S, rows: g, pinnedRows: y, rowHeight: s, scrollY: m, scrollX: F, glow: z } = n;
  e.clearRect(0, 0, a, h), e.fillStyle = w.bg, e.fillRect(0, 0, a, h), e.save(), e.beginPath(), e.rect(0, 0, a, h), e.clip();
  const H = y.length * s, C = h - ee - H;
  e.fillStyle = w.headerBg, e.fillRect(0, 0, a, ee), e.textBaseline = "middle", e.textAlign = "left";
  let x = -F;
  for (let v = 0; v < S.length; v++) {
    const T = S[v];
    if (x + T.width <= 0) {
      x += T.width;
      continue;
    }
    if (x >= a) break;
    const W = !!n.colFilters[T.colId], k = n.sortColId === T.colId, M = (T.colDef.headerName ?? T.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(x, 0, T.width, ee), e.clip(), e.font = `bold ${Gt}px system-ui, -apple-system, sans-serif`, e.fillStyle = W ? w.accent : w.textHeader, z && (e.shadowBlur = 6, e.shadowColor = w.textHeader), e.fillText(M, x + 8, ee / 2), e.shadowBlur = 0, k) {
      const c = e.measureText(M).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = w.accent, e.fillText(n.sortDir === "asc" ? "▲" : "▼", x + 8 + c + 4, ee / 2);
    }
    T.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = W ? w.accent : w.textHeader, e.globalAlpha = W ? 1 : 0.38, e.fillText("⌕", x + T.width - 20, ee / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = w.border, e.lineWidth = 1, e.beginPath(), e.moveTo(x + T.width - 0.5, 0), e.lineTo(x + T.width - 0.5, ee), e.stroke(), x += T.width;
  }
  e.strokeStyle = w.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, ee - 0.5), e.lineTo(a, ee - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, ee, a, C), e.clip();
  const I = Math.max(0, Math.floor(m / s)), i = Math.min(g.length, Math.ceil((m + C) / s));
  for (let v = I; v < i; v++) {
    const T = g[v], W = ee + v * s - m;
    v % 2 === 1 && (e.fillStyle = w.rowAlt, e.fillRect(0, W, a, s)), v === n.hoveredRow && v !== n.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, W, a, s)), v === n.selectedRow && (e.fillStyle = qt(w.accent, 0.1), e.fillRect(0, W, a, s)), e.strokeStyle = w.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, W + s - 0.5), e.lineTo(a, W + s - 0.5), e.stroke();
    let k = -F;
    for (let M = 0; M < S.length; M++) {
      const c = S[M];
      if (k + c.width <= 0) {
        k += c.width;
        continue;
      }
      if (k >= a) break;
      const A = n.getCellStyle(c, T), X = A.color ?? w.text, B = A.textAlign ?? "left", le = n.formatCell(c, T);
      e.save(), e.beginPath(), e.rect(k + 1, W, c.width - 2, s), e.clip(), e.font = `${mt}px system-ui, -apple-system, sans-serif`, e.fillStyle = X, e.textBaseline = "middle", z && (e.shadowBlur = 4, e.shadowColor = X), B === "right" ? (e.textAlign = "right", e.fillText(le, k + c.width - 8, W + s / 2)) : (e.textAlign = "left", e.fillText(le, k + 8, W + s / 2)), e.shadowBlur = 0, e.restore(), v === n.selectedRow && M === n.selectedCol && (e.strokeStyle = w.accent, e.lineWidth = 2, e.strokeRect(k + 1.5, W + 1.5, c.width - 3, s - 3)), e.strokeStyle = w.border, e.lineWidth = 1, e.beginPath(), e.moveTo(k + c.width - 0.5, W), e.lineTo(k + c.width - 0.5, W + s), e.stroke(), k += c.width;
    }
  }
  if (e.restore(), y.length > 0) {
    const v = h - H;
    e.strokeStyle = w.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, v - 0.5), e.lineTo(a, v - 0.5), e.stroke();
    for (let T = 0; T < y.length; T++) {
      const W = y[T], k = v + T * s;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, k, a, s);
      let M = -F;
      for (let c = 0; c < S.length; c++) {
        const A = S[c];
        if (M + A.width <= 0) {
          M += A.width;
          continue;
        }
        if (M >= a) break;
        const X = n.getCellStyle(A, W), B = X.color ?? w.text, le = X.textAlign ?? "left", ne = n.formatCell(A, W);
        e.save(), e.beginPath(), e.rect(M + 1, k, A.width - 2, s), e.clip(), e.font = `bold ${mt}px system-ui, -apple-system, sans-serif`, e.fillStyle = B, e.textBaseline = "middle", le === "right" ? (e.textAlign = "right", e.fillText(ne, M + A.width - 8, k + s / 2)) : (e.textAlign = "left", e.fillText(ne, M + 8, k + s / 2)), e.restore(), e.strokeStyle = w.border, e.lineWidth = 1, e.beginPath(), e.moveTo(M + A.width - 0.5, k), e.lineTo(M + A.width - 0.5, k + s), e.stroke(), M += A.width;
      }
      e.strokeStyle = w.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, k + s - 0.5), e.lineTo(a, k + s - 0.5), e.stroke();
    }
  }
  e.restore();
}
function qt(o, n) {
  if (o.startsWith("rgba") || o.startsWith("rgb"))
    return o.replace(/[\d.]+\)$/, `${n})`);
  const e = parseInt(o.slice(1, 3), 16), a = parseInt(o.slice(3, 5), 16), h = parseInt(o.slice(5, 7), 16);
  return `rgba(${e},${a},${h},${n})`;
}
function Je(o, n) {
  let e = 0;
  for (let a = 0; a < o; a++) e += n[a].width;
  return e;
}
function jt(o, n, e) {
  return o >= n + e - 24 && o < n + e;
}
function gt(o, n, e) {
  const a = n + e;
  return o >= a - 6 && o <= a + 1;
}
function pt(o, n, e, a, h, w, S, g, y) {
  const s = o + y;
  let m = -1, F = 0;
  for (let x = 0; x < e.length; x++) {
    if (s >= F && s < F + e[x].width) {
      m = x;
      break;
    }
    F += e[x].width;
  }
  if (n < ee) return { area: "header", colIdx: m, rowIdx: -1 };
  const z = g * h;
  if (z > 0 && n >= S - z) {
    const x = Math.floor((n - (S - z)) / h);
    return { area: "pinned", colIdx: m, rowIdx: x };
  }
  const H = n - ee + w, C = Math.floor(H / h);
  return C >= 0 && C < a ? { area: "body", colIdx: m, rowIdx: C } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const Zt = ["value"], Jt = ["disabled"], Qt = ["disabled"], el = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, tl = `
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
`, ll = 28, nl = 600, ol = /* @__PURE__ */ Ne({
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
  setup(o, { emit: n }) {
    const e = o, a = n, h = E(e.rowData ?? []), w = E(e.pinnedBottomRowData ?? []), S = E(""), g = E(null), y = Ze({}), s = Ze({}), m = Ze(/* @__PURE__ */ new Set()), F = E(0), z = E(0), H = E(0), C = E(0), x = E(0), I = E(-1), i = E(null), v = E(null), T = E({ x: 0, y: ee }), W = E("");
    function k(t) {
      return t.colId ?? t.field ?? (t.headerName ? t.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const M = V(() => {
      const t = e.defaultColDef ?? {};
      return e.columnDefs.filter((l) => !m.has(k(l))).map((l) => {
        const r = k(l), u = { ...t, ...l };
        return { colId: r, colDef: u, width: s[r] ?? u.width ?? 100 };
      });
    }), c = V(() => {
      const t = z.value;
      if (!t) return M.value;
      const l = M.value.reduce((d, f) => d + f.width, 0);
      if (!l || l >= t) return M.value;
      const r = t / l;
      let u = 0;
      return M.value.map((d, f) => {
        const _ = f === M.value.length - 1 ? t - u : Math.max(8, Math.round(d.width * r));
        return u += _, { ...d, width: _ };
      });
    }), A = V(() => {
      const t = c.value.reduce((l, r) => l + r.width, 0);
      return Math.max(0, t - z.value);
    }), X = V(() => {
      const t = w.value.length * e.rowHeight;
      return Math.max(0, H.value - ee - t);
    }), B = V(
      () => Math.max(0, P.value.length * e.rowHeight - X.value)
    ), le = V(
      () => Math.max(1, Math.floor(X.value / e.rowHeight))
    ), ne = V(
      () => P.value.length === 0 ? 0 : Math.min(P.value.length - 1, Math.floor(C.value / e.rowHeight))
    ), ke = V(
      () => Math.min(P.value.length - 1, ne.value + le.value - 1)
    );
    function j(t, l) {
      if (l.colDef.valueGetter) return l.colDef.valueGetter({ data: t, colDef: l.colDef });
      if (l.colDef.field) return t[l.colDef.field];
    }
    function ve(t, l) {
      const r = j(l, t);
      return t.colDef.valueFormatter ? t.colDef.valueFormatter({ value: r, data: l, colDef: t.colDef }) ?? "" : t.colDef.cellRenderer ? (t.colDef.cellRenderer({ value: r, data: l, colDef: t.colDef }) ?? "").replace(/<[^>]+>/g, "") : r == null ? "" : String(r);
    }
    function Se(t, l) {
      return t.colDef.cellStyle ? typeof t.colDef.cellStyle == "function" ? t.colDef.cellStyle({ value: j(l, t), data: l, colDef: t.colDef }) ?? {} : t.colDef.cellStyle : {};
    }
    const P = V(() => {
      F.value;
      let t = h.value;
      const l = S.value.trim().toLowerCase();
      l && (t = t.filter(
        (r) => M.value.some(
          (u) => String(j(r, u) ?? "").toLowerCase().includes(l)
        )
      ));
      for (const [r, u] of Object.entries(y)) {
        if (!u) continue;
        const d = M.value.find((f) => f.colId === r);
        if (d)
          if (u.startsWith("__eq__")) {
            const f = u.slice(6).toLowerCase();
            t = t.filter((L) => String(j(L, d) ?? "").toLowerCase() === f);
          } else {
            const f = u.toLowerCase();
            t = t.filter((L) => String(j(L, d) ?? "").toLowerCase().includes(f));
          }
      }
      if (g.value) {
        const { colId: r, dir: u } = g.value, d = M.value.find((f) => f.colId === r);
        d && (t = [...t].sort((f, L) => {
          const _ = j(f, d), q = j(L, d);
          let Q = 0;
          return d.colDef.comparator ? Q = d.colDef.comparator(_, q) : typeof _ == "number" && typeof q == "number" ? Q = _ - q : Q = String(_ ?? "").localeCompare(String(q ?? ""), void 0, { numeric: !0 }), u === "asc" ? Q : -Q;
        }));
      }
      return t;
    });
    K(P, () => {
      C.value = 0, i.value = null;
    }), K(A, () => {
      x.value = Math.min(x.value, A.value);
    }), K(B, () => {
      C.value = Math.min(C.value, B.value);
    });
    function Te(t) {
      const l = t * e.rowHeight, r = l + e.rowHeight;
      l < C.value ? C.value = l : r > C.value + X.value && (C.value = Math.min(B.value, r - X.value));
    }
    function Re() {
      C.value = Math.max(0, C.value - X.value), ae();
    }
    function b() {
      C.value = Math.min(B.value, C.value + X.value), ae();
    }
    let R = !1, O = "", Z = 0, se = 0, ce = !1, Y = !1, xe = 0, Ce = 0, De = 0, ze = 0, p = !1;
    function D(t, l) {
      var r;
      R = !0, O = t, Z = l, se = ((r = c.value.find((u) => u.colId === t)) == null ? void 0 : r.width) ?? 100, ce = !1;
    }
    function J(t) {
      if (Y) {
        const f = xe - t.clientX, L = Ce - t.clientY;
        (Math.abs(f) > 4 || Math.abs(L) > 4) && (p = !0), x.value = Math.max(0, Math.min(A.value, De + f)), C.value = Math.max(0, Math.min(B.value, ze + L)), ae();
        return;
      }
      if (!R) return;
      const l = z.value, r = Math.max(30, se + (t.clientX - Z)), u = M.value.filter((f) => f.colId !== O).reduce((f, L) => f + L.width, 0), d = l - r;
      d > 10 && (s[O] = Math.max(10, Math.round(r * u / d))), ae();
    }
    function be() {
      Y && (p && (ce = !0), Y = !1), R && (R = !1, ce = !0, a("column-resized"));
    }
    const fe = E(null), U = E(null), Mt = lt("cathodeResetTick", E(0));
    K(Mt, () => _e());
    let G = null, Me = !1, Ke, at, pe, ue, oe;
    function rt() {
      if (!(!U.value || !fe.value)) {
        oe = document.createElement("canvas");
        try {
          G = new $.WebGLRenderer({ canvas: U.value, antialias: !1, alpha: !0 });
        } catch {
          Me = !0;
        }
        if (!Me && !G.getContext() && (G.dispose(), G = null, Me = !0), Me) {
          Ee();
          return;
        }
        G.setPixelRatio(1), G.setClearColor(0, 0), Ke = new $.Scene(), at = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), ue = new $.CanvasTexture(oe), ue.minFilter = $.LinearFilter, ue.magFilter = $.LinearFilter, pe = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: ue },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new $.Color(0) }
          },
          vertexShader: el,
          fragmentShader: tl,
          transparent: !0
        }), Ke.add(new $.Mesh(new $.PlaneGeometry(2, 2), pe)), Ee();
      }
    }
    function Ee() {
      if (!fe.value || !G && !Me) return;
      const t = fe.value.clientWidth, l = fe.value.clientHeight - (e.pagination ? ll : 0);
      if (!t || !l) return;
      const r = oe.width !== t || oe.height !== l;
      oe.width = t, oe.height = l, z.value = t, H.value = l, x.value = Math.max(0, Math.min(A.value, x.value)), C.value = Math.max(0, Math.min(B.value, C.value)), G ? (r && ue && (ue.dispose(), ue = new $.CanvasTexture(oe), ue.minFilter = $.LinearFilter, ue.magFilter = $.LinearFilter, pe && (pe.uniforms.uTex.value = ue)), G.setPixelRatio(window.devicePixelRatio || 1), G.setSize(t, l)) : U.value && (U.value.width = t, U.value.height = l, U.value.style.width = t + "px", U.value.style.height = l + "px"), ae();
    }
    function ae() {
      var r, u, d, f, L, _, q, Q;
      if (!(oe != null && oe.width)) return;
      if (Me) {
        if (!U.value) return;
        ht(oe, {
          cols: c.value,
          rows: P.value,
          pinnedRows: w.value,
          rowHeight: e.rowHeight,
          scrollY: C.value,
          scrollX: x.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((r = g.value) == null ? void 0 : r.colId) ?? null,
          sortDir: ((u = g.value) == null ? void 0 : u.dir) ?? null,
          colFilters: y,
          hoveredRow: I.value,
          selectedRow: ((d = i.value) == null ? void 0 : d.row) ?? -1,
          selectedCol: ((f = i.value) == null ? void 0 : f.col) ?? -1,
          formatCell: ve,
          getCellStyle: Se
        });
        const vt = U.value.getContext("2d");
        vt && vt.drawImage(oe, 0, 0);
        return;
      }
      if (!G || !pe || !ue) return;
      const t = He[e.theme] ?? He.none, l = e.theme === "paper";
      pe.uniforms.uStrength.value = e.curvature / 45 * 0.55, pe.uniforms.uScanlines.value = e.scanlines && !l ? 1 : 0, pe.uniforms.uVignette.value = l ? 0 : 1, pe.uniforms.uBezel.value.set(t.bg), ht(oe, {
        cols: c.value,
        rows: P.value,
        pinnedRows: w.value,
        rowHeight: e.rowHeight,
        scrollY: C.value,
        scrollX: x.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((L = g.value) == null ? void 0 : L.colId) ?? null,
        sortDir: ((_ = g.value) == null ? void 0 : _.dir) ?? null,
        colFilters: y,
        hoveredRow: I.value,
        selectedRow: ((q = i.value) == null ? void 0 : q.row) ?? -1,
        selectedCol: ((Q = i.value) == null ? void 0 : Q.col) ?? -1,
        formatCell: ve,
        getCellStyle: Se
      }), ue.needsUpdate = !0, G.render(Ke, at);
    }
    function Ge(t) {
      if (!U.value) return [-1, -1];
      const l = U.value.getBoundingClientRect();
      return [t.clientX - l.left, t.clientY - l.top];
    }
    let qe = 0;
    function Lt(t) {
      v.value = null;
      const l = Date.now();
      if (t.deltaX !== 0) {
        qe = l, x.value = Math.max(0, Math.min(A.value, x.value + t.deltaX)), ae();
        return;
      }
      if (t.shiftKey && t.deltaY !== 0) {
        qe = l, x.value = Math.max(0, Math.min(A.value, x.value + t.deltaY)), ae();
        return;
      }
      l - qe < nl || (C.value = Math.max(0, Math.min(B.value, C.value + t.deltaY)), ae());
    }
    function It(t) {
      if (R) return;
      const [l, r] = Ge(t);
      if (l < 0) {
        I.value = -1, ae();
        return;
      }
      const u = pt(
        l,
        r,
        c.value,
        P.value.length,
        e.rowHeight,
        C.value,
        oe.height,
        w.value.length,
        x.value
      );
      if (I.value = u.area === "body" ? u.rowIdx : -1, u.area === "header" && u.colIdx >= 0) {
        const d = c.value[u.colIdx], f = Je(u.colIdx, c.value), L = l + x.value;
        U.value.style.cursor = d && gt(L, f, d.width) ? "col-resize" : "pointer";
      } else u.area === "body" ? U.value.style.cursor = "pointer" : U.value.style.cursor = "default";
      ae();
    }
    function kt() {
      I.value = -1, ae();
    }
    function Tt(t) {
      const [l, r] = Ge(t);
      if (l < 0) return;
      if (r >= ee) {
        Y = !0, p = !1, xe = t.clientX, Ce = t.clientY, De = x.value, ze = C.value;
        return;
      }
      const u = l + x.value;
      for (let d = 0; d < c.value.length; d++) {
        const f = c.value[d], L = Je(d, c.value);
        if (f.colDef.resizable !== !1 && gt(u, L, f.width)) {
          D(f.colId, t.clientX);
          return;
        }
      }
    }
    function Rt(t) {
      var d, f, L;
      if (ce) {
        ce = !1;
        return;
      }
      if (R) return;
      const [l, r] = Ge(t);
      if (l < 0) {
        v.value = null;
        return;
      }
      const u = pt(
        l,
        r,
        c.value,
        P.value.length,
        e.rowHeight,
        C.value,
        oe.height,
        w.value.length,
        x.value
      );
      if (u.area === "header" && u.colIdx >= 0) {
        const _ = c.value[u.colIdx], q = Je(u.colIdx, c.value), Q = l + x.value;
        _.colDef.filter && jt(Q, q, _.width) ? (t.stopPropagation(), v.value === _.colId ? v.value = null : (v.value = _.colId, W.value = (d = y[_.colId]) != null && d.startsWith("__eq__") ? y[_.colId].slice(6) : y[_.colId] ?? "", T.value = { x: Math.max(0, q - x.value), y: ee })) : _.colDef.sortable !== !1 && (v.value = null, g.value = ((f = g.value) == null ? void 0 : f.colId) === _.colId ? g.value.dir === "asc" ? { colId: _.colId, dir: "desc" } : null : { colId: _.colId, dir: "asc" }, a("sort-changed"));
        return;
      }
      if (v.value = null, u.area === "body" && u.rowIdx >= 0 && u.colIdx >= 0) {
        const _ = u.rowIdx;
        i.value = { row: _, col: u.colIdx }, (L = U.value) == null || L.focus();
        const q = P.value[_], Q = c.value[u.colIdx];
        q && Q && (a("row-clicked", { data: q, event: t }), a("cell-selected", { data: q, row: _, col: u.colIdx, colId: Q.colId }));
      }
    }
    function it(t) {
      var l, r;
      v.value && ((r = (l = t.target).closest) != null && r.call(l, ".cathode-filter-popup") || (v.value = null));
    }
    function Dt(t) {
      var d;
      if (!z.value) return;
      let l = 0;
      for (let f = 0; f < t; f++) l += c.value[f].width;
      const r = ((d = c.value[t]) == null ? void 0 : d.width) ?? 0, u = l - x.value;
      u < 0 ? x.value = Math.max(0, l) : u + r > z.value && (x.value = Math.min(A.value, l + r - z.value));
    }
    function zt(t) {
      var _;
      const l = c.value, r = l.length - 1, u = P.value.length - 1;
      if (!i.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(t.key) && (t.preventDefault(), i.value = { row: ne.value, col: 0 });
        return;
      }
      let { row: d, col: f } = i.value;
      const L = (q, Q) => {
        d = Math.max(0, Math.min(u, q)), f = Math.max(0, Math.min(r, Q)), i.value = { row: d, col: f }, Te(d), Dt(f);
      };
      switch (t.key) {
        case "ArrowDown":
          t.preventDefault(), L(d + 1, f);
          break;
        case "ArrowUp":
          t.preventDefault(), L(d - 1, f);
          break;
        case "ArrowRight":
          t.preventDefault(), f < r ? L(d, f + 1) : L(d + 1, 0);
          break;
        case "ArrowLeft":
          t.preventDefault(), f > 0 ? L(d, f - 1) : L(d - 1, r);
          break;
        case "Tab":
          t.preventDefault(), t.shiftKey ? f > 0 ? L(d, f - 1) : L(d - 1, r) : f < r ? L(d, f + 1) : L(d + 1, 0);
          break;
        case "Enter":
          t.preventDefault(), t.shiftKey ? L(d - 1, f) : L(d + 1, f);
          break;
        case "Home":
          t.preventDefault(), t.ctrlKey || t.metaKey ? L(0, 0) : L(d, 0);
          break;
        case "End":
          t.preventDefault(), t.ctrlKey || t.metaKey ? L(u, r) : L(d, r);
          break;
        case "PageDown":
          t.preventDefault(), L(Math.min(u, d + le.value), f);
          break;
        case "PageUp":
          t.preventDefault(), L(Math.max(0, d - le.value), f);
          break;
        case "Escape":
          i.value = null;
          break;
        case "c":
        case "C":
          if (t.ctrlKey || t.metaKey) {
            t.preventDefault();
            const q = P.value[d], Q = l[f];
            q && Q && ((_ = navigator.clipboard) == null || _.writeText(ve(Q, q)).catch(() => {
            }));
          }
          break;
      }
    }
    function Et(t) {
      const l = t.target.value;
      W.value = l, l ? y[v.value] = l : delete y[v.value], a("filter-changed");
    }
    function st() {
      v.value && delete y[v.value], W.value = "", v.value = null, a("filter-changed");
    }
    const _t = {
      setGridOption(t, l) {
        t === "rowData" ? h.value = l : t === "pinnedBottomRowData" ? w.value = l : t === "quickFilterText" && (S.value = l);
      },
      getColumnState() {
        return e.columnDefs.map((t) => {
          var r, u;
          const l = k(t);
          return {
            colId: l,
            hide: m.has(l),
            sort: ((r = g.value) == null ? void 0 : r.colId) === l ? g.value.dir : null,
            sortIndex: ((u = g.value) == null ? void 0 : u.colId) === l ? 0 : null,
            width: s[l] ?? t.width
          };
        });
      },
      applyColumnState({ state: t }) {
        for (const l of t)
          l.hide === !0 && m.add(l.colId), l.hide === !1 && m.delete(l.colId), l.sort && (g.value = { colId: l.colId, dir: l.sort }), l.width && (s[l.colId] = l.width);
      },
      setFilterModel(t) {
        for (const l of Object.keys(y)) delete y[l];
        if (t)
          for (const [l, r] of Object.entries(t))
            (r == null ? void 0 : r.type) === "equals" ? y[l] = `__eq__${r.filter}` : r != null && r.filter && (y[l] = r.filter);
      },
      getFilterModel() {
        const t = {};
        for (const [l, r] of Object.entries(y))
          r && (t[l] = r.startsWith("__eq__") ? { type: "equals", filter: r.slice(6) } : { type: "contains", filter: r });
        return t;
      },
      async setColumnFilterModel(t, l) {
        l ? l.type === "equals" ? y[t] = `__eq__${l.filter}` : y[t] = l.filter ?? "" : delete y[t];
      },
      onFilterChanged() {
      },
      refreshCells() {
        F.value++;
      },
      exportDataAsCsv({ fileName: t = "export.csv" } = {}) {
        const l = M.value, r = l.map((L) => L.colDef.headerName ?? L.colId).join(","), u = P.value.map(
          (L) => l.map((_) => `"${String(ve(_, L)).replace(/"/g, '""')}"`).join(",")
        ), d = new Blob([[r, ...u].join(`
`)], { type: "text/csv" }), f = URL.createObjectURL(d);
        Object.assign(document.createElement("a"), { href: f, download: t }).click(), URL.revokeObjectURL(f);
      },
      resize() {
        Ee();
      },
      resetColumnState() {
        m.clear();
        for (const l of e.columnDefs)
          l.hide && m.add(k(l));
        const t = e.columnDefs.find((l) => l.sort);
        g.value = t ? { colId: k(t), dir: t.sort } : null;
        for (const l of Object.keys(s)) delete s[l];
        for (const l of Object.keys(y)) delete y[l];
        S.value = "", C.value = 0, i.value = null, v.value = null;
      }
    };
    K(
      [P, () => w.value, c, C, I, i],
      () => ye(ae)
    ), K(() => e.theme, () => ae()), K(() => e.curvature, () => ye(Ee)), K(() => e.scanlines, () => ae()), K(() => e.glow, () => ae()), K(i, (t) => {
      if (!t) return;
      const l = P.value[t.row], r = c.value[t.col];
      l && r && a("cell-selected", { data: l, row: t.row, col: t.col, colId: r.colId });
    });
    let Ae = null, Be = null, je = 0;
    function _e() {
      cancelAnimationFrame(je), je = requestAnimationFrame(Ee);
    }
    function ct(t) {
      t.preventDefault();
    }
    function ut() {
      G == null || G.dispose(), G = null, Me = !1, rt();
    }
    $e(() => {
      for (const t of e.columnDefs)
        t.hide && m.add(k(t)), t.sort && !g.value && (g.value = { colId: k(t), dir: t.sort });
      h.value = e.rowData ?? [], w.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", it), document.addEventListener("mousemove", J), document.addEventListener("mouseup", be), ye(() => {
        var t;
        rt(), U.value && (U.value.addEventListener("webglcontextlost", ct), U.value.addEventListener("webglcontextrestored", ut)), fe.value && (Ae = new ResizeObserver(() => Ee()), Ae.observe(fe.value), Be = new IntersectionObserver((l) => {
          l.some((r) => r.isIntersecting) && _e();
        }), Be.observe(fe.value)), window.addEventListener("resize", _e), (t = window.visualViewport) == null || t.addEventListener("resize", _e), a("grid-ready", { api: _t });
      });
    }), Xe(() => {
      var t, l, r;
      document.removeEventListener("click", it, !0), document.removeEventListener("mousemove", J), document.removeEventListener("mouseup", be), (t = U.value) == null || t.removeEventListener("webglcontextlost", ct), (l = U.value) == null || l.removeEventListener("webglcontextrestored", ut), Ae == null || Ae.disconnect(), Be == null || Be.disconnect(), window.removeEventListener("resize", _e), (r = window.visualViewport) == null || r.removeEventListener("resize", _e), cancelAnimationFrame(je), G == null || G.dispose();
    });
    const de = V(() => He[e.theme] ?? He.none), Ft = V(() => ({
      position: "absolute",
      left: `${T.value.x}px`,
      top: `${T.value.y}px`,
      zIndex: 100,
      background: de.value.headerBg,
      border: `1px solid ${de.value.accent}`,
      color: de.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Ht = V(() => ({
      background: de.value.bg,
      border: `1px solid ${de.value.border}`,
      color: de.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Wt = V(() => ({
      background: de.value.headerBg,
      borderTop: `1px solid ${de.value.border}`,
      color: de.value.text
    })), At = V(() => ({
      background: de.value.bg
    })), dt = V(() => de.value.accent);
    return (t, l) => {
      var r, u;
      return re(), ie("div", {
        ref_key: "wrapEl",
        ref: fe,
        class: "cathode-wrap",
        style: we(At.value)
      }, [
        N("canvas", {
          ref_key: "canvasEl",
          ref: U,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Le(Lt, ["prevent"]),
          onMousemove: It,
          onMouseleave: kt,
          onMousedown: Tt,
          onClick: Rt,
          onKeydown: zt
        }, null, 544),
        v.value ? (re(), ie("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: we(Ft.value),
          onClick: l[0] || (l[0] = Le(() => {
          }, ["stop"]))
        }, [
          N("input", {
            style: we(Ht.value),
            value: W.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Et,
            onKeydown: Bt(st, ["escape"])
          }, null, 44, Zt),
          W.value ? (re(), ie("button", {
            key: 0,
            style: we({
              background: "none",
              border: "none",
              color: de.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: st
          }, "✕", 4)) : ge("", !0)
        ], 4)) : ge("", !0),
        o.pagination ? (re(), ie("div", {
          key: 1,
          class: "cathode-pagination",
          style: we(Wt.value)
        }, [
          N("button", {
            disabled: C.value <= 0,
            onClick: l[1] || (l[1] = (d) => Re())
          }, "◀", 8, Jt),
          N("span", null, he((ne.value + 1).toLocaleString()) + "–" + he(Math.min(P.value.length, ke.value + 1).toLocaleString()) + " / " + he(P.value.length.toLocaleString()), 1),
          N("button", {
            disabled: C.value >= B.value,
            onClick: l[2] || (l[2] = (d) => b())
          }, "▶", 8, Qt),
          N("span", {
            class: "cathode-page-info",
            style: we({ color: dt.value })
          }, he(P.value.length.toLocaleString()) + " rows ", 5),
          i.value ? (re(), ie("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: we({ color: dt.value })
          }, he(((r = c.value[i.value.col]) == null ? void 0 : r.colDef.headerName) ?? ((u = c.value[i.value.col]) == null ? void 0 : u.colId)) + " : " + he(ve(c.value[i.value.col], P.value[i.value.row])), 5)) : ge("", !0)
        ], 4)) : ge("", !0)
      ], 4);
    };
  }
}), Ue = (o, n) => {
  const e = o.__vccOpts || o;
  for (const [a, h] of n)
    e[a] = h;
  return e;
}, Al = /* @__PURE__ */ Ue(ol, [["__scopeId", "data-v-07901c91"]]), Oe = {
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
function al(o, n) {
  switch (n) {
    case "warn":
      return o.levelWarn;
    case "error":
      return o.levelError;
    case "debug":
      return o.levelDebug;
    case "success":
      return o.levelSuccess;
    case "info":
    default:
      return o.levelInfo;
  }
}
const rl = 12, me = 18, Pe = 10, We = 6, nt = `${rl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function il(o, n, e) {
  if (e <= 0 || !n) return [n];
  const a = [];
  for (const h of n.split(`
`)) {
    if (!h) {
      a.push("");
      continue;
    }
    if (o.measureText(h).width <= e) {
      a.push(h);
      continue;
    }
    const w = h.split(/(\s+)/);
    let S = "";
    for (const g of w) {
      const y = S + g;
      if (o.measureText(y).width <= e)
        S = y;
      else if (S && (a.push(S.replace(/\s+$/, "")), S = ""), o.measureText(g).width > e) {
        let s = "";
        for (const m of g)
          o.measureText(s + m).width > e ? (s && a.push(s), s = m) : s += m;
        S = s;
      } else
        S = g.replace(/^\s+/, "");
    }
    S && a.push(S.replace(/\s+$/, ""));
  }
  return a.length ? a : [""];
}
function yt(o) {
  if (typeof o == "number") {
    const n = new Date(o), e = String(n.getHours()).padStart(2, "0"), a = String(n.getMinutes()).padStart(2, "0"), h = String(n.getSeconds()).padStart(2, "0");
    return `${e}:${a}:${h}`;
  }
  return o;
}
function sl(o, n) {
  return Math.ceil(o.measureText(n).width) + 12;
}
function cl(o) {
  const { entries: n, ctx: e, textMaxWidth: a, showTimestamps: h, wordWrap: w } = o, S = o.formatTs ?? yt;
  e.font = nt;
  const g = [];
  for (let y = 0; y < n.length; y++) {
    const s = n[y], m = s.level ?? "info", F = h && s.ts != null ? S(s.ts) : "", z = w ? il(e, s.text, a) : s.text.split(`
`);
    for (let H = 0; H < z.length; H++)
      g.push({
        entryIdx: y,
        text: z[H],
        level: m,
        timestamp: H === 0 ? F : "",
        isFirstFrag: H === 0
      });
  }
  return g;
}
function wt(o, n) {
  const e = o.getContext("2d");
  if (!e) return;
  const a = o.width, h = o.height, w = Oe[n.theme] ?? Oe.none;
  e.clearRect(0, 0, a, h), e.fillStyle = w.bg, e.fillRect(0, 0, a, h), e.save(), e.beginPath(), e.rect(0, 0, a, h), e.clip(), e.font = nt, e.textBaseline = "middle";
  const S = n.visualLines, g = Pe, y = n.showTimestamps ? Pe + n.timestampWidth : Pe, s = Math.max(0, Math.floor((n.scrollY - We) / me)), m = Math.min(S.length, Math.ceil((n.scrollY + h - We) / me) + 1);
  for (let F = s; F < m; F++) {
    const z = S[F], H = We + F * me - n.scrollY + me / 2;
    if (z.entryIdx % 2 === 1 && z.isFirstFrag) {
      e.fillStyle = w.rowAlt;
      let x = 1;
      for (; F + x < m && S[F + x].entryIdx === z.entryIdx; ) x++;
      e.fillRect(0, H - me / 2, a, me * x);
    }
    F === n.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, H - me / 2, a, me)), n.showTimestamps && z.timestamp && (e.fillStyle = w.timestamp, e.textAlign = "left", n.glow && (e.shadowBlur = 3, e.shadowColor = w.timestamp), e.fillText(z.timestamp, g, H), e.shadowBlur = 0);
    const C = al(w, z.level);
    e.fillStyle = C, e.textAlign = "left", n.glow && (e.shadowBlur = 4, e.shadowColor = C), e.fillText(z.text, y, H), e.shadowBlur = 0;
  }
  e.restore();
}
function ul(o, n, e) {
  if (o < 0) return -1;
  const a = Math.floor((o + n - We) / me);
  return a < 0 || a >= e ? -1 : a;
}
function dl(o) {
  return We * 2 + o * me;
}
const vl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, fl = `
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
`, ml = /* @__PURE__ */ Ne({
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
  setup(o, { expose: n }) {
    const e = o, a = E(null), h = E(null), w = E(0), S = E(0), g = E(0), y = E(-1), s = E(!0), m = V(() => {
      const p = e.entries ?? [];
      return e.maxLines > 0 && p.length > e.maxLines ? p.slice(p.length - e.maxLines) : p;
    }), F = V(() => {
      if (!e.showTimestamps) return "";
      const p = e.formatTs ?? yt;
      let D = "00:00:00";
      for (const J of m.value) {
        if (J.ts == null) continue;
        const be = p(J.ts);
        be.length > D.length && (D = be);
      }
      return D;
    }), z = E(0), H = E([]);
    function C() {
      if (!c) return;
      const p = c.getContext("2d");
      if (!p) return;
      p.font = nt;
      const D = e.showTimestamps ? sl(p, F.value) : 0;
      z.value = D;
      const J = Math.max(
        1,
        w.value - Pe * 2 - D
      );
      H.value = cl({
        entries: m.value,
        ctx: p,
        textMaxWidth: J,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const x = V(() => dl(H.value.length)), I = V(() => Math.max(0, x.value - S.value));
    K(I, () => {
      s.value ? g.value = I.value : g.value = Math.min(g.value, I.value);
    }), K(
      [m, w, () => e.showTimestamps, () => e.wordWrap, F],
      () => {
        C(), ye(B);
      },
      { deep: !1 }
    );
    let i = null, v = !1, T, W, k, M, c;
    function A() {
      if (!(!h.value || !a.value)) {
        c = document.createElement("canvas");
        try {
          i = new $.WebGLRenderer({ canvas: h.value, antialias: !1, alpha: !0 });
        } catch {
          v = !0;
        }
        if (!v && !i.getContext() && (i.dispose(), i = null, v = !0), v) {
          X();
          return;
        }
        i.setPixelRatio(1), i.setClearColor(0, 0), T = new $.Scene(), W = new $.OrthographicCamera(-1, 1, 1, -1, 0, 1), M = new $.CanvasTexture(c), M.minFilter = $.LinearFilter, M.magFilter = $.LinearFilter, k = new $.ShaderMaterial({
          uniforms: {
            uTex: { value: M },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: vl,
          fragmentShader: fl,
          transparent: !0
        }), T.add(new $.Mesh(new $.PlaneGeometry(2, 2), k)), X();
      }
    }
    function X() {
      if (!a.value || !i && !v) return;
      const p = a.value.clientWidth, D = a.value.clientHeight;
      if (!p || !D) return;
      const J = c.width !== p || c.height !== D;
      J && (c.width = p, c.height = D, w.value = p, S.value = D, C(), i ? (J && M && (M.dispose(), M = new $.CanvasTexture(c), M.minFilter = $.LinearFilter, M.magFilter = $.LinearFilter, k && (k.uniforms.uTex.value = M)), i.setPixelRatio(window.devicePixelRatio || 1), i.setSize(p, D)) : h.value && (h.value.width = p, h.value.height = D, h.value.style.width = p + "px", h.value.style.height = D + "px"), s.value && (g.value = Math.max(0, x.value - S.value)), B());
    }
    function B() {
      if (!(c != null && c.width)) return;
      if (v) {
        if (!h.value) return;
        wt(c, {
          visualLines: H.value,
          scrollY: g.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: z.value,
          hoveredLine: y.value
        });
        const D = h.value.getContext("2d");
        D && D.drawImage(c, 0, 0);
        return;
      }
      if (!i || !k || !M) return;
      const p = e.theme === "paper";
      k.uniforms.uStrength.value = e.curvature / 45 * 0.55, k.uniforms.uScanlines.value = e.scanlines && !p ? 1 : 0, k.uniforms.uVignette.value = p ? 0 : 1, wt(c, {
        visualLines: H.value,
        scrollY: g.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: z.value,
        hoveredLine: y.value
      }), M.needsUpdate = !0, i.render(T, W);
    }
    K(() => e.theme, () => B()), K(() => e.curvature, () => B()), K(() => e.scanlines, () => B()), K(() => e.glow, () => B()), K(g, () => B()), K(y, () => B());
    function le(p) {
      if (!h.value) return [-1, -1];
      const D = h.value.getBoundingClientRect();
      return [p.clientX - D.left, p.clientY - D.top];
    }
    function ne(p) {
      g.value = Math.max(0, Math.min(I.value, p)), s.value = g.value >= I.value - 4;
    }
    function ke(p) {
      ne(g.value + p.deltaY);
    }
    let j = !1, ve = 0, Se = 0;
    function P(p) {
      j = !0, ve = p.clientY, Se = g.value;
    }
    function Te(p) {
      if (j) {
        const D = ve - p.clientY;
        ne(Se + D);
      }
    }
    function Re() {
      j && (j = !1);
    }
    function b(p) {
      const [, D] = le(p);
      if (D < 0) {
        y.value = -1;
        return;
      }
      y.value = ul(D, g.value, H.value.length);
    }
    function R() {
      y.value = -1;
    }
    n({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        s.value = !0, g.value = I.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(p) {
        ne(We + p * me);
      }
    });
    let O = null, Z = null, se = 0;
    const ce = lt("cathodeResetTick", E(0));
    K(ce, () => Y());
    function Y() {
      cancelAnimationFrame(se), se = requestAnimationFrame(X);
    }
    function xe(p) {
      p.preventDefault();
    }
    function Ce() {
      i == null || i.dispose(), i = null, v = !1, A();
    }
    $e(() => {
      document.addEventListener("mousemove", Te), document.addEventListener("mouseup", Re), ye(() => {
        var p;
        A(), h.value && (h.value.addEventListener("webglcontextlost", xe), h.value.addEventListener("webglcontextrestored", Ce)), a.value && (O = new ResizeObserver(() => X()), O.observe(a.value), Z = new IntersectionObserver((D) => {
          D.some((J) => J.isIntersecting) && Y();
        }), Z.observe(a.value)), window.addEventListener("resize", Y), (p = window.visualViewport) == null || p.addEventListener("resize", Y), g.value = I.value;
      });
    }), Xe(() => {
      var p, D, J;
      document.removeEventListener("mousemove", Te), document.removeEventListener("mouseup", Re), (p = h.value) == null || p.removeEventListener("webglcontextlost", xe), (D = h.value) == null || D.removeEventListener("webglcontextrestored", Ce), O == null || O.disconnect(), Z == null || Z.disconnect(), window.removeEventListener("resize", Y), (J = window.visualViewport) == null || J.removeEventListener("resize", Y), cancelAnimationFrame(se), i == null || i.dispose();
    });
    const De = V(() => Oe[e.theme] ?? Oe.none), ze = V(() => ({
      background: De.value.bg
    }));
    return (p, D) => (re(), ie("div", {
      ref_key: "wrapEl",
      ref: a,
      class: "cathode-log-wrap",
      style: we(ze.value)
    }, [
      N("canvas", {
        ref_key: "canvasEl",
        ref: h,
        class: "cathode-log-canvas",
        onWheel: Le(ke, ["prevent"]),
        onMousemove: b,
        onMouseleave: R,
        onMousedown: P
      }, null, 544)
    ], 4));
  }
}), Bl = /* @__PURE__ */ Ue(ml, [["__scopeId", "data-v-d2d092f3"]]), ot = E(0), et = 28, Fe = 12;
let tt = 10, Ye = "cathode.layout", Ve = !1;
const te = E({});
function hl(o, n = "cathode.layout") {
  if (!Ve) {
    Ve = !0, Ye = n;
    try {
      const e = localStorage.getItem(Ye);
      if (e) {
        te.value = JSON.parse(e), xt();
        return;
      }
    } catch {
    }
    te.value = { ...o }, xt();
  }
}
function xt() {
  let o = 10;
  for (const n of Object.values(te.value))
    typeof (n == null ? void 0 : n.zIndex) == "number" && n.zIndex > o && (o = n.zIndex);
  tt = o;
}
function Ie() {
  localStorage.setItem(Ye, JSON.stringify(te.value));
}
function gl(o) {
  Ve = !1, localStorage.removeItem(Ye), te.value = { ...o }, Ie(), Ve = !0, ot.value++;
}
function St(o) {
  tt++, te.value[o] && (te.value[o].zIndex = tt);
}
function pl(o, n) {
  te.value[o].visible = n, Ie();
}
function wl(o, n) {
  te.value[o].minimized = n, n && (te.value[o].maximized = !1), Ie();
}
function xl(o, n) {
  te.value[o].maximized = n, n && (te.value[o].minimized = !1, St(o)), Ie();
}
function bl(o, n, e) {
  te.value[o].x = Math.round(n), te.value[o].y = Math.round(e), Ie();
}
function yl(o, n, e) {
  te.value[o].w = Math.round(n), te.value[o].h = Math.round(e), Ie();
}
function $l(o, n, e) {
  const a = Math.ceil(Math.sqrt(e.length)), h = Math.ceil(e.length / a), w = Math.floor((o - Fe * (a + 1)) / a), S = Math.floor((n - Fe * (h + 1)) / h), g = {};
  return e.forEach((y, s) => {
    const m = s % a, F = Math.floor(s / a);
    g[y] = {
      x: Fe + m * (w + Fe),
      y: Fe + F * (S + Fe),
      w,
      h: S,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: s + 1
    };
  }), g;
}
function Ct() {
  return {
    containers: te,
    TITLEBAR_H: et,
    load: hl,
    save: Ie,
    reset: gl,
    bringToFront: St,
    setVisible: pl,
    setMinimized: wl,
    setMaximized: xl,
    updatePos: bl,
    updateSize: yl
  };
}
const Sl = { class: "ws-toolbar" }, Cl = {
  key: 0,
  class: "ws-restore-menu"
}, Ml = {
  key: 0,
  class: "ws-restore-empty"
}, Ll = ["onClick"], Il = /* @__PURE__ */ Ne({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(o) {
    const n = o, { containers: e, load: a, reset: h, setVisible: w } = Ct(), S = E(null);
    ft("cathodeWorkspace", S), ft("cathodeResetTick", ot), $e(() => {
      if (!S.value) return;
      const { clientWidth: I, clientHeight: i } = S.value, v = n.initialLayout ?? {};
      a(v, n.storageKey ?? "cathode.layout");
      const T = Object.keys(e.value)[0];
      T && g(T);
    });
    function g(I) {
      var v;
      document.querySelectorAll(".cc").forEach((T) => T.classList.remove("cc-focused"));
      const i = (v = S.value) == null ? void 0 : v.querySelector(`#cc-${I}`);
      i && i.classList.add("cc-focused");
    }
    function y() {
      !S.value || !n.initialLayout || h(n.initialLayout);
    }
    function s(I) {
      const i = I.target.closest(".cc");
      i && (document.querySelectorAll(".cc").forEach((v) => v.classList.remove("cc-focused")), i.classList.add("cc-focused"));
    }
    const m = E(!1), F = () => Object.entries(e.value).filter(([, I]) => !I.visible).map(([I]) => I);
    function z(I) {
      w(I, !0), m.value = !1;
    }
    function H(I) {
      if (!m.value) return;
      const i = I.target;
      !i.closest(".ws-restore-menu") && !i.closest(".ws-btn-restore") && (m.value = !1);
    }
    function C(I) {
      I.key === "Escape" && (m.value = !1);
    }
    $e(() => {
      document.addEventListener("click", H), document.addEventListener("keydown", C);
    }), Xe(() => {
      document.removeEventListener("click", H), document.removeEventListener("keydown", C);
    });
    function x(I) {
      var i;
      return ((i = n.containerTitles) == null ? void 0 : i[I]) ?? I;
    }
    return (I, i) => (re(), ie("div", {
      ref_key: "workspaceEl",
      ref: S,
      class: "cathode-workspace",
      onMousedown: s
    }, [
      Qe(I.$slots, "default", {}, void 0, !0),
      Qe(I.$slots, "overlay", {}, void 0, !0),
      N("div", Sl, [
        o.initialLayout ? (re(), ie("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: y
        }, " ↺ Reset Layout ")) : ge("", !0),
        i[1] || (i[1] = N("div", { class: "ws-sep" }, null, -1)),
        N("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: i[0] || (i[0] = (v) => m.value = !m.value)
        }, " ⊞ Restore Panel ")
      ]),
      $t(Pt, { name: "menu" }, {
        default: Ot(() => [
          m.value ? (re(), ie("div", Cl, [
            i[3] || (i[3] = N("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            F().length ? ge("", !0) : (re(), ie("div", Ml, " No closed panels ")),
            (re(!0), ie(Yt, null, Vt(F(), (v) => (re(), ie("div", {
              key: v,
              class: "ws-restore-item",
              onClick: (T) => z(v)
            }, [
              i[2] || (i[2] = N("span", { class: "ws-restore-icon" }, "⊞", -1)),
              Nt(" " + he(x(v)), 1)
            ], 8, Ll))), 128))
          ])) : ge("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), Pl = /* @__PURE__ */ Ue(Il, [["__scopeId", "data-v-5838d04b"]]), kl = ["id"], Tl = { class: "cc-title" }, Rl = {
  key: 0,
  class: "cc-size-badge"
}, Dl = { class: "cc-controls" }, zl = ["title"], El = { class: "cc-body" }, _l = 200, Fl = 80, bt = 60, Hl = /* @__PURE__ */ Ne({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(o) {
    const n = o, { containers: e, bringToFront: a, setVisible: h, setMinimized: w, setMaximized: S, updatePos: g, updateSize: y } = Ct(), s = lt("cathodeWorkspace", E(null)), m = V(() => e.value[n.id]), F = V(() => {
      const b = m.value, R = n.curvature ?? 0;
      if (!b) return {};
      const O = { "--curvature": R };
      return b.maximized ? { ...O, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: b.zIndex } : {
        ...O,
        left: b.x + "px",
        top: b.y + "px",
        width: b.w + "px",
        height: b.minimized ? et + "px" : b.h + "px",
        zIndex: b.zIndex,
        display: b.visible ? "flex" : "none"
      };
    });
    let z = !1, H = 0, C = 0;
    function x(b) {
      var Z;
      if (b.target.closest(".cc-btn") || m.value.maximized) return;
      a(n.id), z = !0;
      const R = (Z = s.value) == null ? void 0 : Z.querySelector(`#cc-${n.id}`);
      if (!R) return;
      const O = R.getBoundingClientRect();
      H = b.clientX - O.left, C = b.clientY - O.top, document.addEventListener("mousemove", I), document.addEventListener("mouseup", i), b.preventDefault();
    }
    function I(b) {
      var ce;
      if (!z || !s.value) return;
      const R = s.value.getBoundingClientRect(), O = ((ce = m.value) == null ? void 0 : ce.w) ?? 300;
      let Z = b.clientX - R.left - H, se = b.clientY - R.top - C;
      Z = Math.max(bt - O, Math.min(R.width - bt, Z)), se = Math.max(0, Math.min(R.height - et, se)), g(n.id, Z, se);
    }
    function i() {
      z = !1, document.removeEventListener("mousemove", I), document.removeEventListener("mouseup", i);
    }
    let v = !1, T = 0, W = 0, k = 0, M = 0;
    const c = E("");
    function A(b) {
      m.value.maximized || (a(n.id), v = !0, T = b.clientX, W = b.clientY, k = m.value.w, M = m.value.h, document.addEventListener("mousemove", X), document.addEventListener("mouseup", B), b.preventDefault(), b.stopPropagation());
    }
    function X(b) {
      if (!v) return;
      const R = Math.max(_l, k + (b.clientX - T)), O = Math.max(Fl, M + (b.clientY - W));
      y(n.id, R, O), c.value = `${Math.round(R)}×${Math.round(O)}`;
    }
    function B() {
      v = !1, c.value = "", document.removeEventListener("mousemove", X), document.removeEventListener("mouseup", B), le.value++;
    }
    const le = E(0);
    K(ot, () => {
      le.value++;
    }), Xe(() => {
      var b;
      document.removeEventListener("mousemove", I), document.removeEventListener("mouseup", i), document.removeEventListener("mousemove", X), document.removeEventListener("mouseup", B), (b = ne.value) == null || b.removeEventListener("scroll", j), ve();
    });
    const ne = E(null);
    function ke(b) {
      if (n.canvas) return [];
      const R = b.children[0];
      return R ? Array.from(R.children) : [];
    }
    function j() {
      const b = ne.value, R = n.curvature ?? 0;
      if (!b) return;
      const O = ke(b);
      if (!O.length) return;
      const Z = b.clientHeight, se = Z / 2, ce = R * 38e-4;
      O.forEach((Y) => {
        if (!Y.dataset.origFs) {
          const fe = getComputedStyle(Y);
          Y.dataset.origFs = fe.fontSize, Y.dataset.origLh = fe.lineHeight;
        }
        if (R === 0) {
          Y.style.fontSize = "", Y.style.lineHeight = "";
          return;
        }
        const xe = Y.getBoundingClientRect(), Ce = b.getBoundingClientRect(), De = xe.top - Ce.top + xe.height / 2, ze = Math.min(1, Math.abs(De - se) / (Z / 2)), p = 1 + ce * Math.cos(ze * Math.PI / 2), D = parseFloat(Y.dataset.origFs), J = Y.dataset.origLh, be = J === "normal" ? D * 1.4 : parseFloat(J);
        isNaN(D) || (Y.style.fontSize = `${(D * p).toFixed(2)}px`), isNaN(be) || (Y.style.lineHeight = `${(be * p).toFixed(2)}px`);
      });
    }
    function ve() {
      const b = ne.value;
      b && ke(b).forEach((R) => {
        R.style.fontSize = "", R.style.lineHeight = "", delete R.dataset.origFs, delete R.dataset.origLh;
      });
    }
    K(() => n.curvature, (b) => {
      (b ?? 0) === 0 ? ve() : j();
    }), $e(() => {
      var b;
      (b = ne.value) == null || b.addEventListener("scroll", j, { passive: !0 }), ye(j);
    });
    function Se() {
      w(n.id, !m.value.minimized), ye(() => {
        le.value++;
      });
    }
    function P() {
      S(n.id, !m.value.maximized), ye(() => {
        le.value++;
      });
    }
    function Te() {
      h(n.id, !1);
    }
    function Re() {
      a(n.id);
    }
    return (b, R) => m.value && m.value.visible ? (re(), ie("div", {
      key: 0,
      id: `cc-${o.id}`,
      class: Xt(["cc", { "cc-minimized": m.value.minimized, "cc-maximized": m.value.maximized, "cc-has-canvas": o.canvas }]),
      style: we(F.value),
      onMousedown: Re
    }, [
      N("div", {
        class: "cc-titlebar",
        onMousedown: x
      }, [
        R[0] || (R[0] = N("span", { class: "cc-status-dot" }, null, -1)),
        N("span", Tl, he(o.title), 1),
        c.value ? (re(), ie("span", Rl, he(c.value), 1)) : ge("", !0),
        N("div", Dl, [
          N("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Le(Se, ["stop"])
          }, "─"),
          N("button", {
            class: "cc-btn cc-btn-max",
            title: m.value.maximized ? "Restore" : "Maximize",
            onClick: Le(P, ["stop"])
          }, he(m.value.maximized ? "⤡" : "⤢"), 9, zl),
          N("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Le(Te, ["stop"])
          }, "✕")
        ])
      ], 32),
      Ut(N("div", El, [
        N("div", {
          ref_key: "bodyEl",
          ref: ne,
          class: "cc-screen",
          onScroll: j
        }, [
          Qe(b.$slots, "default", { resizeKey: le.value }, void 0, !0),
          R[1] || (R[1] = N("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Kt, !m.value.minimized]
      ]),
      !m.value.minimized && !m.value.maximized ? (re(), ie("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Le(A, ["stop"])
      }, null, 32)) : ge("", !0)
    ], 46, kl)) : ge("", !0);
  }
}), Ol = /* @__PURE__ */ Ue(Hl, [["__scopeId", "data-v-d8a49f79"]]);
export {
  Ol as CathodeContainer,
  Al as CathodeGrid,
  Bl as CathodeLog,
  Pl as CathodeWorkspace,
  Oe as LOG_THEME_COLORS,
  $l as buildDefaultLayout,
  Ct as useCathodeLayout
};
