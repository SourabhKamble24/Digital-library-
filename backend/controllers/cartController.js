const db = require('../db');

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    // Check if book exists and has available copies
    const bookCheck = await db.query('SELECT available_copies FROM books WHERE id = $1', [bookId]);
    if (bookCheck.rows.length === 0) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    if (bookCheck.rows[0].available_copies <= 0) {
      return res.status(400).json({ msg: 'Book is currently unavailable' });
    }

    // Insert into cart
    await db.query(
      'INSERT INTO cart_items (user_id, book_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, bookId]
    );

    res.json({ msg: 'Book added to cart' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(`
      SELECT c.id as cart_item_id, b.* 
      FROM cart_items c
      JOIN books b ON c.book_id = b.id
      WHERE c.user_id = $1
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.user.id;

    await db.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [cartItemId, userId]);
    res.json({ msg: 'Book removed from cart' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
