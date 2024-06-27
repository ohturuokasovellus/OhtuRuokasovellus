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

// used in age validation
const currentYear = new Date().getFullYear();

/** Validation schema for registration form */
const registrationValidationSchema = yup.object().shape({
    isRestaurant: yup
        .boolean(),
    restaurantName: yup
        .string()
        .when('isRestaurant', {
            // eslint-disable-next-line id-length
            is: (value) => value === true,
            then: () => yup
                .string()
                .min(3, 'RESTAURANT_NAME_MUST_BE_AT_LEAST_3_CHARACTERS')
                .max(32, 'RESTAURANT_NAME_CANNOT_EXCEED_32_CHARACTERS')
                .required('RESTAURANT_NAME_IS_REQUIRED'),
        }),
    username: yup.string()
        .min(3, 'USERNAME_MUST_BE_AT_LEAST_3_CHARACTERS')
        .max(32, 'USERNAME_CANNOT_EXCEED_32_CHARACTERS')
        .required('USERNAME_IS_REQUIRED'),
    email: yup
        .string()
        .email('INVALID_EMAIL').required('EMAIL_IS_REQUIRED'),
    birthYear: yup
        .number()
        .typeError('YEAR_MUST_BE_NUMBER')
        .required('YEAR_IS_REQUIRED')
        .min(1900, 'YEAR_1900_LATER')
        .max(currentYear-15, 'OVER_15'),
    gender: yup
        .string()
        .required('GENDER_REQUIRED'),
    education: yup
        .string()
        .required('EDUCATION_REQUIRED'),
    income: yup
        .string()
        .required('INCOME_REQUIRED'),
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
        .required('PASSWORD_CONFIRMATION_IS_REQUIRED'),
    terms: yup
        .boolean()
        .oneOf([true], 'ACCEPT_TC'),
    privacy: yup
        .boolean()
        .oneOf([true], 'ACCEPT_PRIVACY'),
});

/** Validation schema for login form */
const loginValidationSchema = yup.object().shape({
    username: yup.string()
        .required('USERNAME_IS_REQUIRED'),
    password: yup.string()
        .required('PASSWORD_IS_REQUIRED'),
});

/** Validation for required password */
const passwordValidationSchema = yup.object().shape({
    password: yup.string().required('PASSWORD_IS_REQUIRED'),
});

/** Validation schema for meal creation form */
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
    allergens: yup.object(),
    price: yup.string()
        .matches(/^(?![0,]+$)\d+(?:,\d{1,2})?$/,
            'PRICE_CANNOT_BE_ZERO')
        .required('PRICE_IS_REQUIRED')
});

export {
    registrationValidationSchema,
    loginValidationSchema,
    mealValidationSchema,
    passwordValidationSchema
};
