import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { convertKJ2Kcal } from '../../utils/KJKcalConverter';

const NutritionalValues = ({ styles, nutrition }) => {
    const {t} = useTranslation();
    const kcal = convertKJ2Kcal(nutrition.energy);
    return (
        <View style={styles.nutritionalValueContainer}>
            <Text style={styles.nutritionalValueTitle}>
                {t('NUTRITIONAL_VALUES')}
            </Text>
            <Text style={styles.nutritionalValueSubTitle}>
                {t('PER_PORTION')}
            </Text>
            <View style={styles.nutritionalValueValueContainer}>
                <Text style={styles.nutritionalValueLabel}>
                    {t('ENERGY')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {Number(kcal).toFixed(0)} kcal
                </Text>
            </View>
            <View style={styles.nutritionalValueValueContainer}>
                <Text style={styles.nutritionalValueLabel}>
                    {t('FAT')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {Number(nutrition.fat).toFixed(1)} g
                </Text>
            </View>
            <View style={styles.nutritionalValueSubValueContainer}>
                <Text style={styles.nutritionalValueSubLabel}>
                    {t('OF_WHICH_SATURATED')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {Number(nutrition.saturatedFat).toFixed(1)} g
                </Text>
            </View>
            <View style={styles.nutritionalValueValueContainer}>
                <Text style={styles.nutritionalValueLabel}>
                    {t('CARBS')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {Number(nutrition.carbohydrates).toFixed(1)} g
                </Text>
            </View>
            <View style={styles.nutritionalValueSubValueContainer}>
                <Text style={styles.nutritionalValueSubLabel}>
                    {t('OF_WHICH_SUGARS')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {Number(nutrition.sugar).toFixed(1)} g
                </Text>
            </View>
            <View style={styles.nutritionalValueValueContainer}>
                <Text style={styles.nutritionalValueLabel}>
                    {t('FIBER')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {Number(nutrition.fiber).toFixed(1)} g
                </Text>
            </View>
            <View style={styles.nutritionalValueValueContainer}>
                <Text style={styles.nutritionalValueLabel}>
                    {t('PROTEIN')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {Number(nutrition.protein).toFixed(1)} g
                </Text>
            </View>
            <View style={styles.nutritionalValueValueContainer}>
                <Text style={styles.nutritionalValueLabel}>
                    {t('SALT')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {Number(nutrition.salt).toFixed(1)} mg
                </Text>
            </View>
        </View>
    );
};

export default NutritionalValues;
