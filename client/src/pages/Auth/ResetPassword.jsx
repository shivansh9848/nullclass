import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Auth.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();
    const { token } = useParams();

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setError('Invalid reset link');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/auth/verify-token/${token}`);
                const data = await response.json();

                if (response.ok && data.valid) {
                    setTokenValid(true);
                    setUserEmail(data.email);
                } else {
                    setError('Invalid or expired reset link. Please request a new password reset.');
                }
            } catch (err) {
                setError('Error verifying reset link. Please try again.');
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('✅ Password has been successfully reset! Redirecting to login...');
                setTimeout(() => {
                    navigate('/Auth');
                }, 3000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/Auth');
    };

    if (!tokenValid && !error) {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <div className="loading-spinner">
                        <p>Verifying reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !tokenValid) {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <h2>Invalid Reset Link</h2>
                    <div className="error-message">{error}</div>
                    <p className="auth-subtitle">
                        Your reset link may have expired or is invalid. Please request a new password reset.
                    </p>
                    <button onClick={handleGoBack} className="auth-btn">
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Reset Your Password</h2>
                <p className="auth-subtitle">
                    Enter your new password for: <strong>{userEmail}</strong>
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">New Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            disabled={isLoading}
                            minLength="6"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            disabled={isLoading}
                            minLength="6"
                            required
                        />
                    </div>

                    <div className="password-requirements">
                        <h4>Password Requirements:</h4>
                        <ul>
                            <li className={password.length >= 6 ? 'valid' : 'invalid'}>
                                At least 6 characters long
                            </li>
                            <li className={password === confirmPassword && password ? 'valid' : 'invalid'}>
                                Passwords match
                            </li>
                        </ul>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" disabled={isLoading} className="auth-btn">
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
                <p className="auth-switch">
                    Remember your password? <span onClick={() => navigate('/Auth')} className="auth-link">Login</span>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
