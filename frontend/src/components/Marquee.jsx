import React from "react";

export const Marquee = ({
  text = "WATER QUALITY CHAMPIONS • INREM FOUNDATION • COMMUNITY WATER SAFETY • MONITOR • EDUCATE • EMPOWER •",
  className = "",
  speed = "20s",
}) => {
  return (
    <div
      className={`overflow-hidden whitespace-nowrap border-y-2 border-[#09090B] bg-[#D2E823] py-2.5 font-heading text-sm uppercase text-[#09090B] select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className="inline-block animate-marquee"
        style={{ animationDuration: speed }}
      >
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>
      <div
        className="inline-block animate-marquee"
        style={{ animationDuration: speed }}
      >
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>
    </div>
  );
};

export default Marquee;

