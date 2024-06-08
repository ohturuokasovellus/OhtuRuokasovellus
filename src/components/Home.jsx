import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator, Modal } from 'react-native';

import { useNavigate } from '../Router';
import { useTranslation } from 'react-i18next';
import Survey, { fetchSurveyUrl } from './Survey';
import axios from 'axios';
import apiUrl from '../utils/apiUrl';
import { getSession } from '../controllers/sessionController';

import createStyles from '../styles/styles';
import { Button, DeleteButton } from './ui/Buttons';

const Home = (props) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [surveyUrl, setSurveyUrl] = useState(null);
    const [meals, setMeals] = useState([]);
    const [mealToDelete, setMealToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const styles = createStyles();
    const userSession = getSession();

    const fetchMeals = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/meals/${props.user.restaurantId}`,
            );
            const responseMeals = response.data;
            setMeals(responseMeals);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!props.user) {
            navigate('/login');
            return;
        }
        fetchSurveyUrl(setSurveyUrl, setLoading);

        if (props.user.restaurantId) {
            fetchMeals();
        }
    }, [props.user, navigate]);

    if (!props.user || loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const confirmMealDeletion = async () => {
        if (!mealToDelete) return;

        try {
            await axios.put(
                `${apiUrl}/meals/delete/${mealToDelete}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${userSession.token}`,
                    },
                }
            );
            setMeals(meals.filter(meal => meal.meal_id !== mealToDelete));
        } catch (err) {
            console.error(err);
        }
        setMealToDelete(null);
        setShowModal(false);
    };

    const username = props.user.username;
    const restaurantId = props.user.restaurantId;
    const isRestaurantUser = restaurantId !== null;

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
                        <ScrollView style={styles.mealListContainer}>
                            <Text style={styles.h3}>
                                {t('MANAGE_RESTAURANT_MEALS')}
                            </Text>
                            {meals.length > 0 ? (
                                meals.map((meal) => (
                                    <View key={meal.meal_id} 
                                        style={styles.mealContainer}
                                    >
                                        <View style={styles.mealContent}>
                                            <Text style={styles.body}>
                                                {meal.meal_name}
                                            </Text>
                                            <DeleteButton
                                                styles={styles}
                                                onPress={() => {
                                                    setMealToDelete(
                                                        meal.meal_id
                                                    );
                                                    setShowModal(true);
                                                }
                                                }
                                                text={t('DELETE')}
                                                id={`delete-meal-button-
                                                    ${meal.meal_id}`}
                                            />
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.body}>
                                    {t('NO_MEALS')}
                                </Text>
                            )}
                        </ScrollView>
                    </>
                ) : null}
                {surveyUrl && (
                    <Survey surveyUrl={surveyUrl}/>
                )}
            </View>
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            {t('CONFIRM_DELETE')}
                        </Text>
                        <View style={styles.modalButtons}>
                            <Button styles={styles} text={t('CANCEL')}
                                onPress={() => setShowModal(false)}
                            />
                            <DeleteButton styles={styles}
                                onPress={confirmMealDeletion}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    
    );
};


export default Home;
