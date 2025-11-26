import React, { useState } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { customerService } from '../../services/customerService';
import { getErrorMessage } from '../../utils/errorUtils';

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await customerService.forgotPassword({
        email: formData.email,
        newPassword: formData.newPassword,
      });
      setSuccess('Password changed successfully. Please login with your new password.');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to reset password. Please check your details.'));
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.username.trim() &&
    formData.newPassword.trim();

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">Forgot Password</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading || !isFormComplete}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
          <div className="text-center mt-3">
            <Link to="/login">Back to Login</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ForgotPassword;

