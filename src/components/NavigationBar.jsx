import { useNavigate } from '../Router';
import { Text, Pressable } from 'react-native';
import { deleteSession } from '../controllers/sessionController';

const NavigationBar = ({ user, updateUser }) => {
    const navigate = useNavigate();
    const logOutPress = () => {
        deleteSession();
        updateUser(null);
        navigate('/login');
    };

    return (
        <nav style={{padding: '10px', marginBottom: '10', background: 'green', 
            fontFamily: 'system-ui', width:'100%'}}>
            <ul style={{display: 'flex', flexDirection: 'row', 
                listStyleType: 'none'}}>
                {user &&
                    <li>
                        <Pressable style={{marginRight: '10px'}}
                            onPress={() => navigate('/')}>
                            <Text style={{textDecoration: 'none', 
                                color: 'white'}}>Home</Text>
                        </Pressable>
                    </li>
                }
                {!user &&
                    <li>
                        <Pressable style={{marginRight: '10px'}}
                            onPress={() => navigate('/login')}>
                            <Text style={{textDecoration: 'none', 
                                color: 'white'}}>Login</Text>
                        </Pressable>
                    </li>
                }
                {!user &&
                    <li>
                        <Pressable style={{marginRight: '10px'}}
                            onPress={() => navigate('/register')}>
                            <Text style={{textDecoration: 'none', 
                                color: 'white'}}>Register</Text>
                        </Pressable>
                    </li>
                }
                {user &&
                    <li>
                        <Pressable style={{marginRight: '10px'}} 
                            onPress={() => navigate('/qr-form')}>
                            <Text style={{textDecoration: 'none',
                                color: 'white'}}>QR Form</Text>
                        </Pressable>
                    </li>
                }
                {user && user.restaurantID &&
                    <li>
                        <Pressable style={{marginRight: '10px'}} 
                            onPress={() => navigate('/create-meal')}>
                            <Text style={{textDecoration: 'none',
                                color: 'white'}}>Add a meal</Text>
                        </Pressable>
                    </li>
                }
                {user && 
                    <li>
                        <Pressable title="Logout" onPress={logOutPress}>
                            <Text style={{textDecoration: 'none',
                                color: 'white'}}>logout</Text>
                        </Pressable>
                    </li>
                }
            </ul>
        </nav>
    );
};
 
export default NavigationBar;