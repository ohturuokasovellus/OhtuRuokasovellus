import React from 'react';
import { Text, View } from 'react-native';
import { CalculateNutriScore } from '../../utils/calculateNutriScore';

// Next developer, heed my warning: switch statements that use
// < or > cant be used in javascript... or at least they wont 
// make anything faster :(

/** Wrapper for Nutriscore
 * https://en.wikipedia.org/wiki/Nutri-Score
 * @param {Object} nutrition meal item including nutritional info, image, etc.
 * @param {Object} styles styles passed from the global stylesheet
 */
const Nutriscore = (nutrition, styles) => {
    const nutriScore = CalculateNutriScore(nutrition);
    let nutriScoreLabel = null;

    if (nutriScore < 0) {
        nutriScoreLabel = (
            <View style={styles.backgroundA}>
                <Text style={styles.nutriScoreText}>A</Text>
            </View>);
    } else if (nutriScore < 3){
        nutriScoreLabel = (
            <View style={styles.backgroundB}>
                <Text style={styles.nutriScoreText}>B</Text>
            </View>);
    } else if (nutriScore < 11){
        nutriScoreLabel = (
            <View style={styles.backgroundC}>
                <Text style={styles.nutriScoreText}>C</Text>
            </View>);
    } else if (nutriScore < 19){
        nutriScoreLabel = (
            <View style={styles.backgroundD}>
                <Text style={styles.nutriScoreText}>D</Text>
            </View>);
    } else {
        nutriScoreLabel = (
            <View style={styles.backgroundE}>
                <Text style={styles.nutriScoreText}>E</Text>
            </View>);
    }  
    
    return (
        <View style={styles.nutriScoreBackground}>
            <Text>Nutri-score: </Text>
            {nutriScoreLabel}
        </View>);
};

export { Nutriscore, CalculateNutriScore };