/**
 * responseHandler.js
 * Simple functions to send consistent responses to the frontend.
 * This helps keep our controller code clean and easy to read.
 */

// Function to send a success response
const sendSuccess = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data
    });
};

// Function to send an error response
const sendError = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message: message,
        data: {}
    });
};

module.exports = { sendSuccess, sendError };
