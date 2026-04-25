const express = require('express');
const router = express.Router();
const { getProfileController } = require('../controllers/userController');

router.get('/profile', getProfileController);

module.exports = router;