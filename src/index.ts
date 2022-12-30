import {
  createClient,
  RedisClientOptions,
  RedisFunctions,
  RedisModules,
  RedisScripts,
  SetOptions,
} from "redis";
import { isAsyncFunction } from "util/types";

interface CacheData {
  [key: string]: string;
}
const cache: CacheData = {};

function expireCache(key: string, duration: number = 0) {
  if (duration > 0) {
    setTimeout(() => {
      delete cache[key];
    }, duration * 1000);
  }
}

function setCache(key: string, value: string, options: SetOptions = {}) {
  cache[key] = value;
  expireCache(key, options.EX || 0);
}
function getCache(key: string) {
  return cache[key] == undefined ? null : cache[key];
}

let client;
export const redisClient = {
  getNativeClient: () => client,
  connect: async (
    options: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> = {}
  ) => {
    try {
      if (!client) {
        client = createClient(options);
        client.on("error", (err) => {
          console.error(`Redis Client Error ${err}`);
          client.disconnect();
        });
      }
      if (!client.isOpen) {
        await client.connect();
      }
      return client;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  setJson: async (key: string, value: any, options: SetOptions = {}) => {
    await redisClient.set(
      key,
      value == null ? null : JSON.stringify(value),
      options
    );
  },
  getJson: async (key: string) => {
    const value = await redisClient.get(key);
    try {
      return JSON.parse(value);
    } catch (err) {
      console.log(err);
      return value;
    }
  },
  getJsonOrDefault: async (key: string, defaultValue: any = null) => {
    let value: any = await redisClient.getJson(key);
    if (!value) {
      if (typeof defaultValue == "function") {
        if (
          isAsyncFunction(defaultValue) ||
          defaultValue.toString().includes("__awaiter")
        ) {
          value = await defaultValue();
        } else {
          value = defaultValue();
        }
      } else {
        value = defaultValue;
      }
    }
    return value;
  },
  getJsonAndUpdate: async (
    key: string,
    updateValue: any = null,
    options: SetOptions = {}
  ) => {
    let value = await redisClient.getJson(key);
    (async () => {
      if (typeof updateValue == "function") {
        if (
          isAsyncFunction(updateValue) ||
          updateValue.toString().includes("__awaiter")
        ) {
          value = await updateValue();
        } else {
          value = updateValue();
        }
      } else {
        value = updateValue;
      }

      await redisClient.setJson(key, value, options);
    })();
    return value;
  },
  set: async (key: string, value: string, options: SetOptions = {}) => {
    try {
      setCache(key, value, options);
      await client.set(key, value, options);
    } catch (err) {
      console.log(err);
    }
  },
  get: async (key: string): Promise<string> => {
    try {
      return await client.get(key);
    } catch (err) {
      console.log(err);
      return getCache(key);
    }
  },
  getOrDefault: async (key: string, defaultValue: any = null) => {
    let value: any = await redisClient.get(key);
    if (!value) {
      if (typeof defaultValue == "function") {
        if (
          isAsyncFunction(defaultValue) ||
          defaultValue.toString().includes("__awaiter")
        ) {
          value = await defaultValue();
        } else {
          value = defaultValue();
        }
      } else {
        value = defaultValue;
      }
    }
    return value;
  },
  getAndUpdate: async (
    key: string,
    updateValue: any = null,
    options: SetOptions = {}
  ) => {
    let value = await redisClient.get(key);
    (async () => {
      if (typeof updateValue == "function") {
        if (
          isAsyncFunction(updateValue) ||
          updateValue.toString().includes("__awaiter")
        ) {
          value = await updateValue();
        } else {
          value = updateValue();
        }
      } else {
        value = updateValue;
      }

      await redisClient.set(key, value, options);
    })();
    return value;
  },
  hSet: async (
    key: string,
    field: string,
    value: string,
    options: SetOptions = {}
  ) => {
    try {
      await client.hSet(key, field, value, options);
    } catch (err) {
      console.log(err);
    }
  },
  hGetAll: async (key: string) => {
    try {
      return await client.hGetAll(key);
    } catch (err) {
      console.log(err);
      return {};
    }
  },
  hVals: async (key: string) => {
    try {
      return await client.hVals(key);
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  disconnect: async () => {
    try {
      await client.disconnect();
    } catch (err) {
      console.log(err);
    }
  },
};
