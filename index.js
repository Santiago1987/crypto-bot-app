import { getProcessCandles } from "./utils/coinbData.js";
import dotenv from "dotenv";
import { getMongoConnection } from "./DB/mongo.js";
import { Crypto } from "./DB/schemas.js";
let DBConnection = undefined;
dotenv.config();

/*console.log(
  await getProcessCandles({
    product_id: "BTC-USD",
    frdate: "2025-03-14T12:00:00Z",
    todate: "2025-03-14T17:00:00Z",
  })
);*/

async function savetes() {
  DBConnection = await getMongoConnection();

  const crypto = new Crypto({
    crypto: "BTC",
    product_id: "BTC-USD",
    minutes: [],
  });

  let res = await crypto.save();

  console.log(res);

  await DBConnection.connection.close();
}

console.log(new Date("2025-03-14T12:00:00Z").getTime());
console.log(new Date("2025-03-14T17:00:00Z").getTime());
console.log(
  new Date("2025-03-14T17:00:00Z").getTime() -
    new Date("2025-03-14T12:00:00Z").getTime()
);

console.log(new Date(1741953600000).toISOString());
