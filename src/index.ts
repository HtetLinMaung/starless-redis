import {
  createClient,
  RedisClientOptions,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from "redis";

let client;

export const redisClient = {
  getNativeClient: () => client,
  connect: async (
    options: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts> = {}
  ) => {
    try {
      if (!client) {
        client = createClient(options);
        client.on("error", (err) => console.error(`Redis Client Error ${err}`));
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
  setJson: async (key: string, value: any, options: any = {}) =>
    await redisClient.set(key, JSON.stringify(value), options),
  getJson: async (key: string) => JSON.parse(await redisClient.get(key)),
  set: async (key: string, value: string, options: any = {}) => {
    try {
      await client.set(key, value, options);
    } catch (err) {
      console.log(err);
    }
  },
  get: async (key: string) => {
    try {
      return await client.get(key);
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  hSet: async (
    key: string,
    field: string,
    value: string,
    options: any = {}
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
