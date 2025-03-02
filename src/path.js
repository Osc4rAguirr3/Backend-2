import 'dotenv/config'
import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import path from 'path'
import { engine } from "express-handlebars"
import passport from "passport"
import cors from "cors"

import initializePassport from "./config/passport.config.js"
import __dirname from "./path.js"
import indexRouter from "./routes/index.routes.js"
import cookieParser from "cookie-parser"

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser(process.env.SECRET_COOKIE))
app.use(cors())

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.DBPATH,
        mongoOptions: {},
        ttl: 86400 // 1 día
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set('views', path.join(__dirname, 'views'))

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.DBPATH)
        console.log("Conectado a MongoDB")
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

connectToMongoDB()

app.use("/public", express.static(__dirname + "/public"))
app.use("/", indexRouter)

app.listen(PORT, () => console.log(`Escuchando en el puerto: ${PORT}`))