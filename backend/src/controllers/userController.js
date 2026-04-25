const { getUserProfile } = require('../services/userService');

const getProfileController = async (req, res) => {
    try {
        // In a real app, this ID comes from the decoded JWT token (req.user.user_id)
        // For testing without auth, you can pass it as a query param or header
        const userId = req.headers['user-id']; 

        if (!userId) {
            return res.status(400).json({ message: "User ID header missing" });
        }

        const profile = await getUserProfile(userId);
        
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getProfileController };