import React from "react";

export function SectionHeader({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold font-heading">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-gray-600">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

