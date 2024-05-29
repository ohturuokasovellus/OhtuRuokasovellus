import axios from 'axios';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../styling/styles';
import { Link } from '../Router';

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

export const fetchSurveyUrl = async (setSurveyUrl, setLoading) => {
    try {
        const res = await axios.get(
            'http://localhost:8080/api/url/survey',
        );
        setSurveyUrl(res.data);
    } catch (error) {
        console.error('Survey not found');
    } finally {
        setLoading(false);
    }
};

export default Survey;