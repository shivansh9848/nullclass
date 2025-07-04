import React from 'react'
import { useTranslation } from 'react-i18next'
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar'
import './Users.css'
import Userslist from './Userslist'

const Users = ({ slidein }) => {
    const { t } = useTranslation();

    return (
        <div className="home-container-1">
            <Leftsidebar slidein={slidein} />
            <div className="home-container-2" style={{ marginTop: "30px" }}>
                <h1 style={{ fontWeight: "400" }}>{t('users.title')}</h1>
                <Userslist />
            </div>
        </div>
    )
}

export default Users