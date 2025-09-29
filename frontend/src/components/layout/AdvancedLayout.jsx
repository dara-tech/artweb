import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Settings,
  ChevronDown,
  Maximize2,
  Minimize2
} from "lucide-react"
import { useAuth } from '../../contexts/AuthContext'
import { useSite } from '../../contexts/SiteContext'
import Sidebar from './Sidebar'

const AdvancedLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isFullFrame, setIsFullFrame] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { user } = useAuth()
  const { isMultiSite } = useSite()

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
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'app-mode' : ''}`}>
      <div className="flex h-screen">
        {/* Sidebar - Always visible, even in app mode */}
        <Sidebar 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className={`bg-white border-b border-gray-200/60 px-4 py-3 backdrop-blur-sm ${
            isFullscreen ? 'border-blue-200 bg-blue-50/30' : ''
          }`}>
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center space-x-4">
                {/* App Mode Indicator */}
                {isFullscreen && (
                  <div className="flex items-center space-x-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    App Mode
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(true)}
                  className="lg:hidden hover:bg-gray-100/50"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </Button>
                
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search patients, reports..."
                      className="pl-10 w-64 border-gray-200/60 bg-gray-50/30 focus:bg-white transition-colors"
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
                  className={`hover:bg-gray-100/50 transition-colors ${
                    isFullscreen ? 'bg-blue-100 text-blue-600' : ''
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

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative hover:bg-gray-100/50">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-orange-500 rounded-full border border-white"></div>
                </Button>

                {/* User Menu */}
                <div className="flex items-center space-x-3 px-2 py-1.5 rounded-lg hover:bg-gray-50/70 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-800">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>

                {/* Settings */}
                <Button variant="ghost" size="sm" className="hover:bg-gray-100/50">
                  <Settings className="w-5 h-5 text-gray-600" />
                </Button>
              </div>
            </div>
          </header>

          {/* Breadcrumb - Always visible, even in app mode */}
          <div className="bg-white/80 border-b border-gray-200/40 px-4 py-2.5 backdrop-blur-sm">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex items-center">
                    <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                      Dashboard
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronDown className="w-4 h-4 text-gray-300 rotate-[-90deg]" />
                    <a href="#" className="ml-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                      Patients
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronDown className="w-4 h-4 text-gray-300 rotate-[-90deg]" />
                    <span className="ml-2 text-sm font-medium text-gray-800">
                      Adult Patients
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
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
