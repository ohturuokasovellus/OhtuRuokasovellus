import React, { useEffect, useState } from 'react';
import { useNavigate } from '../Router';
import { Text, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import ExternalLink, { fetchSurveyUrl } from './Survey';
import axios from 'axios';
import apiUrl from '../utils/apiUrl';
import createStyles from '../styles/styles';
import { Button, ButtonVariant } from './ui/Buttons';
import MealDeletion from './MealDeletion';
import { UserDashboard, RestaurantDashboard } from './Dashboard';

const Home = ({ userSession }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [surveyUrl, setSurveyUrl] = useState(null);
    const styles = createStyles();
    const [isAdmin, setIsAdmin] = useState(false);

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
        if (!userSession) {
            navigate('/login');
        }

        void fetchSurveyUrl(setSurveyUrl);
        void setAdminStatus();
    }, [userSession, navigate]);

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
                <UserDashboard userSession={userSession}/>
                <Button
                    styles={styles}
                    onPress={() => navigate('/history')}
                    text={t('MEAL_HISTORY')}
                    id='history-button'
                />
                {surveyUrl && (
                    <ExternalLink surveyUrl={surveyUrl} 
                        textIdentifier={'SURVEY'}/>
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
                        <RestaurantDashboard userSession={userSession} />
                        <MealDeletion userSession={userSession} />
                    </>
                ) : null}
            </View>
        </ScrollView>
    );
};

export default Home;
