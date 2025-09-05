const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth'); // you can adapt middleware for JWT

const router = express.Router();

router.post('/register', authenticate, authorize('Admin', 'HOD'), register);
router.post('/login', login);

module.exports = router;
