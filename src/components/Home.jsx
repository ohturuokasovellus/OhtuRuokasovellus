import React, { useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useNavigate } from '../Router';
import { styles } from '../styling/styles';

const Home = (user) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user.user) {
        return null; // or render a loading indicator
    }

    const username = user.user.username;
    const restaurantId = user.user.restaurantId;
    const isRestaurantUser = restaurantId !== null;

    return (
        <View>
            <Text style={styles.welcomeText}>
                Welcome, {username}
            </Text>
            {isRestaurantUser ? (
                <>
                    <Text style={styles.welcomeText}>
                        You are logged in as a restaurant user.
                    </Text>
                    <Pressable style={styles.button} title='Add user' onPress={
                        () => navigate('/add-users')
                    }>
                        <Text style={styles.buttonText}>add user</Text>
                    </Pressable>
                    <Pressable style={styles.button} title='restaurant page'
                        onPress={
                            () => navigate(
                                `/restaurant/${restaurantId}`
                            )
                        }>
                        <Text style={styles.buttonText}>restaurant page</Text>
                    </Pressable>
                </>
            ) : null}
        </View>
    );
};

export default Home;
