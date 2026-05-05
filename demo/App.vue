<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import CathodeGrid      from '../src/CathodeGrid.vue'
import CathodeLog       from '../src/CathodeLog.vue'
import CathodeCandle     from '../src/CathodeCandle.vue'
import CathodeTerminal   from '../src/CathodeTerminal.vue'
import CathodeWorkspace from '../src/CathodeWorkspace.vue'
import CathodeContainer from '../src/CathodeContainer.vue'
import CathodeLoader    from '../src/CathodeLoader.vue'
import { buildDefaultLayout } from '../src/useCathodeLayout'
import type { ColDef, GridApi } from '../src/types'
import type { ContainerState } from '../src/useCathodeLayout'
import type { LogEntry } from '../src/CanvasLog'
import type { OHLCVCandle, PriceOverlay, TradeMarker } from '../src/CanvasCandle'

// ── Shared state ──────────────────────────────────────────────────────────────
type DemoTab = 'grid' | 'workspace' | 'log' | 'candle' | 'terminal'
const activeTab = ref<DemoTab>('workspace')

type Theme = 'none' | 'phosphor' | 'amber' | 'paper'
const theme    = ref<Theme>('none')
const isDark   = computed(() => theme.value !== 'paper')

// ── Mock data ─────────────────────────────────────────────────────────────────
const STRATEGIES = [
  'momentum_breakout_daily', 'ema_adx_daily', 'hh_hl_trend_follow_daily',
  'keltner_breakout_daily',  'donchian_breakout_daily', 'hma_trend_daily',
  'adx_psar_daily',          'bull_flag_breakout_long_stock_daily',
]
const PRODUCTS  = ['BTC-USD','ETH-USD','SOL-USD','AAPL','NVDA','MSFT','TSLA','AMZN','META','GOOGL']
const EXCHANGES = ['coinbase','coinbase','coinbase','alpaca','alpaca','alpaca','alpaca','alpaca','alpaca','alpaca']

function rnd(min: number, max: number) { return +(Math.random() * (max - min) + min).toFixed(4) }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function fmtDate(d: Date) { return d.toISOString().replace('T', ' ').slice(0, 19) }

const now = Date.now()
const REGIMES  = ['trending', 'ranging', 'volatile']
const SESSIONS = ['NY', 'London', 'Tokyo', 'AH']

const trades = Array.from({ length: 240 }, (_, i) => {
  const idx        = i % PRODUCTS.length
  const product    = PRODUCTS[idx]
  const exchange   = EXCHANGES[idx]
  const strategy   = pick(STRATEGIES)
  const entryMs    = now - Math.floor(Math.random() * 30 * 24 * 3600_000)
  const isOpen     = Math.random() < 0.15
  const entryPrice = rnd(10, 3000)
  const pnlPct     = rnd(-8, 22)
  const netPnlPct  = +(pnlPct - 0.12).toFixed(4)
  const notional   = +(entryPrice * rnd(0.2, 2)).toFixed(2)
  const exitMs     = isOpen ? null : entryMs + Math.floor(Math.random() * 15 * 24 * 3600_000)
  return {
    timestamp:       fmtDate(new Date(entryMs)),
    entry_timestamp: fmtDate(new Date(entryMs)),
    exit_timestamp:  exitMs ? fmtDate(new Date(exitMs)) : '',
    product, strategy, exchange,
    status:          isOpen ? 'open' : 'closed',
    entry_price:     entryPrice.toFixed(4),
    exit_price:      isOpen ? '' : rnd(entryPrice * 0.92, entryPrice * 1.25).toFixed(4),
    pnl_pct:         pnlPct.toFixed(4),
    net_pnl_pct:     netPnlPct.toFixed(4),
    size_base:       rnd(0.001, 2).toFixed(6),
    notional:        notional.toFixed(2),
    reason:          isOpen ? '' : pick(['tp_hit','sl_hit','timeout','manual']),
    take_profit_pct: rnd(10, 25).toFixed(2),
    rsi_at_entry:    rnd(20, 80).toFixed(1),
    slippage_pct:    (Math.random() * 0.08).toFixed(3),
    drawdown_pct:    (-Math.random() * 5).toFixed(2),
    mae_pct:         (-Math.random() * 3).toFixed(2),
    mfe_pct:         (Math.random() * 8).toFixed(2),
    hold_days:       Math.floor(Math.random() * 14 + 1),
    vol_score:       (Math.random() * 10).toFixed(1),
    regime:          pick(REGIMES),
    session:         pick(SESSIONS),
  }
})

// ── Grid tab ──────────────────────────────────────────────────────────────────
const NUM = (d: number) => (p: any) =>
  (p.value !== '' && p.value != null && !isNaN(Number(p.value))) ? Number(p.value).toFixed(d) : ''
const PCT = (p: any) =>
  (p.value !== '' && p.value != null && !isNaN(Number(p.value))) ? Number(p.value).toFixed(2) + '%' : '—'
const RIGHT = { textAlign: 'right' as const }

