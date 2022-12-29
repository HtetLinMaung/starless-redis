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
let client;
exports.redisClient = {
    getNativeClient: () => client,
    connect: (options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!client) {
                client = (0, redis_1.createClient)(options);
                client.on("error", (err) => console.error(`Redis Client Error ${err}`));
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
    setJson: (key, value, options = {}) => __awaiter(void 0, void 0, void 0, function* () { return yield exports.redisClient.set(key, JSON.stringify(value), options); }),
    getJson: (key) => __awaiter(void 0, void 0, void 0, function* () { return JSON.parse(yield exports.redisClient.get(key)); }),
    set: (key, value, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
            return null;
        }
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
