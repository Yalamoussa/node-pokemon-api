const { Pokemon } = require('../db/sequelize');
const auth = require('../auth/auth');
  
/*module.exports = (app) => {
  app.get('/api/pokemons/:id', (req, res) => {
    Pokemon.findByPk(req.params.id)
      .then(pokemon => {
        const message = 'Un pokémon a bien été trouvé.'
        res.json({ message, data: pokemon })
      })
  })
}*/

module.exports = (app) => {
    app.get('/api/pokemons/:id', auth, async (req, res) => {
        let answer;
        let message;

        try {
          const pokemonsByPk = await Pokemon.findByPk(req.params.id);
        
          if(pokemonsByPk === null) {
              message = 'Le pokémon demandé n\'existe pas. Réessayer avec un autre identifiant';
              answer = '0';
              res.json({answer, message});
          } else {
              message = 'Un pokémon a bien été trouvé.';
              answer = '1';
              res.json({answer, message, data: pokemonsByPk});
          }
        } catch(error) {
          message = 'Le pokémons n\'a pas pu être récupéré. Réessayer dans quelques instants';
          answer = '-1';
          res.status(500).json({answer, message, data: error});
        }
        
        
        
    });
  }