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
    logoutButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 20,
        height: 40,
        width: 80,
        backgroundColor: '#60AEBF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        margin: 4,
        height: 40,
        width: 80,
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
    surveyButton: {
        margin: 10,
        height: 40,
        width: 130,
        backgroundColor: '#60AEBF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    mealContainer: {
        justifyContent: 'center',
        // borderWidth: 3,
        borderColor: '#ccc',
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 20,
        flex: 1,
        // paddingTop: 20,
        // paddingHorizontal: 10,
        padding: 15,
        backgroundColor: '#F2D8D5',
        width: 500,
    },
    header: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
    },
    item: {
        padding: 10,
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    pressable: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        width: 220,
        height: 200,
        marginRight: 5,
        marginBottom: 5,
        borderRadius: 3,
    },
    additionalInfo: {
        paddingBottom: 20,
    },
    additionalInfoContainer: {
        width: '100%',
        flexWrap: 'wrap',
    },
    itemContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        // flexWrap: 'wrap',
        // width: '100%',

    },
    textContainer: {
        marginLeft: 3,
        flexDirection: 'center',
        flexWrap: 'wrap',
        width: '100%',
    },
    itemName: {
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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
