const { Pokemon } = require('../db/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const auth = require('../auth/auth');

/*module.exports = (app) => {
    app.put('/api/pokemons/:id', (req, res) => {
        const id = req.params.id
        Pokemon.update(req.body, {
            where: { id: id }
        })
            .then(_ => {
                Pokemon.findByPk(id).then(pokemon => {
                    const message = `Le pokémon ${pokemon.name} a bien été modifié.`
                    res.json({ message, data: pokemon })
                })
            })
    })
}*/


module.exports = (app) => {
    app.put('/api/pokemons/:id', auth, async (req, res) => {
        const id = req.params.id
        let answer;
        let message;

        try {

            const pokemon = await Pokemon.findByPk(id);

            if (pokemon === null) {
                answer = '0';
                message = `Le pokémon que vous souhaitez modifier n'existe pas. Réessayer dans quelques instants.`;
                res.status(404).json({ answer, message });
            } else {
                const val = await Pokemon.update(req.body, { where: { poke_id: id } });
                if (val) {
                    console.log(`Update ${val}`);
                    const pokemon = await Pokemon.findByPk(id);
                    answer = '1';
                    message = `Le pokémon ${pokemon.poke_name} a bien été modifié.`;
                    res.json({ answer, message, data: pokemon });
                } else {
                    answer = '0';
                    message = `Nous n'avons pu modifié le pokémon.`;
                    res.json({ answer, message });
                }
            }
        } catch (error) {

            if(error instanceof ValidationError) {
                answer = '0';
                res.status(500).json({answer, message: error.message, data: error});
                //res.status(500).json({answer, message: error.message});
            }

    
            if(error instanceof UniqueConstraintError) {
                answer = '0';
                res.status(400).json({answer, message: error.message, data: error});
                //res.status(500).json({answer, message: error.message});
            }


            message = 'Le pokémons n\'a pas pu être modifié. Réessayer dans quelques instants';
            answer = '-1';
            res.status(500).json({answer, message, data: error});
        }
    });
}