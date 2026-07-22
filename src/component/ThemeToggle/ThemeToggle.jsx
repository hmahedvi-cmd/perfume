import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="theme-btn">
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;