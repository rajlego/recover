/**
 * Animated starfield background with nebula glow.
 * Pure CSS — no JS overhead.
 */
export function Starfield() {
  return (
    <>
      <div className="starfield" aria-hidden="true">
        <div className="stars-layer stars-1" />
        <div className="stars-layer stars-2" />
        <div className="stars-layer stars-3" />
      </div>
      <div className="nebula" aria-hidden="true" />
    </>
  );
}
