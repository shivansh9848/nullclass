import React from 'react'
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar'
import Leaderboard from '../../Comnponent/Leaderboard/Leaderboard'

const LeaderboardPage = ({ slidein }) => {
    return (
        <div className="home-container-1">
            <Leftsidebar slidein={slidein} />
            <div className="home-container-2">
                <Leaderboard />
            </div>
        </div>
    )
}

export default LeaderboardPage
