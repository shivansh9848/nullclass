import React, { useState } from 'react'
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Avatar from '../../Comnponent/Avatar/Avatar'
import Editprofileform from './Edirprofileform'
import Profilebio from './Profilebio'
import PointsTransfer from '../../Comnponent/PointsTransfer/PointsTransfer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBirthdayCake, faPen, faCoins, faHistory } from '@fortawesome/free-solid-svg-icons'
import './Userprofile.css'

const Userprofile = ({ slidein }) => {
    const { t } = useTranslation();
    const { id } = useParams()
    const navigate = useNavigate()
    const [Switch, setswitch] = useState(false);
    const [showPointsTransfer, setShowPointsTransfer] = useState(false);

    const users = useSelector((state) => state.usersreducer.users || [])
    const currentuser = useSelector((state) => state.currentuserreducer)

    // Get the profile
    let currentprofile = null;

    if (currentuser?.result?._id === id) {
        // Viewing own profile - always use current user data
        currentprofile = {
            ...currentuser.result,
            // Ensure we have default values for missing fields
            points: currentuser.result.points || 0,
            joinedon: currentuser.result.joinedon || new Date(),
            name: currentuser.result.name || 'User',
            email: currentuser.result.email || '',
        };
    } else {
        // Viewing someone else's profile - get from users array
        currentprofile = users.find((user) => user._id === id);
    }

    // Only show "user not found" for other users, not for your own profile
    if (!currentprofile) {
        return (
            <div className="home-container-1">
                <Leftsidebar slidein={slidein} />
                <div className="home-container-2">
                    <section>
                        <div className="user-details-container">
                            <div className="loading-message">
                                <h2>{t('profile.userNotFound')}</h2>
                                <p>{t('profile.userNotFoundDesc')}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }

    return (
        <div className="home-container-1">
            <Leftsidebar slidein={slidein} />
            <div className="home-container-2">
                <section>
                    <div className="user-details-container">
                        <div className="user-details">
                            <Avatar backgroundColor="purple" color="white" fontSize="50px" px="40px" py="30px">
                                {currentprofile?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <div className="user-name">
                                <h1>{currentprofile?.name}</h1>
                                <div className="user-meta">
                                    <p>
                                        <FontAwesomeIcon icon={faBirthdayCake} /> {t('profile.joined')}{" "}
                                        {moment(currentprofile?.joinedon).fromNow()}
                                    </p>
                                    <p className="user-points">
                                        <FontAwesomeIcon icon={faCoins} /> {currentprofile?.points || 0} {t('profile.points')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="profile-actions">
                            {currentuser?.result?._id === id && (
                                <>
                                    <button
                                        className="edit-profile-btn"
                                        type='button'
                                        onClick={() => setswitch(true)}
                                    >
                                        <FontAwesomeIcon icon={faPen} /> {t('profile.editProfile')}
                                    </button>
                                    <button
                                        className="login-history-btn"
                                        type='button'
                                        onClick={() => navigate('/login-history')}
                                    >
                                        <FontAwesomeIcon icon={faHistory} /> {t('profile.loginHistory')}
                                    </button>
                                </>
                            )}
                            {currentuser?.result?._id !== id && currentuser?.result && (
                                <button
                                    className="transfer-points-btn"
                                    type='button'
                                    onClick={() => setShowPointsTransfer(true)}
                                >
                                    <FontAwesomeIcon icon={faCoins} /> {t('profile.transferPoints')}
                                </button>
                            )}
                        </div>
                    </div>
                    <>
                        {Switch ? (
                            <Editprofileform currentuser={currentuser} setswitch={setswitch} />
                        ) : (
                            <Profilebio currentprofile={currentprofile} />
                        )}
                    </>
                </section>
            </div>

            {showPointsTransfer && (
                <PointsTransfer
                    currentUser={currentuser?.result}
                    onClose={() => setShowPointsTransfer(false)}
                />
            )}
        </div>
    )
}

export default Userprofile