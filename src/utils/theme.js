import { createTheme } from '@mui/material';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: { 
      main: '#3a86ff', 
      light: '#60a5fa', 
      dark: '#2563eb' 
    },
    secondary: { 
      main: '#8b5cf6', 
      light: '#a78bfa', 
      dark: '#7c3aed' 
    },
    success: { 
      main: '#10b981', 
      light: '#34d399', 
      dark: '#059669' 
    },
    error: { 
      main: '#ef4444', 
      light: '#f87171', 
      dark: '#dc2626' 
    },
    warning: { 
      main: '#f59e0b', 
      light: '#fbbf24', 
      dark: '#d97706' 
    },
    info: { 
      main: '#3b82f6', 
      light: '#60a5fa', 
      dark: '#2563eb' 
    },
    background: { 
      default: 'linear-gradient(145deg, #e6f0ff, #f5f8ff)',
      paper: 'rgba(255, 255, 255, 0.85)'
    },
    divider: 'rgba(0, 0, 0, 0.06)',
    text: {
      primary: '#1e293b',
      secondary: '#64748b'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    button: { fontWeight: 500 }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0px 2px 6px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 8px rgba(0, 0, 0, 0.06), 0px 2px 4px rgba(0, 0, 0, 0.08)',
    // ... (rest of the shadows array)
  ],
  components: {
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
        root: { 
          borderRadius: 10, 
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          backgroundImage: 'linear-gradient(135deg, #3a86ff, #2563eb)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-1px)'
          }
        },
        outlined: {
          borderColor: 'rgba(58, 134, 255, 0.5)',
          '&:hover': {
            borderColor: '#3a86ff',
            backgroundColor: 'rgba(58, 134, 255, 0.04)'
          }
        }
      } 
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(58, 134, 255, 0.15)',
            }
          },
          '& .MuiInputLabel-root': {
            color: '#64748b'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.04)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 24,
          padding: 0
        },
        switchBase: {
          padding: 0,
          '&.Mui-checked': {
            color: '#fff',
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: '#3a86ff'
            }
          }
        },
        thumb: {
          width: 20,
          height: 20,
          boxShadow: '0 2px 4px 0 rgba(0, 35, 11, 0.2)'
        },
        track: {
          borderRadius: 24,
          opacity: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.25)'
        }
      }
    }
  }
});

export default theme;
