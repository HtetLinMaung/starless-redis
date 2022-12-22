const { redisClient } = require("./index");

async function main() {
  await redisClient.connect({
   url: 'redis://150.95.82.125:6379'
  });
  await redisClient.set("info", JSON.stringify({ name: "KK", age: 15 }), {
    EX: 3,
  });
}

main();