function fmtDuration(p: any): string {
  const entry = p.data?.entry_timestamp; const exit = p.data?.exit_timestamp
  if (!entry || !exit) return '—'
  const ms = new Date(exit).getTime() - new Date(entry).getTime()
  if (ms < 0) return '—'
  const h = Math.floor(ms / 3_600_000); const m = Math.floor((ms % 3_600_000) / 60_000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const columnDefs: ColDef[] = [
  { headerName: 'Entry Time',  width: 148, sort: 'desc', valueGetter: (p) => p.data.entry_timestamp || p.data.timestamp || '' },
  { headerName: 'Exit Time',   width: 148, valueGetter: (p) => p.data.exit_timestamp || '' },
  { headerName: 'Duration',    width: 80,  valueFormatter: fmtDuration, cellStyle: { ...RIGHT, color: '#7a90a8' } },
  { headerName: 'Status',      width: 72,  filter: true, valueGetter: (p) => p.data.status ?? 'closed',
    cellStyle: (p) => ({ color: p.value === 'open' ? '#00bc8c' : '#e74c3c' }),
    aggFunc: 'count', aggValueFormatter: (n) => `${n} rows` },
  { field: 'product',      width: 105, filter: true },
  { field: 'exchange',     width: 82,  filter: true },
  { field: 'strategy',     width: 220, filter: true },
  { field: 'entry_price',  width: 100, headerName: 'Entry',     valueFormatter: NUM(4), cellStyle: RIGHT },
  { field: 'exit_price',   width: 100, headerName: 'Exit',      valueFormatter: NUM(4), cellStyle: RIGHT },
  { field: 'size_base',    width: 88,  headerName: 'Size',      valueFormatter: NUM(4), cellStyle: RIGHT },
  { field: 'notional',     width: 88,  headerName: 'Notional',  valueFormatter: NUM(2), cellStyle: RIGHT,
    aggFunc: 'sum', aggValueFormatter: (v) => Number(v).toFixed(2) },
  { field: 'pnl_pct',      width: 80,  headerName: 'PnL %',     valueFormatter: PCT,
    cellStyle: (p) => ({ ...RIGHT, color: Number(p.value) >= 0 ? '#00bc8c' : '#e74c3c' }),
    aggFunc: 'avg', aggValueFormatter: (v) => `${Number(v).toFixed(2)}%` },
  { field: 'net_pnl_pct',  width: 88,  headerName: 'Net PnL %', valueFormatter: PCT,
    cellStyle: (p) => ({ ...RIGHT, color: Number(p.value) >= 0 ? '#00bc8c' : '#e74c3c' }),
    aggFunc: 'avg', aggValueFormatter: (v) => `${Number(v).toFixed(2)}%` },
  { field: 'take_profit_pct', width: 72, headerName: 'TP %',    valueFormatter: PCT, cellStyle: RIGHT },
  { field: 'rsi_at_entry',    width: 68, headerName: 'RSI',     valueFormatter: NUM(1), cellStyle: (p) => ({
      ...RIGHT,
      color: Number(p.value) > 65 ? '#e74c3c' : Number(p.value) < 35 ? '#00bc8c' : '#7a90a8',
    }),
    aggFunc: 'avg', aggValueFormatter: (v) => Number(v).toFixed(1) },
  { field: 'reason',          width: 88, filter: true },
  { headerName: 'Slippage %', width: 72, field: 'slippage_pct', cellStyle: RIGHT },
  { headerName: 'Commission', width: 88, valueGetter: (p) => (Number(p.data.notional)*0.0005).toFixed(4), cellStyle: RIGHT,
    aggFunc: 'sum', aggValueFormatter: (v) => Number(v).toFixed(4) },
  { headerName: 'Drawdown %', width: 84, field: 'drawdown_pct', cellStyle: { ...RIGHT, color: '#e74c3c' },
    aggFunc: 'min', aggValueFormatter: (v) => `${Number(v).toFixed(2)}%` },
  { headerName: 'MAE %',      width: 72, field: 'mae_pct',      cellStyle: { ...RIGHT, color: '#e74c3c' },
    aggFunc: 'min', aggValueFormatter: (v) => `${Number(v).toFixed(2)}%` },
  { headerName: 'MFE %',      width: 72, field: 'mfe_pct',      cellStyle: { ...RIGHT, color: '#00bc8c' },
    aggFunc: 'max', aggValueFormatter: (v) => `${Number(v).toFixed(2)}%` },
  { headerName: 'Hold Days',  width: 76, field: 'hold_days',    cellStyle: RIGHT,
    aggFunc: 'avg', aggValueFormatter: (v) => Number(v).toFixed(1) },
  { headerName: 'Vol Score',  width: 76, field: 'vol_score',    cellStyle: RIGHT },
  { headerName: 'Regime',     width: 82, field: 'regime',  filter: true },
  { headerName: 'Session',    width: 76, field: 'session', filter: true },
]

const defaultColDef: ColDef = { resizable: true, sortable: true }
const gridApi    = ref<GridApi | null>(null)
const curvature  = ref(25)
const scanlines  = ref(true)
const magnify    = ref(false)
// Force every panel into the CathodeLoader state — lets visitors see the
// boot/loading placeholder applied across the whole UI on demand. Real
// consumers gate the loader on actual readiness; this just exposes it.
const showLoaders = ref(false)

// ── Mobile-mode breakpoint ───────────────────────────────────────────────────
// Below 720px: hide the Workspace tab (its 4-canvas layout stresses mobile
// browsers' WebGL-context cap, plus drag-resize panels don't translate to
// touch without explicit handlers — separate scope), wrap the toolbar onto
// multiple rows, and tighten .tab-content padding so each canvas gets the
// max usable pixels.
const MOBILE_BREAKPOINT_PX = 720
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
const isMobile    = computed(() => windowWidth.value < MOBILE_BREAKPOINT_PX)

function onWindowResize() { windowWidth.value = window.innerWidth }
onMounted(()   => window.addEventListener('resize', onWindowResize))
onUnmounted(() => window.removeEventListener('resize', onWindowResize))

// If we're in mobile mode and the workspace tab was the active selection
// (e.g. from before a viewport shrink, or because workspace was the demo
// default), kick the user to the Grid tab so they're not stranded looking
// at a hidden panel.
watch(isMobile, (mobile) => {
  if (mobile && activeTab.value === 'workspace') activeTab.value = 'grid'
}, { immediate: true })
const glow       = ref(false)
const quickText  = ref('')
const statusFilt = ref<'all' | 'open' | 'closed'>('all')
const gridKey    = ref(0)
// Candle-tab toggle — turns the BB/EMA overlays + trade markers off, used by
// the e2e test to verify overlays actually drew (compare bytes on vs off).
const showIndicators = ref(true)
// Force the 2D pipeline (skip Three.js + barrel shader). Mirrors the prop
// dashboards use for mini-charts to dodge Chrome's WebGL-context cap.
const flat            = ref(false)
// Thumbnail-style chrome — drops the time axis + interval badge, sparser
// price labels. Used by mini-chart consumers (e.g. dashboard ChartPanel).
const compact         = ref(false)

watch(activeTab,  (tab) => { if (tab === 'grid') gridKey.value++ })
// NOTE: do NOT bump gridKey on curvature change. It used to work as a brute-
// force way to apply the new curvature to the grid, but at slider-drag
// rate (60+ Hz) it forces continuous unmount/remount of CathodeGrid →
// rapid WebGL context churn → the browser evicts the OLDEST live context
// (the Log tab's) → its canvas goes blank. CathodeGrid has its own internal
// `watch(() => props.curvature, ...)` that handles curvature updates without
// remount, so this re-key is unnecessary.

function onGridReady(e: { api: GridApi }) {
  gridApi.value = e.api
  e.api.setGridOption('rowData', trades)
  if (statusFilt.value !== 'all') setStatus(statusFilt.value)
}
function onQuickFilter(e: Event) {
  const val = (e.target as HTMLInputElement).value
  quickText.value = val
  gridApi.value?.setGridOption('quickFilterText', val)
}
function setStatus(s: 'all' | 'open' | 'closed') {
  statusFilt.value = s
  if (s === 'all') gridApi.value?.setFilterModel(null)
  else gridApi.value?.setFilterModel({ status: { type: 'equals', filter: s } })
  gridApi.value?.onFilterChanged()
}

// ── Workspace tab ─────────────────────────────────────────────────────────────
// Four panels, one per cathode component, in a 2×2 layout:
//   Trades (CathodeGrid)   |  Chart    (CathodeCandle)
//   Log    (CathodeLog)    |  Terminal (CathodeTerminal)
// Top row gets ~62% of the height (richer content); bottom row ~38%. Left
// column gets ~62% of the width (Trades + Log have more horizontal info).
const WS_IDS = ['trades', 'chart', 'log', 'terminal'] as const
type WsId = typeof WS_IDS[number]

const WS_TITLES: Record<WsId, string> = {
  trades:    'Trades',
  chart:     'Chart',
  log:       'Log',
  terminal:  'Terminal',
}

function buildWsLayout(wsW: number, wsH: number): Record<string, ContainerState> {
  const M      = 12
  const leftW  = Math.round(wsW * 0.62) - M
  const rightX = leftW + M * 2
  const rightW = wsW - rightX - M
  const topH   = Math.round(wsH * 0.62)
  const botY   = topH + M * 2
  const botH   = wsH - botY - M
  return {
    trades:    { x: M,      y: M,    w: leftW,  h: topH, visible: true, minimized: false, maximized: false, zIndex: 1 },
    chart:     { x: rightX, y: M,    w: rightW, h: topH, visible: true, minimized: false, maximized: false, zIndex: 2 },
    log:       { x: M,      y: botY, w: leftW,  h: botH, visible: true, minimized: false, maximized: false, zIndex: 3 },
    terminal:  { x: rightX, y: botY, w: rightW, h: botH, visible: true, minimized: false, maximized: false, zIndex: 4 },
  }
}

// Compute on first load (viewport size). Reset button recomputes at click time.
const wsLayout = buildWsLayout(window.innerWidth, window.innerHeight - 88)

// ── Workspace panel data ──────────────────────────────────────────────────────
// Signal feed → CathodeLog entries. Map each event to a level-tinted line.
// Generated to give the workspace's Log panel enough content to actually
// scroll and explore (was 10 entries — too few to demo the lens / pan / arrows).
const FEED_TEMPLATES: Array<{ level: LogEntry['level']; text: string }> = [
  { level: 'info',    text: '▲  XLM     momentum breakout     ENTRY  size 2,134.55  notional $3,140' },
  { level: 'success', text: '✓  HIGH    ema adx               EXIT   +2.76%   pnl +$86.75' },
  { level: 'error',   text: '✕  ZEC     hh hl trend follow    EXIT   -4.00%   pnl -$120.00' },
  { level: 'info',    text: '▲  SOL     keltner breakout      ENTRY  size 1,090     notional $4,580' },
  { level: 'success', text: '✓  AVAX    donchian breakout     EXIT   +1.12%   pnl +$23.40' },
  { level: 'debug',   text: '··  scanner pass — 142 products evaluated, 3 entries fired, 11 in cooldown' },
  { level: 'warn',    text: '⚠  rate-limit cooldown 8s on coinbase market_trades — backing off, retry in 8s' },
  { level: 'info',    text: '▲  ADA     atr trend             ENTRY  size 4,209.18  notional $2,740' },
  { level: 'success', text: '✓  ETH     macd cross daily      EXIT   +0.83%   pnl +$41.90' },
  { level: 'debug',   text: '··  heartbeat: 23 agents alive, 4 with open positions, 0 stalled' },
  { level: 'info',    text: '▲  HBAR    rsi oversold bounce   ENTRY  size 18,420   notional $1,985' },
  { level: 'warn',    text: '⚠  spread guard: skipping FOO-USD — bid/ask 0.81% > 0.50% threshold' },
  { level: 'success', text: '✓  PENGU   profit floor flat     EXIT   +2.53%   pnl +$248.90' },
  { level: 'debug',   text: '··  regime classified FLAT (btc 0.6%, hysteresis sticky 6/8 windows)' },
  { level: 'info',    text: '▲  LINK    bb squeeze            ENTRY  size 287       notional $4,210' },
  { level: 'error',   text: '✕  L3      macd cross daily      EXIT   -13.44%  pnl -$1,830  flagged for watchlist' },
  { level: 'success', text: '✓  KO      bull flag breakout    EXIT   +1.94%   pnl +$189.55' },
  { level: 'info',    text: '▲  TROLL   trend tf basic        ENTRY  size 16,750   notional $750' },
  { level: 'debug',   text: '··  spec reload: macd_cross_daily — scan_whitelist now ["ETH-USD","SOL-USD"] (was wide)' },
  { level: 'success', text: '✓  TROLL   trend tf basic        EXIT   +3.15%   pnl +$23.70   PROFIT_FLOOR_FLAT' },
]
const feedLogEntries: LogEntry[] = (() => {
  const out: LogEntry[] = []
  const base = Date.now() - 1000 * 60 * 75
  for (let i = 0; i < 140; i++) {
    const tpl = FEED_TEMPLATES[i % FEED_TEMPLATES.length]
    out.push({ ts: base + i * 32_000, text: tpl.text, level: tpl.level })
  }
  return out
})()

// ── Log tab — CathodeLog demo entries ─────────────────────────────────────────
const LOG_TEMPLATES: Array<{ level: LogEntry['level']; text: string }> = [
  { level: 'info',    text: 'Scanner cycle complete — 0 candidates passed filter' },
  { level: 'info',    text: 'Heartbeat OK · agents 35/35 healthy · uptime 4h 12m' },
  { level: 'success', text: 'BB_BREAKOUT entry filled · KO-USDC @ 79.68 · size 122.63 · notional $9,771.15' },
  { level: 'warn',    text: 'API rate limit warning — 87/100 calls in last 60s window, backing off' },
  { level: 'error',   text: 'Loop error: code: 429, message: too many requests' },
  { level: 'debug',   text: 'macd.bullish=true adx.trending=true adx.bullish=true trend.up=true → MACD_TREND eligible' },
  { level: 'info',    text: 'Regime classified FLAT (btc 0.6%, hysteresis sticky)' },
  { level: 'success', text: 'PROFIT_FLOOR_FLAT exit · PENGU-USDC · entry 0.009869 → 0.010183 · +2.53%' },
  { level: 'warn',    text: 'Position drift: ZEC-USDC underwater 12h · holding for signal exit' },
  { level: 'info',    text: 'Spec reload: macd_cross_daily — scan_whitelist now ["ETH-USD","SOL-USD"] (was wide)' },
  { level: 'error',   text: 'L3-USDC × macd_cross_daily SL hit at -13.44% in 4h — flagging for watchlist' },
  { level: 'debug',   text: 'Wrapping a deliberately long single-line entry to exercise word-wrap behaviour. The component should split this across multiple visual lines without breaking the surrounding theme, and continuation lines should align under the text column rather than the timestamp prefix. This is also a soft-test of monospace measurement under different canvas widths.' },
]

const logEntries = ref<LogEntry[]>([])

// ── Terminal tab — echo handler so the demo has a working roundtrip without
//    needing any real backend. Consumers wire `submit` to a real handler. ────
// Help screen — referenced both as the initial scrollback (so the terminal
// opens already showing the available commands, no need to type 'help')
// and as the body of the help command itself.
const HELP_LINES: LogEntry[] = [
  { level: 'info',    text: 'commands:' },
  { level: 'success', text: '  help                 — this list' },
  { level: 'success', text: '  echo <text>          — print text back' },
  { level: 'success', text: '  time                 — ISO-8601 timestamp' },
  { level: 'success', text: '  date                 — human-readable date' },
  { level: 'success', text: '  whoami               — current user (faked)' },
  { level: 'success', text: '  pwd                  — current directory (faked)' },
  { level: 'success', text: '  uname                — fake system info' },
  { level: 'success', text: '  ls                   — fake file listing' },
  { level: 'success', text: '  cat <name>           — fake file contents' },
  { level: 'success', text: '  ping <host>          — simulated latency' },
  { level: 'success', text: '  colors               — show every log-level colour' },
  { level: 'success', text: '  cowsay <text>        — ASCII cow' },
  { level: 'success', text: '  joke                 — deterministic groaner' },
  { level: 'success', text: '  motd                 — message of the day' },
  { level: 'success', text: '  fail                 — emit a fake error' },
  { level: 'success', text: '  clear                — wipe scrollback' },
]

const terminalEntries = ref<LogEntry[]>([
  { level: 'info', text: 'CathodeTerminal demo' },
  ...HELP_LINES,
])
const terminalBusy = ref(false)

// Demo command vocabulary. Each handler returns a single LogEntry or an
// array of them (multi-line responses). Pure UI — real consumers swap
// these for a backend round-trip / Claude chat / sk-* invocations.
type Reply = LogEntry | LogEntry[] | null    // null = handled inline (e.g. `clear`)

const COMMANDS: Record<string, (args: string) => Reply> = {
  help: () => HELP_LINES,

  echo: (args) => ({ level: 'info', text: args || '' }),

  time: () => ({ level: 'success', text: new Date().toISOString() }),

  date: () => ({
    level: 'success',
    text:  new Date().toString().replace(/\(.*\)$/, '').trim(),
  }),

  whoami: () => ({ level: 'success', text: 'cathode-operator' }),
  pwd:    () => ({ level: 'success', text: '/home/cathode/projects/demo' }),

  uname: () => [
    { level: 'success', text: 'Cathode 1.0.0 (canvas-1280x720)' },
    { level: 'debug',   text: 'kernel: vue3-three.js / shader: barrel-r2 / tube: phosphor-emerald' },
  ],

  ls: () => [
    { level: 'info', text: 'README.md      ROADMAP.md      package.json' },
    { level: 'info', text: 'src/           demo/           tests/' },
    { level: 'info', text: 'dist/          node_modules/   playwright.config.ts' },
  ],

  cat: (args) => {
    const file = args.trim()
    if (!file)             return { level: 'error', text: 'usage: cat <file>' }
    if (file === 'README.md') return [
      { level: 'info', text: '# @stratchai/cathode' },
      { level: 'info', text: '' },
      { level: 'info', text: 'CRT-styled Vue 3 component library for financial UIs.' },
      { level: 'info', text: 'Barrel-distorted canvas controls — terminals from a trading floor.' },
    ]
    if (file === 'package.json') return [
      { level: 'info', text: '{' },
      { level: 'info', text: '  "name": "@stratchai/cathode",' },
      { level: 'info', text: '  "version": "0.1.0",' },
      { level: 'info', text: '  "type": "module"' },
      { level: 'info', text: '}' },
    ]
    return { level: 'error', text: `cat: ${file}: no such file (try README.md or package.json)` }
  },

  ping: (args) => {
    const host = args.trim() || 'localhost'
    const lines: LogEntry[] = [
      { level: 'info', text: `PING ${host}: 56 data bytes` },
    ]
    for (let seq = 0; seq < 4; seq++) {
      const ms = (12 + Math.random() * 18).toFixed(1)
      lines.push({ level: 'success', text: `64 bytes from ${host}: icmp_seq=${seq} ttl=64 time=${ms} ms` })
    }
    return lines
  },

  colors: () => [
    { level: 'info',    text: 'level: info    — neutral output' },
    { level: 'success', text: 'level: success — happy path' },
    { level: 'warn',    text: 'level: warn    — heads-up' },
    { level: 'error',   text: 'level: error   — something broke' },
    { level: 'debug',   text: 'level: debug   — diagnostic chatter' },
  ],

  cowsay: (args) => {
    const msg = args.trim() || 'moo'
    const bar = '─'.repeat(Math.max(2, msg.length + 2))
    return [
      { level: 'info', text: ` ╭${bar}╮` },
      { level: 'info', text: ` │ ${msg} │` },
      { level: 'info', text: ` ╰${bar}╯` },
      { level: 'info', text: '         \\   ^__^' },
      { level: 'info', text: '          \\  (oo)\\_______' },
      { level: 'info', text: '             (__)\\       )\\/\\' },
      { level: 'info', text: '                 ||----w |' },
      { level: 'info', text: '                 ||     ||' },
    ]
  },

  joke: () => {
    const jokes = [
      "There are 10 kinds of people: those who get binary and those who don't.",
      'Why did the programmer quit his job? Because he didn\'t get arrays.',
      'A SQL query walks into a bar, walks up to two tables and asks: "may I JOIN you?"',
      'I would tell you a UDP joke, but you might not get it.',
      "Why do Java developers wear glasses? Because they don't C#.",
    ]
    return { level: 'info', text: jokes[Math.floor(Math.random() * jokes.length)] }
  },

  motd: () => [
    { level: 'success', text: '═══ Cathode CRT — message of the day ═══' },
    { level: 'info',    text: 'Phosphor temperature nominal. Scanlines steady. Glow within tolerance.' },
    { level: 'debug',   text: 'last boot: just now · uptime: a few moments · load: 0.42' },
  ],

  fail: () => ({ level: 'error', text: 'simulated failure: nothing actually went wrong' }),
}

function onTerminalSubmit(cmd: string) {
  // Echo the user's command into the scrollback first
  terminalEntries.value = [
    ...terminalEntries.value,
    { level: 'info', text: `→ ${cmd}` },
  ]

  // Empty submit — real terminals just drop the prompt line and move on.
  const trimmed = cmd.trim()
  if (!trimmed) return

  // `clear` is special — it wipes the buffer instead of appending.
  if (trimmed === 'clear') {
    terminalEntries.value = []
    return
  }

  // Parse first word as command, rest as args.
  const sp     = trimmed.indexOf(' ')
  const verb   = sp === -1 ? trimmed : trimmed.slice(0, sp)
  const args   = sp === -1 ? ''      : trimmed.slice(sp + 1)
  const handler = COMMANDS[verb]

  let reply: Reply
  if (!handler) {
    reply = { level: 'warn', text: `unknown command: ${verb} — type 'help' for the demo vocabulary` }
  } else {
    reply = handler(args)
  }

  // Simulate a short async backend round-trip so the busy spinner shows up
  terminalBusy.value = true
  setTimeout(() => {
    if (reply !== null) {
      const lines = Array.isArray(reply) ? reply : [reply]
      terminalEntries.value = [...terminalEntries.value, ...lines]
    }
    terminalBusy.value = false
  }, 180)
}

// ── Candle tab — sample OHLCV candles ──────────────────────────────────────────
// Synthetic random walk with gentle drift; large enough to test horizontal scroll.
function generateOHLCV(n: number): OHLCVCandle[] {
  const out: OHLCVCandle[] = []
  let price = 60000
  const t0 = Date.now() - n * 3_600_000   // hourly bars
  for (let i = 0; i < n; i++) {
    const drift = (Math.random() - 0.495) * price * 0.012
    const open  = price
    const close = Math.max(1, price + drift)
    const high  = Math.max(open, close) * (1 + Math.random() * 0.005)
    const low   = Math.min(open, close) * (1 - Math.random() * 0.005)
    const vol   = Math.round(20 + Math.random() * 80)
    out.push({ start: t0 + i * 3_600_000, open, close, high, low, volume: vol })
    price = close
  }
  return out
}

const demoCandles = ref<OHLCVCandle[]>(generateOHLCV(300))

// ── Indicator math (small inline copies — production consumers should pull
//    these from @stratchai/core's indicator library) ─────────────────────────

/** Simple Moving Average — y[i] is the mean of the last `period` closes,
 *  NaN for indices where i+1 < period. */
function sma(closes: number[], period: number): number[] {
  const out = new Array<number>(closes.length).fill(NaN)
  let sum = 0
  for (let i = 0; i < closes.length; i++) {
    sum += closes[i]
    if (i >= period) sum -= closes[i - period]
    if (i + 1 >= period) out[i] = sum / period
  }
  return out
}

/** Exponential Moving Average. */
function ema(closes: number[], period: number): number[] {
  const out = new Array<number>(closes.length).fill(NaN)
  if (!closes.length) return out
  const k = 2 / (period + 1)
  let acc = closes[0]
  out[0] = acc
  for (let i = 1; i < closes.length; i++) {
    acc = closes[i] * k + acc * (1 - k)
    out[i] = acc
  }
  // Mark warmup region as NaN — the first (period - 1) values aren't a real EMA yet.
  for (let i = 0; i < Math.min(period - 1, closes.length); i++) out[i] = NaN
  return out
}

/** Bollinger Bands — middle = SMA(period), upper/lower = middle ± k×stdDev. */
function bollinger(closes: number[], period = 20, k = 2): { upper: number[]; middle: number[]; lower: number[] } {
  const middle = sma(closes, period)
  const upper  = new Array<number>(closes.length).fill(NaN)
  const lower  = new Array<number>(closes.length).fill(NaN)
  for (let i = period - 1; i < closes.length; i++) {
    let varSum = 0
    for (let j = i - period + 1; j <= i; j++) {
      const d = closes[j] - middle[i]
      varSum += d * d
    }
    const sd = Math.sqrt(varSum / period)
    upper[i] = middle[i] + k * sd
    lower[i] = middle[i] - k * sd
  }
  return { upper, middle, lower }
}

const demoOverlays = computed<PriceOverlay[]>(() => {
  const closes = demoCandles.value.map(c => c.close)
  const bb     = bollinger(closes, 20, 2)
  return [
    // Bollinger Bands — band with semi-transparent fill + dashed midline
    {
      kind:         'band',
      upper:        bb.upper,
      middle:       bb.middle,
      lower:        bb.lower,
      color:        '#40a0f0',
      fillAlpha:    0.06,
      middleDashed: true,
      label:        'BB(20,2)',
    },
    // Fast EMA (10) — solid line
    { kind: 'line', data: ema(closes, 10), color: '#26a69a', lineWidth: 1, label: 'EMA(10)' },
    // Slow EMA (50) — solid line
    { kind: 'line', data: ema(closes, 50), color: '#ffd060', lineWidth: 1, label: 'EMA(50)' },
  ]
})

// Fake trade markers — three entry/exit pairs with strategy-style labels so
// the marker hover tooltip has interesting content. Spread across the most
// recent ~120 candles so they sit inside the default visible window
// (default slotW=8 fits ~150 candles anchored on the right edge).
// Real consumers pass exact (timestamp, price) tuples from their trade
// history with the strategy's actual entry/exit reason.
const demoMarkers = computed<TradeMarker[]>(() => {
  const cs = demoCandles.value
  if (cs.length < 130) return []
  const pick = (i: number) => cs[i]
  return [
    { timestamp: pick(cs.length - 120).start, price: pick(cs.length - 120).low,  kind: 'entry', label: 'BB_BREAKOUT_ENTRY' },
    { timestamp: pick(cs.length - 100).start, price: pick(cs.length - 100).high, kind: 'exit',  label: 'PROFIT_FLOOR'      },
    { timestamp: pick(cs.length -  80).start, price: pick(cs.length -  80).low,  kind: 'entry', label: 'EMA_CROSS_ENTRY'   },
    { timestamp: pick(cs.length -  60).start, price: pick(cs.length -  60).high, kind: 'exit',  label: 'EMA_CROSS_EXIT'    },
    { timestamp: pick(cs.length -  40).start, price: pick(cs.length -  40).low,  kind: 'entry', label: 'ADX_PSAR_ENTRY'    },
    { timestamp: pick(cs.length -  20).start, price: pick(cs.length -  20).high, kind: 'exit',  label: 'PROFIT_FLOOR_FLAT' },
  ]
})

// Expose marker geometry for e2e tests — lets Playwright hover the EXACT
// pixel where a marker is drawn, instead of doing a wide sweep that's slow
// and flaky. Production builds would tree-shake this away.
if (typeof window !== 'undefined') {
  ;(window as any).__cathodeDebug = {
    getDemoMarkerCanvasCoords(): Array<{ x: number; y: number; kind: string; label: string }> {
      const cs = demoCandles.value
      const ms = demoMarkers.value
      if (!cs.length || !ms.length) return []
      // Find the canvas element — the candle tab's canvas
      const canvas = document.querySelector('.tab-content:not([style*="display: none"]) canvas') as HTMLCanvasElement | null
      if (!canvas) return []
      const W = canvas.width / (window.devicePixelRatio || 1)
      const H = canvas.height / (window.devicePixelRatio || 1)
      // Mirror CanvasCandle's geometry: PADDING_LEFT=8, PADDING_RIGHT=56,
      // PADDING_TOP=8, PADDING_BOTTOM=22, default slotW=8.
      const PADDING_LEFT = 8, PADDING_RIGHT = 56, PADDING_TOP = 8, PADDING_BOTTOM = 22
      const slotW = 8
      const usableW = W - PADDING_LEFT - PADDING_RIGHT
      const visible = Math.max(1, Math.floor(usableW / slotW))
      const firstIdx = Math.max(0, cs.length - visible)
      // Price bounds across visible window
      let lo = Infinity, hi = -Infinity
      for (let i = firstIdx; i < cs.length; i++) {
        if (cs[i].low  < lo) lo = cs[i].low
        if (cs[i].high > hi) hi = cs[i].high
      }
      const pad = (hi - lo) * 0.04
      lo -= pad; hi += pad
      const priceY0 = PADDING_TOP
      const priceY1 = PADDING_TOP + (H - PADDING_TOP - PADDING_BOTTOM - 4) * (1 - 0.18)
      const out: Array<{ x: number; y: number; kind: string; label: string }> = []
      for (const m of ms) {
        // Find candle by timestamp ±0.5 interval
        const interval = cs[1].start - cs[0].start
        let idx = -1
        for (let i = 0; i < cs.length; i++) {
          if (Math.abs(cs[i].start - m.timestamp) <= interval * 0.5) { idx = i; break }
        }
        if (idx < firstIdx || idx >= cs.length) continue
        const x = PADDING_LEFT + (idx - firstIdx + 0.5) * slotW
        const y = priceY0 + (1 - (m.price - lo) / (hi - lo)) * (priceY1 - priceY0)
        out.push({ x, y, kind: m.kind, label: m.label || '' })
      }
      return out
    },
  }
}
function seedLogEntries() {
  const out: LogEntry[] = []
  // Wider time window + 4× the volume so there's enough content to scroll
  // and explore the magnify lens without running out of rows.
  const base = Date.now() - 1000 * 60 * 90
  for (let i = 0; i < 320; i++) {
    const tpl = LOG_TEMPLATES[i % LOG_TEMPLATES.length]
    out.push({ ts: base + i * 16_000, text: tpl.text, level: tpl.level })
  }
  logEntries.value = out
}
seedLogEntries()
</script>

<template>
  <div class="demo-shell" :class="{ 'cathode-light': !isDark, 'mobile': isMobile }">

    <!-- ── Top bar ──────────────────────────────────────────────── -->
    <div class="demo-bar">
      <span class="demo-title">⬛ CATHODE</span>

      <!-- Tab switcher -->
      <div class="demo-tabs">
        <button
          v-if="!isMobile"
          :class="['tab-btn', { active: activeTab === 'workspace' }]"
          @click="activeTab = 'workspace'"
        >
          Workspace
        </button>
        <button :class="['tab-btn', { active: activeTab === 'grid' }]" @click="activeTab = 'grid'">
          Grid
        </button>
        <button :class="['tab-btn', { active: activeTab === 'log' }]" @click="activeTab = 'log'">
          Log
        </button>
        <button :class="['tab-btn', { active: activeTab === 'candle' }]" @click="activeTab = 'candle'">
          Candle
        </button>
        <button :class="['tab-btn', { active: activeTab === 'terminal' }]" @click="activeTab = 'terminal'">
          Terminal
        </button>
      </div>

      <!-- Theme -->
      <label>Theme</label>
      <select v-model="theme">
        <option value="none">Default (dark)</option>
        <option value="phosphor">Phosphor Green</option>
        <option value="amber">Amber</option>
        <option value="paper">Paper (light)</option>
      </select>

      <!-- Shared controls (both tabs) -->
      <label>Curve {{ curvature }}</label>
      <input type="range" min="0" max="45" step="1" v-model.number="curvature" style="width:110px" />
      <label><input type="checkbox" v-model="scanlines" /> Scanlines</label>
      <label><input type="checkbox" v-model="glow" />      Glow</label>
      <label>
        <input type="checkbox" v-model="magnify" data-testid="cf-magnify" />
        Magnify
      </label>
      <label>
        <input type="checkbox" v-model="showLoaders" data-testid="cf-show-loaders" />
        Show loaders
      </label>
      <label v-if="activeTab === 'candle'">
        <input type="checkbox" v-model="showIndicators" data-testid="cf-show-indicators" />
        Indicators
      </label>
      <label v-if="activeTab === 'candle'">
        <input type="checkbox" v-model="flat" data-testid="cf-flat" />
        Flat (no GL)
      </label>
      <label v-if="activeTab === 'candle'">
        <input type="checkbox" v-model="compact" data-testid="cf-compact" />
        Compact
      </label>

      <div class="demo-spacer" />

      <!-- Grid-only controls -->
      <template v-if="activeTab === 'grid'">
        <div class="demo-btns">
          <button :class="{ active: statusFilt==='all' }"    @click="setStatus('all')">All</button>
          <button :class="{ active: statusFilt==='open' }"   @click="setStatus('open')">Open</button>
          <button :class="{ active: statusFilt==='closed' }" @click="setStatus('closed')">Closed</button>
        </div>
        <input class="demo-filter" placeholder="Quick filter…" :value="quickText" @input="onQuickFilter" />
      </template>
    </div>

    <!-- ── Grid tab ──────────────────────────────────────────────── -->
    <div v-show="activeTab === 'grid'" class="tab-content">
      <CathodeLoader
        v-if="showLoaders"
        :theme="theme" :curvature="curvature" :scanlines="scanlines" :glow="glow"
        label="LOADING TRADES"
      />
      <CathodeGrid
        v-else
        :key="gridKey"
        :column-defs="columnDefs"
        :default-col-def="defaultColDef"
        :row-height="28"
        :theme="theme"
        :curvature="curvature"
        :scanlines="scanlines"
        :glow="glow"
        :magnify="magnify"
        :pagination="true"
        :pagination-page-size="50"
        @grid-ready="onGridReady"
      />
    </div>

    <!-- ── Log tab ───────────────────────────────────────────────── -->
    <div v-show="activeTab === 'log'" class="tab-content">
      <CathodeLoader
        v-if="showLoaders"
        :theme="theme" :curvature="curvature" :scanlines="scanlines" :glow="glow"
        label="OPENING LOG"
      />
      <CathodeLog
        v-else
        :entries="logEntries"
        :theme="theme"
        :curvature="curvature"
        :scanlines="scanlines"
        :glow="glow"
        :magnify="magnify"
        :word-wrap="false"
      />
    </div>

    <!-- ── Candle tab — OHLCV candlestick chart with the barrel pipeline ─── -->
    <div v-show="activeTab === 'candle'" class="tab-content">
      <CathodeLoader
        v-if="showLoaders"
        :theme="theme" :curvature="curvature" :scanlines="scanlines" :glow="glow"
        label="STREAMING CANDLES"
      />
      <CathodeCandle
        v-else
        :key="`cf-${flat}`"
        :candles="demoCandles"
        :overlays="showIndicators ? demoOverlays : []"
        :markers="showIndicators ? demoMarkers : []"
        :theme="theme"
        :curvature="curvature"
        :scanlines="scanlines"
        :glow="glow"
        :flat="flat"
        :compact="compact"
        :magnify="magnify"
      />
    </div>

    <!-- ── Terminal tab — log scrollback + command-prompt input row ─── -->
    <div v-show="activeTab === 'terminal'" class="tab-content">
      <CathodeLoader
        v-if="showLoaders"
        :theme="theme" :curvature="curvature" :scanlines="scanlines" :glow="glow"
        label="ATTACHING TTY"
      />
      <CathodeTerminal
        v-else
        :entries="terminalEntries"
        :theme="theme"
        :curvature="curvature"
        :scanlines="scanlines"
        :glow="glow"
        :magnify="magnify"
        :busy="terminalBusy"
        prompt="→ "
        placeholder="type a command (try: help, echo …, time)"
        @submit="onTerminalSubmit"
      />
    </div>

    <!-- ── Workspace tab ─────────────────────────────────────────── -->
    <CathodeWorkspace
      v-show="activeTab === 'workspace'"
      storage-key="cathode.demo.layout"
      :initial-layout="wsLayout"
      :container-titles="WS_TITLES"
    >
      <!-- TRADES — CathodeGrid inside a container -->
      <CathodeContainer id="trades" title="Trades" :curvature="curvature" canvas>
        <template #default="{ resizeKey }">
          <CathodeLoader
            v-if="showLoaders"
            :theme="theme" :curvature="curvature" :scanlines="scanlines" :glow="glow"
            label="LOADING TRADES"
          />
          <CathodeGrid
            v-else
            :key="resizeKey"
            :column-defs="columnDefs"
            :default-col-def="defaultColDef"
            :row-height="26"
            :theme="theme"
            :curvature="curvature"
            :scanlines="scanlines"
            :glow="glow"
            :magnify="magnify"
            :pagination="true"
            :pagination-page-size="50"
            @grid-ready="onGridReady"
          />
        </template>
      </CathodeContainer>

      <!-- CHART — CathodeCandle -->
      <CathodeContainer id="chart" title="Chart" :curvature="curvature" canvas>
        <template #default="{ resizeKey }">
          <CathodeLoader
            v-if="showLoaders"
            :theme="theme" :curvature="curvature" :scanlines="scanlines" :glow="glow"
            label="STREAMING CANDLES"
          />
          <CathodeCandle
            v-else
            :key="resizeKey"
            :candles="demoCandles"
            :overlays="demoOverlays"
            :markers="demoMarkers"
            :theme="theme"
            :curvature="curvature"
            :scanlines="scanlines"
            :glow="glow"
            :magnify="magnify"
          />
        </template>
      </CathodeContainer>

      <!-- LOG — CathodeLog (same dataset as the standalone Log tab) -->
      <CathodeContainer id="log" title="Log" :curvature="curvature" canvas>
        <CathodeLoader
          v-if="showLoaders"
          :theme="theme" :curvature="curvature" :scanlines="scanlines" :glow="glow"
          label="OPENING LOG"
        />
        <CathodeLog
          v-else
          :entries="logEntries"
          :theme="theme"
          :curvature="curvature"
          :scanlines="scanlines"
          :glow="glow"
          :magnify="magnify"
          :word-wrap="false"
        />
      </CathodeContainer>

      <!-- TERMINAL — CathodeTerminal -->
      <CathodeContainer id="terminal" title="Terminal" :curvature="curvature" canvas>
        <CathodeLoader
          v-if="showLoaders"
          :theme="theme" :curvature="curvature" :scanlines="scanlines" :glow="glow"
          label="ATTACHING TTY"
        />
        <CathodeTerminal
          v-else
          :entries="terminalEntries"
          :theme="theme"
          :curvature="curvature"
          :scanlines="scanlines"
          :glow="glow"
          :magnify="magnify"
          :busy="terminalBusy"
          prompt="→ "
          @submit="onTerminalSubmit"
        />
      </CathodeContainer>
    </CathodeWorkspace>

  </div>
</template>

<style scoped>
/* ── Shell ──────────────────────────────────────────────────────────────── */
.demo-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: system-ui, sans-serif;
  background: #0a1020;
  color: #c0d0e0;

  /* CSS variable theme tokens (override per theme class) */
  --cc-base:        #0a1020;
  --cc-surface:     #0d1520;
  --cc-header:      #12122a;
  --cc-border:      #1e2a3a;
  --cc-border-2:    #2a3a50;
  --cc-tx1:         #c0d0e0;
  --cc-tx2:         #7a90a8;
  --cc-tx3:         #4a6a88;
  --cc-accent:      #00bc8c;
  --cc-accent-text: #40a0f0;
  --cc-grid-line:   rgba(30,42,58,0.9);
}

/* ── Phosphor theme ─────────────────────────────────────────────── */
.demo-shell:has(select option[value="phosphor"]:checked) {
  --cc-base:        #060d06;
  --cc-surface:     #081008;
  --cc-header:      #0a180a;
  --cc-accent:      #00ff88;
  --cc-accent-text: #00e874;
}

/* ── Amber theme ────────────────────────────────────────────────── */
.demo-shell:has(select option[value="amber"]:checked) {
  --cc-base:        #0a0700;
  --cc-surface:     #120e00;
  --cc-header:      #1a1400;
  --cc-accent:      #ffaa00;
  --cc-accent-text: #f39c12;
}

/* ── Paper / light theme ─────────────────────────────────────────── */
.demo-shell.cathode-light {
  background: #f5f5f5;
  color: #111;
  --cc-base:        #fafafa;
  --cc-surface:     #ffffff;
  --cc-header:      #f0f0f0;
  --cc-border:      #e0e0e0;
  --cc-border-2:    #d0d0d0;
  --cc-tx1:         #111111;
  --cc-tx2:         #555555;
  --cc-tx3:         #999999;
  --cc-accent:      #1a9e3f;
  --cc-accent-text: #0f7bbf;
  --cc-grid-line:   rgba(200,200,200,0.8);
}

/* ── Top bar ────────────────────────────────────────────────────── */
.demo-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
  font-size: 12px;
  backdrop-filter: blur(4px);
  z-index: 200;
}
.cathode-light .demo-bar {
  background: rgba(0,0,0,0.06);
  border-bottom-color: rgba(0,0,0,0.1);
}

