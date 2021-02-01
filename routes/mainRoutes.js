const router = require('express').Router()
const User = require('../models/User')
const multer = require('multer')
const fs = require('fs')

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) next()
    else {
        res.redirect('/')
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images/upload')
    },
    filename: function(req, file, cb){
        cb(null, req.user._id + '.' + file.originalname.split('.').pop())
    }
})

const storage2 = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images/upload')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    }
})

const upload2 = multer({
    storage: storage2
})


router.get('/', (req, res) => {
    res.render('home')
})

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

router.post('/userdata', async (req, res) => {
    const user1 = await User.findById(req.user._id)
    const user2 = await User.findById(req.body.currentemail)
    const hasseen = user2.notseen.includes(user1._id)
    res.json({user1, hasseen})
})

router.get('/upload', isAuth, (req, res) => {
    res.render('upload')
})

router.post('/upload', isAuth, upload2.array('img',5), async (req, res) => {
    let user = await User.findById(req.user._id)
    req.files.forEach(async (a,b) => {
        if(req.body.id == b)user.image = a.filename
        if(!user.gallery)user.gallery = []
        user.gallery.push(a.filename)
    })
    await user.save()
    res.json(req.files)

})

router.post('/deleteimg', async (req,res) => {
    if(req.user.gallery.includes(req.body.id)){
        try {
        const path = './public/images/upload/' + req.body.id
        const user = await User.findById(req.user._id)
        user.gallery = user.gallery.filter(a => a != req.body.id)
        await user.save()
        fs.unlinkSync(path)
        res.json({deleted: true})
    } catch(err) {
        console.error(err)
        }
    }else{

        res.json({a: 23})
    }
})

router.post('/setprofile', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {image: req.body.id.split('images/upload/')[1]})
    await user.save()
    res.json({})
})

module.exports = router