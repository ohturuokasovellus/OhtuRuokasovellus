import { React, useState } from 'react';
import { View } from 'react-native';
import HomePage from './src/components/HomePage';
import Register from './src/components/Register';
import LoginForm from './src/components/Login';
import QRForm from './src/components/QRForm';
import LogoutButton from './src/components/LogoutButton';
import Router, { Routes, Route } from './src/Router';
import { styles } from './src/styling/styles';
import { getSession } from './src/controllers/sessionController';
import './src/lang/i18n'; // should be inported in index.js, but idk if 
//they mean the backend's index.js or frontend's app.jsx. Works when imported
// here.

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
                    <Route path='/' element={<HomePage user={user} />} />
                    <Route path='/register'
                        element={<Register updateUser={updateUser}/>} />
                    <Route path='/login'
                        element={<LoginForm updateUser={updateUser}/>} />
                    <Route path='/qr-form' element={<QRForm />} />
                </Routes>
            </View>
        </Router>
    );
};

export default App;