.demo-title {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.1em;
  color: var(--cc-accent-text);
  margin-right: 4px;
}

.demo-spacer { flex: 1; }

label { font-size: 11px; opacity: 0.7; }

select, input[type="range"] {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: inherit;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
}
.cathode-light select,
.cathode-light input[type="range"] {
  background: rgba(0,0,0,0.06);
  border-color: rgba(0,0,0,0.2);
}

/* ── Tab switcher ───────────────────────────────────────────────── */
.demo-tabs  { display: flex; gap: 2px; margin-right: 6px; }
.tab-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.15);
  color: inherit;
  font-family: monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 3px;
  cursor: pointer;
  opacity: 0.55;
}
.tab-btn.active { border-color: var(--cc-accent-text); color: var(--cc-accent-text); opacity: 1; }

.demo-btns   { display: flex; gap: 3px; }
.demo-btns button {
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  color: inherit;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 3px;
  cursor: pointer;
}
.demo-btns button.active { border-color: var(--cc-accent-text); color: var(--cc-accent-text); }

.demo-filter {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: inherit;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  width: 130px;
  outline: none;
}
.demo-filter:focus { border-color: var(--cc-accent-text); }

/* ── Tab content shell — single-component tabs (grid/log/candle/terminal)
   read as a curved CRT screen rather than a flat web canvas. The
   curvature is implied via gradient + vignette, NOT a solid frame:
     - the screen surface itself is a radial gradient (brighter in the
       centre, fading toward the edges) so the eye reads a bulge
     - a perimeter vignette deepens the corners into shadow, like
       light falling off a curved tube
     - a soft top-bevel highlight + bottom-bevel shadow suggest the
       physical face of a CRT without painting a literal frame
   Workspace tab opts out (it renders outside .tab-content) so
   multi-panel layouts keep their CathodeContainer chrome. ─────── */
