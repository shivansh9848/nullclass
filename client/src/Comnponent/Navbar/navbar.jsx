import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from 'react-i18next'
import bars from '../../assets/bars-solid.svg'
import logo from '../../assets/logo.png';
import search from '../../assets/search-solid.svg'
import Avatar from '../Avatar/Avatar';
import MobileSearch from '../MobileSearch/MobileSearch';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import './navbar.css';
import { setcurrentuser } from '../../action/currentuser'
import { jwtDecode } from "jwt-decode"

function Navbar({ handleslidein }) {
    const { t } = useTranslation();
    var User = useSelector((state) => state.currentuserreducer)
    const [showMobileSearch, setShowMobileSearch] = useState(false)
    const [forceUpdate, setForceUpdate] = useState(0) // Add force update state
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handlelogout = () => {
        dispatch({ type: "LOGOUT" })
        navigate("/")
        dispatch(setcurrentuser(null))
    }

    useEffect(() => {
        try {
            const token = User?.token;
            if (token) {
                const decodedtoken = jwtDecode(token);
                if (decodedtoken.exp * 1000 < new Date().getTime()) {
                    handlelogout();
                    return;
                }
            }
        } catch (error) {
            console.error("Error in token validation:", error);
            handlelogout();
        }
    }, [User, forceUpdate]); // Added forceUpdate dependency

    // Force re-render when localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            setForceUpdate(prev => prev + 1);
        };

        window.addEventListener('storage', handleStorageChange);

        // Also check for Profile changes in localStorage periodically
        const interval = setInterval(() => {
            const profile = localStorage.getItem("Profile");
            if (profile && !User) {
                try {
                    const parsedProfile = JSON.parse(profile);
                    dispatch(setcurrentuser(parsedProfile));
                    setForceUpdate(prev => prev + 1);
                } catch (error) {
                    console.error("Error parsing profile:", error);
                }
            }
        }, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [User, dispatch]);

    return (
        <>
            <nav className="main-nav">
                <div className="navbar">
                    <button className="slide-in-icon" onClick={() => handleslidein()}>
                        <img src={bars} alt="bars" width='15' />
                    </button>
                    <div className="navbar-1">
                        <Link to='/' className='nav-item nav-logo'>
                            <img src={logo} alt="logo" />
                        </Link>
                        <form className="desktop-search">
                            <input type="text" placeholder={t('common.search')} />
                            <img src={search} alt="search" width='18' className='search-icon' />
                        </form>
                        <button
                            className="mobile-search-btn"
                            onClick={() => setShowMobileSearch(true)}
                        >
                            <img src={search} alt="search" width='18' />
                        </button>
                    </div>
                    <div className="navbar-2">
                        <LanguageSwitcher />
                        {User === null ? (
                            <Link to='/Auth' className='nav-item nav-links'>
                                {t('common.login')}
                            </Link>
                        ) : (
                            <>
                                <Avatar backgroundColor='#009dff' px='10px' py='7px' borderRadius='50%' color="white">
                                    <Link to={`/Users/${User?.result?._id}`} style={{ color: "white", textDecoration: "none" }}>
                                        {User.result.name.charAt(0).toUpperCase()}
                                    </Link>
                                </Avatar>
                                <button className="nav-tem nav-links" onClick={handlelogout}>{t('common.logout')}</button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <MobileSearch
                show={showMobileSearch}
                onClose={() => setShowMobileSearch(false)}
            />
        </>
    )
}

export default Navbar
