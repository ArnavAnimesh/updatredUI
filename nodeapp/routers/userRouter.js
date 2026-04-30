// This file handles the routing for user-related actions.
// It maps the URL paths to the correct functions in the controller.

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateToken } = require('../authUtils');

// This route handles user registration
// Path: POST /user/signup
router.post('/signup', userController.signup);

// This route handles user login
// Path: POST /user/login
router.post('/login', userController.login);

// This route handles logging out
// Path: POST /user/logout
router.post('/logout', userController.logout);

// This route verifies the user's token (used for page reloads)
// Path: GET /user/verify
router.get('/verify', validateToken, userController.verifyUser);

// This route handles resetting a forgotten password
// Path: POST /user/forgotPassword
router.post('/forgotPassword', userController.forgotPassword);

module.exports = router;