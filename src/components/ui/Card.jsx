import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

import DoughnutChart from './DoughnutChart';

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
 * @param {object} styles
 * @param {string} imgURI
 * @param {string} title
 * @param {string} body
 * @param {function} onPress
 * @param {boolean} isSelected
 * @param {array} series list of macronutrients: [carbs, fat, protein]
 * @param {array} sliceColor colours of chart slices
 * @param {string} co2 CO2 emissions
 * @param {string} allergens
 */
const MealCard = ({
    styles, imgURI, title, body,
    onPress, isSelected,
    series, sliceColor,
    co2, allergens
}) => {
    const {t} = useTranslation();

    const labels = [
        `${t('CARBS')}: ${series[0]} g`,
        `${t('FAT')}: ${series[1]} g`,
        `${t('PROTEIN')}: ${series[2]} g`
    ];

    return (
        <Pressable onPress={onPress} style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1, },
        ]}>
            <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: imgURI }}
                        style={styles.image}
                    />
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    {isSelected && (
                        <View>
                            <View style={styles.co2Container}>
                                <Text style={styles.cardText}>
                                    <Text style={styles.cardTextBold}>
                                        {t('CO2_EMISSIONS')}:
                                    </Text>
                                    {` ${co2}`}
                                </Text>
                            </View>
                            <View style={styles.chartDescrContainer}>
                                <DoughnutChart
                                    styles={styles}
                                    series={series}
                                    sliceColor={sliceColor}
                                    labels={labels}
                                />
                                <View style={styles.mealDescrContainer}>
                                    <Text style={styles.cardText}>{body}</Text>
                                    <Text style={styles.cardText}>
                                        <Text style={styles.cardTextBold}>
                                            {t('ALLERGENS')}:
                                        </Text>
                                        {` ${allergens.join(', ')}`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
};

export { Card, MealCard };
