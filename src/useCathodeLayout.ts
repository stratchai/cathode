import { ref } from 'vue'

/** Increments each time reset() is called — watchers use this to force redraws. */
export const resetTick = ref(0)

export interface ContainerState {
  x:         number
  y:         number
  w:         number
  h:         number
  visible:   boolean
  minimized: boolean
  maximized: boolean
  zIndex:    number
}

export const TITLEBAR_H = 28
const M = 12

let maxZ       = 10
let lsKey      = 'cathode.layout'
let initialized = false

const containers = ref<Record<string, ContainerState>>({})

function load(initial: Record<string, ContainerState>, storageKey = 'cathode.layout') {
  if (initialized) return
  initialized = true
  lsKey = storageKey
  try {
    const saved = localStorage.getItem(lsKey)
    if (saved) {
      containers.value = JSON.parse(saved)
      // Sync maxZ to whatever the persisted layout already has, otherwise
      // bringToFront() will hand out values lower than existing zIndices and
      // a maximized container can stay behind something previously focused.
      syncMaxZ()
      return
    }
  } catch { /* ignore */ }
  containers.value = { ...initial }
  syncMaxZ()
}

function syncMaxZ() {
  let m = 10
  for (const c of Object.values(containers.value)) {
    if (typeof c?.zIndex === 'number' && c.zIndex > m) m = c.zIndex
  }
  maxZ = m
}

function save() {
  localStorage.setItem(lsKey, JSON.stringify(containers.value))
}

function reset(initial: Record<string, ContainerState>) {
  initialized = false
  localStorage.removeItem(lsKey)
  containers.value = { ...initial }
  save()
  initialized = true
  resetTick.value++
}

function bringToFront(id: string) {
  maxZ++
  if (containers.value[id]) containers.value[id].zIndex = maxZ
}

function setVisible(id: string, v: boolean) {
  containers.value[id].visible = v
  save()
}

function setMinimized(id: string, v: boolean) {
  containers.value[id].minimized = v
  if (v) containers.value[id].maximized = false
  save()
}

function setMaximized(id: string, v: boolean) {
  containers.value[id].maximized = v
  if (v) {
    containers.value[id].minimized = false
    // Bring to front when maximizing — otherwise the maximized panel can
    // sit behind another container that was clicked more recently and the
    // user sees the maximized panel covered by the other one.
    bringToFront(id)
  }
  save()
}

function updatePos(id: string, x: number, y: number) {
  containers.value[id].x = Math.round(x)
  containers.value[id].y = Math.round(y)
  save()
}

function updateSize(id: string, w: number, h: number) {
  containers.value[id].w = Math.round(w)
  containers.value[id].h = Math.round(h)
  save()
}

/** Compute a tiled default layout from workspace dimensions. */
export function buildDefaultLayout(
  wsW: number,
  wsH: number,
  ids: string[],
): Record<string, ContainerState> {
  const cols  = Math.ceil(Math.sqrt(ids.length))
  const rows  = Math.ceil(ids.length / cols)
  const cellW = Math.floor((wsW - M * (cols + 1)) / cols)
  const cellH = Math.floor((wsH - M * (rows + 1)) / rows)
  const result: Record<string, ContainerState> = {}
  ids.forEach((id, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    result[id] = {
      x: M + col * (cellW + M),
      y: M + row * (cellH + M),
      w: cellW,
      h: cellH,
      visible:   true,
      minimized: false,
      maximized: false,
      zIndex:    i + 1,
    }
  })
  return result
}

export { M }

export function useCathodeLayout() {
  return {
    containers,
    TITLEBAR_H,
    load,
    save,
    reset,
    bringToFront,
    setVisible,
    setMinimized,
    setMaximized,
    updatePos,
    updateSize,
  }
}
