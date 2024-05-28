import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styling/styles';

function Home(props) {
    useEffect(() => {
        if (!props.user) {
            props.navigation.navigate('Login');
        }
    }, []);

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
}

export default Home;
