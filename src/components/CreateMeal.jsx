import { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Text, View, Image, ScrollView} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import apiUrl from '../utils/apiUrl';
import { mealValidationSchema } from '../utils/formValidationSchemas';

import createStyles from '../styles/styles';
import { Button } from './ui/Buttons';
import { Input } from './ui/InputFields';

const initialValues = {
    mealName: '',
    imageUri: ''
};

const validationSchema = mealValidationSchema;

const CreateMealForm = ({ onSubmit, onSuccess, onError }) => {
    const {t} = useTranslation();
    const [formError, setFormError] = useState('');

    const formik = useFormik({
        initialValues,
        validationSchema,
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
            const imageBase64 = response.assets[0].base64;
            const imageUri = `data:image/jpeg;base64,${imageBase64}`;
            formik.setFieldValue('imageUri', imageUri);
        }
    };

    const styles = createStyles();

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>Luo ateria</Text>
                {formik.values.imageUri ? (
                    <Image
                        source={{ uri: formik.values.imageUri }}
                        style={{ width: 100, height: 100 }}
                    />
                ) : null}
                {formError ? (
                    <Text style={styles.error}>{formError}</Text>
                ) : null}
                <Input
                    styles={styles}
                    placeholder={t('NAME_OF_THE_MEAL')}
                    value={formik.values.mealName}
                    onChangeText={formik.handleChange('mealName')}
                    id='meal-name-input'
                />
                {formik.touched.mealName && formik.errors.mealName && 
                <Text style={styles.error}>{formik.errors.mealName}</Text>
                }
                <Button
                    styles={styles}
                    onPress={openImagePicker}
                    text={t('SELECT_A_IMAGE_FROM_DEVICE')}
                    id='image-picker-button'
                />
                {formik.touched.imageUri && formik.errors.imageUri &&
                <Text style={styles.error}>{formik.errors.imageUri}</Text>
                }
                <Button
                    styles={styles}
                    onPress={formik.handleSubmit}
                    text={t('CREATE_A_MEAL')}
                    id='create-meal-button'
                />
            </View>
        </ScrollView>
    );
};

const CreateMeal = () => {
    const onSubmit = async values => {
        const { mealName, imageUri } = values;
        try {
            const response = await axios.post(
                `${apiUrl}/meals`,
                { mealName }
            );
            const mealId = response.data.mealId;
            await axios.post(
                `${apiUrl}/meals/images/${mealId}`,
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
