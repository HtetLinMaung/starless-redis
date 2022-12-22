export declare const redisClient: {
    getNativeClient: () => any;
    connect: (options?: any) => Promise<any>;
    set: (key: string, value: string, options?: any) => Promise<void>;
    get: (key: string) => Promise<any>;
    hSet: (key: string, field: string, value: string, options?: any) => Promise<void>;
    hGetAll: (key: string) => Promise<any>;
    hVals: (key: string) => Promise<any>;
    disconnect: () => Promise<void>;
};
