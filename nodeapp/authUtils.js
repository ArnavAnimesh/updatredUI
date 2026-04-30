// This file contains helper functions for handling security and tokens.
// It helps us create tokens, check if a user is logged in, and check their role.

const jwt = require('jsonwebtoken');

// This function creates a unique token for a user after they login.
const generateToken = (payload) => {
    // We sign the token with a secret key so only our server can read it.
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'asdfghjkl',
        { expiresIn: '1h' } // The token will stop working after 1 hour.
    );
    return token;
};

// This function checks if the user has a valid token in their cookies.
const validateToken = (req, res, next) => {
    // We try to get the token from the browser's cookies.
    const token = req.cookies.token;

    // If there is no token, it means the user is not logged in.
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Stop! You are not logged in. Please login to continue.',
            data: {}
        });
    }

    try {
        // We verify if the token is real and has not expired.
        const decodedInfo = jwt.verify(token, process.env.JWT_SECRET || 'asdfghjkl');
        
        // We save the user information from the token into the request.
        req.user = decodedInfo;
        
        // Move to the next step (like the controller).
        next();
    } catch (error) {
        // If the token is fake or old, we send an error.
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired session. Please login again.',
            data: {}
        });
    }
};

// This function checks if the user has the right role to see a page.
const checkRole = (role) => {
    return (req, res, next) => {
        // We check if the user's role matches the one required for this route.
        if (req.user && req.user.role === role) {
            next(); // If it matches, they can proceed.
        } else {
            // If it doesn't match, we block them.
            res.status(403).json({
                success: false,
                message: 'Sorry, this area is for ' + role + 's only!',
                data: {}
            });
        }
    };
};

module.exports = { generateToken, validateToken, checkRole };