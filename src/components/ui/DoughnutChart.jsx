import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PieChart from 'react-native-pie-chart';

class DoughnutChart extends Component {
    render() {
        const { styles, series, sliceColor, labels } = this.props;

        return (
            <View style={styles.chartContainer}>
                <PieChart
                    widthAndHeight={150}
                    series={series}
                    sliceColor={sliceColor}
                    coverRadius={0.45}
                />
                <View style={styles.legendContainer}>
                    {labels.map((label, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[
                                styles.legendColor,
                                { backgroundColor: sliceColor[index] }
                            ]} />
                            <Text style={styles.legendText}>{label}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    }
}

export default DoughnutChart;
