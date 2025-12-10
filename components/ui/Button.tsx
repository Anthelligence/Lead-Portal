import clsx from "clsx";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export function Button({
  className,
  children,
  variant = "primary",
  fullWidth,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary:
      "bg-[#FE5E17] text-white hover:bg-[#e65412] focus:ring-[#FE5E17] focus:ring-offset-0",
    secondary:
      "border border-[#FE5E17] text-[#FE5E17] bg-white hover:bg-[#fff3ec] focus:ring-[#FE5E17]",
    ghost: "text-[#1d1d1d] hover:bg-gray-100 focus:ring-gray-300"
  };

  return (
    <button
      className={clsx(base, variants[variant], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}

