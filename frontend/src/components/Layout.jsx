import React, { useState } from 'react'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Badge,
  useTheme,
  Switch,
  Fade,
  Paper,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Notifications as NotificationsIcon,
  PersonAdd as PersonAddIcon,
  ChildCare as ChildCareIcon,
  BabyChangingStation as BabyChangingStationIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
  { text: 'Adult Patients', icon: <PersonAddIcon />, path: '/patients/adult/new' },
  { text: 'Child Patients', icon: <ChildCareIcon />, path: '/patients/child/new' },
  { text: 'Infant Patients', icon: <BabyChangingStationIcon />, path: '/patients/infant/new' },
  { text: 'Patient Status', icon: <AssignmentIcon />, path: '/patients/status/new' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'User Management', icon: <PersonIcon />, path: '/users' },
  { text: 'Site Management', icon: <BusinessIcon />, path: '/sites/manage' },
  { text: 'Doctor Management', icon: <LocalHospitalIcon />, path: '/doctors/manage' },
  { text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/users/manage' },
]

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifAnchorEl, setNotifAnchorEl] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const theme = useTheme()

  // Dummy notifications for demo
  const notifications = [
    { id: 1, message: 'New patient registered', time: '2m ago' },
    { id: 2, message: 'Report generated', time: '10m ago' },
  ]

  const handleDrawerToggle = () => setMobileOpen((v) => !v)
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  const handleLogout = () => { logout(); handleMenuClose() }
  const handleProfile = () => { navigate('/profile'); handleMenuClose() }
  const handleNotifOpen = (e) => setNotifAnchorEl(e.currentTarget)
  const handleNotifClose = () => setNotifAnchorEl(null)
  const handleThemeToggle = () => setDarkMode((prev) => !prev)

  const drawer = (
    <Box>
      <Toolbar sx={{
        minHeight: 64,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: 2,
        mt: 1,
        mb: 1,
        mx: 1,
        boxShadow: 2,
      }}>
        <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 1 }}>
          <span style={{ color: '#fff' }}>Pre</span>
          <span style={{ color: '#FFD600' }}>ART</span>
        </Typography>
        <Avatar sx={{ bgcolor: 'primary.100', color: 'primary.main', width: 32, height: 32 }}>
          <AccountCircleIcon fontSize="medium" />
        </Avatar>
      </Toolbar>
      <Divider sx={{ mb: 1 }} />
      <List>
        {menuItems.map((item) => (
          <Tooltip key={item.text} title={item.text} placement="right" arrow>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                minHeight: 48,
                transition: 'background 0.2s, color 0.2s',
                ...(location.pathname === item.path && {
                  bgcolor: 'primary.50',
                  color: 'primary.main',
                  fontWeight: 700,
                  boxShadow: 1,
                }),
                '&:hover': {
                  bgcolor: 'primary.100',
                  color: 'primary.main',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 16, fontWeight: 500 }} />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ mt: 2, mb: 1 }} />
      <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton onClick={handleThemeToggle} color="primary">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )

  return (
    <Box sx={{
      display: 'flex',
      bgcolor: darkMode ? 'grey.900' : 'grey.50',
      minHeight: '100vh',
      transition: 'background 0.3s'
    }}>
      <CssBaseline />
      <AppBar
        elevation={2}
        color="inherit"
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: darkMode ? 'grey.900' : 'background.paper',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 1, sm: 3 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 1,
              color: darkMode ? 'primary.100' : 'primary.main',
              textShadow: darkMode ? '0 1px 4px #0002' : '0 1px 2px #fff8',
              userSelect: 'none',
            }}
          >
            Medical Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Notifications">
              <IconButton color="primary" onClick={handleNotifOpen}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={handleNotifClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                elevation: 3,
                sx: { minWidth: 260, borderRadius: 2, p: 1 }
              }}
              TransitionComponent={Fade}
            >
              <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                Notifications
              </Typography>
              <Divider />
              {notifications.length === 0 ? (
                <Typography sx={{ px: 2, py: 2, color: 'text.secondary' }}>No new notifications</Typography>
              ) : (
                notifications.map((notif) => (
                  <MenuItem key={notif.id} onClick={handleNotifClose}>
                    <ListItemIcon>
                      <NotificationsIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={notif.message}
                      secondary={notif.time}
                      primaryTypographyProps={{ fontSize: 15 }}
                      secondaryTypographyProps={{ fontSize: 12, color: 'text.secondary' }}
                    />
                  </MenuItem>
                ))
              )}
            </Menu>
            <Tooltip title={user?.fullName || "Account"}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    display: { xs: 'none', md: 'block' },
                    maxWidth: 160,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.fullName}
                </Typography>
                <IconButton
                  aria-label="account"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="primary"
                  size="large"
                  sx={{
                    p: 0.5,
                    border: '2px solid',
                    borderColor: 'primary.100',
                    bgcolor: 'primary.50',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: 2, bgcolor: 'primary.100' }
                  }}
                >
                  <Avatar sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.100',
                    color: 'primary.main',
                    fontWeight: 700,
                  }}>
                    <AccountCircleIcon fontSize="medium" />
                  </Avatar>
                </IconButton>
              </Box>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                elevation: 3,
                sx: { minWidth: 180, mt: 1, borderRadius: 2 }
              }}
              TransitionComponent={Fade}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 0,
              bgcolor: darkMode ? 'grey.900' : 'background.paper',
              borderRadius: 3,
              boxShadow: 4,
              mt: 1,
              mx: 1,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 0,
              bgcolor: darkMode ? 'grey.900' : 'background.paper',
              borderRadius: 3,
              boxShadow: 3,
              mt: 1,
              mx: 1,
              minHeight: 'calc(100vh - 16px)',
              transition: 'background 0.3s',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: darkMode ? 'grey.900' : 'grey.50',
          transition: 'background 0.3s',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            p: { xs: 1, sm: 3 },
            minHeight: 'calc(100vh - 96px)',
            bgcolor: darkMode ? 'grey.800' : '#fff',
            boxShadow: darkMode ? 6 : 2,
            transition: 'background 0.3s',
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  )
}

export default Layout
