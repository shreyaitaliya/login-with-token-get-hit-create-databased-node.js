    // models/masterconfigdatabase.js
    const { DataTypes } = require('sequelize');

    module.exports = (sequelize) => {
        return sequelize.define('MasterTable', {
            host: {
                type: DataTypes.STRING,
                allowNull: false
            },
            dbuser: {
                type: DataTypes.STRING,
                allowNull: false
            },
            dbpassword: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            timestamps: false,
        });
    };