import React from "react";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary | acid | secondary | danger | outline
  size = "md", // sm | md | lg
  disabled = false,
  className = "",
  fullWidth = false,
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-wide uppercase transition-all duration-100 select-none border-2 border-[#09090B] rounded-[12px] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs shadow-[2px_2px_0_#09090B] active:shadow-[1px_1px_0_#09090B] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#09090B]",
    md: "px-5 py-2.5 text-sm shadow-[4px_4px_0_#09090B] active:shadow-[1px_1px_0_#09090B] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#09090B]",
    lg: "px-7 py-3.5 text-base shadow-[4px_4px_0_#09090B] active:shadow-[2px_2px_0_#09090B] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#09090B]",
  };

  const variantStyles = {
    primary: "bg-[#09090B] text-[#D2E823] hover:bg-[#18181B]",
    acid: "bg-[#D2E823] text-[#09090B] hover:bg-[#C2D813]",
    secondary: "bg-[#FFFFFF] text-[#09090B] hover:bg-[#F4F4F5]",
    danger: "bg-[#FF4B4B] text-[#FFFFFF] hover:bg-[#E53E3E]",
    outline: "bg-transparent text-[#09090B] hover:bg-[#09090B]/5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className={`mr-2 ${size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"}`} />}
      {children}
    </button>
  );
};

export default Button;

