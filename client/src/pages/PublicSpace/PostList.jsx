import React from 'react';
import PostItem from './PostItem';
import './PostList.css';

const PostList = ({ posts, currentUser, onPostUpdate }) => {
    if (!posts || posts.length === 0) {
        return (
            <div className="post-list-empty">
                <div className="empty-state">
                    <h3>No posts yet</h3>
                    <p>Be the first to share something in the public space!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="post-list">
            {posts.map(post => (
                <PostItem
                    key={post._id}
                    post={post}
                    currentUser={currentUser}
                    onPostUpdate={onPostUpdate}
                />
            ))}
        </div>
    );
};

export default PostList;
