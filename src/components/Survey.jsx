import axios from 'axios';
import { Text, View, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../styling/styles';
import apiUrl from '../utils/apiUrl';

/**
 * Renders a survey link
 * @param {string} surveyUrl - url of the survey;
 * @returns {React.JSX.Element}
 */
const Survey = ({ surveyUrl } ) => {
    const {t} = useTranslation();

    const openLink = () => {
        Linking.openURL(surveyUrl);
    };

    return (
        <View style={ styles.surveyButton }>
            <TouchableOpacity onPress={ openLink }>
                <Text style={ styles.buttonText }>
                    {t('SURVEY')}
                </Text>
            </TouchableOpacity>
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