const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/api/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.line_items,
            mode: 'payment',
            success_url: req.body.success_url,
            cancel_url: req.body.cancel_url,
            currency: 'xof', // Assurez-vous que cela correspond à votre frontend
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error('Erreur lors de la création de la session de paiement :', error);
        res.status(500).json({ error: 'Erreur lors de la création de la session de paiement.' });
    }
});

module.exports = router;