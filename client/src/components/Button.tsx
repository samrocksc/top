import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "px-6 py-3 font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all border-2";

  const primaryClasses =
    "bg-white dark:bg-gray-900 text-black dark:text-white border-black dark:border-white";

  const secondaryClasses =
    "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white";

  const variantClasses =
    variant === "primary" ? primaryClasses : secondaryClasses;

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
