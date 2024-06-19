import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Button, ButtonVariant } from './ui/Buttons';

import { useTranslation } from 'react-i18next';
import createStyles from '../styles/styles';

import axios from 'axios';
import apiUrl from '../utils/apiUrl';

const AdminPanel = ({ user }) => {
    const {t} = useTranslation();
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantUsers, setRestaurantUsers] = useState([]);
    const styles = createStyles();

    const headers = {
        Authorization: `Bearer ${user.token}`,
    };

    const fetchRestaurants = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/restaurants/`,
                { headers }
            );
            const responseRestaurants = response.data;
            console.log(responseRestaurants);
            setRestaurants(responseRestaurants);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRestaurantUsers = async (restaurantId) => {
        try {
            const response = await axios.get(
                `${apiUrl}/restaurant/${restaurantId}/users/`,
                { headers }
            );
            const responseUsers = response.data;
            console.log(responseUsers);
            setRestaurantUsers(responseUsers);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user.isAdmin) {
            fetchRestaurants();
        }
    }, []);


    const handleEditPress = (restaurantId) => {
        fetchRestaurantUsers(restaurantId);
    };

    const RestaurantListContainer = () => {
        return (
            <ScrollView style={styles.background}>
                <View style={styles.container}>
                    <ScrollView style={styles.mealListContainer}>
                        <Text style={styles.h3}>
                            {t('MANAGE_RESTAURANTS')}
                        </Text>
                        {restaurants.length > 0 ? (
                            restaurants.map((restaurant, index) => (
                                <View
                                    key={restaurant.restaurantId} 
                                    style={styles.mealContainer}
                                >
                                    <View style={styles.mealContent}>
                                        <Text style={styles.body}>
                                            {restaurant.name}
                                        </Text>
                                        <View 
                                            style={styles.managementButtons}
                                        >
                                            <Button
                                                styles={styles}
                                                onPress={
                                                    () => handleEditPress(
                                                        restaurant.restaurantId
                                                    )
                                                }
                                                text={t('EDIT')}
                                                id={`edit-button-${index}`}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.body}>
                                {t('NO_RESTAURANTS')}
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </ScrollView>

        );
    };

    return (
        <View>
            <RestaurantListContainer />
        </View>
    );
};

export default AdminPanel;