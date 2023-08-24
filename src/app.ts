import express, {Express} from "express";
import {ChatServer} from "./setupServer";
import dbConnection from "./stupDb"
import {config} from "./config";
import applicationRoutes from "./routes"
class Application {
    public initialize(): void {
        dbConnection();
        this.loadingConfig();
        const app: Express = express();
        applicationRoutes(app);
        const server: ChatServer = new ChatServer(app);
        server.start();
    }
    private loadingConfig(): void {
        config.validateConfig();
    }
}

const application: Application = new Application();
application.initialize();
