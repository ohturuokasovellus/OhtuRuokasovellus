import axios from 'axios';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

import apiUrl from '../utils/apiUrl';

import createStyles from '../styles/styles';
import { Button } from './ui/Buttons';

/**
 * Renders a survey link
 * @param {string} surveyUrl - url of the survey;
 * @returns {React.JSX.Element}
 */
const Survey = ({ surveyUrl } ) => {
    const {t} = useTranslation();

    const openLink = () => {
        void Linking.openURL(surveyUrl);
    };

    const styles = createStyles();

    return (
        <Button
            styles={styles}
            onPress={ openLink }
            text={t('SURVEY')}
            id='survey-link'
        />
    );
};

/**
 * Fetches a survely link from the backend
 * @param {Function} setsSurveyUrl - sets survey url;
 * @param {Function} setLoading - manages loading indicator;
 */
export const fetchSurveyUrl = async (setSurveyUrl, setLoading) => {
    try {
        const res = await axios.get(
            `${apiUrl}/url/survey`
        );
        setSurveyUrl(res.data);
    } catch (error) {
        console.error('Survey not found');
    } finally {
        setLoading(false);
    }
};

export default Survey;
