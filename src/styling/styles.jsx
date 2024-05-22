import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    app: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeText: {
        position: 'flex',
        top: 0,
        left: 0,
        margin: 20,
    },
    login: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
    },
    register: {
        margin: 10,
    },
    logout: {
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

const stylesRegister = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#F2D8D5',
        width: 400,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    button: {
        height: 50,
        backgroundColor: '#60AEBF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#153236',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: '#BF5687',
        marginBottom: 8,
    },
});

export {
    styles,
    stylesRegister
};
