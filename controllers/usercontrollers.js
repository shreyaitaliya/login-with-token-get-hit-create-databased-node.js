const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');
const sequelize = db.sequelize;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/usermodel')(sequelize, DataTypes); // Initialize the userModel with sequelize and DataTypes
const { createDatabase, createTablesFromConfig } = require('../config/db');


const adduser = async (req, res) => {
    try {
        const { dbName, name, email, password } = req.body; // Make sure dbName is extracted from the request body

        if (!dbName || !name || !email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Database name, name, email, and password are required'
            });
        }
        const data = await userModel.create({
            name, email, password
        });

        // Create database and tables dynamically
        await createDatabase(dbName); // Pass dbName to the createDatabase function
        await createTablesFromConfig(dbName);

        // Rest of your code...
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'An error occurred',
            error: error.message
        });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Email and password are required for login'
            });
        }

        const loginuser = await userModel.findOne({ where: { email } });
        if (!loginuser) {
            return res.status(400).send({
                success: false,
                message: 'Email and password are incorrect',
            });
        }

        const passwordMatch = await bcrypt.compare(password, loginuser.password);
        if (!passwordMatch) {
            return res.status(400).send({
                success: false,
                message: 'Email and password are incorrect',
            });
        }

        let token = jwt.sign({ loginuser: loginuser }, 'API', { expiresIn: '1hr' });
        return res.status(200).send({
            success: true,
            message: 'Token generated successfully',
            loginuser,
            token
        });
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    adduser, login
};
