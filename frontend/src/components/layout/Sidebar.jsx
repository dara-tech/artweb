import React, { useState, useMemo } from 'react'
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
  ChevronDown,
  ChevronUp,
  Upload,
  BarChart3,
  FileBarChart,
  Shield,
  TestTube,
  Activity
} from "lucide-react"
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, loading } = useAuth()
  const [expandedMenus, setExpandedMenus] = useState({})

  // Memoized user role check for performance
  const isViewer = useMemo(() => user?.role === 'viewer', [user?.role])
  const isAdmin = useMemo(() => 
    user?.role === 'super_admin' || user?.role === 'admin', 
    [user?.role]
  )
  const isDataManager = useMemo(() => user?.role === 'data_manager', [user?.role])
  const isDataEntry = useMemo(() => 
    user?.role === 'data_entry' || user?.role === 'doctor' || user?.role === 'nurse' || user?.role === 'site_manager',
    [user?.role]
  )

  // Memoized navigation items for better performance
  const navigationItems = useMemo(() => {
    if (!user || isViewer) return []
    const items = []

    // Dashboard - show for all except viewers and data managers
    if (!isViewer && !isDataManager) {
      items.push({
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        current: location.pathname === '/dashboard',
        category: 'main'
      })
    }

    // Data Manager specific menu - only data management and reports
    if (isDataManager) {
      items.push(
        {
          name: 'Data Management',
          href: '/import-data',
          icon: Upload,
          current: location.pathname.startsWith('/import-data'),
          category: 'data'
        }
      )
    } else if (!isViewer) {
      // Data entry sections - hide for viewers and data managers
      items.push(
        {
          name: 'All Patients',
          href: '/patients',
          icon: Users,
          current: location.pathname === '/patients',
          category: 'patients'
        },
        {
          name: 'Adult',
          icon: User,
          current: location.pathname.startsWith('/patients/adult') || location.pathname.startsWith('/visits/adult'),
          hasSubmenu: true,
          category: 'patients',
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
          category: 'patients',
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
          category: 'patients',
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
          name: 'Import Data',
          href: '/import-data',
          icon: Upload,
          current: location.pathname.startsWith('/import-data'),
          category: 'data'
        },
        {
          name: 'Lab Test Results',
          href: '/lab-tests',
          icon: TestTube,
          current: location.pathname.startsWith('/lab-tests'),
          category: 'data'
        },
        {
          name: 'Patient Tests',
          href: '/patient-tests',
          icon: Activity,
          current: location.pathname.startsWith('/patient-tests'),
          category: 'data'
        }
      )
    }

    // Role Management - Only show for admin and super_admin
    if (isAdmin) {
      items.push({
        name: 'Role Management',
        href: '/role-management',
        icon: Shield,
        current: location.pathname.startsWith('/role-management'),
        category: 'admin'
      })
    }

    // Analytics & Reports - always show
    items.push({
      name: 'Analytics & Reports',
      icon: BarChart3,
      current: location.pathname.startsWith('/analytics') || location.pathname.startsWith('/indicators'),
      hasSubmenu: true,
      category: 'reports',
      submenu: [
        {
          name: 'Indicators Report',
          href: '/indicators',
          icon: FileBarChart,
          current: location.pathname === '/indicators'
        },
        // Analytics Admin - only for admin and super_admin
        ...(isAdmin ? [{
          name: 'Analytics Admin',
          href: '/analytics-admin',
          icon: BarChart3,
          current: location.pathname === '/analytics-admin'
        }] : []),
        // Indicators Dashboard - hide for viewers and data managers
        ...(isViewer || isDataManager ? [] : [{
          name: 'Visualization',
          href: '/indicators/dashboard',
          icon: BarChart3,
          current: location.pathname === '/indicators/dashboard'
        }]),
      ]
    })

    return items
  }, [isViewer, isAdmin, isDataManager, isDataEntry, location.pathname])

  // Don't render sidebar until user data is loaded
  if (loading || !user) {
    return null
  }

  // Hide sidebar completely for viewers
  if (isViewer) {
    return null
  }

  const handleLogout = () => {
    logout()
  }

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }))
  }

  const handleNavigation = (href, item) => {
    // For viewers, if they click on Analytics & Reports, navigate directly to indicators
    if (isViewer && item?.name === 'Analytics & Reports') {
      navigate('/indicators')
    } else {
      navigate(href)
    }
    setIsMobileOpen(false)
  }

  const handleMenuClick = (item) => {
    if (isCollapsed) {
      // For collapsed sidebar, handle special cases
      if (isViewer && item.name === 'Analytics & Reports') {
        handleNavigation('/indicators', item)
      } else if (item.hasSubmenu && item.submenu?.length > 0) {
        // Navigate to first submenu item
        handleNavigation(item.submenu[0].href, item.submenu[0])
      } else {
        handleNavigation(item.href, item)
      }
    } else {
      // For expanded sidebar, toggle submenu
      if (item.hasSubmenu) {
        toggleMenu(item.name)
      } else {
        handleNavigation(item.href, item)
      }
    }
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
        fixed inset-y-0 left-0 z-50 bg-card border-r border-border transform transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        w-64
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-card/50">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-semibold text-card-foreground truncate">PreART System</h1>

                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
              </div>
            )}
            
            {/* Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-8 h-8 p-0 rounded-full hover:bg-accent/50"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
            
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden w-8 h-8 p-0 rounded-full hover:bg-accent/50"
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Profile */}
          {/* <div className="p-4 border-b border-border bg-muted/20">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center ring-2 ring-border">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.username || 'admin'}
                  </p>
                  {isViewer && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-1">
                      View Only
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center ring-2 ring-border">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                {isViewer && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" title="View Only Access" />
                )}
              </div>
            )}
          </div> */}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isExpanded = expandedMenus[item.name]
              
              if (item.hasSubmenu) {
                return (
                  <div key={item.name} className="space-y-1">
                    <Button
                      variant={item.current ? "default" : "ghost"}
                      className={`
                        w-full justify-start text-left h-11 px-3 rounded-lg transition-all duration-200
                        ${isCollapsed ? 'px-2' : 'px-3'}
                        ${item.current 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
                        }
                      `}
                      onClick={() => handleMenuClick(item)}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left font-medium">{item.name}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 ml-2 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                          )}
                        </>
                      )}
                    </Button>
                    
                    {/* Submenu */}
                    {!isCollapsed && isExpanded && item.submenu && (
                      <div className="ml-6 space-y-1 border-l-2 border-border/50 pl-4">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <Button
                              key={subItem.name}
                              variant={subItem.current ? "default" : "ghost"}
                              className={`
                                w-full justify-start text-left h-9 px-3 text-sm rounded-md transition-all duration-200
                                ${subItem.current 
                                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                }
                              `}
                              onClick={() => handleNavigation(subItem.href, subItem)}
                            >
                              {SubIcon ? (
                                <SubIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-current opacity-40 mr-3 flex-shrink-0"></div>
                              )}
                              <span className="flex-1 text-left">{subItem.name}</span>
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
                    w-full justify-start text-left h-11 px-3 rounded-lg transition-all duration-200
                    ${isCollapsed ? 'px-2' : 'px-3'}
                    ${item.current 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                  onClick={() => handleMenuClick(item)}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.name}</span>
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
          <div className="p-4 border-t border-border bg-muted/10">
            <Button
              variant="ghost"
              className={`
                w-full justify-start text-left h-11 px-3 rounded-lg text-card-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200
                ${isCollapsed ? 'px-2' : 'px-3'}
              `}
              onClick={handleLogout}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
