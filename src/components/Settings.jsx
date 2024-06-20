import { ScrollView, Text, View } from 'react-native';
import createStyles from '../styles/styles';
import { Button, DeleteButton } from './ui/Buttons';
import { PasswordInput } from './ui/InputFields';
import { useEffect, useState } from 'react';
import axios from 'axios';
import apiUrl from '../utils/apiUrl';
import { deleteSession, getSession } from '../controllers/sessionController';
import { useNavigate } from '../Router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Slider from '@react-native-community/slider';

const DataExport = ({ styles, token }) => {
    const getUserData = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/export-user-data`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <View>
            <Text style={styles.h3}>Vie tiedot</Text>
            <Text style={styles.body}>Voit ladata sinusta kerätyt tiedot.</Text>
            <Button styles={styles} text='Tallenna' onPress={getUserData} />
        </View>
    )
};

const DataRemoval = ({ styles, token }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const removeAccount = async values => {
        setFormError(null);
        try {
            await axios.post(
                `${apiUrl}/remove-account`,
                { password: values.password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            deleteSession();
            navigate('/register');
        } catch (err) {
            console.error(err);
            setFormError(t('FAILED_TO_DELETE_DATA'));
        }
    };

    const validationSchema = yup.object().shape({
        password: yup.string().required(t('PASSWORD_IS_REQUIRED')),
    });

    const [formError, setFormError] = useState(null);
    const formik = useFormik({
        validationSchema,
        initialValues: { password: '' },
        onSubmit: removeAccount,
    });

    return (
        <View>
            <Text style={styles.h3}>{t('DELETE_USER_AND_DATA')}</Text>
            <Text style={[styles.body, { marginBottom: 5 }]}>
                {t('DELETE_USER_DESCRIPTION')}
            </Text>
            <PasswordInput
                styles={styles}
                placeholder={t('PASSWORD')}
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                id='account_removal_password'
            />
            {formik.touched.password && formik.errors.password &&
                <Text style={styles.error}>{formik.errors.password}</Text>
            }
            {formError && <Text style={styles.error}>{formError}</Text>}
            <DeleteButton
                onPress={formik.handleSubmit}
                text={t('DELETE')} styles={styles}
                id='account_removal_button'
            />
        </View>
    );
};

/**
 * Form for submitting self evaluation.
 * @param {object} styles
 * @param {string} token user token
 * @returns {JSX.Element} 
 */
const SelfEvaluationForm = ({ styles, token }) => {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [climateValue, setClimateValue] = useState(3);
    const [nutritionValue, setNutritionValue] = useState(3);

    const sliderLabels = [
        null,
        t('NOT_IMPORTANT_AT_ALL'),
        t('SOMEWHAT_UNIMPORTANT'),
        t('IN_THE_MIDDLE'),
        t('SOMEWHAT_IMPORTANT'),
        t('VERY_IMPORTANT')
    ];

    const handleEvalSubmit = async () => {
        setError(null);
        try {
            await axios.post(
                `${apiUrl}/evaluation`,
                { climateValue, nutritionValue },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess(t('EVALUATION_SENT'));
        } catch (err) {
            console.error(err);
            setError(t('FAILED_TO_SUBMIT'));
        }
    };
    
    return (
        <View style={styles.evaluationContainer}>
            <Text style={styles.h3}>{t('SELF_EVALUATION')}</Text>

            <View style={styles.questionContainer}>
                <Text style={styles.body}>
                    {t('HOW_IMPORTANT_IS_CLIMATE')}
                </Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={climateValue}
                    onValueChange={value => setClimateValue(value)}
                    minimumTrackTintColor="#0C749C"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#0C749C"
                />
                <Text style={styles.body}>
                    {sliderLabels[climateValue]}
                </Text>
            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.body}>
                    {t('HOW_IMPORTANT_ARE_NUTRITIONAL_VALUES')}
                </Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={nutritionValue}
                    onValueChange={value => setNutritionValue(value)}
                    minimumTrackTintColor="#0C749C"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#0C749C"
                />
                <Text style={styles.body}>
                    {sliderLabels[nutritionValue]}
                </Text>
            </View>
            <Button
                styles={styles} text={t('SUBMIT')}
                onPress={() => handleEvalSubmit()}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}
        </View>
    );
};

const Settings = () => {
    const navigate = useNavigate();
    const styles = createStyles();
    const userSession = getSession();
    const { t } = useTranslation();

    useEffect(() => {
        if (!userSession) navigate('/login');
    }, []);

    if (!userSession) {
        return null;
    }

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>{t('SETTINGS')}</Text>
                <SelfEvaluationForm
                    styles={styles} token={userSession.token}
                />
                <DataExport styles={styles} token={userSession.token} />
                <DataRemoval styles={styles} token={userSession.token} />
            </View>
        </ScrollView>
    );
};

export default Settings;
