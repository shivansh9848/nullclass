import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const ForgotPasswordEmail = () => {
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
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
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
                setSuccess('✅ A new password has been sent to your email address. Please check your inbox and use the new password to log in.');
                // Clear form
                setEmail('');
                // Redirect to login after 8 seconds
                setTimeout(() => {
                    navigate('/Auth');
                }, 8000);
            } else {
                if (data.message.includes('once per day')) {
                    setError('⚠️ You can request password reset only once a day.');
                } else {
                    setError(data.message || 'Failed to send new password');
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
                <h2>Reset Password via Email</h2>
                <p className="auth-subtitle">Enter your email to receive a new password</p>
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
                            <p>2. Click "Send New Password"</p>
                            <p>3. Check your email for the new password</p>
                            <p>4. Use the new password to log in</p>
                            <p>5. Change your password after logging in</p>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" disabled={isLoading} className="auth-btn">
                        {isLoading ? 'Sending...' : 'Send New Password'}
                    </button>
                </form>

                <div className="auth-options">
                    <p className="auth-switch">
                        Want to reset via SMS instead? <span onClick={() => navigate('/forgot-password-sms')} className="auth-link">Use SMS</span>
                    </p>
                    <p className="auth-switch">
                        Remember your password? <span onClick={() => navigate('/Auth')} className="auth-link">Login</span>
                    </p>
                </div>

                <div className="forgot-password-notice">
                    <p className="notice-text">
                        <strong>Note:</strong> You can only request a password reset once per day.
                        A new 10-character password will be sent to your email.
                        <br />
                        <strong>Important:</strong> Please change this password immediately after logging in.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordEmail;
