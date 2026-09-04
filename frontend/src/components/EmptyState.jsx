import React from "react";
import { FolderOpen, AlertCircle } from "lucide-react";
import Button from "./Button";

export const EmptyState = ({
  title = "No data available yet.",
  description = "There are currently no records in the system. As you participate in courses and sessions, records will appear here.",
  icon: Icon = FolderOpen,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`border-2 border-[#09090B] bg-[#FFFFFF] rounded-[16px] p-8 md:p-12 text-center shadow-[4px_4px_0_#09090B] max-w-xl mx-auto ${className}`}
    >
      <div className="w-16 h-16 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] shadow-[3px_3px_0_#09090B] flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-[#09090B]" />
      </div>
      <h3 className="font-heading text-lg md:text-xl uppercase tracking-tight text-[#09090B] mb-2">
        {title}
      </h3>
      <p className="font-body text-sm text-[#52525B] max-w-md mx-auto mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="acid" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

