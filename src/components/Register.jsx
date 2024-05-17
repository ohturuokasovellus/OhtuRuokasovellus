import { Text, Pressable, View, TextInput, StyleSheet } from 'react-native';
import { Link, useNavigate } from '../Router';
import { useFormik } from 'formik';
import axios from 'axios';
import { deleteSession } from '../controllers/sessionController'
import { useState, useEffect } from "react";
import * as yup from 'yup';

const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
};

// Adds a custom validation method to Yup for validating email addresses.
// Matches the regex used in backend.
// https://github.com/jquense/yup#stringemailmessage-string--function-schema
yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message,
      name: 'email',
      excludeEmptyString: true,
    });
  });

const validationSchema = yup.object().shape({
    username: yup.string()
    .min(3, 'username must be at least 3 characters')
    .max(32, 'username cannot exceed 32 characters')
    .required('username is required'),
    email: yup.string().email('invalid email').required('email is required'),
    password: yup
        .string()
        .min(8, 'password must be at least 8 characters')
        .max(32, 'password cannot exceed 32 characters')
        .matches(/[a-z]/, 'password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'password must contain at least one uppercase letter')
        .matches(/\d/, 'password must contain at least one number')
        .matches(/[@$!%&€\-_:#+]/, 'password must contain at least one special character')
        .required('password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'passwords must match')
        .required('password confirmation is required'),
});

/**
 * Render a form for user registration, validate using a yup schema.
 * On submission, send registration data to the server.
 * 
 * @param {Function} onSubmit - handle form submission; args: form values (username, email, password)
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
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <Text style={styles.error}>{formik.errors.confirmPassword}</Text>
            )}
            <Pressable style={styles.button} onPress={formik.handleSubmit}>
                <Text style={styles.buttonText}>register</Text>
            </Pressable>
            <Text>already registered?</Text>
            <Link to='/login'>
                <Text>login</Text>
            </Link>
        </View>
    );
};

const Register = ({ updateUser }) => {
    const navigate = useNavigate();
    useEffect(() => {
        deleteSession();
        updateUser(null);
    }, [])

    const onSubmit = async values => {
        const { username, email, password } = values;
        try {
            await axios.post('http://localhost:8080/api/register', { username, email, password });
        } catch (err) {
            const errorMessage = err.response?.data?.errorMessage || 'an unexpected error occurred';
            throw new Error(errorMessage);
        }
    };
    const onSuccess = () => {
        console.log('registration successful!');
        navigate('/login')
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

export default Register
