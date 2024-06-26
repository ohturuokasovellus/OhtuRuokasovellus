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
            marginBottom: 8,
            alignSelf: 'center',
        },

        // typography
        body: {
            fontSize: 16,
            color: colors.onSurface,
            fontFamily: 'Roboto-Regular',
            marginBottom: 8,
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
            marginBottom: 8,
            fontFamily: 'Roboto-Bold',
        },
        success: {
            fontSize: 14,
            color: colors.secondary,
            marginBottom: 8,
            fontFamily: 'Roboto-Bold',
        },
        link: {
            fontSize: 16,
            color: colors.primary,
            textDecorationLine: 'underline',
            fontFamily: 'Roboto-Regular',
        },
        placeholderText: {
            color: colors.outline,
            fontFamily: 'Roboto-Regular',
        },

        // buttons

        // input fields
        input: {
            height: 40,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            paddingLeft: 8,
            color: colors.onSurfaceVariant,
            backgroundColor: colors.surfaceVariant,
        },
        passwordInput: {
            height: 40,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            paddingLeft: 8,
            color: colors.onSurfaceVariant,
            secureTextEntry: true,
            backgroundColor: colors.surfaceVariant,
        },
        multilineInput: {
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            padding: 8,
            verticalAlign: 'top',
            color: colors.onSurfaceVariant,
            backgroundColor: colors.surfaceVariant,
        },
        flexInputContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            width: '100%',
            borderRadius: 8,
        },
        flexInput: {
            flex: 1,
            height: 40,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 8,
            marginBottom: 8,
            color: colors.onSurfaceVariant,
            backgroundColor: colors.surfaceVariant,
        },
        
        // cards
        cardContainer: {
            maxWidth: 600,
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
        imageContainer: {
            backgroundColor: colors.surface,
            position: 'absolute',
            top: -16,
            left: '5%',
            width: '90%',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 1,
            borderRadius: 8,
            overflow: 'hidden',
            zIndex: 100, // this ensures the container can be used as pressable
        },
        image: {
            width: '100%',
            height: 200,
            borderRadius: 8,
        },
        cardContent: {
            paddingTop: 168,  // adjust this value based on the image height
        },

        cardTitle: {
            fontSize: 24,
            marginVertical: 8,
            marginLeft: 8,
            color: colors.onSurfaceVariant,
            fontFamily: 'Roboto-Bold',
        },

        cardText: {
            fontSize: 16,
            color: colors.onSurfaceVariant,
            fontFamily: 'Roboto-Regular',
            marginBottom: 12,
        },

        cardTextBold: {
            fontFamily: 'Roboto-Bold',
            textTransform: 'uppercase',
        },
        co2Container: {
            alignItems: 'left',
            marginBottom: 8,
            marginLeft: 8,
        },
        chartDescrContainer: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'top',
            justifyContent: 'space-evenly',
            marginLeft: 8,
            rowGap: 10,
        },
        mealDescrContainer: {
            flex: 1,
            marginLeft: 12,
            marginRight: 8,
            minWidth: 120,
        },

        // QR
        qrContainer: {
            padding: 16,
        },
        qrPage: {
            justifyContent: 'center',
            alignItems: 'center'
        },

        // navigation
        navigationBar: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 12,
            backgroundColor: colors.tertiary,
            position: 'fixed',
            top: 0,
            width: '100%',
            height: 60,
            zIndex: 1000,
            overflowX: 'auto',
        },
        navigationLink: {
            padding: 8,
            color: colors.onTertiary,
            fontSize: 16,
            fontFamily: 'Roboto-Black',
            textTransform: 'uppercase',
            textDecorationLine: 'none',
            whiteSpace: 'nowrap',
        },

        activeNavigationLink: {
            color: colors.primary,
        },

        // doughnut chart
        chartContainer: {
            alignItems: 'center',
            flexDirection: 'column',
            marginBottom: 6,
            marginHorizontal: 20,
        },
        legendContainer: {
            flexDirection: 'column',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 8,
            marginLeft: 8,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 8,
            marginBottom: 6,
        },
        legendColor: {
            width: 16,
            height: 16,
            marginRight: 8,
        },
        legendText: {
            fontSize: 12,
            color: colors.onSurfaceVariant,
            fontFamily: 'Roboto-Regular'
        },

        // nutritional values
        nutritionalValueContainer: {
            padding: 16,
            backgroundColor: colors.primaryContainer,
            borderRadius: 8,
            margin: 8,
        },
        nutritionalValueTitle: {
            fontSize: 14,
            fontFamily: 'Roboto-Bold',
            textAlign: 'center',
            textTransform: 'uppercase',
            marginBottom: 4,
            color: colors.onPrimaryContainer,
        },
        nutritionalValueSubTitle: {
            fontSize: 12,
            fontFamily: 'Roboto-Regular',
            textAlign: 'center',
            marginBottom: 12,
            color: colors.onPrimaryContainer,
        },
        nutritionalValueValueContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        nutritionalValueSubValueContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 16,
            marginBottom: 8,
        },
        nutritionalValueLabel: {
            fontSize: 14,
            fontFamily: 'Roboto-Regular',
            color: colors.onPrimaryContainer,
        },
        nutritionalValueSubLabel: {
            fontSize: 14,
            fontFamily: 'Roboto-Thin',
            color: colors.onPrimaryContainer,
        },

        // Meal list
        mealContainer: {
            marginVertical: 8,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 8,
        },
        mealContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        mealListContainer: {
            maxHeight: 400,
        },
        managementButtons: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
        },

        // Modal
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            maxWidth: 300,
            width: '100%',
            padding: 20,
            backgroundColor: colors.surface,
            borderRadius: 10,
            alignItems: 'center',
        },
        modalText: {
            fontSize: 18,
            fontFamily: 'Roboto-Regular',
            color: colors.onSurface,
            marginBottom: 20,
        },
        modalButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        
        // selectList
        selectList: {
            height: 40,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            paddingLeft: 8,
            color: colors.outline,
            backgroundColor: colors.surfaceVariant,
        },
        inputStyles: {
            color: colors.onSurfaceVariant,
        },
        dropdownStyles: {
            borderColor: colors.outlineVariant,
            borderwidth: 1,
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.05)',
            marginBottom: 12,
            marginTop: -6,
        },
        dropdownItemStyles: {
            color: colors.outline,
        },
        dropdownTextStyles : {
            color: colors.onSurface,
            fontFamily: 'Roboto-Regular'
        },

        // checkboxes
        checkboxContainer: {
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.outlineVariant,
            borderRadius: 8,
            borderwidth: 1,
            padding: 8,
            marginBottom: 12,
        },
        checkboxContainerVariant: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            padding: 0,
            margin: 0,
        },
        checkboxWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        checkboxText: {
            color: colors.outline,
            fontFamily: 'Roboto-Regular',
        },

        // nutriscore
        nutriscoreContainer: {
            margin: 8,
            flexDirection: 'row',
            alignItems: 'center',
        },
        nutriscoreText: {
            fontFamily: 'Roboto-Bold',
            fontSize: 16,
            color: colors.onSurfaceVariant,
            marginRight: 8,
        },
        nutriscoreScoreContainer: {
            height: 30,
            width: 30,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        nutriscoreScore: {
            fontFamily: 'Roboto-Black',
            fontSize: 18,
            color: '#fff',
        },

        // meal sorting
        sortControls: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 10,
        },
        picker: {
            height: 40,
            width: 150,
            marginRight: 10,
            marginBottom: 8,
            borderRadius: 8,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            paddingLeft: 8,
            backgroundColor: colors.surfaceVariant,
            color: colors.outline,
            fontFamily: 'Roboto-Regular',
            overflow: 'hidden',
        },

        // self eval slider
        questionContainer: {
            marginBottom: 20,
            backgroundColor: colors.primaryContainer,
            padding: 15,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
        },
        question: {
            fontSize: 16,
            marginBottom: 10,
            fontWeight: '500',
        },
        slider: {
            width: '100%',
            height: 40,
            color: 'black'
        },
        sliderLabel: {
            textAlign: 'center',
            marginTop: 10,
            fontSize: 16,
            fontWeight: '500',
        },
        evaluationContainer: {
            padding: 20,
            borderColor: colors.outlineVariant,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
            marginBottom: 20,
        },
    });
};

export default createStyles;
