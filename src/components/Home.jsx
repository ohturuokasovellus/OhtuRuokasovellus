import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useNavigate } from '../Router';
import { styles } from '../styling/styles';
import { useTranslation } from 'react-i18next';
import Survey, { fetchSurveyUrl } from './Survey';

const Home = (props) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [surveyUrl, setSurveyUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!props.user) {
            navigate('/login');
        } else {
            fetchSurveyUrl(setSurveyUrl, setLoading);
        }
    }, [props.user, navigate]);
    
    if (!props.user || loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Check if user is a restaurant owner
    const isRestaurantOwner = props.user.restaurantId !== null;

    return (
        <View>
            {isRestaurantOwner ? (
                <Text style={styles.welcomeText}>
                    {t('WELCOME')}, {t('RESTAURANT_OWNER')} 
                    {' '}{props.user.username}
                </Text>
            ) : (
                <Text style={styles.welcomeText}>
                    {t('WELCOME')}, {props.user.username}
                </Text>
            )}
            {surveyUrl && (
                <Survey surveyUrl={surveyUrl}/>
            )}
        </View>
    );
};

export default Home;
