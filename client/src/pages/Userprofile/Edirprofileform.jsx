import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { updateprofile } from '../../action/users'
import './Userprofile.css'

const Edirprofileform = ({ currentuser, setswitch }) => {
    const { t } = useTranslation();
    const [name, setname] = useState(currentuser?.result?.name)
    const [about, setabout] = useState(currentuser?.result?.about)
    const [tags, settags] = useState([])
    const dispatch = useDispatch()

    const handlesubmit = (e) => {
        e.preventDefault()
        if (tags[0] === '' || tags.length === 0) {
            alert(t('profile.updateTagsField'))
        } else {
            dispatch(updateprofile(currentuser?.result?._id, { name, about, tags }))
        }
        setswitch(false)
    }

    return (
        <div>
            <h1 className="edit-profile-title">{t('profile.editYourProfile')}</h1>
            <h2 className='edit-profile-title-2'>{t('profile.publicInformation')}</h2>
            <form className="edit-profile-form" onSubmit={handlesubmit}>
                <label htmlFor="name">
                    <h3>{t('profile.displayName')}</h3>
                    <input type="text" value={name} onChange={(e) => setname(e.target.value)} />
                </label>
                <label htmlFor="about">
                    <h3>{t('profile.aboutMe')}</h3>
                    <textarea name="" id="about" cols="30" rows="10" value={about} onChange={(e) => setabout(e.target.value)}></textarea>
                </label>
                <label htmlFor="tags">
                    <h3>{t('profile.watchedTags')}</h3>
                    <p>{t('profile.addTagsDescription')}</p>
                    <input
                        type="text"
                        id="tags"
                        onChange={(e) => settags(e.target.value.split(" "))}
                    />
                </label>
                <br />
                <input type="submit" value={t('profile.saveProfile')} className='user-submit-btn' />
                <button type='button' className='user-cancel-btn' onClick={() => setswitch(false)}>{t('common.cancel')}</button>
            </form>
        </div>
    )
}

export default Edirprofileform