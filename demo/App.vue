<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CathodeGrid      from '../src/CathodeGrid.vue'
import CathodeLog       from '../src/CathodeLog.vue'
import CathodeWorkspace from '../src/CathodeWorkspace.vue'
import CathodeContainer from '../src/CathodeContainer.vue'
import { buildDefaultLayout } from '../src/useCathodeLayout'
import type { ColDef, GridApi } from '../src/types'
import type { ContainerState } from '../src/useCathodeLayout'
import type { LogEntry } from '../src/CanvasLog'

// ── Shared state ──────────────────────────────────────────────────────────────
type DemoTab = 'grid' | 'workspace' | 'log'
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
    cellStyle: (p) => ({ color: p.value === 'open' ? '#00bc8c' : '#e74c3c' }) },
  { field: 'product',      width: 105, filter: true },
  { field: 'exchange',     width: 82,  filter: true },
  { field: 'strategy',     width: 220, filter: true },
  { field: 'entry_price',  width: 100, headerName: 'Entry',     valueFormatter: NUM(4), cellStyle: RIGHT },
  { field: 'exit_price',   width: 100, headerName: 'Exit',      valueFormatter: NUM(4), cellStyle: RIGHT },
  { field: 'size_base',    width: 88,  headerName: 'Size',      valueFormatter: NUM(4), cellStyle: RIGHT },
  { field: 'notional',     width: 88,  headerName: 'Notional',  valueFormatter: NUM(2), cellStyle: RIGHT },
  { field: 'pnl_pct',      width: 80,  headerName: 'PnL %',     valueFormatter: PCT,
    cellStyle: (p) => ({ ...RIGHT, color: Number(p.value) >= 0 ? '#00bc8c' : '#e74c3c' }) },
  { field: 'net_pnl_pct',  width: 88,  headerName: 'Net PnL %', valueFormatter: PCT,
    cellStyle: (p) => ({ ...RIGHT, color: Number(p.value) >= 0 ? '#00bc8c' : '#e74c3c' }) },
  { field: 'take_profit_pct', width: 72, headerName: 'TP %',    valueFormatter: PCT, cellStyle: RIGHT },
  { field: 'rsi_at_entry',    width: 68, headerName: 'RSI',     valueFormatter: NUM(1), cellStyle: (p) => ({
      ...RIGHT,
      color: Number(p.value) > 65 ? '#e74c3c' : Number(p.value) < 35 ? '#00bc8c' : '#7a90a8',
    }) },
  { field: 'reason',          width: 88, filter: true },
  { headerName: 'Slippage %', width: 72, field: 'slippage_pct', cellStyle: RIGHT },
  { headerName: 'Commission', width: 88, valueGetter: (p) => (Number(p.data.notional)*0.0005).toFixed(4), cellStyle: RIGHT },
  { headerName: 'Drawdown %', width: 84, field: 'drawdown_pct', cellStyle: { ...RIGHT, color: '#e74c3c' } },
  { headerName: 'MAE %',      width: 72, field: 'mae_pct',      cellStyle: { ...RIGHT, color: '#e74c3c' } },
  { headerName: 'MFE %',      width: 72, field: 'mfe_pct',      cellStyle: { ...RIGHT, color: '#00bc8c' } },
  { headerName: 'Hold Days',  width: 76, field: 'hold_days',    cellStyle: RIGHT },
  { headerName: 'Vol Score',  width: 76, field: 'vol_score',    cellStyle: RIGHT },
  { headerName: 'Regime',     width: 82, field: 'regime',  filter: true },
  { headerName: 'Session',    width: 76, field: 'session', filter: true },
]

const defaultColDef: ColDef = { resizable: true, sortable: true }
const gridApi    = ref<GridApi | null>(null)
const curvature  = ref(25)
const scanlines  = ref(true)
const glow       = ref(true)
const quickText  = ref('')
const statusFilt = ref<'all' | 'open' | 'closed'>('all')
const gridKey    = ref(0)

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
const WS_IDS = ['trades', 'monitor', 'positions', 'scorecard', 'feed'] as const
type WsId = typeof WS_IDS[number]

const WS_TITLES: Record<WsId, string> = {
  trades:    'Trades',
  monitor:   'Fleet Monitor',
  positions: 'Positions',
  scorecard: 'Scorecard',
  feed:      'Signal Feed',
}

