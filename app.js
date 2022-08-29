const express = require('express');
//const morgan = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const sequelize = require('./src/db/sequelize');

const findAllPokemons = require('./src/routes/findAllPokemons');
const findPokemonByPk = require('./src/routes/findPokemonByPk');
const createPokemon = require('./src/routes/createPokemon');
const updatePokemon = require('./src/routes/updatePokemon');
const deletePokemon = require('./src/routes/deletePokemon');
const login = require('./src/routes/login');


const app = express();
const port = process.env.PORT || 3000;





app.use(favicon(__dirname + '/favicon.ico'));
//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




app.get('/', (req, res) => {
    res.json('Hello, Heroku !');
});


sequelize.initDb();


// login
login(app);


// La liste de tous les pokemons
findAllPokemons(app);
//require('./src/routes/findAllPokemons')(app);

// obtenir un pokemon
findPokemonByPk(app);
//require('./src/routes/findPokemonByPk')(app);

// Ajouter un pokemon dans en base de données
createPokemon(app);
//require('./src/routes/createPokemon')(app);

// Modifier un pokemon
updatePokemon(app);
//require('./src/routes/updatePokemon')(app);

// Supprimer un pokemon
deletePokemon(app);
//require('./src/routes/deletePokemon')(app);


app.use(({res}) => {
    const answer = '-1';
    const message = 'Impossible de truver le ressource demandée ! Vous pouvez essayer une autre URL.';
    res.status(404).json(answer, message);
});

/*"scripts": {
    "start": "node app.js", Démarrage en production, cmd: npm run start
    "dev": "nodemon app.js" Démarrage en développement, cmd: npm run dev
  },*/

/*
"scripts": {
    "start": "NODE_ENV=production node app.js",
    "dev": "NODE_ENV=developpment nodemon app.js"
  },
*/


app.listen(port, () => console.log(`Notre application Node est démarrée sur http://localhost:${port}`));