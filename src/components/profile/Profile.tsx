import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <Card>
        <Card.Body>
          <div className="text-center mb-4">
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '48px',
              }}
            >
              👤
            </div>
          </div>
          <div className="text-center mb-4">
            <h5>Username: {user.username}</h5>
            <h5>Email: {user.email}</h5>
          </div>
          <div className="d-grid">
            <Button variant="primary" onClick={() => navigate('/change-password')}>
              Change Password
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;

