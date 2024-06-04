import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { useParams } from '../Router';
import createStyles from '../styles/styles';
import apiUrl from '../utils/apiUrl';
import axios from 'axios';

const Purchase = () => {
    const { mealId } = useParams();
    const [meal, setMeal] = useState(null);
    const [image, setImage] = useState(null);

    const loadMeal = async () => {
        try {
            const response = await axios.get(`${apiUrl}/meal/${mealId}`);
            setMeal(response.data);
        } catch (err) {
            console.error(err);
            alert('Annoksen lataus epäonnistui');
        }
    };

    const loadImage = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/meals/images/${mealId}`
            );
            setImage(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadMeal();
        loadImage();
    }, []);

    const styles = createStyles();

    if (meal === null) {
        return (
            <ScrollView style={styles.background}>
                <View style={styles.container}>
                    <Text style={styles.body}>Ladataan...</Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                {image && <Image
                    source={{ uri: image }}
                    style={{ width: 100, height: 100 }}
                />}
                <Text style={styles.h1}>{meal.name}</Text>
            </View>
        </ScrollView>
    );
};

export default Purchase;
