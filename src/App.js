import React from 'react';
import { SMSProvider } from './contexts/SMSContext';
import AppLayout from './components/layout/AppLayout';
import MainForm from './components/forms/MainForm';
import { EnvironmentSelector, CorsWarning } from './components/ui/ApiComponents';
import { ResultsDisplay, DetailsDialog } from './components/ui/Results';

function App() {
  return (
    <SMSProvider>
      <AppLayout>
        {/* Environment Selector */}
        <EnvironmentSelector />

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
  );
}

export default App;
