import React from 'react'
import { TextInput, View, Button } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { useNavigate } from '../Router'
import { styles } from '../styling/styles'
import * as yup from 'yup';
import { createSession } from '../controllers/sessionController'

const LoginValidationSchema = yup.object().shape({
  username: yup.string()
    .required('Username is required'),
  password: yup.string()
    .required('Password is required'),
});

const LoginForm = ({ updateUser }) => {
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
      try {
          const response = await axios.post('http://localhost:8080/api/login', values)
          const userData = { username: response.data.username, token: response.data.token }
          createSession(userData)
          updateUser(userData)
          navigate('/');
      } catch (error) {
          console.error(error)
      }
  }
  
  return (
  <Formik
    initialValues={{ username: '', password: '' }}
    onSubmit={(values) => {
        handleSubmit(values);}}
    validationSchema={LoginValidationSchema}
  >
    {({ handleChange, handleBlur, handleSubmit, values }) => (
      <View style={styles.login}>
        <TextInput
          style={styles.input}
          onChangeText={handleChange('username')}
          onBlur={handleBlur('username')}
          value={values.username}
          placeholder="Username"
        />
        <TextInput
        style={styles.input}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          value={values.password}
          placeholder="Password"
          secureTextEntry
        />
        <Button onPress={handleSubmit} title="Login"/>
        <View style={ styles.register }>
          <Button title="Register" onPress={() => navigate('/register')} />
        </View>
      </View>
    )}
  </Formik>
  )
};

export default LoginForm;
