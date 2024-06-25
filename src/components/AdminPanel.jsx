import React, { useEffect, useState } from 'react';
import { useNavigate } from '../Router';
import { Text, View, ScrollView, Modal } from 'react-native';
import { 
    Button, DeleteButton, CancelButton, ButtonVariant
} from './ui/Buttons';
import { Input } from './ui/InputFields';
import ResearchData from  './ResearchData';

import { useTranslation } from 'react-i18next';
import createStyles from '../styles/styles';

import axios from 'axios';
import apiUrl from '../utils/apiUrl';

/**
 * Panel for admin users.
 * @param {Object} user
 * @returns {JSX.Element} 
 */
const AdminPanel = ({ userSession }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const styles = createStyles();
    let headers;
    
    if (userSession) {
        headers = {
            Authorization: `Bearer ${userSession.token}`
        };
    } else {
        navigate('/');
    }

    useEffect(() => {
        const verifyAdminStatus = async () => {
            
            try {
                const response = await axios.get(
                    `${apiUrl}/verify-admin-status`,
                    { headers }
                );
                if (!response.data.isAdmin) {
                    navigate('/');
                }
                setIsAdmin(true);
            } catch (err) {
                console.error(err);
                navigate('/');
            }
        };
        verifyAdminStatus();
    }, []);

    return (
        isAdmin ? (
            <ScrollView style={styles.background}>
                <View style={styles.container}>
                    <Text style={[styles.h2, { alignSelf: 'center' }]}>
                        {t('ADMIN_PANEL')}
                    </Text>
                    <ResearchData userSession={userSession}/>
                    {selectedRestaurant ? (
                        <RestaurantEditContainer
                            headers={headers}
                            styles={styles}
                            selectedRestaurant={selectedRestaurant}
                            setSelectedRestaurant={setSelectedRestaurant}
                        />
                    ): (
                        <View style={styles.container}>
                            <RestaurantListContainer
                                headers={headers}
                                styles={styles}
                                setSelectedRestaurant={setSelectedRestaurant}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>

        ): null
    );
};

/**
 * Restaurant list view.
 * @param {Object} headers authorization headers
 * @param {Object} styles
 * @param {Function} setSelectedRestaurant sets selected restaurant
 * @returns {JSX.Element} 
 */
const RestaurantListContainer = ({ headers, styles, setSelectedRestaurant
}) => {
    const {t} = useTranslation();
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantToDelete, setRestaurantToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchRestaurants = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/restaurants/`,
                { headers }
            );
            const responseRestaurants = response.data;
            setRestaurants(responseRestaurants);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);


    const handleEditPress = ({ name, restaurantId }) => {
        setSelectedRestaurant([restaurantId, name]);
    }; 

    const deleteRestaurantButtonId = (index) => 
        `delete-restaurant-button-${index}`;

    const confirmRestaurantDeletion = async () => {
        if (!restaurantToDelete) return;

        try {
            await axios.delete(
                `${apiUrl}/delete/restaurant/${restaurantToDelete[0]}`,
                { headers }
            );
            setRestaurants(
                restaurants.filter(
                    restaurant =>
                        restaurant.restaurantId !== restaurantToDelete[0]
                )
            );
        } catch (err) {
            console.error(err);
        }
        setRestaurantToDelete(null);
        setShowModal(false);
    };

    return (
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
                                        setRestaurantToDelete([
                                            restaurant.restaurantId,
                                            restaurant.name
                                        ]);
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
            <ConfirmationPopUp
                styles={styles}
                showModal={showModal}
                setShowModal={setShowModal}
                confirmMessage={t('CONFIRM_DELETE')}
                handleConfirmation={confirmRestaurantDeletion}
                isDelete={true}
            />
        </ScrollView>
    );
};

/**
 * Restaurant edit view.
 * @param {Object} headers authorization headers
 * @param {Object} styles
 * @param {List} selectedRestaurant id and name of restaurant
 * @param {Function} setSelectedRestaurant
 * @returns {JSX.Element} 
 */
const RestaurantEditContainer = ({
    headers, styles, selectedRestaurant, setSelectedRestaurant }) => {

    const {t} = useTranslation();
    const [restaurantUsers, setRestaurantUsers] = useState([]);
    const [userToAdd, setUserToAdd] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchRestaurantUsers = async (restaurantId) => {
        try {
            const response = await axios.get(
                `${apiUrl}/restaurant/${restaurantId}/users/`,
                { headers }
            );
            const responseUsers = response.data;
            setRestaurantUsers(responseUsers);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRestaurantUsers(selectedRestaurant[0]);
    }, []);

    const addUserToRestaurant = async () => {
        try {
            await axios.post(
                `${apiUrl}/restaurant/${selectedRestaurant[0]}/add-user`,
                { userToAdd },
                { headers }
            );
            fetchRestaurantUsers(selectedRestaurant[0]);
            setUserToAdd('');
            setSuccess(t('USER_ADDED'));
        } catch (err) {
            console.error(err);
            setError(t('USER_NOT_ADDED'));
        }
        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 5000);
        setShowModal(false);
    };

    return (
        <View>
            <Text style={styles.h3}>
                {t('MANAGE_RESTAURANT')}{' '}{selectedRestaurant[1]}
            </Text>
            <View style={styles.mealContainer}>
                <View style={{ padding: '10px'}}>
                    <Text style={styles.h5}>
                        {t('USERS_OF_RESTAURANT')}{':'}
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
                    <View style={{ padding: '10px'}}>
                        <Text style={styles.h4}>
                            {t('ADD_USERS_BY_USERNAME')}
                        </Text>
                        <Input
                            styles={styles}
                            placeholder={t('USERNAME')}
                            value={userToAdd}
                            onChangeText={setUserToAdd}
                            id="username-input"
                        />
                        <ButtonVariant
                            styles={styles}
                            onPress={userToAdd ? () => setShowModal(true)
                                : null
                            }
                            text={t('ADD_USER')}
                            id="attach-user-button"
                        />
                        {success ? (
                            <View>
                                <Text style={styles.success}>{success}</Text>
                            </View>
                        ): null}
                        {error ? (
                            <View>
                                <Text style={styles.error}>{error}</Text>
                            </View>
                        ): null}
                    </View>
                </View>
            </View>
            <Button
                styles={styles}
                onPress={() => setSelectedRestaurant(null)}
                text={t('GO_BACK')}
            />
            <ConfirmationPopUp
                styles={styles}
                showModal={showModal}
                setShowModal={setShowModal}
                confirmMessage={t('CONFIRM_USER_ADDITION')}
                handleConfirmation={addUserToRestaurant}
                isDelete={false}
            />
        </View>
    );
};

/**
 * Confirmation pop up.
 * @param {Object} styles
 * @param {Boolean} showModal true if activated
 * @param {String} confirmMessage confirmation message
 * @param {Function} handleConfirmation
 * @param {Boolean} isDelete confirmation context
 * @returns {JSX.Element} 
 */
const ConfirmationPopUp = (
    { styles, showModal, setShowModal, confirmMessage, handleConfirmation,
        isDelete }) => {
    const {t} = useTranslation();

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
                        {confirmMessage}
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
                                id="confirm-button"
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AdminPanel;