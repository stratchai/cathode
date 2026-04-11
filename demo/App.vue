<script setup lang="ts">
import { ref, computed } from 'vue'
import CathodeGrid from '../src/CathodeGrid.vue'
import type { ColDef, GridApi } from '../src/types'

// ── Mock trade data ───────────────────────────────────────────────────────────

const STRATEGIES = [
  'momentum_breakout_daily', 'ema_adx_daily', 'hh_hl_trend_follow_daily',
  'keltner_breakout_daily',  'donchian_breakout_daily', 'hma_trend_daily',
  'adx_psar_daily',          'bull_flag_breakout_long_stock_daily',
]
const PRODUCTS  = ['BTC-USD','ETH-USD','SOL-USD','AAPL','NVDA','MSFT','TSLA','AMZN','META','GOOGL']
const EXCHANGES = ['coinbase','coinbase','coinbase','alpaca','alpaca','alpaca','alpaca','alpaca','alpaca','alpaca']

function rnd(min: number, max: number) { return +(Math.random() * (max - min) + min).toFixed(4) }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function fmtDate(d: Date) {
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

const now = Date.now()
const trades = Array.from({ length: 240 }, (_, i) => {
  const idx        = i % PRODUCTS.length
  const product    = PRODUCTS[idx]
  const exchange   = EXCHANGES[idx]
  const strategy   = pick(STRATEGIES)
  const entryMs    = now - Math.floor(Math.random() * 30 * 24 * 3600_000)
  const isOpen     = Math.random() < 0.15
  const entryPrice = rnd(10, 3000)
  const pnlPct     = rnd(-8, 22)
  const feePct     = 0.12
  const netPnlPct  = +(pnlPct - feePct).toFixed(4)
  const notional   = +(entryPrice * rnd(0.2, 2)).toFixed(2)
  const exitMs     = isOpen ? null : entryMs + Math.floor(Math.random() * 15 * 24 * 3600_000)
  return {
    timestamp:       fmtDate(new Date(entryMs)),
    entry_timestamp: fmtDate(new Date(entryMs)),
    exit_timestamp:  exitMs ? fmtDate(new Date(exitMs)) : '',
    product,
    strategy,
    exchange,
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
  }
})

// ── Column definitions (same surface as dashboard TradesTable) ─────────────────

const NUM = (d: number) => (p: any) =>
  (p.value !== '' && p.value != null && !isNaN(Number(p.value))) ? Number(p.value).toFixed(d) : ''

const PCT = (p: any) =>
  (p.value !== '' && p.value != null && !isNaN(Number(p.value))) ? Number(p.value).toFixed(2) + '%' : '—'

const RIGHT = { textAlign: 'right' as const }

const columnDefs: ColDef[] = [
  {
    headerName:   'Timestamp',
    width:        150,
    sort:         'desc',
    valueGetter:  (p) => p.data.entry_timestamp || p.data.timestamp || '',
  },
  {
    headerName:   'Status',
    width:        75,
    filter:       true,
    valueGetter:  (p) => p.data.status ?? 'closed',
    cellStyle:    (p) => ({ color: p.value === 'open' ? '#00bc8c' : '#e74c3c' }),
  },
  { field: 'product',      width: 110, filter: true },
  { field: 'strategy',     width: 200, filter: true },
  { field: 'exchange',     width: 85,  filter: true },
  { field: 'entry_price',  width: 100, headerName: 'Entry',     valueFormatter: NUM(4), cellStyle: RIGHT },
  { field: 'exit_price',   width: 100, headerName: 'Exit',      valueFormatter: NUM(4), cellStyle: RIGHT },
  { field: 'size_base',    width: 90,  headerName: 'Size',      valueFormatter: NUM(6), cellStyle: RIGHT },
  {
    field:        'pnl_pct',
    width:        80,
    headerName:   'PnL %',
    valueFormatter: PCT,
    cellStyle:    (p) => ({ ...RIGHT, color: Number(p.value) >= 0 ? '#00bc8c' : '#e74c3c' }),
  },
  {
    field:        'net_pnl_pct',
    width:        90,
    headerName:   'Net PnL %',
    valueFormatter: PCT,
    cellStyle:    (p) => ({ ...RIGHT, color: Number(p.value) >= 0 ? '#00bc8c' : '#e74c3c' }),
  },
  { field: 'reason',          width: 90,  filter: true },
  { field: 'notional',        width: 90,  headerName: 'Notional', valueFormatter: NUM(2), cellStyle: RIGHT },
  { field: 'take_profit_pct', width: 70,  headerName: 'TP %',     valueFormatter: PCT,    cellStyle: RIGHT },
  { field: 'rsi_at_entry',    width: 70,  headerName: 'RSI',      valueFormatter: NUM(1), cellStyle: RIGHT },
]

const defaultColDef: ColDef = { resizable: true, sortable: true }

// ── UI state ──────────────────────────────────────────────────────────────────

const gridApi    = ref<GridApi | null>(null)
const theme      = ref<'none' | 'phosphor' | 'amber' | 'paper'>('none')
const curvature  = ref(10)
const scanlines  = ref(true)
const glow       = ref(true)
const quickText  = ref('')
const statusFilt = ref<'all' | 'open' | 'closed'>('all')

function onGridReady(e: { api: GridApi }) {
  gridApi.value = e.api
  e.api.setGridOption('rowData', trades)
}

function onRowClicked(e: { data: any }) {
  console.log('[cathode demo] row clicked:', e.data.product, e.data.strategy)
}

function onQuickFilter(e: Event) {
  const val = (e.target as HTMLInputElement).value
  quickText.value = val
  gridApi.value?.setGridOption('quickFilterText', val)
}

function setStatus(s: 'all' | 'open' | 'closed') {
  statusFilt.value = s
  if (s === 'all') {
    gridApi.value?.setFilterModel(null)
  } else {
    gridApi.value?.setFilterModel({ status: { type: 'equals', filter: s } })
  }
  gridApi.value?.onFilterChanged()
}

function exportCsv() {
  gridApi.value?.exportDataAsCsv({ fileName: `cathode_demo_${new Date().toISOString().slice(0,10)}.csv` })
}

const isDark = computed(() => theme.value !== 'paper')

const bgStyle = computed(() => ({
  background: theme.value === 'phosphor' ? '#060d06'
    : theme.value === 'amber'            ? '#0a0700'
    : theme.value === 'paper'            ? '#f0f0f0'
    : '#111827',
  color: theme.value === 'paper' ? '#222' : '#e8f2ff',
}))
</script>

<template>
  <div class="demo-shell" :style="bgStyle">
    <!-- toolbar -->
    <div class="demo-bar">
      <span class="demo-title">⬛ CATHODE <span class="demo-sub">datagrid</span></span>

      <!-- theme -->
      <label>Theme</label>
      <select v-model="theme">
        <option value="none">Dashboard (default)</option>
        <option value="phosphor">Phosphor Green</option>
        <option value="amber">Amber</option>
        <option value="paper">Paper (light)</option>
      </select>

      <!-- curvature -->
      <label>Curve {{ curvature }}°</label>
      <input type="range" min="0" max="20" step="1" v-model.number="curvature" style="width:90px" />

      <label><input type="checkbox" v-model="scanlines" /> Scanlines</label>
      <label><input type="checkbox" v-model="glow" />      Glow</label>

      <div class="demo-spacer" />

      <!-- status filter -->
      <div class="demo-btns">
        <button :class="{ active: statusFilt==='all' }"    @click="setStatus('all')">All</button>
        <button :class="{ active: statusFilt==='open' }"   @click="setStatus('open')">Open</button>
        <button :class="{ active: statusFilt==='closed' }" @click="setStatus('closed')">Closed</button>
      </div>

      <input class="demo-filter" placeholder="Quick filter…" :value="quickText" @input="onQuickFilter" />
      <button class="demo-action" @click="exportCsv">↓ CSV</button>
    </div>

    <!-- grid -->
    <div class="demo-grid-wrap">
      <CathodeGrid
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
        @row-clicked="onRowClicked"
      />
    </div>
  </div>
</template>

<style scoped>
.demo-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: system-ui, sans-serif;
  transition: background 0.2s, color 0.2s;
}

.demo-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  background: rgba(0,0,0,0.25);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
  flex-wrap: wrap;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

.demo-title {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.1em;
  color: #40c0ff;
  margin-right: 8px;
}
.demo-sub {
  font-size: 10px;
  opacity: 0.55;
  font-weight: normal;
  letter-spacing: 0.2em;
}

label { font-size: 11px; opacity: 0.7; }

select, input[type="range"] {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: inherit;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
}

.demo-spacer { flex: 1; }

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
.demo-btns button.active { border-color: #40a0f0; color: #40a0f0; }

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
.demo-filter:focus { border-color: #40a0f0; }

.demo-action {
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  color: inherit;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 3px;
  cursor: pointer;
}
.demo-action:hover { border-color: #40a0f0; }

.demo-grid-wrap {
  flex: 1;
  min-height: 0;
  padding: 0;
}
</style>
