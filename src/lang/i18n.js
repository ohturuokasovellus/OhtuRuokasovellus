import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import engl from './en.json';
import finn from './fi.json';

const resources = {
    eng: engl,
    fin: finn,
};

const languageDetector = new LanguageDetector(null, {
    order: ['localStorage', 'navigator', 'cookie', 'queryString'],

    lookupLocalStorage: 'i18nextLng',
    lookupCookie: 'i18next',

    caches: ['localStorage', 'cookie']
});

i18next
    // pass the i18n instance to react-i18next.
    .use(languageDetector)
    .use(initReactI18next)
    // init i18next
    // for all options read:
    // https://www.i18next.com/overview/configuration-options
    .init({
        compatibilityJSON: 'v3',
        resources,
        fallbackLng: 'fin',
        // lng: 'eng', // default language to use.
        // supportedLngs: ['fin', 'eng'],
        detection: {
            order: ['localStorage', 'navigator', 'cookie', 'queryString'],
            caches: ['localStorage', 'cookie']
        },
        // preload: ['fin', 'eng'],
        // initImmediate: false
    });

export default {i18next};