const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');

router.post('/checkout', auth, borrowController.checkoutCart);
router.post('/return/:recordId', auth, borrowController.returnBook);
router.post('/:bookId', auth, borrowController.borrowBook);
router.get('/history', auth, borrowController.getHistory);
router.get('/all', auth, adminAuth, borrowController.getAllHistory);

module.exports = router;
