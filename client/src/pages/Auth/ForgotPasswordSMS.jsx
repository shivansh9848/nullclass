import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../utils/apiConfig';
import './Auth.css';

const ForgotPasswordSMS = () => {
    const [step, setStep] = useState(1); // 1: Phone input, 2: OTP verification
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!phone) {
            setError('Please provide your phone number');
            setIsLoading(false);
            return;
        }

        // Validate phone number format
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            setError('Please provide a valid 10-digit phone number');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(getApiUrl('api/auth/forgot-password-sms'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('✅ OTP sent to your WhatsApp successfully!');
                setStep(2);
            } else {
                if (data.message.includes('once per day')) {
                    setError('⚠️ You can request password reset only once a day.');
                } else {
                    setError(data.message || 'Failed to send OTP');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!otp) {
            setError('Please enter the OTP');
            setIsLoading(false);
            return;
        }

        if (otp.length !== 6) {
            setError('OTP must be 6 digits');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(getApiUrl('api/auth/verify-otp-reset'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone,
                    otp
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('✅ Your new password has been sent to your WhatsApp. Please check your messages and use the new password to log in.');
                // Clear form
                setPhone('');
                setOtp('');
                // Redirect to login after 8 seconds
                setTimeout(() => {
                    navigate('/Auth');
                }, 8000);
            } else {
                setError(data.message || 'Failed to verify OTP');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setStep(1);
        setOtp('');
        setError('');
        setSuccess('');
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Reset Password via SMS</h2>
                <p className="auth-subtitle">
                    {step === 1 ? 'Enter your phone number to receive OTP on WhatsApp' : 'Enter the OTP sent to your WhatsApp'}
                </p>

                {step === 1 ? (
                    <form onSubmit={handlePhoneSubmit}>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number:</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your 10-digit phone number"
                                disabled={isLoading}
                                maxLength="10"
                                pattern="[6-9][0-9]{9}"
                                required
                            />
                            <small className="help-text">
                                Enter your 10-digit phone number (e.g., 9876543210). You'll receive OTP on WhatsApp.
                            </small>
                        </div>

                        <div className="password-reset-info">
                            <h4>📱 How it works:</h4>
                            <div className="info-steps">
                                <p>1. Enter your phone number</p>
                                <p>2. Click "Send OTP"</p>
                                <p>3. Enter the 6-digit OTP received</p>
                                <p>4. Get your new password via SMS</p>
                                <p>5. Use the new password to log in</p>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <button type="submit" disabled={isLoading} className="auth-btn">
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOTPSubmit}>
                        <div className="form-group">
                            <label htmlFor="otp">Enter OTP:</label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit OTP"
                                disabled={isLoading}
                                maxLength="6"
                                pattern="[0-9]{6}"
                                required
                            />
                            <small className="help-text">
                                OTP sent to: {phone} (Valid for 10 minutes)
                            </small>
                        </div>

                        <div className="otp-info">
                            <p>📱 Check your phone for the 6-digit OTP</p>
                            <p>⏰ OTP is valid for 10 minutes</p>
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <button type="submit" disabled={isLoading} className="auth-btn">
                            {isLoading ? 'Verifying...' : 'Verify OTP & Reset Password'}
                        </button>

                        <button type="button" onClick={handleBack} className="auth-btn-secondary">
                            Back to Phone Number
                        </button>
                    </form>
                )}

                <div className="auth-options">
                    <p className="auth-switch">
                        Want to reset via email instead? <span onClick={() => navigate('/forgot-password')} className="auth-link">Use Email</span>
                    </p>
                    <p className="auth-switch">
                        Remember your password? <span onClick={() => navigate('/Auth')} className="auth-link">Login</span>
                    </p>
                </div>

                <div className="forgot-password-notice">
                    <p className="notice-text">
                        <strong>Note:</strong> You can only request a password reset once per day.
                        A new 10-character password will be sent to your phone.
                        <br />
                        <strong>Important:</strong> Please change this password immediately after logging in.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordSMS;
