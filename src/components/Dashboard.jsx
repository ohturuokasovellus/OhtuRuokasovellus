import { useEffect, useState, useContext } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { getSession } from '../controllers/sessionController';
import apiUrl from '../utils/apiUrl';
import createStyles from '../styles/styles';
import { themeContext } from '../controllers/themeController';

import { BarChartCustom } from './ui/BarCharts';

const RestaurantDashboard = () => {
    const { colors } = useContext(themeContext);
    const styles = createStyles();
    const userSession = getSession();
    const [restaurantName, setrestaurantName] = useState('');
    const [allEmissions, setAllEmissions] = useState(0);
    const [ownEmissions, setOwnEmissions] = useState(0);
    const [loading, setLoading] = useState(true);

    const getRestaurantName = async () => {
        let response = null;
        try {
            response = await axios.get(`${apiUrl}/restaurant-name/`,
                {
                    headers: {
                        Authorization: `Bearer ${userSession.token}`,
                    },
                });
            if (!response.data) return;
            setrestaurantName(response.data[0].restaurant_name);
        } catch (error) {
            console.log(error);
        }
    };

    const getMealEmissions = async () => {
        let response = null;
        try {
            response = await axios.get(`${apiUrl}/all-meal-emissions/`,
                {
                    headers: {
                        Authorization: `Bearer ${userSession.token}`,
                    },
                });

            let index = 0;
            let ownMealsCounter = 0;
            const emissions = response.data.emissions;
            while (index < emissions.length) {
                let meal = emissions[index];
                setAllEmissions(previousValue => 
                    previousValue + Number(meal.co2_emissions));
                if (meal.restaurant_id == response.data.restaurantId) {
                    ownMealsCounter += 1;
                    setOwnEmissions(previousValue => 
                        previousValue + Number(meal.co2_emissions));
                }
                index += 1;
            }
            setOwnEmissions(previousValue => 
                previousValue / ownMealsCounter);
            setAllEmissions(previousValue => 
                previousValue / emissions.length);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getRestaurantName();
            await getMealEmissions();
            setLoading(false);
        };
        if (userSession) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <View style={styles.cardContainer}>
                <ActivityIndicator
                    size='large'
                    color={colors.primary}
                />
            </View>
        );
    }

    const chartData = {
        labels: [restaurantName, 'All restaurants'],
        datasets: [
            {
                data: [
                    parseFloat(ownEmissions.toFixed(1)),
                    parseFloat(allEmissions.toFixed(1))
                ]
            }
        ]
    };

    return (
        <View style={styles.cardContainer}>
            <Text style={styles.h3}>
                {restaurantName}
            </Text>
            <BarChartCustom
                data={chartData}
                title='Total CO2 emissions of meals'
                styles={styles}
                showValuesOnTopOfBars={true}
            />
        </View>
    );
};

const Dashboard = ({ isRestaurant }) => {
    return (
        // TODO: return user dashboard here
        isRestaurant ? (
            <RestaurantDashboard />
        ) : (
            null
        )
    );
};

export default Dashboard;
