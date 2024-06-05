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
 * @param {Object} styles
 * @param {string} imgURI
 * @param {string} title
 * @param {string} body
 * @param {function} onPress
 * @param {boolean} isSelected
 * @param {array} sliceColor colours of chart slices
 * @param {string} co2 CO2 emissions
 * @param {string} allergens
 * @param {Object} nutrition nutritional info as a dict
 */
const MealCard = ({
    styles, imgURI, title, body,
    onPress, isSelected,
    sliceColor, co2, allergens,
    nutrition
}) => {
    const {t} = useTranslation();
    const [expanded, setExpanded] = useState(false);

    const series = [
        nutrition.carbs,
        nutrition.fat,
        nutrition.protein
    ];
    const labels = [
        `${t('CARBS')}: ${nutrition.carbs} g`,
        `${t('FAT')}: ${nutrition.fat} g`,
        `${t('PROTEIN')}: ${nutrition.protein} g`
    ];

    const PressableImageContainer = () => {
        return (
            <View style={styles.imageContainer}>
                <Pressable
                    onPress={onPress}
                    style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
                >
                    <Image
                        source={{ uri: imgURI }}
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
                    {` ${co2}`}
                </Text>
            </View>
        );
    };

    const InfoContainer = () => {
        return (
            <View style={styles.mealDescrContainer}>
                <Text style={styles.cardText}>{body}</Text>
                <Text style={styles.cardText}>
                    <Text style={styles.cardTextBold}>
                        {t('ALLERGENS')}:
                    </Text>
                    {` ${allergens.join(', ')}`}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.cardContainer}>
            <PressableImageContainer />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{title}</Text>
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
