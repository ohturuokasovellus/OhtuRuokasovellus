import { Pressable, Text, View } from 'react-native';
import { useContext } from 'react';
import { CheckBox } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { themeContext } from '../../controllers/themeController';

/** Styled wrapper for checkboxes. */
const Checkbox = ({ styles, ...props}) => {
    const { colors } = useContext(themeContext);
    const color = colors.outline;

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
const CheckboxVariant = ({ styles, title, ...props}) => {
    const { colors } = useContext(themeContext);
    const color = colors.outline;

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

export { Checkbox, CheckboxVariant };
