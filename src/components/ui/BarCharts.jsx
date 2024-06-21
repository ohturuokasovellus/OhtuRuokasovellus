import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { themeContext } from '../../controllers/themeController';

const BarChartCustom = ({ title, data, styles, ...props }) => {
    const { colors } = useContext(themeContext);
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
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
        }}>
            <Text style={[styles.h6, { textAlign: 'center' }]}>
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

export { BarChartCustom };
