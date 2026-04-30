/**
 * validators.js
 * Simple functions to validate user input like email, password, and mobile.
 */

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
};

const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const isValidUsername = (username) => {
    const userNameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return userNameRegex.test(username);
};

module.exports = {
    isValidEmail,
    isValidMobile,
    isValidPassword,
    isValidUsername
};
