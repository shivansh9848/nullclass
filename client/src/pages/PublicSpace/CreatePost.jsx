import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../utils/apiConfig';
import './CreatePost.css';

const CreatePost = ({ user, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [postingStatus, setPostingStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPostingStatus();
    }, []);

    const fetchPostingStatus = async () => {
        try {
            const token = localStorage.getItem('Profile') ?
                JSON.parse(localStorage.getItem('Profile')).token : null;

            if (!token) return;

            const response = await fetch(getApiUrl('api/posts/status'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            setPostingStatus(data);
        } catch (error) {
            console.error('Error fetching posting status:', error);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert('You can only upload up to 5 files');
            return;
        }

        // Check file types
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            alert('Please select only images (JPEG, PNG, GIF) or videos (MP4, WebM)');
            return;
        }

        // Check file sizes (50MB limit)
        const oversizedFiles = files.filter(file => file.size > 50 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            alert('File size should not exceed 50MB');
            return;
        }

        setSelectedFiles(files);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert('Please write something to post');
            return;
        }

        if (!postingStatus?.canPost) {
            alert(postingStatus?.friendsRequired ?
                'You need at least 1 friend to post in the public space' :
                'You have reached your daily posting limit');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('Profile') ?
                JSON.parse(localStorage.getItem('Profile')).token : null;

            const formData = new FormData();
            formData.append('content', content);

            selectedFiles.forEach(file => {
                formData.append('media', file);
            });

            const response = await fetch(getApiUrl('api/posts'), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setContent('');
                setSelectedFiles([]);
                onPostCreated();
                fetchPostingStatus(); // Refresh posting status
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="create-post-container">
                <div className="login-prompt">
                    <p>Please log in to create posts</p>
                </div>
            </div>
        );
    }

    return (
        <div className="create-post-container">
            <div className="create-post-header">
                <h3>Create a Post</h3>
                {postingStatus && (
                    <div className="posting-status">
                        {postingStatus.canPost ? (
                            <span className="status-allowed">
                                {postingStatus.maxPosts === Infinity ?
                                    'Unlimited posts today' :
                                    `${postingStatus.maxPosts - postingStatus.postsToday} posts remaining today`
                                }
                            </span>
                        ) : (
                            <span className="status-blocked">
                                {postingStatus.friendsRequired ?
                                    'Add friends to start posting' :
                                    'Daily limit reached'
                                }
                            </span>
                        )}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="create-post-form">
                <div className="user-info">
                    <div className="user-avatar">
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="user-name">{user?.name || 'Unknown User'}</span>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="post-textarea"
                    maxLength={1000}
                />

                <div className="file-upload-section">
                    <label htmlFor="file-upload" className="file-upload-label">
                        📎 Add Photos/Videos
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                </div>

                {selectedFiles.length > 0 && (
                    <div className="selected-files">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="file-preview">
                                <span className="file-name">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="remove-file-btn"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="post-actions">
                    <span className="character-count">
                        {content.length}/1000
                    </span>
                    <button
                        type="submit"
                        disabled={loading || !postingStatus?.canPost}
                        className="post-btn"
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
