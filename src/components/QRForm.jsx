import { useFormik } from 'formik';
import QRGenerator from './QRGenerator';
import { Text, Pressable, View, TextInput } from 'react-native'
import { useState } from 'react';

const initialValues = {
    urlToBeGenerated: ''
};

const QRForm = () => {
    let [urlView, setUrlView] = useState(null)
    const onSubmit = urlObject => {
        const url = urlObject.urlToBeGenerated;
        setUrlView(QRGenerator(url));
    }
    
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
            <View style={{ background: 'white', padding: '16px' }}>{urlView}</View>
        </View>
    );
}

export default QRForm;