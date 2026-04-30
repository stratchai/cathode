import { defineComponent as Ne, ref as B, reactive as rt, computed as N, watch as P, inject as tt, nextTick as Ie, onMounted as Pe, onUnmounted as Ge, openBlock as re, createElementBlock as ie, normalizeStyle as be, createElementVNode as j, withModifiers as Re, withKeys as Qt, createCommentVNode as Me, toDisplayString as ye, provide as Mt, renderSlot as ct, createVNode as el, Transition as tl, withCtx as ll, Fragment as nl, renderList as ol, createTextVNode as al, normalizeClass as rl, withDirectives as il, vShow as sl } from "vue";
import * as H from "three";
const Ye = {
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
}, oe = 30, St = 12, cl = 10;
function Ct(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, r = t.height, i = Ye[l.theme] ?? Ye.none, { cols: d, rows: f, pinnedRows: c, rowHeight: s, scrollY: u, scrollX: y, glow: x } = l;
  e.clearRect(0, 0, n, r), e.fillStyle = i.bg, e.fillRect(0, 0, n, r), e.save(), e.beginPath(), e.rect(0, 0, n, r), e.clip();
  const M = c.length * s, g = r - oe - M;
  e.fillStyle = i.headerBg, e.fillRect(0, 0, n, oe), e.textBaseline = "middle", e.textAlign = "left";
  let v = -y;
  for (let w = 0; w < d.length; w++) {
    const T = d[w];
    if (v + T.width <= 0) {
      v += T.width;
      continue;
    }
    if (v >= n) break;
    const z = !!l.colFilters[T.colId], E = l.sortColId === T.colId, R = (T.colDef.headerName ?? T.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(v, 0, T.width, oe), e.clip(), e.font = `bold ${cl}px system-ui, -apple-system, sans-serif`, e.fillStyle = z ? i.accent : i.textHeader, x && (e.shadowBlur = 6, e.shadowColor = i.textHeader), e.fillText(R, v + 8, oe / 2), e.shadowBlur = 0, E) {
      const b = e.measureText(R).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = i.accent, e.fillText(l.sortDir === "asc" ? "▲" : "▼", v + 8 + b + 4, oe / 2);
    }
    T.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = z ? i.accent : i.textHeader, e.globalAlpha = z ? 1 : 0.38, e.fillText("⌕", v + T.width - 20, oe / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(v + T.width - 0.5, 0), e.lineTo(v + T.width - 0.5, oe), e.stroke(), v += T.width;
  }
  e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, oe - 0.5), e.lineTo(n, oe - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, oe, n, g), e.clip();
  const m = Math.max(0, Math.floor(u / s)), h = Math.min(f.length, Math.ceil((u + g) / s));
  for (let w = m; w < h; w++) {
    const T = f[w], z = oe + w * s - u;
    w % 2 === 1 && (e.fillStyle = i.rowAlt, e.fillRect(0, z, n, s)), w === l.hoveredRow && w !== l.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, z, n, s)), w === l.selectedRow && (e.fillStyle = ul(i.accent, 0.1), e.fillRect(0, z, n, s)), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, z + s - 0.5), e.lineTo(n, z + s - 0.5), e.stroke();
    let E = -y;
    for (let R = 0; R < d.length; R++) {
      const b = d[R];
      if (E + b.width <= 0) {
        E += b.width;
        continue;
      }
      if (E >= n) break;
      const $ = l.getCellStyle(b, T), O = $.color ?? i.text, X = $.textAlign ?? "left", ee = l.formatCell(b, T);
      e.save(), e.beginPath(), e.rect(E + 1, z, b.width - 2, s), e.clip(), e.font = `${St}px system-ui, -apple-system, sans-serif`, e.fillStyle = O, e.textBaseline = "middle", x && (e.shadowBlur = 4, e.shadowColor = O), X === "right" ? (e.textAlign = "right", e.fillText(ee, E + b.width - 8, z + s / 2)) : (e.textAlign = "left", e.fillText(ee, E + 8, z + s / 2)), e.shadowBlur = 0, e.restore(), w === l.selectedRow && R === l.selectedCol && (e.strokeStyle = i.accent, e.lineWidth = 2, e.strokeRect(E + 1.5, z + 1.5, b.width - 3, s - 3)), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(E + b.width - 0.5, z), e.lineTo(E + b.width - 0.5, z + s), e.stroke(), E += b.width;
    }
  }
  if (e.restore(), c.length > 0) {
    const w = r - M;
    e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, w - 0.5), e.lineTo(n, w - 0.5), e.stroke();
    for (let T = 0; T < c.length; T++) {
      const z = c[T], E = w + T * s;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, E, n, s);
      let R = -y;
      for (let b = 0; b < d.length; b++) {
        const $ = d[b];
        if (R + $.width <= 0) {
          R += $.width;
          continue;
        }
        if (R >= n) break;
        const O = l.getCellStyle($, z), X = O.color ?? i.text, ee = O.textAlign ?? "left", J = l.formatCell($, z);
        e.save(), e.beginPath(), e.rect(R + 1, E, $.width - 2, s), e.clip(), e.font = `bold ${St}px system-ui, -apple-system, sans-serif`, e.fillStyle = X, e.textBaseline = "middle", ee === "right" ? (e.textAlign = "right", e.fillText(J, R + $.width - 8, E + s / 2)) : (e.textAlign = "left", e.fillText(J, R + 8, E + s / 2)), e.restore(), e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(R + $.width - 0.5, E), e.lineTo(R + $.width - 0.5, E + s), e.stroke(), R += $.width;
      }
      e.strokeStyle = i.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, E + s - 0.5), e.lineTo(n, E + s - 0.5), e.stroke();
    }
  }
  e.restore();
}
function ul(t, l) {
  if (t.startsWith("rgba") || t.startsWith("rgb"))
    return t.replace(/[\d.]+\)$/, `${l})`);
  const e = parseInt(t.slice(1, 3), 16), n = parseInt(t.slice(3, 5), 16), r = parseInt(t.slice(5, 7), 16);
  return `rgba(${e},${n},${r},${l})`;
}
function it(t, l) {
  let e = 0;
  for (let n = 0; n < t; n++) e += l[n].width;
  return e;
}
function dl(t, l, e) {
  return t >= l + e - 24 && t < l + e;
}
function kt(t, l, e) {
  const n = l + e;
  return t >= n - 6 && t <= n + 1;
}
function Tt(t, l, e, n, r, i, d, f, c) {
  const s = t + c;
  let u = -1, y = 0;
  for (let v = 0; v < e.length; v++) {
    if (s >= y && s < y + e[v].width) {
      u = v;
      break;
    }
    y += e[v].width;
  }
  if (l < oe) return { area: "header", colIdx: u, rowIdx: -1 };
  const x = f * r;
  if (x > 0 && l >= d - x) {
    const v = Math.floor((l - (d - x)) / r);
    return { area: "pinned", colIdx: u, rowIdx: v };
  }
  const M = l - oe + i, g = Math.floor(M / r);
  return g >= 0 && g < n ? { area: "body", colIdx: u, rowIdx: g } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const fl = ["value"], vl = ["disabled"], ml = ["disabled"], hl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, gl = `
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
`, pl = 28, wl = 600, xl = /* @__PURE__ */ Ne({
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
    const e = t, n = l, r = B(e.rowData ?? []), i = B(e.pinnedBottomRowData ?? []), d = B(""), f = B(null), c = rt({}), s = rt({}), u = rt(/* @__PURE__ */ new Set()), y = B(0), x = B(0), M = B(0), g = B(0), v = B(0), m = B(-1), h = B(null), w = B(null), T = B({ x: 0, y: oe }), z = B("");
    function E(o) {
      return o.colId ?? o.field ?? (o.headerName ? o.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const R = N(() => {
      const o = e.defaultColDef ?? {};
      return e.columnDefs.filter((a) => !u.has(E(a))).map((a) => {
        const p = E(a), S = { ...o, ...a };
        return { colId: p, colDef: S, width: s[p] ?? S.width ?? 100 };
      });
    }), b = N(() => {
      const o = x.value;
      if (!o) return R.value;
      const a = R.value.reduce((C, k) => C + k.width, 0);
      if (!a || a >= o) return R.value;
      const p = o / a;
      let S = 0;
      return R.value.map((C, k) => {
        const V = k === R.value.length - 1 ? o - S : Math.max(8, Math.round(C.width * p));
        return S += V, { ...C, width: V };
      });
    }), $ = N(() => {
      const o = b.value.reduce((a, p) => a + p.width, 0);
      return Math.max(0, o - x.value);
    }), O = N(() => {
      const o = i.value.length * e.rowHeight;
      return Math.max(0, M.value - oe - o);
    }), X = N(
      () => Math.max(0, G.value.length * e.rowHeight - O.value)
    ), ee = N(
      () => Math.max(1, Math.floor(O.value / e.rowHeight))
    ), J = N(
      () => G.value.length === 0 ? 0 : Math.min(G.value.length - 1, Math.floor(g.value / e.rowHeight))
    ), Le = N(
      () => Math.min(G.value.length - 1, J.value + ee.value - 1)
    );
    function K(o, a) {
      if (a.colDef.valueGetter) return a.colDef.valueGetter({ data: o, colDef: a.colDef });
      if (a.colDef.field) return o[a.colDef.field];
    }
    function de(o, a) {
      const p = K(a, o);
      return o.colDef.valueFormatter ? o.colDef.valueFormatter({ value: p, data: a, colDef: o.colDef }) ?? "" : o.colDef.cellRenderer ? (o.colDef.cellRenderer({ value: p, data: a, colDef: o.colDef }) ?? "").replace(/<[^>]+>/g, "") : p == null ? "" : String(p);
    }
    function pe(o, a) {
      return o.colDef.cellStyle ? typeof o.colDef.cellStyle == "function" ? o.colDef.cellStyle({ value: K(a, o), data: a, colDef: o.colDef }) ?? {} : o.colDef.cellStyle : {};
    }
    const G = N(() => {
      y.value;
      let o = r.value;
      const a = d.value.trim().toLowerCase();
      a && (o = o.filter(
        (p) => R.value.some(
          (S) => String(K(p, S) ?? "").toLowerCase().includes(a)
        )
      ));
      for (const [p, S] of Object.entries(c)) {
        if (!S) continue;
        const C = R.value.find((k) => k.colId === p);
        if (C)
          if (S.startsWith("__eq__")) {
            const k = S.slice(6).toLowerCase();
            o = o.filter((_) => String(K(_, C) ?? "").toLowerCase() === k);
          } else {
            const k = S.toLowerCase();
            o = o.filter((_) => String(K(_, C) ?? "").toLowerCase().includes(k));
          }
      }
      if (f.value) {
        const { colId: p, dir: S } = f.value, C = R.value.find((k) => k.colId === p);
        C && (o = [...o].sort((k, _) => {
          const V = K(k, C), le = K(_, C);
          let ne = 0;
          return C.colDef.comparator ? ne = C.colDef.comparator(V, le) : typeof V == "number" && typeof le == "number" ? ne = V - le : ne = String(V ?? "").localeCompare(String(le ?? ""), void 0, { numeric: !0 }), S === "asc" ? ne : -ne;
        }));
      }
      return o;
    });
    P(G, () => {
      g.value = 0, h.value = null;
    }), P($, () => {
      v.value = Math.min(v.value, $.value);
    }), P(X, () => {
      g.value = Math.min(g.value, X.value);
    });
    function Se(o) {
      const a = o * e.rowHeight, p = a + e.rowHeight;
      a < g.value ? g.value = a : p > g.value + O.value && (g.value = Math.min(X.value, p - O.value));
    }
    function Ce() {
      g.value = Math.max(0, g.value - O.value), ue();
    }
    function D() {
      g.value = Math.min(X.value, g.value + O.value), ue();
    }
    let Y = !1, U = "", Q = 0, I = 0, F = !1, A = !1, fe = 0, se = 0, we = 0, Ee = 0, L = !1;
    function W(o, a) {
      var p;
      Y = !0, U = o, Q = a, I = ((p = b.value.find((S) => S.colId === o)) == null ? void 0 : p.width) ?? 100, F = !1;
    }
    function Z(o) {
      if (A) {
        const k = fe - o.clientX, _ = se - o.clientY;
        (Math.abs(k) > 4 || Math.abs(_) > 4) && (L = !0), v.value = Math.max(0, Math.min($.value, we + k)), g.value = Math.max(0, Math.min(X.value, Ee + _)), ue();
        return;
      }
      if (!Y) return;
      const a = x.value, p = Math.max(30, I + (o.clientX - Q)), S = R.value.filter((k) => k.colId !== U).reduce((k, _) => k + _.width, 0), C = a - p;
      C > 10 && (s[U] = Math.max(10, Math.round(p * S / C))), ue();
    }
    function xe() {
      A && (L && (F = !0), A = !1), Y && (Y = !1, F = !0, n("column-resized"));
    }
    const ve = B(null), q = B(null), Ht = tt("cathodeResetTick", B(0));
    P(Ht, () => Be());
    let te = null, De = !1, lt, mt, ke, me, ce;
    function ht() {
      if (!(!q.value || !ve.value)) {
        ce = document.createElement("canvas");
        try {
          te = new H.WebGLRenderer({ canvas: q.value, antialias: !1, alpha: !0 });
        } catch {
          De = !0;
        }
        if (!De && !te.getContext() && (te.dispose(), te = null, De = !0), De) {
          ze();
          return;
        }
        te.setPixelRatio(1), te.setClearColor(0, 0), lt = new H.Scene(), mt = new H.OrthographicCamera(-1, 1, 1, -1, 0, 1), me = new H.CanvasTexture(ce), me.minFilter = H.LinearFilter, me.magFilter = H.LinearFilter, ke = new H.ShaderMaterial({
          uniforms: {
            uTex: { value: me },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new H.Color(0) }
          },
          vertexShader: hl,
          fragmentShader: gl,
          transparent: !0
        }), lt.add(new H.Mesh(new H.PlaneGeometry(2, 2), ke)), ze();
      }
    }
    function ze() {
      if (!ve.value || !te && !De) return;
      const o = ve.value.clientWidth, a = ve.value.clientHeight - (e.pagination ? pl : 0);
      if (!o || !a) return;
      const p = ce.width !== o || ce.height !== a;
      ce.width = o, ce.height = a, x.value = o, M.value = a, v.value = Math.max(0, Math.min($.value, v.value)), g.value = Math.max(0, Math.min(X.value, g.value)), te ? (p && me && (me.dispose(), me = new H.CanvasTexture(ce), me.minFilter = H.LinearFilter, me.magFilter = H.LinearFilter, ke && (ke.uniforms.uTex.value = me)), te.setPixelRatio(window.devicePixelRatio || 1), te.setSize(o, a)) : q.value && (q.value.width = o, q.value.height = a, q.value.style.width = o + "px", q.value.style.height = a + "px"), ue();
    }
    function ue() {
      var p, S, C, k, _, V, le, ne;
      if (!(ce != null && ce.width)) return;
      if (De) {
        if (!q.value) return;
        Ct(ce, {
          cols: b.value,
          rows: G.value,
          pinnedRows: i.value,
          rowHeight: e.rowHeight,
          scrollY: g.value,
          scrollX: v.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((p = f.value) == null ? void 0 : p.colId) ?? null,
          sortDir: ((S = f.value) == null ? void 0 : S.dir) ?? null,
          colFilters: c,
          hoveredRow: m.value,
          selectedRow: ((C = h.value) == null ? void 0 : C.row) ?? -1,
          selectedCol: ((k = h.value) == null ? void 0 : k.col) ?? -1,
          formatCell: de,
          getCellStyle: pe
        });
        const yt = q.value.getContext("2d");
        yt && yt.drawImage(ce, 0, 0);
        return;
      }
      if (!te || !ke || !me) return;
      const o = Ye[e.theme] ?? Ye.none, a = e.theme === "paper";
      ke.uniforms.uStrength.value = e.curvature / 45 * 0.55, ke.uniforms.uScanlines.value = e.scanlines && !a ? 1 : 0, ke.uniforms.uVignette.value = a ? 0 : 1, ke.uniforms.uBezel.value.set(o.bg), Ct(ce, {
        cols: b.value,
        rows: G.value,
        pinnedRows: i.value,
        rowHeight: e.rowHeight,
        scrollY: g.value,
        scrollX: v.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((_ = f.value) == null ? void 0 : _.colId) ?? null,
        sortDir: ((V = f.value) == null ? void 0 : V.dir) ?? null,
        colFilters: c,
        hoveredRow: m.value,
        selectedRow: ((le = h.value) == null ? void 0 : le.row) ?? -1,
        selectedCol: ((ne = h.value) == null ? void 0 : ne.col) ?? -1,
        formatCell: de,
        getCellStyle: pe
      }), me.needsUpdate = !0, te.render(lt, mt);
    }
    function nt(o) {
      if (!q.value) return [-1, -1];
      const a = q.value.getBoundingClientRect();
      return [o.clientX - a.left, o.clientY - a.top];
    }
    let ot = 0;
    function Pt(o) {
      w.value = null;
      const a = Date.now();
      if (o.deltaX !== 0) {
        ot = a, v.value = Math.max(0, Math.min($.value, v.value + o.deltaX)), ue();
        return;
      }
      if (o.shiftKey && o.deltaY !== 0) {
        ot = a, v.value = Math.max(0, Math.min($.value, v.value + o.deltaY)), ue();
        return;
      }
      a - ot < wl || (g.value = Math.max(0, Math.min(X.value, g.value + o.deltaY)), ue());
    }
    function $t(o) {
      if (Y) return;
      const [a, p] = nt(o);
      if (a < 0) {
        m.value = -1, ue();
        return;
      }
      const S = Tt(
        a,
        p,
        b.value,
        G.value.length,
        e.rowHeight,
        g.value,
        ce.height,
        i.value.length,
        v.value
      );
      if (m.value = S.area === "body" ? S.rowIdx : -1, S.area === "header" && S.colIdx >= 0) {
        const C = b.value[S.colIdx], k = it(S.colIdx, b.value), _ = a + v.value;
        q.value.style.cursor = C && kt(_, k, C.width) ? "col-resize" : "pointer";
      } else S.area === "body" ? q.value.style.cursor = "pointer" : q.value.style.cursor = "default";
      ue();
    }
    function Vt() {
      m.value = -1, ue();
    }
    function Ot(o) {
      const [a, p] = nt(o);
      if (a < 0) return;
      if (p >= oe) {
        A = !0, L = !1, fe = o.clientX, se = o.clientY, we = v.value, Ee = g.value;
        return;
      }
      const S = a + v.value;
      for (let C = 0; C < b.value.length; C++) {
        const k = b.value[C], _ = it(C, b.value);
        if (k.colDef.resizable !== !1 && kt(S, _, k.width)) {
          W(k.colId, o.clientX);
          return;
        }
      }
    }
    function Xt(o) {
      var C, k, _;
      if (F) {
        F = !1;
        return;
      }
      if (Y) return;
      const [a, p] = nt(o);
      if (a < 0) {
        w.value = null;
        return;
      }
      const S = Tt(
        a,
        p,
        b.value,
        G.value.length,
        e.rowHeight,
        g.value,
        ce.height,
        i.value.length,
        v.value
      );
      if (S.area === "header" && S.colIdx >= 0) {
        const V = b.value[S.colIdx], le = it(S.colIdx, b.value), ne = a + v.value;
        V.colDef.filter && dl(ne, le, V.width) ? (o.stopPropagation(), w.value === V.colId ? w.value = null : (w.value = V.colId, z.value = (C = c[V.colId]) != null && C.startsWith("__eq__") ? c[V.colId].slice(6) : c[V.colId] ?? "", T.value = { x: Math.max(0, le - v.value), y: oe })) : V.colDef.sortable !== !1 && (w.value = null, f.value = ((k = f.value) == null ? void 0 : k.colId) === V.colId ? f.value.dir === "asc" ? { colId: V.colId, dir: "desc" } : null : { colId: V.colId, dir: "asc" }, n("sort-changed"));
        return;
      }
      if (w.value = null, S.area === "body" && S.rowIdx >= 0 && S.colIdx >= 0) {
        const V = S.rowIdx;
        h.value = { row: V, col: S.colIdx }, (_ = q.value) == null || _.focus();
        const le = G.value[V], ne = b.value[S.colIdx];
        le && ne && (n("row-clicked", { data: le, event: o }), n("cell-selected", { data: le, row: V, col: S.colIdx, colId: ne.colId }));
      }
    }
    function gt(o) {
      var a, p;
      w.value && ((p = (a = o.target).closest) != null && p.call(a, ".cathode-filter-popup") || (w.value = null));
    }
    function Nt(o) {
      var C;
      if (!x.value) return;
      let a = 0;
      for (let k = 0; k < o; k++) a += b.value[k].width;
      const p = ((C = b.value[o]) == null ? void 0 : C.width) ?? 0, S = a - v.value;
      S < 0 ? v.value = Math.max(0, a) : S + p > x.value && (v.value = Math.min($.value, a + p - x.value));
    }
    function Gt(o) {
      var V;
      const a = b.value, p = a.length - 1, S = G.value.length - 1;
      if (!h.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(o.key) && (o.preventDefault(), h.value = { row: J.value, col: 0 });
        return;
      }
      let { row: C, col: k } = h.value;
      const _ = (le, ne) => {
        C = Math.max(0, Math.min(S, le)), k = Math.max(0, Math.min(p, ne)), h.value = { row: C, col: k }, Se(C), Nt(k);
      };
      switch (o.key) {
        case "ArrowDown":
          o.preventDefault(), _(C + 1, k);
          break;
        case "ArrowUp":
          o.preventDefault(), _(C - 1, k);
          break;
        case "ArrowRight":
          o.preventDefault(), k < p ? _(C, k + 1) : _(C + 1, 0);
          break;
        case "ArrowLeft":
          o.preventDefault(), k > 0 ? _(C, k - 1) : _(C - 1, p);
          break;
        case "Tab":
          o.preventDefault(), o.shiftKey ? k > 0 ? _(C, k - 1) : _(C - 1, p) : k < p ? _(C, k + 1) : _(C + 1, 0);
          break;
        case "Enter":
          o.preventDefault(), o.shiftKey ? _(C - 1, k) : _(C + 1, k);
          break;
        case "Home":
          o.preventDefault(), o.ctrlKey || o.metaKey ? _(0, 0) : _(C, 0);
          break;
        case "End":
          o.preventDefault(), o.ctrlKey || o.metaKey ? _(S, p) : _(C, p);
          break;
        case "PageDown":
          o.preventDefault(), _(Math.min(S, C + ee.value), k);
          break;
        case "PageUp":
          o.preventDefault(), _(Math.max(0, C - ee.value), k);
          break;
        case "Escape":
          h.value = null;
          break;
        case "c":
        case "C":
          if (o.ctrlKey || o.metaKey) {
            o.preventDefault();
            const le = G.value[C], ne = a[k];
            le && ne && ((V = navigator.clipboard) == null || V.writeText(de(ne, le)).catch(() => {
            }));
          }
          break;
      }
    }
    function Ut(o) {
      const a = o.target.value;
      z.value = a, a ? c[w.value] = a : delete c[w.value], n("filter-changed");
    }
    function pt() {
      w.value && delete c[w.value], z.value = "", w.value = null, n("filter-changed");
    }
    const Kt = {
      setGridOption(o, a) {
        o === "rowData" ? r.value = a : o === "pinnedBottomRowData" ? i.value = a : o === "quickFilterText" && (d.value = a);
      },
      getColumnState() {
        return e.columnDefs.map((o) => {
          var p, S;
          const a = E(o);
          return {
            colId: a,
            hide: u.has(a),
            sort: ((p = f.value) == null ? void 0 : p.colId) === a ? f.value.dir : null,
            sortIndex: ((S = f.value) == null ? void 0 : S.colId) === a ? 0 : null,
            width: s[a] ?? o.width
          };
        });
      },
      applyColumnState({ state: o }) {
        for (const a of o)
          a.hide === !0 && u.add(a.colId), a.hide === !1 && u.delete(a.colId), a.sort && (f.value = { colId: a.colId, dir: a.sort }), a.width && (s[a.colId] = a.width);
      },
      setFilterModel(o) {
        for (const a of Object.keys(c)) delete c[a];
        if (o)
          for (const [a, p] of Object.entries(o))
            (p == null ? void 0 : p.type) === "equals" ? c[a] = `__eq__${p.filter}` : p != null && p.filter && (c[a] = p.filter);
      },
      getFilterModel() {
        const o = {};
        for (const [a, p] of Object.entries(c))
          p && (o[a] = p.startsWith("__eq__") ? { type: "equals", filter: p.slice(6) } : { type: "contains", filter: p });
        return o;
      },
      async setColumnFilterModel(o, a) {
        a ? a.type === "equals" ? c[o] = `__eq__${a.filter}` : c[o] = a.filter ?? "" : delete c[o];
      },
      onFilterChanged() {
      },
      refreshCells() {
        y.value++;
      },
      exportDataAsCsv({ fileName: o = "export.csv" } = {}) {
        const a = R.value, p = a.map((_) => _.colDef.headerName ?? _.colId).join(","), S = G.value.map(
          (_) => a.map((V) => `"${String(de(V, _)).replace(/"/g, '""')}"`).join(",")
        ), C = new Blob([[p, ...S].join(`
`)], { type: "text/csv" }), k = URL.createObjectURL(C);
        Object.assign(document.createElement("a"), { href: k, download: o }).click(), URL.revokeObjectURL(k);
      },
      resize() {
        ze();
      },
      resetColumnState() {
        u.clear();
        for (const a of e.columnDefs)
          a.hide && u.add(E(a));
        const o = e.columnDefs.find((a) => a.sort);
        f.value = o ? { colId: E(o), dir: o.sort } : null;
        for (const a of Object.keys(s)) delete s[a];
        for (const a of Object.keys(c)) delete c[a];
        d.value = "", g.value = 0, h.value = null, w.value = null;
      }
    };
    P(
      [G, () => i.value, b, g, m, h],
      () => Ie(ue)
    ), P(() => e.theme, () => ue()), P(() => e.curvature, () => Ie(ze)), P(() => e.scanlines, () => ue()), P(() => e.glow, () => ue()), P(h, (o) => {
      if (!o) return;
      const a = G.value[o.row], p = b.value[o.col];
      a && p && n("cell-selected", { data: a, row: o.row, col: o.col, colId: p.colId });
    });
    let Ve = null, Oe = null, at = 0;
    function Be() {
      cancelAnimationFrame(at), at = requestAnimationFrame(ze);
    }
    function wt(o) {
      o.preventDefault();
    }
    function xt() {
      te == null || te.dispose(), te = null, De = !1, ht();
    }
    Pe(() => {
      for (const o of e.columnDefs)
        o.hide && u.add(E(o)), o.sort && !f.value && (f.value = { colId: E(o), dir: o.sort });
      r.value = e.rowData ?? [], i.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", gt), document.addEventListener("mousemove", Z), document.addEventListener("mouseup", xe), Ie(() => {
        var o;
        ht(), q.value && (q.value.addEventListener("webglcontextlost", wt), q.value.addEventListener("webglcontextrestored", xt)), ve.value && (Ve = new ResizeObserver(() => ze()), Ve.observe(ve.value), Oe = new IntersectionObserver((a) => {
          a.some((p) => p.isIntersecting) && Be();
        }), Oe.observe(ve.value)), window.addEventListener("resize", Be), (o = window.visualViewport) == null || o.addEventListener("resize", Be), n("grid-ready", { api: Kt });
      });
    }), Ge(() => {
      var o, a, p;
      document.removeEventListener("click", gt, !0), document.removeEventListener("mousemove", Z), document.removeEventListener("mouseup", xe), (o = q.value) == null || o.removeEventListener("webglcontextlost", wt), (a = q.value) == null || a.removeEventListener("webglcontextrestored", xt), Ve == null || Ve.disconnect(), Oe == null || Oe.disconnect(), window.removeEventListener("resize", Be), (p = window.visualViewport) == null || p.removeEventListener("resize", Be), cancelAnimationFrame(at), te == null || te.dispose();
    });
    const he = N(() => Ye[e.theme] ?? Ye.none), qt = N(() => ({
      position: "absolute",
      left: `${T.value.x}px`,
      top: `${T.value.y}px`,
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
    })), jt = N(() => ({
      background: he.value.bg,
      border: `1px solid ${he.value.border}`,
      color: he.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Zt = N(() => ({
      background: he.value.headerBg,
      borderTop: `1px solid ${he.value.border}`,
      color: he.value.text
    })), Jt = N(() => ({
      background: he.value.bg
    })), bt = N(() => he.value.accent);
    return (o, a) => {
      var p, S;
      return re(), ie("div", {
        ref_key: "wrapEl",
        ref: ve,
        class: "cathode-wrap",
        style: be(Jt.value)
      }, [
        j("canvas", {
          ref_key: "canvasEl",
          ref: q,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Re(Pt, ["prevent"]),
          onMousemove: $t,
          onMouseleave: Vt,
          onMousedown: Ot,
          onClick: Xt,
          onKeydown: Gt
        }, null, 544),
        w.value ? (re(), ie("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: be(qt.value),
          onClick: a[0] || (a[0] = Re(() => {
          }, ["stop"]))
        }, [
          j("input", {
            style: be(jt.value),
            value: z.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Ut,
            onKeydown: Qt(pt, ["escape"])
          }, null, 44, fl),
          z.value ? (re(), ie("button", {
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
            onClick: pt
          }, "✕", 4)) : Me("", !0)
        ], 4)) : Me("", !0),
        t.pagination ? (re(), ie("div", {
          key: 1,
          class: "cathode-pagination",
          style: be(Zt.value)
        }, [
          j("button", {
            disabled: g.value <= 0,
            onClick: a[1] || (a[1] = (C) => Ce())
          }, "◀", 8, vl),
          j("span", null, ye((J.value + 1).toLocaleString()) + "–" + ye(Math.min(G.value.length, Le.value + 1).toLocaleString()) + " / " + ye(G.value.length.toLocaleString()), 1),
          j("button", {
            disabled: g.value >= X.value,
            onClick: a[2] || (a[2] = (C) => D())
          }, "▶", 8, ml),
          j("span", {
            class: "cathode-page-info",
            style: be({ color: bt.value })
          }, ye(G.value.length.toLocaleString()) + " rows ", 5),
          h.value ? (re(), ie("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: be({ color: bt.value })
          }, ye(((p = b.value[h.value.col]) == null ? void 0 : p.colDef.headerName) ?? ((S = b.value[h.value.col]) == null ? void 0 : S.colId)) + " : " + ye(de(b.value[h.value.col], G.value[h.value.row])), 5)) : Me("", !0)
        ], 4)) : Me("", !0)
      ], 4);
    };
  }
}), Ue = (t, l) => {
  const e = t.__vccOpts || t;
  for (const [n, r] of l)
    e[n] = r;
  return e;
}, gn = /* @__PURE__ */ Ue(xl, [["__scopeId", "data-v-07901c91"]]), je = {
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
function bl(t, l) {
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
const yl = 12, ge = 18, qe = 10, Ae = 6, ft = `${yl}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
function Ml(t, l, e) {
  if (e <= 0 || !l) return [l];
  const n = [];
  for (const r of l.split(`
`)) {
    if (!r) {
      n.push("");
      continue;
    }
    if (t.measureText(r).width <= e) {
      n.push(r);
      continue;
    }
    const i = r.split(/(\s+)/);
    let d = "";
    for (const f of i) {
      const c = d + f;
      if (t.measureText(c).width <= e)
        d = c;
      else if (d && (n.push(d.replace(/\s+$/, "")), d = ""), t.measureText(f).width > e) {
        let s = "";
        for (const u of f)
          t.measureText(s + u).width > e ? (s && n.push(s), s = u) : s += u;
        d = s;
      } else
        d = f.replace(/^\s+/, "");
    }
    d && n.push(d.replace(/\s+$/, ""));
  }
  return n.length ? n : [""];
}
function _t(t) {
  if (typeof t == "number") {
    const l = new Date(t), e = String(l.getHours()).padStart(2, "0"), n = String(l.getMinutes()).padStart(2, "0"), r = String(l.getSeconds()).padStart(2, "0");
    return `${e}:${n}:${r}`;
  }
  return t;
}
function Sl(t, l) {
  return Math.ceil(t.measureText(l).width) + 12;
}
function Cl(t) {
  const { entries: l, ctx: e, textMaxWidth: n, showTimestamps: r, wordWrap: i } = t, d = t.formatTs ?? _t;
  e.font = ft;
  const f = [];
  for (let c = 0; c < l.length; c++) {
    const s = l[c], u = s.level ?? "info", y = r && s.ts != null ? d(s.ts) : "", x = i ? Ml(e, s.text, n) : s.text.split(`
`);
    for (let M = 0; M < x.length; M++)
      f.push({
        entryIdx: c,
        text: x[M],
        level: u,
        timestamp: M === 0 ? y : "",
        isFirstFrag: M === 0
      });
  }
  return f;
}
function It(t, l) {
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, r = t.height, i = je[l.theme] ?? je.none;
  e.clearRect(0, 0, n, r), e.fillStyle = i.bg, e.fillRect(0, 0, n, r), e.save(), e.beginPath(), e.rect(0, 0, n, r), e.clip(), e.font = ft, e.textBaseline = "middle";
  const d = l.visualLines, f = qe, c = l.showTimestamps ? qe + l.timestampWidth : qe, s = Math.max(0, Math.floor((l.scrollY - Ae) / ge)), u = Math.min(d.length, Math.ceil((l.scrollY + r - Ae) / ge) + 1);
  for (let y = s; y < u; y++) {
    const x = d[y], M = Ae + y * ge - l.scrollY + ge / 2;
    if (x.entryIdx % 2 === 1 && x.isFirstFrag) {
      e.fillStyle = i.rowAlt;
      let v = 1;
      for (; y + v < u && d[y + v].entryIdx === x.entryIdx; ) v++;
      e.fillRect(0, M - ge / 2, n, ge * v);
    }
    y === l.hoveredLine && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, M - ge / 2, n, ge)), l.showTimestamps && x.timestamp && (e.fillStyle = i.timestamp, e.textAlign = "left", l.glow && (e.shadowBlur = 3, e.shadowColor = i.timestamp), e.fillText(x.timestamp, f, M), e.shadowBlur = 0);
    const g = bl(i, x.level);
    e.fillStyle = g, e.textAlign = "left", l.glow && (e.shadowBlur = 4, e.shadowColor = g), e.fillText(x.text, c, M), e.shadowBlur = 0;
  }
  e.restore();
}
function kl(t, l, e) {
  if (t < 0) return -1;
  const n = Math.floor((t + l - Ae) / ge);
  return n < 0 || n >= e ? -1 : n;
}
function Tl(t) {
  return Ae * 2 + t * ge;
}
const Il = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Ll = `
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
`, El = /* @__PURE__ */ Ne({
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
    const e = t, n = B(null), r = B(null), i = B(0), d = B(0), f = B(0), c = B(-1), s = B(!0), u = N(() => {
      const L = e.entries ?? [];
      return e.maxLines > 0 && L.length > e.maxLines ? L.slice(L.length - e.maxLines) : L;
    }), y = N(() => {
      if (!e.showTimestamps) return "";
      const L = e.formatTs ?? _t;
      let W = "00:00:00";
      for (const Z of u.value) {
        if (Z.ts == null) continue;
        const xe = L(Z.ts);
        xe.length > W.length && (W = xe);
      }
      return W;
    }), x = B(0), M = B([]);
    function g() {
      if (!b) return;
      const L = b.getContext("2d");
      if (!L) return;
      L.font = ft;
      const W = e.showTimestamps ? Sl(L, y.value) : 0;
      x.value = W;
      const Z = Math.max(
        1,
        i.value - qe * 2 - W
      );
      M.value = Cl({
        entries: u.value,
        ctx: L,
        textMaxWidth: Z,
        showTimestamps: e.showTimestamps,
        formatTs: e.formatTs,
        wordWrap: e.wordWrap
      });
    }
    const v = N(() => Tl(M.value.length)), m = N(() => Math.max(0, v.value - d.value));
    P(m, () => {
      s.value ? f.value = m.value : f.value = Math.min(f.value, m.value);
    }), P(
      [u, i, () => e.showTimestamps, () => e.wordWrap, y],
      () => {
        g(), Ie(X);
      },
      { deep: !1 }
    );
    let h = null, w = !1, T, z, E, R, b;
    function $() {
      if (!(!r.value || !n.value)) {
        b = document.createElement("canvas");
        try {
          h = new H.WebGLRenderer({ canvas: r.value, antialias: !1, alpha: !0 });
        } catch {
          w = !0;
        }
        if (!w && !h.getContext() && (h.dispose(), h = null, w = !0), w) {
          O();
          return;
        }
        h.setPixelRatio(1), h.setClearColor(0, 0), T = new H.Scene(), z = new H.OrthographicCamera(-1, 1, 1, -1, 0, 1), R = new H.CanvasTexture(b), R.minFilter = H.LinearFilter, R.magFilter = H.LinearFilter, E = new H.ShaderMaterial({
          uniforms: {
            uTex: { value: R },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Il,
          fragmentShader: Ll,
          transparent: !0
        }), T.add(new H.Mesh(new H.PlaneGeometry(2, 2), E)), O();
      }
    }
    function O() {
      if (!n.value || !h && !w) return;
      const L = n.value.clientWidth, W = n.value.clientHeight;
      if (!L || !W) return;
      const Z = b.width !== L || b.height !== W;
      Z && (b.width = L, b.height = W, i.value = L, d.value = W, g(), h ? (Z && R && (R.dispose(), R = new H.CanvasTexture(b), R.minFilter = H.LinearFilter, R.magFilter = H.LinearFilter, E && (E.uniforms.uTex.value = R)), h.setPixelRatio(window.devicePixelRatio || 1), h.setSize(L, W)) : r.value && (r.value.width = L, r.value.height = W, r.value.style.width = L + "px", r.value.style.height = W + "px"), s.value && (f.value = Math.max(0, v.value - d.value)), X());
    }
    function X() {
      if (!(b != null && b.width)) return;
      if (w) {
        if (!r.value) return;
        It(b, {
          visualLines: M.value,
          scrollY: f.value,
          theme: e.theme,
          glow: !1,
          showTimestamps: e.showTimestamps,
          timestampWidth: x.value,
          hoveredLine: c.value
        });
        const W = r.value.getContext("2d");
        W && W.drawImage(b, 0, 0);
        return;
      }
      if (!h || !E || !R) return;
      const L = e.theme === "paper";
      E.uniforms.uStrength.value = e.curvature / 45 * 0.55, E.uniforms.uScanlines.value = e.scanlines && !L ? 1 : 0, E.uniforms.uVignette.value = L ? 0 : 1, It(b, {
        visualLines: M.value,
        scrollY: f.value,
        theme: e.theme,
        glow: e.glow,
        showTimestamps: e.showTimestamps,
        timestampWidth: x.value,
        hoveredLine: c.value
      }), R.needsUpdate = !0, h.render(T, z);
    }
    P(() => e.theme, () => X()), P(() => e.curvature, () => X()), P(() => e.scanlines, () => X()), P(() => e.glow, () => X()), P(f, () => X()), P(c, () => X());
    function ee(L) {
      if (!r.value) return [-1, -1];
      const W = r.value.getBoundingClientRect();
      return [L.clientX - W.left, L.clientY - W.top];
    }
    function J(L) {
      f.value = Math.max(0, Math.min(m.value, L)), s.value = f.value >= m.value - 4;
    }
    function Le(L) {
      J(f.value + L.deltaY);
    }
    let K = !1, de = 0, pe = 0;
    function G(L) {
      K = !0, de = L.clientY, pe = f.value;
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
    function D(L) {
      const [, W] = ee(L);
      if (W < 0) {
        c.value = -1;
        return;
      }
      c.value = kl(W, f.value, M.value.length);
    }
    function Y() {
      c.value = -1;
    }
    l({
      /** Force-scroll to the latest entry. Resumes autoscroll. */
      scrollToBottom() {
        s.value = !0, f.value = m.value;
      },
      /** Programmatic scroll to a given line index (visual lines, not entry idx). */
      scrollToLine(L) {
        J(Ae + L * ge);
      }
    });
    let U = null, Q = null, I = 0;
    const F = tt("cathodeResetTick", B(0));
    P(F, () => A());
    function A() {
      cancelAnimationFrame(I), I = requestAnimationFrame(O);
    }
    function fe(L) {
      L.preventDefault();
    }
    function se() {
      h == null || h.dispose(), h = null, w = !1, $();
    }
    Pe(() => {
      document.addEventListener("mousemove", Se), document.addEventListener("mouseup", Ce), Ie(() => {
        var L;
        $(), r.value && (r.value.addEventListener("webglcontextlost", fe), r.value.addEventListener("webglcontextrestored", se)), n.value && (U = new ResizeObserver(() => O()), U.observe(n.value), Q = new IntersectionObserver((W) => {
          W.some((Z) => Z.isIntersecting) && A();
        }), Q.observe(n.value)), window.addEventListener("resize", A), (L = window.visualViewport) == null || L.addEventListener("resize", A), f.value = m.value;
      });
    }), Ge(() => {
      var L, W, Z;
      document.removeEventListener("mousemove", Se), document.removeEventListener("mouseup", Ce), (L = r.value) == null || L.removeEventListener("webglcontextlost", fe), (W = r.value) == null || W.removeEventListener("webglcontextrestored", se), U == null || U.disconnect(), Q == null || Q.disconnect(), window.removeEventListener("resize", A), (Z = window.visualViewport) == null || Z.removeEventListener("resize", A), cancelAnimationFrame(I), h == null || h.dispose();
    });
    const we = N(() => je[e.theme] ?? je.none), Ee = N(() => ({
      background: we.value.bg
    }));
    return (L, W) => (re(), ie("div", {
      ref_key: "wrapEl",
      ref: n,
      class: "cathode-log-wrap",
      style: be(Ee.value)
    }, [
      j("canvas", {
        ref_key: "canvasEl",
        ref: r,
        class: "cathode-log-canvas",
        onWheel: Re(Le, ["prevent"]),
        onMousemove: D,
        onMouseleave: Y,
        onMousedown: G
      }, null, 544)
    ], 4));
  }
}), pn = /* @__PURE__ */ Ue(El, [["__scopeId", "data-v-d2d092f3"]]), Ze = {
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
}, Rl = 0.18, Xe = 8, zt = 22, $e = 8, He = 56, Je = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", st = 4, Dl = 1, Fl = 1;
function _l(t, l, e, n = 0) {
  const r = Math.max(0, l - $e - He), i = Math.max(1, Math.floor(r / e)), d = Math.min(i, t);
  return { firstIdx: Math.max(0, t - d - Math.floor(n / e)), count: d, slotW: e };
}
function zl(t, l, e) {
  if (!t.length || e <= 0)
    return { min: 0, max: 1, maxVol: 1 };
  let n = 1 / 0, r = -1 / 0, i = 0;
  const d = Math.min(t.length, l + e);
  for (let c = l; c < d; c++) {
    const s = t[c];
    s && (s.low < n && (n = s.low), s.high > r && (r = s.high), s.volume > i && (i = s.volume));
  }
  if (!isFinite(n) || !isFinite(r) || n === r) {
    const c = isFinite(n) ? n : 0;
    return { min: c - 1, max: c + 1, maxVol: Math.max(1, i) };
  }
  const f = (r - n) * 0.04;
  return { min: n - f, max: r + f, maxVol: Math.max(1, i) };
}
function Bl(t, l) {
  const e = Math.max(1, t - Xe - zt - st), n = Math.max(0, Math.round(e * l)), r = e - n;
  return {
    priceY0: Xe,
    priceY1: Xe + r,
    volumeY0: Xe + r + st,
    volumeY1: Xe + r + st + n
  };
}
function Te(t, l, e, n) {
  const r = l.max - l.min;
  return r <= 0 ? (e + n) / 2 : e + (1 - (t - l.min) / r) * (n - e);
}
function Fe(t, l, e) {
  return $e + (t - l + 0.5) * e;
}
function Bt(t) {
  return t >= 1e4 ? t.toFixed(0) : t >= 100 ? t.toFixed(1) : t >= 1 ? t.toFixed(2) : t >= 0.01 ? t.toFixed(4) : t.toFixed(6);
}
function Wt(t) {
  const l = new Date(t), e = String(l.getMonth() + 1).padStart(2, "0"), n = String(l.getDate()).padStart(2, "0"), r = String(l.getHours()).padStart(2, "0"), i = String(l.getMinutes()).padStart(2, "0");
  return `${e}-${n} ${r}:${i}`;
}
function Wl(t, l) {
  if (t <= 0 || !isFinite(t)) return 1;
  const e = t / Math.max(1, l), n = Math.pow(10, Math.floor(Math.log10(e))), r = e / n;
  let i;
  return r < 1.5 ? i = 1 : r < 3 ? i = 2 : r < 7 ? i = 5 : i = 10, i * n;
}
function Lt(t, l) {
  var y, x;
  const e = t.getContext("2d");
  if (!e) return;
  const n = t.width, r = t.height, i = Ze[l.theme] ?? Ze.none;
  if (e.clearRect(0, 0, n, r), e.fillStyle = i.bg, e.fillRect(0, 0, n, r), !l.candles.length) return;
  e.save(), e.beginPath(), e.rect(0, 0, n, r), e.clip();
  const d = _l(l.candles.length, n, l.slotW, l.scrollX), f = zl(l.candles, d.firstIdx, d.count), c = Bl(r, l.showVolume ? l.volumeFraction : 0), s = Math.max(Dl, Math.floor(l.slotW * 0.7)), u = Math.min(l.candles.length, d.firstIdx + d.count);
  for (let M = d.firstIdx; M < u; M++) {
    const g = l.candles[M];
    if (!g) continue;
    const v = Fe(M, d.firstIdx, l.slotW), m = Te(g.open, f, c.priceY0, c.priceY1), h = Te(g.close, f, c.priceY0, c.priceY1), w = Te(g.high, f, c.priceY0, c.priceY1), T = Te(g.low, f, c.priceY0, c.priceY1), z = g.close >= g.open, E = z ? i.wickBull : i.wickBear, R = z ? i.candleBull : i.candleBear;
    l.glow && (e.shadowBlur = 4, e.shadowColor = R), e.strokeStyle = E, e.lineWidth = Fl, e.beginPath(), e.moveTo(Math.round(v) + 0.5, w), e.lineTo(Math.round(v) + 0.5, T), e.stroke(), e.fillStyle = R;
    const b = Math.min(m, h), $ = Math.max(1, Math.abs(h - m));
    if (e.fillRect(
      Math.round(v - s / 2),
      Math.round(b),
      s,
      Math.round($)
    ), e.shadowBlur = 0, l.showVolume && f.maxVol > 0) {
      const O = Math.round(g.volume / f.maxVol * (c.volumeY1 - c.volumeY0));
      O > 0 && (e.fillStyle = z ? i.volumeBull : i.volumeBear, e.fillRect(
        Math.round(v - s / 2),
        c.volumeY1 - O,
        s,
        O
      ));
    }
  }
  if ((y = l.overlays) != null && y.length)
    for (const M of l.overlays) Yl(e, M, d, f, c, l.slotW);
  (x = l.markers) != null && x.length && Pl(e, i, l.markers, l.candles, d, f, c, l.slotW), $l(e, i, f, c, n), Vl(e, i, l.candles, d, l.slotW, r), l.hover && Ol(e, i, l.candles, d, f, c, l.slotW, l.hover, n), e.restore();
}
function Yl(t, l, e, n, r, i) {
  var f;
  const d = e.firstIdx + e.count;
  if (t.save(), t.beginPath(), t.rect(
    $e,
    r.priceY0,
    /* width: */
    999999,
    r.priceY1 - r.priceY0
  ), t.clip(), l.kind === "line")
    Ke(t, l.data, e.firstIdx, d, i, n, r, l.color, l.lineWidth ?? 1, l.dashed === !0);
  else {
    const c = Hl(l.color, l.fillAlpha ?? 0.08);
    Al(t, l.upper, l.lower, e.firstIdx, d, i, n, r, c), Ke(t, l.upper, e.firstIdx, d, i, n, r, l.color, 1, !1), Ke(t, l.lower, e.firstIdx, d, i, n, r, l.color, 1, !1), (f = l.middle) != null && f.length && Ke(t, l.middle, e.firstIdx, d, i, n, r, l.color, 1, l.middleDashed !== !1);
  }
  t.restore();
}
function Ke(t, l, e, n, r, i, d, f, c, s) {
  if (!l || !l.length) return;
  t.strokeStyle = f, t.lineWidth = c, t.setLineDash(s ? [4, 3] : []), t.beginPath();
  let u = !1;
  for (let y = e; y < n; y++) {
    const x = l[y];
    if (typeof x != "number" || !isFinite(x)) {
      u && (t.stroke(), t.beginPath(), u = !1);
      continue;
    }
    const M = Fe(y, e, r), g = Te(x, i, d.priceY0, d.priceY1);
    u ? t.lineTo(M, g) : (t.moveTo(M, g), u = !0);
  }
  u && t.stroke(), t.setLineDash([]);
}
function Al(t, l, e, n, r, i, d, f, c) {
  if (!(l != null && l.length) || !(e != null && e.length)) return;
  t.fillStyle = c;
  let s = !1, u = -1;
  for (let y = n; y <= r; y++) {
    const x = l[y], M = e[y], g = y < r && typeof x == "number" && typeof M == "number" && isFinite(x) && isFinite(M);
    if (g && !s && (u = y, s = !0), !g && s || y === r && s) {
      const v = g ? y + 1 : y;
      t.beginPath();
      for (let m = u; m < v; m++) {
        const h = Fe(m, n, i), w = Te(l[m], d, f.priceY0, f.priceY1);
        m === u ? t.moveTo(h, w) : t.lineTo(h, w);
      }
      for (let m = v - 1; m >= u; m--) {
        const h = Fe(m, n, i), w = Te(e[m], d, f.priceY0, f.priceY1);
        t.lineTo(h, w);
      }
      t.closePath(), t.fill(), s = !1;
    }
  }
}
function Hl(t, l) {
  const e = Math.max(0, Math.min(1, l));
  if (t.startsWith("#") && t.length === 7) {
    const n = parseInt(t.slice(1, 3), 16), r = parseInt(t.slice(3, 5), 16), i = parseInt(t.slice(5, 7), 16);
    return `rgba(${n},${r},${i},${e})`;
  }
  return t.startsWith("rgba") ? t.replace(/[\d.]+\)$/, `${e})`) : t.startsWith("rgb(") ? t.replace(/^rgb\(/, "rgba(").replace(/\)$/, `,${e})`) : t;
}
function Pl(t, l, e, n, r, i, d, f) {
  if (!n.length) return;
  const c = n.length > 1 ? n[1].start - n[0].start : 6e4, s = Math.max(1, c * 0.5), u = Math.min(n.length, r.firstIdx + r.count), y = (M) => {
    let g = 0, v = n.length - 1;
    for (; g <= v; ) {
      const m = g + v >> 1, h = n[m].start - M;
      if (Math.abs(h) <= s) return m;
      h < 0 ? g = m + 1 : v = m - 1;
    }
    return -1;
  }, x = 7;
  for (const M of e) {
    const g = y(M.timestamp);
    if (g < 0 || g < r.firstIdx || g >= u) continue;
    const v = Fe(g, r.firstIdx, f), m = Te(M.price, i, d.priceY0, d.priceY1);
    if (m < d.priceY0 || m > d.priceY1) continue;
    const h = M.color ?? (M.kind === "entry" ? l.markerEntry : l.markerExit);
    t.fillStyle = h, t.strokeStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.lineWidth = 1.5, t.beginPath(), M.kind === "entry" ? (t.moveTo(v, m - x), t.lineTo(v - x, m + x - 1), t.lineTo(v + x, m + x - 1)) : (t.moveTo(v, m + x), t.lineTo(v - x, m - x + 1), t.lineTo(v + x, m - x + 1)), t.closePath(), t.fill(), t.stroke();
  }
}
function $l(t, l, e, n, r) {
  const i = e.max - e.min;
  if (i <= 0) return;
  const d = Wl(i, 6), f = Math.ceil(e.min / d) * d;
  t.font = Je, t.fillStyle = l.text, t.strokeStyle = l.gridline, t.textBaseline = "middle", t.textAlign = "left", t.lineWidth = 1, t.globalAlpha = 0.7;
  for (let c = f; c <= e.max; c += d) {
    const s = Te(c, e, n.priceY0, n.priceY1);
    s < n.priceY0 || s > n.priceY1 || (t.beginPath(), t.moveTo($e, Math.round(s) + 0.5), t.lineTo(r - He, Math.round(s) + 0.5), t.stroke(), t.fillText(Bt(c), r - He + 4, s));
  }
  t.globalAlpha = 1;
}
function Vl(t, l, e, n, r, i) {
  if (n.count <= 0 || !e.length) return;
  const f = Math.max(1, Math.floor(n.count / 6));
  t.font = Je, t.fillStyle = l.text, t.textBaseline = "top", t.textAlign = "center", t.globalAlpha = 0.7;
  const c = Math.min(e.length, n.firstIdx + n.count);
  for (let s = n.firstIdx; s < c; s += f) {
    const u = e[s];
    if (!u) continue;
    const y = Fe(s, n.firstIdx, r);
    t.fillText(Wt(u.start), y, i - zt + 4);
  }
  t.globalAlpha = 1;
}
function Ol(t, l, e, n, r, i, d, f, c) {
  const s = Math.floor((f.x - $e) / d), u = Math.max(0, Math.min(e.length - 1, n.firstIdx + s)), y = e[u];
  if (!y) return;
  const x = Fe(u, n.firstIdx, d);
  t.save(), t.strokeStyle = l.accent, t.lineWidth = 1, t.setLineDash([3, 3]), t.globalAlpha = 0.6, t.beginPath(), t.moveTo(Math.round(x) + 0.5, i.priceY0), t.lineTo(Math.round(x) + 0.5, i.volumeY1 || i.priceY1), t.stroke();
  const M = Math.max(i.priceY0, Math.min(i.priceY1, f.y));
  t.beginPath(), t.moveTo($e, Math.round(M) + 0.5), t.lineTo(c - He, Math.round(M) + 0.5), t.stroke(), t.setLineDash([]), t.globalAlpha = 1;
  const g = r.max - r.min;
  if (g > 0) {
    const h = r.max - (M - i.priceY0) / (i.priceY1 - i.priceY0) * g, w = Bt(h);
    t.font = Je, t.textBaseline = "middle", t.textAlign = "left";
    const T = t.measureText(w).width, z = 4, E = 2;
    t.fillStyle = l.accent, t.fillRect(c - He + 2, M - 7 - E, T + z * 2, 14 + E * 2), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(w, c - He + 2 + z, M);
  }
  t.font = Je, t.textBaseline = "top", t.textAlign = "center";
  const v = Wt(y.start), m = t.measureText(v).width;
  t.fillStyle = l.accent, t.fillRect(x - m / 2 - 4, i.volumeY1 + 2, m + 8, 14), t.fillStyle = l.bg.startsWith("rgba(0,0,0,0)") ? "#0d1520" : l.bg, t.fillText(v, x, i.volumeY1 + 4), t.restore();
}
const Et = 0.25, Rt = 6, Xl = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, Nl = `
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
`, Gl = /* @__PURE__ */ Ne({
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
    markers: {}
  },
  setup(t) {
    const l = t, e = B(null), n = B(null), r = B(0), i = B(0), d = B(0), f = B(1), c = B(null), s = N(() => Math.max(1, l.slotW * f.value));
    let u = null, y = !1, x, M, g, v, m;
    function h() {
      if (!(!n.value || !e.value)) {
        m = document.createElement("canvas");
        try {
          u = new H.WebGLRenderer({ canvas: n.value, antialias: !1, alpha: !0 });
        } catch {
          y = !0;
        }
        if (!y && !u.getContext() && (u.dispose(), u = null, y = !0), y) {
          w();
          return;
        }
        u.setPixelRatio(1), u.setClearColor(0, 0), x = new H.Scene(), M = new H.OrthographicCamera(-1, 1, 1, -1, 0, 1), v = new H.CanvasTexture(m), v.minFilter = H.LinearFilter, v.magFilter = H.LinearFilter, g = new H.ShaderMaterial({
          uniforms: {
            uTex: { value: v },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 }
          },
          vertexShader: Xl,
          fragmentShader: Nl,
          transparent: !0
        }), x.add(new H.Mesh(new H.PlaneGeometry(2, 2), g)), w();
      }
    }
    function w() {
      if (!e.value || !u && !y) return;
      const I = e.value.clientWidth, F = e.value.clientHeight;
      !I || !F || !(m.width !== I || m.height !== F) || (m.width = I, m.height = F, r.value = I, i.value = F, u ? (v && (v.dispose(), v = new H.CanvasTexture(m), v.minFilter = H.LinearFilter, v.magFilter = H.LinearFilter, g && (g.uniforms.uTex.value = v)), u.setPixelRatio(window.devicePixelRatio || 1), u.setSize(I, F)) : n.value && (n.value.width = I, n.value.height = F, n.value.style.width = I + "px", n.value.style.height = F + "px"), T());
    }
    function T() {
      if (!(m != null && m.width)) return;
      if (y) {
        if (!n.value) return;
        Lt(m, {
          candles: l.candles,
          slotW: s.value,
          scrollX: d.value,
          theme: l.theme,
          glow: !1,
          showVolume: l.showVolume,
          volumeFraction: l.volumeFraction,
          hover: c.value,
          overlays: l.overlays,
          markers: l.markers
        });
        const F = n.value.getContext("2d");
        F && F.drawImage(m, 0, 0);
        return;
      }
      if (!u || !g || !v) return;
      const I = l.theme === "paper";
      g.uniforms.uStrength.value = l.curvature / 45 * 0.55, g.uniforms.uScanlines.value = l.scanlines && !I ? 1 : 0, g.uniforms.uVignette.value = I ? 0 : 1, Lt(m, {
        candles: l.candles,
        slotW: s.value,
        scrollX: d.value,
        theme: l.theme,
        glow: l.glow,
        showVolume: l.showVolume,
        volumeFraction: l.volumeFraction,
        hover: c.value,
        overlays: l.overlays,
        markers: l.markers
      }), v.needsUpdate = !0, u.render(x, M);
    }
    P(() => l.theme, () => T()), P(() => l.curvature, () => T()), P(() => l.scanlines, () => T()), P(() => l.glow, () => T()), P(() => l.showVolume, () => T()), P(() => l.volumeFraction, () => T()), P(() => l.slotW, () => T()), P(() => l.candles, () => T(), { deep: !1 }), P(() => l.overlays, () => T(), { deep: !1 }), P(() => l.markers, () => T(), { deep: !1 }), P(d, () => T()), P(f, () => T()), P(c, () => T()), P(s, () => T());
    let z = null, E = null, R = 0;
    const b = tt("cathodeResetTick", B(0));
    P(b, () => $());
    function $() {
      cancelAnimationFrame(R), R = requestAnimationFrame(w);
    }
    function O(I) {
      I.preventDefault();
    }
    function X() {
      u == null || u.dispose(), u = null, y = !1, h();
    }
    function ee(I) {
      if (!n.value) return [-1, -1];
      const F = n.value.getBoundingClientRect();
      return [I.clientX - F.left, I.clientY - F.top];
    }
    function J(I) {
      var we;
      const F = s.value;
      if (F <= 0) return 0;
      const A = ((we = l.candles) == null ? void 0 : we.length) ?? 0, fe = Math.max(1, Math.floor((r.value || 1) / F)), se = Math.max(0, A - fe);
      return Math.max(0, Math.min(I, se * F));
    }
    function Le(I) {
      var fe;
      if (I.deltaX !== 0 || I.shiftKey && I.deltaY !== 0) {
        const se = I.deltaX !== 0 ? I.deltaX : I.deltaY;
        d.value = J(d.value + se);
        return;
      }
      if (I.deltaY === 0) return;
      const [F] = ee(I), A = s.value;
      if (F >= 0 && A > 0 && ((fe = l.candles) != null && fe.length)) {
        const se = Math.max(1, Math.floor((r.value || 1) / A)), Ee = Math.max(0, l.candles.length - se - Math.floor(d.value / A)) + (F - 8) / A, L = Math.exp(-I.deltaY * 15e-4), W = Math.max(Et, Math.min(Rt, f.value * L));
        f.value = W;
        const Z = l.slotW * W, xe = Math.max(1, Math.floor((r.value || 1) / Z)), ve = Ee - (F - 8) / Z, q = Math.max(0, l.candles.length - xe - ve);
        d.value = J(q * Z);
      } else {
        const se = Math.exp(-I.deltaY * 15e-4);
        f.value = Math.max(Et, Math.min(Rt, f.value * se));
      }
    }
    let K = !1, de = 0, pe = 0;
    function G(I) {
      I.button === 0 && (K = !0, de = I.clientX, pe = d.value, c.value = null);
    }
    function Se(I) {
      if (K) {
        const F = I.clientX - de;
        d.value = J(pe + F);
        return;
      }
    }
    function Ce() {
      K = !1;
    }
    function D(I) {
      if (K) return;
      const [F, A] = ee(I);
      if (F < 0 || A < 0) {
        c.value = null;
        return;
      }
      c.value = { x: F, y: A };
    }
    function Y() {
      c.value = null;
    }
    Pe(() => {
      document.addEventListener("mousemove", Se), document.addEventListener("mouseup", Ce), Ie(() => {
        var I;
        h(), n.value && (n.value.addEventListener("webglcontextlost", O), n.value.addEventListener("webglcontextrestored", X)), e.value && (z = new ResizeObserver(() => w()), z.observe(e.value), E = new IntersectionObserver((F) => {
          F.some((A) => A.isIntersecting) && $();
        }), E.observe(e.value)), window.addEventListener("resize", $), (I = window.visualViewport) == null || I.addEventListener("resize", $);
      });
    }), Ge(() => {
      var I, F, A;
      document.removeEventListener("mousemove", Se), document.removeEventListener("mouseup", Ce), (I = n.value) == null || I.removeEventListener("webglcontextlost", O), (F = n.value) == null || F.removeEventListener("webglcontextrestored", X), z == null || z.disconnect(), E == null || E.disconnect(), window.removeEventListener("resize", $), (A = window.visualViewport) == null || A.removeEventListener("resize", $), cancelAnimationFrame(R), u == null || u.dispose();
    });
    const U = N(() => Ze[l.theme] ?? Ze.none), Q = N(() => ({
      background: U.value.bg
    }));
    return (I, F) => (re(), ie("div", {
      ref_key: "wrapEl",
      ref: e,
      class: "cathode-candle-wrap",
      style: be(Q.value)
    }, [
      j("canvas", {
        ref_key: "canvasEl",
        ref: n,
        class: "cathode-candle-canvas",
        onWheel: Re(Le, ["prevent"]),
        onMousedown: G,
        onMousemove: D,
        onMouseleave: Y
      }, null, 544)
    ], 4));
  }
}), wn = /* @__PURE__ */ Ue(Gl, [["__scopeId", "data-v-f6f8dffc"]]), vt = B(0), ut = 28, We = 12;
let dt = 10, Qe = "cathode.layout", et = !1;
const ae = B({});
function Ul(t, l = "cathode.layout") {
  if (!et) {
    et = !0, Qe = l;
    try {
      const e = localStorage.getItem(Qe);
      if (e) {
        ae.value = JSON.parse(e), Dt();
        return;
      }
    } catch {
    }
    ae.value = { ...t }, Dt();
  }
}
function Dt() {
  let t = 10;
  for (const l of Object.values(ae.value))
    typeof (l == null ? void 0 : l.zIndex) == "number" && l.zIndex > t && (t = l.zIndex);
  dt = t;
}
function _e() {
  localStorage.setItem(Qe, JSON.stringify(ae.value));
}
function Kl(t) {
  et = !1, localStorage.removeItem(Qe), ae.value = { ...t }, _e(), et = !0, vt.value++;
}
function Yt(t) {
  dt++, ae.value[t] && (ae.value[t].zIndex = dt);
}
function ql(t, l) {
  ae.value[t].visible = l, _e();
}
function jl(t, l) {
  ae.value[t].minimized = l, l && (ae.value[t].maximized = !1), _e();
}
function Zl(t, l) {
  ae.value[t].maximized = l, l && (ae.value[t].minimized = !1, Yt(t)), _e();
}
function Jl(t, l, e) {
  ae.value[t].x = Math.round(l), ae.value[t].y = Math.round(e), _e();
}
function Ql(t, l, e) {
  ae.value[t].w = Math.round(l), ae.value[t].h = Math.round(e), _e();
}
function xn(t, l, e) {
  const n = Math.ceil(Math.sqrt(e.length)), r = Math.ceil(e.length / n), i = Math.floor((t - We * (n + 1)) / n), d = Math.floor((l - We * (r + 1)) / r), f = {};
  return e.forEach((c, s) => {
    const u = s % n, y = Math.floor(s / n);
    f[c] = {
      x: We + u * (i + We),
      y: We + y * (d + We),
      w: i,
      h: d,
      visible: !0,
      minimized: !1,
      maximized: !1,
      zIndex: s + 1
    };
  }), f;
}
function At() {
  return {
    containers: ae,
    TITLEBAR_H: ut,
    load: Ul,
    save: _e,
    reset: Kl,
    bringToFront: Yt,
    setVisible: ql,
    setMinimized: jl,
    setMaximized: Zl,
    updatePos: Jl,
    updateSize: Ql
  };
}
const en = { class: "ws-toolbar" }, tn = {
  key: 0,
  class: "ws-restore-menu"
}, ln = {
  key: 0,
  class: "ws-restore-empty"
}, nn = ["onClick"], on = /* @__PURE__ */ Ne({
  __name: "CathodeWorkspace",
  props: {
    storageKey: {},
    initialLayout: {},
    containerTitles: {}
  },
  setup(t) {
    const l = t, { containers: e, load: n, reset: r, setVisible: i } = At(), d = B(null);
    Mt("cathodeWorkspace", d), Mt("cathodeResetTick", vt), Pe(() => {
      if (!d.value) return;
      const { clientWidth: m, clientHeight: h } = d.value, w = l.initialLayout ?? {};
      n(w, l.storageKey ?? "cathode.layout");
      const T = Object.keys(e.value)[0];
      T && f(T);
    });
    function f(m) {
      var w;
      document.querySelectorAll(".cc").forEach((T) => T.classList.remove("cc-focused"));
      const h = (w = d.value) == null ? void 0 : w.querySelector(`#cc-${m}`);
      h && h.classList.add("cc-focused");
    }
    function c() {
      !d.value || !l.initialLayout || r(l.initialLayout);
    }
    function s(m) {
      const h = m.target.closest(".cc");
      h && (document.querySelectorAll(".cc").forEach((w) => w.classList.remove("cc-focused")), h.classList.add("cc-focused"));
    }
    const u = B(!1), y = () => Object.entries(e.value).filter(([, m]) => !m.visible).map(([m]) => m);
    function x(m) {
      i(m, !0), u.value = !1;
    }
    function M(m) {
      if (!u.value) return;
      const h = m.target;
      !h.closest(".ws-restore-menu") && !h.closest(".ws-btn-restore") && (u.value = !1);
    }
    function g(m) {
      m.key === "Escape" && (u.value = !1);
    }
    Pe(() => {
      document.addEventListener("click", M), document.addEventListener("keydown", g);
    }), Ge(() => {
      document.removeEventListener("click", M), document.removeEventListener("keydown", g);
    });
    function v(m) {
      var h;
      return ((h = l.containerTitles) == null ? void 0 : h[m]) ?? m;
    }
    return (m, h) => (re(), ie("div", {
      ref_key: "workspaceEl",
      ref: d,
      class: "cathode-workspace",
      onMousedown: s
    }, [
      ct(m.$slots, "default", {}, void 0, !0),
      ct(m.$slots, "overlay", {}, void 0, !0),
      j("div", en, [
        t.initialLayout ? (re(), ie("button", {
          key: 0,
          class: "ws-btn",
          title: "Reset all panels to default layout",
          onClick: c
        }, " ↺ Reset Layout ")) : Me("", !0),
        h[1] || (h[1] = j("div", { class: "ws-sep" }, null, -1)),
        j("button", {
          class: "ws-btn ws-btn-restore",
          title: "Restore a closed panel",
          onClick: h[0] || (h[0] = (w) => u.value = !u.value)
        }, " ⊞ Restore Panel ")
      ]),
      el(tl, { name: "menu" }, {
        default: ll(() => [
          u.value ? (re(), ie("div", tn, [
            h[3] || (h[3] = j("div", { class: "ws-restore-title" }, "Closed Panels", -1)),
            y().length ? Me("", !0) : (re(), ie("div", ln, " No closed panels ")),
            (re(!0), ie(nl, null, ol(y(), (w) => (re(), ie("div", {
              key: w,
              class: "ws-restore-item",
              onClick: (T) => x(w)
            }, [
              h[2] || (h[2] = j("span", { class: "ws-restore-icon" }, "⊞", -1)),
              al(" " + ye(v(w)), 1)
            ], 8, nn))), 128))
          ])) : Me("", !0)
        ]),
        _: 1
      })
    ], 544));
  }
}), bn = /* @__PURE__ */ Ue(on, [["__scopeId", "data-v-5838d04b"]]), an = ["id"], rn = { class: "cc-title" }, sn = {
  key: 0,
  class: "cc-size-badge"
}, cn = { class: "cc-controls" }, un = ["title"], dn = { class: "cc-body" }, fn = 200, vn = 80, Ft = 60, mn = /* @__PURE__ */ Ne({
  __name: "CathodeContainer",
  props: {
    id: {},
    title: {},
    curvature: {},
    canvas: { type: Boolean }
  },
  setup(t) {
    const l = t, { containers: e, bringToFront: n, setVisible: r, setMinimized: i, setMaximized: d, updatePos: f, updateSize: c } = At(), s = tt("cathodeWorkspace", B(null)), u = N(() => e.value[l.id]), y = N(() => {
      const D = u.value, Y = l.curvature ?? 0;
      if (!D) return {};
      const U = { "--curvature": Y };
      return D.maximized ? { ...U, left: "0px", top: "0px", width: "100%", height: "100%", zIndex: D.zIndex } : {
        ...U,
        left: D.x + "px",
        top: D.y + "px",
        width: D.w + "px",
        height: D.minimized ? ut + "px" : D.h + "px",
        zIndex: D.zIndex,
        display: D.visible ? "flex" : "none"
      };
    });
    let x = !1, M = 0, g = 0;
    function v(D) {
      var Q;
      if (D.target.closest(".cc-btn") || u.value.maximized) return;
      n(l.id), x = !0;
      const Y = (Q = s.value) == null ? void 0 : Q.querySelector(`#cc-${l.id}`);
      if (!Y) return;
      const U = Y.getBoundingClientRect();
      M = D.clientX - U.left, g = D.clientY - U.top, document.addEventListener("mousemove", m), document.addEventListener("mouseup", h), D.preventDefault();
    }
    function m(D) {
      var F;
      if (!x || !s.value) return;
      const Y = s.value.getBoundingClientRect(), U = ((F = u.value) == null ? void 0 : F.w) ?? 300;
      let Q = D.clientX - Y.left - M, I = D.clientY - Y.top - g;
      Q = Math.max(Ft - U, Math.min(Y.width - Ft, Q)), I = Math.max(0, Math.min(Y.height - ut, I)), f(l.id, Q, I);
    }
    function h() {
      x = !1, document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", h);
    }
    let w = !1, T = 0, z = 0, E = 0, R = 0;
    const b = B("");
    function $(D) {
      u.value.maximized || (n(l.id), w = !0, T = D.clientX, z = D.clientY, E = u.value.w, R = u.value.h, document.addEventListener("mousemove", O), document.addEventListener("mouseup", X), D.preventDefault(), D.stopPropagation());
    }
    function O(D) {
      if (!w) return;
      const Y = Math.max(fn, E + (D.clientX - T)), U = Math.max(vn, R + (D.clientY - z));
      c(l.id, Y, U), b.value = `${Math.round(Y)}×${Math.round(U)}`;
    }
    function X() {
      w = !1, b.value = "", document.removeEventListener("mousemove", O), document.removeEventListener("mouseup", X), ee.value++;
    }
    const ee = B(0);
    P(vt, () => {
      ee.value++;
    }), Ge(() => {
      var D;
      document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", h), document.removeEventListener("mousemove", O), document.removeEventListener("mouseup", X), (D = J.value) == null || D.removeEventListener("scroll", K), de();
    });
    const J = B(null);
    function Le(D) {
      if (l.canvas) return [];
      const Y = D.children[0];
      return Y ? Array.from(Y.children) : [];
    }
    function K() {
      const D = J.value, Y = l.curvature ?? 0;
      if (!D) return;
      const U = Le(D);
      if (!U.length) return;
      const Q = D.clientHeight, I = Q / 2, F = Y * 38e-4;
      U.forEach((A) => {
        if (!A.dataset.origFs) {
          const ve = getComputedStyle(A);
          A.dataset.origFs = ve.fontSize, A.dataset.origLh = ve.lineHeight;
        }
        if (Y === 0) {
          A.style.fontSize = "", A.style.lineHeight = "";
          return;
        }
        const fe = A.getBoundingClientRect(), se = D.getBoundingClientRect(), we = fe.top - se.top + fe.height / 2, Ee = Math.min(1, Math.abs(we - I) / (Q / 2)), L = 1 + F * Math.cos(Ee * Math.PI / 2), W = parseFloat(A.dataset.origFs), Z = A.dataset.origLh, xe = Z === "normal" ? W * 1.4 : parseFloat(Z);
        isNaN(W) || (A.style.fontSize = `${(W * L).toFixed(2)}px`), isNaN(xe) || (A.style.lineHeight = `${(xe * L).toFixed(2)}px`);
      });
    }
    function de() {
      const D = J.value;
      D && Le(D).forEach((Y) => {
        Y.style.fontSize = "", Y.style.lineHeight = "", delete Y.dataset.origFs, delete Y.dataset.origLh;
      });
    }
    P(() => l.curvature, (D) => {
      (D ?? 0) === 0 ? de() : K();
    }), Pe(() => {
      var D;
      (D = J.value) == null || D.addEventListener("scroll", K, { passive: !0 }), Ie(K);
    });
    function pe() {
      i(l.id, !u.value.minimized), Ie(() => {
        ee.value++;
      });
    }
    function G() {
      d(l.id, !u.value.maximized), Ie(() => {
        ee.value++;
      });
    }
    function Se() {
      r(l.id, !1);
    }
    function Ce() {
      n(l.id);
    }
    return (D, Y) => u.value && u.value.visible ? (re(), ie("div", {
      key: 0,
      id: `cc-${t.id}`,
      class: rl(["cc", { "cc-minimized": u.value.minimized, "cc-maximized": u.value.maximized, "cc-has-canvas": t.canvas }]),
      style: be(y.value),
      onMousedown: Ce
    }, [
      j("div", {
        class: "cc-titlebar",
        onMousedown: v
      }, [
        Y[0] || (Y[0] = j("span", { class: "cc-status-dot" }, null, -1)),
        j("span", rn, ye(t.title), 1),
        b.value ? (re(), ie("span", sn, ye(b.value), 1)) : Me("", !0),
        j("div", cn, [
          j("button", {
            class: "cc-btn",
            title: "Minimize",
            onClick: Re(pe, ["stop"])
          }, "─"),
          j("button", {
            class: "cc-btn cc-btn-max",
            title: u.value.maximized ? "Restore" : "Maximize",
            onClick: Re(G, ["stop"])
          }, ye(u.value.maximized ? "⤡" : "⤢"), 9, un),
          j("button", {
            class: "cc-btn cc-btn-close",
            title: "Close",
            onClick: Re(Se, ["stop"])
          }, "✕")
        ])
      ], 32),
      il(j("div", dn, [
        j("div", {
          ref_key: "bodyEl",
          ref: J,
          class: "cc-screen",
          onScroll: K
        }, [
          ct(D.$slots, "default", { resizeKey: ee.value }, void 0, !0),
          Y[1] || (Y[1] = j("div", { class: "cc-shine" }, null, -1))
        ], 544)
      ], 512), [
        [sl, !u.value.minimized]
      ]),
      !u.value.minimized && !u.value.maximized ? (re(), ie("div", {
        key: 0,
        class: "cc-resize",
        onMousedown: Re($, ["stop"])
      }, null, 32)) : Me("", !0)
    ], 46, an)) : Me("", !0);
  }
}), yn = /* @__PURE__ */ Ue(mn, [["__scopeId", "data-v-d8a49f79"]]);
export {
  Ze as CANDLE_THEME_COLORS,
  wn as CathodeCandle,
  yn as CathodeContainer,
  gn as CathodeGrid,
  pn as CathodeLog,
  bn as CathodeWorkspace,
  je as LOG_THEME_COLORS,
  xn as buildDefaultLayout,
  At as useCathodeLayout
};
