import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Projects from './pages/Projects';
import Sales from './pages/Sales';
import Payroll from './pages/Payroll';
import Documents from './pages/Documents';
import Recruitment from './pages/Recruitment';
import WorkReports from './pages/WorkReports';
import Organization from './pages/Organization';
import Performance from './pages/Performance';
import Calendar from './pages/Calendar';
import Helpdesk from './pages/Helpdesk';
import Settings from './pages/Settings';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50 text-slate-800">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="projects" element={<Projects />} />
            <Route path="sales" element={<Sales />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="documents" element={<Documents />} />
            <Route path="recruitment" element={<Recruitment />} />
            <Route path="work-reports" element={<WorkReports />} />
            <Route path="organization" element={<Organization />} />
            <Route path="performance" element={<Performance />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="helpdesk" element={<Helpdesk />} />
            <Route path="analytics" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
