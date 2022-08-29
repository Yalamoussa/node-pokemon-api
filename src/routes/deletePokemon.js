const { Pokemon } = require('../db/sequelize');
const auth = require('../auth/auth');

/*module.exports = (app) => {
  app.delete('/api/pokemons/:id', (req, res) => {
    Pokemon.findByPk(req.params.id).then(pokemon => {
      const pokemonDeleted = pokemon;
      Pokemon.destroy({
        where: { id: pokemon.id }
      })
      .then(_ => {
        const message = `Le pokémon avec l'identifiant n°${pokemonDeleted.id} a bien été supprimé.`
        res.json({message, data: pokemonDeleted })
      })
    })
  })
}*/


module.exports = (app) => {
    app.delete('/api/pokemons/:id', auth, async (req, res) => {
        const id = req.params.id
        let answer;
        let message;


        try {
            const pokemon = await Pokemon.findByPk(id);
            if (pokemon === null) {
                answer = '0';
                message = `Le pokémon que vous souhaitez supprimer n'existe pas la base de données.`;
                res.status(404).json({ answer, message });
            } else {
                const val = await Pokemon.destroy({ where: { poke_id: pokemon.poke_id } });
                if (val) {
                    console.log(`Delete ${val}`);
                    answer = '1';
                    message = `Le pokémon avec l'identifiant n°${pokemon.poke_id} a bien été supprimé.`;
                    res.json({ answer, message, data: pokemon });
                } else {
                    answer = '0';
                    message = `Nous n'avons pu supprimer le pokémon.`;
                    res.json({ answer, message });
                }
            }
        } catch (error) {
            message = 'Le pokémons n\'a pas pu être supprimé. Réessayer dans quelques instants';
            answer = '-1';
            res.status(500).json({answer, message, data: error});
        }
    })
}
