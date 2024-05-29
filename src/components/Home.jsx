import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigate } from '../Router';
import { styles } from '../styling/styles';

const Home = (props) => {
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
                    Welcome, restaurant owner {props.user.username}
                </Text>
            ) : (
                <Text style={styles.welcomeText}>
                    Welcome, {props.user.username}
                </Text>
            )}
        </View>
    );
};

export default Home;
