import axios from 'axios';
import { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getSession } from '../controllers/sessionController';
import { useNavigate } from '../Router';
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
    const [allEmissions, setAllEmissions] = useState(0);
    const [ownEmissions, setOwnEmissions] = useState(0);
    const [restaurantId, setRestaurantId] = useState(null);
    const userSession = getSession();
    const navigate = useNavigate();

    if (!userSession || !restaurantId){
        navigate('/login');
    }

    useEffect(() => {
        const getRestaurantId = async () => {
            try{
                const response = await axios.get(
                    `${apiUrl}/getRestaurantId`,
                    {
                        headers: {
                            Authorization: `Bearer ${userSession.token}`,
                        },
                    }
                );
                setRestaurantId(response.data.restaurantId);
            }
            catch(error){
                console.log(error);
            }
        };

        getRestaurantId();
    }, []);

    useEffect(() => {
        const getRestaurantName = async () => {
            let response = null;
            try {
                response = await axios.get(
                    `${apiUrl}/restaurant-name/${restaurantId}`);
                setrestaurantName(response.data[0].restaurant_name);
            } catch (error) {
                console.log(error);
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
                console.log(error);
            }
        };

        if(restaurantId){
            getRestaurantName();
            getMealEmissions();
        }
    }, [restaurantId]);

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
