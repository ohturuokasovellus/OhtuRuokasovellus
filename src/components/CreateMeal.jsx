/* eslint-disable camelcase */
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
import { CheckBox } from 'react-native-elements';

const categorizedIngredients = {
    'meat': ['ribeye', 'ground beef', 'bacon'],
    'fish': ['salmon', 'tuna', 'white fish'],
    'dairy': ['milk', 'greek yoghurt', 'kefir'],
    'starches': ['potato', 'white rice', 'pasta'],
    'vegetables': ['lettuce', 'tomatoes', 'kale'],
    'fats and oils': ['butter', 'coconut oil', 'olive oil']
};

const ingredients = {
    'ribeye': '1', 'ground beef': '2', 'bacon': '3', 'salmon': '4', 'tuna': '5',
    'white fish': '6', 'milk': '7', 'greek yoghurt': '8', 'kefir': '9',
    'potato': '10', 'white rice': '11', 'pasta': '12', 'lettuce': '13',
    'tomatoes': '14', 'kale': '15', 'butter': '16', 'coconut oil': '17',
    'olive oil': '18'
};

const allergens = [
    'grains', 'gluten', 'dairy', 'lactose', 'egg', 'nuts', 
    'peanut', 'sesame_seeds', 'fish', 'shellfish', 'molluscs', 
    'celery', 'mustard', 'soy', 'lupine', 'sulfite', 'sulfur_oxide'
];

const allergensFin = {
    grains: 'Viljat', gluten: 'Gluteeni', dairy: 'Maito', lactose: 'Laktoosi',
    egg: 'Kananmuna', nuts: 'Pähkinät', sesame_seeds: 'Seesaminsiemenet',
    fish: 'Kala', shellfish: 'Äyriäiset', molluscs: 'Nilviäiset',
    celery: 'Selleri', mustard: 'Sinappi', soy: 'Soija', lupine: 'Lupiini',
    sulfite: 'Sulfiitti', sulfur_oxide: 'Rikkioksidi'
};

const initialValues = {
    mealName: '',
    imageUri: '',
    mealDescription: '',
    ingredients: [{ mealId: '', category: '', ingredient: '', weight: '' }],
    allergens: {
        grains: false,
        gluten: false,
        dairy: false,
        lactose: false,
        egg: false,
        nuts: false,
        peanut: false,
        sesame_seeds: false,
        kala: false,
        shellfish: false,
        molluscs: false,
        celery: false,
        mustard: false,
        soy: false,
        lupine: false,
        sulfite: false,
        sulfur_oxide: false
    }
};

const validationSchema = mealValidationSchema;

const CreateMealForm = ({ onSubmit, onSuccess, onError }) => {
    const {t} = useTranslation();
    const [formError, setFormError] = useState('');
    const [createSuccess, setCreateSuccess] = useState(false);
    const [createError, setCreateError] = useState(false);

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
        formik.setFieldValue('ingredients',
            [...formik.values.ingredients,
                { mealId: '', category: '', ingredient: '', weight: '' }
            ]
        );
    };

    const removeIngredientInput = index => {
        const updatedIngredients = [...formik.values.ingredients];
        updatedIngredients.splice(index, 1);
        formik.setFieldValue('ingredients', updatedIngredients);
    };

    const handleCategoryChange = (value, index) => {
        const updatedIngredients = [...formik.values.ingredients];
        updatedIngredients[index].category = value;
        // updatedIngredients[index].ingredient = '';
        formik.setFieldValue('ingredients', updatedIngredients);
    };

    const handleIngredientChange = (value, index) => {
        const updatedIngredients = [...formik.values.ingredients];
        updatedIngredients[index].ingredient = value;
        updatedIngredients[index].mealId = ingredients[value];
        formik.setFieldValue('ingredients', updatedIngredients);
    };

    const handleWeightChange = (value, index) => {
        const updatedIngredients = [...formik.values.ingredients];
        const numericValue = value.replace(/[^0-9]/g, '');
        updatedIngredients[index].weight = numericValue;
        formik.setFieldValue('ingredients', updatedIngredients);
    };

    const handleAllergenChange = (allergen) => {
        const updatedAllergens = { ...formik.values.allergens };
        updatedAllergens[allergen] = !formik.values.allergens[allergen];
        formik.setFieldValue('allergens', updatedAllergens);
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
                <MultilineInput
                    styles={styles}
                    placeholder={t('MEAL_DESCRIPTION')}
                    value={formik.values.mealDescription}
                    onChangeText={formik.handleChange('mealDescription')}
                    id='description-input'
                    rows={5}
                />
                {formik.values.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.flexInputContainer}>
                        <SelectList 
                            search={false}
                            placeholder={t('FOOD_CATEGORY')}
                            setSelected={val => 
                                handleCategoryChange(val, index)}
                            data={Object.keys(
                                categorizedIngredients).map(category => ({
                                key: category,
                                value: category
                            }))}
                            
                            save="value"
                        />
                        <SelectList
                            styles={styles}
                            placeholder={t('INGREDIENT')}
                            data={
                                formik.values.ingredients[index].category ===
                                'all' ||
                                !formik.values.ingredients[index].category
                                    ? Object.values(categorizedIngredients)
                                        .flat()
                                    : categorizedIngredients[
                                        formik.values.ingredients[index]
                                            .category
                                    ]
                            }
                            // data={ingredients[
                            //     formik.values.ingredients[index].category
                            // ] || Object.values(ingredients).flat()}
                            setSelected={val =>
                                handleIngredientChange(val, index)
                            }
                            save="value"
                        />
                        <Input
                            styles={styles}
                            placeholder={t('INGREDIENT_WEIGHT')}
                            value={formik.values.ingredients[index].weight}
                            onChangeText={val => handleWeightChange(val, index)}
                            inputMode="numeric"
                            id={`weight-input-${index}`}
                        />
                        {formik.values.ingredients.length > 1 && (
                            <SmallButton
                                styles={styles}
                                onPress={() => removeIngredientInput(index)}
                                text='–'
                                id='remove-ingredient-button'
                            />
                        )}
                    </View>
                ))}
                <SmallButton
                    styles={styles}
                    onPress={addIngredientInput}
                    text='+'
                    id='add-ingredient-button'
                />
                <Text style={styles.h2}>{t('COMMON_ALLERGENS')}</Text>
                {allergens.map((allergen) => (
                    <CheckBox
                        key={allergen}
                        title={t(`ALLERGENS.${allergen.toUpperCase()}`)}
                        checked={formik.values.allergens[allergen]}
                        onPress={() => handleAllergenChange(allergen)}
                        containerStyle={
                            { backgroundColor: 'transparent', borderWidth: 0 }
                        }
                    />
                ))}
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

    const createAllergenString = (allergens) => {
        return Object.keys(allergens)
            .filter(key => allergens[key])
            .map(key => allergensFin[key])
            .join(', ');
    };

    const onSubmit = async values => {
        const {
            mealName, imageUri, mealDescription, ingredients, allergens
        } = values;
        const mealAllergenString = createAllergenString(allergens);
        console.log(ingredients);

        try {
            const response = await axios.post(
                `${apiUrl}/meals`,
                { mealName, mealDescription, ingredients, mealAllergenString },
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
