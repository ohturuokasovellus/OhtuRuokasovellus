import { React, useState } from 'react';
import { View } from 'react-native';
import Home from './src/components/Home';
import Register from './src/components/Register';
import LoginForm from './src/components/Login';
import QRForm from './src/components/QRForm';
import RegisterRestaurant from './src/components/RegisterRestaurant';
import AddUser from './src/components/AddUser';
import LogoutButton from './src/components/LogoutButton';
import Router, { Routes, Route } from './src/Router';
import { styles } from './src/styling/styles';
import { getSession } from './src/controllers/sessionController';
import MealList from './src/components/MealList';
import CreateMeal from './src/components/CreateMeal';

const App = () => {
    const [user, setUser] = useState(getSession());
    const updateUser = (userData) => {
        setUser(userData);
    };

    return (
        <Router>
            <View style={styles.app}>
                {user &&
                    <LogoutButton updateUser={updateUser}/>
                }
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
                            {<RegisterRestaurant updateUser={updateUser}/>} />
                    <Route path='/add-users'
                        element={<AddUser user={user} />} />
                </Routes>
            </View>
        </Router>
    );
};

export default App;
