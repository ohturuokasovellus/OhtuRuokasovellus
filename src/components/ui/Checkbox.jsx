import { Pressable, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements';

/** Styled wrapper for checkboxes. */
const Checkbox = ({ styles, ...props}) => {
    return (
        <CheckBox
            Component={Pressable}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            checkedColor={styles.checkedIcon.backgroundColor}
            uncheckedColor={styles.checkboxIcon.borderColor}
            {...props}
        />
    );
};

/** Checkbox variant without surrounding container. 
 * Only the box itself is pressable, not the title.
*/
const CheckboxVariant = ({ styles, title, ...props}) => {
    return (
        <View style={styles.checkboxWrapper}>
            <CheckBox
                Component={Pressable}
                containerStyle={styles.checkboxContainerVariant}
                textStyle={styles.checkboxTextVariant}
                checkedColor={styles.checkedIcon.backgroundColor}
                uncheckedColor={styles.checkboxIcon.borderColor}
                {...props}
            />
            <Text style={styles.body}>{title}</Text>
        </View>
    );
};

export { Checkbox, CheckboxVariant };
