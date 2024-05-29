import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigate } from '../Router';
import { deleteSession } from '../controllers/sessionController';
import { styles } from '../styles/styles';

const LogoutButton = ({ updateUser }) => {
    const navigate = useNavigate();
    const handlePress = () => {
        deleteSession();
        updateUser(null);
        navigate('/login');
    };

    return (
        <View style={styles.logoutButton}>
            <Pressable
                style={styles.button}
                title='Logout'
                onPress={handlePress
                }>
                <Text style={ styles.buttonText }>logout</Text>
            </Pressable>
        </View>
    );
};

export default LogoutButton;