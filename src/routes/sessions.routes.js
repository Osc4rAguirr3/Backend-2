import { Router } from "express"
import passport from "passport"
import { login, register, githubLogin } from "../controllers/sessionsController.js"

const sessionRouter = Router()

sessionRouter.post("/login", passport.authenticate("login", { failureRedirect: "/login" }), login)
sessionRouter.post("/register", passport.authenticate("register", { failureRedirect: "/register" }), register)
sessionRouter.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req, res) => {})
sessionRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), githubLogin)
sessionRouter.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => res.send(req.user))

export default sessionRouter