.tab-content {
  position: relative;
  flex: 1;
  min-height: 0;
  margin: 12px;
  padding: 18px 22px;
  border-radius: 18px / 22px;
  /* The bezel area is the SAME surface as the screen, with a faint
     vertical bevel: a hint of highlight at the top, shadow at the
     bottom. Reads as "curved face caught by a soft overhead light". */
  background:
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--cc-base) 88%, white)  0%,
      var(--cc-base)                                 28%,
      var(--cc-base)                                 72%,
      color-mix(in srgb, var(--cc-base) 90%, black)  100%
    );
  /* Subtle outer shadow keeps the panel grounded; no thick "plastic" ring. */
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.30),
    inset 0 0 0 1px color-mix(in srgb, var(--cc-base) 60%, black);
  overflow: hidden;
}

/* Inner screen surface — the cathode component renders into here.
   Background is solid var(--cc-base) — no radial bevel, since the
   shader's barrel + vignette already convey curvature, and any extra
   dimming on the surface eats into text brightness. The accent ring
   alone hints at where the screen meets the bezel. */
.tab-content > * {
  position: relative;
  width:  100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: var(--cc-base);
  /* Faint accent ring at the screen edge — colour-shift cue for the
     curvature, not a frame. */
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--cc-accent) 14%, transparent),
    inset 0 0 24px color-mix(in srgb, var(--cc-accent) 8%, transparent);
}

