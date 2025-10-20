"use client";
import { useEffect, useState } from "react";
import { BsMoonStars, BsSun } from "react-icons/bs";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    if (useDark) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="p-2 rounded-full border border-[var(--color-heading-hl)] bg-[var(--color-bg)] shadow-sm hover:shadow-md hover:bg-[var(--color-mutedlight)] dark:hover:bg-[var(--color-mutedwarm)] transition-all"
    >
      {isDark ? (
        <BsSun className="text-[var(--color-heading-hl)] text-xl" />
      ) : (
        <BsMoonStars className="text-[var(--color-heading-hd)] text-xl" />
      )}
    </button>
  );
}
