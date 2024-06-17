import { React, useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ScrollView, Picker } from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { useParams } from '../Router';
import apiUrl from '../utils/apiUrl';
import { themeContext } from '../controllers/themeController';

import { MealCard } from './ui/Card';
import createStyles from '../styles/styles';

/**
 * Render a restaurant specific meal list based on restaurantId.
 * @param {Function} fetchMeals - fetches meal list from the server;
 *  args: URL GET parameter
 * (restId)
 * @param {Function} handlePress - opens up additional info of the meal;
 *  args: selected meal on the meal list
 * (meal)
 * @returns {React.JSX.Element}
 */
const MealList = () => {
    const {t} = useTranslation();
    const { restaurantId } = useParams();
    const [selectedMeals, setSelectedMeals] = useState([]);
    const [meals, setMeals] = useState([]);
    const [restaurantName, setRestaurantName] = useState(null);
    const [sortCriteria, setSortCriteria] = useState('co2_emissions');
    const [sortOrder, setSortOrder] = useState('asc');
    const [error, setError] = useState(null);

    const styles = createStyles();
    const { colors } = useContext(themeContext);

    const fetchMeals = async () => {
        let response = null;
        try {
            response = await fetch(
                `${apiUrl}/meals/stream/${restaurantId}`);
        } catch (err) {
            setError(err.response.data);
            return [];
        }

        const reader = response.body.getReader();
        let buffer = '';
        let completed = false;
        let fetchedMeals = [];
        while (!completed) {
            const { done, value } = await reader.read();
            completed = done;
            if (value) {
                // Decode the Uint8Array value to a string
                buffer += String.fromCharCode.apply(null, value);
                let boundaryIndex;
                while ((boundaryIndex = buffer.indexOf('}{')) !== -1) {
                    // Split and parse the first JSON object in the buffer
                    let chunk = buffer.slice(0, boundaryIndex + 1);
                    buffer = buffer.slice(boundaryIndex + 1);
                    try {
                        const meal = JSON.parse(chunk).data;
                        const image = await axios.get(
                            `${apiUrl}/meals/images/${meal.meal_id}`);
                        const mealWithImage ={ ...meal,image: image.data };
                        fetchedMeals = [...fetchedMeals, mealWithImage];
                        setMeals(fetchedMeals);
                    } catch (error) {
                        console.log('Failed to parse chunk:', chunk, error);
                    }
                }
            }
        }
        // Process any remaining buffer
        if (buffer) {
            try {
                const meal = JSON.parse(buffer).data;
                const image = await axios.get(
                    `${apiUrl}/meals/images/${meal.meal_id}`);
                const mealWithImage ={ ...meal,image: image.data };
                fetchedMeals = [...fetchedMeals, mealWithImage];
                setMeals(fetchedMeals);
            } catch (error) {
                console.log('Failed to parse final chunk:', 
                    buffer, error);
            }
        }
        return fetchedMeals;
    };

    const handlePress = (meal) => {
        setSelectedMeals((prevSelectedMeals) => {
            if (prevSelectedMeals.includes(meal)) {
                return prevSelectedMeals
                    .filter((displayedMeal) => displayedMeal !== meal);
            } else {
                return [...prevSelectedMeals, meal];
            }
        });
    };

    const sortMeals = (mealsToBeSorted, criteria, order) => {
        return mealsToBeSorted.sort((mealA, mealB) => {
            if (order === 'asc') {
                return mealA[criteria] - mealB[criteria];
            } else {
                return mealB[criteria] - mealA[criteria];
            }
        });
    };

    useEffect(() => {
        const fetchAndSortMeals = async () => {
            const fetchedMeals = await fetchMeals();
            setMeals(sortMeals(fetchedMeals, sortCriteria, sortOrder));
            setRestaurantName(fetchedMeals[0]?.restaurant_name || null);
        };

        fetchAndSortMeals();
    }, [restaurantId]);

    const handleSortChange = (criteria, order) => {
        setSortCriteria(criteria);
        setSortOrder(order);
        setMeals(sortMeals(meals, criteria, order));
    };

    if (error) {
        return (
            <View >
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }
    
    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={[styles.h1, { alignSelf: 'center' }]}>
                    {t('RESTAURANT')} {restaurantName}
                </Text>
            </View>
            <View style={styles.sortControls}>
                <Picker
                    selectedValue={sortCriteria}
                    style={styles.picker}
                    onValueChange={
                        (itemValue) => handleSortChange(itemValue, sortOrder)
                    }
                >
                    <Picker.Item label={t('PRICE_CRITERIA')} value="price" />
                    <Picker.Item label={t('CO2_EMISSIONS')}
                        value="co2_emissions" />
                    <Picker.Item label={t('PROTEIN')} value="protein" />
                    <Picker.Item label={t('SUGAR')} value="sugar" />
                    <Picker.Item label={t('FIBER')} value="fiber" />
                </Picker>
                <Picker
                    selectedValue={sortOrder}
                    style={styles.picker}
                    onValueChange={
                        (itemValue) => handleSortChange(sortCriteria, itemValue)
                    }
                >
                    <Picker.Item label={t('ASCENDING')} value="asc" />
                    <Picker.Item label={t('DESCENDING')} value="desc" />
                </Picker>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={meals}
                    keyExtractor={(item) => item.meal_id.toString()}
                    renderItem={({ item }) => (
                        <MealCard
                            styles={styles}
                            meal={item}
                            onPress={() => handlePress(item)}
                            isSelected={selectedMeals.includes(item)}
                            sliceColor={colors.sliceColor}
                        />
                    )}
                />
            </View>
        </ScrollView>
        
    );
};

export default MealList;
