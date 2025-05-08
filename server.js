'use strict'; // ✅ Active le mode strict JS

const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // ✅ Protection des headers HTTP

// Configuration de l'environnement
dotenv.config({ path: './.env' });

const databaseConnection = require('./db/connection');
const userRoutes = require('./routes/userRouter');
const itemsRouter = require('./routes/ItemsRouter');
const paymentRoutes = require('./routes/payment');

const app = express();

// ✅ Sécurité HTTP
app.use(helmet());

// ✅ Parsing des cookies et du corps des requêtes
app.use(cookieParser());
app.use(bodyParser.json());

// ✅ CORS pour le frontend React
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://heroic-cascaron-d54afb.netlify.app'
    ],
    credentials: true
}));

//  Connexion à la base de données
databaseConnection();

//  Routes API
app.use('/', paymentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemsRouter);

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
