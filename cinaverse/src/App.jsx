import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import UserDashboard from './pages/UserDashboard';
import Watchlist from './pages/Watchlist';
import DiscoverMovies from './pages/DiscoverMovies';
import StoreProvider from './context/StoreContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
          <Route path="/parent-dashboard" element={<ProtectedRoute requireParent><ParentDashboard /></ProtectedRoute>} />
          <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
          <Route path="/discover" element={<DiscoverMovies />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
