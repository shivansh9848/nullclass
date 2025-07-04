import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/apiConfig';
import './FriendsSidebar.css';

const FriendsSidebar = ({ user }) => {
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [friendsCount, setFriendsCount] = useState(0);
    const [activeTab, setActiveTab] = useState('friends');
    const [loading, setLoading] = useState(true);

    const getAuthToken = () => {
        return localStorage.getItem('Profile') ?
            JSON.parse(localStorage.getItem('Profile')).token : null;
    };

    useEffect(() => {
        if (user) {
            fetchFriends();
            fetchPendingRequests();
            fetchSuggestions();
            fetchFriendsCount();
        }
    }, [user]);

    const fetchFriends = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(getApiUrl('api/friends'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFriends(data);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(getApiUrl('api/friends/pending'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPendingRequests(data);
            }
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    const fetchSuggestions = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(getApiUrl('api/friends/suggestions?limit=5'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFriendsCount = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(getApiUrl('api/friends/count'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFriendsCount(data.count);
            }
        } catch (error) {
            console.error('Error fetching friends count:', error);
        }
    };

    const sendFriendRequest = async (friendId) => {
        try {
            const token = getAuthToken();
            const response = await fetch(getApiUrl('api/friends/request'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ friendId })
            });

            if (response.ok) {
                fetchSuggestions();
                alert('Friend request sent!');
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            alert('Failed to send friend request');
        }
    };

    const acceptFriendRequest = async (requestId) => {
        try {
            const token = getAuthToken();
            const response = await fetch(getApiUrl(`api/friends/accept/${requestId}`), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchFriends();
                fetchPendingRequests();
                fetchFriendsCount();
                alert('Friend request accepted!');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const rejectFriendRequest = async (requestId) => {
        try {
            const token = getAuthToken();
            const response = await fetch(getApiUrl(`api/friends/reject/${requestId}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchPendingRequests();
                alert('Friend request rejected');
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    if (!user) {
        return (
            <div className="friends-sidebar">
                <div className="login-prompt">
                    <p>Please log in to see friends</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="friends-sidebar">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="friends-sidebar">
            <div className="sidebar-header">
                <h3>Friends & Connections</h3>
                <div className="friends-count">
                    {friendsCount} {friendsCount === 1 ? 'Friend' : 'Friends'}
                </div>
            </div>

            <div className="sidebar-tabs">
                <button
                    className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
                    onClick={() => setActiveTab('friends')}
                >
                    Friends ({friends.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Requests ({pendingRequests.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('suggestions')}
                >
                    Suggestions
                </button>
            </div>

            <div className="sidebar-content">
                {activeTab === 'friends' && (
                    <div className="friends-list">
                        {friends.length === 0 ? (
                            <div className="empty-state">
                                <p>No friends yet. Start by adding some friends!</p>
                            </div>
                        ) : (
                            friends.map(friendship => (
                                <div key={friendship._id} className="friend-item">
                                    <div className="friend-avatar">
                                        {friendship.friend?.name ? friendship.friend.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="friend-info">
                                        <div className="friend-name">{friendship.friend?.name || 'Unknown User'}</div>
                                        <div className="friend-since">
                                            Friends since {new Date(friendship.since).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="requests-list">
                        {pendingRequests.length === 0 ? (
                            <div className="empty-state">
                                <p>No pending friend requests</p>
                            </div>
                        ) : (
                            pendingRequests.map(request => (
                                <div key={request._id} className="request-item">
                                    <div className="request-avatar">
                                        {request.userId?.name ? request.userId.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="request-info">
                                        <div className="request-name">{request.userId?.name || 'Unknown User'}</div>
                                        <div className="request-actions">
                                            <button
                                                className="accept-btn"
                                                onClick={() => acceptFriendRequest(request._id)}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="reject-btn"
                                                onClick={() => rejectFriendRequest(request._id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'suggestions' && (
                    <div className="suggestions-list">
                        {suggestions.length === 0 ? (
                            <div className="empty-state">
                                <p>No friend suggestions available</p>
                            </div>
                        ) : (
                            suggestions.map(suggestion => (
                                <div key={suggestion._id} className="suggestion-item">
                                    <div className="suggestion-avatar">
                                        {suggestion?.name ? suggestion.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="suggestion-info">
                                        <div className="suggestion-name">{suggestion?.name || 'Unknown User'}</div>
                                        <button
                                            className="add-friend-btn"
                                            onClick={() => sendFriendRequest(suggestion._id)}
                                        >
                                            Add Friend
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendsSidebar;
