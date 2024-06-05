const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Subcategory = sequelize.define('Subcategory', {
        subcategoryname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Subcategory;
};