function buildWsLayout(wsW: number, wsH: number): Record<string, ContainerState> {
  const M      = 12
  const leftW  = Math.round(wsW * 0.62) - M
  const rightX = leftW + M * 2
  const rightW = wsW - rightX - M
  const topH   = Math.round(wsH * 0.58)
  const botY   = topH + M * 2
  const botH   = wsH - botY - M
  const sumH   = Math.round(topH * 0.30)
  const scH    = Math.round(topH * 0.36)
  const gridY  = sumH + M + scH + M
  const gridH  = topH - gridY
  return {
    trades:    { x: M,      y: M,         w: leftW,  h: topH,  visible: true, minimized: false, maximized: false, zIndex: 1 },
    monitor:   { x: rightX, y: M,         w: rightW, h: sumH,  visible: true, minimized: false, maximized: false, zIndex: 2 },
    scorecard: { x: rightX, y: sumH+M*2,  w: rightW, h: scH,   visible: true, minimized: false, maximized: false, zIndex: 3 },
    positions: { x: rightX, y: gridY+M,   w: rightW, h: gridH, visible: true, minimized: false, maximized: false, zIndex: 4 },
    feed:      { x: M,      y: botY,       w: wsW-M*2, h: botH, visible: true, minimized: false, maximized: false, zIndex: 5 },
  }
}

// Compute on first load (viewport size). Reset button recomputes at click time.
const wsLayout = buildWsLayout(window.innerWidth, window.innerHeight - 88)

// ── Mock workspace content ────────────────────────────────────────────────────
const openTrades = trades.filter(t => t.status === 'open').slice(0, 8)

const STRATS = ['momentum', 'ema adx', 'trend tf', 'keltner', 'donchian']
const SYMS   = ['XLM','ZEC','BTC','ETH','SOL','ADA','AVAX','MATIC','HIGH','DOGE']
function mockCells(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    sym: SYMS[i % SYMS.length],
    open: Math.random() < 0.12,
  }))
}

const scorecardRows = STRATEGIES.slice(0, 6).map(s => ({
  name: s.replace(/_daily$/, '').replace(/_/g, ' '),
  trades: Math.floor(Math.random() * 20) + 2,
  winPct: (40 + Math.random() * 40).toFixed(0),
  exp: (Math.random() * 3 - 0.5).toFixed(2),
}))

const feedEvents = [
  { ts: '2m',  icon: '▲', sym: 'XLM',  strat: 'momentum breakout', pnl: null },
  { ts: '18m', icon: '✓', sym: 'HIGH', strat: 'ema adx',            pnl: '+2.76%', pos: true },
  { ts: '1h',  icon: '✕', sym: 'ZEC',  strat: 'hh hl trend follow', pnl: '-4.00%', pos: false },
  { ts: '2h',  icon: '▲', sym: 'SOL',  strat: 'keltner breakout',   pnl: null },
  { ts: '3h',  icon: '✓', sym: 'AVAX', strat: 'donchian breakout',  pnl: '+1.12%', pos: true },
]

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
function seedLogEntries() {
  const out: LogEntry[] = []
  const base = Date.now() - 1000 * 60 * 30
  for (let i = 0; i < 80; i++) {
    const tpl = LOG_TEMPLATES[i % LOG_TEMPLATES.length]
    out.push({ ts: base + i * 22_000, text: tpl.text, level: tpl.level })
  }
  logEntries.value = out
}
seedLogEntries()
</script>

