const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, cartController.getCart);
router.post('/:bookId', auth, cartController.addToCart);
router.delete('/:cartItemId', auth, cartController.removeFromCart);

module.exports = router;
