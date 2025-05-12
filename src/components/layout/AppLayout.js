import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Box, Container, IconButton, 
  Link, Tooltip, Menu, MenuItem, Divider, Switch,
  Drawer, List, ListItem, ListItemIcon, 
  ListItemText, Button
} from '@mui/material';
import { 
  Send as SendIcon, 
  Menu as MenuIcon,
  Brightness7 as LightModeIcon,
  DarkMode as DarkModeIcon,
  Help as HelpIcon,
  Info as InfoIcon, 
  Settings as SettingsIcon,
  Person as UserIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const AppLayout = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      ...(darkMode ? {
        primary: { 
          main: '#bb86fc', 
          light: '#e0b3ff', 
          dark: '#985eff' 
        },
        secondary: { 
          main: '#03dac6', 
          light: '#70efde', 
          dark: '#00b3a6' 
        },
        background: {
          default: '#121212',
          paper: 'rgba(30, 30, 30, 0.8)'
        },
        text: {
          primary: '#e0e0e0',
          secondary: '#b0b0b0'
        },
        divider: 'rgba(255, 255, 255, 0.12)'
      } : {}),
    },
    components: {
      ...(darkMode ? {
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(30, 30, 30, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
            }
          }
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage: 'linear-gradient(135deg, #3a0c6e, #6a1b9a)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
            }
          }
        },
        MuiButton: {
          styleOverrides: { 
            contained: {
              backgroundImage: 'linear-gradient(135deg, #bb86fc, #985eff)',
            },
            outlined: {
              borderColor: 'rgba(187, 134, 252, 0.5)',
              '&:hover': {
                borderColor: '#bb86fc',
                backgroundColor: 'rgba(187, 134, 252, 0.1)'
              }
            }
          }
        }
      } : {
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.04)'
            }
          }
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage: 'linear-gradient(135deg, #3a86ff, #2563eb)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.06)'
            }
          }
        },
        MuiButton: {
          styleOverrides: {
            contained: {
              backgroundImage: 'linear-gradient(135deg, #3a86ff, #2563eb)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              '&:hover': {
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transform: 'translateY(-1px)'
              }
            }
          }
        },
      })
    }
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleThemeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  
  const menuItems = [
    { label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
    { label: 'Help', icon: <HelpIcon fontSize="small" /> },
    { label: 'About', icon: <InfoIcon fontSize="small" /> }
  ];
  
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
        <AppBar 
          position="static" 
          color="primary" 
          elevation={0}
          sx={{ 
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(25, 118, 210, 0.95)'
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SendIcon sx={{ mr: 1.5, fontSize: 28 }} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                SMS Sender
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 2, 
                flexGrow: 1,
                display: { xs: 'none', md: 'block' },
                color: 'primary.contrastText',
                opacity: 0.8
              }}
            >
              Easy SMS Delivery Platform
            </Typography>
            
            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.label} 
                  color="inherit" 
                  startIcon={item.icon}
                  sx={{ mx: 0.5, opacity: 0.9, '&:hover': { opacity: 1 } }}
                >
                  {item.label}
                </Button>
              ))}
              
              <Tooltip title="Toggle light/dark mode">
                <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleThemeToggle}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Your account">
                <IconButton 
                  color="inherit" 
                  onClick={handleMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <UserIcon />
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 2,
                  sx: { mt: 1.5, minWidth: 180 }
                }}
              >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose}>Sign out</MenuItem>
              </Menu>
            </Box>
            
            {/* Mobile menu button */}
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
        
        {/* Mobile Menu Drawer */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={toggleMobileMenu}
          PaperProps={{
            sx: { width: '80%', maxWidth: 300 }
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={toggleMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.label} onClick={toggleMobileMenu}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            <ListItem>
              <ListItemIcon>{darkMode ? <LightModeIcon /> : <DarkModeIcon />}</ListItemIcon>
              <ListItemText primary="Dark Mode" />
              <Switch 
                edge="end" 
                checked={darkMode} 
                onChange={handleThemeToggle} 
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#bb86fc',
                    '&:hover': { backgroundColor: 'rgba(187, 134, 252, 0.08)' },
                    '& + .MuiSwitch-track': { backgroundColor: '#985eff' }
                  },
                  '& .MuiSwitch-thumb': { boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)' }
                }}
              />
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
            py: 3, 
            px: 2, 
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', sm: 'flex-start' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} SMS Sender App. All rights reserved.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mt: { xs: 1.5, sm: 0 }
              }}>
                <Link href="#" color="text.secondary" underline="hover">
                  Privacy Policy
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Terms of Service
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Contact
                </Link>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;
