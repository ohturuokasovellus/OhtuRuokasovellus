import { StyleSheet } from 'react-native';

const createStyles = (theme) => StyleSheet.create({
    // general
    background: {
        flex: 1,
        backgroundColor: theme.background,
    },
    container: {
        padding: 16,
        backgroundColor: theme.containerBackground,
        borderRadius: 8,
        marginVertical: 8,
    },

    // text
    bodyText: {
        fontSize: 16,
        color: theme.text,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 16,
        color: theme.text,
    },
    errorText: {
        fontSize: 14,
        color: theme.error,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'lowercase',
        color: theme.buttonText,
    },
    iconButtonText: {
        fontsize: 32,
        fontWeight: 'bold',
        color: theme.background,
    },
    linkText: {
        fontSize: 16,
        color: theme.link,
        textDecorationLine: 'underline',
    },

    // buttons
    button: {
        backgroundColor: theme.buttonBackground,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    iconButton: {
        height: 30,
        width: 30,
        backgroundColor: theme.accent,
        padding: 8,
        borderRadius: 100,
        marginBottom: 6,
        marginHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // input fields
    input: {
        height: 40,
        borderColor: theme.inputBorder,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingLeft: 8,
        color: theme.text,
        backgroundColor: theme.inputBackground,
    },
    passwordInput: {
        height: 40,
        borderColor: theme.inputBorder,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingLeft: 8,
        color: theme.text,
        secureTextEntry: true,
        backgroundColor: theme.inputBackground,
    },
    multilineInput: {
        borderColor: theme.inputBorder,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        padding: 8,
        textAlignVertical: 'top',
        color: theme.text,
        backgroundColor: theme.inputBackground,
    },
    scalableInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 12,
    },
    scalableInput: {
        flex: 1,
        height: 40,
        borderColor: theme.inputBorder,
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 8,
        color: theme.text,
        backgroundColor: theme.inputBackground,
    },

    // forms
    formContainer: {
        padding: 16,
        backgroundColor: theme.containerBackground,
        borderRadius: 8,
        marginVertical: 8,
    },
    formLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: theme.text,
    },
    formValidationMessage: {
        fontSize: 14,
        color: theme.error,
        marginBottom: 8,
    },

    // qr scanner
    scannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.scannerBackground,
    },
    scannerInstructions: {
        fontSize: 16,
        color: theme.text,
        margin: 16,
    },

    // dishes & menus
    menuItemContainer: {
        padding: 16,
        backgroundColor: theme.containerBackground,
        borderRadius: 8,
        marginVertical: 8,
    },
    menuItemImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    menuItemText: {
        fontSize: 16,
        color: theme.text,
    },

    // nutritional etc info
    infoContainer: {
        padding: 16,
        backgroundColor: theme.containerBackground,
        borderRadius: 8,
        marginVertical: 8,
    },
    infoHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: theme.text,
    },
    infoText: {
        fontSize: 16,
        color: theme.text,
    },

    // navigation
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        backgroundColor: theme.accent,
    },
    navigationLink: {
        padding: 8,
        color: theme.background,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

// export { styles, createStyles };
export default createStyles;
