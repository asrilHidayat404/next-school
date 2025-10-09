"use client"

import { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react"

type Themes = "dark" | "light"

interface ThemeContextType {
  theme: Themes
  setTheme: Dispatch<SetStateAction<Themes>>
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Themes>("light")

  // Ambil theme dari localStorage ATAU set otomatis berdasarkan jam
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Themes | null

    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // otomatis berdasarkan jam
      const hour = new Date().getHours()
      const autoTheme: Themes = hour >= 6 && hour < 14 ? "light" : "dark"
      setTheme(autoTheme)
      localStorage.setItem("theme", autoTheme)
    }
  }, [])

  // Simpan & update <html class="dark"> setiap kali theme berubah
  useEffect(() => {
    localStorage.setItem("theme", theme)

    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
