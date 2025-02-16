import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Companies from './pages/Companies';
import NewCompany from './pages/NewCompany';
import CompanyDetails from './pages/CompanyDetails';
import AppBar from './components/AppBar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import DashboardLayout from './layouts/DashboardLayout';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Customers from './pages/Customers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

const AppContent = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const isLoginPage = location.pathname === '/login';

  if (loading) {
    return null; // ou un composant de chargement
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!user && !isLoginPage) {
    return <Navigate to="/login" />;
  }

  // Rediriger vers le tableau de bord si l'utilisateur est connecté et essaie d'accéder à la page de connexion
  if (user && isLoginPage) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {!isLoginPage && <AppBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/new" element={<NewCompany />} />
          <Route path="companies/:id" element={<CompanyDetails />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetails />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="customers" element={<Customers />} />
        </Route>
      </Routes>
    </>
  );
};

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
