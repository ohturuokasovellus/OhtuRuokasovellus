import React from 'react';
import { Text, View } from 'react-native';
import { CalculateNutriScore } from '../../utils/calculateNutriScore';

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
        score = 'A';
        color = scoreColors.ScoreA;
    } else if (nutriScore < 3) {
        score = 'B';
        color = scoreColors.ScoreB;
    } else if (nutriScore < 11) {
        score = 'C';
        color = scoreColors.ScoreC;
    } else if (nutriScore < 19) {
        score = 'D';
        color = scoreColors.ScoreD;
    } else {
        score = 'E';
        color = scoreColors.ScoreE;
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
                <Text style={styles.nutriscoreScore} id='nutri-score'>{score}</Text>
            </View>
        </View>
    );
};

export { Nutriscore };