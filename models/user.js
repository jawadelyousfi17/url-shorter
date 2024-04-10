const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {  signupErrors } = require('../validators/signupValidate')

const schema = mongoose.Schema

const userSchema = new schema({
    username: {
        type: String,
        required: [true, 'please enter an username'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        minlength: [6, 'Minimum password length is 6 chars']

    },
    name: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    urls : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'url'
    }]
})

userSchema.statics.login = async function (username, password) {
    if (!username || !password) throw Error(100)
    const user = await this.findOne({ username })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) return user
        throw Error(102)
    }
    throw Error(101)
}

userSchema.statics.signup = async function (username, password , name) {
    try {
        const salt = await bcrypt.genSalt();
         const hashpassword = await bcrypt.hash(password, salt);
         const user = await this.create({ username, password : hashpassword, name })
         return user
    } catch (error) {
        throw signupErrors(error)
    }
}

module.exports = mongoose.model('user', userSchema)