import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';

import { useNavigate, Link } from '../Router';
import { useTranslation } from 'react-i18next';
import Survey, { fetchSurveyUrl } from './Survey';
import { getSession } from '../controllers/sessionController';
import axios from 'axios';
import apiUrl from '../utils/apiUrl';

import createStyles from '../styles/styles';
import { Button, ButtonVariant } from './ui/Buttons';

import MealDeletion from './MealDeletion';
import { UserDashboard, RestaurantDashboard } from './Dashboard';

const Home = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [surveyUrl, setSurveyUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const styles = createStyles();
    const userSession = getSession();
    const [isAdmin, setIsAdmin] = useState(false);

    if (!userSession) {
        return (
            <ScrollView style={styles.background}>
                <View style={[styles.container, { alignItems: 'center' }]}>
                    <Text style={styles.h1}>{t('HOME')}</Text>
                    <View style={styles.cardContainer}>
                        <Text style={styles.body}>{t('APP_DESCRIPTION')}</Text>
                    </View>
                    <Text style={styles.body}>
                        <Link to='/login'>
                            <Text style={styles.link} id='login-link'>
                                {t('LOGIN')}
                            </Text>
                        </Link>
                        /
                        <Link to='/register'>
                            <Text style={styles.link} id='register-link'>
                                {t('REGISTER')}
                            </Text>
                        </Link>
                    </Text>
                </View>
            </ScrollView>
        );
    }

    let username, isRestaurantUser;
    if (userSession) {
        username = userSession.username;
        isRestaurantUser = userSession.restaurantId !== null;
    }

    const setAdminStatus = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/verify-admin-status`,
                { headers: {
                    Authorization: `Bearer ${userSession.token}`,
                }}
            );
            setIsAdmin(response.data.isAdmin);
        } catch (err) {
            console.error(err);
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        void fetchSurveyUrl(setSurveyUrl, setLoading);
        void setAdminStatus();
    }, [navigate]);

    if (loading) {
        return <ActivityIndicator size='large' color='#0000ff' />;
    }

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>{t('HOME')}</Text>
                <Text style={styles.body}>
                    {t('WELCOME')}, {username}
                </Text>
                {isAdmin ? (
                    <ButtonVariant
                        styles={styles}
                        onPress={() => navigate('/admin-panel')}
                        text={t('ADMIN_PANEL')}
                        id='admin-panel-button'
                    />
                        
                ) : null}
                <UserDashboard />
                <Button
                    styles={styles}
                    onPress={() => navigate('/history')}
                    text={t('MEAL_HISTORY')}
                    id='history-button'
                />
                {surveyUrl && (
                    <Survey surveyUrl={surveyUrl}/>
                )}
                <Button
                    styles={styles}
                    onPress={() => navigate('/settings')}
                    text={t('SETTINGS')}
                    id='settings-button'
                />
                {isRestaurantUser ? (
                    <>
                        <Text style={styles.body}>
                            {t('YOU_ARE_LOGGED_AS_RESTAURANT_USER')}.
                        </Text>
                        <ButtonVariant
                            styles={styles}
                            onPress={() => navigate('/add-users')}
                            text={t('ADD_USER')}
                            id='add-users-button'
                        />
                        <ButtonVariant
                            styles={styles}
                            onPress={
                                () => navigate(
                                    `/restaurant/${userSession.restaurantId}`
                                )}
                            text={t('RESTAURANT_PAGE')}
                            id='restaurant-page-button'
                        />
                        <ButtonVariant
                            styles={styles}
                            onPress={
                                () => navigate(
                                    `/menu-qr/${userSession.restaurantId}`
                                )}
                            text={t('EXPORT_MENU_QR')}
                            id='restaurant-menu-button'
                        />
                        <RestaurantDashboard />
                        <MealDeletion />
                    </>
                ) : null}
            </View>
        </ScrollView>
    );
};

export default Home;
