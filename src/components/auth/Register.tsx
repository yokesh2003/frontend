import React, { useState } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { customerService } from '../../services/customerService';
import { getErrorMessage } from '../../utils/errorUtils';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateName = (name: string): boolean => {
    const words = name.trim().split(/\s+/);
    if (words.length < 1) return false;
    return words.every(word => /^[A-Z][a-z]*$/.test(word));
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && /\.(com|org|in)$/.test(email);
  };

  const validateUsername = (username: string): boolean => {
    return /^[a-z0-9_]+$/.test(username);
  };

  const validatePassword = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const isFormComplete =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.username.trim() &&
    formData.password.trim() &&
    formData.confirmPassword.trim();

  const hasValidationErrors = Object.keys(errors).some((key) => !!errors[key]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const newErrors: { [key: string]: string } = {};

    if (!validateName(formData.name)) {
      newErrors.name = 'Name must contain only letters, each word starting with capital letter';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format (must end with .com, .org, or .in)';
    }
    if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must contain only lowercase letters, digits, and special characters';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be 8-16 characters with at least one lowercase, uppercase, digit, and special character';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const user = await customerService.register(formData);
      login(user);
      navigate('/');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">Create Account</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && <div className="text-danger">{errors.username}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="text-danger">{errors.password}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-control"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <small className="text-danger">Passwords do not match</small>
              )}
              {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
            </div>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={
                loading ||
                !isFormComplete ||
                hasValidationErrors ||
                formData.password !== formData.confirmPassword
              }
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
          <div className="text-center mt-3">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;

