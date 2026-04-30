const StartupProfile = require('../models/StartupProfile');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { getPagination } = require('../utils/pagination');

// Mentors use this to create a new startup opportunity.
exports.createProfile = asyncHandler(async (req, res) => {
    const { category, description, fundingLimit, avgEquityExpectation, targetIndustry, preferredStage } = req.body;

    const newProfile = await StartupProfile.create({
        mentorId: req.user.id,
        category,
        description,
        fundingLimit,
        avgEquityExpectation,
        targetIndustry,
        preferredStage
    });

    return sendSuccess(res, "Startup profile created successfully!", newProfile, 201);
});

// Fetches profiles with server-side pagination, search, and sort support.
exports.getAllProfiles = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);

    // SEARCH LOGIC
    const keyword = req.query.keyword || '';
    const searchQuery = keyword 
        ? { 
            $or: [
                { category: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { targetIndustry: { $regex: keyword, $options: 'i' } }
            ] 
          } 
        : {};

    // SORT LOGIC
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const profiles = await StartupProfile.find(searchQuery)
        .populate('mentorId', 'userName email')
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: order });

    const totalRecords = await StartupProfile.countDocuments(searchQuery);

    return res.status(200).json({
        success: true,
        message: "Profiles fetched successfully.",
        data: profiles,
        pagination: {
            currentPage: page,
            pageSize: limit,
            totalRecords: totalRecords,
            totalPages: Math.ceil(totalRecords / limit)
        }
    });
});

// Mentors use this to update their existing startup opportunities.
exports.updateProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedProfile = await StartupProfile.findOneAndUpdate(
        { _id: id, mentorId: req.user.id },
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!updatedProfile) {
        return sendError(res, "Profile not found or you are not authorized to edit it.", 404);
    }

    return sendSuccess(res, "Startup profile updated successfully!", updatedProfile);
});

// Mentors use this to remove their startup opportunities.
exports.deleteProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedProfile = await StartupProfile.findOneAndDelete({
        _id: id,
        mentorId: req.user.id
    });

    if (!deletedProfile) {
        return sendError(res, "Profile not found or you are not authorized to delete it.", 404);
    }

    return sendSuccess(res, "Startup profile deleted successfully!");
});
