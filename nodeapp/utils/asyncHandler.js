/**
 * asyncHandler
 * This is a wrapper function that handles errors in asynchronous functions.
 * It eliminates the need for try/catch blocks in every controller.
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

module.exports = asyncHandler;
