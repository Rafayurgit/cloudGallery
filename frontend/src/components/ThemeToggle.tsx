import { useTheme } from "../theme/ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${nextTheme} mode`}>
      <span>{theme === "light" ? "Light" : "Dark"}</span>
      <span className="theme-toggle__track">
        <span className="theme-toggle__knob" />
      </span>
    </button>
  );
};

export default ThemeToggle;
