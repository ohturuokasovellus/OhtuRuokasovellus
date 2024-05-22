import { Text, Pressable, View, TextInput, StyleSheet } from 'react-native';
import { Link, useNavigate } from '../Router';
import { useFormik } from 'formik';
import axios from 'axios';
import { deleteSession } from '../controllers/sessionController';
import { restaurantRegistrationValidationSchema } from '../utils/formValidationSchemas'; // Assuming you have a specific validation schema for restaurant registration
import { useState, useEffect } from 'react';

const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
};

const validationSchema = restaurantRegistrationValidationSchema;

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
                placeholder='Username'
                value={formik.values.username}
                onChangeText={formik.handleChange('username')}
                onBlur={formik.handleBlur('username')}
            />
            {formik.touched.username && formik.errors.username && (
                <Text style={styles.error}>{formik.errors.username}</Text>
            )}
            <TextInput
                style={styles.input}
                placeholder='Email'
                value={formik.values.email}
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
            />
            {formik.touched.email && formik.errors.email && (
                <Text style={styles.error}>{formik.errors.email}</Text>
            )}
            <TextInput
                style={styles.input}
                placeholder='Password'
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
                placeholder='Confirm Password'
                value={formik.values.confirmPassword}
                onChangeText={formik.handleChange('confirmPassword')}
                onBlur={formik.handleBlur('confirmPassword')}
                secureTextEntry
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <Text style={styles.error}>{formik.errors.confirmPassword}</Text>
            )}
            <TextInput
                style={styles.input}
                placeholder='Restaurant Name'
                value={formik.values.restaurantName}
                onChangeText={formik.handleChange('restaurantName')}
                onBlur={formik.handleBlur('restaurantName')}
            />
            {formik.touched.restaurantName && formik.errors.restaurantName && (
                <Text style={styles.error}>{formik.errors.restaurantName}</Text>
            )}
            <Pressable style={styles.button} onPress={formik.handleSubmit}>
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
            <Text>Already registered?</Text>
            <Link to='/login'>
                <Text>Login</Text>
            </Link>
        </View>
    );
};

const Register = ({ updateUser }) => {
    const navigate = useNavigate();
    useEffect(() => {
        deleteSession();
        updateUser(null);
    }, []);

    const onSubmit = async values => {
        const { username, email, password, restaurantName } = values;
        try {
            await axios.post(
                'http://localhost:8080/api/RestaurantRegistration',
                { username, email, password, restaurantName }
            );
        } catch (err) {
            const errorMessage = err.response?.data?.errorMessage || 'An unexpected error occurred';
            throw new Error(errorMessage);
        }
    };
    const onSuccess = () => {
        console.log('Registration successful!');
        navigate('/login');
    };
    const onError = err => {
        console.error('Registration error:', err);
    };

    return <RegisterForm onSubmit={onSubmit} onSuccess={onSuccess} onError={onError} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#F2D8D5',
        width: 400,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    button: {
        height: 50,
        backgroundColor: '#60AEBF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#153236',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: '#BF5687',
        marginBottom: 8,
    },
});

export default Register;
