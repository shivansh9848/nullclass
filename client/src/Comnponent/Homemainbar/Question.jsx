import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const Question = ({ question }) => {
    const { t } = useTranslation();
    const users = useSelector((state) => state.usersreducer.users || [])
    const currentUser = useSelector((state) => state.currentuserreducer)

    // Find user ID by name if userid is not available
    const getUserId = () => {
        if (question.userid) {
            return question.userid;
        }
        // If userid is missing, try to find by username
        const user = users.find(u => u.name === question.userposted);
        if (user) {
            return user._id;
        }
        // If current user posted this question
        if (currentUser?.result?.name === question.userposted) {
            return currentUser.result._id;
        }
        return null;
    };

    const userId = getUserId();
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
                        {t('home.asked')} {dayjs(question.askedon).fromNow()}
                        {userId ? (
                            <Link to={`/Users/${userId}`} className="user-link" style={{ color: "#0086d8", marginLeft: "4px" }}>
                                {question.userposted}
                            </Link>
                        ) : (
                            <span style={{ marginLeft: "4px" }}>{question.userposted}</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Question