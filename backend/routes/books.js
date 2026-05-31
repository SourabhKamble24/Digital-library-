const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// @route   GET api/books
// @desc    Get all books
// @access  Public
router.get('/', bookController.getAllBooks);

// @route   GET api/books/:id
// @desc    Get a single book
// @access  Public
router.get('/:id', bookController.getBookById);

module.exports = router;
