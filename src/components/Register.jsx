import { useState } from 'react';
import { Text, Pressable, View, TextInput } from 'react-native'
import { useFormik } from 'formik'
import { Link } from '../Router'

// const [username, setUsername] = useState('');
// const [email, setEmail] = useState('');
// const [password, setPassword] = useState('');

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

const Register = () => {
    const onSubmit = values => {
        const username = values.username;
        const email = values.email;
        const password = values.password;
        console.log(username, email, password)
    };
    return <RegisterForm onSubmit={onSubmit} />;
};

// const Register = () => {
//     return (
//       <View>
//         <Text>moikkelis</Text>
//       </View>
//     )
//   }

export default Register
