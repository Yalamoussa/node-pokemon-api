module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Users', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Le nom est déja pris.'
            },
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
        {
            timestamps: true,
            createdAt: 'user_datecreation',
            updatedAt: false
        });
}