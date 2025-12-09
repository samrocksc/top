import { ITheme } from "@/hooks/useTheme";
import React from "react";
import { Box } from "./Box";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  theme: ITheme;
}

export default function Container({
  children,
  className = "",
  theme,
}: ContainerProps) {
  return (
    <main
      className={`min-h-screen bg-white dark:bg-black flex items-center justify-center p-4 ${className} ${theme}`}
    >
      <Box>
        <div className="text-center">
          <div className="flex flex-col gap-4">{children}</div>
        </div>
      </Box>
    </main>
  );
}
