import React from "react";

export default function ThemeSwitcher({ theme, setTheme }) {
  const themes = [
    "light",
    "dark",
    "cupcake",
    "emerald",
    "garden",
    "forest",
    "pastel",
    "retro",
    "fantasy",
  ];

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="select select-sm absolute top-4 right-4 bg-base-200 text-base-content"
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
