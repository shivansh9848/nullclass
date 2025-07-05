import { fetchallusers } from "./action/users";
import "./App.css";
import { useEffect, useState } from "react";
import Navbar from "./Comnponent/Navbar/navbar.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import Allroutes from "./Allroutes";
import { useDispatch } from "react-redux";
import { fetchallquestion } from "./action/question";
import { setcurrentuser } from "./action/currentuser";
import MobileOverlay from "./Comnponent/MobileOverlay/MobileOverlay.jsx";
import "./i18n"; // Import i18n configuration

function App() {
    const [slidein, setslidein] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        // Initialize user from localStorage on app start
        const profile = localStorage.getItem("Profile");
        if (profile) {
            try {
                const parsedProfile = JSON.parse(profile);
                dispatch(setcurrentuser(parsedProfile));
            } catch (error) {
                console.error("Error parsing profile from localStorage:", error);
                localStorage.removeItem("Profile");
            }
        }

        dispatch(fetchallusers());
        dispatch(fetchallquestion());
    }, [dispatch]);

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setslidein(false);
        }
    }, []);

    const handleslidein = () => {
        if (window.innerWidth <= 768) {
            setslidein((state) => !state);
        }
    };

    // Close sidebar when clicking outside on mobile
    const handleOverlayClick = () => {
        if (window.innerWidth <= 768) {
            setslidein(false);
        }
    };

    return (
        <div className="App">
            <Router>
                <Navbar handleslidein={handleslidein} />
                <MobileOverlay
                    show={slidein && window.innerWidth <= 768}
                    onClick={handleOverlayClick}
                />
                <Allroutes slidein={slidein} handleslidein={handleslidein} />
            </Router>
        </div>
    );
}

export default App;
