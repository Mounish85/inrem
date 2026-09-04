import React, { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [target, setTarget] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e) => {
      setTarget({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const targetEl = e.target;
      const isClickable =
        targetEl.closest("button") ||
        targetEl.closest("a") ||
        targetEl.closest("input") ||
        targetEl.closest("select") ||
        targetEl.closest("textarea") ||
        targetEl.closest(".clickable") ||
        window.getComputedStyle(targetEl).cursor === "pointer";

      setIsHovering(!!isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth lerp movement (approx 0.2 factor)
  useEffect(() => {
    let animationFrameId;

    const updateCursor = () => {
      setPosition((prev) => ({
        x: prev.x + (target.x - prev.x) * 0.2,
        y: prev.y + (target.y - prev.y) * 0.2,
      }));
      animationFrameId = requestAnimationFrame(updateCursor);
    };

    animationFrameId = requestAnimationFrame(updateCursor);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target]);

  if (!isVisible) return null;

  return (
    <div
      className={`custom-cursor ${isHovering ? "cursor-hover" : ""}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) ${
          isHovering ? "scale(2.5)" : "scale(1)"
        }`,
      }}
      aria-hidden="true"
    />
  );
};

export default CustomCursor;

