import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Modal } from 'react-native';

import { useNavigate } from '../Router';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import apiUrl from '../utils/apiUrl';
import { getSession } from '../controllers/sessionController';

import createStyles from '../styles/styles';
import { Button, CancelButton, DeleteButton } from './ui/Buttons';

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
                `${apiUrl}/meals/${userSession.restaurantId}`,
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
            <ScrollView style={styles.mealListContainer}>
                <Text style={styles.h3}>
                    {t('MANAGE_RESTAURANT_MEALS')}
                </Text>
                {meals.length > 0 ? (
                    meals.map((meal, index) => (
                        <View
                            key={meal.meal_id} 
                            style={styles.mealContainer}
                        >
                            <View style={styles.mealContent}>
                                <Text style={styles.body}>
                                    {meal.meal_name}
                                </Text>
                                <View 
                                    style={styles.managementButtons}
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

    const DeleteMealPopUp = () => {
        return (
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
                        <View style={styles.modalButtonContainer}>
                            <CancelButton styles={styles}
                                onPress={() => setShowModal(false)}
                                id="cancel-button"
                            />
                            <DeleteButton styles={styles}
                                onPress={confirmMealDeletion}
                                id="confirm-delete-button"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View>
            <MealListContainer />
            <DeleteMealPopUp/>
        </View>
    );
};

export default MealDeletion;
