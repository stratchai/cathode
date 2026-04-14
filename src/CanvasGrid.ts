/**
 * CanvasGrid.ts — canvas2d grid renderer for cathode
 *
 * Draws the full grid (header + rows + pinned) to an HTMLCanvasElement.
 * The canvas is used as a THREE.CanvasTexture fed to the barrel-distortion shader.
 */

import type { CSSProperties } from 'vue'
import type { ResolvedCol } from './types'

// ── Theme palettes ─────────────────────────────────────────────────────────────

export interface GridColors {
  bg:         string
  headerBg:   string
  text:       string
  textHeader: string
  border:     string
  accent:     string   // selection highlight / active filter
  rowAlt:     string   // alternating row tint (subtle)
}

export const THEME_COLORS: Record<string, GridColors> = {
  none: {
    bg: '#111827', headerBg: '#12122a',
    text: '#e8f2ff', textHeader: '#6a90b8', border: '#2a3a50',
    accent: '#40a0f0', rowAlt: 'rgba(255,255,255,0.018)',
  },
  phosphor: {
    bg: '#060d06', headerBg: '#030703',
    text: '#33ff33', textHeader: '#00cc00', border: '#0a250a',
    accent: '#80ff80', rowAlt: 'rgba(51,255,51,0.025)',
  },
  amber: {
    bg: '#0a0700', headerBg: '#060400',
    text: '#ffb000', textHeader: '#ffd000', border: '#2a1500',
    accent: '#ffd060', rowAlt: 'rgba(255,176,0,0.025)',
  },
  paper: {
    bg: '#f6f6f6', headerBg: '#ffffff',
    text: '#222222', textHeader: '#158cba', border: '#dee2e6',
    accent: '#158cba', rowAlt: 'rgba(21,140,186,0.04)',
  },
}

export const HEADER_H  = 30
const FONT_SIZE        = 12
const HDR_FONT_SIZE    = 10

// ── Draw options ───────────────────────────────────────────────────────────────

export interface DrawGridOpts {
  cols:         ResolvedCol[]
  rows:         any[]
  pinnedRows:   any[]
  rowHeight:    number
  scrollY:      number        // vertical scroll offset (px) — 0 when auto-fit
  theme:        string
  glow:         boolean
  sortColId:    string | null
  sortDir:      'asc' | 'desc' | null
  colFilters:   Record<string, string>
  hoveredRow:   number        // index in rows, -1 = none
  selectedRow:  number        // index in rows, -1 = none
  selectedCol:  number        // index in cols, -1 = none
  formatCell:   (col: ResolvedCol, row: any) => string
  getCellStyle: (col: ResolvedCol, row: any) => CSSProperties
}

// ── Main draw ──────────────────────────────────────────────────────────────────

