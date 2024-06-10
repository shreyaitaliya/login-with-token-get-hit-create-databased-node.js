const { DataTypes } = require('sequelize');

const subcategoryModelDef = (sequelize) => {
    return sequelize.define('Subcategory', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        subcategoryname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
};

module.exports = subcategoryModelDef;
