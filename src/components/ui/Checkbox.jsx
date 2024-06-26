import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useContext } from 'react';
import { CheckBox } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { themeContext } from '../../controllers/themeController';

/** Styled wrapper for checkboxes. */
const Checkbox = ({ ...props}) => {
    const styles = createStyles();
    const color = styles.outline.color;

    return (
        <CheckBox
            Component={Pressable}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            checkedIcon={
                <MaterialCommunityIcons
                    name='checkbox-marked' size={24} color={color} />
            }
            uncheckedIcon={
                <MaterialCommunityIcons
                    name='checkbox-blank-outline' size={24} color={color} />
            }
            {...props}
        />
    );
};

/** Checkbox variant without surrounding container. 
 * Only the box itself is pressable, not the title.
*/
const CheckboxVariant = ({ title, ...props}) => {
    const styles = createStyles();
    const color = styles.outline.color;

    return (
        <View style={styles.checkboxWrapper}>
            <CheckBox
                Component={Pressable}
                containerStyle={styles.checkboxContainerVariant}
                textStyle={styles.checkboxTextVariant}
                checkedIcon={
                    <MaterialCommunityIcons
                        name='checkbox-marked' size={24} color={color} />
                }
                uncheckedIcon={
                    <MaterialCommunityIcons
                        name='checkbox-blank-outline' size={24} color={color} />
                }
                {...props}
            />
            <Text style={styles.body}>{title}</Text>
        </View>
    );
};

const createStyles = () => {
    const { colors } = useContext(themeContext);
    return StyleSheet.create({
        checkboxContainer: {
            backgroundColor: colors.surfaceVariant,
            borderColor: colors.outlineVariant,
            borderRadius: 8,
            borderwidth: 1,
            padding: 8,
            marginBottom: 12,
        },
        checkboxContainerVariant: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            padding: 0,
            margin: 0,
        },
        checkboxWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        checkboxText: {
            color: colors.outline,
            fontFamily: 'Roboto-Regular',
        },
        outline: {
            color: colors.outline
        }
    });
};

export { Checkbox, CheckboxVariant };
