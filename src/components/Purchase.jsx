import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from './ui/Buttons';
import { Card } from './ui/Card';
import { useParams, useNavigate } from '../Router';
import createStyles from '../styles/styles';
import apiUrl from '../utils/apiUrl';
import { getSession } from '../controllers/sessionController';
import axios from 'axios';

const loremIpsum = 'Lorem ipsum dolor sit amet, \
consecteturadipiscing elit, sed do eiusmod tempor \
incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco \
laboris nisi ut aliquip ex ea commodo consequat. \
Duis aute irure dolor in reprehenderit in voluptate \
velit esse cillum dolore eu fugiat nulla pariatur. \
Excepteur sint occaecat cupidatat non proident, \
sunt in culpa qui officia deserunt mollit anim id est laborum.';

const Purchase = () => {
    const navigate = useNavigate();
    const { purchaseCode } = useParams();
    const [meal, setMeal] = useState(null);
    const [image, setImage] = useState(null);
    const userSession = getSession();

    const loadMeal = async () => {
        let response;
        try {
            response = await axios.get(
                `${apiUrl}/purchases/meal/${purchaseCode}`
            );
        } catch (err) {
            console.error(err);
            alert('Annoksen lataus epäonnistui');
            return;
        }
        setMeal(response.data);
        try {
            const imageResp = await axios.get(
                `${apiUrl}/meals/images/${response.data.mealId}`
            );
            setImage(imageResp.data);
        } catch (err) {
            console.error(err);
        }
    };

    const purchase = async () => {
        try {
            await axios.post(
                `${apiUrl}/purchases`,
                { purchaseCode },
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
                <Card styles={styles} imgURI={image} title={meal.name}
                    body={loremIpsum}
                />
                <Button styles={styles} onPress={purchase}
                    text={'Osta'} id='purchase_button'
                />
            </View>
        </ScrollView>
    );
};

export default Purchase;
