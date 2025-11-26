import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';

const Cart: React.FC = () => {
  const { user } = useAuth();
  const { cartItems, refreshCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      refreshCart().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, refreshCart]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.audiobook?.price ?? 0), 0);

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <Alert variant="info">
          <h4>Your Cart is Empty</h4>
          <p>{user ? 'Add audiobooks to the cart to buy' : 'Please log in to start shopping'}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Explore Audiobooks
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Shopping Cart</h2>
      <Row>
        <Col md={8}>
          {cartItems.map((item) => (
            <CartItem key={item.audioCartId} item={item} />
          ))}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Total ({cartItems.length} items): ₹{totalPrice.toFixed(2)}</h5>
              <div className="d-grid gap-2 mt-3">
                <Button variant="primary" onClick={() => navigate('/')}>
                  Home
                </Button>
                <Button variant="success" onClick={() => navigate('/payment')}>
                  Proceed to Payment
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;

