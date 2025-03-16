import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import axios from "axios";

export const getCandlesFromCoinbase = async ({
  product_id,
  frdate,
  todate,
}) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.exchange.coinbase.com/products/${product_id}/candles`,
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      granularity: 60,
      start: frdate,
      end: todate,
    },
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error);
    });
};

export const getProcessCandles = async ({ product_id, frdate, todate }) => {
  return getCandlesFromCoinbase({ product_id, frdate, todate })
    .then((data) => {
      return data.map((candle) => {
        let [time, low, high, open, close, volume] = candle;

        return {
          time,
          low,
          high,
          open,
          close,
          volume,
        };
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getToken = async ({ key_name, key_secret }) => {
  const request_method = "GET";
  const url = "api.coinbase.com";
  const request_path = "/v2/accounts";

  const algorithm = "ES256";
  const uri = request_method + " " + url + request_path;

  return jwt.sign(
    {
      iss: "cdp",
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      sub: key_name,
      uri,
    },
    key_secret,
    {
      algorithm,
      header: {
        kid: key_name,
        nonce: crypto.randomBytes(16).toString("hex"),
      },
    }
  );
};
