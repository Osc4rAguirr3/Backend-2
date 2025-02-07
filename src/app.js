import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import path from 'path'
import { engine } from "express-handlebars"
import passport from "passport"

import initializePassport from "./config/passport.config.js"
import __dirname from "./path.js"
import sessionRouter from "./routes/sessions.routes.js"
import viewsRoutes from "./routes/views.routes.js"
import productRouter from "./routes/products.routes.js"
import cartRouter from "./routes/carts.routes.js"
import cookieParser from "cookie-parser"


const app = express()
const PORT = 8080
const DBPATH = "mongodb+srv://alcaldechristian:an591l6r7LH1Mnro@cluster0.dgphy.mongodb.net/phonemart?retryWrites=true&w=majority&appName=Cluster0"

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser("CookieSecret"))


app.use(session({
    store: MongoStore.create({
        mongoUrl: DBPATH,
        mongoOptions: {},
        ttl: 15
    }),
    secret: "SessionSecret",
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
        await mongoose.connect(DBPATH)
        console.log("Conectado a MongoDB")
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

connectToMongoDB()

app.use("/public", express.static(__dirname + "/public"))
app.use("/api/sessions", sessionRouter)
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/", viewsRoutes)

app.listen(PORT, () => console.log(`Escuchando en el puerto: ${PORT}`))