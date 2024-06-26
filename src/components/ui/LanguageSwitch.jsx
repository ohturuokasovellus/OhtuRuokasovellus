import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavButton } from './Buttons';

const LanguageSwitch = ({ styles }) => {
    const { i18n } = useTranslation();
    const [isEnglish, setIsEnglish] = useState(i18n.language === 'eng');

    const toggleLang = () => {
        const newLanguage = isEnglish ? 'fin' : 'eng';
        setIsEnglish(!isEnglish);
        void i18n.changeLanguage(newLanguage);
        // eslint-disable-next-line no-undef
        localStorage.setItem('i18nextLng', newLanguage);
    };

    return (
        <NavButton
            styles={styles}
            onPress={toggleLang}
            text={isEnglish ? 'Suomeksi' : 'In English'}
            id='language-toggle'
        />
    );
};

export default LanguageSwitch;
