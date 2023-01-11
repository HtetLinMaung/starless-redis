import { RedisClientOptions, RedisFunctions, RedisModules, RedisScripts, SetOptions } from "redis";
export declare const redisClient: {
    getNativeClient: () => any;
    connect: (options?: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>) => Promise<any>;
    setJson: (key: string, value: any, options?: SetOptions) => Promise<void>;
    getJson: (key: string) => Promise<any>;
    getJsonOrDefault: (key: string, defaultValue?: any, options?: SetOptions) => Promise<any>;
    getJsonAndUpdate: (key: string, updateValue?: any, options?: SetOptions) => Promise<any>;
    set: (key: string, value: string, options?: SetOptions) => Promise<void>;
    get: (key: string) => Promise<string>;
    getOrDefault: (key: string, defaultValue?: any, options?: SetOptions) => Promise<any>;
    getAndUpdate: (key: string, updateValue?: any, options?: SetOptions) => Promise<string>;
    hSet: (key: string, field: string, value: string, options?: SetOptions) => Promise<void>;
    hGetAll: (key: string) => Promise<any>;
    hVals: (key: string) => Promise<any>;
    disconnect: () => Promise<void>;
};
