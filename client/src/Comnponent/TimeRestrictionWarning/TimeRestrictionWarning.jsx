import React from 'react';

const TimeRestrictionWarning = () => {
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
            return `${hoursUntil - 1} hours and ${minutesUntil} minutes`;
        } else if (currentHour >= 19) {
            // After 7PM
            const hoursUntil = 24 - currentHour + 14;
            const minutesUntil = 60 - now.getMinutes();
            return `${hoursUntil - 1} hours and ${minutesUntil} minutes`;
        }
        return '';
    };

    const getTimeUntilRestricted = () => {
        const now = new Date();
        const currentHour = now.getHours();

        if (currentHour >= 14 && currentHour < 19) {
            const hoursUntil = 19 - currentHour;
            const minutesUntil = 60 - now.getMinutes();
            return `${hoursUntil - 1} hours and ${minutesUntil} minutes`;
        }
        return '';
    };

    if (!isVideoUploadAllowed()) {
        return (
            <div className="time-restriction-warning">
                <h5>⏰ Video Upload Not Available</h5>
                <p>
                    Video uploads are only allowed between 2:00 PM and 7:00 PM daily.
                </p>
                <p>
                    <strong>Next available in:</strong> {getTimeUntilAllowed()}
                </p>
            </div>
        );
    }

    return (
        <div className="time-restriction-warning" style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' }}>
            <h5 style={{ color: '#155724' }}>✅ Video Upload Available</h5>
            <p style={{ color: '#155724' }}>
                Video uploads are currently allowed until 7:00 PM.
            </p>
            <p style={{ color: '#155724' }}>
                <strong>Time remaining:</strong> {getTimeUntilRestricted()}
            </p>
        </div>
    );
};

export default TimeRestrictionWarning;
