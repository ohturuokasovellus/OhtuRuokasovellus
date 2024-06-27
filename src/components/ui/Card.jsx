import React, { useContext, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import DoughnutChart from './DoughnutChart';
import { NutriButton } from './Buttons';
import NutritionalValues from './NutritionalValuesCard';
import { Nutriscore } from './Nutriscore';
import { formatPrice } from '../../utils/price';
import { themeContext } from '../../controllers/themeController';

/** Custom wrapper for cards with images
 * @param {object} styles styles passed from the global stylesheet
 * @param {string} imgURI image source
 * @param {string} title
 * @param {string} body
 */
const Card = ({ imgURI, title, body }) => {
    const styles = createStyles();
    return (
        <View style={styles.cardContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imgURI }}
                    style={styles.image} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardText}>{body}</Text>
            </View>
        </View>
    );
};

/** Wrapper for meal cards. The container works as Pressable,
 * and renders the additional info if selected.
 * @param {Object} styles styles passed from the global stylesheet
 * @param {Object} meal meal item including nutritional info, image, etc.
 * @param {function} onPress
 * @param {boolean} isSelected
 * @param {array} sliceColor colours of chart slices
 */
const MealCard = (
    { meal, onPress, isSelected, sliceColor }
)=> {
    const {t} = useTranslation();
    const styles = createStyles();
    const [expanded, setExpanded] = useState(false);

    const formattedPrice = formatPrice(meal.price);
    const nutrition = {
        energy: meal.energy,
        carbohydrates: meal.carbohydrates,
        fat: meal.fat,
        protein: meal.protein,
        sugar: meal.sugar,
        fiber: meal.fiber,
        saturatedFat: meal.saturated_fat,
        salt: meal.salt,
        vegetablePercent: meal.vegetable_percent
    };

    const series = [
        nutrition.carbohydrates,
        nutrition.fat,
        nutrition.protein
    ];
    const labels = [
        `${t('CARBS')}: ${(Number(nutrition.carbohydrates)).toFixed(1)} g`,
        `${t('FAT')}: ${(Number(nutrition.fat)).toFixed(1)} g`,
        `${t('PROTEIN')}: ${(Number(nutrition.protein)).toFixed(1)} g`
    ];
    const buttonId = meal.meal_name.replace(/\s+/g, '-').toLowerCase();

    const PressableImageContainer = () => {
        return (
            <View style={styles.imageContainer}>
                <Pressable
                    onPress={onPress}
                    style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                    id={`${buttonId}-button`}
                    role='button'
                >
                    <Image
                        source={{ uri: meal.image }}
                        style={styles.image}
                    />
                </Pressable>
            </View>
        );
    };

    const CO2Container = () => {
        const {t} = useTranslation();
        return (
            <View style={styles.co2Container}>
                <Text style={styles.cardText}>
                    <Text style={styles.cardTextBold}>
                        {t('CO2_EMISSIONS')}:
                    </Text>
                    {` ${meal.co2_emissions} g${t('PER_PORTION')}`}
                </Text>
            </View>
        );
    };

    const InfoContainer = () => {
        return (
            <View style={styles.mealDescrContainer}>
                <Text style={styles.cardText}>{meal.meal_description}</Text>
                <Text style={styles.cardText}>
                    <Text style={styles.cardTextBold}>
                        {t('ALLERGENS')}:
                    </Text>
                    {` ${meal.meal_allergens}`}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.cardContainer}>
            <PressableImageContainer />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                    {meal.meal_name}{'   '}
                    {formattedPrice}
                </Text>
                {isSelected && (
                    <View>
                        <CO2Container />
                        <View style={styles.chartDescrContainer}>
                            <DoughnutChart
                                styles={styles}
                                series={series}
                                sliceColor={sliceColor}
                                labels={labels}
                            />
                            <InfoContainer />
                        </View>
                        <NutriButton
                            text={expanded ?
                                t('HIDE_NUTR_INFO') :
                                t('SHOW_NUTR_INFO')
                            }
                            onPress={() => setExpanded(!expanded)}
                            id='nutritional-values-button'
                        />
                    </View>
                )}
                {isSelected && expanded && (
                    <View>
                        <NutritionalValues
                            nutrition={nutrition}
                        />
                        <Nutriscore
                            nutrition={nutrition}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const createStyles = () => {
    const { colors } = useContext(themeContext);
    return StyleSheet.create({
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
            margin: 8,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            margin: 6,
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
    });
};

export { Card, MealCard };
