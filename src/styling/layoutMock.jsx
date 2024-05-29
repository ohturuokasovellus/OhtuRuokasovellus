/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import {
    View, Text, TextInput,
    ScrollView, Image, Pressable
} from 'react-native';
// import createStyles from './layout';
import { createStyles } from './layout';
import { lightTheme, darkTheme } from './colors';
import { themeContext } from '../controllers/themeController';

import Button from '../components/Button';

const Layout = () => {
    // const [isDarkTheme, setIsDarkTheme] = useState(false);
    // const theme = isDarkTheme ? darkTheme : lightTheme;
    const { toggleTheme } = useContext(themeContext);
    const styles = createStyles();
    const [inputs, setInputs] = useState([{ idx: 1, value: '' }]);

    const addInput = () => {
        setInputs([...inputs, { idx: inputs.length + 1, value: '' }]);
    };

    const removeInput = (idx) => {
        setInputs(inputs.filter(input => input.idx !== idx));
    };

    const handleInputChange = (idx, text) => {
        setInputs(inputs.map(
            input => (input.idx === idx ? { ...input, value: text } : input)
        ));
    };

    return (
        <ScrollView style={styles.background}>

            {/* navigation bar */}
            <View>
                <View style={styles.navigationBar}>
                    {/* <Pressable
                        onPress={() => setIsDarkTheme(!isDarkTheme)}
                        style={({ pressed }) => [
                            { opacity: pressed ? 0.5 : 1.0 }
                        ]}
                    >
                        <Text style={styles.navigationLink}>
                            {isDarkTheme ? '🌘︎' : '🌒︎'}
                        </Text>
                    </Pressable> */}
                    <Pressable
                        onPress={toggleTheme}
                        style={({ pressed }) => [
                            { opacity: pressed ? 0.5 : 1.0 }
                        ]}
                    >
                        <Text style={styles.navigationLink}>
                        🌘︎
                        </Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [
                        { opacity: pressed ? 0.5 : 1.0 }
                    ]} onPress={() => {/* handle login */}}>
                        <Text style={styles.navigationLink}>Login</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [
                        { opacity: pressed ? 0.5 : 1.0 }
                    ]} onPress={() => {/* handle logout */}}>
                        <Text style={styles.navigationLink}>Logout</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [
                        { opacity: pressed ? 0.5 : 1.0 }
                    ]} onPress={() => {/* handle register */}}>
                        <Text style={styles.navigationLink}>Register</Text>
                    </Pressable>
                </View>
            </View>

            {/* headings */}
            <Text style={styles.heading}>Heading</Text>

            {/* body */}
            <Text style={styles.bodyText}>This is some regular text.</Text>

            {/* error messages */}
            <Text style={styles.errorText}>This is an error message.</Text>

            {/* links */}
            <Text style={styles.linkText}>This is a link text.</Text>

            {/* buttons */}
            <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 },
                    styles.button
                ]}>
                <Text style={styles.buttonText}>Button</Text>
            </Pressable>

            <Button onPress={() => {}} text='button' styles={styles}></Button>

            {/* input fields */}
            <TextInput
                style={styles.input}
                placeholder='normal input'
                // placeholderTextColor={theme.placeholderText}
            />
            <TextInput
                style={styles.passwordInput}
                placeholder='password'
                // placeholderTextColor={theme.placeholderText}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.multilineInput}
                placeholder='multiline'
                // placeholderTextColor={theme.placeholderText}
                multiline={true}
                numberOfLines={4}
            />
            {inputs.map((input, index) => (
                <View key={input.idx} style={styles.scalableInputContainer}>
                    <TextInput
                        style={styles.scalableInput}
                        placeholder='scalable'
                        // placeholderTextColor={theme.placeholderText}
                        value={input.value}
                        onChangeText={(text) =>
                            handleInputChange(input.idx, text)}
                    />
                    {inputs.length > 1 && (
                        <Pressable
                            style={({ pressed }) => [
                                { opacity: pressed ? 0.5 : 1.0 },
                                styles.iconButton
                            ]}
                            onPress={() => removeInput(input.idx)}
                        >
                            <Text style={styles.iconButtonText}>–</Text>
                        </Pressable>
                    )}
                </View>
            ))}
            <Pressable
                style={({ pressed }) => [
                    { opacity: pressed ? 0.5 : 1.0 },
                    styles.iconButton
                ]}
                onPress={addInput}
            >
                <Text style={styles.iconButtonText}>+</Text>
            </Pressable>

            {/* forms */}
            <View style={styles.formContainer}>
                <Text style={styles.formLabel}>Form Label</Text>
                <TextInput
                    style={styles.input}
                    placeholder='form field'
                    // placeholderTextColor={theme.placeholderText}
                />
                <Text style={styles.formValidationMessage}>
                    This is a validation message.
                </Text>
            </View>

            {/* qr scanner */}
            <View style={styles.scannerContainer}>
                <Text style={styles.scannerInstructions}>
                    Scan your QR code here.
                </Text>
            </View>

            {/* dishes & menu stuff */}
            <View style={styles.menuItemContainer}>
                <Image
                    source={{ uri: require('./example.jpg') }}
                    style={styles.menuItemImage}
                />
                <Text style={styles.menuItemText}>Menu Item</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.infoHeading}>Additional Information</Text>
                <Text style={styles.infoText}>
                    Nutritional and emission data here.
                </Text>
            </View>

        </ScrollView>
    );
};

export default Layout;
