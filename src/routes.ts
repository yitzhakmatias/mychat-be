import {Application} from "express";
import {authRoutes} from "@auth/routes/authRoutes";

const BASE_API = '/api/v1'
export default (app: Application) => {
    const routes = () => {
        app.use(BASE_API, authRoutes.routers())
    }
    routes();
}
