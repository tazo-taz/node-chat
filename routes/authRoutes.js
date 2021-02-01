const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const passport = require('passport')

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    req.flash('info', '123')
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register', async (req, res) => {
    const {email, password, name} = req.body
    if(await User.findOne({email})){
        req.flash('error', 'that email is already registered')
        res.redirect('/auth/register')
        return
    }else if(!email || !password || !name){
        req.flash('error', 'Please fill all fields')
        res.redirect('/auth/register')
        return
    }

    const user = User({
        email,
        password: await bcrypt.hash(password, 10),
        name,
    })
    await user.save()
    res.status(200).redirect('/')
})


module.exports = router