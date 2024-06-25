import axios from 'axios';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

import apiUrl from '../utils/apiUrl';

import createStyles from '../styles/styles';
import { Button } from './ui/Buttons';

/**
 * Renders a survey link
 * @param {string} surveyUrl - url of the survey;
 * @param {string} textIdentifier - identifier used in translations;
 * @returns {React.JSX.Element}
 */
const ExternalLink = ({ surveyUrl, textIdentifier } ) => {
    const {t} = useTranslation();

    const openLink = () => {
        Linking.openURL(surveyUrl);
    };

    const styles = createStyles();

    return (
        <Button
            styles={styles}
            onPress={ openLink }
            text={t(textIdentifier)}
            id='survey-link'
        />
    );
};

/**
 * Fetches a survely link from the backend
 * @param {Function} setsSurveyUrl - sets survey url;
 */
export const fetchSurveyUrl = async (setSurveyUrl) => {
    try {
        const res = await axios.get(
            `${apiUrl}/url/survey`
        );
        setSurveyUrl(res.data);
    } catch (error) {
        console.error('Survey not found');
    }
};

export default ExternalLink;
