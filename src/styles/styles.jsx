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
            width: '100%',
            padding: 8,
            backgroundColor: colors.surface,
            borderRadius: 8,
            marginVertical: 8,
            alignSelf: 'center',
        },

        // typography
        body: {
            fontSize: 16,
            color: colors.onSurface,
            fontFamily: 'Roboto-Regular',
            marginVertical: 8,
        },
        h1: {
            fontSize: 32,
            marginVertical: 12,
            color: colors.onSurface,
            fontFamily: 'Roboto-Black',
        },
        h2: {
            fontSize: 28,
            marginVertical: 12,
            color: colors.onSurface,
            fontFamily: 'Roboto-Black',
        },
        h3: {
            fontSize: 24,
            marginVertical: 12,
            color: colors.onSurface,
            fontFamily: 'Roboto-Black',
        },
        h4: {
            fontSize: 22,
            marginVertical: 12,
            color: colors.onSurface,
            fontFamily: 'Roboto-Bold',
        },
        h5: {
            fontSize: 20,
            marginVertical: 12,
            color: colors.onSurface,
            fontFamily: 'Roboto-Bold',
        },
        h6: {
            fontSize: 18,
            marginVertical: 12,
            color: colors.onSurface,
            fontFamily: 'Roboto-Bold',
        },
        caption: {
            fontSize: 12,
            color: colors.onSurface,
            fontFamily: 'Roboto-Italic',
        },
        smallCaption: {
            fontSize: 10,
            color: colors.onSurface,
            fontFamily: 'Roboto-Italic',
        },
        error: {
            fontSize: 14,
            color: colors.error,
            marginVertical: 8,
            fontFamily: 'Roboto-Bold',
        },
        success: {
            fontSize: 14,
            color: colors.secondary,
            marginVertical: 8,
            fontFamily: 'Roboto-Bold',
        },
        link: {
            fontSize: 16,
            color: colors.primary,
            textDecorationLine: 'underline',
            fontFamily: 'Roboto-Regular',
            marginVertical: 8,
        },

        // containers
        primaryContainer: {
            marginVertical: 8,
            backgroundColor: colors.primaryContainer,
            padding: 16,
            borderRadius: 8,
        },
        cardContainer: {
            maxWidth: 700,
            width: '100%',
            padding: 16,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 8,
            marginVertical: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
            alignSelf: 'center',
        },
        flexRowContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            width: '100%',
        },
        flexButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
        },
        qrContainer: {
            padding: 16,
        },
        sortContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 16,
        },
        scrollViewContainer: {
            maxHeight: 400,
        },
    });
};

export default createStyles;
