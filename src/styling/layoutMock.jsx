/* eslint-disable id-length */
import React, { useState } from 'react';
import {
    View, Text, TextInput,
    Pressable, TouchableOpacity
} from 'react-native';
import { styles } from './layout';

const Layout = () => {
    const [inputs, setInputs] = useState([{ id: 1, value: '' }]);
    const addInput = () => {
        setInputs([...inputs, { id: inputs.length + 1, value: '' }]);
    };
    
    const removeInput = (id) => {
        setInputs(inputs.filter(input => input.id !== id));
    };
    
    const handleInputChange = (id, text) => {
        setInputs(
            inputs.map(
                input => (input.id ===
                    id ? { ...input, value: text } : input)
            ));
    };

    return (
        <View style={styles.background}>
            {/* Headings */}
            <Text style={styles.heading}>Heading</Text>

            {/* Regular Text */}
            <Text style={styles.bodyText}>This is some regular text.</Text>

            {/* Error Message */}
            <Text style={styles.errorText}>This is an error message.</Text>

            {/* Success Message */}
            <Text style={styles.successText}>This is a success message.</Text>

            {/* Links */}
            <Text style={styles.linkText}>Click here</Text>

            {/* Forms */}
            <TextInput
                style={styles.input}
                placeholder="Regular Input"
                placeholderTextColor="#888" />
            {/* <View style={styles.scalableInputContainer}>
                <TextInput
                    style={styles.scalableInput}
                    placeholder="Scalable Input"
                    placeholderTextColor="#888" />
                <TouchableOpacity style={styles.smallButton}>
                    <Text style={styles.smallButtonText}>–</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.smallButton}>
                    <Text style={styles.smallButtonText}>+</Text>
                </TouchableOpacity>
            </View> */}
            {inputs.map((input, index) => (
                <View key={input.id} style={styles.scalableInputContainer}>
                    <TextInput
                        style={styles.scalableInput}
                        placeholder="Scalable Input"
                        placeholderTextColor='#888'
                        value={input.value}
                        onChangeText={
                            (text) => handleInputChange(input.id, text)
                        }
                    />
                    {inputs.length > 1 && (
                        <TouchableOpacity
                            style={styles.smallButton}
                            onPress={() => removeInput(input.id)}
                        >
                            <Text style={styles.smallButtonText}>–</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
            <View>
                <TouchableOpacity style={styles.smallButton} onPress={addInput}>
                    <Text style={styles.smallButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={true} />
            <Pressable style={({ pressed }) =>
                [styles.button, pressed && styles.buttonPressed]}>
                <Text style={styles.buttonText}>Submit</Text>
            </Pressable>

            {/* Containers */}
            <View style={styles.container}>
                <Text style={styles.bodyText}>Regular Container</Text>
            </View>
            <View style={styles.additionalInfoContainer}>
                <Text style={styles.bodyText}>Additional Info</Text>
            </View>
            <View style={styles.imageContainer}>
                <Text style={styles.bodyText}>Image Container</Text>
            </View>

            {/* Pressables */}
            {/* <Pressable
                style={({ pressed }) =>
                    [styles.smallButton, pressed && styles.buttonPressed]}>
                <Text style={styles.smallButtonText}>+</Text>
            </Pressable> */}
            

            {/* Navigation */}
            {/* <View style={styles.naviBarMobile}>
                <Pressable style={styles.naviButton}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                <Pressable style={styles.naviButton}>
                    <Text style={styles.buttonText}>Logout</Text>
                </Pressable>
                <Pressable style={styles.naviButton}>
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>
            </View>
            <View style={styles.naviBarWeb}>
                <Pressable style={styles.naviButton}>
                    <Text style={styles.buttonText}>Change Theme</Text>
                </Pressable>
                <Pressable style={styles.naviButton}>
                    <Text style={styles.buttonText}>Change Language</Text>
                </Pressable>
            </View> */}
        </View>
    );
};

export default Layout;
