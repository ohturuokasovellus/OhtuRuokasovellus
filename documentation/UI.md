# Styles

The application currently uses a global stylesheet (`/src/styles/styles.js`) for the most common elements (typography, general containers). Otherwise the styles are defined locally for the UI components.

# Themes

Light/dark mode is supported. The theme toggle is currently the leftmost button on the navigation bar. The theme controller is imported only in `App.jsx`, and wraps the whole app.

Theme colours are defined in `/src/styles/colors.js`.

# Usage
To apply global styles to a new screen/component, use the following structure:

    // import the stylesheet
    import createStyles from '../styles/styles';

    const MyNewPage = (props) => {
        // create styles here, not outside
        // this ensures the theme controller works as intended
        const styles = createStyles();

        return (
            // wrap whatever you want to display within a background
            // and a container to keep the layout consistent as follows
            <Scrollview style={styles.background}>
                <View style={styles.container}>
                    // something here
                </View>
            </ScrollView>
        );
    };

Local styles that work with the theme colours can be created as follows:

    // include the following imports
    import { useContext } from 'react';
    import { StyleSheet } from 'react-native';
    import { themeContext } from '../../controllers/themeController';

    const MyComponent = (props) => {
        // use your stylesheet
        const styles = createStyles();

        // do something here
        return;
    };

    // create the stylesheet
    const createStyles = () => {
        const { colors } = useContext(themeContext);
        return StyleSheet.create({
            example: {
                fontFamily: 'Roboto-Bold',
                color: colors.primary,
            },
        });
    };


# UI Components

There are custom hooks/wrappers written for some commonly used elements. These can be found in `/src/components/ui`. Should be fairly straight forward how to use them – import and define properties. Current components include basic buttons, input fields, check boxes, select lists, and cards (for meals etc.).
