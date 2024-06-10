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
    const [selectedMeals, setSelectedMeals] = useState([]);
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
                            image: imageRes.data,
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
        setSelectedMeals((prevSelectedMeals) => {
            if (prevSelectedMeals.includes(meal)) {
                return prevSelectedMeals
                    .filter((displayedMeal) => displayedMeal !== meal);
            } else {
                return [...prevSelectedMeals, meal];
            }
        });
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
                            meal={item}
                            onPress={() => handlePress(item)}
                            isSelected={selectedMeals.includes(item)}
                            sliceColor={sliceColor}
                        />
                    )}
                />
            </View>
        </ScrollView>
        
    );
};

export default MealList;
