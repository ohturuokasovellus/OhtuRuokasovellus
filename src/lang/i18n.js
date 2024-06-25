import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import engl from './en.json';
import finn from './fi.json';

const resources = {
    eng: engl,
    fin: finn,
};

i18next
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read:
    // https://www.i18next.com/overview/configuration-options
    .init({
        compatibilityJSON: 'v3',
        resources,
        fallbackLng: 'eng',
        lng: 'fin', // default language to use.
        supportedLngs: ['fin', 'eng'],
        preload: ['fin', 'eng'],
        initImmediate: false
    });

export default {i18next};