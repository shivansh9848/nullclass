import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Askquestion from './pages/Askquestion/Askquestion'
import Auth from './pages/Auth/Auth'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ForgotPasswordEmail from './pages/Auth/ForgotPasswordEmail'
import ForgotPasswordSMS from './pages/Auth/ForgotPasswordSMS'
import ResetPassword from './pages/Auth/ResetPassword'
import Question from './pages/Question/Question'
import Displayquestion from './pages/Question/Displayquestion'
import Tags from './pages/Tags/Tags'
import Users from './pages/Users/Users'
import Userprofile from './pages/Userprofile/Userprofile'
import PublicSpace from './pages/PublicSpace/PublicSpace'
import Leaderboard from './pages/Leaderboard/LeaderboardPage'
import LoginHistory from './Comnponent/LoginHistory/LoginHistory'
import ErrorBoundary from './Comnponent/ErrorBoundary/ErrorBoundary'

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