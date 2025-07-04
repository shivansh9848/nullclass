import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './VideoUpload.css';

const VideoUpload = ({ onVideoSelect, onRemoveVideo, selectedVideo }) => {
    const { t } = useTranslation();
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const [videoPreview, setVideoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const validateVideo = (file) => {
        // Check file type
        if (!file.type.startsWith('video/')) {
            return t('videoUpload.invalidFile');
        }

        // Check file size (50MB = 50 * 1024 * 1024 bytes)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            return t('videoUpload.fileTooLarge');
        }

        return null;
    };

    const checkVideoDuration = (file) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const duration = video.duration;

                // Check if duration is more than 2 minutes (120 seconds)
                if (duration > 120) {
                    resolve(t('videoUpload.videoTooLong'));
                } else {
                    resolve(null);
                }
            };

            video.onerror = () => {
                resolve('Error loading video. Please try again.');
            };

            video.src = URL.createObjectURL(file);
        });
    };

    const handleVideoChange = async (file) => {
        setError('');

        if (!file) return;

        // Validate file type and size
        const validationError = validateVideo(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Check video duration
        const durationError = await checkVideoDuration(file);
        if (durationError) {
            setError(durationError);
            return;
        }

        // Create video preview
        const videoUrl = URL.createObjectURL(file);
        setVideoPreview(videoUrl);

        // Pass the file to parent component
        onVideoSelect(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleVideoChange(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleVideoChange(e.target.files[0]);
        }
    };

    const handleRemoveVideo = () => {
        setVideoPreview(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onRemoveVideo();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="video-upload-container">
            <h4>{t('videoUpload.title')}</h4>
            <p>{t('videoUpload.description')}</p>

            {!selectedVideo && !videoPreview ? (
                <div
                    className={`video-upload-area ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="upload-icon">📹</div>
                    <p>{t('videoUpload.clickToUpload')}</p>
                    <p className="upload-limits">{t('videoUpload.fileTypes')}</p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                    />
                </div>
            ) : (
                <div className="video-preview-container">
                    <video
                        src={videoPreview || (selectedVideo ? URL.createObjectURL(selectedVideo) : '')}
                        controls
                        className="video-preview"
                        preload="metadata"
                    />
                    <div className="video-info">
                        <p className="video-name">{selectedVideo?.name}</p>
                        <p className="video-size">{formatFileSize(selectedVideo?.size || 0)}</p>
                        <button
                            type="button"
                            onClick={handleRemoveVideo}
                            className="remove-video-btn"
                        >
                            {t('videoUpload.removeVideo')}
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="video-error-message">{error}</div>
            )}
        </div>
    );
};

export default VideoUpload;
