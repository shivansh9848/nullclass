import React from 'react'
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar'
import Rightsidebar from '../../Comnponent/Rightsidebar/Rightsidebar'
import Homemainbar from '../../Comnponent/Homemainbar/homemainbar'
import FloatingActionButton from '../../Comnponent/FloatingActionButton/FloatingActionButton'
import '../../App.css'

const Home = ({ slidein }) => {
    return (
        <div className="home-container-1">
            <Leftsidebar slidein={slidein} />
            <div className="home-container-2">
                <Homemainbar />
                <Rightsidebar />
            </div>
            <FloatingActionButton />
        </div>
    )
}

export default Home