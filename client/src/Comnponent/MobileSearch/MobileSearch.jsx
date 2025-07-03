import React, { useState } from 'react'
import './MobileSearch.css'
import search from '../../assets/search-solid.svg'

const MobileSearch = ({ show, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle search logic here
        console.log('Search query:', searchQuery)
        onClose()
    }

    if (!show) return null

    return (
        <div className="mobile-search-overlay">
            <div className="mobile-search-container">
                <div className="mobile-search-header">
                    <h3>Search Questions</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="mobile-search-form">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <img src={search} alt="search" className="search-icon" />
                    </div>
                    <button type="submit" className="search-submit-btn">Search</button>
                </form>
            </div>
        </div>
    )
}

export default MobileSearch
