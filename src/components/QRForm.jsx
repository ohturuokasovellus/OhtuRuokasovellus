import { useState } from 'react';
import { useFormik } from 'formik';
import { Text, View, ScrollView } from 'react-native';

import QRGenerator from '../utils/QRGenerator';

import createStyles from '../styles/layout';
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
                <Text style={styles.h1}>Create a QR Code</Text>
                <Input
                    styles={styles}
                    placeholder='URL'
                    onChangeText={formik.handleChange('urlToBeGenerated')}
                />
                <Button
                    styles={styles}
                    onPress={formik.handleSubmit}
                    text='Generate QR Code'
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