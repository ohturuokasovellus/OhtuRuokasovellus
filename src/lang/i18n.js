

import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import engl from './en.json';
import finn from './fi.json';

const resources = {
    eng: engl,
    fin: finn,
};

// Function to get the stored language or default to 'fin'
async function getStoredLanguage() {
    try {
        const savedLanguage = await AsyncStorage
            .getItem('i18nextLanguage');
        // Default to 'fin' if no language is saved
        return savedLanguage || 'fin'; 
    } catch (error) {
        console.error('Failed to load the language from storage', error);
        return 'fin'; // Default to 'fin' in case of error
    }
}

// Initialize i18next with the stored language
void (async () => {
    const language = await getStoredLanguage();
    void i18next
        .use(initReactI18next)
        .init({
            compatibilityJSON: 'v3',
            resources,
            fallbackLng: 'eng',
            lng: language,
            supportedLngs: ['fin', 'eng'],
            preload: ['fin', 'eng'],
            initImmediate: false
        });
})();

export default i18next;
