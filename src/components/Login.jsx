import React, { useState, useEffect } from 'react';
import { deleteSession } from '../controllers/sessionController';
import { TextInput, View, Pressable, Text } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from '../Router';
import { styles } from '../styling/styles';
import { createSession } from '../controllers/sessionController';
import apiUrl from '../utils/apiUrl';
import { loginValidationSchema } from '../utils/formValidationSchemas';

const LoginForm = ({ updateUser }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        deleteSession();
        updateUser(null);
    }, []);

    const handleSubmit = async (values, actions) => {
        try {
            const response = await axios.post(
                `${apiUrl}/login`,
                values
            );
            actions.setSubmitting(false);
            const userData = {
                username: response.data.username,
                token: response.data.token,
                restaurantId: response.data.restaurantId,
            };
            createSession(userData);
            updateUser(userData);
            
            navigate('/');

        } catch (error) {
            console.error(error);
            setErrorMessage('Incorrect username or/and password');
            actions.setFieldError('general', 'Wrong credentials');
            actions.setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={(values, actions) => {
                setErrorMessage('');
                handleSubmit(values, actions);
            }}
            validationSchema={loginValidationSchema}
        >
            {({
                handleChange, handleBlur, handleSubmit,
                values, errors, touched, isSubmitting
            }) => (
                <View style={styles.login}>
                    <TextInput
                        style={styles.input}
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                        value={values.username}
                        placeholder="Username"
                    />
                    {touched.username && errors.username && (
                        <Text style={styles.errorText}>{errors.username}</Text>
                    )}

                    <TextInput
                        style={styles.input}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        placeholder="Password"
                        secureTextEntry
                    />
                    {touched.password && errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
                    <Pressable style={styles.button} onPress={handleSubmit}
                        title="Login" disabled={isSubmitting}>
                        <Text style={ styles.buttonText }> login </Text>
                    </Pressable>
                    <Pressable style={styles.button} title='Register'
                        onPress={() => navigate('/register')}>
                        <Text style={ styles.buttonText }>register</Text>
                    </Pressable>

                    <Pressable style={styles.button}
                        title='Register as a Restauraunt User'
                        onPress={() => navigate('/register-restaurant')}>
                        <Text style={ styles.buttonText }>
                                register restaurant
                        </Text>
                    </Pressable>
                </View>
            )}
        </Formik>
    );
};

export default LoginForm;
