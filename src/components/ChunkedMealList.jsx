import React, { useState, useEffect } from 'react';
import { ScrollView, View, FlatList, Text } from 'react-native';
import { useParams } from '../Router';
import apiUrl from '../utils/apiUrl';
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
                            const meal = JSON.parse(chunk).data;
                            setMeals(prevMeals => [...prevMeals, meal]);
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
                    setMeals(prevMeals => [...prevMeals, meal]);
                } catch (error) {
                    console.log('Failed to parse final chunk:', buffer, 
                        error);
                }
            }
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
                        <Text>{item.meal_id}</Text>
                    )}
                />
            </View>
        </ScrollView>
    );
};

export default ChunkedMealList;
