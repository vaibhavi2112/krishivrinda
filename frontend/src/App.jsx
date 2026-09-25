import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { JarvisProvider } from './jarvis/JarvisContext';
import JarvisAssistant from './jarvis/JarvisAssistant';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import DealerDashboard from './pages/DealerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';

function JarvisWrapper() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('kv_user') || 'null');

  // Jarvis फक्त dashboards वर दिसेल
  const isDashboard =
    user && ['/farmer', '/dealer', '/worker'].includes(location.pathname);

  if (!isDashboard) return null;

  return <JarvisAssistant />;
}

function App() {
  const user = JSON.parse(localStorage.getItem('kv_user') || 'null');

  return (
    <BrowserRouter>
      <JarvisProvider>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to={`/${user.role}`} /> : <Landing />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to={`/${user.role}`} /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to={`/${user.role}`} /> : <Register />}
          />
          <Route
            path="/farmer"
            element={user?.role === 'farmer' ? <FarmerDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/dealer"
            element={user?.role === 'dealer' ? <DealerDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/worker"
            element={user?.role === 'worker' ? <WorkerDashboard /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <JarvisWrapper />
      </JarvisProvider>
    </BrowserRouter>
  );
}

export default App;