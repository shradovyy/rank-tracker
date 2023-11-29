const bcrypt = require('bcrypt');
const saltRounds = 10;
const Validate = require('./Validate')
const { createToken, verifyToken } = require("./JWT")
const { ObjectId } = require("mongodb");

let db;
const setDB = (connection) => {
    db = connection;
}

const login = async (body) => {

    let schema = new Validate.Schema({
        email: { type: 'email', required: true },
        password: { type: 'password', required: true }
    });

    let validation = schema.validate(body);
    if(validation.errorCount() > 0)  return { status: 422, body: { errors: validation.errors } }

    let data = validation.body;

    let user = await db.collection('users').findOne({ email: data.email });
    if(!user) return { status: 422, body: { error: 'NOT_FOUND', message: 'User with such credentials is not found.' } }

    let isVerified = await new Promise(resolve => {
        bcrypt.compare(data.password, user.password, function(err, result) {
            if(err) { return resolve(false); }
            return resolve(result);
        });
    });

    if(!isVerified) return { status: 422, body: { error: 'NOT_FOUND', message: 'User with such credentials is not found.' } } 

    let loginData = {
        _id: user._id,
        email: user.email,
    }

    loginData.token = createToken(loginData);

    return { status: 200, body: loginData }
}

const register = async (data) => {

    let schema = new Validate.Schema({
        email: { type: 'email', required: true },
        password: { type: 'password', required: true },
        passwordRepeat: { type: 'password', required: true }
    });

    let validation = schema.validate(data);
    if(validation.errorCount() > 0)  return { status: 422, body: { errors: validation.errors } }

    let body = validation.body;

    let findUserWithSuchEmail = await db.collection('users').findOne({ email: body.email });
    if(findUserWithSuchEmail) {
        return { status: 422, body: { message: `Email address is already in use.` } }
    }

    if(body.password !== body.passwordRepeat) return { status: 422, body: { message: `Passwords do not match.` } }
    let hash = await new Promise(resolve => {
        bcrypt.hash(body.password, saltRounds).then(async (hash) => {
            resolve(hash);
        });
    });

    await db.collection('users').insertOne({ email: body.email, password: hash });

    return { status: 200, body: { ok: true } }
}

const verify = async (token) => {
    try {
        if(!token) throw new Error();
        let decoded = verifyToken(token);
        if(!decoded) throw new Error();
        if(!decoded._id) throw new Error();
        let user = await findUserById(decoded._id);
        if(!user) throw new Error();

        return { status: 200, body: user }
    } catch(e) {
        return { status: 401, body: { message: 'Unauthorized' } }
    }
}

const findUserById = async (id) => {

    try {
        id = new ObjectId(id);
    } catch(e) {
        return null;
    }

    let user = await db.collection('users').findOne({ _id: id });
    if(!user) return null;

    return {
        _id: user._id,
        email: user.email
    }

}

module.exports = {
    login,
    setDB,
    verify,
    register
}