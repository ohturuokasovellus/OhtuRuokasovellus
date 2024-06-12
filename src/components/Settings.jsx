import { ScrollView, Text, View } from 'react-native';
import createStyles from '../styles/styles';
import { DeleteButton } from './ui/Buttons';
import { PasswordInput } from './ui/InputFields';
import { useEffect, useState } from 'react';
import axios from 'axios';
import apiUrl from '../utils/apiUrl';
import { deleteSession, getSession } from '../controllers/sessionController';
import { useNavigate } from '../Router';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

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
            <Text style={[styles.body, { marginBottom: 5 }]}>{t('DELETE_USER_DESCRIPTION')}</Text>
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
                <DataRemoval styles={styles} token={userSession.token} />
            </View>
        </ScrollView>
    );
};

export default Settings;
