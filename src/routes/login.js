const { User } = require('../db/sequelize');
const privateKey = require('../auth/private_key');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    app.post('/api/login', async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        if(username === '' || username === null  || password === '' || password === null) {
            const answer = '0';
            const message = `Veuillez renseigner tous les champs obligatoires.`;
            return res.status(400).json({answer, message});
        }


        try {
            var user = await User.findOne({ where: { user_name: username } });
            if (user === null) {
                const answer = '0';
                const message = `L'utlisateur demandé n'existe pas.`;
                return res.status(400).json({answer, message});
            }
            
            const isPasswordValid = await bcrypt.compare(password, user.user_password);

            if (!isPasswordValid) {
                const answer = '0';
                const message = `Mot de passe incorrect.`;
                return res.status(401).json({answer, message});
            }

            // JWT generation de token
            let token = jwt.sign(
                { user_id: user.user_id, user_password: user.user_password }, 
                privateKey,
                { expiresIn: '1h' }, // expiresIn: '1h' = 1 heure, expiresIn: '1d' = 1 jours, expiresIn: '60' = secondes
            );
            const answer = '1';
            const message = `L'utilisateur a été connecté avec succès`;
            //user.token = token;
            //console.log(`Token ----- ${user.token}`);
            return res.json({answer, message, data: user, token});

        } catch (error) {
            const answer = '0';
            const message = `L'utilisateur n'a pu être connecté avec succès. Réessayer dans quelques instants`;
            return res.json({answer, message, data: error});
        }
    });
}