<template>
  <div class="demo-shell" :class="{ 'cathode-light': !isDark }">

    <!-- ── Top bar ──────────────────────────────────────────────── -->
    <div class="demo-bar">
      <span class="demo-title">⬛ CATHODE</span>

      <!-- Tab switcher -->
      <div class="demo-tabs">
        <button :class="['tab-btn', { active: activeTab === 'workspace' }]" @click="activeTab = 'workspace'">
          Workspace
        </button>
        <button :class="['tab-btn', { active: activeTab === 'grid' }]" @click="activeTab = 'grid'">
          Grid
        </button>
        <button :class="['tab-btn', { active: activeTab === 'log' }]" @click="activeTab = 'log'">
          Log
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
      <CathodeGrid
        :key="gridKey"
        :column-defs="columnDefs"
        :default-col-def="defaultColDef"
        :row-height="28"
        :theme="theme"
        :curvature="curvature"
        :scanlines="scanlines"
        :glow="glow"
        :pagination="true"
        :pagination-page-size="50"
        @grid-ready="onGridReady"
      />
    </div>

    <!-- ── Log tab ───────────────────────────────────────────────── -->
    <div v-show="activeTab === 'log'" class="tab-content">
      <CathodeLog
        :entries="logEntries"
        :theme="theme"
        :curvature="curvature"
        :scanlines="scanlines"
        :glow="glow"
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
          <CathodeGrid
            :key="resizeKey"
            :column-defs="columnDefs"
            :default-col-def="defaultColDef"
            :row-height="26"
            :theme="theme"
            :curvature="curvature"
            :scanlines="scanlines"
            :glow="false"
            :pagination="true"
            :pagination-page-size="50"
            @grid-ready="onGridReady"
          />
        </template>
      </CathodeContainer>

      <!-- FLEET MONITOR — colored agent cells -->
      <CathodeContainer id="monitor" title="Fleet Monitor" :curvature="curvature">
        <div class="mock-monitor">
          <div v-for="(strat, si) in STRATS" :key="si" class="mon-row">
            <div class="mon-label">{{ strat }}</div>
            <div class="mon-cells">
              <div
                v-for="(cell, ci) in mockCells(6)"
                :key="ci"
                :class="['mon-cell', cell.open ? 'cell-open' : 'cell-monitoring']"
              >
                <span v-if="cell.open" class="mon-ticker">{{ cell.sym }}</span>
              </div>
              <span class="mon-count">×{{ 20 + si }}</span>
            </div>
          </div>
        </div>
      </CathodeContainer>

      <!-- SCORECARD -->
      <CathodeContainer id="scorecard" title="Scorecard" :curvature="curvature">
        <div class="mock-scorecard">
          <div class="sc-head">
            <span class="sc-hcell sc-wide">Strategy</span>
            <span class="sc-hcell">Trades</span>
            <span class="sc-hcell">Win%</span>
            <span class="sc-hcell">Exp%</span>
          </div>
          <div v-for="r in scorecardRows" :key="r.name" class="sc-row">
            <span class="sc-cell sc-wide">{{ r.name }}</span>
            <span class="sc-cell">{{ r.trades }}</span>
            <span class="sc-cell" :class="Number(r.winPct) >= 50 ? 'up' : 'dn'">{{ r.winPct }}%</span>
            <span class="sc-cell" :class="Number(r.exp) >= 0 ? 'up' : 'dn'">{{ Number(r.exp) >= 0 ? '+' : '' }}{{ r.exp }}%</span>
          </div>
        </div>
      </CathodeContainer>

      <!-- POSITIONS -->
      <CathodeContainer id="positions" title="Positions" :curvature="curvature">
        <div class="mock-positions">
          <div v-if="!openTrades.length" class="mock-empty">No open positions</div>
          <div v-for="t in openTrades" :key="t.entry_timestamp + t.product" class="pos-row">
            <span class="pos-sym">{{ t.product.replace(/-USD[C]?$/, '') }}</span>
            <span class="pos-strat">{{ t.strategy.replace(/_daily$/, '').replace(/_/g, ' ') }}</span>
            <span class="pos-pnl" :class="Number(t.pnl_pct) >= 0 ? 'up' : 'dn'">
              {{ Number(t.pnl_pct) >= 0 ? '+' : '' }}{{ Number(t.pnl_pct).toFixed(2) }}%
            </span>
          </div>
        </div>
      </CathodeContainer>

      <!-- SIGNAL FEED -->
      <CathodeContainer id="feed" title="Signal Feed" :curvature="curvature">
        <div class="mock-feed">
          <div
            v-for="(ev, i) in feedEvents"
            :key="i"
            :class="['feed-ev', ev.pnl === null ? 'ev-entry' : ev.pos ? 'ev-profit' : 'ev-loss']"
          >
            <span class="ev-ts">{{ ev.ts }}</span>
            <span class="ev-icon">{{ ev.icon }}</span>
            <span class="ev-sym">{{ ev.sym }}</span>
            <span class="ev-strat">{{ ev.strat }}</span>
            <span v-if="ev.pnl" class="ev-pnl" :class="ev.pos ? 'up' : 'dn'">{{ ev.pnl }}</span>
          </div>
        </div>
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

/* ── Grid tab ───────────────────────────────────────────────────── */
.tab-content { flex: 1; min-height: 0; }

