import React, { useState, useEffect } from 'react';
import { deleteSession } from '../controllers/sessionController';
import { TextInput, View, Pressable, Text } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from '../Router';
import { styles } from '../styling/styles';
import { createSession } from '../controllers/sessionController';
import { LoginValidationSchema } from '../utils/formValidationSchemas';
import { useTranslation } from 'react-i18next';

/**
 * Render a form for user login, validate using a yup schema.
 * On submission, send login data to the server.
 *
 * @param {{ updateUser: Function }} props - handle user session management;
 * @returns {React.JSX.Element}
 */
const LoginForm = ({ updateUser }) => {
    const {t} = useTranslation();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        deleteSession();
        updateUser(null);
    }, []);

    const handleSubmit = async (values, actions) => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/login',
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
            validationSchema={LoginValidationSchema}
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
                    <View style={ styles.button }>
                        <Pressable onPress={handleSubmit}
                            title="Login" disabled={isSubmitting}>
                            <Text style={ styles.buttonText }>
                                {t('LOGIN')}
                            </Text>
                        </Pressable>
                    </View>
                    <View style={ styles.button }>
                        <Pressable title="Register"
                            onPress={() => navigate('/register')}>
                            <Text style={ styles.buttonText }>
                                {t('REGISTER')}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={ styles.button }>
                        <Pressable title="Register as a Restauraunt User"
                            onPress={() => navigate('/register-restaurant')}>
                            <Text style={ styles.buttonText }>
                                {t('REGISTER_RESTAURANT')}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </Formik>
    );
};

export default LoginForm;
