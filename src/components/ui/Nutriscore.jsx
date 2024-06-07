import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

/** Wrapper for Nutriscore
 * https://en.wikipedia.org/wiki/Nutri-Score 
 * @param {Object} styles styles passed from the global stylesheet
 * @param {Object} nutrition meal item including nutritional info, image, etc.
 */
const Nutriscore = (nutrition) => {
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

    switch(nutrition.vegetablePercent) {
    case nutrition.vegetablePercent > 80:
        positivePoints += 5;
        break;
    case nutrition.vegetablePercent > 60:
        positivePoints += 2;
        break;
    case nutrition.vegetablePercent > 40:
        positivePoints += 1;
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
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text>Nutri-score: </Text>
                <View style={styles.rectangleA}><Text
                    style={{fontWeight: 'bold', textAlignVertical: 'center',
                        textAlign: 'center'}}>A</Text></View>
            </View>);
    case nutrition.protein < 3:
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text>Nutri-score: </Text>
                <View style={styles.rectangleB}><Text
                    style={{fontWeight: 'bold', textAlignVertical: 'center',
                        textAlign: 'center'}}>B</Text></View>
            </View>);
    case nutrition.protein < 11:
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text>Nutri-score: </Text>
                <View style={styles.rectangleC}><Text
                    style={{fontWeight: 'bold', textAlignVertical: 'center',
                        textAlign: 'center'}}>C</Text></View>
            </View>);
    case nutrition.protein < 19:
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text>Nutri-score: </Text>
                <View style={styles.rectangleD}><Text
                    style={{fontWeight: 'bold', textAlignVertical: 'center',
                        textAlign: 'center'}}>D</Text></View>
            </View>);
    default:
        return (
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text>Nutri-score: </Text>
                <View style={styles.rectangleE}><Text
                    style={{fontWeight: 'bold', textAlignVertical: 'center',
                        textAlign: 'center'}}>E</Text></View>
            </View>);
    }
};

const styles = StyleSheet.create({
    rectangleA: {
        height: '100%',
        width: '5%',
        backgroundColor: 'green',
    },
    rectangleB: {
        height: '100%',
        width: '5%',
        backgroundColor: 'lightgreen',
    },
    rectangleC: {
        height: '100%',
        width: '5%',
        backgroundColor: 'yellow',
    },
    rectangleD: {
        height: '100%',
        width: '5%',
        backgroundColor: 'orange',
    },
    rectangleE: {
        height: '90%',
        width: '5%',
        backgroundColor: 'red',
    },
});

export { Nutriscore };