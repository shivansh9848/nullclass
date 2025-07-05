import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Toast from '../Toast/Toast';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { t, i18n } = useTranslation();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [verificationType, setVerificationType] = useState('');
    const [otp, setOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState('contact'); // 'contact' or 'verify'
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const currentUser = useSelector((state) => state.currentuserreducer);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'pt', name: 'Português', flag: '🇧🇷' },
        { code: 'zh', name: '中文', flag: '🇨🇳' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleLanguageSelect = (languageCode) => {
        setShowDropdown(false);

        // If selecting the same language, do nothing
        if (languageCode === i18n.language) {
            return;
        }

        // For now, directly change language without verification
        // Remove verification requirement for better UX
        try {
            i18n.changeLanguage(languageCode);
            localStorage.setItem('language', languageCode);

            // Show success toast
            setToast({
                show: true,
                message: t('language.verificationSuccess', {
                    language: languages.find(l => l.code === languageCode)?.name
                }) || `Language changed to ${languages.find(l => l.code === languageCode)?.name}`,
                type: 'success'
            });
        } catch (error) {
            console.error('Language change error:', error);
            setToast({
                show: true,
                message: 'Failed to change language. Please try again.',
                type: 'error'
            });
        }
    };

    const handleSendOTP = async () => {
        setLoading(true);
        setError('');

        try {
            // Validate phone number for SMS verification
            if (verificationType === 'sms' && !phoneNumber.trim()) {
                setError(t('language.phoneRequired'));
                setLoading(false);
                return;
            }

            const token = currentUser?.token;
            if (!token) {
                setError(t('auth.loginRequired'));
                setLoading(false);
                return;
            }

            const endpoint = verificationType === 'email'
                ? '/api/auth/send-language-email-otp'
                : '/api/auth/send-language-sms-otp';

            const body = verificationType === 'email'
                ? { language: selectedLanguage }
                : { language: selectedLanguage, phone: phoneNumber };

            console.log('Sending OTP request:', { endpoint, body });

            const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            console.log('OTP response:', data);

            if (response.ok) {
                if (data.verified) {
                    // Language already verified, switch directly
                    await i18n.changeLanguage(selectedLanguage);
                    localStorage.setItem('language', selectedLanguage);
                    setShowVerification(false);
                    setError('');
                    // Show success toast
                    setToast({
                        show: true,
                        message: t('language.verificationSuccess', {
                            language: languages.find(l => l.code === selectedLanguage)?.name
                        }),
                        type: 'success'
                    });
                } else {
                    setStep('verify');
                    setError(null);
                }
            } else {
                console.error('OTP send error:', data);
                setError(data.message || t('errors.somethingWrong'));
            }
        } catch (err) {
            console.error('OTP send network error:', err);
            setError(t('errors.somethingWrong'));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = currentUser?.token;
            if (!token) {
                setError(t('auth.loginRequired'));
                setLoading(false);
                return;
            }

            if (!otp || otp.length !== 6) {
                setError(t('language.otpRequired'));
                setLoading(false);
                return;
            }

            // Use the single verification endpoint for both email and SMS
            const endpoint = '/api/auth/verify-language-otp';

            const body = {
                language: selectedLanguage,
                otp: otp
            };

            console.log('Verifying OTP:', { endpoint, body });

            const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            console.log('OTP verification response:', data);

            if (response.ok) {
                // Change language and close modal
                await i18n.changeLanguage(selectedLanguage);
                localStorage.setItem('language', selectedLanguage);
                setShowVerification(false);
                setError('');
                setOtp('');
                setPhoneNumber('');
                setStep('contact');

                // Show success toast
                setToast({
                    show: true,
                    message: t('language.verificationSuccess', {
                        language: languages.find(l => l.code === selectedLanguage)?.name
                    }),
                    type: 'success'
                });
            } else {
                console.error('OTP verification error:', data);
                setError(data.message || t('errors.somethingWrong'));
            }
        } catch (err) {
            console.error('OTP verification network error:', err);
            setError(t('errors.somethingWrong'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setShowVerification(false);
        setError(null);
        setOtp('');
        setPhoneNumber('');
        setStep('contact');
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 6) {
            setOtp(value);
            setError(null);
        }
    };

    return (
        <div className="language-switcher">
            <button
                className="language-switcher-button"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <span className="language-flag">{currentLanguage.flag}</span>
                <span className="language-name">{currentLanguage.name}</span>
                <span className="dropdown-arrow">▼</span>
            </button>

            {showDropdown && (
                <div className="language-dropdown">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            className={`language-option ${language.code === i18n.language ? 'active' : ''}`}
                            onClick={() => handleLanguageSelect(language.code)}
                        >
                            <span className="language-flag">{language.flag}</span>
                            <span className="language-name">{language.name}</span>
                            {language.code === i18n.language && <span className="checkmark">✓</span>}
                        </button>
                    ))}
                </div>
            )}

            {showVerification && (
                <div className="verification-overlay">
                    <div className="verification-modal">
                        <div className="verification-header">
                            <h3>{t('language.verificationRequired')}</h3>
                            <p>{t('language.verificationSubtitle')}</p>
                            <div className="target-language">
                                <span className="language-flag">
                                    {languages.find(l => l.code === selectedLanguage)?.flag}
                                </span>
                                <span>{languages.find(l => l.code === selectedLanguage)?.name}</span>
                            </div>
                        </div>

                        {step === 'contact' && (
                            <div className="contact-step">
                                <div className="verification-type">
                                    <div className="verification-icon">
                                        {verificationType === 'email' ? '📧' : '📱'}
                                    </div>
                                    <h4>
                                        {verificationType === 'email'
                                            ? t('language.emailVerification')
                                            : t('language.smsVerification')
                                        }
                                    </h4>
                                    <p>
                                        {verificationType === 'email'
                                            ? t('language.emailVerificationDesc')
                                            : t('language.smsVerificationDesc')
                                        }
                                    </p>
                                </div>

                                {verificationType === 'sms' && (
                                    <div className="contact-input">
                                        <label>{t('language.phoneNumber')}</label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder={t('language.phoneNumberPlaceholder')}
                                            className={error && !phoneNumber.trim() ? 'error' : ''}
                                        />
                                    </div>
                                )}

                                {error && error.trim() && (
                                    <div className="error-message">
                                        <span className="error-icon">⚠️</span>
                                        {error}
                                    </div>
                                )}

                                <div className="verification-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        className="send-btn"
                                        onClick={handleSendOTP}
                                        disabled={loading}
                                    >
                                        {loading ? t('common.loading') : t('language.sendCode')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'verify' && (
                            <div className="verify-step">
                                <div className="otp-info">
                                    <p>
                                        {verificationType === 'email'
                                            ? t('language.otpSentEmail')
                                            : t('language.otpSentSms')
                                        }
                                    </p>
                                    <strong>
                                        {verificationType === 'email'
                                            ? currentUser?.result?.email
                                            : phoneNumber
                                        }
                                    </strong>
                                </div>

                                <div className="otp-input">
                                    <label>{t('otp.enterCode')}</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        placeholder="000000"
                                        maxLength={6}
                                        className={`otp-field ${error ? 'error' : ''}`}
                                    />
                                </div>

                                {error && error.trim() && (
                                    <div className="error-message">
                                        <span className="error-icon">⚠️</span>
                                        {error}
                                    </div>
                                )}

                                <div className="verification-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        className="verify-btn"
                                        onClick={handleVerifyOTP}
                                        disabled={loading || !otp.trim()}
                                    >
                                        {loading ? t('common.loading') : t('language.verify')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: '', type: '' })}
                />
            )}
        </div>
    );
};

export default LanguageSwitcher;
