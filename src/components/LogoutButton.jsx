import React from 'react'
import { View, Button, StyleSheet } from 'react-native';
import { useNavigate } from '../Router'

const LogoutButton = ({ updateUser }) => {
    const navigate = useNavigate();

    const handlePress = () => {
        window.localStorage.removeItem('loggedRuokasovellusUser')
        updateUser(null)
        navigate('/login');
    };

    return (
        <View style={styles.container}>
            <Button title="Logout" onPress={handlePress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 20,
    },
});

export default LogoutButton;