import { getProcessCandles } from "./utils/coinbData.js";
import dotenv from "dotenv";
import { getMongoConnection } from "./DB/mongo.js";
import { createCrypto, createLocalCrypto, saveCandles, saveLocalCandles } from "./DB/DBData.js";

dotenv.config();

const PRODUCT_ID = "XRP-USDT";

let start = new Date().getTime();

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

let todate = start
let frdate = start - 25920000000

let candleList = await getProcessCandles({
  product_id: PRODUCT_ID,
  frdate,
  todate,
  granu: 86400
})

console.log("candleList", candleList, candleList.length)

//---------------------------------------------------------
const granu = 86400
const time = 25920000000

/*for (let i = 0; i < 100; i++) {
  await saveData(start)
  await delay(2000)
  start -= time
}*/

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function saveData(start) {
  let todate = start
  let frdate = start - time

  let candleList = await getProcessCandles({
    product_id: PRODUCT_ID,
    frdate,
    todate,
    granu
  })

  let response = await saveCandles({
    product_id: PRODUCT_ID,
    granularity: granu,
    candles: candleList
  })

  let localResponse = await saveLocalCandles({
    product_id: PRODUCT_ID,
    granularity: granu,
    candles: candleList
  })

  console.log("SAVED", response, localResponse, new Date(start).toISOString(), start)
  if (localResponse === 0) process.exit(0)
}


//await DBConnection.connection.close();

/*console.log(
  (new Date("2025-03-14T22:00:00Z").getTime() -
    new Date("2025-03-13T22:00:00Z").getTime()) * 300
);*/

//console.log(new Date(1741953600000).toISOString());

process.exit(0)