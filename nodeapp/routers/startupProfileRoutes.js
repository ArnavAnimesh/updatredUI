/**
 * StartupProfile Routes
 * This file defines the endpoints for managing and browsing startup opportunity profiles.
 */

const express = require('express');
const router = express.Router();

// Import the controller logic
const startupController = require('../controllers/startupProfileController');

// Import authentication and authorization middleware
const { validateToken, checkRole } = require('../authUtils');

/**
 * MENTOR ROUTES
 * These routes are strictly for users with the 'Mentor' role.
 */

// Route for creating a new profile
router.post(
    '/create', 
    validateToken, 
    checkRole('Mentor'), 
    startupController.createProfile
);

// Route for updating an existing profile
router.put(
    '/update/:id', 
    validateToken, 
    checkRole('Mentor'), 
    startupController.updateProfile
);

// Route for deleting a profile
router.delete(
    '/delete/:id', 
    validateToken, 
    checkRole('Mentor'), 
    startupController.deleteProfile
);

/**
 * PUBLIC / SHARED ROUTES
 * These routes can be accessed by authenticated users (Mentors and Entrepreneurs).
 */

// Route for viewing all profiles (browsing)
// Both roles can see the list as per PRD
router.get(
    '/all', 
    validateToken, 
    startupController.getAllProfiles
);

module.exports = router;
