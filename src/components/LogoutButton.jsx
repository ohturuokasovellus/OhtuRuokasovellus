import React from 'react';
import { View, Button } from 'react-native';
import { useNavigate } from '../Router';
import { deleteSession } from '../controllers/sessionController';
import { styles } from '../styling/styles';

const LogoutButton = ({ updateUser }) => {
    const navigate = useNavigate();
    const handlePress = () => {
        deleteSession();
        updateUser(null);
        navigate('/login');
    };

    return (
        <View style={styles.logout}>
            <Button title="Logout" onPress={handlePress} />
        </View>
    );
};

export default LogoutButton;