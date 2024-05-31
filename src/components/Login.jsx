import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import { View, Text, ScrollView } from 'react-native';

import { useNavigate } from '../Router';
import { createSession, deleteSession } from '../controllers/sessionController';
import apiUrl from '../utils/apiUrl';
import { useTranslation } from 'react-i18next';
import { loginValidationSchema } from '../utils/formValidationSchemas';

import createStyles from '../styles/layout';
import { Button } from './ui/Buttons';
import { Input, PasswordInput } from './ui/InputFields';

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

    const styles = createStyles();

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
                <ScrollView style={styles.background}>
                    <View style={styles.container}>
                        <Text style={styles.h1}>
                            Login
                        </Text>
                        <Input
                            styles={styles}
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            value={values.username}
                            placeholder={t('USERNAME')}
                        />
                        {touched.username && errors.username && (
                            <Text style={styles.error}>{errors.username}</Text>
                        )}
                        <PasswordInput
                            styles={styles}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            placeholder={t('PASSWORD')}
                        />
                        {touched.password && errors.password && (
                            <Text style={styles.error}>{errors.password}</Text>
                        )}
                        {errorMessage ? (
                            <Text style={styles.error}>{errorMessage}</Text>
                        ) : null}
                        <Button
                            styles={styles}
                            onPress={handleSubmit}
                            text={t('LOGIN')}
                            id='login-button'
                            disabled={isSubmitting}
                        />
                        <Text style={styles.body}>
                            {t('DONT_HAVE_AN_ACCOUNT_YET')}
                        </Text>
                        <Button
                            styles={styles}
                            onPress={() => navigate('/register')}
                            text={t('REGISTER')}
                            id='register-button'
                        />
                        <Button
                            styles={styles}
                            onPress={() => navigate('/register-restaurant')}
                            text={t('REGISTER_RESTAURANT')}
                            id='register-restaurant-button'
                        />
                    </View>
                </ScrollView>
            )}
        </Formik>
    );
};

export default LoginForm;
