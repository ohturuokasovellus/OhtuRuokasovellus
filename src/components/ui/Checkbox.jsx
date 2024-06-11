import { CheckBox } from 'react-native-elements';

/** Styled wrapper for checkboxes. */
const Checkbox = ({ styles, ...props}) => {
    return (
        <CheckBox
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            checkedColor={styles.checkedIcon.backgroundColor}
            uncheckedColor={styles.checkboxIcon.borderColor}
            {...props}
        />
    );
};

export { Checkbox };
