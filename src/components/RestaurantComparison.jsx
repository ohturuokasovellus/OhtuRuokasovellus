import { useEffect,} from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView } from 'react-native';
import createStyles from '../styles/styles';

const RestaurantComparison = () => {
    const {t} = useTranslation();
    const styles = createStyles();

    useEffect(() => {
    }, []);

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                <View style={styles.qrPage}>
                </View>
            </View>
        </ScrollView>
    );

};

export default RestaurantComparison;
