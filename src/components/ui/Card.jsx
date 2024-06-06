import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

import DoughnutChart from './DoughnutChart';
import { ButtonVariant } from './Buttons';
import NutritionalValues from './NutritionalValuesContainer';

/** Custom wrapper for cards with images
 * @param {object} styles styles passed from the global stylesheet
 * @param {string} imgURI image source
 * @param {string} title
 * @param {string} body
 */
const Card = ({ styles, imgURI, title, body }) => {
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
const MealCard = ({ styles, meal, onPress, isSelected, sliceColor}) => {
    const {t} = useTranslation();
    const [expanded, setExpanded] = useState(false);

    const nutrition = {
        energy: meal.energy,
        carbohydrates: meal.carbohydrates,
        fat: meal.fat,
        protein: meal.protein,
        sugar: meal.sugar,
        fiber: meal.fiber,
        saturatedFat: meal.saturated_fat,
        salt: meal.salt,
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
                    {` ${meal.co2_emissions} g/100g`}
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
                <Text style={styles.cardTitle}>{meal.meal_name}</Text>
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
                        <ButtonVariant
                            styles={styles}
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
                            styles={styles}
                            nutrition={nutrition}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

export { Card, MealCard };
