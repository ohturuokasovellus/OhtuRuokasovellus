import React, { useContext } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { themeContext } from '../../controllers/themeController';

/**
 * Custom wrapper for text input fields.
 * @param {object} styles styles passed from the global stylesheet
 * @param {...any} props https://reactnative.dev/docs/textinput#props
 */
const Input = ({...props }) => {
    const styles = createStyles();
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor={styles.placeholderText.color}
            maxLength={80}
            {...props}
        />
    );
};
/** Text input for passwords. */
const PasswordInput = ({ ...props }) => {
    const styles = createStyles();
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor={styles.placeholderText.color}
            maxLength={80}
            secureTextEntry={true}
            {...props}
        />
    );
};

/** Horizontally scalable input field. Use if you want e.g.
 * remove button positioned next to the input field.
 */
const FlexInput = ({ ...props }) => {
    const styles = createStyles();
    return (
        <TextInput
            style={styles.flexInput}
            placeholderTextColor={styles.placeholderText.color}
            maxLength={80}
            {...props}
        />
    );
};

/** Input field if multiple lines are required. Pass the
 * row props if you want to define the number of lines visible.
 */
const MultilineInput = ({ ...props }) => {
    const styles = createStyles();
    return (
        <TextInput
            style={styles.multilineInput}
            placeholderTextColor={styles.placeholderText.color}
            maxLength={500}
            multiline={true}
            {...props}
        />
    );
};

const createStyles = () => {
    const { colors } = useContext(themeContext);
    return StyleSheet.create({
        placeholderText: {
            color: colors.outline,
            fontFamily: 'Roboto-Regular',
        },
        input: {
            height: 40,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            paddingLeft: 8,
            color: colors.onSurfaceVariant,
            backgroundColor: colors.surfaceVariant,
        },
        passwordInput: {
            height: 40,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            paddingLeft: 8,
            color: colors.onSurfaceVariant,
            secureTextEntry: true,
            backgroundColor: colors.surfaceVariant,
        },
        multilineInput: {
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            padding: 8,
            verticalAlign: 'top',
            color: colors.onSurfaceVariant,
            backgroundColor: colors.surfaceVariant,
        },
        flexInput: {
            flex: 1,
            height: 40,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 8,
            marginBottom: 8,
            color: colors.onSurfaceVariant,
            backgroundColor: colors.surfaceVariant,
        },
    });
};

export { Input, PasswordInput, FlexInput, MultilineInput };
