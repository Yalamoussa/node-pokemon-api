
const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée'];

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemons', {
        poke_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: {
                msg: 'Le nom est déja pris.'
            }
        },
        poke_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Le nom est déja pris.'
            },
            validate: {
                notEmpty: {msg: 'Le nom ne peut pas être vide.'},
                notNull: {msg: 'Le nom est une proprièté require.'},
            }
        },
        poke_hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {msg: 'Utilisez uniquement des nombres entiers pour les points de vie.'},
                notNull: {msg: 'Les points de vie sont une proprièté require.'},
                min: {
                    args: [0],
                    msg: 'Les points de vie doivent être supérieur à 0.'
                },
                max: {
                    args: [999],
                    msg: 'Les points de vie doivent être inférieur ou égales à 999.'
                }
            }
        },
        poke_cp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {msg: 'Utilisez uniquement des nombres entiers pour les points de dégâts.'},
                notNull: {msg: 'Les points de dégâts sont une proprièté require.'},
                min: {
                    args: [0],
                    msg: 'Les points de dégâts doivent être supérieur à 0.'
                },
                max: {
                    args: [99],
                    msg: 'Les points de dégâts doivent être inférieur ou égales à 999.'
                }
            }
        },
        poke_picture: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: {msg: 'Utilisez uniquement une url valide pour l\'image.'},
                notNull: {msg: 'L\'image est une proprièté require.'},
            }
        },
        poke_types: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('poke_types').split(',');
            },
            set(poke_types) {
                this.setDataValue('poke_types', poke_types.join());
            },
            validate: {
                // validateur personnnalisé
                isTypesValid(value) {
                    if(!value) {
                        throw new Error('Un pokémon doit au moins avoir un type.');
                    }
                    if(value.split(',').length > 3) {
                        throw new Error('Un pokémon ne peut avoir plus de trois types.');
                    }
                    value.split(',').forEach(type => {
                        if(!validTypes.includes(type)) {
                            throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes}`);
                        }
                    });
                }

            }
        }
    },
    {
        timestamps: true,
        createdAt: 'poke_datecreation',
        updatedAt: false
    })
  }