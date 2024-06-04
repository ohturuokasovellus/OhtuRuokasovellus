import { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Text, View, Image, ScrollView} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import apiUrl from '../utils/apiUrl';
import { useNavigate } from '../Router';
import { getSession } from '../controllers/sessionController';
import { mealValidationSchema } from '../utils/formValidationSchemas';
import createStyles from '../styles/styles';
import { Button, SmallButton } from './ui/Buttons';
import { Input, MultilineInput } from './ui/InputFields';
import { SelectList } from 'react-native-dropdown-select-list';

const categories = [
    'meat', 'fish', 'dairy', 'starches', 'vegetables', 'fats and oils'
];

const ingredients = {
    meat: ['ribeye', 'ground beef', 'bacon'],
    fish: ['salmon', 'tuna', 'white fish'],
    dairy: ['milk', 'greek yoghurt', 'kefir'],
    starches: ['potato', 'white rice', 'pasta'],
    vegetables: ['lettuce', 'tomatoes', 'kale'],
    fatsAndOils: ['butter', 'coconut oil', 'olive oil']
};

const data = [
    {key:'1', value:'Mobiles'},
    {key:'2', value:'Appliances'},
    {key:'3', value:'Cameras'},
    {key:'4', value:'Computers'},
    {key:'5', value:'Vegetables'},
    {key:'6', value:'Diary Products'},
    {key:'7', value:'Drinks'},
];

const initialValues = {
    mealName: '',
    imageUri: '',
    description: '',
    ingredients: ['']
};

const validationSchema = mealValidationSchema;

const CreateMealForm = ({ onSubmit, onSuccess, onError }) => {
    const {t} = useTranslation();
    const [formError, setFormError] = useState('');
    const [createSuccess, setCreateSuccess] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [selected, setSelected] = useState('');

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async values => {
            try {
                await onSubmit(values);
                onSuccess(setCreateSuccess);
                
            } catch (err) {
                onError(setCreateError);
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

    const addIngredientInput = () => {
        formik.setFieldValue('ingredients', [...formik.values.ingredients, '']);
    };

    const removeIngredientInput = index => {
        const updatedIngredients = [...formik.values.ingredients];
        updatedIngredients.splice(index, 1);
        formik.setFieldValue('ingredients', updatedIngredients);
    };

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>{t('CREATE_A_MEAL')}</Text>
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
                {/* <SelectList 
                    setSelected={(val) => setSelected(val)} 
                    data={data} 
                    save="value"
                /> */}
                <MultilineInput
                    styles={styles}
                    placeholder={t('MEAL_DESCRIPTION')}
                    value={formik.values.description}
                    onChangeText={formik.handleChange('description')}
                    id='description-input'
                    rows={5}
                />
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
                {createSuccess &&
                <Text>{t('MEAL_CREATED')}</Text>
                }
                {createError && 
                <Text style={styles.error}>{t('MEAL_NOT_CREATED')}</Text>
                }
            </View>
        </ScrollView>
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
                { mealName },
                {
                    headers: { Authorization: 'Bearer ' + getSession().token }
                }
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

    const setMessageTimeout = (setFunc) => {
        setTimeout(() => {
            setFunc(false);
        }, 5000);
    };
    const onSuccess = (setCreateSuccess) => {
        setCreateSuccess(true);
        setMessageTimeout(setCreateSuccess);
    };
    const onError = (setCreateError) => {
        setCreateError(true);
        setMessageTimeout(setCreateError);
    };

    return <CreateMealForm onSubmit={onSubmit}
        onSuccess={onSuccess} onError={onError} />;
};

export default CreateMeal;
