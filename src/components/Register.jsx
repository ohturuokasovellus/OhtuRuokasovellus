import { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Text, View, ScrollView, Linking } from 'react-native';

import { Link, useNavigate } from '../Router';
import { createSession } from '../controllers/sessionController';
import apiUrl from '../utils/apiUrl';
import { registrationValidationSchema } from '../utils/formValidationSchemas';

import createStyles from '../styles/styles';
import { Button } from './ui/Buttons';
import { Input, PasswordInput } from './ui/InputFields';
import { Dropdown } from './ui/Dropdown';
import { CheckboxVariant } from './ui/Checkbox';
import { getPageURL } from '../utils/getPageUrl';

const initialValues = {
    username: '',
    email: '',
    birthYear: '',
    gender: '',
    education: '',
    income: '',
    password: '',
    confirmPassword: '',
    terms: false,
    privacy: false,
    isRestaurant: false,
    restaurantName: '',
};

const validationSchema = registrationValidationSchema;

/**
 * Render a form for user registration, validate using a yup schema.
 * On submission, send registration data to the server.
 * 
 * @param {Function} onSubmit - handle form submission;
 * @param {Function} onSuccess - redirect to login if successful
 * @param {Function} onError - log error message
 * 
 * @returns {React.JSX.Element}
 */

