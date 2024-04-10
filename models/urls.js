const mongoose = require('mongoose')
const ShortUniqueId = require('short-unique-id');

const { urlvalidator, shortUrlvalidator } = require('../validators/signupValidate')

const schema = mongoose.Schema

const generateId = (idLength) => {
    const uid = new ShortUniqueId({ length: idLength });
    return uid.rnd()
}

const urlschema = new schema({
    longurl: {
        type: String,
        required: [true, 'please enter an url']
    },
    shorturl: {
        type: String,
        required: [true, 'please enter an url'],
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    visited: {
        type: Number,
        default: 0
    } 

})

urlschema.statics.addUrl = async function (longurl, shorturl) {
    if (!urlvalidator(longurl)) {
        throw { error: 'invalid url' }
    }
    if (shorturl) {
        if (!shortUrlvalidator(shorturl)) {
            throw { error: 'invalid key' }
        }
    }
    try {
        const myUrl = await this.create({ longurl, shorturl: shorturl ? shorturl : generateId(6) })
        return myUrl
    } catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000 && shorturl) {
            throw { error: 'must be unique' }
        }
        if (error.name === 'MongoServerError' && error.code === 11000 && !shorturl) {
            throw { error: 'Sorry an error accured *-*' }
        }
        throw error
    }
}

module.exports = mongoose.model('url', urlschema)