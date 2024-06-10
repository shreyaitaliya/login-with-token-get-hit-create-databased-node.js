const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createSequelizeInstance, createSequelizeInstanceWithoutDb, createDatabase, syncMasterTable, createHostModel, addNewUserToMasterTable } = require('../config/db');
const userModelDef = require('../models/usermodel');
const categoryModelDef = require('../models/categorymodel');
const subcategoryModelDef = require('../models/subcategorymodel');
const masterTableDef = require('../models/masterconfigdatabase');

const master_host = async (req, res) => {
    try {
        const { dbuser, dbName, name, email, password } = req.body; // Get dbuser and dbName from request body

        if (!dbuser || !dbName || !name || !email || !password) {
            return res.status(400).send({ success: false, message: 'Database user and name are required' });
        }
        console.log(req.body);
        // Create Sequelize instance without specifying a database
        const sequelizeWithoutDb = createSequelizeInstanceWithoutDb(dbuser);

        // // Create the master database if it doesn't exist
        await createDatabase(sequelizeWithoutDb, 'master');

        // // Create Sequelize instance for the master database
        const masterSequelize = createSequelizeInstance('master', dbuser);

        // // Synchronize the MasterTable
        const MasterTable = masterTableDef(masterSequelize);
        await syncMasterTable(masterSequelize);

        // const existingUser = await MasterTable.findOne({ where: { dbuser } });
        // console.log(existingUser);

        // if (existingUser) {
        //     // If user exists, update the dbName associated with the user
        //     await existingUser.update({ dbName });
        // } else {
        //     // If user doesn't exist, create a new entry
        //     await addNewUserToMasterTable(masterSequelize, dbuser, dbName); // Pass dbuser here
        // }

        // // Add new database user entry to MasterTable
        await addNewUserToMasterTable(masterSequelize, dbuser, dbName);
        console.log(addNewUserToMasterTable);

        // // Create a database for the new host
        await createDatabase(masterSequelize, dbName);
        console.log(createDatabase);

        // // Initialize Sequelize with the correct database username, password, and database name
        const sequelize = createSequelizeInstance(dbName, dbuser, '');

        // // Define models
        const User = userModelDef(sequelize);
        const Category = categoryModelDef(sequelize);
        const Subcategory = subcategoryModelDef(sequelize);

        // // Sync models (create tables)
        await sequelize.sync();

        const adduser = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10) // Hash the password before storing it
        });

        return res.status(200).send({ success: true, message: 'Master host added successfully', adduser });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'An error occurred', error: error.message });
    }
};

const login = async (req, res) => {  
    try {
        const { email, password, dbName, dbuser } = req.body; // Add dbuser here
        if (!email || !password || !dbName || !dbuser) { // Check for dbuser
            return res.status(400).send({ success: false, message: 'Email, password, database name, and database user are required for login' });
        }

        // Assuming you have a Sequelize instance and User model defined
        const sequelize = createSequelizeInstance(dbName, dbuser); // Pass dbName and dbuser
        const User = userModelDef(sequelize);

        // Find user by email
        const loginUser = await User.findOne({ where: { email } });
        if (!loginUser) {
            return res.status(400).send({ success: false, message: 'Email and password are incorrect' });
        }

        // Check if passwords match
        const passwordMatch = await bcrypt.compare(password, loginUser.password);
        if (!passwordMatch) {
            return res.status(400).send({ success: false, message: 'Email and password are incorrect' });
        }

        // Include necessary user information in the token payload
        const tokenPayload = {
            id: loginUser.id,
            email: loginUser.email,
            dbName,
            dbuser // Add dbuser to token payload
        };

        // Sign the token with the payload
        const token = jwt.sign(tokenPayload, 'your_secret_key', { expiresIn: '1hr' }); // Adjust the secret key and expiration time

        return res.status(200).send({ success: true, message: 'Token generated successfully', token });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'An error occurred', error: error.message });
    }
};




const categoryadd = async (req, res) => {
    try {
        const user = req.user;
        const { dbName, id: userId } = user;
        const { categoryname } = req.body;

        console.log(categoryname);

        if (!dbName) {
            return res.status(400).send({ success: false, message: 'Database name (dbName) is required' });
        }

        if (!categoryname) {
            return res.status(400).send({ success: false, message: 'Category name (categoryname) is required' });
        }

        const sequelize = createSequelizeInstance(dbName);
        const Category = categoryModelDef(sequelize);

        const categoryadd = await Category.create({
            categoryname,
            userid: userId
        });

        return res.status(200).send({
            success: true,
            message: 'Category added successfully',
            categoryadd
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'An error occurred', error: error.message });
    }
};



const subcategoryadd = async (req, res) => {
    try {
        const user = req.user;
        const { dbName, id: userId } = user;
        const { subcategoryname } = req.body;

        if (!dbName) {
            return res.status(400).send({ success: false, message: 'Database name (dbName) is required' });
        }

        if (!subcategoryname) {
            return res.status(400).send({ success: false, message: 'Subcategory name and category ID are required' });
        }

        const sequelize = createSequelizeInstance(dbName);
        const Subcategory = subcategoryModelDef(sequelize);

        const subcategoryadd = await Subcategory.create({
            subcategoryname,
            userid: userId
        });

        return res.status(200).send({
            success: true,
            message: 'Subcategory added successfully',
            subcategoryadd
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'An error occurred', error: error.message });
    }
};


const userdetails = async (req, res) => {
    try {
        const user = req.user; // Change from req.user.loginUser to req.user
        console.log(user);
        if (!user) {
            return res.status(400).send({ success: false, message: 'Login user information not found' });
        }
        const { id, dbName } = user;

        const sequelize = createSequelizeInstance(dbName);
        const User = userModelDef(sequelize);

        const userDetails = await User.findOne({ where: { id } });
        if (!userDetails) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        // Assuming you have models for category and subcategory
        const Category = categoryModelDef(sequelize);
        const Subcategory = subcategoryModelDef(sequelize);

        const categories = await Category.findAll({ where: { userid: id } });
        const subcategories = await Subcategory.findAll({ where: { userid: id } });

        const userWithDetails = {
            ...userDetails.toJSON(),
            categories,
            subcategories
        };

        res.status(200).send({ success: true, user: userWithDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'An internal server error occurred', error: error.message });
    }
};





module.exports = { login, categoryadd, userdetails, subcategoryadd, master_host };
