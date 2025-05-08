const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authAdmin = async (req, res, next) => {
    try {
        // Récupérer le token JWT depuis les headers (ou les cookies, selon votre configuration)
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : req.cookies.jwt_token;

        if (!token) {
            return res.status(401).json({ message: 'Non autorisé : Token manquant' });
        }

        // Vérifier la validité du token
        jwt.verify(token, process.env.jwt_key, async (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Non autorisé : Token invalide' });
            }

            // Récupérer l'utilisateur à partir de l'ID dans le token
            const user = await userModel.findById(decodedToken.id);

            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Vérifier si l'utilisateur a le rôle "admin"
            if (user.role !== 'admin') {
                return res.status(403).json({ message: 'Non autorisé : Accès administrateur requis' });
            }

            // Ajouter l'objet utilisateur à la requête pour un usage ultérieur
            req.user = user;
            next(); // Passer au prochain middleware ou au contrôleur de route
        });
    } catch (error) {
        console.error('Erreur du middleware authAdmin :', error);
        return res.status(500).json({ message: 'Erreur serveur lors de l\'authentification' });
    }
};

module.exports = authAdmin;