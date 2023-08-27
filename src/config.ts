import dotenv from 'dotenv'
import * as process from "process";
import bunyan from 'bunyan';
import cloudinary from 'cloudinary'
dotenv.config({});

class Config {

    public DATABASE_URL: string | undefined;
    public JWT_TOKEN: string | undefined;
    public NODE_ENV: string | undefined;
    public SECRET_COOKIE_ONE: string | undefined;
    public SECRET_COOKIE_TWO: string | undefined;
    public CLIENT_URL: string | undefined;
    public REDIS_HOST: string | undefined;
    public CLOUD_NAME: string | undefined;
    public CLOUD_API_KEY: string | undefined;
    public CLOUD_API_SECRET: string | undefined;

    private readonly DEFAULT_DATA_BASE_URL = 'mongodb://localhost:27017/webChatDb'

    constructor() {
        this.DATABASE_URL = process.env.DATA_BASE_URL || this.DEFAULT_DATA_BASE_URL;
        this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.SECRET_COOKIE_ONE = process.env.SECRET_COOKIE_ONE || '';
        this.SECRET_COOKIE_TWO = process.env.SECRET_COOKIE_TWO || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.REDIS_HOST = process.env.REDIS_HOST || '';
        this.CLOUD_NAME = process.env.CLOUD_NAME || '';
        this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
        this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';

    }

    public createLogger(name: string): bunyan {
        return bunyan.createLogger({name, level: 'debug'})
    }

    public validateConfig(): void {
        for (const [key, value] of Object.entries(this)) {
            //console.log(value)
            if (value === undefined) {
                throw new Error(`Configuration ${key} is undefined`)
            }
        }
    }
    public cloudinaryConfig():void{
        cloudinary.v2.config({
            cloud_name:this.CLOUD_NAME,
            api_key:this.CLOUD_API_KEY,
            api_secret:this.CLOUD_API_SECRET
        })
    }

}

export const config: Config = new Config();
