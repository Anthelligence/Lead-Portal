import clsx from "clsx";
import React from "react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Option[];
  required?: boolean;
};

export function Select({
  label,
  options,
  required,
  className,
  ...props
}: SelectProps) {
  return (
    <label className="block space-y-2 text-sm">
      {label && (
        <span className="text-xs font-semibold text-gray-700">
          {label} {required ? "*" : ""}
        </span>
      )}
      <select
        className={clsx(
          "w-full rounded-lg border border-gray-200 bg-white text-[#1d1d1d] placeholder:text-gray-500 px-3 py-3 text-sm focus:border-[#FE5E17] focus:ring-2 focus:ring-[#FE5E17]/30",
          className
        )}
        {...props}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

