import dotenv from 'dotenv'
import * as process from "process";
import bunyan from 'bunyan';

dotenv.config({});

class Config {

    public DATABASE_URL: string | undefined;
    public JWT_TOKEN: string | undefined;
    public NODE_ENV: string | undefined;
    public SECRET_COOKIE_ONE: string | undefined;
    public SECRET_COOKIE_TWO: string | undefined;
    public CLIENT_URL: string | undefined;
    public REDIS_HOST: string | undefined;

    private readonly DEFAULT_DATA_BASE_URL = 'mongodb://localhost:27017/webChatDb'

    constructor() {
        this.DATABASE_URL = process.env.DATA_BASE_URL || this.DEFAULT_DATA_BASE_URL;
        this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.SECRET_COOKIE_ONE = process.env.SECRET_COOKIE_ONE || '';
        this.SECRET_COOKIE_TWO = process.env.SECRET_COOKIE_TWO || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.REDIS_HOST = process.env.REDIS_HOST || '';

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

}

export const config: Config = new Config();
