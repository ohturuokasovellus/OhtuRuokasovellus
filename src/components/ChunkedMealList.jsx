import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, FlatList } from 'react-native';
import axios from 'axios';
import { useParams } from '../Router';
import apiUrl from '../utils/apiUrl';
import { themeContext } from '../controllers/themeController';
import createStyles from '../styles/styles';
import { MealCard } from './ui/Card';

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
const ChunkedMealList = () => {
    const { restaurantId } = useParams();
    const [meals, setMeals] = useState([]);
    const [selectedMeals, setSelectedMeals] = useState([]);
    const styles = createStyles();
    const { colors } = useContext(themeContext);

    const fetchMeals = async () => {
        const response = await fetch(
            `${apiUrl}/meals/stream/${restaurantId}`);
        const reader = response.body.getReader();

        let buffer = '';
        let completed = false;
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
                        setMeals(prevMeals => [...prevMeals, mealWithImage]);
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
                setMeals(prevMeals => [...prevMeals, mealWithImage]);
            } catch (error) {
                console.log('Failed to parse final chunk:', buffer, 
                    error);
            }
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

    useEffect(() => {
        const fetchAndSortMeals = async () => {
            await fetchMeals();
        };
        fetchAndSortMeals();
    }, [restaurantId]);

    return (
        <ScrollView style={styles.background}>
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

export default ChunkedMealList;
