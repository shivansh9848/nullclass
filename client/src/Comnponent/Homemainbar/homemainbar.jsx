import React from 'react'
import './Homemainbar.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Questionlist from './Questionlist'
function Homemainbar() {
    const { t } = useTranslation();
    const user = useSelector((state) => state.currentuserreducer)
    const location = useLocation();
    const navigate = useNavigate();
    const questionlist = useSelector((state) => state.questionreducer)
    // console.log(questionlist)
    const checkauth = () => {
        if (user === null) {
            alert(t('auth.loginToAskQuestion'))
            navigate("/Auth")
        } else {
            navigate("/Askquestion")
        }
    }
    return (
        <div className="main-bar">
            <div className="main-bar-header">
                {location.pathname === "/" ? (
                    <h1>{t('home.topQuestions')}</h1>
                ) : (
                    <h1>{t('home.allQuestions')}</h1>
                )}
                <button className="ask-btn" onClick={checkauth}>{t('home.askQuestions')}</button>
            </div>
            <div>
                {questionlist.data === null ? (
                    <h1>{t('common.loading')}</h1>
                ) : (
                    <>
                        <p>{questionlist.data.length} {t('home.questions')}</p>
                        <Questionlist questionlist={questionlist.data} />
                    </>
                )
                }</div>
        </div>
    )
}

export default Homemainbar