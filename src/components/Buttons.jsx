import React from 'react';
import { Pressable, Text } from 'react-native';

const Button = ({ onPress, text, styles }) => {
    return (
        <Pressable
            style={
                ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 },
                    styles.button]}
            onPress={onPress}
            role='button'
        >
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
};

const SmallButton = ({ onPress, text, styles }) => {
    return (
        <Pressable
            style={
                ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 },
                    styles.iconButton
                ]
            }
            onPress={onPress}
            role='button'
        >
            <Text style={styles.iconButtonText}>{text}</Text>
        </Pressable>
    );
};

export { Button, SmallButton };
