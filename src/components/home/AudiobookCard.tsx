import React, { useState } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Audiobook } from '../../types/Audiobook';
import { getErrorMessage } from '../../utils/errorUtils';

interface AudiobookCardProps {
  audiobook: Audiobook;
  isInLibrary?: boolean;
}

const AudiobookCard: React.FC<AudiobookCardProps> = ({ audiobook, isInLibrary }) => {
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isInLibrary) {
      setMessage({
        type: 'danger',
        text: 'You have already purchased this audiobook. Check your Library.',
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      await addToCart(audiobook.audioId);
      setMessage({ type: 'success', text: 'Book added to cart' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'danger', text: getErrorMessage(error, 'Failed to add to cart') });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleViewDetails = () => {
    navigate(`/audiobook/${audiobook.audioId}`);
  };

  return (
    <Card className="shadow-sm" style={{ borderRadius: '12px' }}>
      <div className="d-flex flex-column flex-md-row">
        <div
          style={{
            minWidth: '180px',
            maxWidth: '220px',
            overflow: 'hidden',
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
          }}
        >
          <Card.Img
            src={audiobook.coverImage || 'https://picsum.photos/300/300'}
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            onError={(e: any) => {
              e.target.src = 'https://picsum.photos/300/300';
            }}
          />
        </div>
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Title className="mb-2 d-flex justify-content-between align-items-center">
              <span>{audiobook.title}</span>
              {isInLibrary && (
                <span className="badge bg-success ms-2">In Library</span>
              )}
            </Card.Title>
            <Card.Text className="mb-2">
              <strong>Written by:</strong> {audiobook.authorName || 'Unknown'}
              <br />
              <strong>Price:</strong> ₹{audiobook.price}
              <br />
              <strong>Average Rating:</strong> {audiobook.totalStar}/5
            </Card.Text>
            {message && (
              <Alert variant={message.type} className="py-2 mb-2">
                {message.text}
              </Alert>
            )}
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-2">
            <Button variant="secondary" onClick={handleViewDetails}>
              View Details
            </Button>
            <Button
              variant={isInLibrary ? 'success' : 'primary'}
              onClick={handleAddToCart}
              disabled={isInLibrary}
            >
              {isInLibrary ? 'In Library' : 'Add to Cart'}
            </Button>
          </div>
        </Card.Body>
      </div>
    </Card>
  );
};

export default AudiobookCard;