/* No CSS vignette overlay — the shader already does corner darkening
   via its uVignette uniform. Stacking another multiply-blend layer on
   top dimmed the text region noticeably; let the shader own the
   corner falloff so text reads at full brightness. The radial bevel
   on .tab-content > * still gives the curved-face cue. */
.demo-shell.cathode-light .tab-content {
  box-shadow:
    0 8px 28px rgba(40, 35, 25, 0.18),
    inset 0 0 0 1px color-mix(in srgb, var(--cc-base) 70%, black);
}

/* Bezel stays dark across all themes — the screen-content surface
   carries the theme via cathode's own theme prop. The accent halation
   on .tab-content > * picks up --cc-accent so the curvature reads
   without re-colouring the bezel itself. */

/* (Removed: mock-monitor / mock-scorecard / mock-positions / mock-feed
    styles. The workspace now uses real cathode components — every panel
    paints its own canvas, so per-panel mock CSS is gone.) */

/* scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: var(--cc-base); }
::-webkit-scrollbar-thumb { background: var(--cc-border-2); border-radius: 2px; }

/* ── Mobile mode — viewport < 720px ──────────────────────────────────── */
/* Driven by .mobile class on .demo-shell, set from a JS resize listener
   so we can also drop Workspace-tab markup. CSS picks up the rest:
   wrapping toolbar, tighter padding, and a more compact tab bar. */
