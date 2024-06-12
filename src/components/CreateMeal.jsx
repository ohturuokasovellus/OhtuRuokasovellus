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
import { useParams } from '../Router';

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
const allergensFin = {
    grains: 'viljat', gluten: 'gluteeni', dairy: 'maito', lactose: 'laktoosi',
    egg: 'kananmuna', nuts: 'pähkinät', sesame_seeds: 'seesaminsiemenet',
    fish: 'kala', shellfish: 'äyriäiset', molluscs: 'nilviäiset',
    celery: 'selleri', mustard: 'sinappi', soy: 'soija', lupine: 'lupiini',
    sulfite: 'sulfiitti', sulfur_oxide: 'rikkioksidi'
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
const CreateMealForm = ({ onSubmit, onSuccess, onError }) => {
    const {t} = useTranslation();
    const [ingredients, setIngredients] = useState({});
    const [categorizedIngredients, setCategorizedIngredients] = useState({});
    const [formError, setFormError] = useState('');
    const [createSuccess, setCreateSuccess] = useState(false);
    const [createError, setCreateError] = useState(false);

    useEffect(() => {
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

            if (hasIngredientWithWeight) {
                try {
                    await onSubmit(values);
                    onSuccess(setCreateSuccess);
                    formik.resetForm();
                } catch (err) {
                    onError(setCreateError);
                    setFormError(err.message);
                    formik.resetForm();
                }
            } else {
                setFormError(
                    'At least one ingredient with weight required'
                );
            }
        }
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
                
                <Text style={styles.h1}>{t('CREATE_A_MEAL')}</Text>
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
                        <SelectList
                            boxStyles={styles.selectList}
                            inputStyles={styles.inputStyles}
                            dropdownStyles={styles.dropdownStyles}
                            dropdownItemStyles={styles.dropdownItemStyles}
                            dropdownTextStyles={styles.dropdownTextStyles}
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
                        <SelectList
                            boxStyles={styles.selectList}
                            inputStyles={styles.inputStyles}
                            dropdownStyles={styles.dropdownStyles}
                            dropdownItemStyles={styles.dropdownItemStyles}
                            dropdownTextStyles={styles.dropdownTextStyles}
                            search={false}
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
                    onPress={addIngredientInput}
                    text='+'
                    id='add-ingredient-button'
                />
                <Text style={styles.h2}>{t('COMMON_ALLERGENS')}</Text>
                {allergens.map((allergen) => (
                    <CheckBox
                        containerStyle={styles.checkboxContainer}
                        textStyle={styles.checkboxText}
                        checkedColor={styles.checkedIcon.backgroundColor}
                        uncheckedColor={styles.checkboxIcon.borderColor}
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
                <Text style={styles.h3}>{t('MEAL_CREATED')}</Text>
                }
                {createError && 
                <Text style={styles.error}>{t('MEAL_NOT_CREATED')}</Text>
                }
                {formError ? (
                    <Text style={styles.error}>{formError}</Text>
                ) : null}
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

/**
 * CreateMeal component for managing meal addition.
 */
const CreateMeal = (props) => {
    const { mealId } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [meal, setMeal] = useState(initialValues);

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
                        const response = await axios.get(
                            `${apiUrl}/meals/${mealId}`
                        );
                        setMeal(response.data);
                        console.log(response.data);
                        setIsEditing(true);
                    } catch (err) {
                        console.error(err);
                    }
                }
            };
            fetchMeal();
        }
    }, [mealId]);

    // Takes dictionary with allergens as keys and values as boolean
    // and transforms allergens with true values into single string
    const createAllergenString = (allergens) => {
        return Object.keys(allergens)
            .filter(key => allergens[key])
            .map(key => allergensFin[key])
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
            imageUri: values.imageUri,
            ingredients: values.ingredients,
            mealDescription: values.mealDescription,
            mealName: values.mealName,
            mealAllergenString: mealAllergenString,
            formattedPrice: formattedPrice};
        console.log(formattedValues);

        try {
            if (isEditing) {
                await axios.put(`${apiUrl}/meals/${mealId}`, formattedValues,
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
                const mealId = response.data.mealId;
                await axios.post(
                    `${apiUrl}/meals/images/${mealId}`,
                    values.imageUri,
                    {
                        headers: {
                            'Content-Type': 'image/jpeg'
                        },
                    },
                );
            }
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
        onSuccess={onSuccess} onError={onError}
        isEditing={isEditing}
        initialValues={initialValues}
    />;
};

export default CreateMeal;
