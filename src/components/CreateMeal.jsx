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
import { useParams } from '../Router';
import { Checkbox } from './ui/Checkbox';
import { Dropdown } from './ui/Dropdown';

// correct dictionary format for categorized ingredients
// const categorizedIngredients = {
//     'meat': ['ribeye', 'ground beef', 'bacon'],
//     'fish': ['salmon', 'tuna', 'white fish'],
//     'dairy': ['milk', 'greek yoghurt', 'kefir'],
//     'starches': ['potato', 'white rice', 'pasta'],
//     'vegetables': ['lettuce', 'tomatoes', 'kale'],
//     'fats and oils': ['butter', 'coconut oil', 'olive oil']
// };

// correct dictionary format for ingredients
// const ingredients = {
//     'ribeye': '1', 'ground beef': '2', 'bacon': '3', 'salmon': '4',
//      'tuna': '5',
//     'white fish': '6', 'milk': '7', 'greek yoghurt': '8', 'kefir': '9',
//     'potato': '10', 'white rice': '11', 'pasta': '12', 'lettuce': '13',
//     'tomatoes': '14', 'kale': '15', 'butter': '16', 'coconut oil': '17',
//     'olive oil': '18'
// };

// if changes remember to edit translation files
const allergens = [
    'grains', 'gluten', 'dairy', 'lactose', 'egg', 'nuts', 
    'peanut', 'sesame_seeds', 'fish', 'shellfish', 'molluscs', 
    'celery', 'mustard', 'soy', 'lupine', 'sulfite', 'sulfur_oxide'
];

// finnish language is priority so for now we save allergens in finnish
const allergensEngToFin = {
    grains: 'viljat', gluten: 'gluteeni', dairy: 'maito', lactose: 'laktoosi',
    egg: 'kananmuna', nuts: 'pähkinät', sesame_seeds: 'seesaminsiemenet',
    fish: 'kala', shellfish: 'äyriäiset', molluscs: 'nilviäiset',
    celery: 'selleri', mustard: 'sinappi', soy: 'soija', lupine: 'lupiini',
    sulfite: 'sulfiitti', sulfur_oxide: 'rikkioksidi'
};

const allergensFinToEng = {
    'viljat': 'grains', 'gluteeni': 'gluten', 'maito': 'dairy',
    'laktoosi': 'lactose', 'kananmuna': 'egg', 'pähkinät': 'nuts',
    'seesaminsiemenet': 'sesame_seeds', 'kala': 'fish', 'äyriäiset': 'shellfish'
    , 'nilviäiset': 'molluscs', 'selleri': 'celery', 'sinappi': 'mustard',
    'soija': 'soy', 'lupiini': 'lupine', 'sulfiitti': 'sulfite',
    'rikkioksidi': 'sulfur_oxide'
};

const initialValues = {
    mealName: '',
    imageUri: '',
    mealDescription: '',
    ingredients: [{ 
        ingredientId: '', category: '', ingredient: '', weight: ''
    }],
    allergens: {
        grains: false,
        gluten: false,
        dairy: false,
        lactose: false,
        egg: false,
        nuts: false,
        peanut: false,
        sesame_seeds: false,
        fish: false,
        shellfish: false,
        molluscs: false,
        celery: false,
        mustard: false,
        soy: false,
        lupine: false,
        sulfite: false,
        sulfur_oxide: false
    },
    price: ''
};

const validationSchema = mealValidationSchema;

/**
 * Form for creating new meals.
 * @param {Function} onSubmit
 * @param {Function} onSuccess
 * @param {Function} onError
 * @returns {JSX.Element} 
 */
