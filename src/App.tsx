import { StrictMode, useState, useEffect } from 'react';
import { AuthProvider } from "./contexts/AuthContext";
import Layout from './components/layout/Layout';
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import TermsModal from './components/ui/TermsModal';

function App() {
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const hasAcceptedTerms = localStorage.getItem('termsAccepted');
    if (!hasAcceptedTerms) {
      setShowTermsModal(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('termsAccepted', 'true');
    setShowTermsModal(false);
  };

  return (
    <StrictMode>
      <AuthProvider>
        <Layout>
          <AppRoutes />
          {showTermsModal && <TermsModal onAccept={handleAcceptTerms} />}
          <Toaster richColors position="top-right" />
        </Layout>
      </AuthProvider>
    </StrictMode>
  );
}

export default App;