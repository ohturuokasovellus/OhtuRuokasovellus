import { useContext } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { themeContext } from '../../controllers/themeController';
import { StyleSheet, Picker as PickerNative } from 'react-native';

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

/** Wrapper for react-native's picker consistent with the app layout. */
const Picker = ({ selectedValue, onValueChange, items }) => {
    const styles = createStyles();
    return (
        <PickerNative
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.picker}
        >
            {items.map((item, index) => (
                <PickerNative.Item
                    key={index}
                    label={item.label}
                    value={item.value}
                />
            ))}
        </PickerNative>
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
            marginVertical: 6,
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
            marginTop: -2,
        },
        dropdownItemStyles: {
            color: colors.outline,
        },
        dropdownTextStyles : {
            color: colors.onSurface,
            fontFamily: 'Roboto-Regular'
        },
        picker: {
            height: 40,
            width: 150,
            margin: 8,
            borderRadius: 8,
            borderColor: colors.outlineVariant,
            borderWidth: 1,
            paddingLeft: 8,
            backgroundColor: colors.surfaceVariant,
            color: colors.outline,
            fontFamily: 'Roboto-Regular',
            overflow: 'hidden',
        },
    });
};

export { Dropdown, Picker };
