import { useContext } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { themeContext } from '../../controllers/themeController';
import { StyleSheet } from 'react-native';

/** Wrapper for SelectList with styling consistent
 * with the app layout. Takes all SelectList props, see
 * https://www.npmjs.com/package/react-native-dropdown-select-list
 */
const Dropdown = ({ ...props }) => {
    const styles = createStyles();
    return (
        <SelectList
            boxStyles={styles.selectList}
            inputStyles={styles.inputStyles}
            dropdownStyles={styles.dropdownStyles}
            dropdownItemStyles={styles.dropdownItemStyles}
            dropdownTextStyles={styles.dropdownTextStyles}
            {...props}
        />
    );
};

const createStyles = () => {
    const { colors } = useContext(themeContext);
    return StyleSheet.create({
        selectList: {
            height: 40,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            borderRadius: 8,
            marginBottom: 12,
            paddingLeft: 8,
            color: colors.outline,
            backgroundColor: colors.surfaceVariant,
        },
        inputStyles: {
            color: colors.onSurfaceVariant,
        },
        dropdownStyles: {
            borderColor: colors.outlineVariant,
            borderwidth: 1,
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.05)',
            marginBottom: 12,
            marginTop: -6,
        },
        dropdownItemStyles: {
            color: colors.outline,
        },
        dropdownTextStyles : {
            color: colors.onSurface,
            fontFamily: 'Roboto-Regular'
        },
    });
};

export { Dropdown };
