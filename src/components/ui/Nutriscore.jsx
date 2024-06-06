import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

/** Wrapper for Nutriscore
 * https://en.wikipedia.org/wiki/Nutri-Score 
 * @param {Object} styles styles passed from the global stylesheet
 * @param {Object} meal meal item including nutritional info, image, etc.
 */
const Nutriscore = ({meal}) => {
    const nutrition = {
        energy: meal.energy,
        carbohydrates: meal.carbohydrates,
        protein: meal.protein,
        sugar: meal.sugar,
        fiber: meal.fiber,
        saturatedFat: meal.saturated_fat,
        salt: meal.salt,
    };

    const kilocalories = nutrition.energy / 4.184;

    let negativePoints = 0;
    let positivePoints = 0;

    switch(kilocalories) {
    case kilocalories > 800:
        negativePoints += 10;
        break;
    case kilocalories > 720:
        negativePoints += 9;
        break;
    case kilocalories > 640:
        negativePoints += 8;
        break;
    case kilocalories > 560:
        negativePoints += 7;
        break;
    case kilocalories > 480:
        negativePoints += 6;
        break;
    case kilocalories > 400:
        negativePoints += 5;
        break;
    case kilocalories > 320:
        negativePoints += 4;
        break;
    case kilocalories > 240:
        negativePoints += 3;
        break;
    case kilocalories > 160:
        negativePoints += 2;
        break;
    case kilocalories > 80:
        negativePoints += 1;
        break;
    default:
        break;
    }

    const simpleSugars = nutrition.carbohydrates + nutrition.sugar;
    switch(simpleSugars) {
    case simpleSugars > 45:
        negativePoints += 10;
        break;
    case simpleSugars > 40:
        negativePoints += 9;
        break;
    case simpleSugars > 36:
        negativePoints += 8;
        break;
    case simpleSugars > 31:
        negativePoints += 7;
        break;
    case simpleSugars > 27:
        negativePoints += 6;
        break;
    case simpleSugars > 22.5:
        negativePoints += 5;
        break;
    case simpleSugars > 18:
        negativePoints += 4;
        break;
    case simpleSugars > 13.5:
        negativePoints += 3;
        break;
    case simpleSugars > 9:
        negativePoints += 2;
        break;
    case simpleSugars > 4.5:
        negativePoints += 1;
        break;
    default:
        break;
    }

    const saturatedFats = nutrition.saturatedFat;

    if(saturatedFats > 10){
        negativePoints += 10;
    }
    else{
        // for example, if saturatedFats is 9.9, 9 is added 
        // to the negativePoints. If saturatedFats is 2.2, 2 is added.
        negativePoints += Math.floor(saturatedFats);
    }

    switch(nutrition.salt) {
    case nutrition.salt > 900:
        negativePoints += 10;
        break;
    case nutrition.salt > 810:
        negativePoints += 9;
        break;
    case nutrition.salt > 720:
        negativePoints += 8;
        break;
    case nutrition.salt > 630:
        negativePoints += 7;
        break;
    case nutrition.salt > 540:
        negativePoints += 6;
        break;
    case nutrition.salt > 450:
        negativePoints += 5;
        break;
    case nutrition.salt > 360:
        negativePoints += 4;
        break;
    case nutrition.salt > 270:
        negativePoints += 3;
        break;
    case nutrition.salt > 180:
        negativePoints += 2;
        break;
    case nutrition.salt > 90:
        negativePoints += 1;
        break;
    default:
        break;
    }

    switch(nutrition.fiber) {
    case nutrition.fiber > 4.5:
        positivePoints += 5;
        break;
    case nutrition.fiber > 2.8:
        positivePoints += 4;
        break;
    case nutrition.fiber > 2.1:
        positivePoints += 3;
        break;
    case nutrition.fiber > 1.4:
        positivePoints += 2;
        break;
    case nutrition.fiber > 0.7:
        positivePoints += 1;
        break;
    default:
        break;
    }

    switch(nutrition.protein) {
    case nutrition.protein > 8:
        positivePoints += 5;
        break;
    case nutrition.protein > 6.4:
        positivePoints += 4;
        break;
    case nutrition.protein > 4.8:
        positivePoints += 3;
        break;
    case nutrition.protein > 3.2:
        positivePoints += 2;
        break;
    case nutrition.protein > 1.6:
        positivePoints += 1;
        break;
    default:
        break;
    }

    const nutriScore = negativePoints - positivePoints;

    switch(nutriScore) {
    case nutriScore < 0:
        return (
            <View style={styles.container}>
                <Text>Nutri-score</Text>
                <View style={styles.rectangleA}><Text>A</Text></View>
                <View style={styles.rectangleB}><Text>B</Text></View>
                <View style={styles.rectangleC}><Text>C</Text></View>
                <View style={styles.rectangleD}><Text>D</Text></View>
                <View style={styles.rectangleE}><Text>E</Text></View>
            </View>);
    case nutrition.protein < 3:
        return (
            <View style={styles.container}>
                <Text>Nutri-score</Text>
                <View style={styles.rectangleA}><Text>A</Text></View>
                <View style={styles.rectangleB}><Text>B</Text></View>
                <View style={styles.rectangleC}><Text>C</Text></View>
                <View style={styles.rectangleD}><Text>D</Text></View>
                <View style={styles.rectangleE}><Text>E</Text></View>
            </View>);
    case nutrition.protein < 11:
        return (
            <View style={styles.container}>
                <Text>Nutri-score</Text>
                <View style={styles.rectangleA}><Text>A</Text></View>
                <View style={styles.rectangleB}><Text>B</Text></View>
                <View style={styles.rectangleC}><Text>C</Text></View>
                <View style={styles.rectangleD}><Text>D</Text></View>
                <View style={styles.rectangleE}><Text>E</Text></View>
            </View>);
    case nutrition.protein < 19:
        return (
            <View style={styles.container}>
                <Text>Nutri-score</Text>
                <View style={styles.rectangleA}><Text>A</Text></View>
                <View style={styles.rectangleB}><Text>B</Text></View>
                <View style={styles.rectangleC}><Text>C</Text></View>
                <View style={styles.rectangleD}><Text>D</Text></View>
                <View style={styles.rectangleE}><Text>E</Text></View>
            </View>);
    default:
        return (
            <View style={styles.container}>
                <Text>Nutri-score</Text>
                <View style={styles.rectangleA}><Text>A</Text></View>
                <View style={styles.rectangleB}><Text>B</Text></View>
                <View style={styles.rectangleC}><Text>C</Text></View>
                <View style={styles.rectangleD}><Text>D</Text></View>
                <View style={styles.rectangleE}><Text>E</Text></View>
            </View>);
    }
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 8,
        position: 'relative',
    },
    rectangleA: {
        height: 128,
        width: 128,
        backgroundColor: 'green',
        position: 'absolute'
    },
    rectangleB: {
        height: 128,
        width: 128,
        backgroundColor: 'lightgreen',
        position: 'absolute'
    },
    rectangleC: {
        height: 128,
        width: 128,
        backgroundColor: 'yellow',
        position: 'absolute'
    },
    rectangleD: {
        height: 128,
        width: 128,
        backgroundColor: 'orange',
        position: 'absolute'
    },
    rectangleE: {
        height: 128,
        width: 128,
        backgroundColor: 'red',
        position: 'absolute'
    },
});

export { Nutriscore };