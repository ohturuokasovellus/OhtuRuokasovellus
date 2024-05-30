import { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Text, View, ScrollView } from 'react-native';

import { Link, useNavigate } from '../Router';
import { deleteSession } from '../controllers/sessionController';
import apiUrl from '../utils/apiUrl';

import { registrationValidationSchema } from '../utils/formValidationSchemas';

import createStyles from '../styles/layout';
import { Button } from './ui/Buttons';
import { Input, PasswordInput } from './ui/InputFields';

const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
};

const validationSchema = registrationValidationSchema;

/**
 * Render a form for user registration, validate using a yup schema.
 * On submission, send registration data to the server.
 * 
 * @param {Function} onSubmit - handle form submission;
 *  args: form values (username, email, password, confirmPassword)
 * @param {Function} onSuccess - redirect to login if successful
 * @param {Function} onError - log error message
 * 
 * @returns {React.JSX.Element}
 */

const RegisterForm = ({ onSubmit, onSuccess, onError }) => {
    const [formError, setFormError] = useState('');
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async values => {
            try {
                await onSubmit(values);
                onSuccess();
            } catch (err) {
                onError(err);
                setFormError(err.message);
                formik.resetForm();
            }
        },
    });

    const styles = createStyles();

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                {formError ? (
                    <Text style={styles.error}>{formError}</Text>
                ) : null}
                <Input
                    styles={styles}
                    placeholder='username'
                    value={formik.values.username}
                    onChangeText={formik.handleChange('username')}
                    onBlur={formik.handleBlur('username')}
                />
                {formik.touched.username && formik.errors.username && (
                    <Text style={styles.error}>{formik.errors.username}</Text>
                )}
                <Input
                    styles={styles}
                    placeholder='email'
                    value={formik.values.email}
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                />
                {formik.touched.email && formik.errors.email && (
                    <Text style={styles.error}>{formik.errors.email}</Text>
                )}
                <PasswordInput
                    styles={styles}
                    placeholder='password'
                    value={formik.values.password}
                    onChangeText={formik.handleChange('password')}
                    onBlur={formik.handleBlur('password')}
                />
                {formik.touched.password && formik.errors.password && (
                    <Text style={styles.error}>{formik.errors.password}</Text>
                )}
                <PasswordInput
                    styles={styles}
                    placeholder='confirm password'
                    value={formik.values.confirmPassword}
                    onChangeText={formik.handleChange('confirmPassword')}
                    onBlur={formik.handleBlur('confirmPassword')}
                />
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword &&
                <Text style={styles.error}>
                    {formik.errors.confirmPassword}
                </Text>
                }
                <Button
                    styles={styles}
                    onPress={formik.handleSubmit}
                    text='register'
                />
                <Text style={styles.body}>already registered?</Text>
                <Link to='/login'>
                    <Text style={styles.link}>login</Text>
                </Link>
            </View>
        </ScrollView>
    );
};

const Register = ({ updateUser }) => {
    const navigate = useNavigate();
    useEffect(() => {
        deleteSession();
        updateUser(null);
    }, []);

    const onSubmit = async values => {
        const { username, email, password } = values;
        try {
            await axios.post(
                `${apiUrl}/register`,
                { username, email, password }
            );
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.errorMessage ||
                'an unexpected error occurred';
            throw new Error(errorMessage);
        }
    };
    const onSuccess = () => {
        console.log('registration successful!');
        navigate('/login');
    };
    const onError = err => {
        console.error('Registration error:', err);
    };

    return <RegisterForm onSubmit={onSubmit}
        onSuccess={onSuccess} onError={onError} />;
};

export default Register;
