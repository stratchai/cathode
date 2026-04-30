import { defineComponent as Ye, ref as z, reactive as tt, computed as V, watch as $, inject as je, nextTick as xe, onMounted as He, onUnmounted as Ve, openBlock as oe, createElementBlock as ae, normalizeStyle as he, createElementVNode as G, withModifiers as Le, withKeys as Nt, createCommentVNode as we, toDisplayString as ge, provide as wt, renderSlot as ot, createVNode as Xt, Transition as Ut, withCtx as Gt, Fragment as Kt, renderList as qt, createTextVNode as jt, normalizeClass as Zt, withDirectives as Jt, vShow as Qt } from "vue";
import * as W from "three";
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
}, le = 30, pt = 12, el = 10;
function xt(a, t) {
  const e = a.getContext("2d");
  if (!e) return;
  const o = a.width, s = a.height, v = Be[t.theme] ?? Be.none, { cols: g, rows: r, pinnedRows: u, rowHeight: c, scrollY: h, scrollX: D, glow: y } = t;
  e.clearRect(0, 0, o, s), e.fillStyle = v.bg, e.fillRect(0, 0, o, s), e.save(), e.beginPath(), e.rect(0, 0, o, s), e.clip();
  const k = u.length * c, S = s - le - k;
  e.fillStyle = v.headerBg, e.fillRect(0, 0, o, le), e.textBaseline = "middle", e.textAlign = "left";
  let w = -D;
  for (let f = 0; f < g.length; f++) {
    const _ = g[f];
    if (w + _.width <= 0) {
      w += _.width;
      continue;
    }
    if (w >= o) break;
    const H = !!t.colFilters[_.colId], L = t.sortColId === _.colId, I = (_.colDef.headerName ?? _.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(w, 0, _.width, le), e.clip(), e.font = `bold ${el}px system-ui, -apple-system, sans-serif`, e.fillStyle = H ? v.accent : v.textHeader, y && (e.shadowBlur = 6, e.shadowColor = v.textHeader), e.fillText(I, w + 8, le / 2), e.shadowBlur = 0, L) {
      const m = e.measureText(I).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = v.accent, e.fillText(t.sortDir === "asc" ? "▲" : "▼", w + 8 + m + 4, le / 2);
    }
    _.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = H ? v.accent : v.textHeader, e.globalAlpha = H ? 1 : 0.38, e.fillText("⌕", w + _.width - 20, le / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = v.border, e.lineWidth = 1, e.beginPath(), e.moveTo(w + _.width - 0.5, 0), e.lineTo(w + _.width - 0.5, le), e.stroke(), w += _.width;
  }
  e.strokeStyle = v.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, le - 0.5), e.lineTo(o, le - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, le, o, S), e.clip();
  const M = Math.max(0, Math.floor(h / c)), d = Math.min(r.length, Math.ceil((h + S) / c));
  for (let f = M; f < d; f++) {
    const _ = r[f], H = le + f * c - h;
    f % 2 === 1 && (e.fillStyle = v.rowAlt, e.fillRect(0, H, o, c)), f === t.hoveredRow && f !== t.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, H, o, c)), f === t.selectedRow && (e.fillStyle = tl(v.accent, 0.1), e.fillRect(0, H, o, c)), e.strokeStyle = v.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, H + c - 0.5), e.lineTo(o, H + c - 0.5), e.stroke();
    let L = -D;
    for (let I = 0; I < g.length; I++) {
      const m = g[I];
      if (L + m.width <= 0) {
        L += m.width;
        continue;
      }
      if (L >= o) break;
      const Y = t.getCellStyle(m, _), O = Y.color ?? v.text, R = Y.textAlign ?? "left", A = t.formatCell(m, _);
      e.save(), e.beginPath(), e.rect(L + 1, H, m.width - 2, c), e.clip(), e.font = `${pt}px system-ui, -apple-system, sans-serif`, e.fillStyle = O, e.textBaseline = "middle", y && (e.shadowBlur = 4, e.shadowColor = O), R === "right" ? (e.textAlign = "right", e.fillText(A, L + m.width - 8, H + c / 2)) : (e.textAlign = "left", e.fillText(A, L + 8, H + c / 2)), e.shadowBlur = 0, e.restore(), f === t.selectedRow && I === t.selectedCol && (e.strokeStyle = v.accent, e.lineWidth = 2, e.strokeRect(L + 1.5, H + 1.5, m.width - 3, c - 3)), e.strokeStyle = v.border, e.lineWidth = 1, e.beginPath(), e.moveTo(L + m.width - 0.5, H), e.lineTo(L + m.width - 0.5, H + c), e.stroke(), L += m.width;
    }
  }
  if (e.restore(), u.length > 0) {
    const f = s - k;
    e.strokeStyle = v.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, f - 0.5), e.lineTo(o, f - 0.5), e.stroke();
    for (let _ = 0; _ < u.length; _++) {
      const H = u[_], L = f + _ * c;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, L, o, c);
      let I = -D;
      for (let m = 0; m < g.length; m++) {
        const Y = g[m];
        if (I + Y.width <= 0) {
          I += Y.width;
          continue;
        }
        if (I >= o) break;
        const O = t.getCellStyle(Y, H), R = O.color ?? v.text, A = O.textAlign ?? "left", K = t.formatCell(Y, H);
        e.save(), e.beginPath(), e.rect(I + 1, L, Y.width - 2, c), e.clip(), e.font = `bold ${pt}px system-ui, -apple-system, sans-serif`, e.fillStyle = R, e.textBaseline = "middle", A === "right" ? (e.textAlign = "right", e.fillText(K, I + Y.width - 8, L + c / 2)) : (e.textAlign = "left", e.fillText(K, I + 8, L + c / 2)), e.restore(), e.strokeStyle = v.border, e.lineWidth = 1, e.beginPath(), e.moveTo(I + Y.width - 0.5, L), e.lineTo(I + Y.width - 0.5, L + c), e.stroke(), I += Y.width;
      }
      e.strokeStyle = v.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, L + c - 0.5), e.lineTo(o, L + c - 0.5), e.stroke();
    }
  }
  e.restore();
}
function tl(a, t) {
  if (a.startsWith("rgba") || a.startsWith("rgb"))
    return a.replace(/[\d.]+\)$/, `${t})`);
  const e = parseInt(a.slice(1, 3), 16), o = parseInt(a.slice(3, 5), 16), s = parseInt(a.slice(5, 7), 16);
  return `rgba(${e},${o},${s},${t})`;
}
function lt(a, t) {
  let e = 0;
  for (let o = 0; o < a; o++) e += t[o].width;
  return e;
}
function ll(a, t, e) {
  return a >= t + e - 24 && a < t + e;
}
function bt(a, t, e) {
  const o = t + e;
  return a >= o - 6 && a <= o + 1;
}
function yt(a, t, e, o, s, v, g, r, u) {
  const c = a + u;
  let h = -1, D = 0;
  for (let w = 0; w < e.length; w++) {
    if (c >= D && c < D + e[w].width) {
      h = w;
      break;
    }
    D += e[w].width;
  }
  if (t < le) return { area: "header", colIdx: h, rowIdx: -1 };
  const y = r * s;
  if (y > 0 && t >= g - y) {
    const w = Math.floor((t - (g - y)) / s);
    return { area: "pinned", colIdx: h, rowIdx: w };
  }
  const k = t - le + v, S = Math.floor(k / s);
  return S >= 0 && S < o ? { area: "body", colIdx: h, rowIdx: S } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const nl = ["value"], ol = ["disabled"], al = ["disabled"], rl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, il = `
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
`, sl = 28, cl = 600, ul = /* @__PURE__ */ Ye({
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
  setup(a, { emit: t }) {
    const e = a, o = t, s = z(e.rowData ?? []), v = z(e.pinnedBottomRowData ?? []), g = z(""), r = z(null), u = tt({}), c = tt({}), h = tt(/* @__PURE__ */ new Set()), D = z(0), y = z(0), k = z(0), S = z(0), w = z(0), M = z(-1), d = z(null), f = z(null), _ = z({ x: 0, y: le }), H = z("");
    function L(l) {
      return l.colId ?? l.field ?? (l.headerName ? l.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const I = V(() => {
      const l = e.defaultColDef ?? {};
      return e.columnDefs.filter((n) => !h.has(L(n))).map((n) => {
        const i = L(n), p = { ...l, ...n };
        return { colId: i, colDef: p, width: c[i] ?? p.width ?? 100 };
      });
    }), m = V(() => {
      const l = y.value;
      if (!l) return I.value;
      const n = I.value.reduce((x, b) => x + b.width, 0);
      if (!n || n >= l) return I.value;
      const i = l / n;
      let p = 0;
      return I.value.map((x, b) => {
        const P = b === I.value.length - 1 ? l - p : Math.max(8, Math.round(x.width * i));
        return p += P, { ...x, width: P };
      });
    }), Y = V(() => {
      const l = m.value.reduce((n, i) => n + i.width, 0);
      return Math.max(0, l - y.value);
    }), O = V(() => {
      const l = v.value.length * e.rowHeight;
      return Math.max(0, k.value - le - l);
    }), R = V(
      () => Math.max(0, N.value.length * e.rowHeight - O.value)
    ), A = V(
      () => Math.max(1, Math.floor(O.value / e.rowHeight))
    ), K = V(
      () => N.value.length === 0 ? 0 : Math.min(N.value.length - 1, Math.floor(S.value / e.rowHeight))
    ), Te = V(
      () => Math.min(N.value.length - 1, K.value + A.value - 1)
    );
    function J(l, n) {
      if (n.colDef.valueGetter) return n.colDef.valueGetter({ data: l, colDef: n.colDef });
      if (n.colDef.field) return l[n.colDef.field];
    }
    function ve(l, n) {
      const i = J(n, l);
      return l.colDef.valueFormatter ? l.colDef.valueFormatter({ value: i, data: n, colDef: l.colDef }) ?? "" : l.colDef.cellRenderer ? (l.colDef.cellRenderer({ value: i, data: n, colDef: l.colDef }) ?? "").replace(/<[^>]+>/g, "") : i == null ? "" : String(i);
    }
    function Me(l, n) {
      return l.colDef.cellStyle ? typeof l.colDef.cellStyle == "function" ? l.colDef.cellStyle({ value: J(n, l), data: n, colDef: l.colDef }) ?? {} : l.colDef.cellStyle : {};
    }
    const N = V(() => {
      D.value;
      let l = s.value;
      const n = g.value.trim().toLowerCase();
      n && (l = l.filter(
        (i) => I.value.some(
          (p) => String(J(i, p) ?? "").toLowerCase().includes(n)
        )
      ));
      for (const [i, p] of Object.entries(u)) {
        if (!p) continue;
        const x = I.value.find((b) => b.colId === i);
        if (x)
          if (p.startsWith("__eq__")) {
            const b = p.slice(6).toLowerCase();
            l = l.filter((E) => String(J(E, x) ?? "").toLowerCase() === b);
          } else {
            const b = p.toLowerCase();
            l = l.filter((E) => String(J(E, x) ?? "").toLowerCase().includes(b));
          }
      }
      if (r.value) {
        const { colId: i, dir: p } = r.value, x = I.value.find((b) => b.colId === i);
        x && (l = [...l].sort((b, E) => {
          const P = J(b, x), Z = J(E, x);
          let te = 0;
          return x.colDef.comparator ? te = x.colDef.comparator(P, Z) : typeof P == "number" && typeof Z == "number" ? te = P - Z : te = String(P ?? "").localeCompare(String(Z ?? ""), void 0, { numeric: !0 }), p === "asc" ? te : -te;
        }));
      }
      return l;
    });
    $(N, () => {
      S.value = 0, d.value = null;
    }), $(Y, () => {
      w.value = Math.min(w.value, Y.value);
    }), $(R, () => {
      S.value = Math.min(S.value, R.value);
    });
    function ke(l) {
      const n = l * e.rowHeight, i = n + e.rowHeight;
      n < S.value ? S.value = n : i > S.value + O.value && (S.value = Math.min(R.value, i - O.value));
    }
    function Re() {
      S.value = Math.max(0, S.value - O.value), ie();
    }
    function T() {
      S.value = Math.min(R.value, S.value + O.value), ie();
    }
    let F = !1, X = "", Q = 0, se = 0, ce = !1, U = !1, be = 0, Ce = 0, Ee = 0, De = 0, C = !1;
    function B(l, n) {
      var i;
      F = !0, X = l, Q = n, se = ((i = m.value.find((p) => p.colId === l)) == null ? void 0 : i.width) ?? 100, ce = !1;
    }
    function ee(l) {
      if (U) {
        const b = be - l.clientX, E = Ce - l.clientY;
        (Math.abs(b) > 4 || Math.abs(E) > 4) && (C = !0), w.value = Math.max(0, Math.min(Y.value, Ee + b)), S.value = Math.max(0, Math.min(R.value, De + E)), ie();
        return;
      }
      if (!F) return;
      const n = y.value, i = Math.max(30, se + (l.clientX - Q)), p = I.value.filter((b) => b.colId !== X).reduce((b, E) => b + E.width, 0), x = n - i;
      x > 10 && (c[X] = Math.max(10, Math.round(i * p / x))), ie();
    }
    function ye() {
      U && (C && (ce = !0), U = !1), F && (F = !1, ce = !0, o("column-resized"));
    }
    const fe = z(null), q = z(null), Et = je("cathodeResetTick", z(0));
    $(Et, () => ze());
    let j = null, Se = !1, Ze, ct, pe, ue, re;
    function ut() {
      if (!(!q.value || !fe.value)) {
        re = document.createElement("canvas");
        try {
          j = new W.WebGLRenderer({ canvas: q.value, antialias: !1, alpha: !0 });
        } catch {
          Se = !0;
        }
        if (!Se && !j.getContext() && (j.dispose(), j = null, Se = !0), Se) {
          _e();
          return;
        }
        j.setPixelRatio(1), j.setClearColor(0, 0), Ze = new W.Scene(), ct = new W.OrthographicCamera(-1, 1, 1, -1, 0, 1), ue = new W.CanvasTexture(re), ue.minFilter = W.LinearFilter, ue.magFilter = W.LinearFilter, pe = new W.ShaderMaterial({
          uniforms: {
            uTex: { value: ue },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new W.Color(0) }
          },
          vertexShader: rl,
          fragmentShader: il,
          transparent: !0
        }), Ze.add(new W.Mesh(new W.PlaneGeometry(2, 2), pe)), _e();
      }
    }
    function _e() {
      if (!fe.value || !j && !Se) return;
      const l = fe.value.clientWidth, n = fe.value.clientHeight - (e.pagination ? sl : 0);
      if (!l || !n) return;
      const i = re.width !== l || re.height !== n;
      re.width = l, re.height = n, y.value = l, k.value = n, w.value = Math.max(0, Math.min(Y.value, w.value)), S.value = Math.max(0, Math.min(R.value, S.value)), j ? (i && ue && (ue.dispose(), ue = new W.CanvasTexture(re), ue.minFilter = W.LinearFilter, ue.magFilter = W.LinearFilter, pe && (pe.uniforms.uTex.value = ue)), j.setPixelRatio(window.devicePixelRatio || 1), j.setSize(l, n)) : q.value && (q.value.width = l, q.value.height = n, q.value.style.width = l + "px", q.value.style.height = n + "px"), ie();
    }
    function ie() {
      var i, p, x, b, E, P, Z, te;
      if (!(re != null && re.width)) return;
      if (Se) {
        if (!q.value) return;
        xt(re, {
          cols: m.value,
          rows: N.value,
          pinnedRows: v.value,
          rowHeight: e.rowHeight,
          scrollY: S.value,
          scrollX: w.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((i = r.value) == null ? void 0 : i.colId) ?? null,
          sortDir: ((p = r.value) == null ? void 0 : p.dir) ?? null,
          colFilters: u,
          hoveredRow: M.value,
          selectedRow: ((x = d.value) == null ? void 0 : x.row) ?? -1,
          selectedCol: ((b = d.value) == null ? void 0 : b.col) ?? -1,
          formatCell: ve,
          getCellStyle: Me
        });
        const gt = q.value.getContext("2d");
        gt && gt.drawImage(re, 0, 0);
        return;
      }
      if (!j || !pe || !ue) return;
      const l = Be[e.theme] ?? Be.none, n = e.theme === "paper";
      pe.uniforms.uStrength.value = e.curvature / 45 * 0.55, pe.uniforms.uScanlines.value = e.scanlines && !n ? 1 : 0, pe.uniforms.uVignette.value = n ? 0 : 1, pe.uniforms.uBezel.value.set(l.bg), xt(re, {
        cols: m.value,
        rows: N.value,
        pinnedRows: v.value,
        rowHeight: e.rowHeight,
        scrollY: S.value,
        scrollX: w.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((E = r.value) == null ? void 0 : E.colId) ?? null,
        sortDir: ((P = r.value) == null ? void 0 : P.dir) ?? null,
        colFilters: u,
        hoveredRow: M.value,
        selectedRow: ((Z = d.value) == null ? void 0 : Z.row) ?? -1,
        selectedCol: ((te = d.value) == null ? void 0 : te.col) ?? -1,
        formatCell: ve,
        getCellStyle: Me
      }), ue.needsUpdate = !0, j.render(Ze, ct);
    }
    function Je(l) {
      if (!q.value) return [-1, -1];
      const n = q.value.getBoundingClientRect();
      return [l.clientX - n.left, l.clientY - n.top];
    }
    let Qe = 0;
    function Dt(l) {
      f.value = null;
      const n = Date.now();
      if (l.deltaX !== 0) {
        Qe = n, w.value = Math.max(0, Math.min(Y.value, w.value + l.deltaX)), ie();
        return;
      }
      if (l.shiftKey && l.deltaY !== 0) {
        Qe = n, w.value = Math.max(0, Math.min(Y.value, w.value + l.deltaY)), ie();
        return;
      }
      n - Qe < cl || (S.value = Math.max(0, Math.min(R.value, S.value + l.deltaY)), ie());
    }
    function _t(l) {
      if (F) return;
      const [n, i] = Je(l);
      if (n < 0) {
        M.value = -1, ie();
        return;
      }
      const p = yt(
        n,
        i,
        m.value,
        N.value.length,
        e.rowHeight,
        S.value,
        re.height,
        v.value.length,
        w.value
      );
      if (M.value = p.area === "body" ? p.rowIdx : -1, p.area === "header" && p.colIdx >= 0) {
        const x = m.value[p.colIdx], b = lt(p.colIdx, m.value), E = n + w.value;
        q.value.style.cursor = x && bt(E, b, x.width) ? "col-resize" : "pointer";
      } else p.area === "body" ? q.value.style.cursor = "pointer" : q.value.style.cursor = "default";
      ie();
    }
    function zt() {
      M.value = -1, ie();
    }
    function Ft(l) {
      const [n, i] = Je(l);
      if (n < 0) return;
      if (i >= le) {
        U = !0, C = !1, be = l.clientX, Ce = l.clientY, Ee = w.value, De = S.value;
        return;
      }
      const p = n + w.value;
      for (let x = 0; x < m.value.length; x++) {
        const b = m.value[x], E = lt(x, m.value);
        if (b.colDef.resizable !== !1 && bt(p, E, b.width)) {
          B(b.colId, l.clientX);
          return;
        }
      }
    }
    function Bt(l) {
      var x, b, E;
      if (ce) {
        ce = !1;
        return;
      }
      if (F) return;
      const [n, i] = Je(l);
      if (n < 0) {
        f.value = null;
        return;
      }
      const p = yt(
        n,
        i,
        m.value,
        N.value.length,
        e.rowHeight,
        S.value,
        re.height,
        v.value.length,
        w.value
      );
      if (p.area === "header" && p.colIdx >= 0) {
        const P = m.value[p.colIdx], Z = lt(p.colIdx, m.value), te = n + w.value;
        P.colDef.filter && ll(te, Z, P.width) ? (l.stopPropagation(), f.value === P.colId ? f.value = null : (f.value = P.colId, H.value = (x = u[P.colId]) != null && x.startsWith("__eq__") ? u[P.colId].slice(6) : u[P.colId] ?? "", _.value = { x: Math.max(0, Z - w.value), y: le })) : P.colDef.sortable !== !1 && (f.value = null, r.value = ((b = r.value) == null ? void 0 : b.colId) === P.colId ? r.value.dir === "asc" ? { colId: P.colId, dir: "desc" } : null : { colId: P.colId, dir: "asc" }, o("sort-changed"));
        return;
      }
      if (f.value = null, p.area === "body" && p.rowIdx >= 0 && p.colIdx >= 0) {
        const P = p.rowIdx;
        d.value = { row: P, col: p.colIdx }, (E = q.value) == null || E.focus();
        const Z = N.value[P], te = m.value[p.colIdx];
        Z && te && (o("row-clicked", { data: Z, event: l }), o("cell-selected", { data: Z, row: P, col: p.colIdx, colId: te.colId }));
      }
    }
    function dt(l) {
      var n, i;
      f.value && ((i = (n = l.target).closest) != null && i.call(n, ".cathode-filter-popup") || (f.value = null));
    }
    function Wt(l) {
      var x;
      if (!y.value) return;
      let n = 0;
      for (let b = 0; b < l; b++) n += m.value[b].width;
      const i = ((x = m.value[l]) == null ? void 0 : x.width) ?? 0, p = n - w.value;
      p < 0 ? w.value = Math.max(0, n) : p + i > y.value && (w.value = Math.min(Y.value, n + i - y.value));
    }
    function Ht(l) {
      var P;
      const n = m.value, i = n.length - 1, p = N.value.length - 1;
      if (!d.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(l.key) && (l.preventDefault(), d.value = { row: K.value, col: 0 });
        return;
      }
      let { row: x, col: b } = d.value;
      const E = (Z, te) => {
        x = Math.max(0, Math.min(p, Z)), b = Math.max(0, Math.min(i, te)), d.value = { row: x, col: b }, ke(x), Wt(b);
      };
      switch (l.key) {
        case "ArrowDown":
          l.preventDefault(), E(x + 1, b);
          break;
        case "ArrowUp":
          l.preventDefault(), E(x - 1, b);
          break;
        case "ArrowRight":
          l.preventDefault(), b < i ? E(x, b + 1) : E(x + 1, 0);
          break;
        case "ArrowLeft":
          l.preventDefault(), b > 0 ? E(x, b - 1) : E(x - 1, i);
          break;
        case "Tab":
          l.preventDefault(), l.shiftKey ? b > 0 ? E(x, b - 1) : E(x - 1, i) : b < i ? E(x, b + 1) : E(x + 1, 0);
          break;
        case "Enter":
          l.preventDefault(), l.shiftKey ? E(x - 1, b) : E(x + 1, b);
          break;
        case "Home":
          l.preventDefault(), l.ctrlKey || l.metaKey ? E(0, 0) : E(x, 0);
          break;
        case "End":
          l.preventDefault(), l.ctrlKey || l.metaKey ? E(p, i) : E(x, i);
          break;
        case "PageDown":
          l.preventDefault(), E(Math.min(p, x + A.value), b);
          break;
        case "PageUp":
          l.preventDefault(), E(Math.max(0, x - A.value), b);
          break;
        case "Escape":
          d.value = null;
          break;
        case "c":
        case "C":
          if (l.ctrlKey || l.metaKey) {
            l.preventDefault();
            const Z = N.value[x], te = n[b];
            Z && te && ((P = navigator.clipboard) == null || P.writeText(ve(te, Z)).catch(() => {
            }));
          }
          break;
      }
    }
    function At(l) {
      const n = l.target.value;
      H.value = n, n ? u[f.value] = n : delete u[f.value], o("filter-changed");
    }
    function vt() {
      f.value && delete u[f.value], H.value = "", f.value = null, o("filter-changed");
    }
    const Pt = {
      setGridOption(l, n) {
        l === "rowData" ? s.value = n : l === "pinnedBottomRowData" ? v.value = n : l === "quickFilterText" && (g.value = n);
      },
      getColumnState() {
        return e.columnDefs.map((l) => {
          var i, p;
          const n = L(l);
          return {
            colId: n,
            hide: h.has(n),
            sort: ((i = r.value) == null ? void 0 : i.colId) === n ? r.value.dir : null,
            sortIndex: ((p = r.value) == null ? void 0 : p.colId) === n ? 0 : null,
            width: c[n] ?? l.width
          };
        });
      },
      applyColumnState({ state: l }) {
        for (const n of l)
          n.hide === !0 && h.add(n.colId), n.hide === !1 && h.delete(n.colId), n.sort && (r.value = { colId: n.colId, dir: n.sort }), n.width && (c[n.colId] = n.width);
      },
      setFilterModel(l) {
        for (const n of Object.keys(u)) delete u[n];
        if (l)
          for (const [n, i] of Object.entries(l))
            (i == null ? void 0 : i.type) === "equals" ? u[n] = `__eq__${i.filter}` : i != null && i.filter && (u[n] = i.filter);
      },
      getFilterModel() {
        const l = {};
        for (const [n, i] of Object.entries(u))
          i && (l[n] = i.startsWith("__eq__") ? { type: "equals", filter: i.slice(6) } : { type: "contains", filter: i });
        return l;
      },
      async setColumnFilterModel(l, n) {
        n ? n.type === "equals" ? u[l] = `__eq__${n.filter}` : u[l] = n.filter ?? "" : delete u[l];
      },
      onFilterChanged() {
      },
      refreshCells() {
        D.value++;
      },
      exportDataAsCsv({ fileName: l = "export.csv" } = {}) {
        const n = I.value, i = n.map((E) => E.colDef.headerName ?? E.colId).join(","), p = N.value.map(
          (E) => n.map((P) => `"${String(ve(P, E)).replace(/"/g, '""')}"`).join(",")
        ), x = new Blob([[i, ...p].join(`
`)], { type: "text/csv" }), b = URL.createObjectURL(x);
        Object.assign(document.createElement("a"), { href: b, download: l }).click(), URL.revokeObjectURL(b);
      },
      resize() {
        _e();
      },
      resetColumnState() {
        h.clear();
        for (const n of e.columnDefs)
          n.hide && h.add(L(n));
        const l = e.columnDefs.find((n) => n.sort);
        r.value = l ? { colId: L(l), dir: l.sort } : null;
        for (const n of Object.keys(c)) delete c[n];
        for (const n of Object.keys(u)) delete u[n];
        g.value = "", S.value = 0, d.value = null, f.value = null;
      }
    };
    $(
      [N, () => v.value, m, S, M, d],
      () => xe(ie)
    ), $(() => e.theme, () => ie()), $(() => e.curvature, () => xe(_e)), $(() => e.scanlines, () => ie()), $(() => e.glow, () => ie()), $(d, (l) => {
      if (!l) return;
      const n = N.value[l.row], i = m.value[l.col];
      n && i && o("cell-selected", { data: n, row: l.row, col: l.col, colId: i.colId });
    });
    let Ae = null, Pe = null, et = 0;
    function ze() {
      cancelAnimationFrame(et), et = requestAnimationFrame(_e);
    }
    function ft(l) {
      l.preventDefault();
    }
    function mt() {
      j == null || j.dispose(), j = null, Se = !1, ut();
    }
    He(() => {
      for (const l of e.columnDefs)
        l.hide && h.add(L(l)), l.sort && !r.value && (r.value = { colId: L(l), dir: l.sort });
      s.value = e.rowData ?? [], v.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", dt), document.addEventListener("mousemove", ee), document.addEventListener("mouseup", ye), xe(() => {
        var l;
        ut(), q.value && (q.value.addEventListener("webglcontextlost", ft), q.value.addEventListener("webglcontextrestored", mt)), fe.value && (Ae = new ResizeObserver(() => _e()), Ae.observe(fe.value), Pe = new IntersectionObserver((n) => {
          n.some((i) => i.isIntersecting) && ze();
        }), Pe.observe(fe.value)), window.addEventListener("resize", ze), (l = window.visualViewport) == null || l.addEventListener("resize", ze), o("grid-ready", { api: Pt });
      });
    }), Ve(() => {
      var l, n, i;
      document.removeEventListener("click", dt, !0), document.removeEventListener("mousemove", ee), document.removeEventListener("mouseup", ye), (l = q.value) == null || l.removeEventListener("webglcontextlost", ft), (n = q.value) == null || n.removeEventListener("webglcontextrestored", mt), Ae == null || Ae.disconnect(), Pe == null || Pe.disconnect(), window.removeEventListener("resize", ze), (i = window.visualViewport) == null || i.removeEventListener("resize", ze), cancelAnimationFrame(et), j == null || j.dispose();
    });
    const de = V(() => Be[e.theme] ?? Be.none), $t = V(() => ({
      position: "absolute",
      left: `${_.value.x}px`,
      top: `${_.value.y}px`,
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
    })), Yt = V(() => ({
      background: de.value.bg,
      border: `1px solid ${de.value.border}`,
      color: de.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Vt = V(() => ({
      background: de.value.headerBg,
      borderTop: `1px solid ${de.value.border}`,
      color: de.value.text
    })), Ot = V(() => ({
      background: de.value.bg
    })), ht = V(() => de.value.accent);
    return (l, n) => {
      var i, p;
      return oe(), ae("div", {
        ref_key: "wrapEl",
        ref: fe,
        class: "cathode-wrap",
        style: he(Ot.value)
      }, [
        G("canvas", {
          ref_key: "canvasEl",
          ref: q,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Le(Dt, ["prevent"]),
          onMousemove: _t,
          onMouseleave: zt,
          onMousedown: Ft,
          onClick: Bt,
          onKeydown: Ht
        }, null, 544),
        f.value ? (oe(), ae("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: he($t.value),
          onClick: n[0] || (n[0] = Le(() => {
          }, ["stop"]))
        }, [
          G("input", {
            style: he(Yt.value),
            value: H.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: At,
            onKeydown: Nt(vt, ["escape"])
          }, null, 44, nl),
          H.value ? (oe(), ae("button", {
            key: 0,
            style: he({
              background: "none",
              border: "none",
              color: de.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: vt
          }, "✕", 4)) : we("", !0)
        ], 4)) : we("", !0),
        a.pagination ? (oe(), ae("div", {
          key: 1,
          class: "cathode-pagination",
          style: he(Vt.value)
        }, [
          G("button", {
            disabled: S.value <= 0,
            onClick: n[1] || (n[1] = (x) => Re())
          }, "◀", 8, ol),
          G("span", null, ge((K.value + 1).toLocaleString()) + "–" + ge(Math.min(N.value.length, Te.value + 1).toLocaleString()) + " / " + ge(N.value.length.toLocaleString()), 1),
          G("button", {
            disabled: S.value >= R.value,
            onClick: n[2] || (n[2] = (x) => T())
          }, "▶", 8, al),
          G("span", {
            class: "cathode-page-info",
            style: he({ color: ht.value })
          }, ge(N.value.length.toLocaleString()) + " rows ", 5),
          d.value ? (oe(), ae("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: he({ color: ht.value })
          }, ge(((i = m.value[d.value.col]) == null ? void 0 : i.colDef.headerName) ?? ((p = m.value[d.value.col]) == null ? void 0 : p.colId)) + " : " + ge(ve(m.value[d.value.col], N.value[d.value.row])), 5)) : we("", !0)
        ], 4)) : we("", !0)
      ], 4);
    };
  }
}), Oe = (a, t) => {
  const e = a.__vccOpts || a;
  for (const [o, s] of t)
    e[o] = s;
  return e;
}, tn = /* @__PURE__ */ Oe(ul, [["__scopeId", "data-v-07901c91"]]), Ue = {
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
function dl(a, t) {
  switch (t) {
    case "warn":
      return a.levelWarn;
    case "error":
      return a.levelError;
    case "debug":
      return a.levelDebug;
    case "success":
      return a.levelSuccess;
    case "info":
    default:
      return a.levelInfo;
  }
}
const vl = 12, me = 18, Xe = 10, We = 6, it = `${vl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function fl(a, t, e) {
  if (e <= 0 || !t) return [t];
  const o = [];
  for (const s of t.split(`
`)) {
    if (!s) {
      o.push("");
      continue;
    }
    if (a.measureText(s).width <= e) {
      o.push(s);
      continue;
    }
    const v = s.split(/(\s+)/);
    let g = "";
    for (const r of v) {
      const u = g + r;
      if (a.measureText(u).width <= e)
        g = u;
      else if (g && (o.push(g.replace(/\s+$/, "")), g = ""), a.measureText(r).width > e) {
        let c = "";
        for (const h of r)
          a.measureText(c + h).width > e ? (c && o.push(c), c = h) : c += h;
        g = c;
      } else
        g = r.replace(/^\s+/, "");
    }
    g && o.push(g.replace(/\s+$/, ""));
  }
  return o.length ? o : [""];
}
function It(a) {
  if (typeof a == "number") {
    const t = new Date(a), e = String(t.getHours()).padStart(2, "0"), o = String(t.getMinutes()).padStart(2, "0"), s = String(t.getSeconds()).padStart(2, "0");
    return `${e}:${o}:${s}`;
  }
  return a;
}
function ml(a, t) {
  return Math.ceil(a.measureText(t).width) + 12;
}
function hl(a) {
  const { entries: t, ctx: e, textMaxWidth: o, showTimestamps: s, wordWrap: v } = a, g = a.formatTs ?? It;
  e.font = it;
  const r = [];
  for (let u = 0; u < t.length; u++) {
    const c = t[u], h = c.level ?? "info", D = s && c.ts != null ? g(c.ts) : "", y = v ? fl(e, c.text, o) : c.text.split(`
`);
    for (let k = 0; k < y.length; k++)
      r.push({
        entryIdx: u,
        text: y[k],
        level: h,
        timestamp: k === 0 ? D : "",
        isFirstFrag: k === 0
      });
  }
  return r;
}
function Mt(a, t) {
  const e = a.getContext("2d");
  if (!e) return;
  const o = a.width, s = a.height, v = Ue[t.theme] ?? Ue.none;
  e.clearRect(0, 0, o, s), e.fillStyle = v.bg, e.fillRect(0, 0, o, s), e.save(), e.beginPath(), e.rect(0, 0, o, s), e.clip(), e.font = it, e.textBaseline = "middle";
  const g = t.visualLines, r = Xe, u = t.showTimestamps ? Xe + t.timestampWidth : Xe, c = Math.max(0, Math.floor((t.scrollY - We) / me)), h = Math.min(g.length, Math.ceil((t.scrollY + s - We) / me) + 1);
  for (let D = c; D < h; D++) {
    const y = g[D], k = We + D * me - t.scrollY + me / 2;
    if (y.entryIdx % 2 === 1 && y.isFirstFrag) {
      e.fillStyle = v.rowAlt;
      let w = 1;
      for (; D + w < h && g[D + w].entryIdx === y.entryIdx; ) w++;
      e.fillRect(0, k - me / 2, o, me * w);
    }
    D === t.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, k - me / 2, o, me)), t.showTimestamps && y.timestamp && (e.fillStyle = v.timestamp, e.textAlign = "left", t.glow && (e.shadowBlur = 3, e.shadowColor = v.timestamp), e.fillText(y.timestamp, r, k), e.shadowBlur = 0);
    const S = dl(v, y.level);
    e.fillStyle = S, e.textAlign = "left", t.glow && (e.shadowBlur = 4, e.shadowColor = S), e.fillText(y.text, u, k), e.shadowBlur = 0;
  }
  e.restore();
}
function gl(a, t, e) {
  if (a < 0) return -1;
  const o = Math.floor((a + t - We) / me);
  return o < 0 || o >= e ? -1 : o;
}
function wl(a) {
  return We * 2 + a * me;
}
const pl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, xl = `
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
`, bl = /* @__PURE__ */ Ye({
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
  setup(a, { expose: t }) {
    const e = a, o = z(null), s = z(null), v = z(0), g = z(0), r = z(0), u = z(-1), c = z(!0), h = V(() => {
      const C = e.entries ?? [];
      return e.maxLines > 0 && C.length > e.maxLines ? C.slice(C.length - e.maxLines) : C;
    }), D = V(() => {
      if (!e.showTimestamps) return "";
      const C = e.formatTs ?? It;
      let B = "00:00:00";
      for (const ee of h.value) {
        if (ee.ts == null) continue;
        const ye = C(ee.ts);
        ye.length > B.length && (B = ye);
      }
      return B;
    }), y = z(0), k = z([]);
    function S() {
      if (!m) return;
      const C = m.getContext("2d");
      if (!C) return;
      C.font = it;
      const B = e.showTimestamps ? ml(C, D.value) : 0;
      y.value = B;
      const ee = Math.max(
        1,
        v.value - Xe * 2 - B
      );
      k.value = hl({
        entries: h.value,
        ctx: C,
        textMaxWidth: ee,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const w = V(() => wl(k.value.length)), M = V(() => Math.max(0, w.value - g.value));
    $(M, () => {
      c.value ? r.value = M.value : r.value = Math.min(r.value, M.value);
    }), $(
      [h, v, () => e.showTimestamps, () => e.wordWrap, D],
      () => {
        S(), xe(R);
      },
      { deep: !1 }
    );
    let d = null, f = !1, _, H, L, I, m;
    function Y() {
      if (!(!s.value || !o.value)) {
        m = document.createElement("canvas");
        try {
          d = new W.WebGLRenderer({ canvas: s.value, antialias: !1, alpha: !0 });
        } catch {
          f = !0;
        }
        if (!f && !d.getContext() && (d.dispose(), d = null, f = !0), f) {
          O();
          return;
        }
        d.setPixelRatio(1), d.setClearColor(0, 0), _ = new W.Scene(), H = new W.OrthographicCamera(-1, 1, 1, -1, 0, 1), I = new W.CanvasTexture(m), I.minFilter = W.LinearFilter, I.magFilter = W.LinearFilter, L = new W.ShaderMaterial({
          uniforms: {
            uTex: { value: I },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: pl,
          fragmentShader: xl,
          transparent: !0
        }), _.add(new W.Mesh(new W.PlaneGeometry(2, 2), L)), O();
      }
    }
    function O() {
      if (!o.value || !d && !f) return;
      const C = o.value.clientWidth, B = o.value.clientHeight;
      if (!C || !B) return;
      const ee = m.width !== C || m.height !== B;
      ee && (m.width = C, m.height = B, v.value = C, g.value = B, S(), d ? (ee && I && (I.dispose(), I = new W.CanvasTexture(m), I.minFilter = W.LinearFilter, I.magFilter = W.LinearFilter, L && (L.uniforms.uTex.value = I)), d.setPixelRatio(window.devicePixelRatio || 1), d.setSize(C, B)) : s.value && (s.value.width = C, s.value.height = B, s.value.style.width = C + "px", s.value.style.height = B + "px"), c.value && (r.value = Math.max(0, w.value - g.value)), R());
    }
    function R() {
      if (!(m != null && m.width)) return;
      if (f) {
        if (!s.value) return;
        Mt(m, {
          visualLines: k.value,
          scrollY: r.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: y.value,
          hoveredLine: u.value
        });
        const B = s.value.getContext("2d");
        B && B.drawImage(m, 0, 0);
        return;
      }
      if (!d || !L || !I) return;
      const C = e.theme === "paper";
      L.uniforms.uStrength.value = e.curvature / 45 * 0.55, L.uniforms.uScanlines.value = e.scanlines && !C ? 1 : 0, L.uniforms.uVignette.value = C ? 0 : 1, Mt(m, {
        visualLines: k.value,
        scrollY: r.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: y.value,
        hoveredLine: u.value
      }), I.needsUpdate = !0, d.render(_, H);
    }
    $(() => e.theme, () => R()), $(() => e.curvature, () => R()), $(() => e.scanlines, () => R()), $(() => e.glow, () => R()), $(r, () => R()), $(u, () => R());
    function A(C) {
      if (!s.value) return [-1, -1];
      const B = s.value.getBoundingClientRect();
      return [C.clientX - B.left, C.clientY - B.top];
    }
    function K(C) {
      r.value = Math.max(0, Math.min(M.value, C)), c.value = r.value >= M.value - 4;
    }
    function Te(C) {
      K(r.value + C.deltaY);
    }
    let J = !1, ve = 0, Me = 0;
    function N(C) {
      J = !0, ve = C.clientY, Me = r.value;
    }
    function ke(C) {
      if (J) {
        const B = ve - C.clientY;
        K(Me + B);
      }
    }
    function Re() {
      J && (J = !1);
    }
    function T(C) {
      const [, B] = A(C);
      if (B < 0) {
        u.value = -1;
        return;
      }
      u.value = gl(B, r.value, k.value.length);
    }
    function F() {
      u.value = -1;
    }
    t({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        c.value = !0, r.value = M.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(C) {
        K(We + C * me);
      }
    });
    let X = null, Q = null, se = 0;
    const ce = je("cathodeResetTick", z(0));
    $(ce, () => U());
    function U() {
      cancelAnimationFrame(se), se = requestAnimationFrame(O);
    }
    function be(C) {
      C.preventDefault();
    }
    function Ce() {
      d == null || d.dispose(), d = null, f = !1, Y();
    }
    He(() => {
      document.addEventListener("mousemove", ke), document.addEventListener("mouseup", Re), xe(() => {
        var C;
        Y(), s.value && (s.value.addEventListener("webglcontextlost", be), s.value.addEventListener("webglcontextrestored", Ce)), o.value && (X = new ResizeObserver(() => O()), X.observe(o.value), Q = new IntersectionObserver((B) => {
          B.some((ee) => ee.isIntersecting) && U();
        }), Q.observe(o.value)), window.addEventListener("resize", U), (C = window.visualViewport) == null || C.addEventListener("resize", U), r.value = M.value;
      });
    }), Ve(() => {
      var C, B, ee;
      document.removeEventListener("mousemove", ke), document.removeEventListener("mouseup", Re), (C = s.value) == null || C.removeEventListener("webglcontextlost", be), (B = s.value) == null || B.removeEventListener("webglcontextrestored", Ce), X == null || X.disconnect(), Q == null || Q.disconnect(), window.removeEventListener("resize", U), (ee = window.visualViewport) == null || ee.removeEventListener("resize", U), cancelAnimationFrame(se), d == null || d.dispose();
    });
    const Ee = V(() => Ue[e.theme] ?? Ue.none), De = V(() => ({
      background: Ee.value.bg
    }));
    return (C, B) => (oe(), ae("div", {
      ref_key: "wrapEl",
      ref: o,
      class: "cathode-log-wrap",
      style: he(De.value)
    }, [
      G("canvas", {
        ref_key: "canvasEl",
        ref: s,
        class: "cathode-log-canvas",
        onWheel: Le(Te, ["prevent"]),
        onMousemove: T,
        onMouseleave: F,
        onMousedown: N
      }, null, 544)
    ], 4));
  }
}), ln = /* @__PURE__ */ Oe(bl, [["__scopeId", "data-v-d2d092f3"]]), Ge = {
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
}, yl = 0.18, $e = 8, Ml = 8, Tt = 8, Cl = 8, nt = 4, Sl = 1, Ll = 1;
function Il(a, t, e, o = 0) {
  const s = Math.max(0, t - Tt - Cl), v = Math.max(1, Math.floor(s / e)), g = Math.min(v, a);
  return { firstIdx: Math.max(0, a - g - Math.floor(o / e)), count: g, slotW: e };
}
function Tl(a, t, e) {
  if (!a.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let o = 1 / 0, s = -1 / 0, v = 0;
  const g = Math.min(a.length, t + e);
  for (let u = t; u < g; u++) {
    const c = a[u];
    c && (c.low < o && (o = c.low), c.high > s && (s = c.high), c.volume > v && (v = c.volume));
  }
  if (!isFinite(o) || !isFinite(s) || o === s) {
    const u = isFinite(o) ? o : 0;
    return { min: u - 1, max: u + 1, maxVol: Math.max(1, v) };
  }
  const r = (s - o) * 0.04;
  return { min: o - r, max: s + r, maxVol: Math.max(1, v) };
}
function kl(a, t) {
  const e = Math.max(1, a - $e - Ml - nt), o = Math.max(0, Math.round(e * t)), s = e - o;
  return {
    priceY0: $e,
    priceY1: $e + s,
    volumeY0: $e + s + nt,
    volumeY1: $e + s + nt + o
  };
}
function Ne(a, t, e, o) {
  const s = t.max - t.min;
  return s <= 0 ? (e + o) / 2 : e + (1 - (a - t.min) / s) * (o - e);
}
function Rl(a, t, e) {
  return Tt + (a - t + 0.5) * e;
}
function Ct(a, t) {
  const e = a.getContext("2d");
  if (!e) return;
  const o = a.width, s = a.height, v = Ge[t.theme] ?? Ge.none;
  if (e.clearRect(0, 0, o, s), e.fillStyle = v.bg, e.fillRect(0, 0, o, s), !t.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, o, s), e.clip();
  const g = Il(t.candles.length, o, t.slotW, t.scrollX), r = Tl(t.candles, g.firstIdx, g.count), u = kl(s, t.showVolume ? t.volumeFraction : 0), c = Math.max(Sl, Math.floor(t.slotW * 0.7)), h = Math.min(t.candles.length, g.firstIdx + g.count);
  for (let D = g.firstIdx; D < h; D++) {
    const y = t.candles[D];
    if (!y) continue;
    const k = Rl(D, g.firstIdx, t.slotW), S = Ne(y.open, r, u.priceY0, u.priceY1), w = Ne(y.close, r, u.priceY0, u.priceY1), M = Ne(y.high, r, u.priceY0, u.priceY1), d = Ne(y.low, r, u.priceY0, u.priceY1), f = y.close >= y.open, _ = f ? v.wickBull : v.wickBear, H = f ? v.candleBull : v.candleBear;
    t.glow && (e.shadowBlur = 4, e.shadowColor = H), e.strokeStyle = _, e.lineWidth = Ll, e.beginPath(), e.moveTo(Math.round(k) + 0.5, M), e.lineTo(Math.round(k) + 0.5, d), e.stroke(), e.fillStyle = H;
    const L = Math.min(S, w), I = Math.max(1, Math.abs(w - S));
    if (e.fillRect(
      Math.round(k - c / 2),
      Math.round(L),
      c,
      Math.round(I)
    ), e.shadowBlur = 0, t.showVolume && r.maxVol > 0) {
      const m = Math.round(y.volume / r.maxVol * (u.volumeY1 - u.volumeY0));
      m > 0 && (e.fillStyle = f ? v.volumeBull : v.volumeBear, e.fillRect(
        Math.round(k - c / 2),
        u.volumeY1 - m,
        c,
        m
      ));
    }
  }
  e.restore();
}
const El = `
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
`, _l = /* @__PURE__ */ Ye({
  __name: "CathodeKLine",
  props: {
    candles: {},
    theme: { default: "none" },
    curvature: { default: 25 },
    scanlines: { type: Boolean, default: !0 },
    glow: { type: Boolean, default: !0 },
    showVolume: { type: Boolean, default: !0 },
    volumeFraction: { default: yl },
    slotW: { default: 8 }
  },
  setup(a) {
    const t = a, e = z(null), o = z(null), s = z(0), v = z(0), g = z(0);
    let r = null, u = !1, c, h, D, y, k;
    function S() {
      if (!(!o.value || !e.value)) {
        k = document.createElement("canvas");
        try {
          r = new W.WebGLRenderer({ canvas: o.value, antialias: !1, alpha: !0 });
        } catch {
          u = !0;
        }
        if (!u && !r.getContext() && (r.dispose(), r = null, u = !0), u) {
          w();
          return;
        }
        r.setPixelRatio(1), r.setClearColor(0, 0), c = new W.Scene(), h = new W.OrthographicCamera(-1, 1, 1, -1, 0, 1), y = new W.CanvasTexture(k), y.minFilter = W.LinearFilter, y.magFilter = W.LinearFilter, D = new W.ShaderMaterial({
          uniforms: {
            uTex: { value: y },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: El,
          fragmentShader: Dl,
          transparent: !0
        }), c.add(new W.Mesh(new W.PlaneGeometry(2, 2), D)), w();
      }
    }
    function w() {
      if (!e.value || !r && !u) return;
      const R = e.value.clientWidth, A = e.value.clientHeight;
      !R || !A || !(k.width !== R || k.height !== A) || (k.width = R, k.height = A, s.value = R, v.value = A, r ? (y && (y.dispose(), y = new W.CanvasTexture(k), y.minFilter = W.LinearFilter, y.magFilter = W.LinearFilter, D && (D.uniforms.uTex.value = y)), r.setPixelRatio(window.devicePixelRatio || 1), r.setSize(R, A)) : o.value && (o.value.width = R, o.value.height = A, o.value.style.width = R + "px", o.value.style.height = A + "px"), M());
    }
    function M() {
      if (!(k != null && k.width)) return;
      if (u) {
        if (!o.value) return;
        Ct(k, {
          candles: t.candles,
          slotW: t.slotW,
          scrollX: g.value,
          theme: t.theme,
          glow: !1,
          showVolume: t.showVolume,
          volumeFraction: t.volumeFraction
        });
        const A = o.value.getContext("2d");
        A && A.drawImage(k, 0, 0);
        return;
      }
      if (!r || !D || !y) return;
      const R = t.theme === "paper";
      D.uniforms.uStrength.value = t.curvature / 45 * 0.55, D.uniforms.uScanlines.value = t.scanlines && !R ? 1 : 0, D.uniforms.uVignette.value = R ? 0 : 1, Ct(k, {
        candles: t.candles,
        slotW: t.slotW,
        scrollX: g.value,
        theme: t.theme,
        glow: t.glow,
        showVolume: t.showVolume,
        volumeFraction: t.volumeFraction
      }), y.needsUpdate = !0, r.render(c, h);
    }
    $(() => t.theme, () => M()), $(() => t.curvature, () => M()), $(() => t.scanlines, () => M()), $(() => t.glow, () => M()), $(() => t.showVolume, () => M()), $(() => t.volumeFraction, () => M()), $(() => t.slotW, () => M()), $(() => t.candles, () => M(), { deep: !1 }), $(g, () => M());
    let d = null, f = null, _ = 0;
    const H = je("cathodeResetTick", z(0));
    $(H, () => L());
    function L() {
      cancelAnimationFrame(_), _ = requestAnimationFrame(w);
    }
    function I(R) {
      R.preventDefault();
    }
    function m() {
      r == null || r.dispose(), r = null, u = !1, S();
    }
    He(() => {
      xe(() => {
        var R;
        S(), o.value && (o.value.addEventListener("webglcontextlost", I), o.value.addEventListener("webglcontextrestored", m)), e.value && (d = new ResizeObserver(() => w()), d.observe(e.value), f = new IntersectionObserver((A) => {
          A.some((K) => K.isIntersecting) && L();
        }), f.observe(e.value)), window.addEventListener("resize", L), (R = window.visualViewport) == null || R.addEventListener("resize", L);
      });
    }), Ve(() => {
      var R, A, K;
      (R = o.value) == null || R.removeEventListener("webglcontextlost", I), (A = o.value) == null || A.removeEventListener("webglcontextrestored", m), d == null || d.disconnect(), f == null || f.disconnect(), window.removeEventListener("resize", L), (K = window.visualViewport) == null || K.removeEventListener("resize", L), cancelAnimationFrame(_), r == null || r.dispose();
    });
    const Y = V(() => Ge[t.theme] ?? Ge.none), O = V(() => ({
      background: Y.value.bg
    }));
    return (R, A) => (oe(), ae("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-kline-wrap",
      style: he(O.value)
    }, [
      G("canvas", {
        ref_key: "canvasEl",
        ref: o,
        class: "cathode-kline-canvas"
      }, null, 512)
    ], 4));
  }
}), nn = /* @__PURE__ */ Oe(_l, [["__scopeId", "data-v-22bab698"]]), st = z(0), at = 28, Fe = 12;
let rt = 10, Ke = "cathode.layout", qe = !1;
const ne = z({});
function zl(a, t = "cathode.layout") {
  if (!qe) {
    qe = !0, Ke = t;
    try {
      const e = localStorage.getItem(Ke);
      if (e) {
        ne.value = JSON.parse(e), St();
        return;
      }
    } catch {
    }
    ne.value = { ...a }, St();
  }
}
function St() {
  let a = 10;
  for (const t of Object.values(ne.value))
    typeof (t == null ? void 0 : t.zIndex) == "number" && t.zIndex > a && (a = t.zIndex);
  rt = a;
}
function Ie() {
  localStorage.setItem(Ke, JSON.stringify(ne.value));
}
function Fl(a) {
  qe = !1, localStorage.removeItem(Ke), ne.value = { ...a }, Ie(), qe = !0, st.value++;
}
function kt(a) {
  rt++, ne.value[a] && (ne.value[a].zIndex = rt);
}
function Bl(a, t) {
  ne.value[a].visible = t, Ie();
}
function Wl(a, t) {
  ne.value[a].minimized = t, t && (ne.value[a].maximized = !1), Ie();
}
function Hl(a, t) {
  ne.value[a].maximized = t, t && (ne.value[a].minimized = !1, kt(a)), Ie();
}
function Al(a, t, e) {
  ne.value[a].x = Math.round(t), ne.value[a].y = Math.round(e), Ie();
}
function Pl(a, t, e) {
  ne.value[a].w = Math.round(t), ne.value[a].h = Math.round(e), Ie();
}
function on(a, t, e) {
  const o = Math.ceil(Math.sqrt(e.length)), s = Math.ceil(e.length / o), v = Math.floor((a - Fe * (o + 1)) / o), g = Math.floor((t - Fe * (s + 1)) / s), r = {};
  return e.forEach((u, c) => {
    const h = c % o, D = Math.floor(c / o);
    r[u] = {
      x: Fe + h * (v + Fe),
      y: Fe + D * (g + Fe),
      w: v,
      h: g,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: c + 1
    };
  }), r;
}
function Rt() {
  return {
    containers: ne,
    TITLEBAR_H: at,
    load: zl,
    save: Ie,
    reset: Fl,
    bringToFront: kt,
    setVisible: Bl,
    setMinimized: Wl,
    setMaximized: Hl,
    updatePos: Al,
    updateSize: Pl
  };
}
const $l = { class: "ws-toolbar" }, Yl = {
  key: 0,
  class: "ws-restore-menu"
}, Vl = {
  key: 0,
  class: "ws-restore-empty"
}, Ol = ["onClick"], Nl = /* @__PURE__ */ Ye({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(a) {
    const t = a, { containers: e, load: o, reset: s, setVisible: v } = Rt(), g = z(null);
    wt("cathodeWorkspace", g), wt("cathodeResetTick", st), He(() => {
      if (!g.value) return;
      const { clientWidth: M, clientHeight: d } = g.value, f = t.initialLayout ?? {};
      o(f, t.storageKey ?? "cathode.layout");
      const _ = Object.keys(e.value)[0];
      _ && r(_);
    });
    function r(M) {
      var f;
      document.querySelectorAll(".cc").forEach((_) => _.classList.remove("cc-focused"));
      const d = (f = g.value) == null ? void 0 : f.querySelector(`#cc-${M}`);
      d && d.classList.add("cc-focused");
    }
    function u() {
      !g.value || !t.initialLayout || s(t.initialLayout);
    }
    function c(M) {
      const d = M.target.closest(".cc");
      d && (document.querySelectorAll(".cc").forEach((f) => f.classList.remove("cc-focused")), d.classList.add("cc-focused"));
    }
    const h = z(!1), D = () => Object.entries(e.value).filter(([, M]) => !M.visible).map(([M]) => M);
    function y(M) {
      v(M, !0), h.value = !1;
    }
    function k(M) {
      if (!h.value) return;
      const d = M.target;
      !d.closest(".ws-restore-menu") && !d.closest(".ws-btn-restore") && (h.value = !1);
    }
    function S(M) {
      M.key === "Escape" && (h.value = !1);
    }
    He(() => {
      document.addEventListener("click", k), document.addEventListener("keydown", S);
    }), Ve(() => {
      document.removeEventListener("click", k), document.removeEventListener("keydown", S);
    });
    function w(M) {
      var d;
      return ((d = t.containerTitles) == null ? void 0 : d[M]) ?? M;
    }
    return (M, d) => (oe(), ae("div", {
      ref_key: "workspaceEl",
      ref: g,
      class: "cathode-workspace",
      onMousedown: c
    }, [
      ot(M.$slots, "default", {}, void 0, !0),
      ot(M.$slots, "overlay", {}, void 0, !0),
      G("div", $l, [
        a.initialLayout ? (oe(), ae("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: u
        }, " ↺ Reset Layout ")) : we("", !0),
        d[1] || (d[1] = G("div", { class: "ws-sep" }, null, -1)),
        G("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: d[0] || (d[0] = (f) => h.value = !h.value)
        }, " ⊞ Restore Panel ")
      ]),
      Xt(Ut, { name: "menu" }, {
        default: Gt(() => [
          h.value ? (oe(), ae("div", Yl, [
            d[3] || (d[3] = G("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            D().length ? we("", !0) : (oe(), ae("div", Vl, " No closed panels ")),
            (oe(!0), ae(Kt, null, qt(D(), (f) => (oe(), ae("div", {
              key: f,
              class: "ws-restore-item",
              onClick: (_) => y(f)
            }, [
              d[2] || (d[2] = G("span", { class: "ws-restore-icon" }, "⊞", -1)),
              jt(" " + ge(w(f)), 1)
            ], 8, Ol))), 128))
          ])) : we("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), an = /* @__PURE__ */ Oe(Nl, [["__scopeId", "data-v-5838d04b"]]), Xl = ["id"], Ul = { class: "cc-title" }, Gl = {
  key: 0,
  class: "cc-size-badge"
}, Kl = { class: "cc-controls" }, ql = ["title"], jl = { class: "cc-body" }, Zl = 200, Jl = 80, Lt = 60, Ql = /* @__PURE__ */ Ye({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(a) {
    const t = a, { containers: e, bringToFront: o, setVisible: s, setMinimized: v, setMaximized: g, updatePos: r, updateSize: u } = Rt(), c = je("cathodeWorkspace", z(null)), h = V(() => e.value[t.id]), D = V(() => {
      const T = h.value, F = t.curvature ?? 0;
      if (!T) return {};
      const X = { "--curvature": F };
      return T.maximized ? { ...X, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: T.zIndex } : {
        ...X,
        left: T.x + "px",
        top: T.y + "px",
        width: T.w + "px",
        height: T.minimized ? at + "px" : T.h + "px",
        zIndex: T.zIndex,
        display: T.visible ? "flex" : "none"
      };
    });
    let y = !1, k = 0, S = 0;
    function w(T) {
      var Q;
      if (T.target.closest(".cc-btn") || h.value.maximized) return;
      o(t.id), y = !0;
      const F = (Q = c.value) == null ? void 0 : Q.querySelector(`#cc-${t.id}`);
      if (!F) return;
      const X = F.getBoundingClientRect();
      k = T.clientX - X.left, S = T.clientY - X.top, document.addEventListener("mousemove", M), document.addEventListener("mouseup", d), T.preventDefault();
    }
    function M(T) {
      var ce;
      if (!y || !c.value) return;
      const F = c.value.getBoundingClientRect(), X = ((ce = h.value) == null ? void 0 : ce.w) ?? 300;
      let Q = T.clientX - F.left - k, se = T.clientY - F.top - S;
      Q = Math.max(Lt - X, Math.min(F.width - Lt, Q)), se = Math.max(0, Math.min(F.height - at, se)), r(t.id, Q, se);
    }
    function d() {
      y = !1, document.removeEventListener("mousemove", M), document.removeEventListener("mouseup", d);
    }
    let f = !1, _ = 0, H = 0, L = 0, I = 0;
    const m = z("");
    function Y(T) {
      h.value.maximized || (o(t.id), f = !0, _ = T.clientX, H = T.clientY, L = h.value.w, I = h.value.h, document.addEventListener("mousemove", O), document.addEventListener("mouseup", R), T.preventDefault(), T.stopPropagation());
    }
    function O(T) {
      if (!f) return;
      const F = Math.max(Zl, L + (T.clientX - _)), X = Math.max(Jl, I + (T.clientY - H));
      u(t.id, F, X), m.value = `${Math.round(F)}×${Math.round(X)}`;
    }
    function R() {
      f = !1, m.value = "", document.removeEventListener("mousemove", O), document.removeEventListener("mouseup", R), A.value++;
    }
    const A = z(0);
    $(st, () => {
      A.value++;
    }), Ve(() => {
      var T;
      document.removeEventListener("mousemove", M), document.removeEventListener("mouseup", d), document.removeEventListener("mousemove", O), document.removeEventListener("mouseup", R), (T = K.value) == null || T.removeEventListener("scroll", J), ve();
    });
    const K = z(null);
    function Te(T) {
      if (t.canvas) return [];
      const F = T.children[0];
      return F ? Array.from(F.children) : [];
    }
    function J() {
      const T = K.value, F = t.curvature ?? 0;
      if (!T) return;
      const X = Te(T);
      if (!X.length) return;
      const Q = T.clientHeight, se = Q / 2, ce = F * 38e-4;
      X.forEach((U) => {
        if (!U.dataset.origFs) {
          const fe = getComputedStyle(U);
          U.dataset.origFs = fe.fontSize, U.dataset.origLh = fe.lineHeight;
        }
        if (F === 0) {
          U.style.fontSize = "", U.style.lineHeight = "";
          return;
        }
        const be = U.getBoundingClientRect(), Ce = T.getBoundingClientRect(), Ee = be.top - Ce.top + be.height / 2, De = Math.min(1, Math.abs(Ee - se) / (Q / 2)), C = 1 + ce * Math.cos(De * Math.PI / 2), B = parseFloat(U.dataset.origFs), ee = U.dataset.origLh, ye = ee === "normal" ? B * 1.4 : parseFloat(ee);
        isNaN(B) || (U.style.fontSize = `${(B * C).toFixed(2)}px`), isNaN(ye) || (U.style.lineHeight = `${(ye * C).toFixed(2)}px`);
      });
    }
    function ve() {
      const T = K.value;
      T && Te(T).forEach((F) => {
        F.style.fontSize = "", F.style.lineHeight = "", delete F.dataset.origFs, delete F.dataset.origLh;
      });
    }
    $(() => t.curvature, (T) => {
      (T ?? 0) === 0 ? ve() : J();
    }), He(() => {
      var T;
      (T = K.value) == null || T.addEventListener("scroll", J, { passive: !0 }), xe(J);
    });
    function Me() {
      v(t.id, !h.value.minimized), xe(() => {
        A.value++;
      });
    }
    function N() {
      g(t.id, !h.value.maximized), xe(() => {
        A.value++;
      });
    }
    function ke() {
      s(t.id, !1);
    }
    function Re() {
      o(t.id);
    }
    return (T, F) => h.value && h.value.visible ? (oe(), ae("div", {
      key: 0,
      id: `cc-${a.id}`,
      class: Zt(["cc", { "cc-minimized": h.value.minimized, "cc-maximized": h.value.maximized, "cc-has-canvas": a.canvas }]),
      style: he(D.value),
      onMousedown: Re
    }, [
      G("div", {
        class: "cc-titlebar",
        onMousedown: w
      }, [
        F[0] || (F[0] = G("span", { class: "cc-status-dot" }, null, -1)),
        G("span", Ul, ge(a.title), 1),
        m.value ? (oe(), ae("span", Gl, ge(m.value), 1)) : we("", !0),
        G("div", Kl, [
          G("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Le(Me, ["stop"])
          }, "─"),
          G("button", {
            class: "cc-btn cc-btn-max",
            title: h.value.maximized ? "Restore" : "Maximize",
            onClick: Le(N, ["stop"])
          }, ge(h.value.maximized ? "⤡" : "⤢"), 9, ql),
          G("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Le(ke, ["stop"])
          }, "✕")
        ])
      ], 32),
      Jt(G("div", jl, [
        G("div", {
          ref_key: "bodyEl",
          ref: K,
          class: "cc-screen",
          onScroll: J
        }, [
          ot(T.$slots, "default", { resizeKey: A.value }, void 0, !0),
          F[1] || (F[1] = G("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [Qt, !h.value.minimized]
      ]),
      !h.value.minimized && !h.value.maximized ? (oe(), ae("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Le(Y, ["stop"])
      }, null, 32)) : we("", !0)
    ], 46, Xl)) : we("", !0);
  }
}), rn = /* @__PURE__ */ Oe(Ql, [["__scopeId", "data-v-d8a49f79"]]);
export {
  rn as CathodeContainer,
  tn as CathodeGrid,
  nn as CathodeKLine,
  ln as CathodeLog,
  an as CathodeWorkspace,
  Ge as KLINE_THEME_COLORS,
  Ue as LOG_THEME_COLORS,
  on as buildDefaultLayout,
  Rt as useCathodeLayout
};
