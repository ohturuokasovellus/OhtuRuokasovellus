import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';

import { useNavigate } from '../Router';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import apiUrl from '../utils/apiUrl';
import { getSession } from '../controllers/sessionController';

import createStyles from '../styles/styles';
import { Button, DeleteButton } from './ui/Buttons';
import { DeletePopUp } from './ui/PopUp';

const MealDeletion = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [meals, setMeals] = useState([]);
    const [mealToDelete, setMealToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const styles = createStyles();
    const userSession = getSession();
    const deleteMealButtonId = (index) => `delete-meal-button-${index}`;
    const exportMealQrButtonId = (index) => `export-meal-qr-button-${index}`;

    const fetchMeals = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/less-info-meals/${userSession.restaurantId}`,
            );
            const responseMeals = response.data;
            setMeals(responseMeals);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (userSession.restaurantId) {
            fetchMeals();
        }
    }, [navigate]);

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

    const handleEditPress = (mealId) => {
        navigate(`/edit-meal/${mealId}`);
    };

    const MealListContainer = () => {
        return (
            <ScrollView style={styles.scrollViewContainer}>
                <Text style={styles.h3}>
                    {t('MANAGE_RESTAURANT_MEALS')}
                </Text>
                {meals.length > 0 ? (
                    meals.map((meal, index) => (
                        <View
                            key={meal.meal_id} 
                            style={styles.cardContainer}
                        >
                            <View style={styles.flexRowContainer}>
                                <Text style={styles.body}>
                                    {meal.meal_name}
                                </Text>
                                <View 
                                    style={styles.flexButtonContainer}
                                >
                                    <Button
                                        styles={styles}
                                        onPress={() => handleEditPress(
                                            meal.meal_id
                                        )}
                                        text={t('EDIT')}
                                        id={`edit-button-${index}`}
                                    />
                                    <DeleteButton
                                        styles={styles}
                                        onPress={() => {
                                            setMealToDelete(meal.meal_id);
                                            setShowModal(true);
                                        }}
                                        text={t('DELETE')}
                                        id={deleteMealButtonId(index)}
                                    />
                                    <Button
                                        styles={styles}
                                        onPress={() => {
                                            navigate('/meal-qr/'+
                                                `${meal.purchase_code}`);}}
                                        text={
                                            t('DOWNLOAD_QR')}
                                        id={exportMealQrButtonId(index)}
                                    />
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.body}>
                        {t('NO_MEALS')}
                    </Text>
                )}
            </ScrollView>

        );
    };

    return (
        <View>
            <MealListContainer />
            <DeletePopUp
                showModal={showModal}
                setShowModal={setShowModal}
                onDelete={confirmMealDeletion}
            />
        </View>
    );
};

export default MealDeletion;
