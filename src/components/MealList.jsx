import { React, useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
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
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [meals, setMeals] = useState([]);
    const [restaurantId, setRestaurantId] = useState(restId);
    const [restaurantName, setRestaurantName] = useState(null);
    const [error, setError] = useState(null);

    const styles = createStyles();
    const { colors } = useContext(themeContext);
    const sliceColor = [colors.primary, colors.secondary, colors.tertiary];

    useEffect(() => {
        const fetchMeals = async () => {
            setRestaurantId(restId);
            try {
                const response = await axios.get(
                    `${apiUrl}/meals/${restaurantId}`,
                );
                const responseMeals = response.data;
                const updatedMeals = await Promise.all(
                    responseMeals.map(async (meal) => {
                        const imageRes = await axios.get(
                            `${apiUrl}/meals/images/${meal.meal_id}`
                        );
                        return {
                            ...meal,
                            image: imageRes.data
                        };
                    }));
                setMeals(updatedMeals);
                setRestaurantName(updatedMeals[0].restaurant_name);
            } catch (err) {
                setError(err.response.data);
            }
        };
        fetchMeals();
    }, [restaurantId]);

    const handlePress = (meal) => {
        setSelectedMeal(selectedMeal === meal ? null : meal);
    };

    if (error) {
        return (
            <View >
                <Text>{error}</Text>
            </View>
        );
    }

    // TODO: get the meal info from database

    const loremIpsum = 'Lorem ipsum dolor sit amet, \
    consecteturadipiscing elit, sed do eiusmod tempor \
    incididunt ut labore et dolore magna aliqua. \
    Ut enim ad minim veniam, quis nostrud exercitation ullamco \
    laboris nisi ut aliquip ex ea commodo consequat. \
    Duis aute irure dolor in reprehenderit in voluptate \
    velit esse cillum dolore eu fugiat nulla pariatur. \
    Excepteur sint occaecat cupidatat non proident, \
    sunt in culpa qui officia deserunt mollit anim id est laborum.';
    const series = [29.8, 8.9, 8.2];
    const co2 = '5 ekv/kg';
    const allergens = ['gluteeni', 'maapähkinä'];

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>
                    {t('RESTAURANT')} {restaurantName}
                </Text>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={meals}
                    keyExtractor={(item) => item.meal_id.toString()}
                    renderItem={({ item }) => (
                        <MealCard
                            styles={styles}
                            imgURI={item.image}
                            title={item.meal_name}
                            body={loremIpsum}
                            onPress={() => handlePress(item)}
                            isSelected={selectedMeal === item}
                            series={series}
                            sliceColor={sliceColor}
                            co2={co2}
                            allergens={allergens}
                        />
                    )}
                />
            </View>
        </ScrollView>
        
    );
};

export default MealList;
