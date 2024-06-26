import { React, useState } from 'react';
import { useFonts } from 'expo-font';

import Router, { Routes, Route } from './src/Router';
import { getSession } from './src/controllers/sessionController';
import { ThemeController } from './src/controllers/themeController';

import NavigationBar from './src/components/NavigationBar';
import Home from './src/components/Home';
import Register from './src/components/Register';
import LoginForm from './src/components/Login';
import AddUser from './src/components/AddUser';
import MealList from './src/components/MealList';
import CreateMeal from './src/components/CreateMeal';
import Purchase from './src/components/Purchase';
import PurchaseHistory from './src/components/PurchaseHistory';
import MenuQR from './src/components/MenuQR';
import MealQR from './src/components/MealQR';
import Settings from './src/components/Settings';
import AdminPanel from '/src/components/AdminPanel';
import About from '/src/components/About';
import './src/lang/i18n'; // should be inported in index.js, but idk if
//they mean the backend's index.js or frontend's app.jsx. Works when imported
// here.

const App = () => {
    const [user, setUser] = useState(getSession());
    const updateUser = (userData) => {
        setUser(userData);
    };

    useFonts({
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
        'Roboto-Italic': require('./assets/fonts/Roboto-Italic.ttf'),
        'Roboto-Thin': require('./assets/fonts/Roboto-Thin.ttf'),
    });

    return (
        <ThemeController>
            <Router>
                <NavigationBar updateUser={updateUser}/>
                <Routes>
                    <Route path='/' element={<About />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/register'
                        element={<Register updateUser={updateUser}/>} />
                    <Route path='/login'
                        element={<LoginForm updateUser={updateUser}/>} />
                    <Route path='/restaurant/:restaurantId'
                        element={<MealList />}/>
                    <Route path='/create-meal' element={<CreateMeal 
                        user={user} />} />
                    <Route path='/edit-meal/:mealId' element={<CreateMeal 
                        user={user} />} />
                    <Route path='/add-users'
                        element={<AddUser />} />
                    <Route path='/purchase/:purchaseCode'
                        element={<Purchase />} />
                    <Route path='/history' element={<PurchaseHistory />} />
                    <Route path='/menu-qr/:restaurantId'
                        element={<MenuQR />}/>
                    <Route path='/meal-qr/:mealPurchaseCode'
                        element={<MealQR />}/>
                    <Route path='/settings' element={<Settings />} />
                    <Route path='/admin-panel' element={<AdminPanel 
                        user={user} />} />
                </Routes>
            </Router>
        </ThemeController>
    );
};

export default App;
