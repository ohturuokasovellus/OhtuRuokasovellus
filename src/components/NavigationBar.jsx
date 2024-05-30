import { useContext } from 'react';
import { View } from 'react-native';

import { useNavigate } from '../Router';
import { deleteSession } from '../controllers/sessionController';
import { themeContext } from '../controllers/themeController';

import { NavButton } from './ui/Buttons';
import createStyles from '../styles/layout';

const NavigationBar = ({ user, updateUser }) => {
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
                text='🌘︎'
                id='theme-toggle'
            />
            {user &&
                    <NavButton
                        styles={styles}
                        onPress={() => navigate('/')}
                        text='home'
                        id='navigation-home'
                    />
            }
            {!user &&
                    <NavButton
                        styles={styles}
                        onPress={() => navigate('/login')}
                        text='login'
                        id='navigation-login'
                    />
            }
            {!user &&
                    <NavButton
                        styles={styles}
                        onPress={() => navigate('/register')}
                        text='register'
                        id='navigation-register'
                    />
            }
            {user &&
                    <NavButton
                        styles={styles}
                        onPress={() => navigate('/qr-form')}
                        text='QR form'
                        id='navigation-qr-form'
                    />
            }
            {(user && user.restaurantId) &&
                    <NavButton
                        styles={styles}
                        onPress={() => navigate('/create-meal')}
                        text='add meal'
                        id='navigation-add-meal'
                    />
            }
            {user &&
                    <NavButton
                        styles={styles}
                        onPress={logOutPress}
                        text='logout'
                        id='navigation-logout'
                    />
            }
        </View>
    );
};
 
export default NavigationBar;