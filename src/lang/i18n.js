import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import engl from './en.json';
import finn from './fi.json';

const resources = {
    eng: engl,
    fin: finn,
};
// eslint-disable-next-line no-undef
// const urlParams = new URLSearchParams(window.location.search);
// const languageFromURL = urlParams.get('lng');
// const defaultLanguage = languageFromURL === 'eng' ? 'eng' : 'fin';

i18next
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read:
    // https://www.i18next.com/overview/configuration-options
    .init({
        compatibilityJSON: 'v3',
        resources,
        fallbackLng: 'fin',
        lng: 'eng', // default language to use.
        supportedLngs: ['fin', 'eng'],
        detection: {
            order: ['queryString', 'cookie'],
        },
        preload: ['fin', 'eng'],
        initImmediate: false
    });

export default {i18next};