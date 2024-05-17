import React, { useState } from 'react'
import { TextInput, View, Button, Text } from 'react-native';
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
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate();
  const handleSubmit = async (values, actions) => {
      try {
          const response = await axios.post('http://localhost:8080/api/login', values)
          actions.setSubmitting(false);
          const userData = { username: response.data.username, token: response.data.token }
          createSession(userData)
          updateUser(userData)
          navigate('/');
      } catch (error) {
          setErrorMessage('Incorrect username or/and password')
          actions.setFieldError('general', 'Wrong credentials');
          actions.setSubmitting(false);
      }
  }

  return (
  <Formik
    initialValues={{ username: '', password: '' }}
    onSubmit={(values, actions) => {
      setErrorMessage('')
      handleSubmit(values, actions);}}
    validationSchema={LoginValidationSchema}
  >
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
      <View style={styles.login}>
        <TextInput
          style={styles.input}
          onChangeText={handleChange('username')}
          onBlur={handleBlur('username')}
          value={values.username}
          placeholder="Username"
        />
         {touched.username && errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}

        <TextInput
        style={styles.input}
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          value={values.password}
          placeholder="Password"
          secureTextEntry
        />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        <Button onPress={handleSubmit} title="Login" disabled={isSubmitting} />
        <View style={ styles.register }>
          <Button title="Register" onPress={() => navigate('/register')} />
        </View>
      </View>
    )}
  </Formik>
  )
};

export default LoginForm;
