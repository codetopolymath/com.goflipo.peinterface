import React from 'react';
import { ThemeProvider } from '@mui/material';
import theme from './utils/theme';
import { SMSProvider } from './contexts/SMSContext';
import AppLayout from './components/layout/AppLayout';
import MainForm from './components/forms/MainForm';
import { ApiModeSelector, CorsWarning } from './components/ui/ApiComponents';
import { ResultsDisplay, DetailsDialog } from './components/ui/Results';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SMSProvider>
        <AppLayout>
          {/* API Mode Toggle */}
          <ApiModeSelector />
          
          {/* CORS Warning if needed */}
          <CorsWarning />
          
          {/* Main Form */}
          <MainForm />
          
          {/* Results Display */}
          <ResultsDisplay />
          
          {/* Details Dialog */}
          <DetailsDialog />
        </AppLayout>
      </SMSProvider>
    </ThemeProvider>
  );
}

export default App;
