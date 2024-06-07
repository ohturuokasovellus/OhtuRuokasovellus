import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';

import { useNavigate } from '../Router';
import { useTranslation } from 'react-i18next';
import Survey, { fetchSurveyUrl } from './Survey';
import axios from 'axios';
import apiUrl from '../utils/apiUrl';
import { getSession } from '../controllers/sessionController';

import createStyles from '../styles/styles';
import { Button } from './ui/Buttons';

const Home = (props) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [surveyUrl, setSurveyUrl] = useState(null);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const styles = createStyles();
    const userSession = getSession();

    const username = props.user.username;
    const restaurantId = props.user.restaurantId;
    const isRestaurantUser = restaurantId !== null;

    const fetchMeals = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/meals/${restaurantId}`,
            );
            const responseMeals = response.data;
            console.log(responseMeals);
            setMeals(responseMeals);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!props.user) {
            navigate('/login');
        } else {
            fetchSurveyUrl(setSurveyUrl, setLoading);
        }
        if (isRestaurantUser) {
            fetchMeals();
        }
    }, [props.user, navigate]);

    if (!props.user || loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const deleteMeal = async (mealId) => {
        try {
            await axios.delete(`${apiUrl}/meals/delete/${mealId}`);
            // setMeals(meals.filter(meal => meal.id !== mealId));
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>{t('HOME')}</Text>
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
                        <View>
                            <Text style={styles.h2}>
                                {t('MANAGE_RESTAURANT_MEALS')}
                            </Text>
                            {meals.length > 0 ? (
                                meals.map((meal) => (
                                    <View key={meal.id} style={styles.mealItem}>
                                        <Text style={styles.mealName}>
                                            {meal.meal_name}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.body}>
                                    {t('NO_MEALS_AVAILABLE')}
                                </Text>
                            )}
                        </View>
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
