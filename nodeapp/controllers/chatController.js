const { GoogleGenerativeAI } = require('@google/generative-ai');
const StartupProfile = require('../models/StartupProfile');
const StartupSubmission = require('../models/StartupSubmission');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handleChat = async (req, res, next) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // 1. Fetch contextual data based on user role to provide to Gemini
        let contextData = "";
        
        if (userRole === 'Mentor') {
            const profiles = await StartupProfile.find({ createdBy: userId }).lean();
            const profileIds = profiles.map(p => p._id);
            const submissions = await StartupSubmission.find({ startupProfileId: { $in: profileIds } }).lean();
            
            contextData = `
                User Role: Mentor
                Total Profiles Created: ${profiles.length}
                Total Submissions Received: ${submissions.length}
                Profiles focus on: ${[...new Set(profiles.map(p => p.category))].join(', ')}
            `;
        } else if (userRole === 'Entrepreneur') {
            const submissions = await StartupSubmission.find({ entrepreneurId: userId })
                .populate('startupProfileId', 'category targetIndustry')
                .lean();
            
            contextData = `
                User Role: Entrepreneur
                Total Ideas Submitted: ${submissions.length}
                Categories applied to: ${[...new Set(submissions.map(s => s.startupProfileId?.category))].join(', ')}
            `;
        }

        // 2. Build the prompt
        const prompt = `
            You are Coster, an AI assistant for the StartupNest platform. 
            StartupNest connects Mentors (investors) with Entrepreneurs (founders).
            
            Here is the current user's contextual data from the database:
            ${contextData}
            
            Instructions:
            - Answer the user's query based on the context if relevant.
            - Keep your answer VERY short, concise, and professional (max 2-3 sentences).
            - Do not invent data. If they ask about something not in the context, just give a helpful generic answer.
            
            User Message: "${message}"
        `;

        // 3. Call Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return res.status(200).json({
            success: true,
            data: {
                reply: responseText
            }
        });

    } catch (error) {
        console.error("Gemini AI Error:", error);
        next(error);
    }
};
