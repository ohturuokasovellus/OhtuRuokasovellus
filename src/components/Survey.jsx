import axios from 'axios';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../styling/styles';
import { Link } from '../Router';
import apiUrl from '../utils/apiUrl';

/**
 * Renders a survey link
 * @param {string} surveyUrl - url of the survey;
 * @returns {React.JSX.Element}
 */
const Survey = ({ surveyUrl } ) => {
    const {t} = useTranslation();

    return (
        <View style={ styles.surveyButton }>
            <Link title="Survey" to={surveyUrl}>
                <Text style={ styles.buttonText }>
                    {t('SURVEY')}
                </Text>
            </Link>
        </View>
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