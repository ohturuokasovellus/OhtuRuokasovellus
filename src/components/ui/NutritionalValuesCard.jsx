import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { convertKJ2Kcal } from '../../utils/KJKcalConverter';
import { themeContext } from '../../controllers/themeController';

const NutritionalValues = ({ nutrition }) => {
    const {t} = useTranslation();
    const styles = createStyles();
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
                    {t('OF_WHICH_SATURATES')}:
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

const createStyles = () => {
    const { colors } = useContext(themeContext);
    return StyleSheet.create({
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

    });
};

export default NutritionalValues;
