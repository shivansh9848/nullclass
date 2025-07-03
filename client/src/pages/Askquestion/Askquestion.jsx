import React, { useState } from 'react'
import './Askquestion.css'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { askquestion } from '../../action/question'
import VideoUpload from '../../Comnponent/VideoUpload/VideoUpload'
import OTPVerification from '../../Comnponent/OTPVerification/OTPVerification'
import TimeRestrictionWarning from '../../Comnponent/TimeRestrictionWarning/TimeRestrictionWarning'
const Askquestion = () => {
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
            alert('Video uploads are only allowed between 2:00 PM and 7:00 PM');
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
                    alert('Failed to send OTP. Please try again.');
                }
            } catch (error) {
                alert('Network error. Please try again.');
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
            alert("Login to ask question");
            return;
        }

        if (!questionbody || !questiontitle || !questiontag) {
            alert("Please enter all the fields");
            return;
        }

        // If video is selected, check time restrictions and OTP verification
        if (selectedVideo) {
            if (!isVideoUploadAllowed()) {
                alert('Video uploads are only allowed between 2:00 PM and 7:00 PM');
                return;
            }

            if (!isOTPVerified) {
                alert('Please verify your email before uploading video');
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
            alert("You have successfully posted a question");
        } catch (error) {
            alert("Error posting question. Please try again.");
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
                <h1>Ask a public Question</h1>
                <form onSubmit={handlesubmit}>
                    <div className="ask-form-container">
                        <label htmlFor="ask-ques-title">
                            <h4>Title</h4>
                            <p>Be specific and imagine you're asking a question to another person</p>
                            <input type="text" id="ask-ques-title"
                                onChange={(e) => {
                                    setquestiontitle(e.target.value);
                                }} placeholder='e.g. Is there an R function for finding the index of an element in a vector?' />
                        </label>
                        <label htmlFor="ask-ques-body">
                            <h4>Body</h4>
                            <p>Include all the information someone would need to answer your question</p>
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
                            <h4>Tags</h4>
                            <p>Add up to 5 tags to descibe what your question is about</p>
                            <input type="text" id='ask-ques-tags' onChange={(e) => {
                                setquestiontags(e.target.value.split(" "));
                            }}
                                placeholder='e.g. (xml typescript wordpress'
                            />
                        </label>
                    </div>
                    <input type="submit"
                        value={isSubmitting ? "Posting..." : "Review your question"}
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