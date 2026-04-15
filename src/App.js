import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SMSProvider } from './contexts/SMSContext';
import AppLayout from './components/layout/AppLayout';
import MainForm from './components/forms/MainForm';
import { EnvironmentSelector, CorsWarning } from './components/ui/ApiComponents';
import { ResultsDisplay, DetailsDialog } from './components/ui/Results';
import LoginPanel from './components/ui/LoginPanel';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPanel />;
  }

  return (
    <>
      <EnvironmentSelector />
      <CorsWarning />
      <MainForm />
      <ResultsDisplay />
      <DetailsDialog />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <SMSProvider>
        <AppLayout>
          <AppContent />
        </AppLayout>
      </SMSProvider>
    </AuthProvider>
  );
}

export default App;
