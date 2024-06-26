import React, { useContext } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { themeContext } from '../../controllers/themeController';

/**
 * Custom button wrapper
 * @param {function} onPress handles the button press event
 * @param {string} text text displayed on the button
 * @param {object} styles styles passed from the global stylesheet
 * @param {...any} props https://reactnative.dev/docs/pressable#props
 */

const Button = ({ onPress, text, ...props }) => {
    const styles = createStyles();
    return (
        <Pressable
            style={
                ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 },
                    styles.button]}
            onPress={onPress}
            role='button'
            {...props}
        >
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
};

const ButtonVariant = ({ onPress, text, ...props }) => {
    const styles = createStyles();
    return (
        <Pressable
            style={
                ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 },
                    styles.buttonVariant]}
            onPress={onPress}
            role='button'
            {...props}
        >
            <Text style={styles.buttonVariantText}>{text}</Text>
        </Pressable>
    );
};

/** Nutritional info button. */
const NutriButton = ({ onPress, text, ...props }) => {
    const styles = createStyles();
    return (
        <Pressable
            style={
                ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 },
                    styles.nutriButton]}
            onPress={onPress}
            role='button'
            {...props}
        >
            <Text style={styles.nutriButtonText}>{text}</Text>
        </Pressable>
    );
};

/** Custom wrapper for generic delete button */
const DeleteButton = ({ onPress, ...props}) => {
    const styles = createStyles();
    const {t} = useTranslation();
    return (
        <Pressable
            style={
                ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 },
                    styles.deleteButton]}
            onPress={onPress}
            role='button'
            {...props}
        >
            <Text style={styles.deleteButtonText}>
                {t('DELETE')}
            </Text>
        </Pressable>
    );
};

/** Custom wrapper for generic cancel button */
const CancelButton = ({ onPress, ...props}) => {
    const {t} = useTranslation();
    const styles = createStyles();
    return (
        <Pressable
            style={
                ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 },
                    styles.cancelButton]}
            onPress={onPress}
            role='button'
            {...props}
        >
            <Text style={styles.cancelButtonText}>
                {t('CANCEL')}
            </Text>
        </Pressable>
    );
};

/** Custom wrapper for small buttons */
const SmallButton = ({ onPress, text, ...props }) => {
    const styles = createStyles();
    return (
        <Pressable
            style={
                ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 },
                    styles.iconButton
                ]
            }
            onPress={onPress}
            role='button'
            {...props}
        >
            <Text style={styles.iconButtonText}>{text}</Text>
        </Pressable>
    );
};

const createStyles = () => {
    const { colors } = useContext(themeContext);
    return StyleSheet.create({
        button: {
            backgroundColor: colors.primaryContainer,
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12,
        },
        buttonText: {
            fontSize: 18,
            textTransform: 'uppercase',
            color: colors.onPrimaryContainer,
            fontFamily: 'Roboto-Bold',
        },
        buttonVariant: {
            backgroundColor: colors.secondaryContainer,
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12,
        },
        buttonVariantText: {
            fontSize: 18,
            textTransform: 'uppercase',
            color: colors.onSecondaryContainer,
            fontFamily: 'Roboto-Bold',
        },
        deleteButton: {
            backgroundColor: colors.errorContainer,
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12,
            marginHorizontal: 8,
            width: 80,
        },
        deleteButtonText: {
            fontSize: 18,
            textTransform: 'uppercase',
            color: colors.onErrorContainer,
            fontFamily: 'Roboto-Bold',
        },
        cancelButton: {
            backgroundColor: colors.outlineVariant,
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12,
            marginHorizontal: 8,
            width: 90,
        },
        cancelButtonText: {
            fontSize: 18,
            textTransform: 'uppercase',
            color: colors.onSurfaceVariant,
            fontFamily: 'Roboto-Bold',
        },
        iconButton: {
            height: 30,
            width: 30,
            backgroundColor: colors.tertiary,
            padding: 8,
            borderRadius: 100,
            marginBottom: 6,
            marginHorizontal: 6,
            alignItems: 'center',
        },
        iconButtonText: {
            fontsize: 32,
            color: colors.onTertiary,
            fontFamily: 'Roboto-Bold',
        },
        nutriButton: {
            backgroundColor: colors.secondary,
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12,
            marginHorizontal: 8,
        },
        nutriButtonText: {
            fontSize: 18,
            textTransform: 'uppercase',
            color: colors.onSecondary,
            fontFamily: 'Roboto-Bold',
        },
    });
};

export {
    Button,
    ButtonVariant,
    NutriButton,
    DeleteButton,
    CancelButton,
    SmallButton,
};
