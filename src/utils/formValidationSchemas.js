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

// Username needs to be 3-32 characters and is a required field.
const usernameValidationSchema = yup.object().shape({
    username: yup.string()
        .min(3, 'USERNAME_MUST_BE_AT_LEAST_3_CHARACTERS')
        .max(32, 'USERNAME_CANNOT_EXCEED_32_CHARACTERS')
        .required('USERNAME_IS_REQUIRED'),
});


// Email is required. Uses the override regex.
const emailValidationSchema = yup.object().shape({
    email: yup.string().email('INVALID_EMAIL').required('EMAIL_IS_REQUIRED')
});

// Password needs to be 3-32 chars, and contain
// lower- & uppercase, digits, special chars
const passwordValidationSchema = yup.object().shape({
    password: yup
        .string()
        .min(8, 'PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS')
        .max(32, 'PASSWORD_CANNOT_EXCEED_32_CHARACTERS')
        .matches(/[a-z]/, 'PASSWORD_MUST_CONTAIN_AT_LEAST_ONE_LOWERCASE_LETTER')
        .matches(/[A-Z]/, 'PASSWORD_MUST_CONTAIN_AT_LEAST_ONE_UPPERCASE_LETTER')
        .matches(/\d/, 'PASSWORD_MUST_CONTAIN_AT_LEAST_ONE_NUMBER')
        .matches(
            /[@$!%&€\-_:#+]/,
            'PASSWORD_MUST_CONTAIN_AT_LEAST_ONE_SPECIAL_CHARACTER'
        )
        .required('PASSWORD_IS_REQUIRED'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'PASSWORDS_MUST_MATCH')
        .required('PASSWORD_CONFIRMATION_IS_REQUIRED')
});

// Schema for validating all registration form fields
const registrationValidationSchema = usernameValidationSchema.concat(
    emailValidationSchema).concat(passwordValidationSchema);

const restaurantValidationSchema = registrationValidationSchema.shape({
    restaurantName: yup.string()
        .min(3, 'RESTAURANT_NAME_MUST_BE_AT_LEAST_3_CHARACTERS')
        .max(32, 'RESTAURANT_NAME_CANNOT_EXCEED_32_CHARACTERS')
        .required('RESTAURANT_NAME_IS_REQUIRED'),
});


// Username and password are required when logging in.
const loginValidationSchema = yup.object().shape({
    username: yup.string()
        .required('USERNAME_IS_REQUIRED'),
    password: yup.string()
        .required('PASSWORD_IS_REQUIRED'),
});

const mealValidationSchema = yup.object().shape({
    mealName: yup.string()
        .required('Name for the meal is required'),
    imageUri: yup.string()
        .required('Image of the meal is required'),
    mealDescription: yup.string(),
    ingredients: yup.array().of(
        yup.object().shape({
            mealId: yup.string(),
            category: yup.string(),
            ingredient: yup.string(),
            weight: yup.string()
        })
    ),
    allergens: yup.object()
});

export {
    registrationValidationSchema,
    restaurantValidationSchema,
    loginValidationSchema,
    emailValidationSchema,
    mealValidationSchema
};
