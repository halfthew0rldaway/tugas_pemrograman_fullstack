const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'rahasia';

// Middleware: cek token JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token tidak ada' });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token tidak valid' });
        req.userId = decoded.id;
        next();
    });
};

// GET /api/users?page=1&limit=5&search=john
exports.getUsers = (req, res) => {
    const page   = parseInt(req.query.page)   || 1;
    const limit  = parseInt(req.query.limit)  || 5;
    const search = req.query.search           || '';
    const offset = (page - 1) * limit;

    User.countAll(search, (err, countResult) => {
        if (err) return res.status(500).json(err);

        const total = countResult[0].total;

        User.getPaginated(search, limit, offset, (err, users) => {
            if (err) return res.status(500).json(err);

            res.json({
                users,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            });
        });
    });
};

// GET /api/users/all — untuk keperluan export & chart
exports.getAllUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        User.create({ name, email, phone, password: hashedPassword }, (err) => {
            if (err) return res.status(500).json({ message: 'Gagal simpan' });
            res.json({ message: 'User berhasil dibuat' });
        });

    } catch (err) {
        res.status(500).json(err);
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.getByEmail(email, async (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(400).json({ message: 'User tidak ditemukan' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah' });
        }

        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login berhasil', token });
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;

    User.update(id, req.body, (err) => {
        if (err) return res.status(500).json({ message: 'Gagal update' });
        res.json({ message: 'Berhasil update' });
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;

    User.delete(id, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Berhasil delete' });
    });
};

exports.authMiddleware = authMiddleware;
