function isValidEmail(email) {
    // TODO: check uniqueness against db
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidUsername(username) {
    if (!username) return false;
    return true;
}

function isValidPassword(password) {
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&€\-_:%#+]).{8,32}$/;
    return passwordPattern.test(password);
}

function isValidBirthYear(year, currentYear) {
    if (year < 1900) return false;
    if (currentYear-15 < year) return false;
    return true;
}

module.exports = {
    isValidEmail,
    isValidUsername,
    isValidPassword,
    isValidBirthYear,
};
