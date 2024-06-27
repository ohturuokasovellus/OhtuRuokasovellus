import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { themeContext } from '../../controllers/themeController';

const BarChartCustom = ({ title, data, ...props }) => {
    const { colors } = useContext(themeContext);
    const styles = createStyles();
    const chartConfig = {
        backgroundGradientFrom: colors.background,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: colors.background,
        backgroundGradientToOpacity: 0,
        decimalPlaces: 0,
        color: () => colors.onSurface,
        labelColor: () => colors.onSurface,
        strokeWidth: 2,
        barPercentage: 0.9,
        barRadius: 8,
        propsForLabels: {
            fontFamily: 'Roboto-Bold',
            fontSize: 12,
        }
    };

    return (
        <View style={styles.barChartContainer}>
            <Text style={styles.barChartHeader}>
                {title}
            </Text>
            <BarChart
                data={data}
                width={260}
                height={220}
                chartConfig={chartConfig}
                fromZero={true}
                showBarTops={false}
                withInnerLines={false}
                flatColor={true}
                {...props}
            />
        </View>
    );
};

const createStyles = () => {
    const { colors } = useContext(themeContext);
    return StyleSheet.create({
        barChartContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
        },
        barChartHeader: {
            fontSize: 18,
            color: colors.onSurface,
            fontFamily: 'Roboto-Bold',
            textAlign: 'center',
        },
    });
};

export { BarChartCustom };
