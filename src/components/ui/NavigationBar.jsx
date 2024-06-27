import { useContext, useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from '../../Router';
import { deleteSession } from '../../controllers/sessionController';
import { themeContext } from '../../controllers/themeController';

/** Component for navigation bar links.
 * @param {string} path path where the link leads to
 * @param {string} text link name displayed on the nav bar
 * @param {Object} styles styles passed from the global stylesheet
 * @param {string} id preferably in the form 'navigation-[name]'
 * @returns navigation link
 */
// eslint-disable-next-line id-length
const NavLink = ({ path, text, id }) => {
    const styles = createStyles();
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <Link 
            to={path}
            style={{
                ...styles.navigationLink,
                ...(isActive ? styles.activeNavigationLink : {})
            }}
            id={id}
        >
            {text}
        </Link>
    );
};

/** Custom wrapper for navigation bar buttons.
 * Use only for toggles etc. actual buttons, not links.
*/
const NavButton = ({ onPress, text, ...props }) => {
    const styles = createStyles();
    return (
        <Pressable
            style={
                ({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0}
                ]}
            onPress={onPress}
            role='link'
            {...props}
        >
            <Text style={styles.navigationLink}>{text}</Text>
        </Pressable>
    );
};

const LanguageSwitch = () => {
    const { i18n } = useTranslation();
    const [isEnglish, setIsEnglish] = useState(i18n.language === 'eng');

    const toggleLang = async () => {
        const newLanguage = isEnglish ? 'fin' : 'eng';
        setIsEnglish(!isEnglish);
        void i18n.changeLanguage(newLanguage);
        // eslint-disable-next-line no-undef
        void i18n.changeLanguage(newLanguage);
        try {
            await AsyncStorage.setItem('i18nextLanguage', newLanguage);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <NavButton
            onPress={toggleLang}
            text={isEnglish ? 'Suomeksi' : 'In English'}
            id='language-toggle'
        />
    );
};

const NavigationBar = ({ updateUser, userSession }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const logOutPress = async () => {
        await deleteSession();
        updateUser(null);
        navigate('/login');
    };
    const { toggleTheme } = useContext(themeContext);
    const styles = createStyles();

    return (
        <View style={styles.navigationBar}>
            <NavButton
                onPress={toggleTheme}
                text='🌗︎'
                id='theme-toggle'
            />
            {!userSession &&
                    <NavLink
                        path='/login'
                        text={t('LOGIN')}
                        id='navigation-login'
                    />
            }
            {!userSession &&
                    <NavLink
                        path='/register'
                        text={t('REGISTER')}
                        id='navigation-register'
                    />
            }
            {userSession &&
                <NavLink
                    path='/home'
                    text={t('HOME')}
                    id='navigation-home'
                />
            } 
            {(userSession && userSession.restaurantId) &&
                    <NavLink
                        path='/create-meal'
                        text={t('ADD_A_MEAL')}
                        id='navigation-add-meal'
                    />
            }
            <NavLink
                path='/'
                text={t('ABOUT')}
                id='navigation-about'
            />
            {userSession &&
                    <NavButton
                        onPress={logOutPress}
                        text={t('LOGOUT')}
                        id='navigation-logout'
                    />
            }
            <LanguageSwitch />
        </View>
    );
};

const createStyles = () => {
    const { colors } = useContext(themeContext);
    return StyleSheet.create({
        navigationBar: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 12,
            backgroundColor: colors.tertiary,
            position: 'fixed',
            top: 0,
            width: '100%',
            height: 60,
            zIndex: 1000,
            overflowX: 'auto',
        },
        navigationLink: {
            padding: 8,
            color: colors.onTertiary,
            fontSize: 16,
            fontFamily: 'Roboto-Black',
            textTransform: 'uppercase',
            textDecorationLine: 'none',
            whiteSpace: 'nowrap',
        },
        activeNavigationLink: {
            color: colors.primary,
        },
    });
};
 
export default NavigationBar;
