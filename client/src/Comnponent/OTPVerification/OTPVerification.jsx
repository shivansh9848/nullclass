import React, { useState } from 'react';
import { getApiUrl } from '../../utils/apiConfig';
import './OTPVerification.css';

const OTPVerification = ({ email, onVerificationSuccess, onClose }) => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            setError('Please enter the OTP');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(getApiUrl('api/verify-otp'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('Profile'))?.token}`
                },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (response.ok) {
                onVerificationSuccess();
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsResending(true);
        setError('');

        try {
            const response = await fetch(getApiUrl('api/send-otp'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('Profile'))?.token}`
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                alert('OTP sent successfully to your email');
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="otp-overlay">
            <div className="otp-modal">
                <div className="otp-header">
                    <h3>Email Verification Required</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="otp-content">
                    <p>We've sent a verification code to <strong>{email}</strong></p>
                    <p>Please enter the 6-digit code to proceed with video upload.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="otp-input-group">
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="otp-input"
                                maxLength="6"
                                disabled={isLoading}
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="otp-actions">
                            <button
                                type="submit"
                                disabled={isLoading || otp.length !== 6}
                                className="verify-btn"
                            >
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={isResending}
                                className="resend-btn"
                            >
                                {isResending ? 'Resending...' : 'Resend OTP'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;
