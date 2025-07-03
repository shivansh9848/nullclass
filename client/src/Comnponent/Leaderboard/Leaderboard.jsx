import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaderboard } from '../../action/users';
import './Leaderboard.css';

const Leaderboard = () => {
    const dispatch = useDispatch();
    const { leaderboard } = useSelector(state => state.usersreducer);

    useEffect(() => {
        dispatch(getLeaderboard(10));
    }, [dispatch]);

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return '🥇';
            case 1: return '🥈';
            case 2: return '🥉';
            default: return `#${index + 1}`;
        }
    };

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h2>🏆 Points Leaderboard</h2>
                <p>Top contributors in our community</p>
            </div>

            <div className="leaderboard-list">
                {leaderboard.map((user, index) => (
                    <div key={user._id} className={`leaderboard-item rank-${index + 1}`}>
                        <div className="rank-badge">
                            {getRankIcon(index)}
                        </div>

                        <div className="user-avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="user-details">
                            <h3 className="user-name">{user.name}</h3>
                            <div className="user-stats">
                                <span className="points">{user.points} points</span>
                                <span className="badges-count">{user.badges.length} badges</span>
                            </div>
                        </div>

                        <div className="user-badges">
                            {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                                <span key={badgeIndex} className="badge-icon" title={badge.name}>
                                    {badge.icon}
                                </span>
                            ))}
                            {user.badges.length > 3 && (
                                <span className="more-badges">+{user.badges.length - 3}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {leaderboard.length === 0 && (
                <div className="no-data">
                    <p>No leaderboard data available</p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
