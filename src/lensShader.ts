/**
 * Shared magnify-lens shader pieces — used by CathodeGrid / CathodeLog /
 * CathodeCandle. Each component drops the GLSL fragments into its own FRAG
 * string and wires the same uniform names; this module just keeps the
 * implementation in one place so all three lenses look and feel identical.
 *
 * Tuning (LENS_RADIUS / LENS_ZOOM) is chosen to mimic an old-person reading
 * lens: large flat field with only a hint of glass curl at the rim, not a
 * fish-eye orb. See the comment block in `LENS_FRAG_FN` for the math.
 */

import * as THREE from 'three'

/**
 * Lens diameter in screen pixels. Fixed so the lens reads as a real
 * "magnifying glass" — same physical size across components and across
 * panel sizes. Sized to match what the Grid felt like under the previous
 * height-relative formula (~320px on a workspace-sized Grid panel). Small
 * panels (e.g. the workspace Log at ~220px tall) will get a lens that
 * extends slightly past the rim — that matches a real lens held over a
 * narrow page; the shader naturally clips outside the canvas.
 */
export const LENS_DIAMETER_PX = 500
export const LENS_RADIUS_PX   = LENS_DIAMETER_PX / 2

/** Magnification factor inside the lens. */
export const LENS_ZOOM = 1.6

/** GLSL uniforms block — paste at top of FRAG, before any function defs. */
export const LENS_FRAG_UNIFORMS = `
  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off
  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)
  uniform float uLensZoom;   // lens magnification factor (~1.6)
  uniform vec3  uLensTint;   // ring tint (phosphor accent)
  uniform float uAspect;     // canvas W / H — needed to draw a circular lens
`

/**
 * GLSL function chunk — paste before main(). Defines `applyLens(uv)` which
 * pulls sample positions toward uMouseUV when within radius, producing a
 * flat-field magnifier with a subtle glass curl at the outer 12%.
 */
export const LENS_FRAG_FN = `
  // Pull sample position toward mouse when within lens radius — compresses
  // the sampled region so it displays magnified. Distance is computed in
  // aspect-corrected space (x scaled by W/H) so the lens is circular in
  // pixels regardless of canvas proportions; the inverse aspect scale is
  // applied when reconstructing the sample UV.
  //
  // Magnification is FLAT across the inner ~88% of the lens, then tapers
  // through the outer rim — just enough taper to read as a real glass curl
  // at the edge without becoming a fish-eye orb. The inner-flat percentage
  // (smoothstep first arg) controls how much "magnifier" vs "convex" the
  // lens reads as: smaller number = more orb-like.
  vec2 applyLens(vec2 uv) {
    if (uLensR <= 0.0) return uv;
    vec2  d    = (uv - uMouseUV) * vec2(uAspect, 1.0);
    float dist = length(d);
    if (dist >= uLensR) return uv;
    float t    = dist / uLensR;
    float zoom = mix(uLensZoom, 1.0, smoothstep(0.88, 1.0, t));
    vec2  newD = (d / zoom) * vec2(1.0 / uAspect, 1.0);
    return uMouseUV + newD;
  }
`

/**
 * GLSL ring-overlay block — paste at the bottom of main(), after the texture
 * sample is composed into `color`. Adds a faint phosphor-tinted rim that
 * masks the magnification discontinuity at the lens edge.
 */
export const LENS_FRAG_RING = `
    // Lens ring — visually masks the magnification seam at the rim.
    if (uLensR > 0.0) {
      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);
      float ringDist = abs(length(rd) - uLensR);
      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);
      color.rgb     += uLensTint * ring * 0.32;
    }
`

/** Create the standard set of lens uniforms for a ShaderMaterial. */
export function createLensUniforms() {
  return {
    uMouseUV:  { value: new THREE.Vector2(-999, -999) },
    uLensR:    { value: 0.0 },
    uLensZoom: { value: LENS_ZOOM },
    uLensTint: { value: new THREE.Color(0x6ee7a7) },
    uAspect:   { value: 1.0 },
  }
}

/** Mouse-UV state used by each component to track the cursor for the lens. */
export interface MouseLensUV { x: number; y: number }
export const LENS_INACTIVE: MouseLensUV = { x: -999, y: -999 }

/**
 * Update the lens uniforms on the material. Call from each component's
 * redraw() once the canvas dimensions and mouse position are known.
 *
 *   - `magnify` is the user-facing prop (lens enabled / disabled)
 *   - `mouseUV` is (-999,-999) when the mouse isn't over the canvas
 *   - `canvasW/H` come from the offscreen drawing canvas (not the wrap div)
 */
export function writeLensUniforms(
  material: THREE.ShaderMaterial,
  magnify: boolean,
  mouseUV: MouseLensUV,
  canvasW: number,
  canvasH: number,
) {
  const active = magnify && mouseUV.x !== -999
  ;(material.uniforms.uMouseUV.value as THREE.Vector2).set(mouseUV.x, mouseUV.y)
  // Convert the fixed pixel radius to a UV-y radius — the shader uses
  // y-axis-UV units (with x scaled by aspect inside applyLens). This makes
  // the rendered lens a fixed physical size regardless of canvas dimensions.
  material.uniforms.uLensR.value  = active && canvasH > 0
    ? LENS_RADIUS_PX / canvasH
    : 0.0
  material.uniforms.uAspect.value = canvasH > 0 ? canvasW / canvasH : 1.0
}

/** Compute UV from a MouseEvent against the canvas element bounding rect. */
export function eventToLensUV(e: MouseEvent, canvas: HTMLCanvasElement): MouseLensUV {
  const rect = canvas.getBoundingClientRect()
  return {
    x:     (e.clientX - rect.left) / rect.width,
    y: 1 - (e.clientY - rect.top)  / rect.height,
  }
}
