import { React, useState} from 'react';
import {
    View, Text, Pressable, FlatList, StyleSheet, Image
} from 'react-native';
import { mealImageUri } from '../utils/tempImageUri';

let meals;
const MealList = () => {
    const [selectedMeal, setSelectedMeal] = useState(null);
    meals = ([
        {
            mealId: 1,
            name: 'Falafeli',
            image: mealImageUri,
            restaurant: 1
        },
        {
            mealId: 2,
            name: 'Kanasalaatti',
            image: mealImageUri,
            restaurant: 2
        },
    ]);


    const handlePress = (meal) => {
        setSelectedMeal(selectedMeal === meal ? null : meal);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Ateriat</Text>
            <FlatList
                data={meals}
                keyExtractor={(item) => item.mealId.toString()}
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
                            <Image
                                source={{
                                    uri: item.image
                                }}
                                style={styles.image}
                            />
                            <Text style={styles.item}>{item.name}</Text>
                        </Pressable>
                        {/*
                        TODO: displaying additional information when pressing
                        */}
                        
                        {/* {selectedMeal === item && (
                            <View style={styles.additionalInfo}>
                                <Text>lorem ipsum</Text>
                            </View>
                        )}; */}
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
        width: 100,
        height: 100,
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