import React, { useState } from 'react'
import { Text, TextInput, Pressable, View, Button, StyleSheet } from 'react-native';
import { useFormik, Formik } from 'formik';
import * as yup from 'yup';


const LoginValidationSchema = yup.object().shape({
    username: yup.string()
      .required('Username is required'),
    password: yup.string()
      .required('Password is required'),
  });
  

const LoginForm = (props) => {
    const [submitted, setSubmitted] = useState(false); 
    return (
    <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
            console.log(values);
            setSubmitted(true);}}
        validationSchema={LoginValidationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.cont}>
         <TextInput
           style={styles.input}
           onChangeText={handleChange('username')}
           onBlur={handleBlur('username')}
           value={values.username}
           placeholder="Username"
         />
        {(submitted || touched.username) && errors.username ? <div>{errors.username}</div> : null}

         <TextInput
          style={styles.input}
           onChangeText={handleChange('password')}
           onBlur={handleBlur('password')}
           value={values.password}
           placeholder="Password"
           secureTextEntry
         />
         {(submitted || touched.password) && errors.password ? <div>{errors.password}</div> : null}
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
