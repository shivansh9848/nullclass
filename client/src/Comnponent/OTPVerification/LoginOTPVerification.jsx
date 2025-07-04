import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './OTPVerification.css';

const LoginOTPVerification = ({ email, onCancel, onSuccess }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [attemptsLeft, setAttemptsLeft] = useState(5);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setError('OTP has expired. Please login again.');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/verify-login-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store login data
                localStorage.setItem('Profile', JSON.stringify({
                    result: data.result,
                    token: data.token,
                    sessionId: data.sessionId,
                    deviceInfo: data.deviceInfo
                }));

                // Call success callback
                if (onSuccess) {
                    onSuccess(data);
                }

                // Navigate to home
                navigate('/');
            } else {
                setError(data.message || 'OTP verification failed');

                if (data.attemptsLeft !== undefined) {
                    setAttemptsLeft(data.attemptsLeft);
                }

                if (data.code === 'OTP_BLOCKED') {
                    setTimeout(() => {
                        onCancel();
                    }, 3000);
                }
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('OTP verification error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 6) {
            setOtp(value);
            setError('');
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="otp-verification-overlay">
            <div className="otp-verification-container">
                <div className="otp-verification-header">
                    <h2>Email Verification Required</h2>
                    <p>We've sent a 6-digit verification code to</p>
                    <strong>{email}</strong>
                </div>

                <form onSubmit={handleSubmit} className="otp-verification-form">
                    <div className="otp-input-container">
                        <label htmlFor="otp">Enter Verification Code</label>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="000000"
                            maxLength={6}
                            className={`otp-input ${error ? 'error' : ''}`}
                            autoComplete="one-time-code"
                            disabled={loading || timeLeft === 0}
                        />
                        <div className="otp-helper-text">
                            {timeLeft > 0 ? (
                                <span className="timer">Code expires in {formatTime(timeLeft)}</span>
                            ) : (
                                <span className="expired">Code has expired</span>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <div className="attempts-info">
                        <span className="attempts-left">
                            Attempts remaining: <strong>{attemptsLeft}</strong>
                        </span>
                    </div>

                    <div className="otp-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="cancel-btn"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="verify-btn"
                            disabled={loading || !otp || otp.length !== 6 || timeLeft === 0}
                        >
                            {loading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                'Verify Code'
                            )}
                        </button>
                    </div>
                </form>

                <div className="otp-info">
                    <div className="info-item">
                        <span className="info-icon">🔐</span>
                        <span>This verification is required for Chrome-based browsers</span>
                    </div>
                    <div className="info-item">
                        <span className="info-icon">⏰</span>
                        <span>Code is valid for 10 minutes</span>
                    </div>
                    <div className="info-item">
                        <span className="info-icon">📧</span>
                        <span>Check your email inbox and spam folder</span>
                    </div>
                </div>

                <div className="otp-security-note">
                    <p>
                        <strong>Security Note:</strong> Never share this code with anyone.
                        If you didn't request this login, please secure your account immediately.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginOTPVerification;
