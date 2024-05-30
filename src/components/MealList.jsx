import { React, useState, useEffect } from 'react';
import {
    View, Text, Pressable, FlatList, Image
} from 'react-native';
import axios from 'axios';
import { useParams } from '../Router';
import { styles } from '../styling/styles';
import { useTranslation } from 'react-i18next';
import apiUrl from '../utils/apiUrl';

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

    return (
        <View style={styles.mealContainer}>
            <Text style={styles.header}>
                {t('RESTAURANT')} {restaurantName}
            </Text>
            <FlatList
                data={meals}
                keyExtractor={(item) => item.meal_id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Pressable onPress={() => handlePress(item)}
                            style={({ pressed }) => [
                                {
                                    opacity: pressed ? 0.5 : 1,
                                },
                                styles.pressable
                            ]}
                        >
                            <View style={styles.itemContainer}>
                                <Image
                                    source={{
                                        uri: item.image
                                    }}
                                    style={styles.image}
                                />
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemName}>
                                        {item.meal_name}
                                    </Text>
                                    {selectedMeal === item && (
                                        <Text style={styles.additionalInfo}>
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit,
                                            sed do eiusmod tempor incididunt
                                            ut labore et dolore magna aliqua.
                                            Ut enim ad minim veniam, quis
                                            nostrud exercitation ullamco
                                            laboris nisi ut aliquip ex ea
                                            commodo consequat. Duis aute
                                            irure dolor in reprehenderit
                                            in voluptate velit esse
                                            cillum dolore eu fugiat
                                            nulla pariatur. Excepteur
                                            sint occaecat cupidatat non
                                            proident, sunt in culpa qui
                                            officia deserunt mollit anim
                                            id est laborum.
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </Pressable>
                    </View>
                )}
            />
        </View>
    );
};

export default MealList;