import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigate } from '../Router';
import { styles } from '../styling/styles';
import { useTranslation } from 'react-i18next';

const Home = (props) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    useEffect(() => {
        if (!props.user) {
            navigate('/login');
        }
    }, [props.user, navigate]);

    if (!props.user) {
        return null; // or render a loading indicator
    }

    // Check if user is a restaurant owner
    const isRestaurantOwner = props.user.restaurantId !== null;

    return (
        <View>
            {isRestaurantOwner ? (
                <Text style={styles.welcomeText}>
                    {t('WELCOME')}, {t('RESTAURANT_OWNER')} 
                    {' '}{props.user.username}
                </Text>
            ) : (
                <Text style={styles.welcomeText}>
                    {t('WELCOME')}, {props.user.username}
                </Text>
            )}
        </View>
    );
};

export default Home;
