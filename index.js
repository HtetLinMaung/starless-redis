"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const types_1 = require("util/types");
const cache = {};
function expireCache(key, duration = 0) {
    if (duration > 0) {
        setTimeout(() => {
            delete cache[key];
        }, duration * 1000);
    }
}
function setCache(key, value, options = {}) {
    cache[key] = value;
    expireCache(key, options.EX || 0);
}
function getCache(key) {
    return cache[key] == undefined ? null : cache[key];
}
let client;
exports.redisClient = {
    getNativeClient: () => client,
    connect: (options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!client) {
                client = (0, redis_1.createClient)(options);
                client.on("error", (err) => {
                    console.error(`Redis Client Error ${err}`);
                    client.disconnect();
                });
            }
            if (!client.isOpen) {
                yield client.connect();
            }
            return client;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }),
    setJson: (key, value, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        yield exports.redisClient.set(key, value == null ? null : JSON.stringify(value), options);
    }),
    getJson: (key) => __awaiter(void 0, void 0, void 0, function* () {
        const value = yield exports.redisClient.get(key);
        try {
            return JSON.parse(value);
        }
        catch (err) {
            console.log(err);
            return value;
        }
    }),
    getJsonOrDefault: (key, defaultValue = null, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        let value = yield exports.redisClient.getJson(key);
        if (!value) {
            if (typeof defaultValue == "function") {
                if ((0, types_1.isAsyncFunction)(defaultValue) ||
                    defaultValue.toString().includes("__awaiter")) {
                    value = yield defaultValue();
                }
                else {
                    value = defaultValue();
                }
            }
            else {
                value = defaultValue;
            }
            exports.redisClient.setJson(key, value, options);
        }
        return value;
    }),
    getJsonAndUpdate: (key, updateValue = null, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        let value = yield exports.redisClient.getJson(key);
        (() => __awaiter(void 0, void 0, void 0, function* () {
            if (typeof updateValue == "function") {
                if ((0, types_1.isAsyncFunction)(updateValue) ||
                    updateValue.toString().includes("__awaiter")) {
                    value = yield updateValue();
                }
                else {
                    value = updateValue();
                }
            }
            else {
                value = updateValue;
            }
            yield exports.redisClient.setJson(key, value, options);
        }))();
        return value;
    }),
    set: (key, value, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setCache(key, value, options);
            yield client.set(key, value, options);
        }
        catch (err) {
            console.log(err);
        }
    }),
    get: (key) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield client.get(key);
        }
        catch (err) {
            console.log(err);
            return getCache(key);
        }
    }),
    getOrDefault: (key, defaultValue = null, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        let value = yield exports.redisClient.get(key);
        if (!value) {
            if (typeof defaultValue == "function") {
                if ((0, types_1.isAsyncFunction)(defaultValue) ||
                    defaultValue.toString().includes("__awaiter")) {
                    value = yield defaultValue();
                }
                else {
                    value = defaultValue();
                }
            }
            else {
                value = defaultValue;
            }
            exports.redisClient.set(key, value, options);
        }
        return value;
    }),
    getAndUpdate: (key, updateValue = null, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        let value = yield exports.redisClient.get(key);
        (() => __awaiter(void 0, void 0, void 0, function* () {
            if (typeof updateValue == "function") {
                if ((0, types_1.isAsyncFunction)(updateValue) ||
                    updateValue.toString().includes("__awaiter")) {
                    value = yield updateValue();
                }
                else {
                    value = updateValue();
                }
            }
            else {
                value = updateValue;
            }
            yield exports.redisClient.set(key, value, options);
        }))();
        return value;
    }),
    hSet: (key, field, value, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield client.hSet(key, field, value, options);
        }
        catch (err) {
            console.log(err);
        }
    }),
    hGetAll: (key) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield client.hGetAll(key);
        }
        catch (err) {
            console.log(err);
            return {};
        }
    }),
    hVals: (key) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield client.hVals(key);
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }),
    disconnect: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield client.disconnect();
        }
        catch (err) {
            console.log(err);
        }
    }),
};
