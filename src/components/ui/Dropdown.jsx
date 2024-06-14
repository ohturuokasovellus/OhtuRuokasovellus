import { SelectList } from 'react-native-dropdown-select-list';

/** Wrapper for SelectList with styling consistent
 * with the app layout. Takes all SelectList props, see
 * https://www.npmjs.com/package/react-native-dropdown-select-list
 */
const Dropdown = ({ styles, ...props }) => {
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

export { Dropdown };
