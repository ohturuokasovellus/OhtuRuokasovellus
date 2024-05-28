import { Text, Pressable, View, TextInput } from 'react-native';
import { Link, useNavigate } from '../Router';
import { useFormik } from 'formik';
import axios from 'axios';
import { deleteSession } from '../controllers/sessionController';
import { restaurantValidationSchema }
    from '../utils/formValidationSchemas';
import { useState, useEffect } from 'react';
import { stylesForm } from '../styling/styles';

const styles = stylesForm;

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

    return (
        <View style={styles.container}>
            {formError ? (
                <Text style={styles.error}>{formError}</Text>
            ) : null}
            <TextInput
                style={styles.input}
                placeholder='name of the restaurant'
                value={formik.values.restaurantName}
                onChangeText={formik.handleChange('restaurantName')}
                onBlur={formik.handleBlur('restaurantName')}
            />
            {formik.touched.restaurantName && formik.errors.restaurantName && (
                <Text style={styles.error}>{formik.errors.restaurantName}</Text>
            )}
            <TextInput
                style={styles.input}
                placeholder='username'
                value={formik.values.username}
                onChangeText={formik.handleChange('username')}
                onBlur={formik.handleBlur('username')}
            />
            {formik.touched.username && formik.errors.username && (
                <Text style={styles.error}>{formik.errors.username}</Text>
            )}
            <TextInput
                style={styles.input}
                placeholder='email'
                value={formik.values.email}
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
            />
            {formik.touched.email && formik.errors.email && (
                <Text style={styles.error}>{formik.errors.email}</Text>
            )}
            <TextInput
                style={styles.input}
                placeholder='password'
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                secureTextEntry
            />
            {formik.touched.password && formik.errors.password && (
                <Text style={styles.error}>{formik.errors.password}</Text>
            )}
            <TextInput
                style={styles.input}
                placeholder='confirm password'
                value={formik.values.confirmPassword}
                onChangeText={formik.handleChange('confirmPassword')}
                onBlur={formik.handleBlur('confirmPassword')}
                secureTextEntry
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword &&
                <Text style={styles.error}>
                    {formik.errors.confirmPassword}
                </Text>
            }
            <Pressable style={styles.button} onPress={formik.handleSubmit}>
                <Text style={styles.buttonText}>register</Text>
            </Pressable>
            <Text>already registered?</Text>
            <Link to='/login'>
                <Text>Login</Text>
            </Link>
        </View>
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
                'http://localhost:8080/api/register-restaurant',
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
