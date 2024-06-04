const jwt = require('jsonwebtoken');

const verifytoken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(200).send({
            success: false,
            message: 'token is blank'
        })
    }

    let donetoken = token.split(' ')[1];
    jwt.verify(donetoken, 'API', (error, decoded) => {
        if (error) {
            return res.status(400).send({
                sucess: false,
                message: 'token is not valid',
            })
        }
        req.user = decoded;
        next();
    })
}

module.exports = ({ verifytoken })