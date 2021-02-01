// const LocalStrategy = require('passport-local').Strategy

// module.exports = function(passport){
//     passport.use(new LocalStrategy({usernameField: 'email'},
//         async function(email, password, done){

//         }
//     ))
// }

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ email })
                    if (!user) {
                        return done(null, false, { message: 'that email is not registered' })
                    }

                    try {
                        if (await bcrypt.compare(password, user.password)) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: 'password incorrect' })
                        }
                    } catch (error) {
                        console.log(error)
                    }

                } catch (error) {
                    console.log(error)
                }
            })
    )
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })
    passport.deserializeUser(function (id, done) {
        User.findById(id, function(err, user){
            done(err, user)
        })
    })
}