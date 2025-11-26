import React, { useState } from 'react';
import { Alert, Button, Modal, Table } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import { PaymentCard } from '../../types/Payment';
import { getErrorMessage } from '../../utils/errorUtils';

interface PaymentDetailsProps {
  card: PaymentCard;
  totalPrice: number;
  onSuccess: () => Promise<void> | void;
  onClose: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ card, totalPrice, onSuccess, onClose }) => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const discountPercent = card.cardType === 'Debit Card' ? 0.05 : 0.10;
  const discountAmount = totalPrice * discountPercent;
  const finalAmount = totalPrice - discountAmount;

  const handlePayment = async () => {
    if (!user) {
      setError('User not found');
      return;
    }

    if (!cvv || cvv.length !== 3) {
      setError('Please provide the valid CVV.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await orderService.placeOrder(user.customerId, card.cardType, cvv);
      await onSuccess();
      onClose();
    } catch (err: any) {
      setError(getErrorMessage(err, 'Payment failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Payment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Get 5% off on Debit Card, 10% off on Credit Card</p>
        <Table>
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.audioCartId}>
                <td>{item.audiobook?.title || 'Audiobook'}</td>
                <td>₹{(item.audiobook?.price ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-3">
          <p><strong>Before Discount:</strong> ₹{totalPrice.toFixed(2)}</p>
          <p><strong>After Discount:</strong> ₹{finalAmount.toFixed(2)}</p>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="mt-3">
          <label className="form-label">Enter CVV</label>
          <input
            className="form-control"
            type="password"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="Enter CVV"
            maxLength={3}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="success" onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing...' : 'Pay'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentDetails;

