import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const ForgotPasswordOptions = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Reset Password</h2>
                <p className="auth-subtitle">Choose how you'd like to reset your password</p>

                <div className="reset-options">
                    <div className="reset-option" onClick={() => navigate('/forgot-password-email')}>
                        <div className="option-icon">📧</div>
                        <div className="option-content">
                            <h3>Reset via Email</h3>
                            <p>Get a new password sent to your email address</p>
                        </div>
                        <div className="option-arrow">→</div>
                    </div>

                    <div className="reset-option" onClick={() => navigate('/forgot-password-sms')}>
                        <div className="option-icon">📱</div>
                        <div className="option-content">
                            <h3>Reset via SMS</h3>
                            <p>Get OTP and new password via SMS</p>
                        </div>
                        <div className="option-arrow">→</div>
                    </div>
                </div>

                <div className="reset-info">
                    <h4>🔐 Security Features:</h4>
                    <div className="info-list">
                        <p>✅ One password reset per day</p>
                        <p>✅ Secure 10-character password generation</p>
                        <p>✅ Email verification or SMS OTP</p>
                        <p>✅ Automatic password expiration</p>
                    </div>
                </div>

                <p className="auth-switch">
                    Remember your password? <span onClick={() => navigate('/Auth')} className="auth-link">Login</span>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordOptions;
