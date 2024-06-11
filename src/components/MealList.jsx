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
    const { restId } = useParams();
    const [selectedMeals, setSelectedMeals] = useState([]);
    const [meals, setMeals] = useState([]);
    const [restaurantId, setRestaurantId] = useState(restId);
    const [restaurantName, setRestaurantName] = useState(null);
    const [sortCriteria, setSortCriteria] = useState('co2_emissions');
    const [sortOrder, setSortOrder] = useState('asc');
    const [error, setError] = useState(null);

    const styles = createStyles();
    const { colors } = useContext(themeContext);

    const fetchMeals = async () => {
        setRestaurantId(restId);
        try {
            const response = await axios.get(`${apiUrl}/meals/${restaurantId}`);
            const responseMeals = response.data;
            const updatedMeals = await Promise.all(
                responseMeals.map(async (meal) => {
                    const imageRes = await axios.get(
                        `${apiUrl}/meals/images/${meal.meal_id}`
                    );
                    return {
                        ...meal,
                        image: imageRes.data,
                    };
                })
            );
            setRestaurantName(updatedMeals[0]?.restaurant_name || null);
            return updatedMeals;
        } catch (err) {
            setError(err.response.data);
            return [];
        }
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

    const sortMeals = (meals, criteria, order) => {
        return meals.sort((mealA, mealB) => {
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
            const sortedMeals = sortMeals(
                fetchedMeals, sortCriteria, sortOrder
            );
            setMeals(sortedMeals);
        };
        fetchAndSortMeals();
    }, [sortCriteria, sortOrder]);

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
                    onValueChange={(itemValue) => setSortCriteria(itemValue)}
                >
                    <Picker.Item label="Price" value="price" />
                    <Picker.Item label="CO2 Emissions" value="co2_emissions" />
                    <Picker.Item label="Protein" value="protein" />
                    <Picker.Item label="Sugar" value="sugar" />
                    <Picker.Item label="Fiber" value="fiber" />
                </Picker>
                <Picker
                    selectedValue={sortOrder}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSortOrder(itemValue)}
                >
                    <Picker.Item label="Ascending" value="asc" />
                    <Picker.Item label="Descending" value="desc" />
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
