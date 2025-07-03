import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const generatePassword = () => {
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        let password = '';

        // Generate 8 characters
        for (let i = 0; i < 8; i++) {
            if (i % 2 === 0) {
                password += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
            } else {
                password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
            }
        }
        return password;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!email && !phone) {
            setError('Please provide either email or phone number');
            setIsLoading(false);
            return;
        }

        try {
            const newPassword = generatePassword();
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    phone,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password reset successful! Please check your email/phone for the new password.');
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

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number:</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Reset Password'}
                    </button>
                </form>
                <p className="auth-switch">
                    Remember your password? <span onClick={() => navigate('/Auth')}>Login</span>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword; 