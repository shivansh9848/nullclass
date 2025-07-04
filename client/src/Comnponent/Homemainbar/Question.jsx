import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import moment from "moment"

const Question = ({ question }) => {
    const { t } = useTranslation();
    return (
        <div className="display-question-container">
            <div className="display-votes-ans">
                <p>{question.upvote.length - question.downvote.length}</p>
                <p>{t('home.votes')}</p>
            </div>
            <div className="display-votes-ans">
                <p>{question.noofanswers}</p>
                <p>{t('home.answers')}</p>
            </div>
            <div className="display-question-details">
                <Link to={`/Question/${question._id}`} className='question-title-link'>
                    {question.questiontitle.length > (window.innerWidth <= 400 ? 70 : 90)
                        ? question.questiontitle.substring(
                            0,
                            window.innerWidth <= 400 ? 70 : 90
                        ) + "..."
                        : question.questiontitle
                    }
                </Link>
                {question.videoUrl && (
                    <div className="question-video-indicator">
                        <span className="video-icon">🎥</span>
                        <span className="video-text">{t('questions.videoIncluded')}</span>
                    </div>
                )}
                <div className="display-tags-time">
                    <div className="display-tags">
                        {question.questiontags.map((tag) => (
                            <p key={tag}> {tag}</p>
                        ))}
                    </div>
                    <p className="display-time">
                        {t('home.asked')} {moment(question.askedon).fromNow()} {question.userposted}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Question