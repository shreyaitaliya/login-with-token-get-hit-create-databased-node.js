const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
require('./config/db');

app.use(express.json());
app.use(bodyParser.json());
app.use('/api', userRoutes);
   

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
