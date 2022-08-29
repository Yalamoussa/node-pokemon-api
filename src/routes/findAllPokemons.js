const { Pokemon } = require('../db/sequelize');
const { Op } = require('sequelize');
const auth = require('../auth/auth');

/*module.exports = (app) => {
    app.get('/api/pokemons', (req, res) => {
      Pokemon.findAll()
        .then(pokemons => {
          const message = 'La liste des pokémons a bien été récupérée.'
          res.json({ message, data: pokemons })
        })
    })
  }*/

  
module.exports = (app) => {
  app.get('/api/pokemons', auth, async (req, res) => {
    let answer;
    let message;

    try {

      // requete de recherche
      // http://localhost:3000/api/pokemons?name=Bulbizarre
      if(req.query.name) {
        const name = req.query.name;
        const limit = parseInt(req.query.limit) || 5;
        
        if(name.length < 2) {
          message = `Le terme de la recherche doit contenir au moins 2 caractères.`;
          answer = '0';
          return res.status(400).json({answer, message});
        }
        
        
        //const result = await Pokemon.findAll({where: {poke_name: name}});
        
        /*const result = await Pokemon.findAll({
          where: {
            poke_name: { // 'poke_name' est la proprieté du modele pokemon
              [Op.like]: `%${name}%` // 'name' est le critere de la recherche
            }
          },
          limit: 5
        });*/


        const { count, rows } = await Pokemon.findAndCountAll({
          where: {
            poke_name: { // 'poke_name' est la proprieté du modele pokemon
              [Op.like]: `%${name}%` // 'name' est le critere de la recherche
            }
          },
          //offset: 10,
          limit: limit,
          //order: ['poke_name', 'ASC'], Ordre alphabétique croissant sur la propriéte poke_name, qui est par defaut
          //order: ['poke_name', 'DESC'], Ordre alphabétique décroissant sur la propriéte poke_name
          order: ['poke_name'],
        });

        if(rows === null) {
          message = `Il y a aucuns pokémon qui correspond à votre recherche ${name}`;
          answer = '0';
          return res.json({answer, message});
        } else {
          message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}`;
          answer = '1';
          return res.json({answer, message, data: rows});
        }
      }


      // Renvoyer tout les pokemon

      const allPokemons = await Pokemon.findAll({order: ['poke_name']});

      if (allPokemons === null) {
        message = 'Une erreur est survenue lors de la récuperation des données';
        answer = '0';
        res.json({ answer, message });
      } else if (allPokemons.length == 0) {
        message = 'Nous n\'avons trouvé aucun élément dans la base de données';
        answer = '1';
        res.json({ answer, message, data: [] });
      } else {
        message = 'La liste des pokémons a bien été récupérée.';
        answer = '1';
        res.json({ answer, message, data: allPokemons });
      }
    } catch (error) {
      message = 'La liste des pokémons n\'a pas pu être récupérée. Réessayer dans quelques instants';
      answer = '-1';
      res.status(500).json({answer, message, data: error});
    }
  });
}