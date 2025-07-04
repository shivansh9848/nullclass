import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, show, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, onClose, duration]);

    if (!show) return null;

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                <span className="toast-icon">
                    {type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
                </span>
                <span className="toast-message">{message}</span>
                <button className="toast-close" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default Toast;
