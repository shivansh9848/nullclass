import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CreatePost from './CreatePost';
import PostList from './PostList';
import FriendsSidebar from './FriendsSidebar';
import './PublicSpace.css';

const PublicSpace = ({ slidein, handleslidein }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshPosts, setRefreshPosts] = useState(false);

    const User = useSelector((state) => state.currentuserreducer);

    useEffect(() => {
        fetchPosts();
    }, [page, refreshPosts]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/posts?page=${page}&limit=10`);
            const data = await response.json();

            if (data && data.posts) {
                if (page === 1) {
                    setPosts(data.posts);
                } else {
                    setPosts(prev => [...prev, ...data.posts]);
                }
                setTotalPages(data.totalPages || 1);
            } else {
                setPosts([]);
                setTotalPages(1);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
            setLoading(false);
        }
    };

    const handleNewPost = () => {
        setPage(1);
        setRefreshPosts(!refreshPosts);
    };

    const loadMorePosts = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    if (loading && page === 1) {
        return (
            <div className="public-space">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    return (
        <div className="public-space">
            <div className="public-space-header">
                <h1>Public Space</h1>
                <p>Connect with friends and share your moments</p>
            </div>

            <div className="public-space-content">
                <div className="main-content">
                    {User && (
                        <CreatePost
                            user={User.result || User}
                            onPostCreated={handleNewPost}
                        />
                    )}

                    <PostList
                        posts={posts}
                        currentUser={User.result || User}
                        onPostUpdate={handleNewPost}
                    />

                    {page < totalPages && (
                        <div className="load-more-container">
                            <button
                                className="load-more-btn"
                                onClick={loadMorePosts}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Load More Posts'}
                            </button>
                        </div>
                    )}
                </div>

                <FriendsSidebar user={User.result || User} />
            </div>
        </div>
    );
};

export default PublicSpace;
