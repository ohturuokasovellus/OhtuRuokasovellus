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

        // containers
        primaryContainer: {
            marginBottom: 16,
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
            borderRadius: 8,
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
            marginVertical: 10,
        },
        scrollViewContainer: {
            maxHeight: 400,
        },

        // buttons

        // input fields

        // cards
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
        

        // navigation

        // doughnut chart
        // const createStyles = () => {
        //     const { colors } = useContext(themeContext);
        //     return StyleSheet.create({
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
        //     });
        // };

        // Meal list

        // Modal
        
        
        // selectList

        // checkboxes

        // nutriscore

        // meal sorting

        // self eval slider
        
    });
};

export default createStyles;
