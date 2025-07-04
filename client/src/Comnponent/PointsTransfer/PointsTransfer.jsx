import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { transferPoints, searchUsers } from '../../action/users';
import './PointsTransfer.css';

const PointsTransfer = ({ currentUser, onClose }) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [pointsToTransfer, setPointsToTransfer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const { searchResults, transferMessage, transferError } = useSelector(state => state.usersreducer);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim().length > 0) {
            dispatch(searchUsers(query));
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setSearchQuery(user.name);
    };

    const handleTransfer = async () => {
        if (!selectedUser || !pointsToTransfer || pointsToTransfer < 1) {
            alert(t('pointsTransfer.selectUserAndAmount'));
            return;
        }

        if (currentUser?.points < 10) {
            alert(t('pointsTransfer.minimumPoints'));
            return;
        }

        if (parseInt(pointsToTransfer) > currentUser?.points) {
            alert(t('pointsTransfer.notEnoughPoints'));
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(transferPoints(selectedUser._id, parseInt(pointsToTransfer)));
            alert(t('pointsTransfer.transferSuccess'));
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || t('pointsTransfer.transferFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="points-transfer-overlay">
            <div className="points-transfer-modal">
                <div className="modal-header">
                    <h3>💰 {t('pointsTransfer.title')}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    <div className="current-points">
                        <span>{t('pointsTransfer.yourPoints')}: <strong>{currentUser?.points || 0}</strong></span>
                        {currentUser?.points < 10 && (
                            <p className="error-text">{t('pointsTransfer.minimumPoints')}</p>
                        )}
                    </div>

                    <div className="search-section">
                        <label>{t('pointsTransfer.searchUser')}:</label>
                        <input
                            type="text"
                            placeholder={t('pointsTransfer.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="search-input"
                        />

                        {searchResults.length > 0 && !selectedUser && (
                            <div className="search-results">
                                {searchResults.map((user) => (
                                    <div
                                        key={user._id}
                                        className="search-result-item"
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <div className="user-info">
                                            <span className="user-name">{user.name}</span>
                                            <span className="user-points">{user.points} {t('profile.points')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedUser && (
                        <div className="selected-user">
                            <h4>{t('pointsTransfer.selectedUser')}:</h4>
                            <div className="user-card">
                                <span className="user-name">{selectedUser.name}</span>
                                <span className="user-points">{selectedUser.points} {t('profile.points')}</span>
                            </div>
                        </div>
                    )}

                    <div className="points-input-section">
                        <label>{t('pointsTransfer.pointsToTransfer')}:</label>
                        <input
                            type="number"
                            min="1"
                            max={currentUser?.points || 0}
                            value={pointsToTransfer}
                            onChange={(e) => setPointsToTransfer(e.target.value)}
                            className="points-input"
                            placeholder={t('pointsTransfer.pointsPlaceholder')}
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            onClick={handleTransfer}
                            disabled={!selectedUser || !pointsToTransfer || isLoading || (currentUser?.points < 10)}
                            className="transfer-btn"
                        >
                            {isLoading ? t('pointsTransfer.transferring') : t('pointsTransfer.transferPoints')}
                        </button>
                        <button onClick={onClose} className="cancel-btn">{t('common.cancel')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PointsTransfer;
