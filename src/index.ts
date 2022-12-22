import { createClient } from "redis";

let client;

export const redisClient = {
  getNativeClient: () => client,
  connect: async (options: any = {}) => {
    try {
      if (!client) {
        client = createClient(options);
        client.on("error", (err) => console.error(`Redis Client Error ${err}`));
      }
      if (!client.isOpen) {
        await client.connect();
        try {
          console.log(await client.ping());
        } catch (err) {
          console.log(err.message);
        }
      }
      return client;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
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
