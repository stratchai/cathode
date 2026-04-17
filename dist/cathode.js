import { defineComponent as et, ref as _, reactive as xe, computed as z, watch as q, nextTick as be, onMounted as tt, onUnmounted as lt, openBlock as ce, createElementBlock as se, normalizeStyle as J, createElementVNode as te, withModifiers as Ae, withKeys as ot, createCommentVNode as he, toDisplayString as le } from "vue";
import * as j from "three";
const oe = {
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
}, R = 30, Ee = 12, nt = 10;
function Fe(p, d) {
  const e = p.getContext("2d");
  if (!e) return;
  const c = p.width, S = p.height, u = oe[d.theme] ?? oe.none, { cols: M, rows: x, pinnedRows: h, rowHeight: g, scrollY: H, glow: m } = d;
  e.fillStyle = u.bg, e.fillRect(0, 0, c, S);
  const G = h.length * g, L = S - R - G;
  e.fillStyle = u.headerBg, e.fillRect(0, 0, c, R), e.textBaseline = "middle", e.textAlign = "left";
  let W = 0;
  for (let i = 0; i < M.length; i++) {
    const v = M[i], C = !!d.colFilters[v.colId], y = d.sortColId === v.colId, D = (v.colDef.headerName ?? v.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(W, 0, v.width, R), e.clip(), e.font = `bold ${nt}px system-ui, -apple-system, sans-serif`, e.fillStyle = C ? u.accent : u.textHeader, m && (e.shadowBlur = 6, e.shadowColor = u.textHeader), e.fillText(D, W + 8, R / 2), e.shadowBlur = 0, y) {
      const b = e.measureText(D).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = u.accent, e.fillText(d.sortDir === "asc" ? "▲" : "▼", W + 8 + b + 4, R / 2);
    }
    v.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = C ? u.accent : u.textHeader, e.globalAlpha = C ? 1 : 0.38, e.fillText("⌕", W + v.width - 20, R / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(W + v.width - 0.5, 0), e.lineTo(W + v.width - 0.5, R), e.stroke(), W += v.width;
  }
  e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, R - 0.5), e.lineTo(c, R - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, R, c, L), e.clip();
  const $ = Math.max(0, Math.floor(H / g)), K = Math.min(x.length, Math.ceil((H + L) / g));
  for (let i = $; i < K; i++) {
    const v = x[i], C = R + i * g - H;
    i % 2 === 1 && (e.fillStyle = u.rowAlt, e.fillRect(0, C, c, g)), i === d.hoveredRow && i !== d.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, C, c, g)), i === d.selectedRow && (e.fillStyle = at(u.accent, 0.1), e.fillRect(0, C, c, g)), e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, C + g - 0.5), e.lineTo(c, C + g - 0.5), e.stroke();
    let y = 0;
    for (let D = 0; D < M.length; D++) {
      const b = M[D], w = d.getCellStyle(b, v), E = w.color ?? u.text, O = w.textAlign ?? "left", U = d.formatCell(b, v);
      e.save(), e.beginPath(), e.rect(y + 1, C, b.width - 2, g), e.clip(), e.font = `${Ee}px system-ui, -apple-system, sans-serif`, e.fillStyle = E, e.textBaseline = "middle", m && (e.shadowBlur = 4, e.shadowColor = E), O === "right" ? (e.textAlign = "right", e.fillText(U, y + b.width - 8, C + g / 2)) : (e.textAlign = "left", e.fillText(U, y + 8, C + g / 2)), e.shadowBlur = 0, e.restore(), i === d.selectedRow && D === d.selectedCol && (e.strokeStyle = u.accent, e.lineWidth = 2, e.strokeRect(y + 1.5, C + 1.5, b.width - 3, g - 3)), e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(y + b.width - 0.5, C), e.lineTo(y + b.width - 0.5, C + g), e.stroke(), y += b.width;
    }
  }
  if (e.restore(), h.length > 0) {
    const i = S - G;
    e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, i - 0.5), e.lineTo(c, i - 0.5), e.stroke();
    for (let v = 0; v < h.length; v++) {
      const C = h[v], y = i + v * g;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, y, c, g);
      let D = 0;
      for (let b = 0; b < M.length; b++) {
        const w = M[b], E = d.getCellStyle(w, C), O = E.color ?? u.text, U = E.textAlign ?? "left", ne = d.formatCell(w, C);
        e.save(), e.beginPath(), e.rect(D + 1, y, w.width - 2, g), e.clip(), e.font = `bold ${Ee}px system-ui, -apple-system, sans-serif`, e.fillStyle = O, e.textBaseline = "middle", U === "right" ? (e.textAlign = "right", e.fillText(ne, D + w.width - 8, y + g / 2)) : (e.textAlign = "left", e.fillText(ne, D + 8, y + g / 2)), e.restore(), e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(D + w.width - 0.5, y), e.lineTo(D + w.width - 0.5, y + g), e.stroke(), D += w.width;
      }
      e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, y + g - 0.5), e.lineTo(c, y + g - 0.5), e.stroke();
    }
  }
}
function at(p, d) {
  if (p.startsWith("rgba") || p.startsWith("rgb"))
    return p.replace(/[\d.]+\)$/, `${d})`);
  const e = parseInt(p.slice(1, 3), 16), c = parseInt(p.slice(3, 5), 16), S = parseInt(p.slice(5, 7), 16);
  return `rgba(${e},${c},${S},${d})`;
}
function rt(p, d, e) {
  const c = p - 0.5, S = d - 0.5, u = (c * c + S * S) * e;
  return [p + c * (1 + u) * u, d + S * (1 + u) * u];
}
function it(p, d, e, c, S) {
  const u = p / e, M = 1 - d / c, [x, h] = rt(u, M, S);
  return x < 0 || x > 1 || h < 0 || h > 1 ? [-1, -1] : [x * e, (1 - h) * c];
}
function ye(p, d) {
  let e = 0;
  for (let c = 0; c < p; c++) e += d[c].width;
  return e;
}
function ct(p, d, e) {
  return p >= d + e - 24 && p < d + e;
}
function Be(p, d, e) {
  const c = d + e;
  return p >= c - 6 && p <= c + 1;
}
function ze(p, d, e, c, S, u, M, x) {
  let h = -1, g = 0;
  for (let L = 0; L < e.length; L++) {
    if (p >= g && p < g + e[L].width) {
      h = L;
      break;
    }
    g += e[L].width;
  }
  if (d < R) return { area: "header", colIdx: h, rowIdx: -1 };
  const H = x * S;
  if (H > 0 && d >= M - H) {
    const L = Math.floor((d - (M - H)) / S);
    return { area: "pinned", colIdx: h, rowIdx: L };
  }
  const m = d - R + u, G = Math.floor(m / S);
  return G >= 0 && G < c ? { area: "body", colIdx: h, rowIdx: G } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const st = ["value"], ut = ["disabled"], dt = ["disabled"], ft = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, vt = `
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
`, ht = 28, gt = /* @__PURE__ */ et({
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
  setup(p, { emit: d }) {
    const e = p, c = d, S = _(e.rowData ?? []), u = _(e.pinnedBottomRowData ?? []), M = _(""), x = _(null), h = xe({}), g = xe({}), H = xe(/* @__PURE__ */ new Set()), m = _(0), G = _(0), L = _(0), W = _(0), $ = _(0), K = _(-1), i = _(null), v = _(null), C = _({ x: 0, y: R }), y = _("");
    function D(t) {
      return t.colId ?? t.field ?? (t.headerName ? t.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const b = z(() => {
      const t = e.defaultColDef ?? {};
      return e.columnDefs.filter((l) => !H.has(D(l))).map((l) => {
        const n = D(l), o = { ...t, ...l };
        return { colId: n, colDef: o, width: g[n] ?? o.width ?? 100 };
      });
    }), w = z(() => {
      const t = L.value;
      if (!t) return b.value;
      const l = b.value.reduce((s, a) => s + a.width, 0);
      if (!l) return b.value;
      const n = t / l;
      let o = 0;
      return b.value.map((s, a) => {
        const r = a === b.value.length - 1 ? t - o : Math.max(8, Math.round(s.width * n));
        return o += r, { ...s, width: r };
      });
    }), E = z(() => {
      const t = W.value;
      if (!t) return e.paginationPageSize;
      const l = u.value.length * e.rowHeight, n = t - R - l, o = Math.max(1, Math.floor(n / e.rowHeight));
      return Math.min(o, e.paginationPageSize);
    });
    function O(t, l) {
      if (l.colDef.valueGetter) return l.colDef.valueGetter({ data: t, colDef: l.colDef });
      if (l.colDef.field) return t[l.colDef.field];
    }
    function U(t, l) {
      const n = O(l, t);
      return t.colDef.valueFormatter ? t.colDef.valueFormatter({ value: n, data: l, colDef: t.colDef }) ?? "" : t.colDef.cellRenderer ? (t.colDef.cellRenderer({ value: n, data: l, colDef: t.colDef }) ?? "").replace(/<[^>]+>/g, "") : n == null ? "" : String(n);
    }
    function ne(t, l) {
      return t.colDef.cellStyle ? typeof t.colDef.cellStyle == "function" ? t.colDef.cellStyle({ value: O(l, t), data: l, colDef: t.colDef }) ?? {} : t.colDef.cellStyle : {};
    }
    const V = z(() => {
      G.value;
      let t = S.value;
      const l = M.value.trim().toLowerCase();
      l && (t = t.filter(
        (n) => b.value.some(
          (o) => String(O(n, o) ?? "").toLowerCase().includes(l)
        )
      ));
      for (const [n, o] of Object.entries(h)) {
        if (!o) continue;
        const s = b.value.find((a) => a.colId === n);
        if (s)
          if (o.startsWith("__eq__")) {
            const a = o.slice(6).toLowerCase();
            t = t.filter((f) => String(O(f, s) ?? "").toLowerCase() === a);
          } else {
            const a = o.toLowerCase();
            t = t.filter((f) => String(O(f, s) ?? "").toLowerCase().includes(a));
          }
      }
      if (x.value) {
        const { colId: n, dir: o } = x.value, s = b.value.find((a) => a.colId === n);
        s && (t = [...t].sort((a, f) => {
          const r = O(a, s), k = O(f, s);
          let A = 0;
          return s.colDef.comparator ? A = s.colDef.comparator(r, k) : typeof r == "number" && typeof k == "number" ? A = r - k : A = String(r ?? "").localeCompare(String(k ?? ""), void 0, { numeric: !0 }), o === "asc" ? A : -A;
        }));
      }
      return t;
    }), ae = z(
      () => Math.max(1, Math.ceil(V.value.length / E.value))
    ), Y = z(
      () => e.pagination ? V.value.slice(
        m.value * E.value,
        (m.value + 1) * E.value
      ) : V.value
    );
    q(V, () => {
      m.value = 0, i.value = null;
    }), q(E, () => {
      m.value = 0;
    });
    let Q = !1, ge = "", Ie = 0, Ce = 0, ue = !1;
    function We(t, l) {
      var n;
      Q = !0, ge = t, Ie = l, Ce = ((n = w.value.find((o) => o.colId === t)) == null ? void 0 : n.width) ?? 100, ue = !1;
    }
    function De(t) {
      if (!Q) return;
      const l = L.value, n = Math.max(30, Ce + (t.clientX - Ie)), o = b.value.filter((a) => a.colId !== ge).reduce((a, f) => a + f.width, 0), s = l - n;
      s > 10 && (g[ge] = Math.max(10, Math.round(n * o / s))), P();
    }
    function Se() {
      Q && (Q = !1, ue = !0, c("column-resized"));
    }
    const N = _(null), I = _(null);
    let T = null, X = !1, pe, ke, Z, ee, F;
    function Re() {
      if (!(!I.value || !N.value)) {
        F = document.createElement("canvas");
        try {
          T = new j.WebGLRenderer({ canvas: I.value, antialias: !1 });
        } catch {
          X = !0;
        }
        if (!X && !T.getContext() && (T.dispose(), T = null, X = !0), X) {
          de();
          return;
        }
        T.setPixelRatio(1), pe = new j.Scene(), ke = new j.OrthographicCamera(-1, 1, 1, -1, 0, 1), ee = new j.CanvasTexture(F), ee.minFilter = j.LinearFilter, ee.magFilter = j.LinearFilter, Z = new j.ShaderMaterial({
          uniforms: {
            uTex: { value: ee },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new j.Color(0) }
          },
          vertexShader: ft,
          fragmentShader: vt
        }), pe.add(new j.Mesh(new j.PlaneGeometry(2, 2), Z)), de();
      }
    }
    function de() {
      if (!N.value || !T && !X) return;
      const t = N.value.clientWidth, l = N.value.clientHeight - (e.pagination ? ht : 0);
      !t || !l || (F.width = t, F.height = l, L.value = t, W.value = l, T ? T.setSize(t, l) : I.value && (I.value.width = t, I.value.height = l, I.value.style.width = t + "px", I.value.style.height = l + "px"), P());
    }
    function P() {
      var n, o, s, a, f, r, k, A;
      if (!(F != null && F.width)) return;
      if (X) {
        if (!I.value) return;
        Fe(F, {
          cols: w.value,
          rows: Y.value,
          pinnedRows: u.value,
          rowHeight: e.rowHeight,
          scrollY: $.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((n = x.value) == null ? void 0 : n.colId) ?? null,
          sortDir: ((o = x.value) == null ? void 0 : o.dir) ?? null,
          colFilters: h,
          hoveredRow: K.value,
          selectedRow: ((s = i.value) == null ? void 0 : s.row) ?? -1,
          selectedCol: ((a = i.value) == null ? void 0 : a.col) ?? -1,
          formatCell: U,
          getCellStyle: ne
        });
        const ie = I.value.getContext("2d");
        ie && ie.drawImage(F, 0, 0);
        return;
      }
      if (!T || !Z || !ee) return;
      const t = oe[e.theme] ?? oe.none, l = e.theme === "paper";
      Z.uniforms.uStrength.value = e.curvature / 45 * 0.55, Z.uniforms.uScanlines.value = e.scanlines && !l ? 1 : 0, Z.uniforms.uVignette.value = l ? 0 : 1, Z.uniforms.uBezel.value.set(t.bg), Fe(F, {
        cols: w.value,
        rows: Y.value,
        pinnedRows: u.value,
        rowHeight: e.rowHeight,
        scrollY: $.value,
        theme: e.theme,
        glow: e.glow,
        sortColId: ((f = x.value) == null ? void 0 : f.colId) ?? null,
        sortDir: ((r = x.value) == null ? void 0 : r.dir) ?? null,
        colFilters: h,
        hoveredRow: K.value,
        selectedRow: ((k = i.value) == null ? void 0 : k.row) ?? -1,
        selectedCol: ((A = i.value) == null ? void 0 : A.col) ?? -1,
        formatCell: U,
        getCellStyle: ne
      }), ee.needsUpdate = !0, T.render(pe, ke);
    }
    function Oe() {
      return e.curvature / 45 * 0.55;
    }
    function we(t) {
      if (!I.value) return [-1, -1];
      const l = I.value.getBoundingClientRect();
      return it(
        t.clientX - l.left,
        t.clientY - l.top,
        I.value.width,
        I.value.height,
        Oe()
      );
    }
    let Te = 0;
    function $e(t) {
      if (v.value = null, e.pagination) {
        const l = Date.now();
        if (l - Te < 120) return;
        Te = l, t.deltaY > 0 && m.value < ae.value - 1 ? (m.value++, i.value = null) : t.deltaY < 0 && m.value > 0 && (m.value--, i.value = null), P();
      } else {
        const l = u.value.length * e.rowHeight, n = W.value - R - l, o = Math.max(0, V.value.length * e.rowHeight - n);
        $.value = Math.max(0, Math.min(o, $.value + t.deltaY)), P();
      }
    }
    function Ue(t) {
      if (Q) return;
      const [l, n] = we(t);
      if (l < 0) {
        K.value = -1, P();
        return;
      }
      const o = ze(
        l,
        n,
        w.value,
        Y.value.length,
        e.rowHeight,
        $.value,
        F.height,
        u.value.length
      );
      if (K.value = o.area === "body" ? o.rowIdx : -1, o.area === "header" && o.colIdx >= 0) {
        const s = w.value[o.colIdx], a = ye(o.colIdx, w.value);
        I.value.style.cursor = s && Be(l, a, s.width) ? "col-resize" : "pointer";
      } else o.area === "body" ? I.value.style.cursor = "pointer" : I.value.style.cursor = "default";
      P();
    }
    function Ye() {
      K.value = -1, P();
    }
    function je(t) {
      const [l, n] = we(t);
      if (!(l < 0 || n >= R))
        for (let o = 0; o < w.value.length; o++) {
          const s = w.value[o], a = ye(o, w.value);
          if (s.colDef.resizable !== !1 && Be(l, a, s.width)) {
            We(s.colId, t.clientX);
            return;
          }
        }
    }
    function Ge(t) {
      var s, a, f;
      if (ue) {
        ue = !1;
        return;
      }
      if (Q) return;
      const [l, n] = we(t);
      if (l < 0) {
        v.value = null;
        return;
      }
      const o = ze(
        l,
        n,
        w.value,
        Y.value.length,
        e.rowHeight,
        $.value,
        F.height,
        u.value.length
      );
      if (o.area === "header" && o.colIdx >= 0) {
        const r = w.value[o.colIdx], k = ye(o.colIdx, w.value);
        r.colDef.filter && ct(l, k, r.width) ? (t.stopPropagation(), v.value === r.colId ? v.value = null : (v.value = r.colId, y.value = (s = h[r.colId]) != null && s.startsWith("__eq__") ? h[r.colId].slice(6) : h[r.colId] ?? "", C.value = { x: Math.max(0, k), y: R })) : r.colDef.sortable !== !1 && (v.value = null, x.value = ((a = x.value) == null ? void 0 : a.colId) === r.colId ? x.value.dir === "asc" ? { colId: r.colId, dir: "desc" } : null : { colId: r.colId, dir: "asc" }, c("sort-changed"));
        return;
      }
      if (v.value = null, o.area === "body" && o.rowIdx >= 0 && o.colIdx >= 0) {
        i.value = { row: o.rowIdx, col: o.colIdx }, (f = I.value) == null || f.focus();
        const r = Y.value[o.rowIdx], k = w.value[o.colIdx];
        r && k && (c("row-clicked", { data: r, event: t }), c("cell-selected", { data: r, row: o.rowIdx, col: o.colIdx, colId: k.colId }));
      }
    }
    function _e(t) {
      var l, n;
      v.value && ((n = (l = t.target).closest) != null && n.call(l, ".cathode-filter-popup") || (v.value = null));
    }
    function Ke(t) {
      var ie;
      const l = w.value, n = Y.value, o = l.length - 1, s = n.length - 1;
      if (!i.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(t.key) && (t.preventDefault(), i.value = { row: 0, col: 0 });
        return;
      }
      let { row: a, col: f } = i.value;
      const r = (fe, ve) => {
        a = Math.max(0, Math.min(s, fe)), f = Math.max(0, Math.min(o, ve)), i.value = { row: a, col: f };
      }, k = () => {
        m.value > 0 && (m.value--, r(E.value - 1, f));
      }, A = () => {
        m.value < ae.value - 1 && (m.value++, r(0, f));
      };
      switch (t.key) {
        case "ArrowDown":
          t.preventDefault(), a < s ? r(a + 1, f) : A();
          break;
        case "ArrowUp":
          t.preventDefault(), a > 0 ? r(a - 1, f) : k();
          break;
        case "ArrowRight":
          t.preventDefault(), f < o ? r(a, f + 1) : a < s ? r(a + 1, 0) : A();
          break;
        case "ArrowLeft":
          t.preventDefault(), f > 0 ? r(a, f - 1) : a > 0 ? r(a - 1, o) : k();
          break;
        case "Tab":
          t.preventDefault(), t.shiftKey ? f > 0 ? r(a, f - 1) : a > 0 ? r(a - 1, o) : k() : f < o ? r(a, f + 1) : a < s ? r(a + 1, 0) : A();
          break;
        case "Enter":
          t.preventDefault(), t.shiftKey ? a > 0 ? r(a - 1, f) : k() : a < s ? r(a + 1, f) : A();
          break;
        case "Home":
          t.preventDefault(), t.ctrlKey || t.metaKey ? (m.value = 0, r(0, 0)) : r(a, 0);
          break;
        case "End":
          t.preventDefault(), t.ctrlKey || t.metaKey ? (m.value = ae.value - 1, be(() => r(Y.value.length - 1, o))) : r(a, o);
          break;
        case "PageDown":
          t.preventDefault(), A();
          break;
        case "PageUp":
          t.preventDefault(), k();
          break;
        case "Escape":
          i.value = null;
          break;
        case "c":
        case "C":
          if (t.ctrlKey || t.metaKey) {
            t.preventDefault();
            const fe = n[a], ve = l[f];
            if (fe && ve) {
              const Qe = U(ve, fe);
              (ie = navigator.clipboard) == null || ie.writeText(Qe).catch(() => {
              });
            }
          }
          break;
      }
    }
    function qe(t) {
      const l = t.target.value;
      y.value = l, l ? h[v.value] = l : delete h[v.value], m.value = 0, c("filter-changed");
    }
    function Me() {
      v.value && delete h[v.value], y.value = "", v.value = null, m.value = 0, c("filter-changed");
    }
    const Ve = {
      setGridOption(t, l) {
        t === "rowData" ? S.value = l : t === "pinnedBottomRowData" ? u.value = l : t === "quickFilterText" && (M.value = l);
      },
      getColumnState() {
        return e.columnDefs.map((t) => {
          var n, o;
          const l = D(t);
          return {
            colId: l,
            hide: H.has(l),
            sort: ((n = x.value) == null ? void 0 : n.colId) === l ? x.value.dir : null,
            sortIndex: ((o = x.value) == null ? void 0 : o.colId) === l ? 0 : null,
            width: g[l] ?? t.width
          };
        });
      },
      applyColumnState({ state: t }) {
        for (const l of t)
          l.hide === !0 && H.add(l.colId), l.hide === !1 && H.delete(l.colId), l.sort && (x.value = { colId: l.colId, dir: l.sort }), l.width && (g[l.colId] = l.width);
      },
      setFilterModel(t) {
        for (const l of Object.keys(h)) delete h[l];
        if (t)
          for (const [l, n] of Object.entries(t))
            (n == null ? void 0 : n.type) === "equals" ? h[l] = `__eq__${n.filter}` : n != null && n.filter && (h[l] = n.filter);
      },
      getFilterModel() {
        const t = {};
        for (const [l, n] of Object.entries(h))
          n && (t[l] = n.startsWith("__eq__") ? { type: "equals", filter: n.slice(6) } : { type: "contains", filter: n });
        return t;
      },
      async setColumnFilterModel(t, l) {
        l ? l.type === "equals" ? h[t] = `__eq__${l.filter}` : h[t] = l.filter ?? "" : delete h[t];
      },
      onFilterChanged() {
      },
      refreshCells() {
        G.value++;
      },
      exportDataAsCsv({ fileName: t = "export.csv" } = {}) {
        const l = b.value, n = l.map((f) => f.colDef.headerName ?? f.colId).join(","), o = V.value.map(
          (f) => l.map((r) => `"${String(U(r, f)).replace(/"/g, '""')}"`).join(",")
        ), s = new Blob([[n, ...o].join(`
`)], { type: "text/csv" }), a = URL.createObjectURL(s);
        Object.assign(document.createElement("a"), { href: a, download: t }).click(), URL.revokeObjectURL(a);
      },
      resize() {
        de();
      },
      resetColumnState() {
        H.clear();
        for (const l of e.columnDefs)
          l.hide && H.add(D(l));
        const t = e.columnDefs.find((l) => l.sort);
        x.value = t ? { colId: D(t), dir: t.sort } : null;
        for (const l of Object.keys(g)) delete g[l];
        for (const l of Object.keys(h)) delete h[l];
        M.value = "", $.value = 0, m.value = 0, i.value = null, v.value = null;
      }
    };
    q(
      [Y, () => u.value, w, $, K, i],
      () => be(P)
    ), q(() => e.theme, () => P()), q(() => e.curvature, () => P()), q(() => e.scanlines, () => P()), q(() => e.glow, () => P()), q(i, (t) => {
      if (!t) return;
      const l = Y.value[t.row], n = w.value[t.col];
      l && n && c("cell-selected", { data: l, row: t.row, col: t.col, colId: n.colId });
    });
    let re = null, me = 0;
    function He(t) {
      t.preventDefault();
    }
    function Le() {
      T == null || T.dispose(), T = null, X = !1, Re();
    }
    tt(() => {
      for (const t of e.columnDefs)
        t.hide && H.add(D(t)), t.sort && !x.value && (x.value = { colId: D(t), dir: t.sort });
      S.value = e.rowData ?? [], u.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", _e), document.addEventListener("mousemove", De), document.addEventListener("mouseup", Se), be(() => {
        Re(), I.value && (I.value.addEventListener("webglcontextlost", He), I.value.addEventListener("webglcontextrestored", Le)), N.value && (re = new ResizeObserver(() => {
          cancelAnimationFrame(me), me = requestAnimationFrame(de);
        }), re.observe(N.value)), c("grid-ready", { api: Ve });
      });
    }), lt(() => {
      var t, l;
      document.removeEventListener("click", _e, !0), document.removeEventListener("mousemove", De), document.removeEventListener("mouseup", Se), (t = I.value) == null || t.removeEventListener("webglcontextlost", He), (l = I.value) == null || l.removeEventListener("webglcontextrestored", Le), re == null || re.disconnect(), cancelAnimationFrame(me), T == null || T.dispose();
    });
    const B = z(() => oe[e.theme] ?? oe.none), Ne = z(() => ({
      position: "absolute",
      left: `${C.value.x}px`,
      top: `${C.value.y}px`,
      zIndex: 100,
      background: B.value.headerBg,
      border: `1px solid ${B.value.accent}`,
      color: B.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Xe = z(() => ({
      background: B.value.bg,
      border: `1px solid ${B.value.border}`,
      color: B.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Ze = z(() => ({
      background: B.value.headerBg,
      borderTop: `1px solid ${B.value.border}`,
      color: B.value.text
    })), Je = z(() => ({
      background: B.value.bg
    })), Pe = z(() => B.value.accent);
    return (t, l) => {
      var n, o;
      return ce(), se("div", {
        ref_key: "wrapEl",
        ref: N,
        class: "cathode-wrap",
        style: J(Je.value)
      }, [
        te("canvas", {
          ref_key: "canvasEl",
          ref: I,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: Ae($e, ["prevent"]),
          onMousemove: Ue,
          onMouseleave: Ye,
          onMousedown: je,
          onClick: Ge,
          onKeydown: Ke
        }, null, 544),
        v.value ? (ce(), se("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: J(Ne.value),
          onClick: l[0] || (l[0] = Ae(() => {
          }, ["stop"]))
        }, [
          te("input", {
            style: J(Xe.value),
            value: y.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: qe,
            onKeydown: ot(Me, ["escape"])
          }, null, 44, st),
          y.value ? (ce(), se("button", {
            key: 0,
            style: J({
              background: "none",
              border: "none",
              color: B.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: Me
          }, "✕", 4)) : he("", !0)
        ], 4)) : he("", !0),
        p.pagination ? (ce(), se("div", {
          key: 1,
          class: "cathode-pagination",
          style: J(Ze.value)
        }, [
          te("button", {
            disabled: m.value === 0,
            onClick: l[1] || (l[1] = (s) => {
              m.value--, i.value = null, P();
            })
          }, "◀", 8, ut),
          te("span", null, le(m.value + 1) + " / " + le(ae.value), 1),
          te("button", {
            disabled: m.value >= ae.value - 1,
            onClick: l[2] || (l[2] = (s) => {
              m.value++, i.value = null, P();
            })
          }, "▶", 8, dt),
          te("span", {
            class: "cathode-page-info",
            style: J({ color: Pe.value })
          }, le(V.value.length.toLocaleString()) + " rows · " + le(E.value) + " per page ", 5),
          i.value ? (ce(), se("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: J({ color: Pe.value })
          }, le(((n = w.value[i.value.col]) == null ? void 0 : n.colDef.headerName) ?? ((o = w.value[i.value.col]) == null ? void 0 : o.colId)) + " : " + le(U(w.value[i.value.col], Y.value[i.value.row])), 5)) : he("", !0)
        ], 4)) : he("", !0)
      ], 4);
    };
  }
}), pt = (p, d) => {
  const e = p.__vccOpts || p;
  for (const [c, S] of d)
    e[c] = S;
  return e;
}, mt = /* @__PURE__ */ pt(gt, [["__scopeId", "data-v-4f1c11f8"]]);
export {
  mt as CathodeGrid
};
