const db = require('../db');

// Borrow a single book
exports.borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    // Check availability
    const bookCheck = await db.query('SELECT available_copies FROM books WHERE id = $1', [bookId]);
    if (bookCheck.rows.length === 0) return res.status(404).json({ msg: 'Book not found' });
    if (bookCheck.rows[0].available_copies <= 0) return res.status(400).json({ msg: 'Book unavailable' });

    // Transaction to borrow
    await db.query('BEGIN');
    
    // Decrement copies
    await db.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [bookId]);
    
    // Create record (14 days due date)
    await db.query(
      `INSERT INTO borrow_records (user_id, book_id, due_date) 
       VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '14 days')`,
      [userId, bookId]
    );

    await db.query('COMMIT');
    res.json({ msg: 'Book borrowed successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Checkout entire cart
exports.checkoutCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartResult = await db.query('SELECT book_id FROM cart_items WHERE user_id = $1', [userId]);
    if (cartResult.rows.length === 0) return res.status(400).json({ msg: 'Cart is empty' });

    await db.query('BEGIN');

    for (const item of cartResult.rows) {
      const bookId = item.book_id;
      // Check availability inside transaction to prevent race conditions
      const bookCheck = await db.query('SELECT available_copies FROM books WHERE id = $1 FOR UPDATE', [bookId]);
      if (bookCheck.rows[0].available_copies > 0) {
        await db.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [bookId]);
        await db.query(
          `INSERT INTO borrow_records (user_id, book_id, due_date) 
           VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '14 days')`,
          [userId, bookId]
        );
      }
    }

    // Clear cart
    await db.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    await db.query('COMMIT');

    res.json({ msg: 'Checkout successful' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const { recordId } = req.params;
    const userId = req.user.id;

    const recordCheck = await db.query('SELECT * FROM borrow_records WHERE id = $1 AND user_id = $2 AND status = $3', [recordId, userId, 'BORROWED']);
    if (recordCheck.rows.length === 0) return res.status(404).json({ msg: 'Record not found or already returned' });

    const bookId = recordCheck.rows[0].book_id;

    await db.query('BEGIN');
    
    // Update record
    await db.query(
      `UPDATE borrow_records SET status = 'RETURNED', return_date = CURRENT_TIMESTAMP WHERE id = $1`,
      [recordId]
    );

    // Increment copies
    await db.query('UPDATE books SET available_copies = available_copies + 1 WHERE id = $1', [bookId]);

    await db.query('COMMIT');
    res.json({ msg: 'Book returned successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get borrow history
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(`
      SELECT r.*, b.title, b.author, b.cover_image 
      FROM borrow_records r
      JOIN books b ON r.book_id = b.id
      WHERE r.user_id = $1
      ORDER BY r.borrow_date DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
