import { React, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import HomePage from './src/components/HomePage';
import Register from './src/components/Register';
import LoginForm from './src/components/Login';
import LogoutButton from './src/components/LogoutButton'
import Router, { Routes, Route } from './src/Router'

const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedRuokasovellusUser')
  return loggedUserJSON
    ? JSON.parse(loggedUserJSON)
    : null
}

const App = () => {
  const [user, setUser] = useState(getUser()) 
  const updateUser = (userData) => {
    setUser(userData)
    console.log(user)
  }

  return (
    <Router>
      <View style={styles.container}>
        {user &&
        <LogoutButton updateUser={updateUser}/>
        }
        <Routes>
          <Route path='/' element={<HomePage user={user} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<LoginForm updateUser={updateUser}/>} />
        </Routes>
      </View>
    </Router>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default App