/* ── Mock container content ─────────────────────────────────────── */
.mock-monitor {
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
  background: var(--cc-surface);
  overflow: hidden;
}
.mon-row   { display: flex; align-items: center; gap: 8px; }
.mon-label {
  width: 90px; flex-shrink: 0;
  font-size: 8px; font-family: monospace; letter-spacing: 0.04em;
  color: var(--cc-tx3); text-align: right; text-transform: uppercase;
  padding-right: 6px; border-right: 2px solid var(--cc-border-2);
}
.mon-cells { display: flex; flex-wrap: wrap; gap: 3px; align-items: center; }
.mon-cell {
  width: 20px; height: 20px; border-radius: 2px;
  display: flex; align-items: center; justify-content: center;
}
.cell-monitoring { background: #1a2f4a; border: 1px solid #2e4f72; }
.cell-open {
  background: #0d3d1f; border: 1px solid #00cc55;
  box-shadow: 0 0 6px rgba(0,210,90,0.5);
  animation: pulse-open 1.6s ease-in-out infinite;
}
.mon-ticker { font-size: 5px; font-family: monospace; font-weight: bold; color: rgba(255,255,255,0.7); }
.mon-count  { font-size: 9px; font-family: monospace; color: var(--cc-tx3); }

@keyframes pulse-open {
  0%, 100% { box-shadow: 0 0 4px rgba(0,210,90,0.4); }
  50%       { box-shadow: 0 0 10px rgba(0,240,110,0.8); }
}

.mock-scorecard {
  height: 100%; background: var(--cc-surface); overflow: hidden;
  display: flex; flex-direction: column;
}
.sc-head {
  display: flex; background: var(--cc-header);
  border-bottom: 1px solid var(--cc-border);
  height: 26px; flex-shrink: 0;
}
.sc-hcell {
  font-size: 8px; font-family: monospace; font-weight: bold;
  letter-spacing: 0.06em; color: var(--cc-tx3); text-transform: uppercase;
  padding: 0 8px; display: flex; align-items: center;
  border-right: 1px solid var(--cc-border); min-width: 55px;
}
.sc-hcell.sc-wide { min-width: 160px; flex: 1; }
.sc-row {
  display: flex; border-bottom: 1px solid var(--cc-border);
  height: 24px; cursor: pointer;
}
.sc-row:hover { background: rgba(255,255,255,0.025); }
.sc-cell {
  font-size: 10px; font-family: monospace; color: var(--cc-tx2);
  padding: 0 8px; display: flex; align-items: center;
  border-right: 1px solid var(--cc-border); min-width: 55px;
}
.sc-cell.sc-wide { min-width: 160px; flex: 1; color: var(--cc-tx1); }
.up { color: #00bc8c; } .dn { color: #e74c3c; }

.mock-positions {
  height: 100%; background: var(--cc-surface); overflow-y: auto;
  padding: 6px 10px; display: flex; flex-direction: column; gap: 3px;
}
.mock-empty { font-size: 10px; font-family: monospace; color: var(--cc-tx3); padding: 8px; }
.pos-row {
  display: flex; align-items: center; gap: 8px;
  padding: 3px 6px; border-radius: 2px;
  border: 1px solid var(--cc-border);
  background: var(--cc-surface);
  font-family: monospace; font-size: 10px;
}
.pos-sym   { font-weight: bold; color: var(--cc-tx1); min-width: 36px; }
.pos-strat { color: var(--cc-tx3); font-size: 9px; flex: 1; }
.pos-pnl   { font-weight: bold; font-size: 10px; }

.mock-feed {
  height: 100%; background: var(--cc-surface); overflow-y: auto;
  padding: 4px 0; display: flex; flex-direction: column;
}
.feed-ev {
  display: flex; align-items: center; gap: 6px;
  padding: 3px 10px; font-family: monospace; font-size: 10px;
  border-left: 2px solid transparent;
}
.feed-ev:hover { background: rgba(255,255,255,0.03); }
.ev-entry  { border-color: var(--cc-accent-text); }
.ev-profit { border-color: #00bc8c; }
.ev-loss   { border-color: #e74c3c; }
.ev-ts     { font-size: 9px; color: var(--cc-tx3); min-width: 24px; }
.ev-icon   { font-size: 10px; color: var(--cc-tx2); }
.ev-sym    { font-weight: bold; color: var(--cc-tx1); min-width: 36px; }
.ev-strat  { color: var(--cc-tx3); font-size: 9px; flex: 1; }
.ev-pnl    { font-weight: bold; }

/* scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: var(--cc-base); }
::-webkit-scrollbar-thumb { background: var(--cc-border-2); border-radius: 2px; }
</style>
