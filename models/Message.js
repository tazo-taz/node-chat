const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    messages: {
        type: Array,
        required: true
    },
    senders: {
        type: Array,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema)