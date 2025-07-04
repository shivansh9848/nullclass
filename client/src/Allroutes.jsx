import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import Askquestion from './pages/Askquestion/Askquestion.jsx'
import Auth from './pages/Auth/Auth.jsx'
import ForgotPassword from './pages/Auth/ForgotPassword.jsx'
import ForgotPasswordEmail from './pages/Auth/ForgotPasswordEmail.jsx'
import ForgotPasswordSMS from './pages/Auth/ForgotPasswordSMS.jsx'
import ResetPassword from './pages/Auth/ResetPassword.jsx'
import Question from './pages/Question/Question.jsx'
import Displayquestion from './pages/Question/Displayquestion.jsx'
import Tags from './pages/Tags/Tags.jsx'
import Users from './pages/Users/Users.jsx'
import Userprofile from './pages/Userprofile/Userprofile.jsx'
import PublicSpace from './pages/PublicSpace/PublicSpace.jsx'
import Leaderboard from './pages/Leaderboard/LeaderboardPage.jsx'
import LoginHistory from './Comnponent/LoginHistory/LoginHistory.jsx'
import ErrorBoundary from './Comnponent/ErrorBoundary/ErrorBoundary.jsx'

function Allroutes({ slidein, handleslidein }) {
    return (
        <Routes>
            <Route path='/' element={<Home slidein={slidein} handleslidein={handleslidein} />} />
            <Route path='/Askquestion' element={<Askquestion />} />
            <Route path='/Auth' element={<Auth />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/forgot-password-email' element={<ForgotPasswordEmail />} />
            <Route path='/forgot-password-sms' element={<ForgotPasswordSMS />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
            <Route path='/Question' element={<Question slidein={slidein} handleslidein={handleslidein} />} />
            <Route path='/Question/:id' element={<Displayquestion slidein={slidein} handleslidein={handleslidein} />} />
            <Route path='/Tags' element={<Tags slidein={slidein} handleslidein={handleslidein} />} />
            <Route path='/Users' element={<Users slidein={slidein} handleslidein={handleslidein} />} />
            <Route path='/Users/:id' element={<Userprofile slidein={slidein} handleslidein={handleslidein} />} />
            <Route path='/PublicSpace' element={
                <ErrorBoundary>
                    <PublicSpace slidein={slidein} handleslidein={handleslidein} />
                </ErrorBoundary>
            } />
            <Route path='/Leaderboard' element={<Leaderboard slidein={slidein} handleslidein={handleslidein} />} />
            <Route path='/login-history' element={<LoginHistory />} />
        </Routes>
    )
}

export default Allroutes