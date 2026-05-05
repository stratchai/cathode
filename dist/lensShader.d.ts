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
import * as THREE from 'three';
/**
 * Lens diameter in screen pixels. Fixed so the lens reads as a real
 * "magnifying glass" — same physical size across components and across
 * panel sizes. Sized to match what the Grid felt like under the previous
 * height-relative formula (~320px on a workspace-sized Grid panel). Small
 * panels (e.g. the workspace Log at ~220px tall) will get a lens that
 * extends slightly past the rim — that matches a real lens held over a
 * narrow page; the shader naturally clips outside the canvas.
 */
export declare const LENS_DIAMETER_PX = 500;
export declare const LENS_RADIUS_PX: number;
/** Magnification factor inside the lens. */
export declare const LENS_ZOOM = 1.6;
/** GLSL uniforms block — paste at top of FRAG, before any function defs. */
export declare const LENS_FRAG_UNIFORMS = "\n  uniform vec2  uMouseUV;    // mouse position in UV space; (-999,-999) = lens off\n  uniform float uLensR;      // lens radius in aspect-corrected units (0 = disabled)\n  uniform float uLensZoom;   // lens magnification factor (~1.6)\n  uniform vec3  uLensTint;   // ring tint (phosphor accent)\n  uniform float uAspect;     // canvas W / H \u2014 needed to draw a circular lens\n";
/**
 * GLSL function chunk — paste before main(). Defines `applyLens(uv)` which
 * pulls sample positions toward uMouseUV when within radius, producing a
 * flat-field magnifier with a subtle glass curl at the outer 12%.
 */
export declare const LENS_FRAG_FN = "\n  // Pull sample position toward mouse when within lens radius \u2014 compresses\n  // the sampled region so it displays magnified. Distance is computed in\n  // aspect-corrected space (x scaled by W/H) so the lens is circular in\n  // pixels regardless of canvas proportions; the inverse aspect scale is\n  // applied when reconstructing the sample UV.\n  //\n  // Magnification is FLAT across the inner ~88% of the lens, then tapers\n  // through the outer rim \u2014 just enough taper to read as a real glass curl\n  // at the edge without becoming a fish-eye orb. The inner-flat percentage\n  // (smoothstep first arg) controls how much \"magnifier\" vs \"convex\" the\n  // lens reads as: smaller number = more orb-like.\n  vec2 applyLens(vec2 uv) {\n    if (uLensR <= 0.0) return uv;\n    vec2  d    = (uv - uMouseUV) * vec2(uAspect, 1.0);\n    float dist = length(d);\n    if (dist >= uLensR) return uv;\n    float t    = dist / uLensR;\n    float zoom = mix(uLensZoom, 1.0, smoothstep(0.88, 1.0, t));\n    vec2  newD = (d / zoom) * vec2(1.0 / uAspect, 1.0);\n    return uMouseUV + newD;\n  }\n";
/**
 * GLSL ring-overlay block — paste at the bottom of main(), after the texture
 * sample is composed into `color`. Adds a faint phosphor-tinted rim that
 * masks the magnification discontinuity at the lens edge.
 */
export declare const LENS_FRAG_RING = "\n    // Lens ring \u2014 visually masks the magnification seam at the rim.\n    if (uLensR > 0.0) {\n      vec2  rd       = (vUv - uMouseUV) * vec2(uAspect, 1.0);\n      float ringDist = abs(length(rd) - uLensR);\n      float ring     = 1.0 - smoothstep(0.002, 0.012, ringDist);\n      color.rgb     += uLensTint * ring * 0.32;\n    }\n";
/** Create the standard set of lens uniforms for a ShaderMaterial. */
export declare function createLensUniforms(): {
    uMouseUV: {
        value: THREE.Vector2;
    };
    uLensR: {
        value: number;
    };
    uLensZoom: {
        value: number;
    };
    uLensTint: {
        value: THREE.Color;
    };
    uAspect: {
        value: number;
    };
};
/** Mouse-UV state used by each component to track the cursor for the lens. */
export interface MouseLensUV {
    x: number;
    y: number;
}
export declare const LENS_INACTIVE: MouseLensUV;
/**
 * Update the lens uniforms on the material. Call from each component's
 * redraw() once the canvas dimensions and mouse position are known.
 *
 *   - `magnify` is the user-facing prop (lens enabled / disabled)
 *   - `mouseUV` is (-999,-999) when the mouse isn't over the canvas
 *   - `canvasW/H` come from the offscreen drawing canvas (not the wrap div)
 */
export declare function writeLensUniforms(material: THREE.ShaderMaterial, magnify: boolean, mouseUV: MouseLensUV, canvasW: number, canvasH: number): void;
/** Compute UV from a MouseEvent against the canvas element bounding rect. */
export declare function eventToLensUV(e: MouseEvent, canvas: HTMLCanvasElement): MouseLensUV;
