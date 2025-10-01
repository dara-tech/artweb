import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Settings,
  Maximize2,
  Minimize2,
  LogOut
} from "lucide-react"
import { useAuth } from '../../contexts/AuthContext'
import { useSite } from '../../contexts/SiteContext'
import { ThemeToggle } from '../ui/theme-toggle'
import Sidebar from './Sidebar'

const AdvancedLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isFullFrame, setIsFullFrame] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { user, logout } = useAuth()
  const { isMultiSite } = useSite()

  // Check if user is a viewer
  const isViewer = user?.role === 'viewer'

  const handleLogout = () => {
    logout()
  }

  // Check if fullscreen is supported
  const isFullscreenSupported = () => {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    )
  }

  // Enter fullscreen mode
  const enterFullscreen = async () => {
    const element = document.documentElement
    
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen()
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error)
    }
  }

  // Exit fullscreen mode
  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen()
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error)
    }
  }

  const toggleFullFrame = async () => {
    if (isFullscreen) {
      await exitFullscreen()
    } else {
      await enterFullscreen()
    }
  }

  // Handle fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      )
      
      setIsFullscreen(isCurrentlyFullscreen)
      setIsFullFrame(isCurrentlyFullscreen)
      
      // Close mobile menu when entering fullscreen
      if (isCurrentlyFullscreen) {
        setIsMobileOpen(false)
      }
    }

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    // Handle F11 key press
    const handleKeyDown = (event) => {
      if (event.key === 'F11') {
        event.preventDefault()
        toggleFullFrame()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? 'app-mode' : ''}`}>
      <div className={`flex h-screen ${isViewer ? 'flex-col' : ''}`}>
        {/* Sidebar - Hidden for viewers */}
        {!isViewer && (
          <Sidebar 
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />
        )}

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col overflow-hidden ${isViewer ? 'w-full' : ''}`}>
          {/* Top Header */}
          <header className={`bg-card border-b border-border px-4 py-3 backdrop-blur-sm ${
            isFullscreen ? 'border-primary bg-primary/10' : ''
          }`}>
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center space-x-4">
                {/* App Mode Indicator */}
                {isFullscreen && (
                  <div className="flex items-center space-x-2 px-2 py-1 status-active rounded-md text-xs font-medium">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    App Mode
                  </div>
                )}
                
                {!isViewer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden hover:bg-accent"
                  >
                    <Menu className="w-5 h-5 text-muted-foreground" />
                  </Button>
                )}
                
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search patients, reports..."
                      className="pl-10 w-64 bg-muted/30 focus:bg-background transition-colors"
                    />
                  </div>
                </div>
                
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-3">
                {/* Full Frame Toggle - App Mode */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleFullFrame}
                  className={`hover:bg-accent transition-colors ${
                    isFullscreen ? 'status-active' : ''
                  }`}
                  title={
                    isFullscreen 
                      ? "Exit App Mode (F11)" 
                      : "Enter App Mode - Hide Browser UI (F11)"
                  }
                  disabled={!isFullscreenSupported()}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </Button>
                {/* Theme Toggle */}
                <ThemeToggle />
                {/* User Menu */}
                <div className="flex items-center space-x-3 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-muted-foreground to-foreground rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-background" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-foreground">{user?.fullName || 'User'}</p>
                  </div>
                </div>

             

                {/* Logout button for viewers */}
                {isViewer && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="hover:bg-destructive/10 hover:text-destructive"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </div>
          </header>


          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="h-full p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdvancedLayout
