const BloodBankModel = require('../models/blood-bank.model');

class BloodBankController {

    // @desc    Search blood banks from MongoDB
    // @route   GET /api/blood-banks/search?state=Punjab
    async searchBloodBanks(req, res) {
        try {
            const { state } = req.query;

            const filter = {};
            if (state) filter.state = new RegExp(`^${state}$`, 'i');

            const results = await BloodBankModel.find(filter)
                .select('-__v -location')
                .lean();

            res.status(200).json({
                success: true,
                total: results.length,
                data: results
            });
        } catch (error) {
            console.error('Error searching blood banks:', error.message);
            res.status(500).json({ error: 'Failed to search blood banks' });
        }
    }
}

module.exports = new BloodBankController();
