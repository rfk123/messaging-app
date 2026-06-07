const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { search } = require('../controllers/userControllers');

const router = express.Router();

router.get("/search", authMiddleware, search);
module.exports = search;