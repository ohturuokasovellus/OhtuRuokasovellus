import { useContext } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useNavigate } from '../Router';
import { getSession, deleteSession } from '../controllers/sessionController';
import { themeContext } from '../controllers/themeController';

import { NavButton } from './ui/Buttons';
import NavLink from './ui/NavigationLink';
import LanguageSwitch from './ui/LanguageSwitch';
import createStyles from '../styles/styles';

const NavigationBar = ({ updateUser }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const logOutPress = () => {
        deleteSession();
        updateUser(null);
        navigate('/login');
    };
    const { toggleTheme } = useContext(themeContext);
    const styles = createStyles();

    const userSession = getSession();

    return (
        <View style={styles.navigationBar}>
            <NavButton
                styles={styles}
                onPress={toggleTheme}
                text='🌗︎'
                id='theme-toggle'
            />
            {userSession &&
                    <NavLink
                        styles={styles}
                        path='/'
                        text={t('HOME')}
                        id='navigation-home'
                    />
            }
            {!userSession &&
                    <NavLink
                        styles={styles}
                        path='/login'
                        text={t('LOGIN')}
                        id='navigation-login'
                    />
            }
            {!userSession &&
                    <NavLink
                        styles={styles}
                        path='/register'
                        text={t('REGISTER')}
                        id='navigation-register'
                    />
            }
            {(userSession && userSession.restaurantId) &&
                    <NavLink
                        styles={styles}
                        path='/create-meal'
                        text={t('ADD_A_MEAL')}
                        id='navigation-add-meal'
                    />
            }
            {userSession &&
                    <NavButton
                        styles={styles}
                        onPress={logOutPress}
                        text={t('LOGOUT')}
                        id='navigation-logout'
                    />
            }
            <LanguageSwitch styles={styles}/>
        </View>
    );
};
 
export default NavigationBar;