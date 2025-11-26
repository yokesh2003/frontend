import React, { useState } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../services/paymentService';
import { PaymentRequest } from '../../types/Payment';
import { getErrorMessage } from '../../utils/errorUtils';

interface AddCardFormProps {
  onCardAdded: () => void;
  onUseSavedCard: () => void;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ onCardAdded, onUseSavedCard }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    cardType: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isFormComplete =
    formData.cardNumber.trim() &&
    formData.cardHolderName.trim() &&
    formData.expiryDate.trim() &&
    formData.cvv.trim() &&
    formData.cardType.trim();

  const validateCardNumber = (cardNumber: string): boolean => {
    return /^\d{16}$/.test(cardNumber);
  };

  const validateName = (name: string): boolean => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  const validateExpiryDate = (date: string): boolean => {
    // Expecting HTML date input format: yyyy-MM-dd
    if (!date) return false;
    const expiryDate = new Date(date);
    if (Number.isNaN(expiryDate.getTime())) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiryDate > today;
  };

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3}$/.test(cvv);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateCardNumber(formData.cardNumber)) {
      setError('Card number must be 16 digits');
      return;
    }
    if (!validateName(formData.cardHolderName)) {
      setError('Name should contain only alphabets');
      return;
    }
    if (!validateExpiryDate(formData.expiryDate)) {
      setError('Date should be a future date');
      return;
    }
    if (!validateCVV(formData.cvv)) {
      setError('CVV should be 3 digits');
      return;
    }
    if (!formData.cardType || (formData.cardType !== 'Credit Card' && formData.cardType !== 'Debit Card')) {
      setError('Card type should be Credit Card or Debit Card');
      return;
    }

    if (!user) {
      setError('User not found');
      return;
    }

    setLoading(true);
    try {
      const request: PaymentRequest = {
        customerId: user.customerId,
        cardNumber: formData.cardNumber,
        cardHolderName: formData.cardHolderName,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardType: formData.cardType,
      };

      await paymentService.addCard(request);
      setSuccess('Card Added Successfully');
      setTimeout(() => {
        onCardAdded();
      }, 1500);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to add card'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
        <Card.Body>
          <Card.Title>Enter Card Details to add Card</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input
                className="form-control"
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="Enter card number"
                maxLength={16}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Card Holder Name</label>
              <input
                className="form-control"
                type="text"
                name="cardHolderName"
                value={formData.cardHolderName}
                onChange={handleChange}
                placeholder="Enter card holder name"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Expiry Date</label>
              <input
                className="form-control"
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">CVV</label>
              <input
                className="form-control"
                type="password"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="Enter CVV"
                maxLength={3}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Card Type</label>
              <select
                className="form-select"
                name="cardType"
                value={formData.cardType}
                onChange={handleChange}
                required
              >
                <option value="">Select a card Type</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
              </select>
            </div>
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              type="submit"
              disabled={loading || !isFormComplete}
            >
              {loading ? 'Adding...' : 'Add Card'}
            </Button>
            <Button variant="secondary" onClick={onUseSavedCard}>
              Use Saved Card
            </Button>
          </div>
          </form>
      </Card.Body>
    </Card>
  );
};

export default AddCardForm;

