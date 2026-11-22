"use client";

import { useEffect, useState } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("kaskos-theme") as "light" | "dark" | null;
    const initialTheme =
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  function applyTheme(newTheme: "light" | "dark") {
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    document.body.setAttribute("data-bs-theme", newTheme);
    if (newTheme === "dark") {
      document.body.classList.add("theme-dark");
      document.body.classList.remove("bg-light");
    } else {
      document.body.classList.remove("theme-dark");
      document.body.classList.add("bg-light");
    }
  }

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("kaskos-theme", nextTheme);
    applyTheme(nextTheme);
  }

  if (!mounted) {
    return (
      <button className="btn btn-icon btn-ghost-secondary rounded-circle" disabled aria-label="Ganti Tema">
        <IconSun size={18} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-icon btn-ghost-secondary rounded-circle"
      title={theme === "light" ? "Aktifkan Mode Gelap (Dark Mode)" : "Aktifkan Mode Terang (Light Mode)"}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <IconMoon size={19} className="text-secondary" />
      ) : (
        <IconSun size={19} className="text-warning" />
      )}
    </button>
  );
}
