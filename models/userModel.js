const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma pour l'utilisateur
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirm_password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Rôles possibles
        default: 'user' // Par défaut, un utilisateur est un "user"
    }
});

// Création du modèle "User" à partir du schéma
const UserCollection = mongoose.model('users', userSchema);

// Export du modèle pour l'utiliser ailleurs
module.exports = UserCollection;
