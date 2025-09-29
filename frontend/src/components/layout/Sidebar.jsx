import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, 
  Users, 
  User, 
  Baby, 
  Heart, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  X,
  Bell,
  ChevronDown,
  ChevronUp,
  Database,
  Download,
  BarChart3,
  FileBarChart,
  BarChart4,
  FileText,
  Activity
} from "lucide-react"
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [expandedMenus, setExpandedMenus] = useState({})

  const handleLogout = () => {
    logout()
  }

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }))
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'All Patients',
      href: '/patients',
      icon: Users,
      current: location.pathname === '/patients',

    },
    {
      name: 'Adult',
      icon: User,
      current: location.pathname.startsWith('/patients/adult') || location.pathname.startsWith('/visits/adult'),
 
      hasSubmenu: true,
      submenu: [
        {
          name: 'Initial Form',
          href: '/patients/adult',
          current: location.pathname.startsWith('/patients/adult') && !location.pathname.startsWith('/visits/adult'),
      
        },
        {
          name: 'Visits',
          href: '/visits/adult',
          current: location.pathname.startsWith('/visits/adult'),
   
        }
      ]
    },
    {
      name: 'Child',
      icon: Heart,
      current: location.pathname.startsWith('/patients/child') || location.pathname.startsWith('/visits/child'),
      hasSubmenu: true,
      submenu: [
        {
          name: 'Initial Form',
          href: '/patients/child',
          current: location.pathname.startsWith('/patients/child') && !location.pathname.startsWith('/visits/child'),
         
        },
        {
          name: 'Visits',
          href: '/visits/child',
          current: location.pathname.startsWith('/visits/child'),
    
        }
      ]
    },
    {
      name: 'Infant',
      icon: Baby,
      current: location.pathname.startsWith('/patients/infant') || location.pathname.startsWith('/visits/infant'),
      hasSubmenu: true,
      submenu: [
        {
          name: 'Initial Form',
          href: '/patients/infant',
          current: location.pathname.startsWith('/patients/infant') && !location.pathname.startsWith('/visits/infant'),
 

        },
        {
          name: 'Visits',
          href: '/visits/infant',
          current: location.pathname.startsWith('/visits/infant'),
      
        }
      ]
    },
    {
      name: 'Backup & Restore',
      href: '/backup',
      icon: Database,
      current: location.pathname.startsWith('/backup')
    },
    {
      name: 'Data Management',
      href: '/data-management',
      icon: Download,
      current: location.pathname.startsWith('/data-management')
    },
    {
      name: 'Analytics & Reports',
      icon: BarChart3,
      current: location.pathname.startsWith('/analytics') || location.pathname.startsWith('/indicators') || location.pathname.startsWith('/audit'),
      hasSubmenu: true,
      submenu: [
        {
          name: 'Indicators Report',
          href: '/indicators',
          icon: FileBarChart,
          current: location.pathname === '/indicators'
        },
        {
          name: 'Indicators Dashboard',
          href: '/indicators/dashboard',
          icon: BarChart3,
          current: location.pathname === '/indicators/dashboard'
        },
        {
          name: 'Audit Reports',
          href: '/audit',
          icon: FileText,
          current: location.pathname.startsWith('/audit')
        }
      ]
    },
  ]

  const handleNavigation = (href) => {
    navigate(href)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">PreART System</h1>
                  <p className="text-xs text-gray-500">Patient Management</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm"></span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-200">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.username || 'admin'}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isExpanded = expandedMenus[item.name]
              
              if (item.hasSubmenu) {
                return (
                  <div key={item.name}>
                    <Button
                      variant={item.current ? "default" : "ghost"}
                      className={`
                        w-full justify-start text-left h-12 px-3
                        ${isCollapsed ? 'px-2' : 'px-3'}
                        ${item.current 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                      onClick={() => !isCollapsed && toggleMenu(item.name)}
                    >
                      <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 ml-2" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-2" />
                          )}
                        </>
                      )}
                    </Button>
                    
                    {/* Submenu */}
                    {!isCollapsed && isExpanded && item.submenu && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3 bg-gray-50/50 rounded-r-lg py-1">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <Button
                              key={subItem.name}
                              variant={subItem.current ? "default" : "ghost"}
                              className={`
                                w-full justify-start text-left h-9 px-3 text-sm
                                ${subItem.current 
                                  ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm' 
                                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200'
                                }
                              `}
                              onClick={() => handleNavigation(subItem.href)}
                            >
                              {SubIcon ? (
                                <SubIcon className="w-4 h-4 mr-3" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-current opacity-40 mr-3"></div>
                              )}
                              <span className="flex-1">{subItem.name}</span>
                              {subItem.badge && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {subItem.badge}
                                </Badge>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )
              }
              
              return (
                <Button
                  key={item.name}
                  variant={item.current ? "default" : "ghost"}
                  className={`
                    w-full justify-start text-left h-12 px-3
                    ${isCollapsed ? 'px-2' : 'px-3'}
                    ${item.current 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className={`
                w-full justify-start text-left h-12 px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900
                ${isCollapsed ? 'px-2' : 'px-3'}
              `}
              onClick={handleLogout}
            >
              <LogOut className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
