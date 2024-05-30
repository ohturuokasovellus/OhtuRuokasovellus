import { Text, Pressable, View, TextInput, Image } from 'react-native';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import * as yup from 'yup';
import apiUrl from '../utils/apiUrl';
import { useNavigate } from '../Router';

const validationSchema = yup.object().shape({
    mealName: yup.string()
        .required('Name for the meal is required'),
    imageUri: yup.string()
        .required('Image of the meal is required'),
});

const initialValues = {
    mealName: '',
    imageUri: ''
};


const CreateMealForm = ({ onSubmit, onSuccess, onError }) => {
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
            {formik.touched.mealName && formik.errors.mealName && 
                <Text>{formik.errors.mealName}</Text>
            }
            <Pressable onPress={openImagePicker}>
                <Text>Valitse kuva laitteelta</Text>
            </Pressable>
            {formik.touched.imageUri && formik.errors.imageUri && 
                <Text>{formik.errors.imageUri}</Text>
            }
            <Pressable onPress={formik.handleSubmit}>
                <Text>Luo ateria</Text>
            </Pressable>
        </View>
    );
};

const CreateMeal = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!props.user) {
            navigate('/login');
        }
        else if (!props.user.restaurantId) {
            navigate('/');
        }
    });

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
