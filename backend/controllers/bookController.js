const db = require('../db');

// Get all books, optionally filtered by category
exports.getAllBooks = async (req, res) => {
  try {
    const { category } = req.query;
    let query = `
      SELECT b.*, c.name as category_name 
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
    `;
    let params = [];

    if (category) {
      query += ` WHERE c.name ILIKE $1`;
      params.push(`%${category}%`);
    }

    query += ` ORDER BY b.title ASC`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT b.*, c.name as category_name 
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
