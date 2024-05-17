import { Text, Pressable, View, TextInput } from 'react-native'
import { useFormik } from 'formik'
import axios from 'axios';
import { deleteSession } from '../controllers/sessionController'
import { useState, useEffect } from "react";
import { Link, useNavigate } from '../Router';

const initialValues = {
    username: '',
    email: '',
    password: ''
};

const RegisterForm = ({ onSubmit }) => {

    const formik = useFormik({
        initialValues,
        onSubmit,
    });

    return (
        <View>
            <TextInput
            placeholder = 'username'
            value = {formik.values.username}
            onChangeText={formik.handleChange('username')}
            />
            <TextInput
            placeholder = 'email'
            value = {formik.values.email}
            onChangeText={formik.handleChange('email')}
            />
            <TextInput
            placeholder = 'password'
            value = {formik.values.password}
            onChangeText={formik.handleChange('password')}
            />
            <Pressable onPress={formik.handleSubmit}>
                <Text>register</Text>
            </Pressable>
        </View>
    );
};

const Register = ({ updateUser }) => {
    useEffect(() => {
        deleteSession();
        updateUser(null);
    }, [])

    const onSubmit = async values => {
        const { username, email, password } = values
        // TODO: validate second password field
        
        try {
            const response = await axios.post('http://localhost:8080/api/register', { username, email, password })
            console.log('user created', response)
        } catch (err) {
            console.error(err)
        }
    };
    return <RegisterForm onSubmit={onSubmit} />;
};

export default Register
