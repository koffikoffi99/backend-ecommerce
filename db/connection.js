//Charge les variables d'environnement depuis .env
require("dotenv").config();

//Importer le module mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");



//On crée une fonction asynchrone appelée "databaseconnection" pour se connecter à la base de données
const databaseConnection = async () => {
    // On essaie de se connecter à la base de données
    try {
        // Connexion à la base de données en utilisant l'URI stockée dans les variables d'environnement
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, //  permet d'utiliser la nouvelle méthode et d'éviter les erreurs.
            useUnifiedTopology: true, //  permet d'utiliser le nouveau système
        });
        console.log("Connexion réussie");
    } catch (error) {
        console.error("Erreur lors de la connexion à MongoDB :", error.message);
    }
};

// Exporte la fonction "databaseconnection" pour qu'elle puisse être utilisée dans d'autres fichiers
module.exports = databaseConnection;