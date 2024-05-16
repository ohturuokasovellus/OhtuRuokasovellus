import React from 'react'
import { TextInput, View, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginValidationSchema = yup.object().shape({
  username: yup.string()
    .required('Username is required'),
  password: yup.string()
    .required('Password is required'),
});

const createSession = (userData) => {
  window.localStorage.setItem(
    'loggedRuokasovellusUser', JSON.stringify(userData)
  )
}

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
    {({ handleChange, handleBlur, handleSubmit, values, errors, isValidating }) => (
      <View style={styles.cont}>
        <TextInput
          style={styles.input}
          onChangeText={handleChange('username')}
          onBlur={handleBlur('username')}
          value={values.username}
          placeholder="Username"
        />
      {isValidating && errors.username ? <div>{errors.username}</div> : null}

        <TextInput
        style={styles.input}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          value={values.password}
          placeholder="Password"
          secureTextEntry
        />
        {isValidating && errors.password ? <div>{errors.password}</div> : null}
        <Button onPress={handleSubmit} title="Login"/>
      </View>
    )}
  </Formik>
  )
};

const styles = StyleSheet.create({
  cont: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
  },
  input: {
      width: '100%',
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      marginBottom: 10,
  },
});

export default LoginForm;
