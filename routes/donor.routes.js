const express = require('express');
const donorController = require('../controllers/donor.controller');
const router = express.Router();

router.post('/register', donorController.registerDonor);
router.get('/fetch', donorController.fetchDonors);

module.exports = router;
