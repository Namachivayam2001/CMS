const express = require("express");
const { getUsers } = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Only Admin can fetch/create users
router.get("/fetchAll", authenticate, authorize("Admin"), getUsers);

module.exports = router;
