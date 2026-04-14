import { defineComponent as Je, ref as T, reactive as xe, computed as E, watch as q, nextTick as be, onMounted as Qe, onUnmounted as et, openBlock as ce, createElementBlock as se, normalizeStyle as Z, createElementVNode as te, withModifiers as He, withKeys as tt, createCommentVNode as he, toDisplayString as le } from "vue";
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
}, R = 30, Ae = 12, lt = 10;
function Pe(p, d) {
  const e = p.getContext("2d");
  if (!e) return;
  const c = p.width, C = p.height, u = oe[d.theme] ?? oe.none, { cols: _, rows: x, pinnedRows: h, rowHeight: g, scrollY: M, glow: m } = d;
  e.fillStyle = u.bg, e.fillRect(0, 0, c, C);
  const G = h.length * g, H = C - R - G;
  e.fillStyle = u.headerBg, e.fillRect(0, 0, c, R), e.textBaseline = "middle", e.textAlign = "left";
  let W = 0;
  for (let i = 0; i < _.length; i++) {
    const v = _[i], I = !!d.colFilters[v.colId], y = d.sortColId === v.colId, D = (v.colDef.headerName ?? v.colId).toUpperCase();
    if (e.save(), e.beginPath(), e.rect(W, 0, v.width, R), e.clip(), e.font = `bold ${lt}px system-ui, -apple-system, sans-serif`, e.fillStyle = I ? u.accent : u.textHeader, m && (e.shadowBlur = 6, e.shadowColor = u.textHeader), e.fillText(D, W + 8, R / 2), e.shadowBlur = 0, y) {
      const b = e.measureText(D).width;
      e.font = "8px system-ui, -apple-system, sans-serif", e.fillStyle = u.accent, e.fillText(d.sortDir === "asc" ? "▲" : "▼", W + 8 + b + 4, R / 2);
    }
    v.colDef.filter && (e.font = "13px system-ui, -apple-system, sans-serif", e.fillStyle = I ? u.accent : u.textHeader, e.globalAlpha = I ? 1 : 0.38, e.fillText("⌕", W + v.width - 20, R / 2), e.globalAlpha = 1), e.restore(), e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(W + v.width - 0.5, 0), e.lineTo(W + v.width - 0.5, R), e.stroke(), W += v.width;
  }
  e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, R - 0.5), e.lineTo(c, R - 0.5), e.stroke(), e.save(), e.beginPath(), e.rect(0, R, c, H), e.clip();
  const $ = Math.max(0, Math.floor(M / g)), K = Math.min(x.length, Math.ceil((M + H) / g));
  for (let i = $; i < K; i++) {
    const v = x[i], I = R + i * g - M;
    i % 2 === 1 && (e.fillStyle = u.rowAlt, e.fillRect(0, I, c, g)), i === d.hoveredRow && i !== d.selectedRow && (e.fillStyle = "rgba(255,255,255,0.045)", e.fillRect(0, I, c, g)), i === d.selectedRow && (e.fillStyle = ot(u.accent, 0.1), e.fillRect(0, I, c, g)), e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, I + g - 0.5), e.lineTo(c, I + g - 0.5), e.stroke();
    let y = 0;
    for (let D = 0; D < _.length; D++) {
      const b = _[D], w = d.getCellStyle(b, v), B = w.color ?? u.text, O = w.textAlign ?? "left", U = d.formatCell(b, v);
      e.save(), e.beginPath(), e.rect(y + 1, I, b.width - 2, g), e.clip(), e.font = `${Ae}px system-ui, -apple-system, sans-serif`, e.fillStyle = B, e.textBaseline = "middle", m && (e.shadowBlur = 4, e.shadowColor = B), O === "right" ? (e.textAlign = "right", e.fillText(U, y + b.width - 8, I + g / 2)) : (e.textAlign = "left", e.fillText(U, y + 8, I + g / 2)), e.shadowBlur = 0, e.restore(), i === d.selectedRow && D === d.selectedCol && (e.strokeStyle = u.accent, e.lineWidth = 2, e.strokeRect(y + 1.5, I + 1.5, b.width - 3, g - 3)), e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(y + b.width - 0.5, I), e.lineTo(y + b.width - 0.5, I + g), e.stroke(), y += b.width;
    }
  }
  if (e.restore(), h.length > 0) {
    const i = C - G;
    e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, i - 0.5), e.lineTo(c, i - 0.5), e.stroke();
    for (let v = 0; v < h.length; v++) {
      const I = h[v], y = i + v * g;
      e.fillStyle = "rgba(0,0,0,0.35)", e.fillRect(0, y, c, g);
      let D = 0;
      for (let b = 0; b < _.length; b++) {
        const w = _[b], B = d.getCellStyle(w, I), O = B.color ?? u.text, U = B.textAlign ?? "left", ae = d.formatCell(w, I);
        e.save(), e.beginPath(), e.rect(D + 1, y, w.width - 2, g), e.clip(), e.font = `bold ${Ae}px system-ui, -apple-system, sans-serif`, e.fillStyle = O, e.textBaseline = "middle", U === "right" ? (e.textAlign = "right", e.fillText(ae, D + w.width - 8, y + g / 2)) : (e.textAlign = "left", e.fillText(ae, D + 8, y + g / 2)), e.restore(), e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(D + w.width - 0.5, y), e.lineTo(D + w.width - 0.5, y + g), e.stroke(), D += w.width;
      }
      e.strokeStyle = u.border, e.lineWidth = 1, e.beginPath(), e.moveTo(0, y + g - 0.5), e.lineTo(c, y + g - 0.5), e.stroke();
    }
  }
}
function ot(p, d) {
  if (p.startsWith("rgba") || p.startsWith("rgb"))
    return p.replace(/[\d.]+\)$/, `${d})`);
  const e = parseInt(p.slice(1, 3), 16), c = parseInt(p.slice(3, 5), 16), C = parseInt(p.slice(5, 7), 16);
  return `rgba(${e},${c},${C},${d})`;
}
function at(p, d, e) {
  const c = p - 0.5, C = d - 0.5, u = (c * c + C * C) * e;
  return [p + c * (1 + u) * u, d + C * (1 + u) * u];
}
function nt(p, d, e, c, C) {
  const u = p / e, _ = 1 - d / c, [x, h] = at(u, _, C);
  return x < 0 || x > 1 || h < 0 || h > 1 ? [-1, -1] : [x * e, (1 - h) * c];
}
function ye(p, d) {
  let e = 0;
  for (let c = 0; c < p; c++) e += d[c].width;
  return e;
}
function rt(p, d, e) {
  return p >= d + e - 24 && p < d + e;
}
function Fe(p, d, e) {
  const c = d + e;
  return p >= c - 6 && p <= c + 1;
}
function Be(p, d, e, c, C, u, _, x) {
  let h = -1, g = 0;
  for (let H = 0; H < e.length; H++) {
    if (p >= g && p < g + e[H].width) {
      h = H;
      break;
    }
    g += e[H].width;
  }
  if (d < R) return { area: "header", colIdx: h, rowIdx: -1 };
  const M = x * C;
  if (M > 0 && d >= _ - M) {
    const H = Math.floor((d - (_ - M)) / C);
    return { area: "pinned", colIdx: h, rowIdx: H };
  }
  const m = d - R + u, G = Math.floor(m / C);
  return G >= 0 && G < c ? { area: "body", colIdx: h, rowIdx: G } : { area: "none", colIdx: -1, rowIdx: -1 };
}
const it = ["value"], ct = ["disabled"], st = ["disabled"], ut = `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`, dt = `
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
`, ft = 28, vt = /* @__PURE__ */ Je({
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
    const e = p, c = d, C = T(e.rowData ?? []), u = T(e.pinnedBottomRowData ?? []), _ = T(""), x = T(null), h = xe({}), g = xe({}), M = xe(/* @__PURE__ */ new Set()), m = T(0), G = T(0), H = T(0), W = T(0), $ = T(0), K = T(-1), i = T(null), v = T(null), I = T({ x: 0, y: R }), y = T("");
    function D(t) {
      return t.colId ?? t.field ?? (t.headerName ? t.headerName.toLowerCase().replace(/\s+/g, "_") : void 0) ?? `col_${Math.random().toString(36).slice(2, 7)}`;
    }
    const b = E(() => {
      const t = e.defaultColDef ?? {};
      return e.columnDefs.filter((l) => !M.has(D(l))).map((l) => {
        const a = D(l), o = { ...t, ...l };
        return { colId: a, colDef: o, width: g[a] ?? o.width ?? 100 };
      });
    }), w = E(() => {
      const t = H.value;
      if (!t) return b.value;
      const l = b.value.reduce((s, n) => s + n.width, 0);
      if (!l) return b.value;
      const a = t / l;
      let o = 0;
      return b.value.map((s, n) => {
        const r = n === b.value.length - 1 ? t - o : Math.max(8, Math.round(s.width * a));
        return o += r, { ...s, width: r };
      });
    }), B = E(() => {
      const t = W.value;
      if (!t) return e.paginationPageSize;
      const l = u.value.length * e.rowHeight, a = t - R - l, o = Math.max(1, Math.floor(a / e.rowHeight));
      return Math.min(o, e.paginationPageSize);
    });
    function O(t, l) {
      if (l.colDef.valueGetter) return l.colDef.valueGetter({ data: t, colDef: l.colDef });
      if (l.colDef.field) return t[l.colDef.field];
    }
    function U(t, l) {
      const a = O(l, t);
      return t.colDef.valueFormatter ? t.colDef.valueFormatter({ value: a, data: l, colDef: t.colDef }) ?? "" : t.colDef.cellRenderer ? (t.colDef.cellRenderer({ value: a, data: l, colDef: t.colDef }) ?? "").replace(/<[^>]+>/g, "") : a == null ? "" : String(a);
    }
    function ae(t, l) {
      return t.colDef.cellStyle ? typeof t.colDef.cellStyle == "function" ? t.colDef.cellStyle({ value: O(l, t), data: l, colDef: t.colDef }) ?? {} : t.colDef.cellStyle : {};
    }
    const V = E(() => {
      G.value;
      let t = C.value;
      const l = _.value.trim().toLowerCase();
      l && (t = t.filter(
        (a) => b.value.some(
          (o) => String(O(a, o) ?? "").toLowerCase().includes(l)
        )
      ));
      for (const [a, o] of Object.entries(h)) {
        if (!o) continue;
        const s = b.value.find((n) => n.colId === a);
        if (s)
          if (o.startsWith("__eq__")) {
            const n = o.slice(6).toLowerCase();
            t = t.filter((f) => String(O(f, s) ?? "").toLowerCase() === n);
          } else {
            const n = o.toLowerCase();
            t = t.filter((f) => String(O(f, s) ?? "").toLowerCase().includes(n));
          }
      }
      if (x.value) {
        const { colId: a, dir: o } = x.value, s = b.value.find((n) => n.colId === a);
        s && (t = [...t].sort((n, f) => {
          const r = O(n, s), S = O(f, s);
          let P = 0;
          return s.colDef.comparator ? P = s.colDef.comparator(r, S) : typeof r == "number" && typeof S == "number" ? P = r - S : P = String(r ?? "").localeCompare(String(S ?? ""), void 0, { numeric: !0 }), o === "asc" ? P : -P;
        }));
      }
      return t;
    }), ne = E(
      () => Math.max(1, Math.ceil(V.value.length / B.value))
    ), Y = E(
      () => e.pagination ? V.value.slice(
        m.value * B.value,
        (m.value + 1) * B.value
      ) : V.value
    );
    q(V, () => {
      m.value = 0, i.value = null;
    }), q(B, () => {
      m.value = 0;
    });
    let J = !1, ge = "", Ie = 0, De = 0, ue = !1;
    function ze(t, l) {
      var a;
      J = !0, ge = t, Ie = l, De = ((a = w.value.find((o) => o.colId === t)) == null ? void 0 : a.width) ?? 100, ue = !1;
    }
    function Ce(t) {
      if (!J) return;
      const l = H.value, a = Math.max(30, De + (t.clientX - Ie)), o = b.value.filter((n) => n.colId !== ge).reduce((n, f) => n + f.width, 0), s = l - a;
      s > 10 && (g[ge] = Math.max(10, Math.round(a * o / s))), A();
    }
    function Se() {
      J && (J = !1, ue = !0, c("column-resized"));
    }
    const N = T(null), k = T(null);
    let F = null, Q = !1, pe, ke, X, ee, z;
    function Le() {
      if (!(!k.value || !N.value)) {
        z = document.createElement("canvas");
        try {
          F = new j.WebGLRenderer({ canvas: k.value, antialias: !1 });
        } catch {
          Q = !0;
        }
        if (!Q && !F.getContext() && (F.dispose(), F = null, Q = !0), Q) {
          de();
          return;
        }
        F.setPixelRatio(1), pe = new j.Scene(), ke = new j.OrthographicCamera(-1, 1, 1, -1, 0, 1), ee = new j.CanvasTexture(z), ee.minFilter = j.LinearFilter, ee.magFilter = j.LinearFilter, X = new j.ShaderMaterial({
          uniforms: {
            uTex: { value: ee },
            uStrength: { value: 0 },
            uScanlines: { value: 1 },
            uVignette: { value: 1 },
            uBezel: { value: new j.Color(0) }
          },
          vertexShader: ut,
          fragmentShader: dt
        }), pe.add(new j.Mesh(new j.PlaneGeometry(2, 2), X)), de();
      }
    }
    function de() {
      if (!N.value || !F && !Q) return;
      const t = N.value.clientWidth, l = N.value.clientHeight - (e.pagination ? ft : 0);
      !t || !l || (z.width = t, z.height = l, H.value = t, W.value = l, F ? F.setSize(t, l) : k.value && (k.value.width = t, k.value.height = l, k.value.style.width = t + "px", k.value.style.height = l + "px"), A());
    }
    function A() {
      var a, o, s, n, f, r, S, P;
      if (!(z != null && z.width)) return;
      if (Q) {
        if (!k.value) return;
        Pe(z, {
          cols: w.value,
          rows: Y.value,
          pinnedRows: u.value,
          rowHeight: e.rowHeight,
          scrollY: $.value,
          theme: e.theme,
          glow: !1,
          sortColId: ((a = x.value) == null ? void 0 : a.colId) ?? null,
          sortDir: ((o = x.value) == null ? void 0 : o.dir) ?? null,
          colFilters: h,
          hoveredRow: K.value,
          selectedRow: ((s = i.value) == null ? void 0 : s.row) ?? -1,
          selectedCol: ((n = i.value) == null ? void 0 : n.col) ?? -1,
          formatCell: U,
          getCellStyle: ae
        });
        const ie = k.value.getContext("2d");
        ie && ie.drawImage(z, 0, 0);
        return;
      }
      if (!F || !X || !ee) return;
      const t = oe[e.theme] ?? oe.none, l = e.theme === "paper";
      X.uniforms.uStrength.value = e.curvature / 45 * 0.55, X.uniforms.uScanlines.value = e.scanlines && !l ? 1 : 0, X.uniforms.uVignette.value = l ? 0 : 1, X.uniforms.uBezel.value.set(t.bg), Pe(z, {
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
        selectedRow: ((S = i.value) == null ? void 0 : S.row) ?? -1,
        selectedCol: ((P = i.value) == null ? void 0 : P.col) ?? -1,
        formatCell: U,
        getCellStyle: ae
      }), ee.needsUpdate = !0, F.render(pe, ke);
    }
    function Ee() {
      return e.curvature / 45 * 0.55;
    }
    function we(t) {
      if (!k.value) return [-1, -1];
      const l = k.value.getBoundingClientRect();
      return nt(
        t.clientX - l.left,
        t.clientY - l.top,
        k.value.width,
        k.value.height,
        Ee()
      );
    }
    let Re = 0;
    function We(t) {
      if (v.value = null, e.pagination) {
        const l = Date.now();
        if (l - Re < 120) return;
        Re = l, t.deltaY > 0 && m.value < ne.value - 1 ? (m.value++, i.value = null) : t.deltaY < 0 && m.value > 0 && (m.value--, i.value = null), A();
      } else {
        const l = u.value.length * e.rowHeight, a = W.value - R - l, o = Math.max(0, V.value.length * e.rowHeight - a);
        $.value = Math.max(0, Math.min(o, $.value + t.deltaY)), A();
      }
    }
    function Oe(t) {
      if (J) return;
      const [l, a] = we(t);
      if (l < 0) {
        K.value = -1, A();
        return;
      }
      const o = Be(
        l,
        a,
        w.value,
        Y.value.length,
        e.rowHeight,
        $.value,
        z.height,
        u.value.length
      );
      if (K.value = o.area === "body" ? o.rowIdx : -1, o.area === "header" && o.colIdx >= 0) {
        const s = w.value[o.colIdx], n = ye(o.colIdx, w.value);
        k.value.style.cursor = s && Fe(l, n, s.width) ? "col-resize" : "pointer";
      } else o.area === "body" ? k.value.style.cursor = "pointer" : k.value.style.cursor = "default";
      A();
    }
    function $e() {
      K.value = -1, A();
    }
    function Ue(t) {
      const [l, a] = we(t);
      if (!(l < 0 || a >= R))
        for (let o = 0; o < w.value.length; o++) {
          const s = w.value[o], n = ye(o, w.value);
          if (s.colDef.resizable !== !1 && Fe(l, n, s.width)) {
            ze(s.colId, t.clientX);
            return;
          }
        }
    }
    function Ye(t) {
      var s, n, f;
      if (ue) {
        ue = !1;
        return;
      }
      if (J) return;
      const [l, a] = we(t);
      if (l < 0) {
        v.value = null;
        return;
      }
      const o = Be(
        l,
        a,
        w.value,
        Y.value.length,
        e.rowHeight,
        $.value,
        z.height,
        u.value.length
      );
      if (o.area === "header" && o.colIdx >= 0) {
        const r = w.value[o.colIdx], S = ye(o.colIdx, w.value);
        r.colDef.filter && rt(l, S, r.width) ? v.value === r.colId ? v.value = null : (v.value = r.colId, y.value = (s = h[r.colId]) != null && s.startsWith("__eq__") ? h[r.colId].slice(6) : h[r.colId] ?? "", I.value = { x: Math.max(0, S), y: R }) : r.colDef.sortable !== !1 && (v.value = null, x.value = ((n = x.value) == null ? void 0 : n.colId) === r.colId ? x.value.dir === "asc" ? { colId: r.colId, dir: "desc" } : null : { colId: r.colId, dir: "asc" }, c("sort-changed"));
        return;
      }
      if (v.value = null, o.area === "body" && o.rowIdx >= 0 && o.colIdx >= 0) {
        i.value = { row: o.rowIdx, col: o.colIdx }, (f = k.value) == null || f.focus();
        const r = Y.value[o.rowIdx], S = w.value[o.colIdx];
        r && S && (c("row-clicked", { data: r, event: t }), c("cell-selected", { data: r, row: o.rowIdx, col: o.colIdx, colId: S.colId }));
      }
    }
    function Te(t) {
      var l, a;
      v.value && ((a = (l = t.target).closest) != null && a.call(l, ".cathode-filter-popup") || (v.value = null));
    }
    function je(t) {
      var ie;
      const l = w.value, a = Y.value, o = l.length - 1, s = a.length - 1;
      if (!i.value) {
        ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(t.key) && (t.preventDefault(), i.value = { row: 0, col: 0 });
        return;
      }
      let { row: n, col: f } = i.value;
      const r = (fe, ve) => {
        n = Math.max(0, Math.min(s, fe)), f = Math.max(0, Math.min(o, ve)), i.value = { row: n, col: f };
      }, S = () => {
        m.value > 0 && (m.value--, r(B.value - 1, f));
      }, P = () => {
        m.value < ne.value - 1 && (m.value++, r(0, f));
      };
      switch (t.key) {
        case "ArrowDown":
          t.preventDefault(), n < s ? r(n + 1, f) : P();
          break;
        case "ArrowUp":
          t.preventDefault(), n > 0 ? r(n - 1, f) : S();
          break;
        case "ArrowRight":
          t.preventDefault(), f < o ? r(n, f + 1) : n < s ? r(n + 1, 0) : P();
          break;
        case "ArrowLeft":
          t.preventDefault(), f > 0 ? r(n, f - 1) : n > 0 ? r(n - 1, o) : S();
          break;
        case "Tab":
          t.preventDefault(), t.shiftKey ? f > 0 ? r(n, f - 1) : n > 0 ? r(n - 1, o) : S() : f < o ? r(n, f + 1) : n < s ? r(n + 1, 0) : P();
          break;
        case "Enter":
          t.preventDefault(), t.shiftKey ? n > 0 ? r(n - 1, f) : S() : n < s ? r(n + 1, f) : P();
          break;
        case "Home":
          t.preventDefault(), t.ctrlKey || t.metaKey ? (m.value = 0, r(0, 0)) : r(n, 0);
          break;
        case "End":
          t.preventDefault(), t.ctrlKey || t.metaKey ? (m.value = ne.value - 1, be(() => r(Y.value.length - 1, o))) : r(n, o);
          break;
        case "PageDown":
          t.preventDefault(), P();
          break;
        case "PageUp":
          t.preventDefault(), S();
          break;
        case "Escape":
          i.value = null;
          break;
        case "c":
        case "C":
          if (t.ctrlKey || t.metaKey) {
            t.preventDefault();
            const fe = a[n], ve = l[f];
            if (fe && ve) {
              const Ze = U(ve, fe);
              (ie = navigator.clipboard) == null || ie.writeText(Ze).catch(() => {
              });
            }
          }
          break;
      }
    }
    function Ge(t) {
      const l = t.target.value;
      y.value = l, l ? h[v.value] = l : delete h[v.value], m.value = 0, c("filter-changed");
    }
    function _e() {
      v.value && delete h[v.value], y.value = "", v.value = null, m.value = 0, c("filter-changed");
    }
    const Ke = {
      setGridOption(t, l) {
        t === "rowData" ? C.value = l : t === "pinnedBottomRowData" ? u.value = l : t === "quickFilterText" && (_.value = l);
      },
      getColumnState() {
        return e.columnDefs.map((t) => {
          var a, o;
          const l = D(t);
          return {
            colId: l,
            hide: M.has(l),
            sort: ((a = x.value) == null ? void 0 : a.colId) === l ? x.value.dir : null,
            sortIndex: ((o = x.value) == null ? void 0 : o.colId) === l ? 0 : null,
            width: g[l] ?? t.width
          };
        });
      },
      applyColumnState({ state: t }) {
        for (const l of t)
          l.hide === !0 && M.add(l.colId), l.hide === !1 && M.delete(l.colId), l.sort && (x.value = { colId: l.colId, dir: l.sort }), l.width && (g[l.colId] = l.width);
      },
      setFilterModel(t) {
        for (const l of Object.keys(h)) delete h[l];
        if (t)
          for (const [l, a] of Object.entries(t))
            (a == null ? void 0 : a.type) === "equals" ? h[l] = `__eq__${a.filter}` : a != null && a.filter && (h[l] = a.filter);
      },
      getFilterModel() {
        const t = {};
        for (const [l, a] of Object.entries(h))
          a && (t[l] = a.startsWith("__eq__") ? { type: "equals", filter: a.slice(6) } : { type: "contains", filter: a });
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
        const l = b.value, a = l.map((f) => f.colDef.headerName ?? f.colId).join(","), o = V.value.map(
          (f) => l.map((r) => `"${String(U(r, f)).replace(/"/g, '""')}"`).join(",")
        ), s = new Blob([[a, ...o].join(`
`)], { type: "text/csv" }), n = URL.createObjectURL(s);
        Object.assign(document.createElement("a"), { href: n, download: t }).click(), URL.revokeObjectURL(n);
      },
      resize() {
        de();
      },
      resetColumnState() {
        M.clear();
        for (const l of e.columnDefs)
          l.hide && M.add(D(l));
        const t = e.columnDefs.find((l) => l.sort);
        x.value = t ? { colId: D(t), dir: t.sort } : null;
        for (const l of Object.keys(g)) delete g[l];
        for (const l of Object.keys(h)) delete h[l];
        _.value = "", $.value = 0, m.value = 0, i.value = null, v.value = null;
      }
    };
    q(
      [Y, () => u.value, w, $, K, i],
      () => be(A)
    ), q(() => e.theme, () => A()), q(() => e.curvature, () => A()), q(() => e.scanlines, () => A()), q(() => e.glow, () => A()), q(i, (t) => {
      if (!t) return;
      const l = Y.value[t.row], a = w.value[t.col];
      l && a && c("cell-selected", { data: l, row: t.row, col: t.col, colId: a.colId });
    });
    let re = null, me = 0;
    Qe(() => {
      for (const t of e.columnDefs)
        t.hide && M.add(D(t)), t.sort && !x.value && (x.value = { colId: D(t), dir: t.sort });
      C.value = e.rowData ?? [], u.value = e.pinnedBottomRowData ?? [], document.addEventListener("click", Te), document.addEventListener("mousemove", Ce), document.addEventListener("mouseup", Se), be(() => {
        Le(), N.value && (re = new ResizeObserver(() => {
          cancelAnimationFrame(me), me = requestAnimationFrame(de);
        }), re.observe(N.value)), c("grid-ready", { api: Ke });
      });
    }), et(() => {
      document.removeEventListener("click", Te, !0), document.removeEventListener("mousemove", Ce), document.removeEventListener("mouseup", Se), re == null || re.disconnect(), cancelAnimationFrame(me), F == null || F.dispose();
    });
    const L = E(() => oe[e.theme] ?? oe.none), qe = E(() => ({
      position: "absolute",
      left: `${I.value.x}px`,
      top: `${I.value.y}px`,
      zIndex: 100,
      background: L.value.headerBg,
      border: `1px solid ${L.value.accent}`,
      color: L.value.text,
      boxShadow: "0 4px 14px rgba(0,0,0,0.55)",
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "5px",
      minWidth: "160px"
    })), Ve = E(() => ({
      background: L.value.bg,
      border: `1px solid ${L.value.border}`,
      color: L.value.text,
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: "11px",
      padding: "3px 7px",
      borderRadius: "2px",
      outline: "none",
      flex: "1"
    })), Ne = E(() => ({
      background: L.value.headerBg,
      borderTop: `1px solid ${L.value.border}`,
      color: L.value.text
    })), Xe = E(() => ({
      background: L.value.bg
    })), Me = E(() => L.value.accent);
    return (t, l) => {
      var a, o;
      return ce(), se("div", {
        ref_key: "wrapEl",
        ref: N,
        class: "cathode-wrap",
        style: Z(Xe.value)
      }, [
        te("canvas", {
          ref_key: "canvasEl",
          ref: k,
          class: "cathode-canvas",
          tabindex: "0",
          onWheel: He(We, ["prevent"]),
          onMousemove: Oe,
          onMouseleave: $e,
          onMousedown: Ue,
          onClick: Ye,
          onKeydown: je
        }, null, 544),
        v.value ? (ce(), se("div", {
          key: 0,
          class: "cathode-filter-popup",
          style: Z(qe.value),
          onClick: l[0] || (l[0] = He(() => {
          }, ["stop"]))
        }, [
          te("input", {
            style: Z(Ve.value),
            value: y.value,
            placeholder: "Filter…",
            autofocus: "",
            onInput: Ge,
            onKeydown: tt(_e, ["escape"])
          }, null, 44, it),
          y.value ? (ce(), se("button", {
            key: 0,
            style: Z({
              background: "none",
              border: "none",
              color: L.value.text,
              opacity: "0.55",
              cursor: "pointer",
              fontSize: "11px",
              padding: "0 4px"
            }),
            onClick: _e
          }, "✕", 4)) : he("", !0)
        ], 4)) : he("", !0),
        p.pagination ? (ce(), se("div", {
          key: 1,
          class: "cathode-pagination",
          style: Z(Ne.value)
        }, [
          te("button", {
            disabled: m.value === 0,
            onClick: l[1] || (l[1] = (s) => {
              m.value--, i.value = null, A();
            })
          }, "◀", 8, ct),
          te("span", null, le(m.value + 1) + " / " + le(ne.value), 1),
          te("button", {
            disabled: m.value >= ne.value - 1,
            onClick: l[2] || (l[2] = (s) => {
              m.value++, i.value = null, A();
            })
          }, "▶", 8, st),
          te("span", {
            class: "cathode-page-info",
            style: Z({ color: Me.value })
          }, le(V.value.length.toLocaleString()) + " rows · " + le(B.value) + " per page ", 5),
          i.value ? (ce(), se("span", {
            key: 0,
            class: "cathode-sel-readout",
            style: Z({ color: Me.value })
          }, le(((a = w.value[i.value.col]) == null ? void 0 : a.colDef.headerName) ?? ((o = w.value[i.value.col]) == null ? void 0 : o.colId)) + " : " + le(U(w.value[i.value.col], Y.value[i.value.row])), 5)) : he("", !0)
        ], 4)) : he("", !0)
      ], 4);
    };
  }
}), ht = (p, d) => {
  const e = p.__vccOpts || p;
  for (const [c, C] of d)
    e[c] = C;
  return e;
}, pt = /* @__PURE__ */ ht(vt, [["__scopeId", "data-v-0bb7072e"]]);
export {
  pt as CathodeGrid
};
