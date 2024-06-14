/** Checks that email is in the form [string]@[string].[string]
 * and does not contain whitespace or multiple @.
*/
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/** Checks that username is not empty. */
function isValidUsername(username) {
    if (!username) return false;
    return true;
}

/** Checks that the password matches the following constraints:
 * - 8-32 characters long
 * - includes both lower- and uppercase letters
 * - includes numbers
 * - includes a special character (@$!%*?&€\-_:%#+)
 */
function isValidPassword(password) {
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&€\-_:%#+]).{8,32}$/;
    return passwordPattern.test(password);
}

/** Year of birth has to be between 1900 and the current year,
 * and the user has to be at least 15 years old.
 */
function isValidBirthYear(birthYear, currentYear) {
    if (birthYear < 1900) return false;
    if (currentYear-15 < birthYear) return false;
    return true;
}

module.exports = {
    isValidEmail,
    isValidUsername,
    isValidPassword,
    isValidBirthYear,
};
