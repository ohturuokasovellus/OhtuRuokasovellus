import React from 'react';
import { Pressable, Text } from 'react-native';

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

export { Button, SmallButton, NavButton };
