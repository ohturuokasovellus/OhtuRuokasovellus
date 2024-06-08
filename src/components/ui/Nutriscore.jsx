import React from 'react';
import { Text, View } from 'react-native';
import { CalculateNutriScore } from '../../utils/calculateNutriScore';

// Next developer, heed my warning: switch statements that use
// < or > cant be used in javascript... or at least they wont 
// make anything faster :(
// ↑ RIP ): /merz

/** Wrapper for Nutriscore
 * https://en.wikipedia.org/wiki/Nutri-Score
 * @param {Object} nutrition meal item including nutritional info, image, etc.
 * @param {Object} styles styles passed from the global stylesheet
 */
const Nutriscore = (nutrition, styles) => {
    const nutriScore = CalculateNutriScore(nutrition);
    const scoreColors = {
        ScoreA: '#038C3E',
        ScoreB: '#8FBF26',
        ScoreC: '#F2B705',
        ScoreD: '#F27405',
        ScoreE: '#D92414',
    };

    let score;
    let color;

    if (nutriScore < 0) {
        score = 'ScoreA';
        color = scoreColors.A;
    } else if (nutriScore < 3) {
        score = 'ScoreB';
        color = scoreColors.B;
    } else if (nutriScore < 11) {
        score = 'ScoreC';
        color = scoreColors.C;
    } else if (nutriScore < 19) {
        score = 'ScoreD';
        color = scoreColors.D;
    } else {
        score = 'ScoreE';
        color = scoreColors.E;
    }

    return (
        <View style={styles.nutriscoreContainer}>
            <Text style={styles.nutriscoreText}>Nutri-Score:</Text>
            <View
                style={[
                    styles.nutriscoreScoreContainer,
                    { backgroundColor: color }
                ]}
            >
                <Text style={styles.nutriscoreScore}>{score}</Text>
            </View>
        </View>
    );
};

export { Nutriscore };