.demo-shell.mobile .demo-bar {
  flex-wrap: wrap;
  row-gap: 6px;
  padding: 6px 8px;
}
.demo-shell.mobile .demo-tabs {
  flex: 1 1 100%;     /* tabs claim their own row */
  order: -1;          /* render above the controls so the title and tabs are the first thing visible */
  display: flex;
  overflow-x: auto;   /* horizontal scroll if 4 tabs don't fit */
  scrollbar-width: none;
}
.demo-shell.mobile .demo-tabs::-webkit-scrollbar { display: none; }
.demo-shell.mobile .tab-btn {
  flex: 0 0 auto;
  padding: 4px 10px;
  font-size: 11px;
}
.demo-shell.mobile .demo-title { font-size: 13px; }
/* Shrink the tab content's outer chrome so the canvas itself gets max pixels. */
.demo-shell.mobile .tab-content {
  margin: 4px;
  padding: 6px 8px;
  border-radius: 10px / 12px;
}
/* Inputs / selects / sliders — tighten so they pack into a phone toolbar. */
.demo-shell.mobile .demo-bar select,
.demo-shell.mobile .demo-bar input[type="range"],
.demo-shell.mobile .demo-bar input[type="text"] {
  font-size: 11px;
  height: 24px;
}
.demo-shell.mobile .demo-bar input[type="range"] { width: 80px !important; }
.demo-shell.mobile .demo-bar label { font-size: 11px; }
</style>
