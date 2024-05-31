import { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Text, View, ScrollView } from 'react-native';

import { Link, useNavigate } from '../Router';
import { deleteSession } from '../controllers/sessionController';
import apiUrl from '../utils/apiUrl';
import { restaurantValidationSchema }
    from '../utils/formValidationSchemas';

import createStyles from '../styles/styles';
import { Button } from './ui/Buttons';
import { Input, PasswordInput } from './ui/InputFields';

const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
};

const validationSchema = restaurantValidationSchema;

/**
 * Render a form for restaurant registration, validate using a yup schema.
 * On submission, send registration data to the server.
 *
 * @param {Function} onSubmit - handle form submission;
 *  args: form values
 * (username, email, password, confirmPassword, restaurantName)
 * @param {Function} onSuccess - redirect to login if successful
 * @param {Function} onError - log error message
 *
 * @returns {React.JSX.Element}
 */

const RegisterForm = ({ onSubmit, onSuccess, onError }) => {
    const {t} = useTranslation();
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
                <Text style={styles.h1}>
                    Register as a Restaurant
                </Text>
                {formError ? (
                    <Text style={styles.error}>{formError}</Text>
                ) : null}
                <Input
                    styles={styles}
                    placeholder={t('NAME_OF_THE_RESTAURANT')}
                    value={formik.values.restaurantName}
                    onChangeText={formik.handleChange('restaurantName')}
                    onBlur={formik.handleBlur('restaurantName')}
                    id='restaurant-name-input'
                />
                {formik.touched.restaurantName &&
                formik.errors.restaurantName &&
                (
                    <Text style={styles.error}>
                        {formik.errors.restaurantName}
                    </Text>
                )}
                <Input
                    styles={styles}
                    placeholder={t('USERNAME')}
                    value={formik.values.username}
                    onChangeText={formik.handleChange('username')}
                    onBlur={formik.handleBlur('username')}
                    id='username-input'
                />
                {formik.touched.username && formik.errors.username && (
                    <Text style={styles.error}>{formik.errors.username}</Text>
                )}
                <Input
                    styles={styles}
                    placeholder={t('EMAIL')}
                    value={formik.values.email}
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                    id='email-input'
                />
                {formik.touched.email && formik.errors.email && (
                    <Text style={styles.error}>{formik.errors.email}</Text>
                )}
                <PasswordInput
                    styles={styles}
                    placeholder={t('PASSWORD')}
                    value={formik.values.password}
                    onChangeText={formik.handleChange('password')}
                    onBlur={formik.handleBlur('password')}
                    id='password-input'
                />
                {formik.touched.password && formik.errors.password && (
                    <Text style={styles.error}>{formik.errors.password}</Text>
                )}
                <PasswordInput
                    styles={styles}
                    placeholder={t('CONFIRM_PASSWORD')}
                    value={formik.values.confirmPassword}
                    onChangeText={formik.handleChange('confirmPassword')}
                    onBlur={formik.handleBlur('confirmPassword')}
                    id='confirm-password-input'
                />
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword &&
                <Text style={styles.error}>
                    {t(formik.errors.confirmPassword)}
                </Text>
                }
                <Button
                    styles={styles}
                    onPress={formik.handleSubmit}
                    text={t('REGISTER')}
                    id='register-button'
                />
                <Text style={styles.body}>{t('ALREADY_REGISTERED')}</Text>
                <Link to='/login'>
                    <Text style={styles.link}>{t('LOGIN')}</Text>
                </Link>
            </View>
        </ScrollView>
    );
};

/**
 * Register a new restaurant and user, then navigate to the login page.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.updateUser - Function to update the user state.
 *
 * @returns {React.JSX.Element}
 */
const RegisterRestaurant = ({ updateUser }) => {
    const navigate = useNavigate();
    useEffect(() => {
        deleteSession();
        updateUser(null);
    }, []);

    /**
     * Handle form submission by sending registration data to the server.
     *
     * @param {Object} values - The form values.
     * @throws Throw an error if registration fails.
     */
    const onSubmit = async values => {
        const { username, email, password, restaurantName } = values;
        try {
            await axios.post(
                `${apiUrl}/register-restaurant`,
                { username, email, password, restaurantName }
            );
        } catch (err) {
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
        console.error('registration error:', err);
    };

    return <RegisterForm onSubmit={onSubmit}
        onSuccess={onSuccess} onError={onError} />;
};

export default RegisterRestaurant;
