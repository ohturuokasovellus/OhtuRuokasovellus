import { useFormik } from 'formik';
import QRGenerator from './QRGenerator';
import { Text, Pressable, View, TextInput } from 'react-native'
import QRCode from "react-qr-code";

const initialValues = {
    urlToBeGenerated: ''
};

const QRForm = () => {
    let urlView = null

    const onSubmit = urlObject => {
        const url = urlObject.urlToBeGenerated;
        urlView = QRGenerator(url);
        console.log(urlView)
        console.log(<QRCode value={formik.values.urlToBeGenerated} />)
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
            <View style={{ background: 'white', padding: '16px' }}><QRCode value={formik.values.urlToBeGenerated} /></View>
        </View>
    );
}

export default QRForm;