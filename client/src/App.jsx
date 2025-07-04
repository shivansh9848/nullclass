import { fetchallusers } from "./action/users";
import "./App.css";
import { useEffect, useState } from "react";
import Navbar from "./Comnponent/Navbar/Navbar";
import { BrowserRouter as Router } from "react-router-dom";
import Allroutes from "./Allroutes";
import { useDispatch } from "react-redux";
import { fetchallquestion } from "./action/question";
import MobileOverlay from "./Comnponent/MobileOverlay/MobileOverlay";
import "./i18n"; // Import i18n configuration

function App() {
    const [slidein, setslidein] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
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
