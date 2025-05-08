const express = require('express');
const router = express.Router();
const ItemsModel = require('../models/itemsModel');
const { check, validationResult } = require("express-validator");
const authAdmin = require('../middleware/authAdmin'); // Importez le middleware authAdmin

// Route pour récupérer tous les produits (accessible à tous)
router.get("/all_items", async (req, res) => {
    const product = await ItemsModel.find({});
    res.json(product);
});

// Route pour récupérer un produit spécifique (accessible à tous)
router.get("/get_item/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await ItemsModel.findById(id);

        if (!product) {
            res.json({ message: "product not found", status: 0, id });
            return;
        }

        res.json(product);
    } catch (error) {
        // id invalide déclenchera cette partie
        res.json({ message: "product not found", status: 0 });
    }
});

// Route pour ajouter un nouveau produit (protégée par le middleware authAdmin)
router.post("/add", authAdmin, // Ajoutez le middleware ici pour protéger la route
    check("name", "Entrez le nom du Produit").not().isEmpty(),
    check("price", "Entrez le Prix du Produit ").not().isEmpty(),
    check("image", "Ajouter le lien de l'image").not().isEmpty(),
    check("description", "Entrez la description du Produit").not().isEmpty(),
    async (req, res) => { // Utilisez async/await pour une meilleure gestion des promesses

        const { name, price, image, description } = req.body;

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array(), status: 0 }); // Renvoyez un statut 400 pour les erreurs de validation
        }

        try {
            const newProduct = new ItemsModel({
                name,
                price,
                image,
                description,
            });

            const savedProduct = await newProduct.save();
            res.status(201).json({ message: "Product added", status: 1, docs: savedProduct }); // Renvoyez un statut 201 pour la création réussie
        } catch (error) {
            console.error("Erreur lors de l'ajout du produit :", error);
            res.status(500).json({ message: "Erreur serveur lors de l'ajout du produit", status: 0, error: error.message }); // Renvoyez un statut 500 en cas d'erreur serveur
        }
    });

module.exports = router;