import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Text, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Link, useNavigate } from '../Router';
import apiUrl from '../utils/apiUrl';

import createStyles from '../styles/styles';
import { Button, SmallButton } from './ui/Buttons';
import { FlexInput, PasswordInput } from './ui/InputFields';

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
    const {t} = useTranslation();
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

    const styles = createStyles();

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>
                    {t('ADD_USERS')}
                </Text>
                {formError ? (
                    <Text style={styles.error}>{formError}</Text>
                ) : null}
                {successMessage ? (
                    <View>
                        <Text style={styles.body}>{successMessage}</Text>
                        <View>
                            {results.map((result, index) => (
                                <Text
                                    key={index}
                                    style={result.status ===
                                    'user added successfully' ?
                                        styles.body : styles.error
                                    }>
                                    {result.email}: {result.status}
                                </Text>
                            ))}
                        </View>
                    </View>
                ) : (
                    <View>
                        {formik.values.emails.map((email, index) => (
                            <View key={index} style={styles.flexInputContainer}>
                                <FlexInput
                                    styles={styles}
                                    placeholder={t('EMAIL')}
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
                                    <SmallButton
                                        styles={styles}
                                        onPress={() => removeEmailInput(index)}
                                        text='–'
                                        id='remove-email-button'
                                    />
                                )}
                            </View>
                        ))}
                        <SmallButton
                            styles={styles}
                            onPress={addEmailInput}
                            text='+'
                            id='add-email-button'
                        />
                        <PasswordInput
                            styles={styles}
                            placeholder={t('CONFIRM_WITH_PASSWORD')}
                            value={formik.values.password}
                            onChangeText={formik.handleChange('password')}
                        />
                        <Button
                            styles={styles}
                            onPress={formik.handleSubmit}
                            text={t('ADD_USERS')}
                            id='add-users-button'
                        />
                    </View>
                )}
                <Link to='/home'>
                    <Text style={styles.link}>{t('BACK_TO_HOME')}</Text>
                </Link>
            </View>
        </ScrollView>
        
    );
};

/**
 * AddUser component for managing user addition.
 */
const AddUser = ({ userSession }) => {
    const navigate = useNavigate();
    const [isAuthorised, setIsAuthorised] = useState(true);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!userSession){
            setIsAuthorised(false);
            navigate('/login', { replace: true });
        }
        else if (!userSession.restaurantId) {
            setIsAuthorised(false);
            navigate('/home', { replace: true });
        }
    }, [navigate]);

    const onSubmit = async values => {
        const { emails, password } = values;
        try {
            const response = await axios.post(
                `${apiUrl}/add-users`,
                { emails, password },
                {
                    headers: {
                        Authorization: `Bearer ${userSession.token}`,
                    },
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
        <Text>
            401: unauthorised
        </Text>
    );
};

export default AddUser;
