import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AccountListPage from './pages/accounts/AccountListPage';
import AccountDetailPage from './pages/accounts/AccountDetailPage';
import AccountFormPage from './pages/accounts/AccountFormPage';
import PolicyListPage from './pages/policies/PolicyListPage';
import PolicyDetailPage from './pages/policies/PolicyDetailPage';
import PolicyFormPage from './pages/policies/PolicyFormPage';
import EndorsementFormPage from './pages/endorsements/EndorsementFormPage';
import NotFoundPage from './pages/NotFoundPage';

const theme = createTheme({
  palette: {
    primary: { main: '#FF6A47' },
    secondary: { main: '#52002D' },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/accounts" element={<AccountListPage />} />
                  <Route path="/accounts/new" element={<AccountFormPage />} />
                  <Route path="/accounts/:id" element={<AccountDetailPage />} />
                  <Route path="/accounts/:id/edit" element={<AccountFormPage />} />
                  <Route path="/policies" element={<PolicyListPage />} />
                  <Route path="/policies/new" element={<PolicyFormPage />} />
                  <Route path="/policies/:id" element={<PolicyDetailPage />} />
                  <Route path="/policies/:id/edit" element={<PolicyFormPage />} />
                  <Route path="/policies/:policyId/endorsements/new" element={<EndorsementFormPage />} />
                  <Route path="/endorsements/:id/edit" element={<EndorsementFormPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
