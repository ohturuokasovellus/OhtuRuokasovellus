const getAgeGroup = (birthYear) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (age >= 15 && age <= 18) {
        return {'15-18': [currentYear - 18, currentYear - 15]};
    } else if (age > 18 && age <= 25) {
        return {'19-25': [currentYear - 25, currentYear - 19]};
    } else if (age > 25 && age <= 35) {
        return {'26-35': [currentYear - 35, currentYear - 26]};
    } else if (age > 35 && age <= 45) {
        return {'36-45': [currentYear - 45, currentYear - 36]};
    } else if (age > 45 && age <= 55) {
        return {'46-55': [currentYear - 55, currentYear - 46]};
    } else if (age > 55 && age <= 65) {
        return {'56-65':[currentYear - 65, currentYear - 56]};
    } else if (age > 65) {
        return {'65+': [currentYear - 200, currentYear - 65]};
    } else {
        throw new Error(`Invalid birth year: ${birthYear}`);
    }
};

module.exports = {
    getAgeGroup
};
