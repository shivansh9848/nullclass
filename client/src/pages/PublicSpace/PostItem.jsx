import React, { useState } from 'react';
import moment from 'moment';
import { getApiUrl } from '../../utils/apiConfig';
import './PostItem.css';

const PostItem = ({ post, currentUser, onPostUpdate }) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    // Safety check for post object
    if (!post) {
        return (
            <div className="post-item">
                <div className="post-error">
                    <p>Error loading post data</p>
                </div>
            </div>
        );
    }

    // Provide fallback values for missing properties
    const safePost = {
        _id: post._id || '',
        content: post.content || '',
        userId: post.userId || { name: 'Unknown User' },
        createdAt: post.createdAt || new Date(),
        likes: post.likes || [],
        comments: post.comments || [],
        shares: post.shares || [],
        media: post.media || [],
        ...post
    };

    const getAuthToken = () => {
        return localStorage.getItem('Profile') ?
            JSON.parse(localStorage.getItem('Profile')).token : null;
    };

    const handleLike = async () => {
        if (!currentUser) return;

        try {
            const token = getAuthToken();
            const response = await fetch(getApiUrl(`api/posts/${safePost._id}/like`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                onPostUpdate();
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await fetch(getApiUrl(`api/posts/${safePost._id}/comment`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });

            if (response.ok) {
                setNewComment('');
                onPostUpdate();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (!currentUser) return;

        try {
            const token = getAuthToken();
            const response = await fetch(getApiUrl(`api/posts/${safePost._id}/share`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                onPostUpdate();
                alert('Post shared successfully!');
            }
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    const isLiked = currentUser && safePost.likes && safePost.likes.some(like => like.userId?._id === currentUser._id);

    return (
        <div className="post-item">
            <div className="post-header">
                <div className="user-info">
                    <div className="user-avatar">
                        {safePost.userId?.name ? safePost.userId.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="user-details">
                        <h4 className="user-name">{safePost.userId?.name || 'Unknown User'}</h4>
                        <span className="post-time">{moment(safePost.createdAt).fromNow()}</span>
                    </div>
                </div>
            </div>

            <div className="post-content">
                <p>{safePost.content}</p>
            </div>

            {safePost.media && safePost.media.length > 0 && (
                <div className="post-media">
                    {safePost.media.map((media, index) => (
                        <div key={index} className="media-item">
                            {media.type === 'image' ? (
                                <img
                                    src={media.url}
                                    alt="Post media"
                                    className="post-image"
                                />
                            ) : (
                                <video
                                    src={media.url}
                                    controls
                                    className="post-video"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="post-stats">
                <span className="stat-item">
                    {safePost.likes?.length || 0} {(safePost.likes?.length || 0) === 1 ? 'Like' : 'Likes'}
                </span>
                <span className="stat-item">
                    {safePost.comments?.length || 0} {(safePost.comments?.length || 0) === 1 ? 'Comment' : 'Comments'}
                </span>
                <span className="stat-item">
                    {safePost.shares?.length || 0} {(safePost.shares?.length || 0) === 1 ? 'Share' : 'Shares'}
                </span>
            </div>

            <div className="post-actions">
                <button
                    className={`action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                    disabled={!currentUser}
                >
                    {isLiked ? '❤️' : '🤍'} Like
                </button>
                <button
                    className="action-btn"
                    onClick={() => setShowComments(!showComments)}
                >
                    💬 Comment
                </button>
                <button
                    className="action-btn"
                    onClick={handleShare}
                    disabled={!currentUser}
                >
                    📤 Share
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    <div className="comments-list">
                        {safePost.comments && safePost.comments.map((comment, index) => (
                            <div key={index} className="comment-item">
                                <div className="comment-avatar">
                                    {comment.userId?.name ? comment.userId.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <span className="comment-author">{comment.userId?.name || 'Unknown User'}</span>
                                        <span className="comment-time">{moment(comment.commentedAt).fromNow()}</span>
                                    </div>
                                    <p className="comment-text">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {currentUser && (
                        <form onSubmit={handleComment} className="comment-form">
                            <div className="comment-input-container">
                                <div className="comment-avatar">
                                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="comment-input"
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || loading}
                                    className="comment-submit"
                                >
                                    {loading ? '...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostItem;
