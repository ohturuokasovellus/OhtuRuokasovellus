import { StyleSheet } from 'react-native';

const lightTheme = {
    background: '#D9DED5',
    text: '#143626',
    error: '#B46A67',
    success: '#08472B',
    buttonBackground: '#007bff',
    buttonPressed: '#0056b3',
    inputBorder: '#cccccc',
    placeholderText: '#888888',
    link: '#1C6A63',
    containerBackground: '#ffffff',
    additionalInfoBackground: '#e0e0e0',
    imageContainerBackground: '#cccccc',
    naviButtonBackground: '#17a2b8',
};
  
const darkTheme = {
    background: '#143626',
    text: '#D9DED5',
    error: '#B46A67',
    success: '#4caf50',
    buttonBackground: '#3b5998',
    buttonPressed: '#2d4373',
    inputBorder: '#666666',
    placeholderText: '#aaaaaa',
    link: '#1C6A63',
    containerBackground: '#303030',
    additionalInfoBackground: '#505050',
    imageContainerBackground: '#404040',
    naviButtonBackground: '#007bff',
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#D9DED5',
        padding: 16,
    },
    heading: {
        color: '#143626',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    bodyText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#143626'
    },
    errorText: {
        color: '#B46A67',
        fontSize: 16,
        marginBottom: 8,
    },
    successText: {
        color: '#08472B',
        fontSize: 16,
        marginBottom: 8,
    },
    smallButtonText: {
        color: '#D9DED5',
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#1C6A63',
        textDecorationLine: 'underline',
        marginBottom: 8,
    },
    input: {
        height: 50,
        // borderColor: 'gray',
        backgroundColor: '#EDF2E9',
        // borderWidth: 1,
        borderRadius: 8,
        margin: 6,
        paddingHorizontal: 10,
    },
    scalableInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        marginTop: 6,
    },
    scalableInput: {
        flex: 1,
        height: 50,
        // borderColor: 'gray',
        backgroundColor: '#F2F7ED',
        // borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        margin: 6,
    },
    container: {
        flex: 1,
        width: 400,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
    },
    additionalInfoContainer: {
        // padding: 16,
        // backgroundColor: '#e0e0e0',
        // borderRadius: 8,
        // marginBottom: 16,
        width: '100%',
        flexwrap: 'wrap',
    },
    imageContainer: {
        height: 200,
        backgroundColor: '#ccc',
        borderRadius: 3,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallButton: {
        height: 30,
        width: 30,
        padding: 8,
        backgroundColor: '#143626',
        borderRadius: 8,
        margin: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: 50,
        padding: 12,
        backgroundColor: '#26855F',
        borderRadius: 8,
        margin: 6,
    },
    buttonPressed: {
        backgroundColor: '#1E674A',
    },
    naviBarMobile: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    naviBarWeb: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    naviButton: {
        padding: 12,
        backgroundColor: '#17a2b8',
        borderRadius: 8,
    },
});

export { styles, lightTheme, darkTheme };
