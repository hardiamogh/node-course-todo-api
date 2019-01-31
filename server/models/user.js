const mongoose = require('mongoose');

const validator = require('validator');
const jwt = require('jsonwebtoken');

const _ = require('lodash');
const bcrypt = require('bcryptjs');
var UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            minlength: 1,
            trim: true,
            uniq: true,
            validate: {
                validator: (value) => {
                    return validator.isEmail(value);
                },
                message: '{VALUE} is not valid email'
            }
        },
        password: {
            type: String,
            require: true,
            minlength: 6
        },
        tokens: [{
            access: {
                type: String,
                required: true

            },
            token: {
                type: String,
                required: true
            }
        }]

    });

UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        })

    } else {
        next();

    }
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
    console.log('in generate auth token');
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
    console.log("token:", token)
    try {
        user.tokens = user.tokens.concat([{ access, token }]);
    } catch (e) {
        console.log('erroe concanating user.tokens', e);
    }

    console.log(user.tokens);
    return user.save().then(() => {
        console.log('in generate auth, user.save');
        return token;
    })
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();

    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}
var User = mongoose.model('User', UserSchema);

module.exports = {
    User
}