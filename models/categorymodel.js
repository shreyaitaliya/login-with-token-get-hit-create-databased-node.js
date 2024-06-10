const { DataTypes } = require('sequelize');

const categoryModelDef = (sequelize) => {
    return sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        categoryname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
};

module.exports = categoryModelDef;
