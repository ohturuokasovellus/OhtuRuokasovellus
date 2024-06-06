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
 * @param {{ date: Date }} props.meal
 * @returns 
 */
const HistoryItem = ({ meal, styles }) => {
    const dateString = new Date(meal.date).toLocaleString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    return (
        <Card styles={styles} imgURI='' title={meal.name} body={dateString} />
    );
};

const PurchaseHistory = () => {
    const styles = createStyles();
    const [history, setHistory] = useState([]);

    const loadHistory = async () => {
        try {
            const response = await axios.get(`${apiUrl}/purchases`, {
                headers: {
                    Authorization: `Bearer ${getSession().token}`,
                },
            });
            setHistory(response.data);
        } catch (err) {
            console.error(err);
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
                        <HistoryItem meal={item} styles={styles} />
                    }
                />
            </View>
        </ScrollView>
    );
};

export default PurchaseHistory;
