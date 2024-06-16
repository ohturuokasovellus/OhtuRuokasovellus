import React, { useState, useEffect } from 'react';
import { Text, ScrollView } from 'react-native';
import { useParams } from '../Router';
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
const ChunkedMealList = () => {
    const [data, setData] = useState([]);
    const { restaurantId } = useParams();

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
                // Convert the Uint8Array to a string
                    buffer += String.fromCharCode.apply(null, value);
                    // Split the buffer by newline or any other 
                    // delimiter you use
                    let parts = buffer.split('\n');
                    // Process all parts except the last 
                    // one (it might be incomplete)
                    for (let index = 0; index < parts.length - 1; index++) {
                        try {
                            setData(prevData => 
                                [...prevData, JSON.parse(parts[index])]);
                        } catch (error) {
                            console.log(error, 'buffer:', parts[index]);
                        }
                    }
                    // Keep the last part as it might be incomplete
                    buffer = parts[parts.length - 1];
                }
            }
            // Process any remaining buffer
            if (buffer) {
                try {
                    setData(prevData => [...prevData, JSON.parse(buffer)]);
                } catch (error) {
                    console.log(error, 'buffer:', buffer);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <ScrollView>
            {data.map((chunk, index) => (
                <Text key={index}>{chunk.data}</Text>
            ))}
        </ScrollView>
    );
};

export default ChunkedMealList;
