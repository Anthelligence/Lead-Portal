import clsx from "clsx";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
};

export function Input({ label, required, icon, className, ...props }: InputProps) {
  const hasIcon = Boolean(icon);
  return (
    <label className="block space-y-2 text-sm">
      {label && (
        <span className="text-xs font-semibold text-gray-700">
          {label} {required ? "*" : ""}
        </span>
      )}
      <div className="relative">
        {hasIcon ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span> : null}
      <input
        className={clsx(
          "w-full rounded-lg border border-gray-200 bg-white text-[#1d1d1d] placeholder:text-gray-500 px-3 py-3 text-sm focus:border-[#FE5E17] focus:ring-2 focus:ring-[#FE5E17]/30",
            hasIcon && "pl-10",
          className
        )}
        {...props}
      />
      </div>
    </label>
  );
}

