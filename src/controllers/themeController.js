import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        const setPageTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem('appTheme');
                if (storedTheme) {
                    setTheme(storedTheme);
                }
            } catch (error) {
                console.log(error);
            }
        };

        setPageTheme();
    }, []);

    const toggleTheme = async () => {
        await setTheme(async (prevTheme) => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            try {
                await AsyncStorage.setItem('appTheme', newTheme);
            } catch (error) {
                console.log(error);
            }
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
