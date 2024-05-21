import { Text, Pressable, View, TextInput, Image } from 'react-native';
import { useFormik } from 'formik';
import { useState } from 'react';
import {launchImageLibrary} from 'react-native-image-picker';

const initialValues = {
    mealName: ''
};

const CreateMealForm = ({ onSubmit, onSuccess, onError }) => {
    const [formError, setFormError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

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
            includeBase64: false,
        };
    
        launchImageLibrary(options, handleResponse);
    };
        
    const handleResponse = (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('Image picker error: ', response.error);
        } else {
            let imageUri = response.uri || response.assets?.[0]?.uri;
            setSelectedImage(imageUri);
        }
    };

    return (
        <View>
            {selectedImage ? (
                <Image
                    source={{ uri: selectedImage }}
                    style={{ width: 100, height: 100 }}
                />
            ): null}
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
        const { mealName } = values;
        try {
            console.log('post'+mealName);
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
