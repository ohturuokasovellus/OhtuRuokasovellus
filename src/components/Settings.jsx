import { ScrollView, Text, View } from 'react-native';
import createStyles from '../styles/styles';
import { DeleteButton } from './ui/Buttons';
import { PasswordInput } from './ui/InputFields';
import { useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../utils/apiUrl';
import { getSession } from '../controllers/sessionController';
import { useNavigate } from '../Router';
import { useFormik } from 'formik';
import * as yup from 'yup';

const DataRemoval = ({ styles, token }) => {
    const removeAccount = async values => {
        try {
            const response = await axios.post(
                `${apiUrl}/remove-account`,
                { password: values.password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response);
        } catch (err) {
            console.error(err);
            alert('Tietojen poisto epäonnistui');
        }
    };

    const validationSchema = yup.object().shape({
        password: yup.string().required('Salasana vaaditaan'),
    });

    const formik = useFormik({
        validationSchema,
        initialValues: { password: '' },
        onSubmit: removeAccount,
    });

    return (
        <View>
            <Text style={styles.h3}>Poista käyttäjä ja tiedot</Text>
            <Text style={styles.body}>Syötä salasana vahvistukseksi.</Text>
            <PasswordInput
                styles={styles}
                placeholder='Salasana'
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
            />
            {formik.touched.password && formik.errors.password &&
                <Text style={styles.error}>{formik.errors.password}</Text>
            }
            <DeleteButton
                onPress={formik.handleSubmit}
                text='Poista' styles={styles}
            />
        </View>
    );
};

const Settings = () => {
    const navigate = useNavigate();
    const styles = createStyles();
    const userSession = getSession();

    useEffect(() => {
        if (!userSession) navigate('/login');
    }, []);

    if (!userSession) {
        return null;
    }

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <DataRemoval styles={styles} token={userSession.token} />
            </View>
        </ScrollView>
    );
};

export default Settings;
