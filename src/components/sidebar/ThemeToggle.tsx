import { useTheme } from "@/context/ThemeContext";

import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

export default function ThemeToggle() {
    const { theme, toggle } = useTheme();
    const isDark = theme === 'dark';

    return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="m-2 transition-all duration-300 hover:scale-110 hover:cursor-pointer"
    >
      {isDark ? <IoSunnyOutline className="h-6 w-6"/> : <IoMoonOutline className="h-6 w-6"/>}
    </button>
  )
}