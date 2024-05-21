import { useFormik } from 'formik';
import QRGenerator from './QRGenerator';
import { Text, Pressable, View, TextInput } from 'react-native';
import { useState } from 'react';

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

    return (
        <View>
            <TextInput
                placeholder = 'Type a URL'
                value = {formik.values.urlToBeGenerated}
                onChangeText={formik.handleChange('urlToBeGenerated')}
            />
            <Pressable onPress={formik.handleSubmit}>
                <Text>Generate a URL</Text>
            </Pressable>
            <View style={{ background: 'white', padding: '16px' }}>
                {urlView}
            </View>
        </View>
    );
};

export default QRForm;