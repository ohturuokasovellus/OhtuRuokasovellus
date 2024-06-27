import { React, useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFonts } from 'expo-font';
import Router, { Routes, Route } from './src/Router';
import { getSession } from './src/controllers/sessionController';
import { ThemeController } from './src/controllers/themeController';

import NavigationBar from './src/components/ui/NavigationBar';
import Home from './src/components/Home';
import Register from './src/components/Register';
import LoginForm from './src/components/Login';
import AddUser from './src/components/AddUser';
import MealList from './src/components/MealList';
import CreateMeal from './src/components/CreateMeal';
import Purchase from './src/components/Purchase';
import PurchaseHistory from './src/components/PurchaseHistory';
import QRDownload from './src/components/QRDownload';
import Settings from './src/components/Settings';
import AdminPanel from '/src/components/AdminPanel';
import About from '/src/components/About';

import './src/lang/i18n';

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const {t} = useTranslation();

    const updateUser = (userData) => {
        setUser(userData);
    };

    useEffect(() => {
        const getUserSession = async () => {
            const userSession = await getSession();
            setUser(userSession);
            setLoading(false);
        };
        
        void getUserSession();
    }, []);

    useFonts({
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
        'Roboto-Italic': require('./assets/fonts/Roboto-Italic.ttf'),
        'Roboto-Thin': require('./assets/fonts/Roboto-Thin.ttf'),
    });

    // This has to be here or React Native renders routes before userSession 
    // has been fetched.
    if (loading) {
        return (
            <View>
                <Text>{t('LOADING')}</Text>
            </View>
        );
    }

    return (
        <ThemeController>
            <Router>
                <NavigationBar updateUser={updateUser} userSession={user}/>
                <Routes>
                    <Route path='/' element={<About userSession={user} />} />
                    <Route path='/home' element={<Home userSession={user} />} />
                    <Route path='/register' element={<Register 
                        updateUser={updateUser} userSession={user}/>} />
                    <Route path='/login' element={<LoginForm 
                        updateUser={updateUser} userSession={user}/>} />
                    <Route path='/restaurant/:restaurantId'
                        element={<MealList />}/>
                    <Route path='/create-meal' element={<CreateMeal 
                        userSession={user} />} />
                    <Route path='/edit-meal/:mealId' element={<CreateMeal 
                        userSession={user} />} />
                    <Route path='/add-users'
                        element={<AddUser userSession={user} />} />
                    <Route path='/purchase/:purchaseCode'
                        element={<Purchase userSession={user} />} />
                    <Route path='/history' element={<PurchaseHistory 
                        userSession={user} />} />
                    <Route path='/menu-qr/:restaurantId'
                        element={<QRDownload />}/>
                    <Route path='/meal-qr/:mealPurchaseCode'
                        element={<QRDownload />}/>
                    <Route path='/settings' element={<Settings 
                        userSession={user} updateUser={updateUser}/>} />
                    <Route path='/admin-panel' element={<AdminPanel 
                        userSession={user} />} />
                </Routes>
            </Router>
        </ThemeController>
    );
};

export default App;
