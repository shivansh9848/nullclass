import React from 'react'
import './MobileOverlay.css'

const MobileOverlay = ({ show, onClick }) => {
    return (
        <div
            className={`mobile-overlay ${show ? 'show' : ''}`}
            onClick={onClick}
        />
    )
}

export default MobileOverlay
