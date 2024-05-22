import { Text, Pressable, View, TextInput, Image } from 'react-native';
import { useFormik } from 'formik';
import { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const initialValues = {
    mealName: '',
    imageUri: ''
};

const CreateMealForm = ({ onSubmit, onSuccess, onError }) => {
    const [formError, setFormError] = useState('');

    const formik = useFormik({
        initialValues,
        onSubmit: async values => {
            try {
                await onSubmit(values);
                onSuccess();
            } catch (err) {
                onError(err);
                setFormError(err.message);
                formik.resetForm();
            }
        },
    });

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
            maxWidth: 1024,
            maxHeight: 1024,
        };
    
        launchImageLibrary(options, handleResponse);
    };

    const handleResponse = (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('Image picker error: ', response.error);
        } else {
            // length 885764
            // w h 1920 1080
            const imageUri = 'data:image/jpeg;base64,' + response.assets[0].base64;
            formik.setFieldValue('imageUri', imageUri);
            console.log('image picked', imageUri.length, response.assets[0].width, response.assets[0].height);
        }
    };

    return (
        <View>
            {formik.values.imageUri ? (
                <Image
                    source={{ uri: formik.values.imageUri }}
                    style={{ width: 100, height: 100 }}
                />
            ) : null}
            {formError ? (
                <Text>{formError}</Text>
            ) : null}
            <TextInput
                placeholder='Aterian nimi'
                value={formik.values.mealName}
                onChangeText={formik.handleChange('mealName')}
            />
            <Pressable onPress={openImagePicker}>
                <Text>Valitse kuva laitteelta</Text>
            </Pressable>
            <Pressable onPress={formik.handleSubmit}>
                <Text>Luo ateria</Text>
            </Pressable>
        </View>
    );
};

const CreateMeal = () => {
    const onSubmit = async values => {
        const { mealName, imageUri } = values;
        try {
            const response = await axios.post(
                'http://localhost:8080/api/meals',
                { mealName }
            );
            const mealId = response.data.mealId;
            await axios.post(
                `http://localhost:8080/api/meals/images/${mealId}`,
                imageUri,
                {
                    headers: { 'Content-Type': 'image/jpeg' },
                },
            );
        } catch (err) {
            const errorMessage = err.response?.data?.errorMessage ||
                'an unexpected error occurred';
            throw new Error(errorMessage);
        }
    };
    const onSuccess = () => {
        console.log('meal creation successful!');
    };
    const onError = err => {
        console.error('meal creation error:', err);
    };

    return <CreateMealForm onSubmit={onSubmit}
        onSuccess={onSuccess} onError={onError} />;
};

export default CreateMeal;
