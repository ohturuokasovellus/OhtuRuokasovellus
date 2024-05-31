import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Pressable } from 'react-native';
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

    const username = props.user.username;
    const restaurantId = props.user.restaurantId;
    const isRestaurantUser = restaurantId !== null;

    return (
        <View>
            <Text style={styles.welcomeText}>
                {t('WELCOME')}, {username}
            </Text>
            {isRestaurantUser ? (
                <>
                    <Text style={styles.welcomeText}>
                        {t('YOU_ARE_LOGGED_AS_RESTAURANT_USER')}
                    </Text>
                    <Pressable style={styles.button} title='Add user' onPress={
                        () => navigate('/add-users')
                    }>
                        <Text style={styles.buttonText}>{t('ADD_USER')}</Text>
                    </Pressable>
                    <Pressable style={styles.button} title='restaurant page'
                        onPress={
                            () => navigate(
                                `/restaurant/${restaurantId}`
                            )
                        }>
                        <Text style={styles.buttonText}>
                            {t('RESTAURANT_PAGE')}
                        </Text>
                    </Pressable>
                </>
            ) : null}
            {surveyUrl && (
                <Survey surveyUrl={surveyUrl}/>
            )}
        </View>
    );
};

export default Home;
