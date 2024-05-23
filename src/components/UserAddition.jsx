import React, { useState, useEffect } from 'react';
import { Text, Pressable, View, TextInput } from 'react-native';
import { Link, useNavigate } from '../Router';
import axios from 'axios';
import { deleteSession } from '../controllers/sessionController';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { stylesRegister } from '../styling/styles';

const styles = stylesRegister;

const initialValues = {
    emails: [''], // Initial array with one email input
};

const validationSchema = yup.object().shape({
    emails: yup.array().of(
        yup.string().email('Invalid email').required('Email is required')
    ),
});

/**
 * Render a form for user registration, validate using a yup schema.
 * On submission, send registration data to the server.
 * 
 * @param {Function} onSubmit - handle form submission;
 *  args: form values (emails)
 * @param {Function} onSuccess - redirect to restaurant homepage if successful
 * @param {Function} onError - log error message
 * 
 * @returns {React.JSX.Element}
 */

const AddUserForm = ({ onSubmit, onSuccess, onError }) => {
    const [formError, setFormError] = useState('');
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async values => {
            try {
                await onSubmit(values.emails);
                onSuccess();
            } catch (err) {
                onError(err);
                setFormError(err.message);
                formik.resetForm();
            }
        },
    });

    const addEmailInput = () => {
        formik.setFieldValue('emails', [...formik.values.emails, '']);
    };

    const removeEmailInput = index => {
        const updatedEmails = [...formik.values.emails];
        updatedEmails.splice(index, 1);
        formik.setFieldValue('emails', updatedEmails);
    };

    return (
        <View style={styles.container}>
            {formError ? (
                <Text style={styles.error}>{formError}</Text>
            ) : null}
            {formik.values.emails.map((email, index) => (
                <View key={index} style={styles.emailInputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Email'
                        value={email}
                        onChangeText={text => {
                            const updatedEmails = [...formik.values.emails];
                            updatedEmails[index] = text;
                            formik.setFieldValue('emails', updatedEmails);
                        }}
                    />
                    {formik.values.emails.length > 1 && (
                        <Pressable
                            style={styles.removeButton}
                            onPress={() => removeEmailInput(index)}
                        >
                            <Text style={styles.removeButtonText}>-</Text>
                        </Pressable>
                    )}
                </View>
            ))}
            <Pressable style={styles.addButton} onPress={addEmailInput}>
                <Text style={styles.addButtonText}>+ Add Email</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={formik.handleSubmit}>
                <Text style={styles.buttonText}>Add</Text>
            </Pressable>
        </View>
    );
};
const AddUser = ( props ) => {
    const navigate = useNavigate();
    useEffect(() => {
        deleteSession();
    }, []);

    const onSubmit = async values => {
        const { email } = values;
        const { restaurantID } = props.user.restaurantId;
        try {
            await axios.post(
                'http://localhost:8080/api/add-users',
                { email, restaurantID }
            );
        } catch (err) {
            const errorMessage = err.response?.data?.errorMessage ||
                'an unexpected error occurred';
            throw new Error(errorMessage);
        }
    };
    const onSuccess = () => {
        console.log('User has been added!');
        navigate('/');
    };
    const onError = err => {
        console.error('User addition failed:', err);
    };

    return <AddUserForm onSubmit={onSubmit}
        onSuccess={onSuccess} onError={onError} />;
};

export default AddUser;
