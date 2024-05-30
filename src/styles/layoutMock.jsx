/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import {
    View, Text, TextInput,
    ScrollView, Image, Pressable
} from 'react-native';
import createStyles from './layout';
import { themeContext } from '../controllers/themeController';

import { Button, SmallButton } from '../components/ui/Buttons';
import {
    Input, PasswordInput, FlexInput, MultilineInput
} from '../components/ui/InputFields';
import { Card } from '../components/ui/Card';

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
    const { toggleTheme, colors } = useContext(themeContext);
    const styles = createStyles(colors);
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

    return (
        <ScrollView style={styles.background}>



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

            {/* cards */}
            <Card
                styles={styles}
                imgURI={require('./example.jpg')}
                title={'card title'}
                body={loremIpsum}
            />

        </ScrollView>
    );
};

export default Layout;
