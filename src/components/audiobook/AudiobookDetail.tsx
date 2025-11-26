import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { audiobookService } from '../../services/audiobookService';
import { libraryService } from '../../services/libraryService';
import { Audiobook } from '../../types/Audiobook';
import { getErrorMessage } from '../../utils/errorUtils';
import AudioPlayer from './AudioPlayer';

const AudiobookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [audiobook, setAudiobook] = useState<Audiobook | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isInLibrary, setIsInLibrary] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadAudiobook();
    }
  }, [id]);

  useEffect(() => {
    const checkLibrary = async () => {
      if (!user || !id) {
        setIsInLibrary(false);
        return;
      }
      try {
        const library = await libraryService.viewLibrary(user.customerId);
        const audioId = parseInt(id, 10);
        // Check both item.audioId and item.audiobook.audioId
        setIsInLibrary(
          library.some(
            (item) =>
              item.audioId === audioId ||
              item.audiobook?.audioId === audioId
          )
        );
      } catch (error) {
        console.error('Error checking library for audiobook detail:', error);
        setIsInLibrary(false);
      }
    };

    checkLibrary();
  }, [user, id]);

  const loadAudiobook = async () => {
    try {
      const data = await audiobookService.getAudiobookById(parseInt(id!));
      setAudiobook(data);
    } catch (error) {
      console.error('Error loading audiobook:', error);
    } finally {
      setLoading(false);
    }
  };

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
      await addToCart(audiobook!.audioId);
      setMessage({ type: 'success', text: 'Book added to cart' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'danger', text: getErrorMessage(error, 'Failed to add to cart') });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSampleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  if (!audiobook) {
    return <div className="container mt-5 text-center">Audiobook not found</div>;
  }

  return (
    <div className="container mt-4">
      <Row>
        <Col md={4}>
          <img
            src={audiobook.coverImage || 'https://picsum.photos/400/400'}
            alt={audiobook.title}
            style={{ width: '100%', maxWidth: '400px' }}
            onError={(e: any) => {
              e.target.src = 'https://picsum.photos/400/400';
            }}
          />
        </Col>
        <Col md={8}>
          <h1>{audiobook.title}</h1>
          <p>
            <strong>Author:</strong> {audiobook.authorName || 'Unknown'}
          </p>
          <p>
            <strong>Narrator:</strong> {audiobook.narrator || 'Unknown'}
          </p>
          <p>
            <strong>Ratings:</strong> {audiobook.totalStar || 0}
          </p>
          <p>
            <strong>Price:</strong> ₹{audiobook.price}
          </p>
          <p>{audiobook.description}</p>
          {message && (
            <Alert variant={message.type} className="mb-3">
              {message.text}
            </Alert>
          )}
          {isInLibrary && (
            <Alert variant="success" className="mb-3">
              <strong>✓ This audiobook is already in your Library!</strong>
            </Alert>
          )}
          <div className="d-grid gap-2 d-md-block">
            <Button
              variant={isInLibrary ? 'success' : 'primary'}
              onClick={handleAddToCart}
              className="me-2"
              disabled={isInLibrary}
            >
              {isInLibrary ? 'Already in Library' : 'Add to Cart'}
            </Button>
            <Button variant="secondary" onClick={handleSampleAudio}>
              {isPlaying ? 'Pause Audio' : 'Sample Audio'}
            </Button>
          </div>
          {isPlaying && audiobook.shortClip && (
            <div className="mt-4">
              <AudioPlayer src={audiobook.shortClip} />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AudiobookDetail;

