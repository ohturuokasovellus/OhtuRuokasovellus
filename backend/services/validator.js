
/**
 * @param {string} password
 * @returns {boolean} Whether the password is 8-32 characters (inclusive)
 *  long and contains upper and lower case letter, number and special character.
 */
const validatePassword = password => {
  if (password.length < 8 || password.length > 32) {
    return false
  }

  // check that the password contains at least one digit
  if (!/\d/.test(password)) {
    return false
  }

  // check that the password contains at least one character that is not a letter (a-z or A-Z) or digit
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return false
  }

  return true
}

module.exports = {
  validatePassword,
}
