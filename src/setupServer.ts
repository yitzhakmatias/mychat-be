import {Application, json, Request, Response, NextFunction, urlencoded} from 'express'
import http from 'http'
import cookieSession from 'cookie-session'
import 'express-async-errors'
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import compression from "compression";
import {Server} from "socket.io";
import {createClient} from "redis";
import {createAdapter} from "@socket.io/redis-adapter";
import * as process from "process";
import HTTP_STATUS from "http-status-codes";
import Logger from "bunyan";
import {CustomError, IErrorResponse} from "@global/helper/error-handler";
import {config} from "@root/config";
//import applicationRoutes from '@root/routes'

const SERVER_PORT = 5000;
const log: Logger = config.createLogger('server')

export class ChatServer {
    private readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
    }

    private securityMiddleware(app: Application): void {

        app.use(cookieSession({
            name: 'session',
            keys: [config.SECRET_COOKIE_ONE!, config.SECRET_COOKIE_TWO!],
            maxAge: 24 * 7 * 3600000,
            secure: config.NODE_ENV != 'development'
        }))
        app.use(hpp())
        app.use(helmet())
        //!important
        app.use(cors({
            origin: config.CLIENT_URL,
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }))
    }

    private standardMiddleware(app: Application): void {
        app.use(compression())
        app.use(json({
            limit: '50mb'
        }))
        app.use(urlencoded({
            extended: true, limit: '50mb'
        }))
    }

    private routesMiddleware(_app: Application): void {
    }

    private globalErrorHandler(app: Application): void {
        app.all('*',
            (req: Request, res: Response) => {
                res.status(HTTP_STATUS.NOT_FOUND).json({message: `${req.originalUrl} not found !!!!`})
            });
        app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
            console.log(error)
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json(error.serializeError())
            }
            next();
        })
    }

    private async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app);
            const socketIO: Server = await this.createSocketIO(httpServer);
            this.socketIOConnections(socketIO);
            this.startHttpServer(httpServer);

        } catch (err) {
            log.error(err)
        }
    }

    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        const io: Server = new Server(httpServer, {
            cors: {
                origin: config.CLIENT_URL,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            }
        })
        const pubClient = createClient({
            url: config.REDIS_HOST
        })
        const subClient = pubClient.duplicate()
        await Promise.all([pubClient.connect(), subClient.connect()]);
        io.adapter(createAdapter(pubClient, subClient));
        io.listen(3000);
        return io;
    }

    private startHttpServer(httpServer: http.Server): void {
        log.info(`Server started at  ${process.pid}`)
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Server running on : ${SERVER_PORT} !!`)
        })
    }

    private socketIOConnections(_io: Server): void {
        log.info('sockets connections')
    }
}
