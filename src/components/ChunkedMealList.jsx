import React, { useState, useEffect } from 'react';
import { ScrollView, View, FlatList } from 'react-native';
import { useParams } from '../Router';
import apiUrl from '../utils/apiUrl';
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
    const [meals, setMeals] = useState([]);
    const { restaurantId } = useParams();
    const styles = createStyles();

    useEffect(() => {
        const fetchData = async () => {
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
                            setMeals(prevData => 
                                [...prevData, JSON.parse(chunk)]);
                        } catch (error) {
                            console.log('Failed to parse chunk:', chunk, error);
                        }
                    }
                }
            }
            // Process any remaining buffer
            if (buffer) {
                try {
                    setMeals(prevData => [...prevData, JSON.parse(buffer)]);
                } catch (error) {
                    console.log('Failed to parse final chunk:', buffer, 
                        error);
                }
            }
            console.log(meals)
        };

        fetchData();
        
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
                            onPress={() => console.log('painettu oon')}
                            isSelected={true}
                            sliceColor={'green'}
                        />
                    )}
                />
            </View>
        </ScrollView>
    );
};

export default ChunkedMealList;
