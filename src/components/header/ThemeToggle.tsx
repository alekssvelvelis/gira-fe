import { useTheme } from "@/context/ThemeContext";

import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

export default function ThemeToggle() {
    const { theme, toggle } = useTheme();
    const isDark = theme === 'dark';

    return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="rounded-lg m-2 bg-red-200 hover:bg-red-300 dark:bg-blue-200"
    >
      {isDark ? <IoSunnyOutline/> : <IoMoonOutline/>}
    </button>
  )
}