import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginHistory.css';

const LoginHistory = () => {
    const [loginHistory, setLoginHistory] = useState([]);
    const [currentSessions, setCurrentSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchLoginHistory();
    }, []);

    const fetchLoginHistory = async () => {
        try {
            const token = localStorage.getItem('Profile') ? JSON.parse(localStorage.getItem('Profile')).token : null;

            if (!token) {
                navigate('/auth');
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login-history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setLoginHistory(data.loginHistory || []);
                setCurrentSessions(data.currentSessions || []);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to fetch login history');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Fetch login history error:', err);
        } finally {
            setLoading(false);
        }
    };

    const terminateSession = async (sessionId) => {
        try {
            const token = localStorage.getItem('Profile') ? JSON.parse(localStorage.getItem('Profile')).token : null;

            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/sessions/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                await fetchLoginHistory(); // Refresh the data
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to terminate session');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Terminate session error:', err);
        }
    };

    const terminateAllSessions = async () => {
        if (!window.confirm('Are you sure you want to terminate all other sessions? This will log out all your other devices.')) {
            return;
        }

        try {
            const token = localStorage.getItem('Profile') ? JSON.parse(localStorage.getItem('Profile')).token : null;

            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/sessions`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                await fetchLoginHistory(); // Refresh the data
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to terminate sessions');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Terminate all sessions error:', err);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'success': { class: 'success', text: 'Success' },
            'failed': { class: 'failed', text: 'Failed' },
            'otp_required': { class: 'otp', text: 'OTP Required' },
            'time_restricted': { class: 'restricted', text: 'Time Restricted' }
        };
        return badges[status] || { class: 'unknown', text: 'Unknown' };
    };

    const getDeviceIcon = (device) => {
        switch (device.toLowerCase()) {
            case 'mobile':
                return '📱';
            case 'tablet':
                return '📱';
            case 'desktop':
                return '💻';
            default:
                return '🖥️';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const getTimeDifference = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else {
            return `${diffInDays} days ago`;
        }
    };

    if (loading) {
        return <div className="login-history-loading">Loading login history...</div>;
    }

    return (
        <div className="login-history-container">
            <div className="login-history-header">
                <h2>Login History & Security</h2>
                <p>Monitor your account activity and manage active sessions</p>
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}

            {/* Current Sessions */}
            <div className="section">
                <div className="section-header">
                    <h3>Active Sessions ({currentSessions.filter(s => s.isActive).length})</h3>
                    {currentSessions.filter(s => s.isActive).length > 1 && (
                        <button
                            className="terminate-all-btn"
                            onClick={terminateAllSessions}
                        >
                            Terminate All Other Sessions
                        </button>
                    )}
                </div>

                <div className="sessions-grid">
                    {currentSessions.filter(s => s.isActive).map(session => (
                        <div key={session._id} className={`session-card ${session.isCurrent ? 'current-session' : ''}`}>
                            <div className="session-header">
                                <div className="device-info">
                                    <span className="device-icon">{getDeviceIcon(session.deviceInfo.device)}</span>
                                    <div>
                                        <strong>{session.deviceInfo.displayName}</strong>
                                        {session.isCurrent && <span className="current-badge">Current</span>}
                                    </div>
                                </div>
                                {!session.isCurrent && (
                                    <button
                                        className="terminate-btn"
                                        onClick={() => terminateSession(session.sessionId)}
                                    >
                                        Terminate
                                    </button>
                                )}
                            </div>
                            <div className="session-details">
                                <div className="detail-item">
                                    <span className="detail-label">IP Address:</span>
                                    <span className="detail-value">{session.ipAddress}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Login Time:</span>
                                    <span className="detail-value">{formatDate(session.loginTime)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Last Activity:</span>
                                    <span className="detail-value">{getTimeDifference(session.lastActivity)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Login History */}
            <div className="section">
                <div className="section-header">
                    <h3>Login History ({loginHistory.length})</h3>
                </div>

                {loginHistory.length === 0 ? (
                    <div className="no-history">
                        <p>No login history available</p>
                    </div>
                ) : (
                    <div className="history-table">
                        <div className="table-header">
                            <div className="col-time">Time</div>
                            <div className="col-device">Device</div>
                            <div className="col-location">IP Address</div>
                            <div className="col-status">Status</div>
                            <div className="col-details">Details</div>
                        </div>

                        {loginHistory.map(login => {
                            const statusBadge = getStatusBadge(login.loginStatus);
                            return (
                                <div key={login._id} className="table-row">
                                    <div className="col-time">
                                        <div className="time-main">{formatDate(login.loginTime)}</div>
                                        <div className="time-relative">{getTimeDifference(login.loginTime)}</div>
                                    </div>
                                    <div className="col-device">
                                        <div className="device-display">
                                            <span className="device-icon">{getDeviceIcon(login.deviceInfo.device)}</span>
                                            <div>
                                                <div className="device-name">{login.deviceInfo.displayName}</div>
                                                <div className="device-type">{login.deviceInfo.device}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-location">
                                        <span className="ip-address">{login.ipAddress}</span>
                                    </div>
                                    <div className="col-status">
                                        <span className={`status-badge ${statusBadge.class}`}>
                                            {statusBadge.text}
                                        </span>
                                    </div>
                                    <div className="col-details">
                                        <div className="login-details">
                                            {login.otpRequired && <span className="detail-tag">OTP Sent</span>}
                                            {login.otpVerified && <span className="detail-tag verified">OTP Verified</span>}
                                            {login.logoutTime && (
                                                <span className="logout-time">
                                                    Logout: {formatDate(login.logoutTime)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginHistory;
