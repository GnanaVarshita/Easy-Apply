import { createTheme } from '@mui/material/styles';

// Bright White Theme with Golden Kalpavruksha Accents
export const whiteKalpavrukshaTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#B8860B', // Rich Dark Gold / Amber Bronze
      light: '#D4AF37', // Bright Gold
      dark: '#8A6305',  // Deep Bronze
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#10B981', // Emerald Green Accent
      light: '#34D399',
      dark: '#059669'
    },
    background: {
      default: '#F8FAFC', // Clean Light Alabaster White
      paper: '#FFFFFF'    // Pure White MUI Paper Cards
    },
    text: {
      primary: '#0F172A', // Crisp Dark Slate Text
      secondary: '#475569' // Soft Slate Secondary Text
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
    h5: { fontWeight: 700, letterSpacing: '0.01em', color: '#0F172A' },
    h6: { fontWeight: 700, letterSpacing: '0.01em', color: '#0F172A' }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px 0 rgba(15, 23, 42, 0.05)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 10,
          letterSpacing: '0.01em'
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(184, 134, 11, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E5C158 0%, #A37508 100%)',
            boxShadow: '0 6px 18px rgba(184, 134, 11, 0.35)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#CBD5E1',
            },
            '&:hover fieldset': {
              borderColor: '#B8860B',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#B8860B',
            },
          },
        }
      }
    }
  }
});
