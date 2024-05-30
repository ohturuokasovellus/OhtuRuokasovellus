import React from 'react';

import { View, Text, Image, Pressable } from 'react-native';

/** Custom wrapper for cards with images
 * @param {object} styles styles passed from the global stylesheet
 * @param {string} imgURI image source
 * @param {string} title
 * @param {string} body
 */
const Card = ({ styles, imgURI, title, body }) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imgURI }}
                    style={styles.image} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.h5}>{title}</Text>
                <Text style={styles.body}>{body}</Text>
            </View>
        </View>
    );
};
/** Wrapper for meal cards. The container works as Pressable,
 * and renders the additional info if selected.
 * @param {object} styles
 * @param {string} imgURI
 * @param {string} title
 * @param {string} body
 * @param {function} onPress
 * @param {boolean} isSelected
 */
const MealCard = ({ styles, imgURI, title, body, onPress, isSelected }) => {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1, },
        ]}>
            <View style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: imgURI }}
                        style={styles.image}
                    />
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.h5}>{title}</Text>
                    {isSelected && (
                        <Text style={styles.body}>{body}</Text>
                    )}
                </View>
            </View>
        </Pressable>
    );
};

export { Card, MealCard };
