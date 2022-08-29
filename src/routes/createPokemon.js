const { Pokemon } = require('../db/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const auth = require('../auth/auth');

/*module.exports = (app) => {
  app.post('/api/pokemons', (req, res) => {
    Pokemon.create(req.body)
      .then(pokemon => {
        const message = `Le pokémon ${req.body.name} a bien été crée.`
        res.json({ message, data: pokemon })
      })
  })
}*/

module.exports = (app) => {
  app.post('/api/pokemons', auth, async (req, res) => {
    let answer;
    let message; 

    try {
      const createPokemon = await Pokemon.create(req.body);

      if (createPokemon === null) {
        message = `Nous n'avons pu créer le pokémon ${req.body.poke_name}.`;
        answer = '0';
        res.json({ answer, message });
      } else {
        message = `Le pokémon ${req.body.poke_name} a bien été crée.`;
        answer = '1';
        res.json({answer, message, data: createPokemon});
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

      message = 'Le pokémons n\'a pas pu être ajouté. Réessayer dans quelques instants';
      answer = '-1';
      res.status(500).json({answer, message, data: error});
    }
  });
}

