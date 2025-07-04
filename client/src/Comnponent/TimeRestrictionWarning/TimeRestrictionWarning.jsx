import React from 'react';
import { useTranslation } from 'react-i18next';

const TimeRestrictionWarning = () => {
    const { t } = useTranslation();

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        return hours;
    };

    const isVideoUploadAllowed = () => {
        const currentHour = getCurrentTime();
        return currentHour >= 14 && currentHour < 19; // 2PM (14:00) to 7PM (19:00)
    };

    const getTimeUntilAllowed = () => {
        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour < 14) {
            // Before 2PM
            const hoursUntil = 14 - currentHour;
            const minutesUntil = 60 - now.getMinutes();
            return `${hoursUntil - 1} ${t('timeRestriction.hours')} ${t('timeRestriction.and')} ${minutesUntil} ${t('timeRestriction.minutes')}`;
        } else if (currentHour >= 19) {
            // After 7PM
            const hoursUntil = 24 - currentHour + 14;
            const minutesUntil = 60 - now.getMinutes();
            return `${hoursUntil - 1} ${t('timeRestriction.hours')} ${t('timeRestriction.and')} ${minutesUntil} ${t('timeRestriction.minutes')}`;
        }
        return '';
    };

    const getTimeUntilRestricted = () => {
        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour >= 14 && currentHour < 19) {
            const hoursUntil = 19 - currentHour;
            const minutesUntil = 60 - now.getMinutes();
            return `${hoursUntil - 1} ${t('timeRestriction.hours')} ${t('timeRestriction.and')} ${minutesUntil} ${t('timeRestriction.minutes')}`;
        }
        return '';
    };

    if (!isVideoUploadAllowed()) {
        return (
            <div className="time-restriction-warning">
                <h5>⏰ {t('timeRestriction.videoNotAvailable')}</h5>
                <p>
                    {t('timeRestriction.videoUploadTime')}
                </p>
                <p>
                    <strong>{t('timeRestriction.nextAvailable')}:</strong> {getTimeUntilAllowed()}
                </p>
            </div>
        );
    }

    return (
        <div className="time-restriction-warning" style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' }}>
            <h5 style={{ color: '#155724' }}>✅ {t('timeRestriction.videoAvailable')}</h5>
            <p style={{ color: '#155724' }}>
                {t('timeRestriction.videoCurrentlyAllowed')}
            </p>
            <p style={{ color: '#155724' }}>
                <strong>{t('timeRestriction.timeRemaining')}:</strong> {getTimeUntilRestricted()}
            </p>
        </div>
    );
};

export default TimeRestrictionWarning;
