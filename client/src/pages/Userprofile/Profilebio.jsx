import React from 'react'
import './Profilebio.css'

const Profilebio = ({ currentprofile }) => {
    return (
        <div className="profile-bio-container">
            <div className="profile-section">
                <div className="points-section">
                    <h3>🏆 Points & Achievements</h3>
                    <div className="points-display">
                        <span className="points-value">{currentprofile?.points || 0}</span>
                        <span className="points-label">Points</span>
                    </div>
                </div>

                {currentprofile?.badges && currentprofile.badges.length > 0 && (
                    <div className="badges-section">
                        <h4>🎖️ Badges</h4>
                        <div className="badges-container">
                            {currentprofile.badges.map((badge, index) => (
                                <div key={index} className="badge-item">
                                    <span className="badge-icon">{badge.icon}</span>
                                    <div className="badge-info">
                                        <span className="badge-name">{badge.name}</span>
                                        <span className="badge-description">{badge.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="profile-section">
                {currentprofile?.tags.length !== 0 ? (
                    <>
                        <h4>🏷️ Tags watched</h4>
                        <div className="tags-container">
                            {currentprofile?.tags.map((tag) => (
                                <span key={tag} className="tag-item">{tag}</span>
                            ))}
                        </div>
                    </>
                ) : (
                    <p>0 Tags watched</p>
                )}
            </div>

            <div className="profile-section">
                {currentprofile?.about ? (
                    <>
                        <h4>📖 About</h4>
                        <p className="about-text">{currentprofile?.about}</p>
                    </>
                ) : (
                    <p>No bio found</p>
                )}
            </div>
        </div>
    )
}

export default Profilebio