import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

/**
 * Custom button wrapper
 * @param {function} onPress handles the button press event
 * @param {string} text text displayed on the button
 * @param {object} styles styles passed from the global stylesheet
 * @param {...any} props https://reactnative.dev/docs/pressable#props
 */

const Button = ({ onPress, text, styles, ...props }) => {
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

/** Colour variant of the regular button. */
const ButtonVariant = ({ onPress, text, styles, ...props }) => {
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

/** Custom wrapper for generic delete button */
const DeleteButton = ({ onPress, styles, ...props}) => {
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

/** Custom wrapper for small buttons */
const SmallButton = ({ onPress, text, styles, ...props }) => {
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

/** Custom wrapper for navigation bar links. */
const NavButton = ({ onPress, text, styles, ...props }) => {
    return (
        <Pressable
            style={
                ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0}
                ]}
            onPress={onPress}
            role='link'
            {...props}
        >
            <Text style={styles.navigationLink}>{text}</Text>
        </Pressable>
    );
};

export {
    Button,
    ButtonVariant,
    DeleteButton,
    SmallButton,
    NavButton
};
