const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

router.post("/verify_account", async (req, res, next) => {
    const { token } = req.body;
    jwt.verify(token, process.env.jwt_key, async (err, valid_token) => {
        if (err) {
            res.json({ status: false });
            return;
        }
        const id = valid_token.id;
        const findAccount = await userModel.findById(id);
        if (!findAccount) {
            res.json({ status: false });
            return;
        }
        res.json({
            status: true,
            username: findAccount.username,
            email: findAccount.email,
            role: findAccount.role
        });
    });
});

router.post("/login", [
    check("username", "Entrez le username").not().isEmpty(),
    check("password", "Entrez le mot de passe").not().isEmpty(),
], async (req, res, next) => {
    const { username, password } = req.body;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.json({ error: error.array(), error_type: 0 });
        return;
    }

    const findone = await userModel.findOne({ username: username });
    if (!findone) {
        res.json({ message: "compte invalide", error_type: 1 });
        return;
    }

    await bcrypt.compare(password, findone.password, (err, isValid) => {
        if (isValid) {
            const id = findone._id;
            const token = jwt.sign({ id }, process.env.jwt_key, {
                expiresIn: "7d",
            });

            res
                .cookie("jwt_token", token)
                .status(200)
                .send({
                    created: true,
                    message: "Connexion réussie",
                    token,
                    user: {
                        username: findone.username,
                        role: findone.role
                    }
                });
        } else {
            res.json({ message: "Invalid Account", created: false });
        }
    });
});

router.post("/register", [
    check("firstname", "le nom est requis").not().isEmpty(),
    check("surname", "le prénom est requis").not().isEmpty(),
    check("username", "le nom d'utilisateur est requis").not().isEmpty(),
    check("email", "entrez l'email").not().isEmpty().isEmail(),
    check("password", "entrez le mot de passe").not().isEmpty().isLength({ min: 6 }),
    check("confirm_password", "confirmez le mot de passe").not().isEmpty()
], async (req, res, next) => {

    const { firstname, surname, username, email, password, confirm_password } = req.body;

    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.json({ error: error.array(), error_type: 0, created: false });
        return;
    }

    const findOne_username = await userModel.findOne({ username: username });
    const findOne_email = await userModel.findOne({ email: email });

    if (findOne_username) {
        res.json({
            message: "le nom d'utilisateur existe déjà",
            error_type: 1,
            created: false,
        });
        return;
    }

    if (findOne_email) {
        res.json({
            message: "l'email existe déjà",
            error_type: 1,
            created: false,
        });
        return;
    }

    if (password !== confirm_password) {
        res.json({
            error: "les mots de passe ne correspondent pas",
            error_type: 1,
            created: false,
        });
        return;
    }

    const user = new userModel({
        firstname,
        surname,
        username,
        email,
        password,
        confirm_password,
        role: "user" // par défaut
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc) => {
        const id = doc._id;
        const token = jwt.sign({ id }, process.env.jwt_key, { expiresIn: "7d" });

        res
            .cookie("jwt_token", token)
            .status(201)
            .send({
                id,
                created: true,
                token,
                message: "Registered"
            });
    });
});

module.exports = router;
