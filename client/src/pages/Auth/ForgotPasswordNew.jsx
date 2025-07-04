import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../utils/apiConfig';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!email) {
            setError('Please provide your email address');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(getApiUrl('api/auth/forgot-password'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('✅ Password reset link has been sent to your email. Please check your inbox and click the link to reset your password.');
                // Clear form
                setEmail('');
                // Redirect to login after 6 seconds
                setTimeout(() => {
                    navigate('/Auth');
                }, 6000);
            } else {
                if (data.message.includes('once per day')) {
                    setError('⚠️ You can only request a password reset once per day. Please try again tomorrow.');
                } else {
                    setError(data.message || 'Failed to send reset link');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Reset Password</h2>
                <p className="auth-subtitle">Enter your email to receive a password reset link</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="password-reset-info">
                        <h4>🔐 How it works:</h4>
                        <div className="info-steps">
                            <p>1. Enter your email address</p>
                            <p>2. Click "Send Reset Link"</p>
                            <p>3. Check your email for the reset link</p>
                            <p>4. Click the link to create a new password</p>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" disabled={isLoading} className="auth-btn">
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <p className="auth-switch">
                    Remember your password? <span onClick={() => navigate('/Auth')} className="auth-link">Login</span>
                </p>

                <div className="forgot-password-notice">
                    <p className="notice-text">
                        <strong>Note:</strong> You can only request a password reset once per day.
                        The reset link will expire in 1 hour for security.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
