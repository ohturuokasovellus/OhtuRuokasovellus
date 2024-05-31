/* eslint-disable id-length */
import { StyleSheet } from 'react-native';
import { useContext } from 'react';
import { themeContext } from '../controllers/themeController';

const createStyles = () => {
    const { colors } = useContext(themeContext);

    return StyleSheet.create({
    // general
        background: {
            paddingTop: 60,
            flex: 1,
            flexGrow: 1,
            backgroundColor: colors.background,
        },
        container: {
            maxWidth: 700,
            padding: 16,
            backgroundColor: colors.containerBackground,
            borderRadius: 8,
            marginVertical: 8,
            alignSelf: 'center',
        },

        // text
        body: {
            fontSize: 16,
            color: colors.text,
        },
        h1: {
            fontSize: 32,
            fontWeight: 'bold',
            marginVertical: 12,
            color: colors.text,
        },
        h2: {
            fontSize: 28,
            fontWeight: 'bold',
            marginVertical: 12,
            color: colors.text,
        },
        h3: {
            fontSize: 24,
            fontWeight: 'bold',
            marginVertical: 12,
            color: colors.text,
        },
        h4: {
            fontSize: 22,
            fontWeight: 'bold',
            marginVertical: 12,
            color: colors.text,
        },
        h5: {
            fontSize: 20,
            fontWeight: 'bold',
            marginVertical: 12,
            color: colors.text,
        },
        h6: {
            fontSize: 18,
            fontWeight: 'bold',
            marginVertical: 12,
            color: colors.text,
        },
        caption: {
            fontSize: 12,
            color: colors.text,
        },
        smallCaption: {
            fontSize: 10,
            color: colors.text,
        },
        error: {
            fontSize: 14,
            color: colors.error,
            marginBottom: 8,
        },
        link: {
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

        // cards
        cardContainer: {
            width: 400,
            padding: 16,
            backgroundColor: colors.buttonBackground,
            borderRadius: 8,
            marginVertical: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
            alignSelf: 'center',
        },
        imageContainer: {
            position: 'absolute',
            top: '-5%',
            left: '5%',
            // width: '90%',
            width: 360,
            // height: 200,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
            borderRadius: 8,
            overflow: 'hidden',
        },
        image: {
            width: '100%',
            height: 200,
            borderRadius: 8,
        },
        cardContent: {
            paddingTop: 170,  // adjust this value based on the image height
            alignItems: 'center',
        },

        // QR
        qrContainer: {
            padding: 16,
        },

        // navigation
        navigationBar: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 12,
            backgroundColor: colors.accent,
            position: 'fixed',
            top: 0,
            width: '100%',
            height: 60,
            zIndex: 1000,
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
