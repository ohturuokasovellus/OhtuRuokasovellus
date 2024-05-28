import React, { useEffect, useState } from 'react';
import { Text, Pressable, View, TextInput } from 'react-native';
import { Link, useNavigate } from '../Router';
import axios from 'axios';
import { useFormik } from 'formik';
import { stylesForm } from '../styling/styles';

const styles = stylesForm;

const initialValues = {
    emails: [''],
    password: ''
};

/**
 * Form for adding new restaurant users.
 * @param {Function} onSubmit
 * @param {Function} onSuccess
 * @param {Function} onError
 * @param {Array} results - array containing processed emails and their statuses
 * @returns {JSX.Element} 
 */

const AddUserForm = ({ onSubmit, onSuccess, onError, results }) => {
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const formik = useFormik({
        initialValues,
        onSubmit: async values => {
            try {
                await onSubmit(values);
                setSuccessMessage('users have been successfully processed!');
                onSuccess();
            } catch (err) {
                onError(err);
                setFormError(err.message);
                if (formError !== 'invalid password') {
                    formik.resetForm();
                }
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
                    <View>
                        {results.map((result, index) => (
                            <Text
                                key={index}
                                style={result.status ===
                                    'user added successfully' ?
                                    styles.success : styles.error
                                }>
                                {result.email}: {result.status}
                            </Text>
                        ))}
                    </View>
                </View>
            ) : (
                <View>
                    {formik.values.emails.map((email, index) => (
                        <View key={index} style={styles.addEmailContainer}>
                            <TextInput
                                style={styles.addEmailInput}
                                placeholder='email'
                                value={email}
                                onChangeText={text => {
                                    const updatedEmails =
                                    [...formik.values.emails];
                                    updatedEmails[index] = text;
                                    formik.setFieldValue(
                                        'emails', updatedEmails
                                    );
                                }}
                            />
                            {formik.values.emails.length > 1 && (
                                <Pressable
                                    style={styles.smallButton}
                                    onPress={() => removeEmailInput(index)}>
                                    <Text style={styles.smallButtonText}>
                                        –
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    ))}
                    <Pressable
                        style={styles.smallButton}
                        onPress={addEmailInput}>
                        <Text style={styles.smallButtonText}>+</Text>
                    </Pressable>
                    <TextInput
                        style={styles.input}
                        placeholder='confirm with password'
                        secureTextEntry
                        value={formik.values.password}
                        onChangeText={formik.handleChange('password')}
                    />
                    <Pressable
                        style={styles.button}
                        onPress={formik.handleSubmit}>
                        <Text style={styles.buttonText}>add users</Text>
                    </Pressable>
                </View>
            )}
            <Link to='/'>
                <Text>back to home</Text>
            </Link>
        </View>
    );
};

/**
 * AddUser component for managing user addition.
 */

const AddUser = (props) => {
    const navigate = useNavigate();
    const [isAuthorised, setIsAuthorised] = useState(true);
    const [results, setResults] = useState([]);
    const user = props.user;

    useEffect(() => {
        if (!user || !user.restaurantId) {
            setIsAuthorised(false);
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const onSubmit = async values => {
        const { emails, password } = values;
        try {
            const response = await axios.post(
                'http://localhost:8080/api/add-users',
                {
                    emails,
                    restaurantId: user.restaurantId,
                    username: user.username,
                    password
                }
            );
            setResults(response.data.results);
        } catch (err) {
            const errorMessage = err.response?.data?.error ||
            'an unexpected error occurred';
            throw new Error(errorMessage);
        }
    };

    const onSuccess = () => {
        console.log('success');
    };

    const onError = err => {
        console.error('error:', err);
    };

    return isAuthorised ? (
        <AddUserForm
            onSubmit={onSubmit}
            onSuccess={onSuccess}
            onError={onError}
            results={results}
        />
    ) : (
        <Text style={styles.error}>
            401: unauthorised
        </Text>
    );
};

export default AddUser;
