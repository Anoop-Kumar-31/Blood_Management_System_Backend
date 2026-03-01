const express = require('express');
const bloodBankController = require('../controllers/blood-bank.controller');
const router = express.Router();

router.get('/search', bloodBankController.searchBloodBanks);

module.exports = router;
