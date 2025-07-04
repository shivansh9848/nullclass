import React from "react";
import "./Rightsidebar.css";
import { useTranslation } from 'react-i18next';

const Widget = () => {
    const { t } = useTranslation();
    return (
        <div className="widget">
            <h4>{t('sidebar.helpfulTips')}</h4>
            <div className="right-sidebar-div-1">
                <div className="right-sidebar-div-2">
                    <p>💡</p>
                    <p>{t('sidebar.searchTip')}</p>
                </div>
                <div className="right-sidebar-div-2">
                    <p>🔖</p>
                    <p>{t('sidebar.tagTip')}</p>
                </div>
                <div className="right-sidebar-div-2">
                    <p>⭐</p>
                    <p>{t('sidebar.voteTip')}</p>
                </div>
            </div>
        </div>
    );
};

export default Widget;
