import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { transferPoints, searchUsers } from '../../action/users';
import './PointsTransfer.css';

const PointsTransfer = ({ currentUser, onClose }) => {
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
            alert('Please select a user and enter valid points amount');
            return;
        }

        if (currentUser?.points < 10) {
            alert('You need at least 10 points to transfer');
            return;
        }

        if (parseInt(pointsToTransfer) > currentUser?.points) {
            alert('You don\'t have enough points to transfer');
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(transferPoints(selectedUser._id, parseInt(pointsToTransfer)));
            alert('Points transferred successfully!');
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || 'Transfer failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="points-transfer-overlay">
            <div className="points-transfer-modal">
                <div className="modal-header">
                    <h3>💰 Transfer Points</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    <div className="current-points">
                        <span>Your Points: <strong>{currentUser?.points || 0}</strong></span>
                        {currentUser?.points < 10 && (
                            <p className="error-text">You need at least 10 points to transfer</p>
                        )}
                    </div>

                    <div className="search-section">
                        <label>Search User:</label>
                        <input
                            type="text"
                            placeholder="Enter user name..."
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
                                            <span className="user-points">{user.points} points</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedUser && (
                        <div className="selected-user">
                            <h4>Selected User:</h4>
                            <div className="user-card">
                                <span className="user-name">{selectedUser.name}</span>
                                <span className="user-points">{selectedUser.points} points</span>
                            </div>
                        </div>
                    )}

                    <div className="points-input-section">
                        <label>Points to Transfer:</label>
                        <input
                            type="number"
                            min="1"
                            max={currentUser?.points || 0}
                            value={pointsToTransfer}
                            onChange={(e) => setPointsToTransfer(e.target.value)}
                            className="points-input"
                            placeholder="Enter points amount"
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            onClick={handleTransfer}
                            disabled={!selectedUser || !pointsToTransfer || isLoading || (currentUser?.points < 10)}
                            className="transfer-btn"
                        >
                            {isLoading ? 'Transferring...' : 'Transfer Points'}
                        </button>
                        <button onClick={onClose} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PointsTransfer;
