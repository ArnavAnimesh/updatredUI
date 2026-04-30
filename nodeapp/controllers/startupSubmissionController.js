const StartupSubmission = require('../models/StartupSubmission');
const StartupProfile = require('../models/StartupProfile');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { getPagination } = require('../utils/pagination');

// Allows an Entrepreneur to submit a startup idea for a specific Mentor profile.
exports.createSubmission = asyncHandler(async (req, res) => {
    const { startupProfileId, marketPotential, launchYear, expectedFunding, address } = req.body;

    const profile = await StartupProfile.findById(startupProfileId);
    if (!profile) {
        return sendError(res, "Target startup profile not found.", 404);
    }

    if (Number(expectedFunding) > profile.fundingLimit) {
        return sendError(res, `Expected funding cannot exceed the mentor's limit of ₹${profile.fundingLimit.toLocaleString()}`, 400);
    }

    if (!req.file) {
        return sendError(res, "Validation failed: Pitch deck (PDF) is mandatory.", 400);
    }

    const newSubmission = await StartupSubmission.create({
        userId: req.user.id,
        userName: req.user.userName,
        startupProfileId,
        marketPotential,
        launchYear,
        expectedFunding,
        address,
        pitchDeckFile: req.file.path
    });

    return sendSuccess(res, "Startup idea submitted successfully!", newSubmission, 201);
});

// Fetches all submissions linked to the profiles created by the logged-in Mentor.
exports.getMentorSubmissions = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);

    const mentorProfiles = await StartupProfile.find({ mentorId: req.user.id }).select('_id');
    const profileIds = mentorProfiles.map(p => p._id);

    const query = { startupProfileId: { $in: profileIds } };
    if (req.query.status) {
        query.status = Number(req.query.status);
    }

    const order = req.query.order === 'asc' ? 1 : -1;

    const submissions = await StartupSubmission.find(query)
        .populate('startupProfileId', 'category')
        .sort({ submissionDate: order })
        .skip(skip)
        .limit(limit);

    const totalRecords = await StartupSubmission.countDocuments(query);

    return res.status(200).json({
        success: true,
        message: "Mentor submissions fetched successfully.",
        data: submissions,
        pagination: {
            currentPage: page,
            pageSize: limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit)
        }
    });
});

// Allows a Mentor to Shortlist (2) or Reject (3) a submission.
exports.updateSubmissionStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (![2, 3].includes(status)) {
        return sendError(res, "Invalid status. Use 2 (Shortlist) or 3 (Reject).", 400);
    }

    const submission = await StartupSubmission.findById(id).populate('startupProfileId');
    if (!submission) {
        return sendError(res, "Submission not found.", 404);
    }

    if (submission.startupProfileId.mentorId.toString() !== req.user.id) {
        return sendError(res, "Access Denied: You do not own the profile for this submission.", 403);
    }

    submission.status = status;
    await submission.save();

    return sendSuccess(res, `Submission status updated to ${status === 2 ? 'Shortlisted' : 'Rejected'}.`, submission);
});

// Allows a Mentor to delete a submission.
exports.deleteSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const submission = await StartupSubmission.findById(id).populate('startupProfileId');
    if (!submission) {
        return sendError(res, "Submission not found.", 404);
    }

    if (submission.startupProfileId.mentorId.toString() !== req.user.id) {
        return sendError(res, "Access Denied: Cannot delete submission from another mentor's profile.", 403);
    }

    await StartupSubmission.findByIdAndDelete(id);
    return sendSuccess(res, "Submission deleted successfully.");
});

// Fetches all submissions made by the logged-in Entrepreneur.
exports.getEntrepreneurSubmissions = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const search = req.query.category || "";

    const query = { userId: req.user.id };

    if (search) {
        const matchingProfiles = await StartupProfile.find({
            category: { $regex: search, $options: 'i' }
        }).select('_id');
        const profileIds = matchingProfiles.map(p => p._id);
        query.startupProfileId = { $in: profileIds };
    }

    const submissions = await StartupSubmission.find(query)
        .populate({
            path: 'startupProfileId',
            select: 'category description fundingLimit avgEquityExpectation targetIndustry preferredStage mentorId',
            populate: { path: 'mentorId', select: 'userName email' }
        })
        .sort({ submissionDate: -1 })
        .skip(skip)
        .limit(limit);

    const totalRecords = await StartupSubmission.countDocuments(query);

    return res.status(200).json({
        success: true,
        message: "Your submissions fetched successfully.",
        data: submissions,
        pagination: {
            currentPage: page,
            pageSize: limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit)
        }
    });
});

// Allows an Entrepreneur to delete their own submission.
exports.deleteEntrepreneurSubmission = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const submission = await StartupSubmission.findById(id);
    if (!submission) {
        return sendError(res, "Submission not found.", 404);
    }

    if (submission.userId.toString() !== req.user.id) {
        return sendError(res, "Access Denied: You can only delete your own submissions.", 403);
    }

    await StartupSubmission.findByIdAndDelete(id);
    return sendSuccess(res, "Submission removed successfully.");
});
