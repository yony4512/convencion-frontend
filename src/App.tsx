import { StrictMode } from 'react';
import Layout from './components/layout/Layout';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <StrictMode>
      <Layout>
        <AppRoutes />
      </Layout>
    </StrictMode>
  );
}

export default App;