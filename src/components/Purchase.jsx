import { ScrollView, Text, View } from 'react-native';
import { useParams } from '../Router';
import createStyles from '../styles/styles';

const Purchase = () => {
    const { mealId } = useParams();

    const styles = createStyles();

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.body}>You are viewing meal {mealId}</Text>
            </View>
        </ScrollView>
    );
};

export default Purchase;
