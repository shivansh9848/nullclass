import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './FloatingActionButton.css'

const FloatingActionButton = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.currentuserreducer)

    const handleClick = () => {
        if (user === null) {
            alert("Login or signup to ask a question")
            navigate("/Auth")
        } else {
            navigate("/Askquestion")
        }
    }

    return (
        <button className="floating-action-button mobile-only" onClick={handleClick}>
            <span className="fab-icon">+</span>
            <span className="fab-text">Ask</span>
        </button>
    )
}

export default FloatingActionButton
