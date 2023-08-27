import express, {Express} from "express";
import dbConnection from "@root/stupDb"
import applicationRoutes from "@root/routes"
import {config} from "@root/config";
import {ChatServer} from "@root/setupServer";

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
        config.cloudinaryConfig();
    }
}

const application: Application = new Application();
application.initialize();
