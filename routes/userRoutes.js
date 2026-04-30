const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Auth
router.post('/login', userController.login);

// CRUD
router.get('/', userController.getUsers);              // dengan pagination & search
router.get('/all', userController.getAllUsers);         // semua data (chart & export)
router.post('/', userController.createUser);
router.post('/update/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
