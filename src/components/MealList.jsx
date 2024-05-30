import { React, useState, useEffect } from 'react';
import {
    View, Text, Pressable, FlatList, Image
} from 'react-native';
import axios from 'axios';
import { useParams } from '../Router';
// import { styles } from '../styles/styles';

import { MealCard } from './ui/Card';
import createStyles from '../styles/layout';

const MealList = () => {
    const { restId } = useParams();
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [meals, setMeals] = useState([]);
    const [restaurantId, setRestaurantId] = useState(restId);
    const [restaurantName, setRestaurantName] = useState(null);
    const [error, setError] = useState(null);

    const styles = createStyles();

    useEffect(() => {
        const fetchMeals = async () => {
            setRestaurantId(restId);
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/meals/${restaurantId}`,
                );
                const responseMeals = response.data;
                const updatedMeals = await Promise.all(
                    responseMeals.map(async (meal) => {
                        const imageRes = await axios.get(
                            `http://localhost:8080/api/meals/images/
                                ${meal.meal_id}`
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

    const loremIpsum = 'Lorem ipsum dolor sit amet, \
    consecteturadipiscing elit, sed do eiusmod tempor \
    incididunt ut labore et dolore magna aliqua. \
    Ut enim ad minim veniam, quis nostrud exercitation ullamco \
    laboris nisi ut aliquip ex ea commodo consequat. \
    Duis aute irure dolor in reprehenderit in voluptate \
    velit esse cillum dolore eu fugiat nulla pariatur. \
    Excepteur sint occaecat cupidatat non proident, \
    sunt in culpa qui officia deserunt mollit anim id est laborum.';

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Ravintola {restaurantName}</Text>
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
                    />
                )}
            />
        </View>
    );
};

export default MealList;
