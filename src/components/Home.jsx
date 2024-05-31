import React, { useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';

import { useNavigate } from '../Router';

import createStyles from '../styles/layout';
import { Button } from './ui/Buttons';

const Home = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!props.user) {
            navigate('/login');
        }
    }, [props, navigate]);

    if (!props.user) {
        return null; // or render a loading indicator
    }

    const username = props.user.username;
    const restaurantId = props.user.restaurantId;
    const isRestaurantUser = restaurantId !== null;

    const styles = createStyles();

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>Home</Text>
                <Text style={styles.body}>
                Welcome, {username}
                </Text>
                {isRestaurantUser ? (
                    <>
                        <Text style={styles.body}>
                        You are logged in as a restaurant user.
                        </Text>
                        <Button
                            styles={styles}
                            onPress={() => navigate('/add-users')}
                            text='add users'
                            id='add-users-button'
                        />
                        <Button
                            styles={styles}
                            onPress={
                                () => navigate(`/restaurant/${restaurantId}`)
                            }
                            text='restaurant page'
                            id='restaurant-page-button'
                        />
                    </>
                ) : null}
            </View>
        </ScrollView>
    
    );
};

export default Home;
