import { useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Text, View, ScrollView } from 'react-native';

import QRGenerator from '../utils/QRGenerator';

import createStyles from '../styles/styles';
import { Input } from './ui/InputFields';
import { Button } from './ui/Buttons';

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

    const {t} = useTranslation();

    const onSubmit = urlObject => {
        const url = urlObject.urlToBeGenerated;
        setUrlView(QRGenerator(url));
    };
    
    const formik = useFormik({
        initialValues,
        onSubmit,
    });

    const styles = createStyles();

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>{t('QR_FORM')}</Text>
                <Input
                    styles={styles}
                    placeholder={t('TYPE_A_URL')}
                    onChangeText={formik.handleChange('urlToBeGenerated')}
                />
                <Button
                    styles={styles}
                    onPress={formik.handleSubmit}
                    text={t('GENERATE_A_QR')}
                    id='generate-qr-button'
                />
                <View style={styles.qrContainer}>
                    {urlView}
                </View>
            </View>
        </ScrollView>
    );
};

export default QRForm;