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
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  const isLoggedIn = !!localStorage.getItem('user');

  const requireLogin = (page: React.ReactElement) =>
    isLoggedIn ? page : <Navigate to="/login" />;

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/audiobook/:id" element={<AudiobookDetail />} />

            <Route path="/change-password" element={requireLogin(<ChangePassword />)} />
            <Route path="/cart" element={requireLogin(<Cart />)} />
            <Route path="/payment" element={requireLogin(<Payment />)} />
            <Route path="/library" element={requireLogin(<Library />)} />
            <Route path="/profile" element={requireLogin(<Profile />)} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
