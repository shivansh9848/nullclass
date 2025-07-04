import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import "./Auth.css"
import icon from '../../assets/icon.png'
import Aboutauth from './Aboutauth'
import { signup, login } from '../../action/auth'
import LoginOTPVerification from '../../Comnponent/OTPVerification/LoginOTPVerification'

const Auth = () => {
    const { t } = useTranslation();
    const [issignup, setissignup] = useState(false)
    const [name, setname] = useState("");
    const [email, setemail] = useState("bob.smith@example.com");
    const [password, setpassword] = useState("password123")
    const [phone, setphone] = useState("")
    const [showOTP, setShowOTP] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email && !password) {
            setError(t('auth.enterEmail'))
            return;
        }

        if (issignup) {
            if (!name) {
                setError(t('auth.enterName'))
                return;
            }
            dispatch(signup({ name, email, password, phone }, navigate))
        } else {
            setLoading(true);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    if (data.requiresOTP) {
                        // Show OTP verification modal
                        setShowOTP(true);
                    } else {
                        // Normal login success
                        localStorage.setItem('Profile', JSON.stringify({
                            result: data.result,
                            token: data.token,
                            sessionId: data.sessionId,
                            deviceInfo: data.deviceInfo
                        }));
                        dispatch({ type: 'AUTH', data });
                        navigate('/');
                    }
                } else {
                    setError(data.message || t('auth.networkError'));
                }
            } catch (err) {
                setError(t('auth.networkError'));
                console.error('Login error:', err);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleOTPSuccess = (data) => {
        // Login successful after OTP verification
        dispatch({ type: 'AUTH', data });
        setShowOTP(false);
        navigate('/');
    }

    const handleOTPCancel = () => {
        setShowOTP(false);
        setError('');
    }

    const handleswitch = () => {
        setissignup(!issignup);
        setname("");
        // Set default values for login mode, clear for signup mode
        if (issignup) {
            // Switching from signup to login - set default values
            setemail("bob.smith@example.com");
            setpassword("password123");
        } else {
            // Switching from login to signup - clear fields
            setemail("");
            setpassword("");
        }
        setphone("")
        setError('')
        setShowOTP(false)
    }

    return (
        <section className="auth-section">
            {issignup && <Aboutauth />}
            <div className="auth-container-2">
                <img src={icon} alt="icon" className='login-logo' />
                <form onSubmit={handlesubmit}>
                    {issignup && (
                        <label htmlFor="name">
                            <h4>{t('auth.displayName')}</h4>
                            <input type="text" id='name' name='name' value={name} onChange={(e) => {
                                setname(e.target.value);
                            }} />
                        </label>
                    )}
                    <label htmlFor="email">
                        <h4>{t('auth.email')}</h4>
                        <input type="email" id='email' name='email' value={email} onChange={(e) => {
                            setemail(e.target.value);
                        }} />
                    </label>
                    {issignup && (
                        <label htmlFor="phone">
                            <h4>{t('auth.phoneOptional')}</h4>
                            <input
                                type="tel"
                                id='phone'
                                name='phone'
                                value={phone}
                                onChange={(e) => {
                                    setphone(e.target.value);
                                }}
                                placeholder={t('auth.phoneNumber')}
                                maxLength="10"
                                pattern="[6-9][0-9]{9}"
                            />
                            <small style={{ color: '#666', fontSize: '12px' }}>
                                {t('auth.phoneRequired')}
                            </small>
                        </label>
                    )}
                    <label htmlFor="password">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h4>{t('auth.password')}</h4>
                            {!issignup && (
                                <p style={{ color: "#007ac6", fontSize: "13px", cursor: "pointer" }}
                                    onClick={() => navigate('/forgot-password')}>
                                    {t('auth.forgotPassword')}
                                </p>
                            )}
                        </div>
                        <input type="password" name="password" id="password" value={password} onChange={(e) => {
                            setpassword(e.target.value)
                        }} />
                    </label>

                    {error && (
                        <div className="error-message" style={{
                            color: '#dc3545',
                            fontSize: '14px',
                            marginBottom: '10px',
                            padding: '10px',
                            backgroundColor: '#fff5f5',
                            border: '1px solid #f5c6cb',
                            borderRadius: '4px'
                        }}>
                            {error}
                        </div>
                    )}

                    <button type='submit' className='auth-btn' disabled={loading}>
                        {loading ? t('auth.processing') : (issignup ? t('auth.signup') : t('auth.login'))}
                    </button>
                </form>

                {/* Device-specific login info */}
                {!issignup && (
                    <div className="login-info" style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#666'
                    }}>
                        <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>{t('auth.loginInfo')}</h5>
                        <ul style={{ margin: '0', paddingLeft: '20px' }}>
                            <li>🔐 {t('auth.chromeVerification')}</li>
                            <li>🌐 {t('auth.edgeLogin')}</li>
                            <li>📱 {t('auth.mobileAccess')}</li>
                            <li>🖥️ {t('auth.desktopAccess')}</li>
                        </ul>
                    </div>
                )}

                <p>
                    {issignup ? t('auth.alreadyAccount') : t('auth.noAccount')}
                    <button type='button' className='handle-switch-btn' onClick={handleswitch}>
                        {issignup ? t('common.login') : t('common.signup')}
                    </button>
                </p>
            </div>

            {/* OTP Verification Modal */}
            {showOTP && (
                <LoginOTPVerification
                    email={email}
                    onSuccess={handleOTPSuccess}
                    onCancel={handleOTPCancel}
                />
            )}
        </section>
    )
}

export default Auth