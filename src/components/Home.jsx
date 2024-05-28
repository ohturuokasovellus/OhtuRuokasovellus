import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Pressable } from 'react-native';
import { useNavigate } from '../Router';
import { styles } from '../styling/styles';
import { useTranslation } from 'react-i18next';

const Home = (props) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [surveyUrl, setSurveyUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!props.user) {
            navigate('/login');
        } else {
            fetchSurveyUrl();
        }
    }, [props.user, navigate]);
    
    const fetchSurveyUrl = async () => {
        try {
            const res = await axios.get(
                'http://localhost:8080/api/survey-url'
            );
            setSurveyUrl(res.data.url);
        } catch (error) {
            console.error('Survey not found');
        } finally {
            setLoading(false);
        }
    };

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
                <View style={ styles.button }>
                    <Pressable title="Survey"
                        onPress={() => navigate('/restaurant/1')}>
                        <Text style={ styles.buttonText }>
                            {t('SURVEY')}
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

export default Home;
