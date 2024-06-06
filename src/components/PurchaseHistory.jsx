import { useEffect, useState } from 'react';
import { ScrollView, Text, View, FlatList } from 'react-native';
import { Card } from './ui/Card';
import createStyles from '../styles/styles';
import apiUrl from '../utils/apiUrl';
import axios from 'axios';
import { getSession } from '../controllers/sessionController';

/**
 * 
 * @param {object} props
 * @param {{ mealId: number, name: string, date: Date }} props.meal
 * @returns 
 */
const HistoryItem = ({ meal, images, styles }) => {
    const dateString = new Date(meal.date).toLocaleString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    return (
        <Card styles={styles} imgURI={images[meal.mealId]}
            title={meal.mealName} body={dateString}
        />
    );
};

const PurchaseHistory = () => {
    const styles = createStyles();
    const [history, setHistory] = useState([]);
    const [images, setImages] = useState({});

    const loadHistory = async () => {
        let meals;
        try {
            const response = await axios.get(`${apiUrl}/purchases`, {
                headers: {
                    Authorization: `Bearer ${getSession().token}`,
                },
            });
            meals = response.data.sort((a, b) => a.date < b.date);
        } catch (err) {
            console.error(err);
            return;
        }
        setHistory(meals);
        loadImages(meals);
    };

    /**
     * Loads images for the meals.
     * @param {{ mealId: number, name: string, date: Date }[]} meals 
     */
    const loadImages = async meals => {
        for (let meal of meals) {
            if (Object.keys(images).includes(meal.mealId)) continue;
            try {
                const response = await axios.get(
                    `${apiUrl}/meals/images/${meal.mealId}`
                );
                setImages(current => ({ ...current, [meal.mealId]: response.data }));
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>Ateriahistoria</Text>
                <FlatList data={history}
                    keyExtractor={item => item.date.toString()}
                    renderItem={({ item }) =>
                        <HistoryItem
                            meal={item} styles={styles} images={images}
                        />
                    }
                />
            </View>
        </ScrollView>
    );
};

export default PurchaseHistory;
