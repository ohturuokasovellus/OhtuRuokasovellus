import React from 'react';
import { TextInput } from 'react-native';

/**
 * Custom wrapper for text input fields.
 * @param {object} styles styles passed from the global stylesheet
 * @param {...any} props https://reactnative.dev/docs/textinput#props
 */
const Input = ({ styles, ...props }) => {
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor={styles.placeholderText.color}
            {...props}
        />
    );
};
/** Text input for passwords. */
const PasswordInput = ({ styles, ...props }) => {
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor={styles.placeholderText.color}
            secureTextEntry={true}
            {...props}
        />
    );
};

/** Horizontally scalable input field. Use if you want e.g.
 * remove button positioned next to the input field.
 */
const FlexInput = ({ styles, ...props }) => {
    return (
        <TextInput
            style={styles.flexInput}
            placeholderTextColor={styles.placeholderText.color}
            {...props}
        />
    );
};

export { Input, PasswordInput, FlexInput };