const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createDatabase, createSequelizeInstance } = require('../config/db');
const userModelDef = require('../models/usermodel');
const categoryModelDef = require('../models/categorymodel');
const subcategoryModelDef = require('../models/subcategorymodel');

const adduser = async (req, res) => {
    try {
        const { dbName, name, email, password } = req.body;
        if (!dbName || !name || !email || !password) {
            return res.status(400).send({ success: false, message: 'Database name, name, email, and password are required' });
        }

        // Create database if it does not exist
        await createDatabase(dbName);

        // Initialize Sequelize with the database name
        const sequelize = createSequelizeInstance(dbName);

        // Define models
        const User = userModelDef(sequelize);
        const Category = categoryModelDef(sequelize);
        const Subcategory = subcategoryModelDef(sequelize);

        // Sync models (create tables)
        await sequelize.sync();

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({ name, email, password: hashedPassword });

        res.status(200).send({ success: true, message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'An error occurred', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, dbName } = req.body;
        if (!email || !password || !dbName) {
            return res.status(400).send({ success: false, message: 'Email, password, and database name are required for login' });
        }

        const sequelize = createSequelizeInstance(dbName);
        const User = userModelDef(sequelize);
        const loginUser = await User.findOne({ where: { email } });
        if (!loginUser) {
            return res.status(400).send({ success: false, message: 'Email and password are incorrect' });
        }

        const passwordMatch = await bcrypt.compare(password, loginUser.password);
        if (!passwordMatch) {
            return res.status(400).send({ success: false, message: 'Email and password are incorrect' });
        }

        // Include necessary user information in the token payload
        const tokenPayload = {
            id: loginUser.id,
            email: loginUser.email,
            dbName
        };

        // Sign the token with the payload
        let token = jwt.sign({ loginUser: tokenPayload }, 'API', { expiresIn: '1hr' });

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





module.exports = { adduser, login, categoryadd, userdetails, subcategoryadd };
