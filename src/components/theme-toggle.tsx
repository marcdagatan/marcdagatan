"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme !== "light";

  return (
    <Button 
      variant="outline" 
      size="icon" 
      aria-label="Toggle theme" 
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden group"
    >
      <Sun className={`h-4 w-4 transition-all duration-300 ${isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
      <Moon className={`h-4 w-4 absolute transition-all duration-300 ${isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100"}`} />
    </Button>
  );
}


