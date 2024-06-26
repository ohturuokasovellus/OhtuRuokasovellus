import AsyncStorage from '@react-native-async-storage/async-storage';

const createSession = async (userData) => {
    try {
        await AsyncStorage.setItem('loggedUser', JSON.stringify(userData));
    } catch (error) {
        console.log(error);
    }
};

const getSession = async () => {
    try {
        const loggedUserJSON = await AsyncStorage.getItem('loggedUser');
        return loggedUserJSON
            ? JSON.parse(loggedUserJSON)
            : null;
    } catch (error) {
        console.log(error);
    }
};

const deleteSession = async () => {
    try {
        await AsyncStorage.removeItem('loggedUser');
    } catch(error) {
        console.log(error);
    }
};

export {
    createSession,
    getSession,
    deleteSession
};