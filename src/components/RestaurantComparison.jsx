import axios from 'axios';
import { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTranslation } from 'react-i18next';
import { getSession } from '../controllers/sessionController';
import createStyles from '../styles/styles';
import apiUrl from '../utils/apiUrl';

const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    barPercentage: 1
};

const RestaurantComparison = () => {
    const styles = createStyles();
    const [restaurantName, setrestaurantName] = useState('');
    const [error, setError] = useState(null);
    const [allEmissions, setAllEmissions] = useState(0);
    const [ownEmissions, setOwnEmissions] = useState(0);
    const userSession = getSession();
    const {t} = useTranslation();

    if (!userSession.restaurantId){
        return (
            <ScrollView style={styles.background}>
                <View style={styles.container}>
                    <Text style={styles.body}>
                        {t('UNAUTHORIZED')}
                    </Text>
                </View>
            </ScrollView>
        );
    }

    const restaurantId = userSession.restaurantId;

    useEffect(() => {
        const getRestaurantName = async () => {
            let response = null;
            try {
                response = await axios.get(
                    `${apiUrl}/restaurant-name/${restaurantId}`);
                setrestaurantName(response.data[0].restaurant_name);
            } catch (error) {
                setError(t('UNEXPECTED_ERROR'));
            }
        };

        const getMealEmissions = async () => {
            let response = null;
            try {
                response = await axios.get(
                    `${apiUrl}/all-meal-emissions/${restaurantId}`);
                let index = 0;
                let ownMealsCounter = 0;
                while (index < response.data.length) {
                    let meal = response.data[index];
                    setAllEmissions(previousValue => 
                        previousValue + Number(meal.co2_emissions));
                    if (meal.restaurant_id == restaurantId) {
                        ownMealsCounter += 1;
                        setOwnEmissions(previousValue => 
                            previousValue + Number(meal.co2_emissions));
                    }
                    index += 1;
                }
                setOwnEmissions(previousValue => 
                    previousValue / ownMealsCounter);
                setAllEmissions(previousValue => 
                    previousValue / response.data.length);
            } catch (error) {
                setError(t('UNEXPECTED_ERROR'));
            }
        };
        
        getRestaurantName();
        getMealEmissions();
    }, []);

    if (error) {
        return (
            <View >
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    const chartData = {
        labels: [restaurantName, 'All restaurants'],
        datasets: [
            {
                data: [ownEmissions, allEmissions]
            }
        ]
    };

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container} id='bar-chart'>
                <Text style={styles.body}>
                    {restaurantName}
                </Text>
                <BarChart 
                    style={{}}
                    data={chartData}
                    width={500}
                    height={220}
                    yAxisLabel="CO2 "
                    chartConfig={chartConfig}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                />
            </View>
        </ScrollView>
    );
};

export default RestaurantComparison;
