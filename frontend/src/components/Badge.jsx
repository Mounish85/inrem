import React from "react";

export const Badge = ({
  children,
  variant = "default", // default | completed | in_progress | not_started | acid | coral | cyan | amber
  className = "",
  size = "md",
}) => {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  const variantStyles = {
    default: "bg-[#FFFFFF] text-[#09090B] border-[#09090B]",
    completed: "bg-[#D2E823] text-[#09090B] border-[#09090B] font-bold",
    in_progress: "bg-[#00D2FF] text-[#09090B] border-[#09090B] font-bold",
    not_started: "bg-[#E4E4E7] text-[#52525B] border-[#09090B]",
    upcoming: "bg-[#E4E4E7] text-[#52525B] border-[#09090B]",
    acid: "bg-[#D2E823] text-[#09090B] border-[#09090B] font-bold",
    coral: "bg-[#FF4B4B] text-[#FFFFFF] border-[#09090B] font-bold",
    cyan: "bg-[#00D2FF] text-[#09090B] border-[#09090B] font-bold",
    amber: "bg-[#FF8A00] text-[#09090B] border-[#09090B] font-bold",
    dark: "bg-[#09090B] text-[#D2E823] border-[#09090B] font-bold",
  };

  return (
    <span
      className={`inline-flex items-center uppercase tracking-wider font-mono border-2 rounded-[6px] shadow-[2px_2px_0_#09090B] ${
        sizeStyles[size]
      } ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

