import React, { useState, useMemo } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Container, IconButton,
  Tooltip, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Divider, Switch
} from '@mui/material';
import {
  Send as SendIcon,
  Menu as MenuIcon,
  Brightness7 as LightModeIcon,
  DarkMode as DarkModeIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const AppLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Memoize theme so it is only recreated when darkMode changes
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: darkMode
        ? { main: '#bb86fc', light: '#e0b3ff', dark: '#985eff' }
        : { main: '#3a86ff', light: '#60a5fa', dark: '#2563eb' },
      secondary: darkMode
        ? { main: '#03dac6', light: '#70efde', dark: '#00b3a6' }
        : { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },
      success: { main: '#10b981', light: '#34d399', dark: '#059669' },
      error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
      warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
      info: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
      background: darkMode
        ? { default: '#121212', paper: 'rgba(30, 30, 30, 0.9)' }
        : { default: '#f8fafc', paper: 'rgba(255, 255, 255, 0.92)' },
      text: darkMode
        ? { primary: '#e0e0e0', secondary: '#b0b0b0' }
        : {},
      divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0,0,0,0.08)'
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
      button: { textTransform: 'none', fontWeight: 500 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 }
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(10px)',
            backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.92)',
            boxShadow: darkMode
              ? '0 10px 15px -3px rgba(0,0,0,0.3)'
              : '0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -2px rgba(0,0,0,0.04)'
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: darkMode
              ? 'linear-gradient(135deg, #3a0c6e, #6a1b9a)'
              : 'linear-gradient(135deg, #3a86ff, #2563eb)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundImage: darkMode
              ? 'linear-gradient(135deg, #bb86fc, #985eff)'
              : 'linear-gradient(135deg, #3a86ff, #2563eb)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              transform: 'translateY(-1px)'
            }
          },
          outlined: darkMode ? {
            borderColor: 'rgba(187,134,252,0.5)',
            '&:hover': {
              borderColor: '#bb86fc',
              backgroundColor: 'rgba(187,134,252,0.08)'
            }
          } : {}
        }
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 12 }
        }
      }
    }
  }), [darkMode]);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const handleThemeToggle = () => setDarkMode(prev => !prev);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        flexGrow: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}>
        {/* Header */}
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
            {/* Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <SendIcon sx={{ mr: 1.5, fontSize: 26 }} />
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                  PE Interface
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.75,
                    display: { xs: 'none', sm: 'block' },
                    lineHeight: 1
                  }}
                >
                  Goflipo Scrubbing Demo
                </Typography>
              </Box>
            </Box>

            {/* Dark mode toggle — desktop */}
            <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton
                color="inherit"
                onClick={handleThemeToggle}
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Mobile hamburger */}
            <IconButton
              color="inherit"
              edge="end"
              onClick={toggleMobileMenu}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={toggleMobileMenu}
          PaperProps={{ sx: { width: 260 } }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={600}>Menu</Typography>
            <IconButton onClick={toggleMobileMenu} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton onClick={handleThemeToggle}>
                <ListItemIcon>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </ListItemIcon>
                <ListItemText primary="Dark Mode" />
                <Switch
                  edge="end"
                  checked={darkMode}
                  onChange={handleThemeToggle}
                  onClick={e => e.stopPropagation()}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#bb86fc',
                      '& + .MuiSwitch-track': { backgroundColor: '#985eff' }
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Container
          maxWidth="lg"
          sx={{
            mt: { xs: 3, sm: 4 },
            mb: 6,
            px: { xs: 2, sm: 3 },
            flexGrow: 1
          }}
        >
          {children}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2.5,
            px: 2,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" textAlign="center">
              © {new Date().getFullYear()} Goflipo — PE Interface Demo
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;
