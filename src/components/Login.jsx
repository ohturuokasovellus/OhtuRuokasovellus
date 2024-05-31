import React, { useState, useEffect } from 'react';
import { deleteSession } from '../controllers/sessionController';
import { TextInput, View, Pressable, Text } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from '../Router';
import { styles } from '../styling/styles';
import { createSession } from '../controllers/sessionController';
import { useTranslation } from 'react-i18next';
import apiUrl from '../utils/apiUrl';
import { loginValidationSchema } from '../utils/formValidationSchemas';

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
                        placeholder={t('USERNAME')}
                        id="username_input"
                    />
                    {touched.username && errors.username && (
                        <Text style={styles.errorText}>
                            {t(errors.username)}
                        </Text>
                    )}

                    <TextInput
                        style={styles.input}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        placeholder={t('PASSWORD')}
                        id="password_input"
                        secureTextEntry
                    />
                    {touched.password && errors.password && (
                        <Text style={styles.errorText}>
                            {t(errors.password)}
                        </Text>
                    )}
                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
                    <View style={ styles.button }>
                        <Pressable onPress={handleSubmit} 
                            id='log_user_in_button'
                            title="Login" disabled={isSubmitting}>
                            <Text style={ styles.buttonText }>
                                {t('LOGIN')}
                            </Text>
                        </Pressable>
                    </View>
                    <Text>{t('DONT_HAVE_AN_ACCOUNT_YET')}</Text>
                    <View style={ styles.button }>
                        <Pressable title="Register" id="navigate_to_register"
                            onPress={() => navigate('/register')}>
                            <Text style={ styles.buttonText }>
                                {t('REGISTER')}
                            </Text>
                        </Pressable>
                    </View>
                    <Pressable style={styles.button}
                        title='Register as a Restauraunt User'
                        id="navigate_to_register_restaurant"
                        onPress={() => navigate('/register-restaurant')}>
                        <Text style={ styles.buttonText }>
                            {t('REGISTER_RESTAURANT')}
                        </Text>
                    </Pressable>
                </View>
            )}
        </Formik>
    );
};

export default LoginForm;
