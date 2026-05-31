#!/usr/bin/env bash
# capture-hero.sh — orchestrate vite + the Playwright hero-shot script.
# Starts vite on port 5180, waits for it to respond, runs the capture,
# tears vite down cleanly. Output: docs/hero.png.

set -eu

PORT="${CATHODE_DEMO_PORT:-5180}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Boot vite in the background, capture its PID so we can kill it after.
echo "→ starting vite on port $PORT …"
npx vite --port "$PORT" --strictPort >/tmp/cathode-vite-capture.log 2>&1 &
VITE_PID=$!

cleanup() {
  if kill -0 "$VITE_PID" 2>/dev/null; then
    kill "$VITE_PID" 2>/dev/null || true
    wait "$VITE_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

# Wait up to 60s for vite to respond.
deadline=$(( $(date +%s) + 60 ))
until curl -sf "http://localhost:$PORT" >/dev/null 2>&1; do
  if [ "$(date +%s)" -gt "$deadline" ]; then
    echo "→ vite did not respond within 60s. Last log lines:"
    tail -20 /tmp/cathode-vite-capture.log
    exit 1
  fi
  sleep 0.5
done

echo "→ vite ready, running capture …"
node "$ROOT/tools/capture-hero.mjs"

echo "→ done. Image: docs/hero.png"
