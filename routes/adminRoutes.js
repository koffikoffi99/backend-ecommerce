const express = require('express');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');
const itemController = require('../controllers/itemController');

// Route pour ajouter un nouveau produit (protégée par le middleware authAdmin)
router.post('/add-product', authAdmin, itemController.addProduct);

module.exports = router;