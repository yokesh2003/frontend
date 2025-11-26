import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Assuming AuthContext exists
import { paymentService } from '../../services/paymentService';
import { PaymentCard, PaymentRequest } from '../../types/Payment';

const PaymentMethods: React.FC = () => {
    const { user } = useAuth(); // Assuming user object has customerId
    const [cards, setCards] = useState<PaymentCard[]>([]);
    const [newCard, setNewCard] = useState<PaymentRequest>({
        customerId: user?.customerId || 0,
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: '',
        cardType: 'Credit Card',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.customerId) {
            loadCards();
        }
    }, [user]);

    const loadCards = async () => {
        try {
            const data = await paymentService.getSavedCards(user!.customerId);
            setCards(data);
        } catch (err) {
            console.error('Failed to load cards', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewCard({ ...newCard, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await paymentService.addCard({ ...newCard, customerId: user!.customerId });
            await loadCards();
            setNewCard({
                customerId: user!.customerId,
                cardNumber: '',
                cardHolderName: '',
                expiryDate: '',
                cvv: '',
                cardType: 'Credit Card',
            });
        } catch (err) {
            setError('Failed to add card. Please check details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (cardId: number) => {
        if (window.confirm('Are you sure you want to delete this card?')) {
            try {
                await paymentService.deleteCard(cardId);
                await loadCards();
            } catch (err) {
                console.error('Failed to delete card', err);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Payment Methods</h2>

            <div className="row">
                <div className="col-md-6">
                    <h4>Saved Cards</h4>
                    {cards.length === 0 ? (
                        <p>No saved cards.</p>
                    ) : (
                        <ul className="list-group">
                            {cards.map((card) => (
                                <li key={card.cardId} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{card.cardType}</strong> ending in {card.cardNumber.slice(-4)}<br />
                                        <small>{card.cardHolderName} | Exp: {card.expiryDate}</small>
                                    </div>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(card.cardId)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="col-md-6">
                    <h4>Add New Card</h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Card Number</label>
                            <input type="text" className="form-control" name="cardNumber" value={newCard.cardNumber} onChange={handleInputChange} required maxLength={16} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Card Holder Name</label>
                            <input type="text" className="form-control" name="cardHolderName" value={newCard.cardHolderName} onChange={handleInputChange} required />
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Expiry Date</label>
                                <input type="date" className="form-control" name="expiryDate" value={newCard.expiryDate} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">CVV</label>
                                <input type="text" className="form-control" name="cvv" value={newCard.cvv} onChange={handleInputChange} required maxLength={3} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Card Type</label>
                            <select className="form-select" name="cardType" value={newCard.cardType} onChange={handleInputChange}>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Card'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethods;
