const { Sequelize } = require('sequelize');

// Define dbName as an empty string by default
let dbName = '';

// Export Sequelize and sequelize along with a function to set dbName
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName, // Database name will be provided dynamically
});

module.exports = {
    Sequelize,
    sequelize,
    setDbName: (name) => {
        dbName = name;
        sequelize.options.database = name; // Update the database name in the sequelize options
    }
};
