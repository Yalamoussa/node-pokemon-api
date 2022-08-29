const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const PokemonModel = require('../models/pokemon');
const UserModel = require('../models/user');
const pokemons = require('./mock_pokemon');

// Initialisation l'objet Sequelize avec les différents paramètre de connexion
const sequelize = new Sequelize('pokedex', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT-2',
    },
    logging: false
});

const Pokemon = PokemonModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

const initDb = async () => {

    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");

    pokemons.map(async pokemon =>  {
        const poke = await Pokemon.create({
            poke_name: pokemon.name,
            poke_hp: pokemon.hp,
            poke_cp: pokemon.cp,
            poke_picture: pokemon.picture,
            poke_types: pokemon.types
        });
        //console.log(poke.toJSON()); 
    });

    const hash = await bcrypt.hash('123456789', 10);
    const user = await User.create({user_name: 'YEO', user_password: hash});
    console.log(user.toJSON());

    console.log('La base de donnée a bien été initialisée !')
}

module.exports = {
    initDb, Pokemon, User
}