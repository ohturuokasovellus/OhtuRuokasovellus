import * as yup from 'yup';

// Adds a custom validation method to Yup for validating email addresses.
// Matches the regex used in backend.
// https://github.com/jquense/yup#stringemailmessage-string--function-schema
yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message,
        name: 'email',
        excludeEmptyString: true,
    });
});

const registrationValidationSchema = yup.object().shape({
    username: yup.string()
        .min(3, 'username must be at least 3 characters')
        .max(32, 'username cannot exceed 32 characters')
        .required('username is required'),
    email: yup.string().email('invalid email').required('email is required'),
    password: yup
        .string()
        .min(8, 'password must be at least 8 characters')
        .max(32, 'password cannot exceed 32 characters')
        .matches(/[a-z]/, 'password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'password must contain at least one uppercase letter')
        .matches(/\d/, 'password must contain at least one number')
        .matches(
            /[@$!%&€\-_:#+]/,
            'password must contain at least one special character'
        )
        .required('password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'passwords must match')
        .required('password confirmation is required'),
});

const restaurantValidationSchema = registrationValidationSchema.shape({
    name: yup.string()
        .min(3, 'restaurant name must be at least 3 characters')
        .max(32, 'restaurant name cannot exceed 32 characters')
        .required('restaurant name is required'),
});

export {
    registrationValidationSchema,
    restaurantValidationSchema
};
