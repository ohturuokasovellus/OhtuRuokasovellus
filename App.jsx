import { React, useState } from 'react';
import { View } from 'react-native';
import Home from './src/components/Home';
import Register from './src/components/Register';
import LoginForm from './src/components/Login';
import QRForm from './src/components/QRForm';
import RegisterRestaurant from './src/components/RegisterRestaurant';
import LogoutButton from './src/components/LogoutButton';
import { styles } from './src/styling/styles';
import { getSession } from './src/controllers/sessionController';
import MealList from './src/components/MealList';
import CreateMeal from './src/components/CreateMeal';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
    const [user, setUser] = useState(getSession());
    const updateUser = (userData) => {
        setUser(userData);
    };

    return (
        <View style={styles.app}>
            {user &&
                <LogoutButton updateUser={updateUser}/>
            }
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Login'>
                    
                    <Stack.Screen name="Home" options={{ title: 'Kotisivu' }}>
                        {(props) => <Home {...props} user={user} />}
                    </Stack.Screen>
                    <Stack.Screen name="Register">
                        {(props) => <Register {...props} 
                            updateUser={updateUser}/>}
                    </Stack.Screen> 
                    <Stack.Screen name="Login">
                        {(props) => <LoginForm {...props} 
                            updateUser={updateUser}/>}
                    </Stack.Screen>
                    <Stack.Screen name="QRForm">
                        {() => <QRForm/>}
                    </Stack.Screen>
                    <Stack.Screen name="MealList">
                        {() => <MealList/>}
                    </Stack.Screen>
                    <Stack.Screen name="CreateMeal">
                        {() => <CreateMeal/>}
                    </Stack.Screen>
                    <Stack.Screen name="RegisterRestaurant">
                        {() => <RegisterRestaurant updateUser={updateUser}/>}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
};

export default App;
