import React, { useState } from 'react'
import './Askquestion.css'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from 'react-i18next'
import { askquestion } from '../../action/question'
import VideoUpload from '../../Comnponent/VideoUpload/VideoUpload'
import OTPVerification from '../../Comnponent/OTPVerification/OTPVerification'
import TimeRestrictionWarning from '../../Comnponent/TimeRestrictionWarning/TimeRestrictionWarning'

const Askquestion = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.currentuserreducer)
    const [questiontitle, setquestiontitle] = useState("");
    const [questionbody, setquestionbody] = useState("");
    const [questiontag, setquestiontags] = useState("")
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [isOTPVerified, setIsOTPVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isVideoUploadAllowed = () => {
        const currentHour = new Date().getHours();
        return currentHour >= 14 && currentHour < 19; // 2PM to 7PM
    };

    const handleVideoSelect = async (video) => {
        if (!isVideoUploadAllowed()) {
            alert(t('askQuestion.videoTimeRestriction'));
            return;
        }

        if (!isOTPVerified) {
            setSelectedVideo(video);
            // Send OTP first
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/send-otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('Profile'))?.token}`
                    },
                    body: JSON.stringify({ email: user.result.email })
                });

                if (response.ok) {
                    setShowOTPModal(true);
                } else {
                    alert(t('askQuestion.otpSendFailed'));
                }
            } catch (error) {
                alert(t('auth.networkError'));
            }
        } else {
            setSelectedVideo(video);
        }
    };

    const handleOTPVerificationSuccess = () => {
        setIsOTPVerified(true);
        setShowOTPModal(false);
    };

    const handleRemoveVideo = () => {
        setSelectedVideo(null);
        setIsOTPVerified(false);
    };

    const handlesubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert(t('auth.loginToAskQuestion'));
            return;
        }

        if (!questionbody || !questiontitle || !questiontag) {
            alert(t('askQuestion.fillAllFields'));
            return;
        }

        // If video is selected, check time restrictions and OTP verification
        if (selectedVideo) {
            if (!isVideoUploadAllowed()) {
                alert(t('askQuestion.videoTimeRestriction'));
                return;
            }

            if (!isOTPVerified) {
                alert(t('askQuestion.verifyEmailFirst'));
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const questionData = {
                questiontitle,
                questionbody,
                questiontag,
                userposted: user.result.name,
                video: selectedVideo
            };

            dispatch(askquestion(questionData, navigate));
            alert(t('askQuestion.questionPosted'));
        } catch (error) {
            alert(t('askQuestion.postError'));
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleenter = (e) => {
        if (e.code === 'Enter') {
            setquestionbody(questionbody + "\n");
        }
    }

    return (
        <div className="ask-question">
            <div className="ask-ques-container">
                <h1>{t('askQuestion.title')}</h1>
                <form onSubmit={handlesubmit}>
                    <div className="ask-form-container">
                        <label htmlFor="ask-ques-title">
                            <h4>{t('questions.title')}</h4>
                            <p>{t('askQuestion.titleDescription')}</p>
                            <input type="text" id="ask-ques-title"
                                onChange={(e) => {
                                    setquestiontitle(e.target.value);
                                }} placeholder={t('askQuestion.titlePlaceholder')} />
                        </label>
                        <label htmlFor="ask-ques-body">
                            <h4>{t('questions.body')}</h4>
                            <p>{t('askQuestion.bodyDescription')}</p>
                            <textarea name="" id="ask-ques-body" onChange={(e) => {
                                setquestionbody(e.target.value);

                            }}
                                cols="30"
                                rows="10"
                                onKeyDown={handleenter}
                            ></textarea>
                        </label>

                        <TimeRestrictionWarning />

                        <VideoUpload
                            onVideoSelect={handleVideoSelect}
                            onRemoveVideo={handleRemoveVideo}
                            selectedVideo={selectedVideo}
                        />

                        <label htmlFor="ask-ques-tags">
                            <h4>{t('questions.tags')}</h4>
                            <p>{t('askQuestion.tagsDescription')}</p>
                            <input type="text" id='ask-ques-tags' onChange={(e) => {
                                setquestiontags(e.target.value.split(" "));
                            }}
                                placeholder={t('askQuestion.tagsPlaceholder')}
                            />
                        </label>
                    </div>
                    <input type="submit"
                        value={isSubmitting ? t('askQuestion.posting') : t('askQuestion.reviewQuestion')}
                        className='review-btn'
                        disabled={isSubmitting} />
                </form>

                {showOTPModal && (
                    <OTPVerification
                        email={user?.result?.email}
                        onVerificationSuccess={handleOTPVerificationSuccess}
                        onClose={() => setShowOTPModal(false)}
                    />
                )}
            </div>
        </div>
    )
}

export default Askquestion