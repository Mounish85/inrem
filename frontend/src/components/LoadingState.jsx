import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingState = ({
  message = "Loading data...",
  skeleton = false,
  count = 3,
  className = "",
}) => {
  if (skeleton) {
    return (
      <div className={`space-y-4 w-full ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="border-2 border-[#09090B] bg-[#FFFFFF] rounded-[12px] p-6 shadow-[4px_4px_0_#09090B] animate-pulse"
          >
            <div className="h-6 bg-[#E4E4E7] border border-[#09090B] rounded w-2/3 mb-3" />
            <div className="h-4 bg-[#F4F4F5] border border-[#09090B]/30 rounded w-full mb-2" />
            <div className="h-4 bg-[#F4F4F5] border border-[#09090B]/30 rounded w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-[#09090B] bg-[#F8F4E8] rounded-[16px] p-8 md:p-12 text-center shadow-[4px_4px_0_#09090B] max-w-md mx-auto my-8 ${className}`}
    >
      <div className="w-14 h-14 bg-[#D2E823] border-2 border-[#09090B] rounded-[12px] shadow-[3px_3px_0_#09090B] flex items-center justify-center mx-auto mb-4">
        <Loader2 className="w-7 h-7 text-[#09090B] animate-spin" />
      </div>
      <p className="font-heading text-sm md:text-base uppercase tracking-tight text-[#09090B]">
        {message}
      </p>
    </div>
  );
};

export default LoadingState;