const RegisterForm = ({ onSubmit }) => {
    const {t} = useTranslation();
    const [formError, setFormError] = useState('');
    const [showRestaurantName, setShowRestaurantName] = useState(false);
    const [termsPDFURL, setTermsPDFURL] = useState('');
    const [privacyPDFURL, setPrivacyPDFURL] = useState('');

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async values => {
            try {
                await onSubmit(values);
            } catch (err) {
                setFormError(err.message);
                void formik.setFieldValue('password', '');
                void formik.setFieldValue('confirmPassword', '');
            }
        },
    });

    useEffect(() => {
        const fetchWebpageURL = async () => {
            const webpageURL = await getPageURL();
            if (webpageURL) {
                const urlToTermsPDF = webpageURL+'/terms.pdf';
                const urlToPrivacyPDF = webpageURL+'/privacy.pdf';
                setTermsPDFURL(urlToTermsPDF);
                setPrivacyPDFURL(urlToPrivacyPDF);
            } else {
                console.log('couldnt get webpage URL');
            }
        };

        void fetchWebpageURL();
    }, []);

    const styles = createStyles();

    const gender = [
        {key: 'man', value: t('MAN')},
        {key: 'woman', value: t('WOMAN')},
        {key: 'other', value: t('OTHER')},
    ];
    const education = [
        {key: 'primary', value: t('PRIMARY_EDUCATION')},
        {key: 'secondary', value: t('SECONDARY_EDUCATION')},
        {key: 'vocational specialised', value: t('VOCATIONAL_EDUCATION')},
        {key: 'lowest tertiary', value: t('LOWEST_TERTIARY_LEVEL')},
        {key: 'bachelors', value: t('BACHELORS_DEGREE')},
        {key: 'masters', value: t('MASTERS_DEGREE')},
        {key: 'doctoral', value: t('DOCTORAL')},
    ];
    const income = [
        {key: 'below 1500', value: '<1500 €/kk'},
        {key: '1500-2500', value: '1500–2500 €/kk'},
        {key: '2500-3500', value: '2500–3500 €/kk'},
        {key: '3500-4500', value: '3500–4500 €/kk'},
        {key: '4500-5500', value: '4500–5500 €/kk'},
        {key: 'over 5500', value: '>5500 €/kk'},
    ];
    
    const openTCLink = () => {
        void Linking.openURL(termsPDFURL);
    };
    const openPrivacyLink = () => {
        void Linking.openURL(privacyPDFURL);
    };

    const renderCheckboxTitle = (isTerms) => {
        const title = isTerms ?
            t('TC_PRIVACY_CHECK.T_AND_C') :
            t('TC_PRIVACY_CHECK.PRIVACY_POLICY');
        const openLink = isTerms ? openTCLink : openPrivacyLink;

        return (
            <Text style={styles.body}>
                {t('TC_PRIVACY_CHECK.ACCEPTED')}
                <Text style={styles.link} onPress={openLink} 
                    id={isTerms ? 'link-to-terms' : 'link-to-privacy'}>
                    {title}
                </Text>
            </Text>
        );
    };

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>
                    {t('REGISTER')}
                </Text>
                {formError ? (
                    <Text style={styles.error}>{formError}</Text>
                ) : null}
                <CheckboxVariant
                    styles={styles}
                    title={t('REGISTER_RESTAURANT')}
                    checked={formik.values.isRestaurant}
                    onPress={() => {
                        const newValue = !formik.values.isRestaurant;
                        void formik.setFieldValue('isRestaurant', newValue);
                        setShowRestaurantName(newValue);
                    }}
                    id='restaurant-checkbox'
                />
                {showRestaurantName && (
                    <Input
                        styles={styles}
                        placeholder={t('RESTAURANT_NAME')}
                        value={formik.values.restaurantName}
                        onChangeText={formik.handleChange('restaurantName')}
                        onBlur={formik.handleBlur('restaurantName')}
                        id='restaurant-name-input'
                    />
                )}
                {formik.touched.restaurantName &&
                formik.errors.restaurantName && (
                    <Text style={styles.error}>
                        {t(formik.errors.restaurantName)}
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
                    <Text style={styles.error}>
                        {t(formik.errors.username)}
                    </Text>
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
                    <Text style={styles.error}>{t(formik.errors.email)}</Text>
                )}
                <Input
                    styles={styles}
                    placeholder={t('BIRTH_YEAR')}
                    value={formik.values.birthYear}
                    onChangeText={formik.handleChange('birthYear')}
                    onBlur={formik.handleBlur('birthYear')}
                    id='birth-year-input'
                />
                {formik.touched.birthYear && formik.errors.birthYear && (
                    <Text style={styles.error}>
                        {t(formik.errors.birthYear)}
                    </Text>
                )}
                <Dropdown
                    styles={styles}
                    search={false}
                    placeholder={t('GENDER')}
                    data={gender}
                    setSelected={(val) => formik
                        .setFieldValue('gender', val)}
                    save='key'
                    id='gender-input'
                />
                {formik.touched.gender && formik.errors.gender && (
                    <Text style={styles.error}>
                        {t(formik.errors.gender)}
                    </Text>
                )}
                <Dropdown
                    styles={styles}
                    search={false}
                    placeholder={t('EDUCATION')}
                    data={education}
                    setSelected={(val) => formik
                        .setFieldValue('education', val)}
                    save='key'
                    id='education-input'
                />
                {formik.touched.education && formik.errors.education && (
                    <Text style={styles.error}>
                        {t(formik.errors.education)}
                    </Text>
                )}
                <Dropdown
                    styles={styles}
                    search={false}
                    placeholder={t('INCOME_MO')}
                    data={income}
                    setSelected={(val) => formik
                        .setFieldValue('income', val)}
                    save='key'
                    id='income-input'
                />
                {formik.touched.income && formik.errors.income && (
                    <Text style={styles.error}>
                        {t(formik.errors.income)}
                    </Text>
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
                    <Text style={styles.error}>
                        {t(formik.errors.password)}
                    </Text>
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
                <CheckboxVariant
                    styles={styles}
                    title={renderCheckboxTitle(true)}
                    checked={formik.values.terms}
                    onPress={() => formik.setFieldValue(
                        'terms', !formik.values.terms
                    )}
                    id='terms-checkbox'
                />
                {formik.errors.terms && formik.touched.terms && (
                    <Text style={styles.error}>
                        {t(formik.errors.terms)}
                    </Text>
                )}
                <CheckboxVariant
                    styles={styles}
                    title={renderCheckboxTitle(false)}
                    checked={formik.values.privacy}
                    onPress={() => formik.setFieldValue(
                        'privacy', !formik.values.privacy
                    )}
                    id='privacy-checkbox'
                />
                {formik.errors.privacy && formik.touched.privacy && (
                    <Text style={styles.error}>
                        {t(formik.errors.privacy)}
                    </Text>
                )}
                <Button
                    styles={styles}
                    onPress={formik.handleSubmit}
                    text={t('REGISTER')}
                    id='register-button'
                />
                <Text style={styles.body}>{t('ALREADY_REGISTERED')}</Text>
                <Link to='/login'>
                    <Text style={styles.link} id='login-link'>
                        {t('LOGIN')}
                    </Text>
                </Link>
            </View>
        </ScrollView>
    );
};

const Register = ({ userSession, updateUser }) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (userSession) {
            navigate('/home');
        }
    }, []);

    const onSubmit = async values => {
        const {
            username, email, password,
            birthYear, gender, education,
            income, isRestaurant, restaurantName
        } = values;

        // create a new account
        try {
            await axios.post(
                `${apiUrl}/register`,
                {
                    username, email, password, birthYear, gender,
                    education, income, isRestaurant,
                    restaurantName: isRestaurant ? restaurantName : null
                }
            );
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.errorMessage ||
                'an unexpected error occurred';
            throw new Error(errorMessage);
        }

        // log in to the freshly created account
        try {
            const response = await axios.post(
                `${apiUrl}/login`,
                { username, password }
            );
            const userData = {
                username: response.data.username,
                token: response.data.token,
                restaurantId: response.data.restaurantId,
            };
            await createSession(userData);
            updateUser(userData);
            navigate('/home');
        } catch (err) {
            console.error(err);
            // account was created but login failed -> redirect to /login
            navigate('/login');
        }
    };

    return <RegisterForm onSubmit={onSubmit} />;
};

export default Register;
