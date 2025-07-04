import React from 'react'
import { useTranslation } from 'react-i18next'
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar'
import Taglist from './Taglist'
import './Tags.css'
import { tagsList } from './tagslist'

const Tags = ({ slidein }) => {
    const { t } = useTranslation();

    return (
        <div className="home-container-1">
            <Leftsidebar slidein={slidein} />
            <div className="home-container-2">
                <h1 className="tags-h1">
                    {t('tags.title')}
                </h1>
                <p className="tags-p">{t('tags.description')}</p>
                <p className="tags-p">
                    {t('tags.rightTagsDescription')}
                </p>
                <div className="tags-list-container">
                    {tagsList.map((tag, index) => (
                        <Taglist tag={tag} key={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Tags