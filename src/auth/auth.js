const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')

module.exports = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if(!authorizationHeader) {
        const answer = '0';
        const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
        return res.status(401).json({answer, message});
    }

    const token = authorizationHeader.split(' ')[1]
    const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
        if (error) {
            const answer = '0';
            var message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`;
            if(error.name === 'TokenExpiredError')
                message = `Le Token a expiré.`;

            if(error.name === 'JsonWebTokenError')
                message = `le Token est invalide.`;
            
            //return res.status(401).json({answer, message, data: error});
            return res.status(401).json({answer, message});
        }

        const userId = decodedToken.user_id;
        console.log(`Id user ${req.body.userId}`);

        if (req.body.userId && req.body.userId !== userId) {
            const answer = '0';
            const message = `L'identifiant de l'utilisateur est invalide.`;
            res.status(401).json({answer, message});
        } else {
            next();
        }
    });
}