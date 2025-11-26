import React, { useState } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { customerService } from '../../services/customerService';
import { getErrorMessage } from '../../utils/errorUtils';

const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormComplete =
    formData.oldPassword.trim() &&
    formData.newPassword.trim() &&
    formData.confirmPassword.trim();

  const isPasswordMismatch =
    !!formData.newPassword && !!formData.confirmPassword && formData.newPassword !== formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    if (!user) {
      setError('User not found');
      return;
    }

    setLoading(true);
    try {
      await customerService.changePassword({
        customerId: user.customerId,
        newPassword: formData.newPassword,
      });
      navigate('/login');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to change password. Please check your details.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">Change Password</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                className="form-control"
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                className="form-control"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-control"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter a password again"
                required
              />
            </div>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading || !isFormComplete || isPasswordMismatch}
            >
              {loading ? 'Changing...' : 'Submit'}
            </Button>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePassword;

