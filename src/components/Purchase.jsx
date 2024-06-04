import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image } from 'react-native';
import { Button } from './ui/Buttons';
import { useParams, useNavigate } from '../Router';
import createStyles from '../styles/styles';
import apiUrl from '../utils/apiUrl';
import { getSession } from '../controllers/sessionController';
import axios from 'axios';

const Purchase = () => {
    const navigate = useNavigate();
    const { mealId } = useParams();
    const [meal, setMeal] = useState(null);
    const [image, setImage] = useState(null);
    const userSession = getSession();

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

    const purchase = async () => {
        try {
            await axios.post(
                `${apiUrl}/purchases`,
                { mealId },
                {
                    headers: {
                        Authorization: `Bearer ${userSession.token}`,
                    },
                }
            );
            alert('Osto varmistettu');
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!userSession) {
            navigate('/login');
            return;
        }
        loadMeal();
        loadImage();
    }, []);

    const styles = createStyles();

    if (!userSession) {
        return null;
    }

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
                <Button styles={styles} onPress={purchase} text={'Osta'} />
            </View>
        </ScrollView>
    );
};

export default Purchase;
