const { Sequelize } = require('sequelize');
const dbmatsermodel = require('../models/masterconfigdatabase'); // Import the MasterTable model
const masterTableDef = require('../models/masterconfigdatabase');

// Function to create a Sequelize instance without specifying a database
const createSequelizeInstanceWithoutDb = (dbuser, dbpassword = '', dbhost = 'localhost') => {
    return new Sequelize({
        username: dbuser,
        password: dbpassword,
        host: dbhost,
        dialect: 'mysql',
        logging: false,
    });
};

// Function to create a Sequelize instance for the host database
const createHostModel = (dbuser) => {
    return createSequelizeInstanceWithoutDb(dbuser);
};

// Function to create the Sequelize instance for the main database
const createSequelizeInstance = (dbName, dbuser, dbpassword = '', dbhost = 'localhost') => {
    if (!dbName || !dbuser) {
        throw new Error('Database name and username are required');
    }
    console.log(`Connecting to database: ${dbName}`);
    return new Sequelize(dbName, dbuser, dbpassword, {
        host: dbhost,
        dialect: 'mysql',
        logging: false,
    });
};

// Function to create the database if it doesn't exist
const createDatabase = async (sequelize, dbName) => {
    try {
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database "${dbName}" created successfully or already exists.`);
    } catch (error) {
        throw new Error(`Error creating database "${dbName}": ${error.message}`);
    }
};

// Function to synchronize the master table
const syncMasterTable = async (sequelize) => {
    try {
        const MasterTable = dbmatsermodel(sequelize); // Define MasterTable here
        await MasterTable.sync();
        console.log('Master table synchronized successfully.');
    } catch (error) {
        throw new Error(`Error synchronizing master table: ${error.message}`);
    }
};

const addNewUserToMasterTable = async (sequelize, dbuser, dbName) => {
    const MasterTable = masterTableDef(sequelize);
    await sequelize.sync(); // Ensure the model is synchronized with the database

    // Create the new database
    await createDatabase(sequelize, dbName);

    // Add the new user entry to MasterTable
    await MasterTable.create({ host: 'localhost', dbuser, dbpassword: '', dbName });
};


module.exports = { createSequelizeInstance, createHostModel, createDatabase, syncMasterTable, createSequelizeInstanceWithoutDb, addNewUserToMasterTable };
