import express, {Express} from "express";
import dbConnection from "@root/setupDb"
//import applicationRoutes from "@root/routes"
import {config} from "@root/config";
import {ChatServer} from "@root/setupServer";

class Application {
    public initialize(): void {
        this.loadingConfig();
        dbConnection();
        const app: Express = express();
        app.use(express.json())
        //applicationRoutes(app);
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
