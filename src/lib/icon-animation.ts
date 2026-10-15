// Barrel: preserves the `@/lib/icon-animation` import surface.
// transform (pure) and animation-cache (fetch) stay independent.
export type { AnimationData } from "./animation/transform";
export { hoverSegment, prepareAnimation } from "./animation/transform";
export { loadAnimationData } from "./animation/animation-cache";
