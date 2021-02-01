const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    notseen: {
        type: Array,
        default: []
    },
    image: {
        type: String,
        default: 'default.jpg'
    },
    gallery: {
        type: Array
    }
})

module.exports = mongoose.model('User', userSchema)