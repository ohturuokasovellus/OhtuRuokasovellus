import React, { createContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from '../styles/colors';

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

    useEffect(() => {
        // eslint-disable-next-line no-undef
        const storedTheme = localStorage.getItem('appTheme');
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            // eslint-disable-next-line no-undef
            localStorage.setItem('appTheme', newTheme);
            return newTheme;
        });
    };

    const colors = theme === 'light' ? lightTheme : darkTheme;

    return (
        <themeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </themeContext.Provider>
    );
};
