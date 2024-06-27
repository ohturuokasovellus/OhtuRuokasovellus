import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from './ui/Buttons';
import { Card } from './ui/Card';
import { useParams, useNavigate } from '../Router';
import createStyles from '../styles/styles';
import apiUrl from '../utils/apiUrl';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Purchase = ({ userSession }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { purchaseCode } = useParams();
    const [meal, setMeal] = useState(null);
    const [image, setImage] = useState(null);

    const loadMeal = async () => {
        let response;
        try {
            response = await axios.get(
                `${apiUrl}/purchases/meal/${purchaseCode}`
            );
        } catch (err) {
            console.error(err);
            alert(t('FAILED_TO_LOAD_MEAL'));
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
            alert(t('PURCHASE_CONFIRMED'));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!userSession) {
            navigate('/login');
            return;
        }
        void loadMeal();
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
                <Card
                    imgURI={image}
                    title={meal.name}
                    body={meal.description}
                />
                <Button
                    onPress={purchase}
                    text={t('BUY')}
                    id='purchase_button'
                />
            </View>
        </ScrollView>
    );
};

export default Purchase;
