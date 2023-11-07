import mongoose from "mongoose";
import * as process from "process";
import Logger from "bunyan";
import {config} from "@root/config";
import {redisConnection} from "@service/redis/redis.connection";
const log:Logger = config.createLogger('setupDataBase')
export default ()=>{
    const connect = ()=>{
        mongoose.connect(`${config.DATABASE_URL}`).then(()=>{
            log.info(`Successfully connect to db`);
             redisConnection.connect();
        }).catch((err)=>{
            log.error(`error : ${err}`)
            return process.exit(1);
        })
    }
    connect();
    mongoose.connection.on('disconnected', connect);
}
