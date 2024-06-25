import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavButton } from './Buttons';

const LanguageSwitch = ({ styles }) => {
    const { i18n } = useTranslation();
    const [isEnglish, setIsEnglish] = useState(i18n.language === 'eng');

    const toggleLang = async () => {
        const newLanguage = isEnglish ? 'fin' : 'eng';
        setIsEnglish(!isEnglish);
        i18n.changeLanguage(newLanguage);
        try {
            await AsyncStorage.setItem('i18nextLanguage', newLanguage);
        } catch (error) {
            console.log(error);
        }
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
