import { useEffect, useState, useContext } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { getSession } from '../controllers/sessionController';
import apiUrl from '../utils/apiUrl';
import createStyles from '../styles/styles';
import { themeContext } from '../controllers/themeController';

import { BarChartCustom } from './ui/BarCharts';

const UserDashboard = () => {
    const { t } = useTranslation();
    const { colors } = useContext(themeContext);
    const styles = createStyles();
    const userSession = getSession();
    const [averages, setAverages] = useState({
        all: { co2: null, carbs: null, fat: null, protein: null },
        user: { co2: null, carbs: null, fat: null, protein: null },
        gender: { co2: null, carbs: null, fat: null, protein: null },
        age: { co2: null, carbs: null, fat: null, protein: null },
    });
    const [gender, setGender] = useState('');
    const [ageGroup, setAgeGroup] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        let data;
        try {
            const response = await axios.get(`${apiUrl}/user/dashboard`, {
                headers: {
                    Authorization: `Bearer ${userSession.token}`,
                },
            });
            data = response.data;
        } catch (err) {
            setLoading(false);
            return;
        }

        setAgeGroup(data.ageGroup);
        switch (data.gender.toLowerCase()) {
        case 'man':
            setGender('M');
            break;
        case 'woman':
            setGender('F');
            break;
        default:
            setGender('X');
            break;
        }
        setAverages(data.averages);
        setLoading(false);
    };

    useEffect(() => {
        if (userSession) {
            loadData();
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <ScrollView style={styles.background}>
                <View style={styles.container}>
                    <View style={styles.cardContainer}>
                        <ActivityIndicator
                            size='large'
                            color={colors.primary}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }

    const labels = [t('YOU'), t('ALL'), gender, ageGroup];
    const co2Data = {
        labels: labels,
        datasets: [{
            data: [
                parseFloat(averages.user.co2),
                parseFloat(averages.all.co2),
                parseFloat(averages.gender.co2),
                parseFloat(averages.age.co2)
            ],
            colors: [
                () => colors.sliceColor[0],
                () => colors.sliceColor[2],
                () => colors.sliceColor[2],
                () => colors.sliceColor[2],
            ]
        }]
    };
    const carbsData = {
        labels: labels,
        datasets: [{
            data: [
                parseFloat(averages.user.carbs),
                parseFloat(averages.all.carbs),
                parseFloat(averages.gender.carbs),
                parseFloat(averages.age.carbs),
            ],
            colors: [
                () => colors.sliceColor[0],
                () => colors.sliceColor[2],
                () => colors.sliceColor[2],
                () => colors.sliceColor[2],
            ]
        }],
    };
    const fatData = {
        labels: labels,
        datasets: [{
            data: [
                parseFloat(averages.user.fat),
                parseFloat(averages.all.fat),
                parseFloat(averages.gender.fat),
                parseFloat(averages.age.fat),
            ],
            colors: [
                () => colors.sliceColor[0],
                () => colors.sliceColor[2],
                () => colors.sliceColor[2],
                () => colors.sliceColor[2],
            ]
        }],
    };
    const proteinData = {
        labels: labels,
        datasets: [{
            data: [
                parseFloat(averages.user.protein),
                parseFloat(averages.all.protein),
                parseFloat(averages.gender.protein),
                parseFloat(averages.age.protein),
            ],
            colors: [
                () => colors.sliceColor[0],
                () => colors.sliceColor[2],
                () => colors.sliceColor[2],
                () => colors.sliceColor[2],
            ]
        }],
    };

    return (
        <View style={styles.cardContainer} id='user-dashboard'>
            <Text style={styles.h3}>
                        Dashboard
            </Text>
            <View style={styles.chartDescrContainer}>
                <View style={styles.mealDescrContainer} id='avg-co2'>
                    <BarChartCustom
                        title={`${t('AVG_CO2')}\n${t('G_PER_MEAL')}`}
                        data={co2Data}
                        styles={styles}
                        withCustomBarColorFromData={true}
                    />
                </View>
                <View style={styles.mealDescrContainer} id='avg-carbs'>
                    <BarChartCustom
                        title={`${t('AVG_CARBS')}\n${t('G_PER_MEAL')}`}
                        data={carbsData}
                        styles={styles}
                        withCustomBarColorFromData={true}
                    />
                </View>
            </View>
            <View style={styles.chartDescrContainer}>
                <View style={styles.mealDescrContainer} id='avg-fat'>
                    <BarChartCustom
                        title={`${t('AVG_FAT')}\n${t('G_PER_MEAL')}`}
                        data={fatData}
                        styles={styles}
                        withCustomBarColorFromData={true}
                    />
                </View>
                <View style={styles.mealDescrContainer} id='avg-protein'>
                    <BarChartCustom
                        title={`${t('AVG_PROTEIN')}\n${t('G_PER_MEAL')}`}
                        data={proteinData}
                        styles={styles}
                        withCustomBarColorFromData={true}
                    />
                </View>
            </View>
        </View>
    );
};

const Dashboard = () => {
    // TODO: return resturant dashboard here if restaurant
    // yes this means refactoring
    return (
        <UserDashboard />
    );
};

export default Dashboard;
