import { React, useState, useEffect } from 'react';
import {
    View, Text, Pressable, FlatList, Image
} from 'react-native';
import axios from 'axios';
import { useParams } from '../Router';
import { styles } from '../styling/styles';

const MealList = () => {
    const { restId } = useParams();
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [meals, setMeals] = useState([]);
    const [restaurantId, setRestaurantId] = useState(restId);
    const [error, setError] = useState(null);

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
            <Text style={styles.header}>Ateriat</Text>
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
                                        {item.name}
                                    </Text>
                                    {selectedMeal === item && (
                                        <Text style={styles.additionalInfo}>
                                            lorem ipsumlorem ipsumlorem
                                            ipsumloremipsumlorem ipsumlorem
                                            ipsumlorem ipsumlore ipsumlorem
                                            ipsumlorem ipsumlorem ipsumlorem
                                            ipsumlorem ipsumlorem ipsum
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