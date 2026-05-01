const User = require('../models/userModel');
const Otp = require('../models/otpModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
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

    // Delete any existing OTPs for this email to prevent spam
    await Otp.deleteMany({ email });

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Hash the OTP and the user's password for secure storage
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save temporary OTP and User Data to DB (Expires in 10 mins)
    await Otp.create({
        email,
        otpHash: hashedOtp,
        userData: {
            userName,
            email,
            mobile,
            password: hashedPassword,
            role,
            secretQuestionAnswer
        }
    });

    // Configure Nodemailer
    let transporter;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: 'gmail', // or your preferred service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } else {
        // Fallback for testing: Ethereal Email
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }

    const mailOptions = {
        from: `"StartupNest" <${process.env.EMAIL_USER || 'noreply@startupnest.com'}>`,

        to: email,
        subject: 'Verify your StartupNest Account',
        text: `Your OTP for StartupNest registration is: ${otp}. It is valid for 10 minutes.`
    };

    const info = await transporter.sendMail(mailOptions);
    if (!process.env.EMAIL_USER) {
        console.log("OTP Email preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return sendSuccess(res, "OTP sent to your email! Please verify within 10 minutes.", { requiresOtp: true }, 200);
});

// This function verifies the OTP and permanently saves the user account
exports.verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return sendError(res, "Email and OTP are required.", 400);
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
        return sendError(res, "OTP expired or not found. Please register again.", 400);
    }

    const isMatch = await bcrypt.compare(otp.toString(), otpRecord.otpHash);
    if (!isMatch) {
        return sendError(res, "Invalid OTP.", 400);
    }

    // Create the user since OTP matches
    const newUser = await User.create(otpRecord.userData);

    // Delete the OTP record as it is no longer needed
    await Otp.deleteOne({ _id: otpRecord._id });

    return sendSuccess(res, "Account verified and created successfully!", {}, 201);
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