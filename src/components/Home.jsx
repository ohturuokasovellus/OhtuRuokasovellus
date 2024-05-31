import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';

import { useNavigate } from '../Router';
import { useTranslation } from 'react-i18next';
import Survey, { fetchSurveyUrl } from './Survey';

import createStyles from '../styles/layout';
import { Button } from './ui/Buttons';

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

    const styles = createStyles();

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>Home</Text>
                <Text style={styles.body}>
                    {t('WELCOME')}, {username}
                </Text>
                {isRestaurantUser ? (
                    <>
                        <Text style={styles.body}>
                            {t('YOU_ARE_LOGGED_AS_RESTAURANT_USER')}
                        </Text>
                        <Button
                            styles={styles}
                            onPress={() => navigate('/add-users')}
                            text={t('ADD_USER')}
                            id='add-users-button'
                        />
                        <Button
                            styles={styles}
                            onPress={
                                () => navigate(`/restaurant/${restaurantId}`)
                            }
                            text={t('RESTAURANT_PAGE')}
                            id='restaurant-page-button'
                        />
                    </>
                ) : null}
                {surveyUrl && (
                    <Survey surveyUrl={surveyUrl}/>
                )}
            </View>
        </ScrollView>
    
    );
};

export default Home;
