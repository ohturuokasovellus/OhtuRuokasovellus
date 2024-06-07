import { useContext } from 'react';
import { View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useNavigate } from '../Router';
import { deleteSession } from '../controllers/sessionController';
import { themeContext } from '../controllers/themeController';

import { NavButton } from './ui/Buttons';
import LanguageSwitch from './ui/LanguageSwitch';
import createStyles from '../styles/styles';

const NavigationBar = ({ user, updateUser }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const logOutPress = () => {
        deleteSession();
        updateUser(null);
        navigate('/login');
    };
    const { toggleTheme } = useContext(themeContext);
    const styles = createStyles();

    return (
        <View style={styles.navigationBar}>
            <NavButton
                styles={styles}
                onPress={toggleTheme}
                text='🌗︎'
                id='theme-toggle'
            />
            {user &&
                    <NavButton
                        styles={styles}
                        onPress={() => navigate('/')}
                        text={t('HOME')}
                        id='navigation-home'
                    />
            }
            {!user &&
                    <NavButton
                        styles={styles}
                        onPress={() => navigate('/login')}
                        text={t('LOGIN')}
                        id='navigation-login'
                    />
            }
            {!user &&
                    <NavButton
                        styles={styles}
                        onPress={() => navigate('/register')}
                        text={t('REGISTER')}
                        id='navigation-register'
                    />
            }
            {user &&
                    <NavButton
                        styles={styles}
                        onPress={() => navigate('/qr-form')}
                        text={t('QR_FORM')}
                        id='navigation-qr-form'
                    />
            }
            {(user && user.restaurantId) &&
                    <NavButton
                        styles={styles}
                        onPress={() => navigate('/create-meal')}
                        text={t('ADD_A_MEAL')}
                        id='navigation-add-meal'
                    />
            }
            {user &&
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