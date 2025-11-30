import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AudiobookDetail from './components/audiobook/AudiobookDetail';
import ChangePassword from './components/auth/ChangePassword';
import ForgotPassword from './components/auth/ForgotPassword';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Cart from './components/cart/Cart';
import Navbar from './components/common/Navbar';
import Home from './components/home/Home';
import Library from './components/library/Library';
import Payment from './components/payment/Payment';
import Profile from './components/profile/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Protected Route Component that uses AuthContext
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<Home />} />
      <Route path="/audiobook/:id" element={<AudiobookDetail />} />

      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
