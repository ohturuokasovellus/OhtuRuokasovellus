import axios from 'axios';
import { Text, View, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from '../styling/styles';
import { useNavigate } from '../Router';

const Survey = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    return (
        <View style={ styles.surveyButton }>
            <Pressable title="Survey"
                onPress={() => navigate('/restaurant/1')}>
                <Text style={ styles.buttonText }>
                    {t('SURVEY')}
                </Text>
            </Pressable>
        </View>
    );
};

export const fetchSurveyUrl = async (setSurveyUrl, setLoading) => {
    try {
        const res = await axios.get(
            'http://localhost:8080/api/url',
            { params: { urlName: 'survey_url' } }
        );
        setSurveyUrl(res.data.url);
    } catch (error) {
        console.error('Survey not found');
    } finally {
        setLoading(false);
    }
};

export default Survey;