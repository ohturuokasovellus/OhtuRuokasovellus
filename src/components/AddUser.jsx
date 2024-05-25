import React, { useState } from 'react';
import { Text, Pressable, View, TextInput } from 'react-native';
import { Link } from '../Router';
import axios from 'axios';
import { useFormik } from 'formik';
import { stylesForm } from '../styling/styles';

const styles = stylesForm;

const initialValues = {
    emails: [''],
    password: ''
};

const AddUserForm = ({ onSubmit, onSuccess, onError }) => {
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const formik = useFormik({
        initialValues,
        onSubmit: async values => {
            try {
                await onSubmit(values);
                setSuccessMessage('users have been successfully added!');
                formik.resetForm();
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
            {successMessage ? (
                <View>
                    <Text>{successMessage}</Text>
                </View>
            ) : null}
            {formik.values.emails.map((email, index) => (
                <View key={index} style={styles.addEmailContainer}>
                    <TextInput
                        style={styles.addEmailInput}
                        placeholder='email'
                        value={email}
                        onChangeText={text => {
                            const updatedEmails = [...formik.values.emails];
                            updatedEmails[index] = text;
                            formik.setFieldValue('emails', updatedEmails);
                        }}
                    />
                    {formik.values.emails.length > 1 && (
                        <Pressable
                            style={styles.smallButton}
                            onPress={() => removeEmailInput(index)}
                        >
                            <Text style={styles.smallButtonText}>–</Text>
                        </Pressable>
                    )}
                </View>
            ))}
            <Pressable style={styles.smallButton} onPress={addEmailInput}>
                <Text style={styles.smallButtonText}>+</Text>
            </Pressable>
            <TextInput
                style={styles.input}
                placeholder='confirm with password'
                secureTextEntry
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
            />
            <Pressable style={styles.button} onPress={formik.handleSubmit}>
                <Text style={styles.buttonText}>add users</Text>
            </Pressable>
            <Link to='/'>
                <Text>back to home</Text>
            </Link>
        </View>
    );
};
const AddUser = ( props ) => {
    const onSubmit = async values => {
        const { emails, password } = values;
        const restaurantId = props.user.restaurantId;
        const username = props.user.username;
        try {
            await axios.post(
                'http://localhost:8080/api/add-users',
                { emails, restaurantId, username, password }
            );
        } catch (err) {
            const errorMessage = err.response?.data?.errorMessage ||
                'an unexpected error occurred';
            throw new Error(errorMessage);
        }
    };
    const onSuccess = () => {
        console.log('User has been added!');
    };
    const onError = err => {
        console.error('User addition failed:', err);
    };

    return <AddUserForm onSubmit={onSubmit}
        onSuccess={onSuccess} onError={onError} />;
};

export default AddUser;
