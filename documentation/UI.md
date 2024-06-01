# Styles

The application currently uses a global stylesheet. The `layoutMock` component shows all the different styles and components that are currently defined – you can access the page by manually typing `/layout` at the end of the source URL of the application.

## Usage
To apply styles to a new screen/component, use the following structure:
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

# Themes

Light/dark mode is supported. The theme toggle is currently the leftmost button on the navigation bar. The theme controller is imported only in `App.jsx`, and wraps the whole app.

Theme colours are defined in `/src/styles/colors.js`.

# UI Components

There are custom hooks/wrappers written for some commonly used elements. These can be found in `/src/components/ui`. Should be fairly straight forward how to use them – import and define properties. Current components include basic buttons, input fields, and cards (for meals etc.).


