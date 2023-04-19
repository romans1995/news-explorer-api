const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { JWT_TOKEN = 'dev-key' } = process.env;

module.exports.getUserData = (req, res, next) => {
    User.findById(req.user._id)
        .orFail(() => {
            throw new NotFoundError('No user found with this Id');
        })
        .then((user) => res.status(200).send(user))
        .catch(next);
};
module.exports.login = (req, res, next) => {
    const { email, password } = req.body;
    return User.findUserByCredentials(email, password)
        .then((user) => {
            // create a token
            const token = jwt.sign({ _id: user._id },
                JWT_TOKEN,

                {
                    expiresIn: '7d',
                },
            );
            res.send({ token });
        })
        .catch(next);
};
module.exports.createUser = async(req, res, next) => {
    const {
        name,
        email,
        password,
    } = req.body;

    const hashdPassword = await bcrypt.hash(password, 10);

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            next(new ConflictError('this email is taken'));
        }

        const newUser = await User.create({
            name,
            email,
            password: hashdPassword,
        });
        const newUserdData = { name: newUser.name, _id: newUser._id };
        return res.status(201).send({ data: newUserdData });
    } catch (err) {
        if (err.name === 'ValidationError') {
            next(new ERROR_CODE('invalid data passed to the methods for creating a user '));
        }
        next(new SERVER_ERROR('An error has occurred on the server.'));
    }
};