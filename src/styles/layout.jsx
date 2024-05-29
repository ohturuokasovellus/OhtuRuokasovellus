import { StyleSheet } from 'react-native';
import { useContext } from 'react';
import { themeContext } from '../controllers/themeController';

const createStyles = () => {
    // eslint-disable-next-line no-unused-vars
    const { theme, colors } = useContext(themeContext);

    return StyleSheet.create({
    // general
        background: {
            flex: 1,
            backgroundColor: colors.background,
        },
        container: {
            padding: 16,
            backgroundColor: colors.containerBackground,
            borderRadius: 8,
            marginVertical: 8,
        },

        // text
        bodyText: {
            fontSize: 16,
            color: colors.text,
        },
        heading: {
            fontSize: 24,
            fontWeight: 'bold',
            marginVertical: 16,
            color: colors.text,
        },
        errorText: {
            fontSize: 14,
            color: colors.error,
        },
        buttonText: {
            fontSize: 18,
            fontWeight: 'bold',
            textTransform: 'lowercase',
            color: colors.buttonText,
        },
        iconButtonText: {
            fontsize: 32,
            fontWeight: 'bold',
            color: colors.background,
        },
        linkText: {
            fontSize: 16,
            color: colors.link,
            textDecorationLine: 'underline',
        },

        placeholderText: {
            color: colors.placeholderText
        },

        // buttons
        button: {
            backgroundColor: colors.buttonBackground,
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12,
        },
        iconButton: {
            height: 30,
            width: 30,
            backgroundColor: colors.accent,
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
            borderColor: colors.inputBorder,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            paddingLeft: 8,
            color: colors.text,
            backgroundColor: colors.inputBackground,
        },
        passwordInput: {
            height: 40,
            borderColor: colors.inputBorder,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            paddingLeft: 8,
            color: colors.text,
            secureTextEntry: true,
            backgroundColor: colors.inputBackground,
        },
        multilineInput: {
            borderColor: colors.inputBorder,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            padding: 8,
            textAlignVertical: 'top',
            color: colors.text,
            backgroundColor: colors.inputBackground,
        },
        flexInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 8,
            marginBottom: 12,
        },
        flexInput: {
            flex: 1,
            height: 40,
            borderColor: colors.inputBorder,
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 8,
            color: colors.text,
            backgroundColor: colors.inputBackground,
        },

        // forms
        formContainer: {
            padding: 16,
            backgroundColor: colors.containerBackground,
            borderRadius: 8,
            marginVertical: 8,
        },
        formLabel: {
            fontSize: 16,
            marginBottom: 8,
            color: colors.text,
        },
        formValidationMessage: {
            fontSize: 14,
            color: colors.error,
            marginBottom: 8,
        },

        // qr scanner
        scannerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.scannerBackground,
        },
        scannerInstructions: {
            fontSize: 16,
            color: colors.text,
            margin: 16,
        },

        // dishes & menus
        menuItemContainer: {
            padding: 16,
            backgroundColor: colors.containerBackground,
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
            color: colors.text,
        },

        // nutritional etc info
        infoContainer: {
            padding: 16,
            backgroundColor: colors.containerBackground,
            borderRadius: 8,
            marginVertical: 8,
        },
        infoHeading: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 8,
            color: colors.text,
        },
        infoText: {
            fontSize: 16,
            color: colors.text,
        },

        // navigation
        navigationBar: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 12,
            backgroundColor: colors.accent,
        },
        navigationLink: {
            padding: 8,
            color: colors.background,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
    });
};

export default createStyles;
