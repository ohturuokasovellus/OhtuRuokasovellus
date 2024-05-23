/* eslint-disable @stylistic/js/indent */
import React, { useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
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
    const isRestaurantUser = props.user.restaurantId !== null;

    return (
        <View>
            <Text style={styles.welcomeText}>
                Welcome, {props.user.username}
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
                        () => navigate(`/restaurant/${props.user.restaurantI}`)
                    }>
                        <Text style={styles.buttonText}>restaurant page</Text>
                    </Pressable>
                </>
            ) : null}
        </View>
    );
};

export default Home;