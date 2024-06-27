import React, { useEffect, useState } from 'react';
import { useNavigate } from '../Router';
import { Text, View, ScrollView } from 'react-native';
import { 
    Button, DeleteButton, ButtonVariant
} from './ui/Buttons';
import { Input } from './ui/InputFields';
import ResearchData from  './ResearchData';
import { fetchSurveyUrl } from './Survey';

import { useTranslation } from 'react-i18next';
import createStyles from '../styles/styles';

import axios from 'axios';
import apiUrl from '../utils/apiUrl';
import { DeletePopUp, ConfirmationPopUp } from './ui/PopUp';

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
        void verifyAdminStatus();
    }, []);

    return (
        isAdmin ? (
            <ScrollView style={styles.background}>
                <View style={styles.container}>
                    <Text style={[styles.h2, { alignSelf: 'center' }]}>
                        {t('ADMIN_PANEL')}
                    </Text>
                    <ResearchData userSession={userSession}/>
                    <SurveyLinkEditContainer
                        headers={headers}
                        styles={styles}
                    />
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
 * View for updating survey link url.
 * @param {Object} headers authorization headers
 * @param {Object} styles
 * @returns {JSX.Element} 
 */
const SurveyLinkEditContainer = ({ headers, styles }) => {
    const {t} = useTranslation();
    const [newUrl, setNewUrl] = useState('');
    const [urlPlaceholder, setUrlPlaceholder] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        void fetchSurveyUrl(setUrlPlaceholder);
    }, []);

    const changeSurveyUrl = async () => {
        try {
            await axios.post(
                `${apiUrl}/url/change/survey`,
                { newUrl },
                { headers }
            );
            await fetchSurveyUrl(setUrlPlaceholder);
            setNewUrl('');
            setSuccess(t('SURVEY_LINK_UPDATED'));
        } catch (err) {
            console.error(err);
            setError(t('SURVEY_LINK_NOT_CHANGED'));
        }
        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 5000);
        setShowModal(false);
    };

    return (
        <View>
            <Text style={styles.h4}>
                {t('UPDATE_SURVEY_LINK')}
            </Text>
            <View style={[styles.cardContainer, {padding: 32}]}>
                
                <Input
                    placeholder={urlPlaceholder}
                    value={newUrl}
                    onChangeText={setNewUrl}
                    id="survey-link-input"
                />
                <ButtonVariant
                    onPress={newUrl ? () => setShowModal(true)
                        : null
                    }
                    text={t('EDIT')}
                    id="update-survey-link-button"
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
            <ConfirmationPopUp
                showModal={showModal}
                setShowModal={setShowModal}
                message='CONFIRM_SURVEY_LINK_UPDATE'
                onConfirm={changeSurveyUrl}
            />
        </View>
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
        void fetchRestaurants();
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
        <ScrollView style={styles.scrollViewContainer}>
            <Text style={styles.h3}>
                {t('MANAGE_RESTAURANTS')}
            </Text>
            {restaurants.length > 0 ? (
                restaurants.map((restaurant, index) => (
                    <View
                        key={restaurant.restaurantId} 
                        style={styles.cardContainer}
                    >
                        <View style={styles.flexRowContainer}>
                            <Text style={styles.h6}>
                                {restaurant.name}
                            </Text>
                            <View 
                                style={styles.flexButtonContainer}
                            >
                                <Button
                                    onPress={
                                        () => handleEditPress(restaurant)
                                    }
                                    text={t('EDIT')}
                                    id={`edit-button-${index}`}
                                />
                                <DeleteButton
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
            <DeletePopUp
                showModal={showModal}
                setShowModal={setShowModal}
                onDelete={confirmRestaurantDeletion}
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
        void fetchRestaurantUsers(selectedRestaurant[0]);
    }, []);

    const addUserToRestaurant = async () => {
        try {
            await axios.post(
                `${apiUrl}/restaurant/${selectedRestaurant[0]}/add-user`,
                { userToAdd },
                { headers }
            );
            await fetchRestaurantUsers(selectedRestaurant[0]);
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
            <View style={[styles.cardContainer, {paddingHorizontal: 32}]}>
                <Text style={styles.h5}>
                    {t('USERS_OF_RESTAURANT')}{':'}
                </Text>
                {restaurantUsers.length > 0 ? (
                    restaurantUsers.map((user, index) => (
                        <View key={index} style={styles.flexRowContainer}>
                            <Text style={styles.body}>{user.username}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.body}>{t('NO_USERS')}</Text>
                )}
                <Text style={styles.h5}>
                    {t('ADD_USERS_BY_USERNAME')}
                </Text>
                <Input
                    placeholder={t('USERNAME')}
                    value={userToAdd}
                    onChangeText={setUserToAdd}
                    id="username-input"
                />
                <ButtonVariant
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
            <Button
                onPress={() => setSelectedRestaurant(null)}
                text={t('GO_BACK')}
            />
            <ConfirmationPopUp
                showModal={showModal}
                setShowModal={setShowModal}
                message='CONFIRM_USER_ADDITION'
                onConfirm={addUserToRestaurant}
            />
        </View>
    );
};

export default AdminPanel;