export function drawGrid(canvas: HTMLCanvasElement, opts: DrawGridOpts): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const W = canvas.width
  const H = canvas.height
  const c = THEME_COLORS[opts.theme] ?? THEME_COLORS['none']
  const { cols, rows, pinnedRows, rowHeight, scrollY, glow } = opts

  // ── Background ──────────────────────────────────────────────────────────────
  ctx.fillStyle = c.bg
  ctx.fillRect(0, 0, W, H)

  const pinnedH  = pinnedRows.length * rowHeight
  const bodyH    = H - HEADER_H - pinnedH

  // ── Header ───────────────────────────────────────────────────────────────────
  ctx.fillStyle = c.headerBg
  ctx.fillRect(0, 0, W, HEADER_H)

  ctx.textBaseline = 'middle'
  ctx.textAlign    = 'left'

  let hx = 0
  for (let ci = 0; ci < cols.length; ci++) {
    const col       = cols[ci]
    const hasFilter = !!opts.colFilters[col.colId]
    const isSort    = opts.sortColId === col.colId
    const label     = (col.colDef.headerName ?? col.colId).toUpperCase()

    ctx.save()
    ctx.beginPath()
    ctx.rect(hx, 0, col.width, HEADER_H)
    ctx.clip()

    ctx.font      = `bold ${HDR_FONT_SIZE}px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = hasFilter ? c.accent : c.textHeader
    if (glow) { ctx.shadowBlur = 6; ctx.shadowColor = c.textHeader }
    ctx.fillText(label, hx + 8, HEADER_H / 2)
    ctx.shadowBlur = 0

    // Sort arrow
    if (isSort) {
      const tw = ctx.measureText(label).width
      ctx.font      = `8px system-ui, -apple-system, sans-serif`
      ctx.fillStyle = c.accent
      ctx.fillText(opts.sortDir === 'asc' ? '▲' : '▼', hx + 8 + tw + 4, HEADER_H / 2)
    }

    // Filter icon
    if (col.colDef.filter) {
      ctx.font        = `13px system-ui, -apple-system, sans-serif`
      ctx.fillStyle   = hasFilter ? c.accent : c.textHeader
      ctx.globalAlpha = hasFilter ? 1.0 : 0.38
      ctx.fillText('⌕', hx + col.width - 20, HEADER_H / 2)
      ctx.globalAlpha = 1.0
    }

    ctx.restore()

    ctx.strokeStyle = c.border
    ctx.lineWidth   = 1
    ctx.beginPath()
    ctx.moveTo(hx + col.width - 0.5, 0)
    ctx.lineTo(hx + col.width - 0.5, HEADER_H)
    ctx.stroke()

    hx += col.width
  }

  // Header bottom border
  ctx.strokeStyle = c.border
  ctx.lineWidth   = 1
  ctx.beginPath()
  ctx.moveTo(0, HEADER_H - 0.5)
  ctx.lineTo(W, HEADER_H - 0.5)
  ctx.stroke()

  // ── Data rows ─────────────────────────────────────────────────────────────────
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, HEADER_H, W, bodyH)
  ctx.clip()

  const startRow = Math.max(0, Math.floor(scrollY / rowHeight))
  const endRow   = Math.min(rows.length, Math.ceil((scrollY + bodyH) / rowHeight))

  for (let ri = startRow; ri < endRow; ri++) {
    const row = rows[ri]
    const ry  = HEADER_H + ri * rowHeight - scrollY

    // Alternating row tint
    if (ri % 2 === 1) {
      ctx.fillStyle = c.rowAlt
      ctx.fillRect(0, ry, W, rowHeight)
    }

    // Hover
    if (ri === opts.hoveredRow && ri !== opts.selectedRow) {
      ctx.fillStyle = 'rgba(255,255,255,0.045)'
      ctx.fillRect(0, ry, W, rowHeight)
    }

    // Selected row tint
    if (ri === opts.selectedRow) {
      ctx.fillStyle = hexToRgba(c.accent, 0.10)
      ctx.fillRect(0, ry, W, rowHeight)
    }

    // Row bottom border
    ctx.strokeStyle = c.border
    ctx.lineWidth   = 1
    ctx.beginPath()
    ctx.moveTo(0, ry + rowHeight - 0.5)
    ctx.lineTo(W, ry + rowHeight - 0.5)
    ctx.stroke()

    // Cells
    let cx = 0
    for (let ci = 0; ci < cols.length; ci++) {
      const col       = cols[ci]
      const rawStyle  = opts.getCellStyle(col, row)
      const textColor = (rawStyle.color as string) ?? c.text
      const align     = (rawStyle.textAlign as string) ?? 'left'
      const text      = opts.formatCell(col, row)

      ctx.save()
      ctx.beginPath()
      ctx.rect(cx + 1, ry, col.width - 2, rowHeight)
      ctx.clip()

      ctx.font         = `${FONT_SIZE}px system-ui, -apple-system, sans-serif`
      ctx.fillStyle    = textColor
      ctx.textBaseline = 'middle'
      if (glow) { ctx.shadowBlur = 4; ctx.shadowColor = textColor }

      if (align === 'right') {
        ctx.textAlign = 'right'
        ctx.fillText(text, cx + col.width - 8, ry + rowHeight / 2)
      } else {
        ctx.textAlign = 'left'
        ctx.fillText(text, cx + 8, ry + rowHeight / 2)
      }
      ctx.shadowBlur = 0
      ctx.restore()

      // Selected cell border — drawn OVER text
      if (ri === opts.selectedRow && ci === opts.selectedCol) {
        ctx.strokeStyle = c.accent
        ctx.lineWidth   = 2
        ctx.strokeRect(cx + 1.5, ry + 1.5, col.width - 3, rowHeight - 3)
      }

      // Cell right border
      ctx.strokeStyle = c.border
      ctx.lineWidth   = 1
      ctx.beginPath()
      ctx.moveTo(cx + col.width - 0.5, ry)
      ctx.lineTo(cx + col.width - 0.5, ry + rowHeight)
      ctx.stroke()

      cx += col.width
    }
  }

  ctx.restore()

  // ── Pinned rows ───────────────────────────────────────────────────────────────
  if (pinnedRows.length > 0) {
    const pinnedY = H - pinnedH

    ctx.strokeStyle = c.border
    ctx.lineWidth   = 1
    ctx.beginPath()
    ctx.moveTo(0, pinnedY - 0.5)
    ctx.lineTo(W, pinnedY - 0.5)
    ctx.stroke()

    for (let ri = 0; ri < pinnedRows.length; ri++) {
      const row = pinnedRows[ri]
      const ry  = pinnedY + ri * rowHeight

      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      ctx.fillRect(0, ry, W, rowHeight)

      let cx = 0
      for (let ci = 0; ci < cols.length; ci++) {
        const col       = cols[ci]
        const rawStyle  = opts.getCellStyle(col, row)
        const textColor = (rawStyle.color as string) ?? c.text
        const align     = (rawStyle.textAlign as string) ?? 'left'
        const text      = opts.formatCell(col, row)

        ctx.save()
        ctx.beginPath()
        ctx.rect(cx + 1, ry, col.width - 2, rowHeight)
        ctx.clip()

        ctx.font         = `bold ${FONT_SIZE}px system-ui, -apple-system, sans-serif`
        ctx.fillStyle    = textColor
        ctx.textBaseline = 'middle'

        if (align === 'right') {
          ctx.textAlign = 'right'
          ctx.fillText(text, cx + col.width - 8, ry + rowHeight / 2)
        } else {
          ctx.textAlign = 'left'
          ctx.fillText(text, cx + 8, ry + rowHeight / 2)
        }
        ctx.restore()

        ctx.strokeStyle = c.border
        ctx.lineWidth   = 1
        ctx.beginPath()
        ctx.moveTo(cx + col.width - 0.5, ry)
        ctx.lineTo(cx + col.width - 0.5, ry + rowHeight)
        ctx.stroke()

        cx += col.width
      }

      ctx.strokeStyle = c.border
      ctx.lineWidth   = 1
      ctx.beginPath()
      ctx.moveTo(0, ry + rowHeight - 0.5)
      ctx.lineTo(W, ry + rowHeight - 0.5)
      ctx.stroke()
    }
  }

  // ── Focus ring — faint border when canvas has focus ───────────────────────────
  // (drawn last so it's always on top)
}

// ── Utilities ──────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  // Handles #rrggbb and rgba(...) passthrough
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) {
    return hex.replace(/[\d.]+\)$/, `${alpha})`)
  }
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// ── Barrel-distortion hit-testing ─────────────────────────────────────────────

/**
 * Forward barrel formula — same as the GLSL shader.
 * UV: x∈[0,1] left→right, y∈[0,1] bottom→top (Three.js convention).
 */
export function applyBarrel(uvX: number, uvY: number, strength: number): [number, number] {
  const ccX  = uvX - 0.5
  const ccY  = uvY - 0.5
  const dist = (ccX * ccX + ccY * ccY) * strength
  return [uvX + ccX * (1 + dist) * dist, uvY + ccY * (1 + dist) * dist]
}

/**
 * Map a screen pixel (sx, sy — y=0 at top of canvas element) to the
 * offscreen canvas2d coordinate that is visually displayed there.
 * Returns [-1,-1] when the position is in the black bezel region.
 */
export function screenToCanvas(
  sx: number, sy: number,
  W:  number, H:  number,
  strength: number,
): [number, number] {
  const uvX = sx / W
  const uvY = 1 - sy / H                          // Three.js UV: y=1 at top

  const [buvX, buvY] = applyBarrel(uvX, uvY, strength)

  if (buvX < 0 || buvX > 1 || buvY < 0 || buvY > 1) return [-1, -1]

  // flipY=true (Three.js default): UV y=1 → canvas row 0 (top)
  return [buvX * W, (1 - buvY) * H]
}

// ── Column geometry (no horizontal scroll — cols fill width) ──────────────────

/** Canvas-space left edge of column ci (scrollX removed — always 0) */
export function colLeft(ci: number, cols: ResolvedCol[]): number {
  let x = 0
  for (let i = 0; i < ci; i++) x += cols[i].width
  return x
}

/** Is canvas x over the filter icon (right 24px) of a column? */
export function isOnFilterIcon(cx: number, colStartX: number, colWidth: number): boolean {
  return cx >= colStartX + colWidth - 24 && cx < colStartX + colWidth
}

/** Is canvas x over the resize handle (right 6px) of a column? */
export function isOnResizeHandle(cx: number, colStartX: number, colWidth: number): boolean {
  const right = colStartX + colWidth
  return cx >= right - 6 && cx <= right + 1
}

/** Hit-test a canvas-space coordinate → grid location */
export function hitTest(
  cx: number, cy: number,
  cols:        ResolvedCol[],
  rowCount:    number,
  rowHeight:   number,
  scrollY:     number,
  canvasH:     number,
  pinnedCount: number,
): { area: 'header' | 'body' | 'pinned' | 'none', colIdx: number, rowIdx: number } {
  let colIdx = -1
  let x = 0
  for (let ci = 0; ci < cols.length; ci++) {
    if (cx >= x && cx < x + cols[ci].width) { colIdx = ci; break }
    x += cols[ci].width
  }

  if (cy < HEADER_H) return { area: 'header', colIdx, rowIdx: -1 }

  const pinnedH = pinnedCount * rowHeight
  if (pinnedH > 0 && cy >= canvasH - pinnedH) {
    const rowIdx = Math.floor((cy - (canvasH - pinnedH)) / rowHeight)
    return { area: 'pinned', colIdx, rowIdx }
  }

  const bodyY  = cy - HEADER_H + scrollY
  const rowIdx = Math.floor(bodyY / rowHeight)
  if (rowIdx >= 0 && rowIdx < rowCount) return { area: 'body', colIdx, rowIdx }

  return { area: 'none', colIdx: -1, rowIdx: -1 }
}
