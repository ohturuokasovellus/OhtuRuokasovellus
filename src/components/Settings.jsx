import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Platform } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import apiUrl from '../utils/apiUrl';
import { passwordValidationSchema } from '../utils/formValidationSchemas';
import { useNavigate } from '../Router';
import { deleteSession, getSession } from '../controllers/sessionController';

import createStyles from '../styles/styles';
import { Button, DeleteButton } from './ui/Buttons';
import { PasswordInput } from './ui/InputFields';
import { Slider } from './ui/Slider';

const DataExport = ({ styles, token }) => {
    const { t } = useTranslation();

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
            download(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const download = async data => {
        if (Platform.OS === 'web') {
            const uri = 'data:application/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(data));
            // eslint-disable-next-line no-undef
            const link = document.createElement('a');
            link.href = uri;
            link.download = 'ruokalaskuri.json';
            // eslint-disable-next-line no-undef
            document.body.appendChild(link);
            link.click();
            // eslint-disable-next-line no-undef
            document.body.removeChild(link);
        } else {
            const fileUrl = FileSystem.documentDirectory + 'ruokalaskuri.json';
            await FileSystem.writeAsStringAsync(fileUrl, JSON.stringify(data));
            await Sharing.shareAsync(fileUrl);
        }
    };

    return (
        <View>
            <Text style={styles.h3}>{t('EXPORT_USER_DATA')}</Text>
            <Text style={styles.body}>{t('EXPORT_USER_DATA_DESCRIPTION')}</Text>
            <Button
                styles={styles} onPress={getUserData}
                text={t('DOWNLOAD')} id='export-user-data'
            />
        </View>
    );
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

    const validationSchema = passwordValidationSchema;

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
        setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 5000);
    };
    
    return (
        <View style={styles.cardContainer}>
            <Text style={styles.h3}>{t('SELF_EVALUATION')}</Text>

            <View style={styles.primaryContainer}>
                <Text style={styles.body}>
                    {t('HOW_IMPORTANT_IS_CLIMATE')}
                </Text>
                <Slider
                    minVal={1}
                    maxVal={5}
                    value={climateValue}
                    onValueChange={setClimateValue}
                />
                <Text style={styles.body}>
                    {sliderLabels[climateValue]}
                </Text>
            </View>

            <View style={styles.primaryContainer}>
                <Text style={styles.body}>
                    {t('HOW_IMPORTANT_ARE_NUTRITIONAL_VALUES')}
                </Text>
                <Slider
                    minVal={1}
                    maxVal={5}
                    value={nutritionValue}
                    onValueChange={setNutritionValue}
                />
                <Text style={styles.body}>
                    {sliderLabels[nutritionValue]}
                </Text>
            </View>
            <Button
                text={t('SUBMIT')}
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
