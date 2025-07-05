import React, { useState } from 'react';
import { getApiUrl } from '../../utils/apiConfig';
import './DiagnosticPanel.css';

const DiagnosticPanel = () => {
    const [diagnostic, setDiagnostic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const runDiagnostic = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(getApiUrl('api/posts/diagnostic'));
            const data = await response.json();

            if (data.success) {
                setDiagnostic(data);
            } else {
                setError(data.error || 'Diagnostic failed');
            }
        } catch (err) {
            setError('Failed to run diagnostic: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="diagnostic-panel">
            <h2>Post Media Diagnostic</h2>
            <p>Click the button below to run a diagnostic check on post media uploads and display.</p>

            <button
                onClick={runDiagnostic}
                disabled={loading}
                className="diagnostic-button"
            >
                {loading ? 'Running Diagnostic...' : 'Run Diagnostic'}
            </button>

            {error && (
                <div className="diagnostic-error">
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            )}

            {diagnostic && (
                <div className="diagnostic-results">
                    <h3>Diagnostic Results</h3>

                    <div className="diagnostic-summary">
                        <h4>Summary</h4>
                        <ul>
                            <li>Cloudinary Configured: {diagnostic.diagnostic.cloudinaryConfigured ? '✅ Yes' : '❌ No'}</li>
                            <li>Posts with Media: {diagnostic.diagnostic.postsWithMediaCount}</li>
                            <li>Total Media Items: {diagnostic.diagnostic.totalMediaItems}</li>
                        </ul>
                    </div>

                    {diagnostic.diagnostic.recommendations.length > 0 && (
                        <div className="diagnostic-recommendations">
                            <h4>Recommendations</h4>
                            <ul>
                                {diagnostic.diagnostic.recommendations.map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="diagnostic-posts">
                        <h4>Recent Posts with Media</h4>
                        {diagnostic.postsWithMedia.length === 0 ? (
                            <p>No posts with media found.</p>
                        ) : (
                            diagnostic.postsWithMedia.map((post, index) => (
                                <div key={post.id} className="diagnostic-post">
                                    <h5>Post {index + 1}</h5>
                                    <p><strong>Content:</strong> {post.content}</p>
                                    <p><strong>Media Count:</strong> {post.mediaCount}</p>
                                    <div className="media-details">
                                        {post.media.map((media, mediaIndex) => (
                                            <div key={mediaIndex} className="media-item">
                                                <p><strong>Type:</strong> {media.type}</p>
                                                <p><strong>URL:</strong> <a href={media.url} target="_blank" rel="noopener noreferrer">{media.url}</a></p>
                                                <p><strong>Filename:</strong> {media.filename}</p>
                                                {media.type === 'image' && (
                                                    <div className="media-preview">
                                                        <img
                                                            src={media.url}
                                                            alt="Media preview"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'block';
                                                            }}
                                                        />
                                                        <div className="image-error" style={{ display: 'none' }}>
                                                            ❌ Image failed to load
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="diagnostic-url-tests">
                        <h4>URL Accessibility Tests</h4>
                        {diagnostic.diagnostic.urlTestResults.map((result, index) => (
                            <div key={index} className="url-test-result">
                                <p><strong>URL:</strong> {result.url}</p>
                                <p><strong>Status:</strong> {result.status} {result.accessible ? '✅' : '❌'}</p>
                                {result.error && <p><strong>Error:</strong> {result.error}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiagnosticPanel;
