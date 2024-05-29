import React, { createContext, useState } from 'react';
import { lightTheme, darkTheme } from '../styling/colors';

/**
 * Context for managing the theme state.
 * @property {string} theme current theme (light/dark)
 * @property {Function} toggleTheme
 * @property {Object} colors
 */
export const themeContext = createContext();

// controls the theme changes
export const ThemeController = ({ children }) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const colors = theme === 'light' ? lightTheme : darkTheme;

    return (
        <themeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </themeContext.Provider>
    );
};
