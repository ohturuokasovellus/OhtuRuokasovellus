import { ScrollView, Text, View, FlatList } from 'react-native';
import createStyles from '../styles/styles';
import { Card } from './ui/Card';

/**
 * 
 * @param {object} props
 * @param {object} props.meal
 * @param {Date} props.meal.purchased_at
 * @returns 
 */
const HistoryItem = ({ meal, styles }) => {
    
    const dateString = meal.purchased_at.toLocaleString(undefined, {
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

    const history = [
        { meal_id: 1, name: 'Lihapullat', purchased_at: new Date() },
        { meal_id: 2, name: 'Vegenakit', purchased_at: new Date(new Date().setFullYear(2023)) },
    ];

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.h1}>Ateriahistoria</Text>
                <FlatList data={history}
                    keyExtractor={item => item.purchased_at}
                    renderItem={({ item }) =>
                        <HistoryItem meal={item} styles={styles} />
                    }
                />
            </View>
        </ScrollView>
    );
};

export default PurchaseHistory;
