"use client"
import { useTheme } from '@/src/hooks/useTheme'
import { Moon, Sun } from 'lucide-react'
import React, { useCallback } from 'react'
import { SidebarMenuAction, SidebarMenuButton } from './ui/sidebar'

const ThemeButton = React.memo(() => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  return (
    <SidebarMenuButton
      onClick={toggleTheme}
      className='cursor-pointer'
    >
      {theme === "dark" ? <Sun /> : <Moon />}
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </SidebarMenuButton>
  )
})

export default ThemeButton
