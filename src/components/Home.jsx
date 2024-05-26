import React, { useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useNavigate } from '../Router';
import { styles } from '../styling/styles';

/**
 * Home component for rendering the home screen.
 * @param {Object} updateUser
 * @param {Object} updateUser.user 
 * @param {string} updateUser.user.username 
 * @param {number|null} updateUser.user.restaurantId 
 * @returns {JSX.Element|null} - home screen component or null if not logged in
 */

const Home = ({ updateUser }) => {
    const navigate = useNavigate();
    const user = updateUser.user;
    const restaurantId = user?.restaurantId;

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [updateUser, navigate]);

    if (!user) {
        return null; // or render a loading indicator
    }

    // Check if user is a restaurant owner
    const isRestaurantUser = restaurantId !== null;

    return (
        <View>
            <Text style={styles.welcomeText}>
                Welcome, {user.username}
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
                    {/* FIXME: this is broken (restaurantID is undefined)
                    and im too dumb to fix the issue /meri
                    <Pressable style={styles.button} title='restaurant page'
                        onPress={
                            () => navigate(
                                `/restaurant/${restaurantId}`
                            )
                        }>
                        <Text style={styles.buttonText}>restaurant page</Text>
                    </Pressable> */}
                </>
            ) : null}
        </View>
    );
};

export default Home;