const CreateMealForm = ({
    onSubmit, initialValues, isEditing
}) => {
    const {t} = useTranslation();
    const [ingredients, setIngredients] = useState({});
    const [categorizedIngredients, setCategorizedIngredients] = useState({});
    const [formError, setFormError] = useState('');
    const [createSuccess, setCreateSuccess] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [createError, setCreateError] = useState(false);
    const [updateError, setUpdateError] = useState(false);

    const fetchIngredients = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/ingredients`
            );
            setIngredients(response.data.ingredients);
            setCategorizedIngredients(response.data.categorizedIngredients);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }), [];

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async values => {

            // with ingredients formik validation schema doesnt work 
            // for some reason so use this for now
            const hasIngredientWithWeight = values.ingredients.some(item => {
                return item.ingredient.trim() !== '' &&
                item.weight.trim() !== '';
            });

            const handleSuccess = (setState) => {
                setState(true);
                setTimeout(() => setState(false), 5000);
            };
            
            if (hasIngredientWithWeight) {
                try {
                    await onSubmit(values);
                    if (isEditing) {
                        handleSuccess(setUpdateSuccess);
                    } else {
                        handleSuccess(setCreateSuccess);
                    }
                    formik.resetForm();
                } catch (err) {
                    if (isEditing) {
                        handleSuccess(setUpdateError);
                    } else {
                        handleSuccess(setCreateError);
                    }
                    setFormError(err.message);
                }
            } else {
                setFormError(
                    'At least one ingredient with weight required'
                );
            }
        }
    });

    useEffect(() => {
        formik.setValues(initialValues);
    }, [isEditing]);

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
                { ingredientId: '', category: '', ingredient: '', weight: '' }
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
        updatedIngredients[index].ingredientId = ingredients[value];
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

    const handlePriceChange = (value) => {
        const sanitizedValue = value.replace(/[^0-9,]/g, '');

        const parts = sanitizedValue.split(',');
        if (parts.length > 2 || sanitizedValue.startsWith(',')) {
            return;
        }
        
        let formattedPrice = parts[0];
        if (parts[1] !== undefined) {
            formattedPrice += ',' + parts[1].slice(0, 2);
        }
        formik.setFieldValue('price', formattedPrice);
    };

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                
                <Text style={styles.h1}>
                    {t(isEditing ? 'EDIT_MEAL' : 'CREATE_A_MEAL')}
                </Text>
                {formik.values.imageUri ? (
                    <Image
                        source={{ uri: formik.values.imageUri }}
                        style={{ width: 100, height: 100 }}
                    />
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
                        <Dropdown
                            styles={styles}
                            search={false}
                            placeholder={t('FOOD_GROUP')}
                            setSelected={val => 
                                handleCategoryChange(val, index)}
                            data={Object.keys(
                                categorizedIngredients).map(category => ({
                                key: category,
                                value: category
                            }))}
                            save="value"
                        />
                        <Dropdown
                            styles={styles}
                            search={false}
                            placeholder={t(
                                isEditing ? ingredient.ingredient :'INGREDIENT'
                            )}
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
                            id={`ingredient-dropdown-${index}`}
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
                        {formik.values.ingredients.length < 2 && 
                        formik.errors.ingredients && 
                        <Text style={styles.error}>
                            {formik.errors.ingredients}
                        </Text>
                        }
                    </View>
                ))}
                <SmallButton
                    styles={styles}
                    onPress={() => addIngredientInput()}
                    text='+'
                    id='add-ingredient-button'
                />
                <Text style={styles.h2}>{t('COMMON_ALLERGENS')}</Text>
                {allergens.map((allergen) => (
                    <Checkbox
                        styles={styles}
                        key={allergen}
                        title={t(`ALLERGEN_GROUP.${allergen.toUpperCase()}`)}
                        checked={formik.values.allergens[allergen]}
                        onPress={() => handleAllergenChange(allergen)}
                        id={`checkbox-${allergen}`}
                    />
                ))}
                <Input
                    styles={styles}
                    placeholder={t('PRICE')}
                    value={formik.values.price}
                    onChangeText={value => handlePriceChange(value)}
                    id='price-input'
                />
                {formik.touched.price && formik.errors.price && 
                <Text style={styles.error}>{t(formik.errors.price)}</Text>
                }
                {createSuccess &&
                <Text style={styles.h3}>
                    {t('MEAL_CREATED')}
                </Text>
                }
                {updateSuccess &&
                <Text style={styles.h3}>
                    {t('MEAL_UPDATED')}
                </Text>
                }
                {createError && 
                <Text style={styles.error}>
                    {t('MEAL_NOT_CREATED')}
                </Text>
                }
                {updateError && 
                <Text style={styles.error}>
                    {t('MEAL_NOT_UPDATED')}
                </Text>
                }
                {formError ? (
                    <Text style={styles.error}>{formError}</Text>
                ) : null}
                <Button
                    styles={styles}
                    onPress={() => openImagePicker()}
                    text={t('SELECT_A_IMAGE_FROM_DEVICE')}
                    id='image-picker-button'
                />
                {formik.touched.imageUri && formik.errors.imageUri &&
                <Text style={styles.error}>{formik.errors.imageUri}</Text>
                }
                <Button
                    styles={styles}
                    onPress={formik.handleSubmit}
                    text={t(isEditing ? 'EDIT_MEAL' : 'CREATE_A_MEAL')}
                    id='create-meal-button'
                />
            </View>
        </ScrollView>
    );
};

/**
 * CreateMeal component for managing meal addition.
 */
const CreateMeal = (props) => {
    let { mealId } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [meal, setMeal] = useState(initialValues);

    // formats the database values to formik-friendly values
    const formatMealForEditing = (meal, imageUri) => {
        const allergensObject = Object.keys(allergensFinToEng)
            .reduce((acc, allergen) => {
                const trimmedAllergen = allergen.trim();
                acc[allergensFinToEng[trimmedAllergen]] = meal.meal_allergens
                    .includes(trimmedAllergen);
                return acc;
            }, {});
        const price = (meal.price/100).toFixed(2).replace('.', ',');
        return {
            mealName: meal.name,
            mealDescription: meal.meal_description,
            ingredients: meal.ingredients,
            price: price,
            allergens: allergensObject,
            imageUri: imageUri
        };
    };

    useEffect(() => {
        if (!props.user) {
            navigate('/login');
        }
        else if (!props.user.restaurantId) {
            navigate('/');
        }
        else if (mealId) {
            const fetchMeal = async () => {
                if (mealId) {
                    try {
                        const response = await axios.post(
                            `${apiUrl}/meals/meal/${mealId}`,
                            {},
                            {
                                headers: {
                                    Authorization:
                                    `Bearer ${getSession().token}`
                                }
                            });
                        const imageRes = await axios.get(
                            `${apiUrl}/meals/images/${mealId}`
                        );
                        const formattedMeal = formatMealForEditing(
                            response.data, imageRes.data
                        );
                        setMeal(formattedMeal);
                        setIsEditing(true);
                    } catch (err) {
                        console.error(err);
                    }
                }
            };
            fetchMeal();
        }
        else if (isEditing) {
            setIsEditing(false);
            setMeal(initialValues);
        }
    }, [mealId]);

    // Takes dictionary with allergens as keys and values as boolean
    // and transforms allergens with true values into single string
    const createAllergenString = (allergens) => {
        return Object.keys(allergens)
            .filter(key => allergens[key])
            .map(key => allergensEngToFin[key])
            .join(', ');
    };

    const formatPrice = (priceString)  => {
        const parts = priceString.split(',');
        const integerPart = parseInt(parts[0], 10);
        let fractionalPart = parts[1] ? parts[1] : '00';
        if (fractionalPart.length === 1) {
            fractionalPart += '0';
        }
        const result = (integerPart * 100) + parseInt(fractionalPart, 10);
        return result.toString();
    };

    const onSubmit = async values => {
        const mealAllergenString = createAllergenString(values.allergens);
        const formattedPrice = formatPrice(values.price);

        const formattedValues = {
            ingredients: values.ingredients,
            mealDescription: values.mealDescription,
            mealName: values.mealName,
            mealAllergenString: mealAllergenString,
            formattedPrice: formattedPrice};
        
        try {
            if (isEditing) {
                await axios.put(`${apiUrl}/meals/update/${mealId}`,
                    formattedValues,
                    {
                        headers: {
                            Authorization: `Bearer ${getSession().token}`
                        }
                    });
            } else {
                const response = await axios.post(
                    `${apiUrl}/meals`, formattedValues,
                    {
                        headers: {
                            Authorization: `Bearer ${getSession().token}`
                        }
                    });
                mealId = response.data.mealId;
            }
            await axios.post(
                `${apiUrl}/meals/images/${mealId}`,
                values.imageUri,
                {
                    headers: {
                        'Content-Type': 'image/jpeg'
                    },
                },
            );
            setIsEditing(false);
            setMeal(initialValues);
        } catch (err) {
            const errorMessage = err.response?.data?.errorMessage ||
                'an unexpected error occurred';
            throw new Error(errorMessage);
        }
    };

    return <CreateMealForm onSubmit={onSubmit}
        isEditing={isEditing}
        initialValues={meal}
    />;
};

export default CreateMeal;