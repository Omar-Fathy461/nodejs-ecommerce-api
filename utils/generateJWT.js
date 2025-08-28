const jwt = require('jsonwebtoken');

const generateJWT = async(payload) => {
    const token = await jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '30m'});
    return token
};

module.exports = generateJWT;