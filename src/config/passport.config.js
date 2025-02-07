import passport from "passport"
import local from "passport-local"
import GithubStrategy from "passport-github2"
import userModel from "../models/user.js"
import { createHash, validatePassword } from "../utils/bcrypt.js"
import jwt from "passport-jwt"


const localStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt


const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies["projectCookie"]
    }
    return token
}


const initializePassport = () => {
    passport.use("register", new localStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        
        try {
            const {firstName, lastName, email, age, password} = req.body
            const userExists = await userModel.findOne({ email: email })
            if (!userExists) {
                const newUser = await userModel.create({
                    firstName,
                    lastName,
                    email,
                    password: createHash(password),
                    age
                })
                return done(null, newUser)
            } else {
                return done(null, false)
            }
        } catch (error) {
            console.log(error)
            return done(error)
        }
    }))

    passport.use("login", new localStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })

            if (user && validatePassword(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        } catch (error) {
            console.log(error)
            return done(error)
        }
    }))


    passport.use("github", new GithubStrategy({
        clientID: "Iv23li6s2aEEYiF1UJXH",
        clientSecret: "f0570d6ba6b94e56ebadab0a4b999ad7bc8d9658",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log("Github profile:\n", profile)
            console.log("Github access token:\n", accessToken)
            console.log("Github refresh token:\n", refreshToken)
            
            const user = await userModel.findOne({ email: profile._json.email})
            
            if (!user) {
                const newUser = await userModel.create({
                    firstName: profile._json.name,
                    lastName: " ",
                    email: profile._json.email,
                    password: "1234",
                    age: 18
                })
                return done(null, user)
            } else {
                return done(null, user)
            }
        } catch (error) {
            console.log(error)
            return done(error)
        }
    }))


    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "JWTSecret"
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user)
        } catch (error) {
            return console.log(error)
        }
    }))

    passport.serializeUser((user, done) => {
        console.log(user)
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport