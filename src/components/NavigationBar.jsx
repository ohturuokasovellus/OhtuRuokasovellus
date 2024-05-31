import { useNavigate } from '../Router';
import { Text, Pressable,View } from 'react-native';
import { deleteSession } from '../controllers/sessionController';
import LanguageSwitch from './LanguageSwitch';
import { useTranslation } from 'react-i18next';

const NavigationBar = ({ user, updateUser }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const logOutPress = () => {
        deleteSession();
        updateUser(null);
        navigate('/login');
    };

    return (
        <View style={{padding: '10px', marginBottom: '10', background: 'green', 
            fontFamily: 'system-ui', width:'100%', flexDirection: 'row'}}>
            {user &&
                <Pressable id='to_home_button' 
                    style={{marginRight: '10px'}}
                    onPress={() => navigate('/')}>
                    <Text style={{textDecoration: 'none', 
                        color: 'white'}}>{t('HOME')}</Text>
                </Pressable>
            }
            {!user &&
                <Pressable id='navbar_login_button' 
                    style={{marginRight: '10px'}}
                    onPress={() => navigate('/login')}>
                    <Text style={{textDecoration: 'none', 
                        color: 'white'}}>{t('LOGIN')}</Text>
                </Pressable>
            }
            {!user &&
                <Pressable id='navbar_register_button' 
                    style={{marginRight: '10px'}}
                    onPress={() => navigate('/register')}>
                    <Text style={{textDecoration: 'none', 
                        color: 'white'}}>{t('REGISTER')}</Text>
                </Pressable>
            }
            {user &&
                <Pressable id='to_qr_form_button'
                    style={{marginRight: '10px'}} 
                    onPress={() => navigate('/qr-form')}>
                    <Text style={{textDecoration: 'none',
                        color: 'white'}}>{t('QR_FORM')}</Text>
                </Pressable>
            }
            {(user && user.restaurantId) &&
                <Pressable id='to_create_meal_form_button'
                    style={{marginRight: '10px'}} 
                    onPress={() => navigate('/create-meal')}>
                    <Text style={{textDecoration: 'none',
                        color: 'white'}}>{t('ADD_A_MEAL')}</Text>
                </Pressable>
            }
            {user && 
                <Pressable id="logout_button"
                    style={{marginRight: '10px'}} 
                    title="Logout" onPress={logOutPress}>
                    <Text style={{textDecoration: 'none',
                        color: 'white'}}>{t('LOGOUT')}</Text>
                </Pressable>      
            }
            <LanguageSwitch />
        </View>
    );
};
 
export default NavigationBar;