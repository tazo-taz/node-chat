const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const passport = require('passport')
const session = require('express-session')
const cookieSession = require('cookie-session')
const mongoose = require('mongoose')
const flash = require('express-flash')
const Message = require('./models/Message')
const User = require('./models/User')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)


require('./passport/passport-local')(passport)

app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieSession({
    name: 'cookie',
    keys: ['key1', 'key2']
}))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.set('view engine', 'ejs')

app.use((req, res, next) => {
    res.locals.ownuser = req.user
    
    next()
})

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) next()
    else {
        res.redirect('/')
    }
}

const notAuth = (req, res, next) => {
    if (!req.isAuthenticated()) next()
    else {
        res.redirect('/')
    }
}

mongoose.connect('mongodb+srv://shroudich:191136115@cluster0.rlupt.mongodb.net/node-auth', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        http.listen(process.env.PORT || 3000)

    })
    .catch(e => console.log(e))

app.use('/', require('./routes/mainRoutes'))
app.use('/auth', notAuth, require('./routes/authRoutes'))
app.use('/chat', isAuth, require('./routes/chatRoutes'))

io.on('connection', socket => {

    socket.on('join', async (a, b) => {
        const user = await User.findById(b)
        user.notseen = user.notseen.filter(c => c != a)
        await user.save()
        socket.join([[a, b].sort().join(''),b])
        io.to(a).emit('youhaveseened')
    })

    socket.on('keyup', (a,b) => {
        socket.to([a, b].sort().join('')).emit('typing')
    })

    socket.on('send_message', async (a, b, c) => {
        let message = await Message.findOne({ senders: [c, b].sort() })
        if (!message) {
            message = Message({
                senders: [b, c].sort(),
                messages: []
            })
        }
        message.messages.push({ sender: c, text: a })
        await message.save()
        const user1 = await User.findById(b)
        if (!user1.notseen.includes(c)) {
            user1.notseen.push(c)
            await user1.save()
        }
        io.to(b).emit('haveuseen', b,c)
        socket.to([c, b].sort().join('')).emit('voice')
        io.to([c, b].sort().join('')).emit('message', a, c, b)
    })

    socket.on('seened', (a,b) => {
        io.to(b).emit('youhaveseened')
    })

    socket.on('seen', async(a, b) => {
        const user = await User.findById(b)
        user.notseen = user.notseen.filter(d => d != a)
        await user.save()

    })
})