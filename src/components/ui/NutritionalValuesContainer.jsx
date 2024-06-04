import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

const NutritionalValues = ({ styles, nutrition }) => {
    const {t} = useTranslation();
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
                    {nutrition.energy} kcal
                </Text>
            </View>
            <View style={styles.nutritionalValueValueContainer}>
                <Text style={styles.nutritionalValueLabel}>
                    {t('FAT')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {nutrition.fat} g
                </Text>
            </View>
            <View style={styles.nutritionalValueSubValueContainer}>
                <Text style={styles.nutritionalValueSubLabel}>
                    {t('OF_WHICH_SATURATES')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {nutrition.saturatedFat} g
                </Text>
            </View>
            <View style={styles.nutritionalValueValueContainer}>
                <Text style={styles.nutritionalValueLabel}>
                    {t('CARBS')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {nutrition.carbs} g
                </Text>
            </View>
            <View style={styles.nutritionalValueSubValueContainer}>
                <Text style={styles.nutritionalValueSubLabel}>
                    {t('OF_WHICH_SUGARS')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {nutrition.sugars} g
                </Text>
            </View>
            <View style={styles.nutritionalValueValueContainer}>
                <Text style={styles.nutritionalValueLabel}>
                    {t('FIBER')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {nutrition.fiber} g
                </Text>
            </View>
            <View style={styles.nutritionalValueValueContainer}>
                <Text style={styles.nutritionalValueLabel}>
                    {t('PROTEIN')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {nutrition.protein} g
                </Text>
            </View>
            <View style={styles.nutritionalValueValueContainer}>
                <Text style={styles.nutritionalValueLabel}>
                    {t('SALT')}:
                </Text>
                <Text style={styles.nutritionalValueLabel}>
                    {nutrition.salt} mg
                </Text>
            </View>
        </View>
    );
};

export default NutritionalValues;
