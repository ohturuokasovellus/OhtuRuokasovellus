import { React, useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { useParams } from '../Router';
import apiUrl from '../utils/apiUrl';
import { themeContext } from '../controllers/themeController';

import { MealCard } from './ui/Card';
import { Picker } from './ui/Dropdown';
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
            response = await axios.get(
                `${apiUrl}/meals/${restaurantId}`);
        } catch (error) {
            setError(error.response.data);
            return [];
        }

        let fetchedMeals = response.data;
        let index = 0;
        while (index < fetchedMeals.length) {
            let meal = fetchedMeals[index];
            try {
                const image = await axios.get(
                    `${apiUrl}/meals/images/${meal.meal_id}`);
                fetchedMeals[index].image = image.data;
                setMeals(fetchedMeals); 
            } catch (error) {
                console.log('Failed to update meal image:', meal, error);
            }
            index += 1;
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

    const sortCriteriaItems = [
        { label: t('PRICE_CRITERIA'), value: 'price' },
        { label: t('CO2_EMISSIONS'), value: 'co2_emissions' },
        { label: t('PROTEIN'), value: 'protein' },
        { label: t('SUGAR'), value: 'sugar' },
        { label: t('FIBER'), value: 'fiber' }
    ];

    const sortOrderItems = [
        { label: t('ASCENDING'), value: 'asc' },
        { label: t('DESCENDING'), value: 'desc' }
    ];

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={[styles.h1, { alignSelf: 'center' }]}>
                    {t('RESTAURANT')} {restaurantName}
                </Text>
                <View style={styles.sortContainer}>
                    <Picker
                        selectedValue={sortCriteria}
                        onValueChange={
                            (itemValue) =>
                                handleSortChange(itemValue, sortOrder)
                        }
                        items={sortCriteriaItems}
                    />
                    <Picker
                        selectedValue={sortOrder}
                        onValueChange={
                            (itemValue) =>
                                handleSortChange(sortCriteria, itemValue)
                        }
                        items={sortOrderItems}
                    />
                </View>
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
