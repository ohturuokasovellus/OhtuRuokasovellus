import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ExampleComponent from './src/components/Example';
import Register from './src/components/Register';
import LoginForm from './src/components/Login';
import QRForm from './src/components/QRForm';
import Router, { Routes, Route } from './src/Router'

const App = () => {
  return (
    <Router>
      <View style={styles.container}>
        <Routes>
          <Route path='/' element={<ExampleComponent />} />
          <Route path='/test' element={<Text>test</Text>} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/qr-form' element={<QRForm />} />
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
