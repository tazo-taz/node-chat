const router = require('express').Router()
const User = require('../models/User')
const Message = require('../models/Message')

router.get('/:id', async (req, res) => {
    try {
        
        const users = (await User.find({})).filter(a => a.email != req.user.email)
        const user = await User.findById(req.params.id)
        const messages = await Message.findOne({senders: [String(req.user._id), req.params.id].sort()})
        res.render('chat/single', {user, messages: messages ? messages.messages : [], users })
    } catch (error) {
        console.log(error)
    }
})

router.get('/', async (req, res) => {
    const user = (await User.find({}).limit(2)).filter(a => a.email != req.user.email)[0]
    res.redirect('chat/' + user._id)
})

module.exports = router