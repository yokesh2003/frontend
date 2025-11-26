import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { libraryService } from '../../services/libraryService';
import { Library as LibraryType } from '../../types/Library';
import AudioPlayer from '../audiobook/AudioPlayer';

const Library: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [libraries, setLibraries] = useState<LibraryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<LibraryType | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      loadLibrary();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const loadLibrary = async () => {
    if (!user) return;
    try {
      const data = await libraryService.viewLibrary(user.customerId);
      setLibraries(data);
    } catch (error) {
      console.error('Error loading library:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (library: LibraryType) => {
    if (!user) {
      return;
    }
    const audioId = library.audioId || library.audiobook?.audioId;
    if (!audioId) {
      console.error('No audioId found for library item', library);
      return;
    }
    const confirmDelete = window.confirm(
      `Remove "${library.audiobook?.title}" from your library?`
    );
    if (!confirmDelete) {
      return;
    }
    try {
      setDeletingId(library.libraryId);
      await libraryService.removeFromLibrary(user.customerId, audioId);
      setLibraries((prev) =>
        prev.filter((item) => item.libraryId !== library.libraryId)
      );
    } catch (error) {
      console.error('Error removing from library:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleListen = (library: LibraryType) => {
    setPlayingAudio(library);
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  if (libraries.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <Alert variant="info">
          <h4>Your Library is Empty</h4>
          <p>Purchase audiobooks to add them to your library</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Explore Audiobooks
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Library</h2>
      {libraries.map((library) => (
        <Card key={library.libraryId} className="mb-3 shadow-sm">
          <Row className="g-0 align-items-center">
            <Col md={3}>
              <Card.Img
                src={
                  library.audiobook?.coverImage ||
                  'https://via.placeholder.com/300x300'
                }
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                  borderTopLeftRadius: '0.375rem',
                  borderBottomLeftRadius: '0.375rem',
                }}
              />
            </Col>
            <Col md={6}>
              <Card.Body>
                <Card.Title>{library.audiobook?.title || 'Unknown'}</Card.Title>
                <Card.Text className="mb-1">
                  <strong>Author:</strong> {library.audiobook?.authorName || 'Unknown'}
                </Card.Text>
                <Card.Text>
                  <strong>Narrator:</strong> {library.audiobook?.narrator || 'Unknown'}
                </Card.Text>
              </Card.Body>
            </Col>
            <Col
              md={3}
              className="d-flex flex-column align-items-end justify-content-center p-3 gap-2"
            >
              <Button
                variant="primary"
                onClick={() => handleListen(library)}
                className="w-100"
              >
                Listen
              </Button>
              <Button
                variant="outline-danger"
                className="w-100"
                onClick={() => handleDelete(library)}
                disabled={deletingId === library.libraryId}
              >
                {deletingId === library.libraryId ? 'Removing...' : 'Delete'}
              </Button>
            </Col>
          </Row>
        </Card>
      ))}

      {playingAudio && playingAudio.audiobook?.audioFile && (
        <Modal show={true} onHide={() => setPlayingAudio(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{playingAudio.audiobook?.title || 'Audiobook'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AudioPlayer
              src={playingAudio.audiobook.audioFile}
              audioId={playingAudio.audioId}
              lastPosition={playingAudio.lastPosition}
            />
          </Modal.Body>
        </Modal>
      )}
    </div >
  );
};

export default Library;

