// Rotating or scaling an SVG element around an exact point in the drawing.
//
// Motion applies SVG transforms with CSS, so the pivot comes from `transform-origin` against a
// `transform-box`. With `view-box`, Chrome measures the origin from the viewBox's min-x/min-y
// corner rather than from the user-space origin — so pivots drift whenever a viewBox doesn't
// start at 0,0 (a centred diagram, or an animated camera). Wrapping the drawing in <PivotSpace>
// (a nested <svg>) creates a viewport whose origin *is* the user-space origin, which makes `pivot(p)`
// mean exactly the point p.

export type Pt = { x: number; y: number };

// Motion derives transform-origin from originX/originY (a plain `transformOrigin` style is
// overwritten), so the pivot has to be expressed through those, in px.
export const pivot = (p: Pt) => ({
  transformBox: 'view-box' as const,
  originX: `${p.x}px`,
  originY: `${p.y}px`,
});
