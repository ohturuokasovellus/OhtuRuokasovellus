import { useFormik } from 'formik';
import QRGenerator from './QRGenerator';
import { Text, Pressable, View, TextInput } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const initialValues = {
    urlToBeGenerated: ''
};

/**
 * React page that shows a form. The form takes a url of type string,
 * and when the form is submitted,
 * the page displays a QR code generated from the url.
 * @returns {View}
 */
const QRForm = () => {
    let [urlView, setUrlView] = useState(null);

    // eslint-disable-next-line id-length
    const {t} = useTranslation(); // variable's name has to be t for it to work

    const onSubmit = urlObject => {
        const url = urlObject.urlToBeGenerated;
        setUrlView(QRGenerator(url));
    };
    
    const formik = useFormik({
        initialValues,
        onSubmit,
    });

    return (
        <View>
            <TextInput
                placeholder = {t('TYPE_A_URL')}
                value = {formik.values.urlToBeGenerated}
                onChangeText={formik.handleChange('urlToBeGenerated')}
            />
            <Pressable onPress={formik.handleSubmit}>
                <Text>{t('GENERATE_A_URL')}</Text>
            </Pressable>
            <View style={{ background: 'white', padding: '16px' }}>
                {urlView}
            </View>
        </View>
    );
};

export default QRForm;