import React, { useEffect, useState } from 'react';
import { Button, Card, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { paymentService } from '../../services/paymentService';
import { PaymentCard } from '../../types/Payment';
import AddCardForm from './AddCardForm';
import PaymentDetails from './PaymentDetails';
import SavedCards from './SavedCards';

const Payment: React.FC = () => {
  const { user } = useAuth();
  const { cartItems, refreshCart } = useCart();
  const navigate = useNavigate();
  const [savedCards, setSavedCards] = useState<PaymentCard[]>([]);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    if (user) {
      loadSavedCards();
    }
  }, [user]);

  const loadSavedCards = async () => {
    if (!user) return;
    try {
      const cards = await paymentService.getSavedCards(user.customerId);
      setSavedCards(cards);
    } catch (error) {
      console.error('Error loading saved cards:', error);
    }
  };

  const handleUseSavedCard = () => {
    setShowAddCard(false);
  };

  const handleCardAdded = () => {
    loadSavedCards();
    setShowAddCard(false);
  };

  const handleCardSelected = (card: PaymentCard) => {
    setSelectedCard(card);
    setShowPaymentDetails(true);
  };

  const handlePaymentSuccess = async () => {
    await refreshCart();
    navigate('/library');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <Card>
          <Card.Body>
            <h4>Your cart is empty</h4>
            <Button variant="primary" className="mt-3" onClick={() => navigate('/')}>
              Explore Audiobooks
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.audiobook?.price ?? 0), 0);

  return (
    <div className="container mt-4">
      <h2>Payment</h2>
      {showPaymentDetails && selectedCard ? (
        <PaymentDetails
          card={selectedCard}
          totalPrice={totalPrice}
          onSuccess={handlePaymentSuccess}
          onClose={() => {
            setShowPaymentDetails(false);
            setSelectedCard(null);
          }}
        />
      ) : showAddCard ? (
        <AddCardForm
          onCardAdded={handleCardAdded}
          onUseSavedCard={handleUseSavedCard}
        />
      ) : (
        <Tabs defaultActiveKey="addCard" className="mb-3">
          <Tab eventKey="addCard" title="Add Card">
            <AddCardForm
              onCardAdded={handleCardAdded}
              onUseSavedCard={handleUseSavedCard}
            />
          </Tab>
          <Tab eventKey="savedCards" title="Use Saved Card">
            <SavedCards
              cards={savedCards}
              onCardSelect={handleCardSelected}
            />
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

export default Payment;

