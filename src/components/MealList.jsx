import { React, useState, useEffect } from 'react';
import {
    View, Text, Pressable, FlatList, StyleSheet, Image
} from 'react-native';
// import { mealImageUri } from '../utils/tempImageUri';
import axios from 'axios';
import { useParams } from '../Router';


const MealList = () => {
    // const tempMeals = ([
    //     {
    //         mealId: 1,
    //         name: 'Falafeli',
    //         image: mealImageUri,
    //     },
    //     {
    //         mealId: 2,
    //         name: 'Kanasalaatti',
    //         image: mealImageUri,
    //     },
    // ]);
    // console.log(tempMeals);

    const { restId } = useParams();
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [meals, setMeals] = useState([]);
    const [restaurantId, setRestaurantId] = useState(restId);

    useEffect(() => {
        const fetchMeals = async () => {
            setRestaurantId(restId);
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/meals/${restaurantId}`,
                );
                console.log(response.data[0]);
                setMeals(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchMeals();
    }, [restaurantId]);

    const handlePress = (meal) => {
        setSelectedMeal(selectedMeal === meal ? null : meal);
    };

    return (
        <View style={styles.container}>
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
                            {/* <Image
                                source={{
                                    uri: `data:image/jpeg;base64,${item.image.data}`;
                                }}
                                style={styles.image}
                            /> */}
                            <Text style={styles.item}>{item.name}</Text>
                        </Pressable>
                        {selectedMeal === item && (
                            <View style={styles.additionalInfo}>
                                <Text>lorem ipsum</Text>
                            </View>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
    },
    item: {
        padding: 10,
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    image: {
        width: 175,
        height: 175,
        marginRight: 10,
        borderRadius: 5,
    },
    pressable: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    additionalInfo: {
        paddingLeft: 60,
        paddingBottom: 10,
    },
});

export default MealList;