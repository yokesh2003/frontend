import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { CartItem as CartItemType } from '../../types/Cart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart } = useCart();

  const handleRemove = async () => {
    const idToRemove = item.audiobook?.audioId || item.audioId;
    console.log('Removing item with ID:', idToRemove);
    await removeFromCart(idToRemove);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex">
          <img
            src={item.audiobook?.coverImage || 'https://picsum.photos/100/100'}
            alt={item.audiobook?.title || 'Audiobook'}
            style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }}
            onError={(e: any) => {
              e.target.src = 'https://picsum.photos/100/100';
            }}
          />
          <div className="flex-grow-1">
            <h5>{item.audiobook?.title || 'Audiobook'}</h5>
            <p className="mb-1">
              <strong>Written by:</strong> {item.audiobook?.authorName || 'Unknown'}
            </p>
            <p className="mb-1">
              <strong>Narrated by:</strong> {item.audiobook?.narrator || 'Unknown'}
            </p>
            <p className="mb-0">
              <strong>Price:</strong> ₹{item.audiobook?.price ?? 0}
            </p>
          </div>
          <Button variant="danger" onClick={handleRemove}>
            Remove
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartItem;

