function isValidEmail(email) {
    // TODO: check uniqueness against db
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidUsername(username) {
    if (!username) return false
    return true
}

function isValidPassword(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&€\-_:%#+]).{8,32}$/;
    return passwordPattern.test(password);
}

module.exports = {
  isValidEmail,
  isValidUsername,
  isValidPassword,
}