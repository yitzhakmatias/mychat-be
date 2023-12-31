import mongoose from "mongoose";
import * as process from "process";
import {config} from "./config";
import Logger from "bunyan";
const log:Logger = config.createLogger('setupDataBase')
export default ()=>{
    const connect = ()=>{
        mongoose.connect(`${config.DATABASE_URL}`).then(()=>{
            log.info(`Successfully connect to db`)
        }).catch((err)=>{
            log.error(`error : ${err}`)
            return process.exit(1);
        })
    }
    connect();
    mongoose.connection.on('disconnected', connect);
}
