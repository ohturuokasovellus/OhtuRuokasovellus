import { React, useState } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';

import Router, { Routes, Route } from './src/Router';
import { getSession } from './src/controllers/sessionController';
import { ThemeController } from './src/controllers/themeController';

import NavigationBar from './src/components/NavigationBar';
import Home from './src/components/Home';
import Register from './src/components/Register';
import LoginForm from './src/components/Login';
import QRForm from './src/components/QRForm';
import RegisterRestaurant from './src/components/RegisterRestaurant';
import AddUser from './src/components/AddUser';
import MealList from './src/components/MealList';
import CreateMeal from './src/components/CreateMeal';

import Layout from './src/styles/layoutMock';


const App = () => {
    const [user, setUser] = useState(getSession());
    const updateUser = (userData) => {
        setUser(userData);
    };

    useFonts({
        'Jacquard12Regular': require('./assets/fonts/Jacquard12Regular.ttf'),
    });

    return (
        <ThemeController>
            <Router>
                <View>
                    <NavigationBar user={user} updateUser={updateUser}/>
                    <Routes>
                        <Route path='/' element={<Home user={user}/>} />
                        <Route path='/register'
                            element={<Register updateUser={updateUser}/>} />
                        <Route path='/login'
                            element={<LoginForm updateUser={updateUser}/>} />
                        <Route path='/qr-form' element={<QRForm />} />
                        <Route path='/restaurant/:restId'
                            element={<MealList />}/>
                        <Route path='/create-meal' element={<CreateMeal />} />
                        <Route path='/register-restaurant'
                            element=
                                {<RegisterRestaurant updateUser={updateUser}/>}
                        />
                        <Route path='/add-users'
                            element={<AddUser user={user} />} />
                        <Route path='/layout' element={<Layout/>}/>
                    </Routes>
                </View>
            </Router>
        </ThemeController>
        
    );
};

export default App;
