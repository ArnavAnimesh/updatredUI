/**
 * startupSubmissionRoutes.js
 * This file defines the routes for startup submissions.
 * It includes file upload configuration using Multer and role-based protection.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Import the controller
const submissionController = require('../controllers/startupSubmissionController');

// Import authentication and authorization middleware
const { validateToken, checkRole } = require('../authUtils');

// --- 1. MULTER CONFIGURATION ---

// We define where the files should be saved and what they should be named
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // We save files in the 'uploads/' folder
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // We name the file using a timestamp to avoid name collisions
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// We create the multer middleware with size limits and storage rules
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 10 * 1024 * 1024 // 10MB maximum file size
    },
    fileFilter: (req, file, cb) => {
        // We only allow PDF files for the pitch deck
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed for the pitch deck.'));
        }
    }
});

// --- 2. ROUTE DEFINITIONS ---

/**
 * POST /create
 * This route allows Entrepreneurs to submit their startup idea.
 * 1. validateToken: Checks if the user is logged in via JWT cookie.
 * 2. checkRole('Entrepreneur'): Ensures only Entrepreneurs can access this.
 * 3. upload.single('pitchDeckFile'): Multer handles the file upload.
 */
router.post(
    '/create', 
    validateToken, 
    checkRole('Entrepreneur'), 
    upload.single('pitchDeckFile'), 
    submissionController.createSubmission
);

/**
 * GET /my-submissions
 * Fetches all submissions made by the logged-in Entrepreneur.
 */
router.get(
    '/my-submissions',
    validateToken,
    checkRole('Entrepreneur'),
    submissionController.getEntrepreneurSubmissions
);

/**
 * DELETE /delete/:id
 * Allows the Entrepreneur to remove their own submission.
 */
router.delete(
    '/delete/:id',
    validateToken,
    checkRole('Entrepreneur'),
    submissionController.deleteEntrepreneurSubmission
);

// --- MENTOR ROUTES ---

/**
 * GET /all
 * Fetches all submissions received by the Mentor across all their profiles.
 * Features: Pagination (10/page), Status Filter, and Date Sorting.
 */
router.get(
    '/all',
    validateToken,
    checkRole('Mentor'),
    submissionController.getMentorSubmissions
);

/**
 * PUT /status/:id
 * Allows the Mentor to update the status of a submission (Shortlist or Reject).
 */
router.put(
    '/status/:id',
    validateToken,
    checkRole('Mentor'),
    submissionController.updateSubmissionStatus
);

/**
 * DELETE /delete/:id
 * Allows the Mentor to remove a submission.
 */
router.delete(
    '/delete/:id',
    validateToken,
    checkRole('Mentor'),
    submissionController.deleteSubmission
);

module.exports = router;
