const Sequelize = require('sequelize');

const dbConfig = {
    HOST: process.env.DB_HOST || "localhost",
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const createSequelizeInstance = (dbName) => {
    if (!dbName) {
        throw new Error('Database name is required');
    }

    console.log('Connecting to database:', dbName);
    return new Sequelize({
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        username: dbConfig.USER,
        password: dbConfig.PASSWORD,
        database: dbName,
        logging: false, 
    });
};

const createDatabase = async (dbName) => {
    const tempSequelize = createSequelizeInstance('mysql');
    try {
        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database ${dbName} created successfully.`);
    } catch (error) {
        console.error('Error creating database:', error);
        throw error;
    } finally {
        await tempSequelize.close();
    }
};

const createTablesFromConfig = async (dbName, ...tables) => {
    const sequelize = createSequelizeInstance(dbName);
    console.log('Tables:', tables);

    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        for (const table of tables) {
            if (!table.tableName || !table.columns || !Array.isArray(table.columns)) {
                throw new Error('Table object must contain tableName and columns properties, where columns must be an array');
            }
            const { tableName, columns } = table;
            const tableColumns = {};

            for (const column of Object.values(columns)) {
                tableColumns[column.name] = {
                    type: Sequelize[column.type.toUpperCase()],
                    allowNull: column.allowNull || false
                };
            }

            sequelize.define(tableName, tableColumns);
            console.log(`Table ${tableName} created successfully.`);
        }
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
};


module.exports = {
    createDatabase,
    createTablesFromConfig,
    createSequelizeInstance
};
