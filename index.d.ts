import { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts } from "redis";
export declare const redisClient: {
    getNativeClient: () => any;
    connect: (options?: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>) => Promise<any>;
    setJson: (key: string, value: any, options?: any) => Promise<void>;
    getJson: (key: string) => Promise<any>;
    set: (key: string, value: string, options?: any) => Promise<void>;
    get: (key: string) => Promise<any>;
    hSet: (key: string, field: string, value: string, options?: any) => Promise<void>;
    hGetAll: (key: string) => Promise<any>;
    hVals: (key: string) => Promise<any>;
    disconnect: () => Promise<void>;
};
