import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button";

export const ErrorState = ({
  title = "Something went wrong",
  message = "Failed to communicate with the server. Please try again or verify your connection.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`border-2 border-[#09090B] bg-[#FFF5F5] rounded-[16px] p-8 text-center shadow-[4px_4px_0_#09090B] max-w-lg mx-auto my-6 ${className}`}
    >
      <div className="w-14 h-14 bg-[#FF4B4B] border-2 border-[#09090B] rounded-[12px] shadow-[3px_3px_0_#09090B] flex items-center justify-center mx-auto mb-4 text-[#FFFFFF]">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="font-heading text-lg uppercase text-[#09090B] mb-2">
        {title}
      </h3>
      <p className="font-body text-sm text-[#52525B] mb-6">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="primary"
          size="md"
          icon={RefreshCw}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;

