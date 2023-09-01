import express, {Router} from "express";
import {Signup} from "@auth/controllers/signup";
import Logger from "bunyan";
import {config} from "@root/config";
const log: Logger = config.createLogger('server')
class AuthRoutes {
    private readonly router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routers(): Router {
        this.router.post('/signpepe', (
            req, res) => {

            log.info(req.body)

            res.send('ggooooooos')
        })
        this.router.post('/signup', Signup.prototype.create)

        return this.router;
    }
}

export const authRoutes: AuthRoutes = new AuthRoutes()
