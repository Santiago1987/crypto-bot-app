import { Schema, model } from "mongoose";

const cryptoSchema = new Schema({
  crypto: { type: String, required: true },
  product_id: { type: String, required: true },
});

cryptoSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Crypto = model("Cryptos", cryptoSchema);


const cryptoDetailsSchema = new Schema({
  product_id: { type: String, required: true },
  granularity: { type: Number, required: true },
  time: { type: Number, required: true },
  low: { type: Number, required: true },
  high: { type: Number, required: true },
  open: { type: Number, required: true },
  close: { type: Number, required: true },
  volume: { type: Number, required: true },
},
  {
    toJSON: {
      transform: (_document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
      },
    }
  });

export const CryptoDetails = model("CryptoDetails", cryptoDetailsSchema);