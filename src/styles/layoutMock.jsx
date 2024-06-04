/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import {
    View, Text, ScrollView
} from 'react-native';
import createStyles from './styles';
import { themeContext } from '../controllers/themeController';

import { Button, SmallButton, ButtonVariant } from '../components/ui/Buttons';
import {
    Input, PasswordInput, FlexInput, MultilineInput
} from '../components/ui/InputFields';
import { Card, MealCard } from '../components/ui/Card';
import DoughnutChart from '../components/ui/DoughnutChart';
import NutritionalValues from '../components/ui/NutritionalValuesContainer';

const loremIpsum = 'Lorem ipsum dolor sit amet, \
consecteturadipiscing elit, sed do eiusmod tempor \
incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco \
laboris nisi ut aliquip ex ea commodo consequat. \
Duis aute irure dolor in reprehenderit in voluptate \
velit esse cillum dolore eu fugiat nulla pariatur. \
Excepteur sint occaecat cupidatat non proident, \
sunt in culpa qui officia deserunt mollit anim id est laborum.';

const Layout = () => {
    const { theme, colors } = useContext(themeContext);
    const styles = createStyles();
    const [inputs, setInputs] = useState([{ idx: 1, value: '' }]);

    const addInput = () => {
        setInputs([...inputs, { idx: inputs.length + 1, value: '' }]);
    };

    const removeInput = (idx) => {
        setInputs(inputs.filter(input => input.idx !== idx));
    };

    const handleInputChange = (idx, text) => {
        setInputs(inputs.map(
            input => (input.idx === idx ? { ...input, value: text } : input)
        ));
    };

    const sliceColor = [colors.primary, colors.secondary, colors.tertiary];

    const nutritionData = {
        energy: 72,
        protein: 1.3,
        carbs: 14.8,
        fat: 0.3,
        sugars: 8.2,
        fiber: 1,
        saturatedFat: 0.1,
        salt: 138.3
    };

    const renderBoxes = (currentTheme) => {
        return Object.keys(currentTheme).map((key, index) => {
            if (key.startsWith('on')) return null;
            const onKey = `on${key.charAt(0).toUpperCase() + key.slice(1)}`;
            return (
                <View
                    key={index}
                    style={{flexDirection: 'row', marginBottom: 8}}
                >
                    <View
                        style={{
                            flex: 1, height: 50, justifyContent: 'center',
                            alignItems: 'center', marginHorizontal:4,
                            backgroundColor: currentTheme[key]}}
                    >
                        <Text
                            style={[
                                styles.body, { color: currentTheme[onKey] }
                            ]}>
                            {key}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1, height: 50, justifyContent: 'center',
                            alignItems: 'center', marginHorizontal:4,
                            backgroundColor: currentTheme[onKey] 
                        }}>
                        <Text style={[
                            styles.body, { color: currentTheme[key] }
                        ]}>
                            {onKey}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    return (
        <ScrollView style={styles.background}>
            <View style={styles.container}>
                {/* typography */}
                <Text style={styles.h1}>Heading 1</Text>
                <Text style={styles.h2}>Heading 2</Text>
                <Text style={styles.h3}>Heading 3</Text>
                <Text style={styles.h4}>Heading 4</Text>
                <Text style={styles.h5}>Heading 5</Text>
                <Text style={styles.h6}>Heading 6</Text>
                <Text style={styles.body}>{loremIpsum}</Text>
                <Text style={styles.caption}>Caption</Text>
                <Text style={styles.smallCaption}>Small caption</Text>

                {/* error messages */}
                <Text style={styles.error}>This is an error message.</Text>

                {/* links */}
                <Text style={styles.link}>This is a link text.</Text>

                {/* buttons */}
                <Button onPress={() => {}} text='button' styles={styles}/>
                <ButtonVariant
                    onPress={() => {}}
                    text='button variant'
                    styles={styles}
                />
                <SmallButton onPress={() => {}} text='S' styles={styles}/>

                {/* input fields */}
                <Input styles={styles} placeholder='normal input'/>
                <PasswordInput styles={styles} placeholder='password'/>
                <MultilineInput
                    styles={styles}
                    placeholder={'this is a multiline input field'}
                    rows={4}
                />
                {inputs.map((input, index) => (
                    <View key={input.idx} style={styles.flexInputContainer}>
                        <FlexInput
                            styles={styles}
                            placeholder='flex input'
                            value={input.value}
                            onChangeText={(text) =>
                                handleInputChange(input.idx, text)}
                        />
                        {inputs.length > 1 && (
                            <SmallButton
                                onPress={() => removeInput(input.idx)}
                                text='–' styles={styles}
                            />
                        )}
                    </View>
                ))}
                <SmallButton
                    onPress={addInput} text='+' styles={styles}
                />
                {/* doughnut chart */}
                <DoughnutChart
                    styles={styles}
                    series={[1, 2, 3]}
                    sliceColor={sliceColor}
                    labels={['a', 'b', 'c']}
                />

                {/* cards */}
                <NutritionalValues
                    styles={styles}
                    nutrition={nutritionData}
                />
                <Card
                    styles={styles}
                    imgURI={require('./example.jpg')}
                    title={'card title'}
                    body={loremIpsum}
                />
                <MealCard
                    styles={styles}
                    imgURI={require('./example.jpg')}
                    title={'meal card title'}
                    body={loremIpsum}
                    onPress={() => {}}
                    isSelected={true}
                    sliceColor={sliceColor}
                    co2={'CO2'}
                    allergens={['maito', 'kala']}
                    nutrition={nutritionData}
                />

                {/* theme colours */}
                <ScrollView contentContainerStyle={{padding: 16}}>
                    {renderBoxes(colors)}
                </ScrollView>
            </View>
        </ScrollView>
    );
};

export default Layout;
