const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Category = sequelize.define('Category', {
        categoryname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Category;
};
