import React from "react";

export const Card = ({
  children,
  className = "",
  variant = "default", // default (white) | canvas | acid | dark
  shadow = "normal", // normal (4px) | large (6px) | xl (8px) | none
  rounded = "brutal", // brutal (12px) | brutal-sm (8px) | brutal-lg (16px) | brutal-xl (24px)
  hoverEffect = false,
  ...props
}) => {
  const bgStyles = {
    default: "bg-[#FFFFFF] text-[#09090B]",
    canvas: "bg-[#F8F4E8] text-[#09090B]",
    acid: "bg-[#D2E823] text-[#09090B]",
    dark: "bg-[#09090B] text-[#F8F4E8]",
  };

  const shadowStyles = {
    none: "",
    sm: "shadow-[2px_2px_0_#09090B]",
    normal: "shadow-[4px_4px_0_#09090B]",
    large: "shadow-[6px_6px_0_#09090B]",
    xl: "shadow-[8px_8px_0_#09090B]",
  };

  const roundedStyles = {
    "brutal-sm": "rounded-[8px]",
    brutal: "rounded-[12px]",
    "brutal-lg": "rounded-[16px]",
    "brutal-xl": "rounded-[24px]",
  };

  const hoverClass = hoverEffect
    ? "transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#09090B]"
    : "";

  return (
    <div
      className={`border-2 border-[#09090B] ${bgStyles[variant]} ${shadowStyles[shadow]} ${roundedStyles[rounded]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

