import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';

import { useNavigate, Link } from '../Router';
import { useTranslation } from 'react-i18next';
import Survey, { fetchSurveyUrl } from './Survey';
import { getSession } from '../controllers/sessionController';

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

    const loremIpsum = 'Lorem ipsum dolor sit amet, \
    consectetur adipiscing elit. \
    Curabitur eu iaculis mauris. Sed metus purus, laoreet tincidunt lobortis \
    ac, hendrerit vitae metus. Suspendisse ultricies, \
    dolor ut blandit iaculis, \
    felis nunc mollis justo, eget viverra massa augue eget lectus. Donec sit \
    amet tortor ligula. Praesent pretium sem et urna tempus, vitae dictum est \
    tempor. Sed ullamcorper nec ante vitae facilisis. Curabitur congue semper \
    sapien, vel ullamcorper nisl gravida a. Nunc sagittis lorem id tincidunt \
    mattis. Quisque eget leo lorem. Morbi sagittis sodales quam, vitae feugiat \
    lacus convallis sit amet. Nulla at ex commodo est venenatis faucibus. \
    Nullam nisl eros, blandit ut nibh sed, aliquam sagittis sapien. Aliquam \
    luctus nisi sit amet gravida commodo. \
    Sed sit amet mauris non eros sagittis \
    condimentum a et mi. Maecenas hendrerit suscipit mi, semper cursus leo \
    sollicitudin vel. Curabitur vitae quam condimentum ipsum egestas \
    ullamcorper ac sed velit.\n\nAliquam ornare erat nec lectus tincidunt, \
    eget sollicitudin neque dignissim. Duis volutpat quis est id rhoncus. \
    Duis posuere risus eu quam consequat, non malesuada tellus ultrices. \
    Suspendisse venenatis nunc non dui gravida, quis condimentum urna \
    pharetra. Curabitur rutrum felis nec posuere molestie. Proin sed turpis \
    eros. Sed elementum purus dapibus enim placerat faucibus.\n\nFusce \
    lobortis, lorem et efficitur faucibus, diam lacus bibendum risus, ac \
    hendrerit nisl justo vitae elit. Morbi at eros nisl. Donec feugiat felis \
    turpis, a commodo velit semper a. Aliquam luctus erat quis sem feugiat, \
    nec malesuada neque fermentum. Nullam cursus nisl ac augue pretium, \
    eget mollis enim varius. Duis vehicula pretium sollicitudin. Aenean \
    feugiat dolor diam, sed tristique massa suscipit sit amet. Morbi ut \
    facilisis lectus. Sed auctor ultrices nibh ut sagittis. Aliquam ultricies \
    tristique dui eu accumsan. Nullam commodo ex id nisi pellentesque \
    blandit. Nam eget erat orci. Nunc gravida ornare massa in luctus. \
    Phasellus ullamcorper eget nunc non suscipit. Ut consequat fringilla \
    odio vel eleifend. Sed sed consectetur felis. ';

    if (!userSession) {
        return (
            <ScrollView style={styles.background}>
                <View style={[styles.container, { alignItems: 'center' }]}>
                    <Text style={styles.h1}>{t('HOME')}</Text>
                    <View style={styles.cardContainer}>
                        <Text style={styles.body}>{loremIpsum}</Text>
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

    useEffect(() => {
        fetchSurveyUrl(setSurveyUrl, setLoading);
    }, [navigate]);

    if (loading) {
        return <ActivityIndicator size='large' color='#0000ff' />;
    }

    let username, isRestaurantUser, isAdmin;
    if (userSession) {
        username = userSession.username;
        isRestaurantUser = userSession.restaurantId !== null;
        isAdmin = userSession.isAdmin;
    }

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>{t('HOME')}</Text>
                <Text style={styles.body}>
                    {t('WELCOME')}, {username}
                </Text>
                {isAdmin ? (
                    <View>
                        <Button
                            styles={styles}
                            onPress={() => navigate('/admin-panel')}
                            text={t('ADMIN_PANEL')}
                            id='admin-panel-button'
                        />
                        <Text style={styles.h4}>
                            {t('NON_ADMIN_FUNCTIONALITY')}
                        </Text>
                    </View>
                ) : null}
                <Button
                    styles={styles}
                    onPress={() => navigate('/history')}
                    text={t('MEAL_HISTORY')}
                    id='history-button'
                />
                {surveyUrl && (
                    <Survey surveyUrl={surveyUrl}/>
                )}
                <UserDashboard />
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
