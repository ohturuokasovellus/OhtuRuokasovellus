import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Modal } from 'react-native';
import { 
    Button, DeleteButton, CancelButton, ButtonVariant
} from './ui/Buttons';
import { Input } from './ui/InputFields';

import { useTranslation } from 'react-i18next';
import createStyles from '../styles/styles';

import axios from 'axios';
import apiUrl from '../utils/apiUrl';

const RestaurantEditContainer = ({
    styles, restaurantUsers, selectedRestaurant, setSelectedRestaurant,
    userToAdd, setUserToAdd, setShowModal
}) => {
    const {t} = useTranslation();

    return (
        <View>
            <Text style={styles.h3}>
                {t('MANAGE_RESTAURANT')}{' '}{selectedRestaurant[0]}
            </Text>
            <View style={styles.mealContainer}>
                <Text style={styles.h5}>
                    {t('RESTAURANT_USERS')}{':'}
                </Text>
                {restaurantUsers.length > 0 ? (
                    restaurantUsers.map((user, index) => (
                        <View key={index} style={styles.mealContent}>
                            <Text style={styles.body}>{user.username}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.body}>{t('NO_USERS')}</Text>
                )}
                <Text style={styles.h4}>
                    {t('ADD_USERS_BY_USERNAME')}
                </Text>
                <Input
                    styles={styles}
                    placeholder={t('ENTER_USERNAME')}
                    value={userToAdd}
                    onChangeText={setUserToAdd}
                />
                <ButtonVariant
                    styles={styles}
                    onPress={() => setShowModal(true)}
                    text={t('ADD_USER')}
                />
            </View>
            <Button
                styles={styles}
                onPress={() => setSelectedRestaurant(null)}
                text={t('BACK_TO_RESTAURANTS')}
            />
        </View>
    );
};

const AdminPanel = ({ user }) => {
    const {t} = useTranslation();
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantUsers, setRestaurantUsers] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [restaurantToDelete, setRestaurantToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userToAdd, setUserToAdd] = useState('');

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


    const handleEditPress = ({ name, restaurantId }) => {
        setSelectedRestaurant([restaurantId, name]);
        fetchRestaurantUsers(restaurantId);
    };

    const confirmRestaurantDeletion = async () => {
        if (!restaurantToDelete) return;

        try {
            await axios.delete(
                `${apiUrl}/delete/restaurant/${restaurantToDelete}`,
                { headers }
            );
            setRestaurants(
                restaurants.filter(
                    restaurant => restaurant.restaurantId !== restaurantToDelete
                )
            );
        } catch (err) {
            console.error(err);
        }
        setRestaurantToDelete(null);
        setShowModal(false);
    };

    const addUserToRestaurant = async () => {
        try {
            await axios.post(
                `${apiUrl}/restaurant/${selectedRestaurant[0]}/addUser`,
                { userToAdd },
                { headers }
            );
            fetchRestaurantUsers(selectedRestaurant[0]);
            setUserToAdd('');
        } catch (err) {
            console.error(err);
        }
    };

    const deleteRestaurantButtonId = (index) => 
        `delete-restaurant-button-${index}`;

    const RestaurantListContainer = () => (
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
                                        () => handleEditPress(restaurant)
                                    }
                                    text={t('EDIT')}
                                    id={`edit-button-${index}`}
                                />
                                <DeleteButton
                                    styles={styles}
                                    onPress={() => {
                                        setRestaurantToDelete(
                                            restaurant.restaurantId
                                        );
                                        setShowModal(true);
                                    }}
                                    text={t('DELETE')}
                                    id={deleteRestaurantButtonId(index)}
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
    );

    

    const ConfirmationPopUp = (
        { confirmMessage, handleConfirmation, isDelete }
    ) => {
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
                            {t(confirmMessage)}
                        </Text>
                        <View style={styles.modalButtonContainer}>
                            <CancelButton styles={styles}
                                onPress={() => setShowModal(false)}
                                id="cancel-button"
                            />
                            {isDelete ? (
                                <DeleteButton styles={styles}
                                    onPress={handleConfirmation}
                                    id="confirm-delete-button"
                                />
                            ): (
                                <Button
                                    styles={styles}
                                    onPress={handleConfirmation}
                                    text={t('CONFIRM')}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                {selectedRestaurant ? (
                    <View>
                        <RestaurantEditContainer
                            styles={styles}
                            restaurantUsers={restaurantUsers}
                            selectedRestaurant={selectedRestaurant}
                            setSelectedRestaurant={setSelectedRestaurant}
                            userToAdd={userToAdd}
                            setUserToAdd={setUserToAdd}
                            setShowModal={setShowModal}
                        />
                        <ConfirmationPopUp
                            confirmMessage={'ADD_USER'}
                            handleConfirmation={addUserToRestaurant}
                            isDelete={false}
                        />
                    </View>
                ) : (
                    <View>
                        <RestaurantListContainer />
                        <ConfirmationPopUp
                            confirmMessage={'CONFIRM_DELETE'}
                            handleConfirmation={confirmRestaurantDeletion}
                            isDelete={true}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default AdminPanel;