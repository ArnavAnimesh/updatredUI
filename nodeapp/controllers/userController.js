const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../authUtils');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { isValidEmail, isValidMobile, isValidPassword, isValidUsername } = require('../utils/validators');

// This function handles creating a new user account.
exports.signup = asyncHandler(async (req, res) => {
    const { userName, email, mobile, password, confirmPassword, role, secretQuestionAnswer } = req.body;

    // Check if any field is missing
    if (!userName || !email || !mobile || !password || !confirmPassword || !role || !secretQuestionAnswer) {
        return sendError(res, "Please fill all required fields.", 400);
    }

    // Validation checks
    if (!isValidUsername(userName)) {
        return sendError(res, "Username must be at least 3 characters and contain only alphanumeric characters or underscores.", 400);
    }

    if (!isValidEmail(email)) {
        return sendError(res, "Please provide a valid email address.", 400);
    }

    if (!isValidMobile(mobile)) {
        return sendError(res, "Please provide a valid 10-digit mobile number.", 400);
    }

    if (!isValidPassword(password)) {
        return sendError(res, "Password must be at least 8 characters long, include an uppercase letter, a digit, and a special character.", 400);
    }

    if (password !== confirmPassword) {
        return sendError(res, "Passwords do not match.", 400);
    }

    // Check if the email is already in our database
    const userExists = await User.findOne({ email });
    if (userExists) {
        return sendError(res, "Email is already registered.", 400);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user
    const newUser = await User.create({
        userName,
        email,
        mobile,
        password: hashedPassword,
        role,
        secretQuestionAnswer
    });

    return sendSuccess(res, "Account created successfully!", {}, 201);
});

// This function handles logging in an existing user.
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendError(res, "Please provide both email and password.", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        return sendError(res, "Invalid email or password.", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return sendError(res, "Invalid email or password.", 401);
    }

    const token = generateToken({
        id: user._id,
        userName: user.userName,
        role: user.role
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true in real websites
        maxAge: 3600000 // Lasts for 1 hour
    });

    return sendSuccess(res, "Login successful! Welcome back.", {
        userName: user.userName,
        role: user.role
    });
});

// This function checks if the user is logged in
exports.verifyUser = (req, res) => {
    return sendSuccess(res, "User verified from session.", {
        userName: req.user.userName,
        role: req.user.role
    });
};

// This function handles logging out
exports.logout = (req, res) => {
    res.clearCookie('token');
    return sendSuccess(res, "Logged out successfully.");
};

// This function handles resetting a forgotten password.
exports.forgotPassword = asyncHandler(async (req, res) => {
    const { email, secretQuestionAnswer, newPassword, confirmNewPassword } = req.body;

    if (!email || !secretQuestionAnswer || !newPassword || !confirmNewPassword) {
        return sendError(res, "Please provide all required fields for password reset.", 400);
    }

    if (!isValidPassword(newPassword)) {
        return sendError(res, "New password must be at least 8 characters long, include an uppercase letter, a digit, and a special character.", 400);
    }

    if (newPassword !== confirmNewPassword) {
        return sendError(res, "New passwords do not match.", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        return sendError(res, "User with this email not found.", 404);
    }

    if (user.secretQuestionAnswer !== secretQuestionAnswer) {
        return sendError(res, "Incorrect answer to the secret question.", 400);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return sendSuccess(res, "Password reset successful! You can now login with your new password.");
});