import { getProcessCandles } from "./utils/coinbData.js";
import dotenv from "dotenv";
import { getMongoConnection } from "./DB/mongo.js";
import { createCrypto, createLocalCrypto, saveCandles, saveLocalCandles } from "./DB/DBData.js";

dotenv.config();

const PRODUCT_ID = "BTC-USD";

let start = 1717087392502;

/*let res = await createCrypto({
  cryptoName: "Bitcoin",
  product_id: PRODUCT_ID
});

console.log(res);

let localres = await createLocalCrypto({
  cryptoName: "Bitcoin",
  product_id: PRODUCT_ID
});

console.log(localres);*/

for (let i = 0; i < 200; i++) {
  await saveData(start)
  await delay(2000)
  start -= 18000000
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function saveData(start) {
  let todate = start
  let frdate = start - 18000000

  let candleList = await getProcessCandles({
    product_id: PRODUCT_ID,
    frdate,
    todate
  })

  let response = await saveCandles({
    product_id: PRODUCT_ID,
    granularity: 60,
    candles: candleList
  })

  let localResponse = await saveLocalCandles({
    product_id: PRODUCT_ID,
    granularity: 60,
    candles: candleList
  })

  console.log("SAVED", response, localResponse, new Date(start).toISOString(), start)
}

process.exit(0)

//await DBConnection.connection.close();

/*console.log(new Date("2025-03-14T12:00:00Z").getTime());
console.log(new Date("2025-03-14T17:00:00Z").getTime());
console.log(
  new Date("2025-03-14T17:00:00Z").getTime() -
  new Date("2025-03-14T12:00:00Z").getTime()
);*/

//console.log(new Date(1741953600000).toISOString());
