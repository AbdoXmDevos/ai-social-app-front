"use client";
import { Laptop, Moon } from "lucide-react";
import { Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const themes = [
  { label: "Light", value: "light", icon: <Sun /> },
  { label: "Dark", value: "dark", icon: <Moon /> },
  { label: "System", value: "system", icon: <Laptop /> },
];

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const current =
    theme === "system"
      ? themes.find((t) => t.value === systemTheme) || themes[2]
      : themes.find((t) => t.value === theme) || themes[0];

  return (
    <div className="relative">
      <button
        className="ml-4 text-xl bg-[var(--card)] text-[var(--primary)] rounded-full p-2 hover:bg-[var(--secondary)] transition-all flex items-center gap-2 border border-[var(--border)]"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle theme menu"
        type="button"
      >
        <span className="material-icons">{current.icon}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50">
          {themes.map((t) => (
            <button
              key={t.value}
              className={`w-full flex items-center gap-2 px-4 py-2 justify-center hover:bg-[var(--secondary)] transition-colors text-[var(--primary)] ${theme === t.value ? 'font-bold' : ''}`}
              onClick={() => {
                setTheme(t.value);
                setOpen(false);
              }}
              type="button"
            >
                <div className="flex items-center max-w-10 mr-5 gap-2">
                <span className="material-icons text-base">{t.icon}</span>
                <span className="text-sm">{t.label}</span>
                </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 