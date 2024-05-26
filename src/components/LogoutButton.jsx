import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigate } from '../Router';
import { deleteSession } from '../controllers/sessionController';
import { styles } from '../styling/styles';

/**
 * Render a button for logout.
 * On pressing, deletes user session from local storage and
 * updates App's user state to null.
 * Navigates to login page
 * @param {Function} handlePress - handle button press;
 * @returns {React.JSX.Element}
 */
const LogoutButton = ({ updateUser }) => {
    const navigate = useNavigate();
    const handlePress = () => {
        deleteSession();
        updateUser(null);
        navigate('/login');
    };

    return (
        <View style={styles.logoutButton}>
            <Pressable title="Logout" onPress={handlePress}>
                <Text style={ styles.buttonText }>logout</Text>
            </Pressable>
        </View>
    );
};

export default LogoutButton;