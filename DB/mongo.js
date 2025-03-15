import mongoose from "mongoose";
export function getMongoConnection() {
  const connectionString = `mongodb+srv://vikingobursatil:${process.env.MONGO_PASS}@marketdata.ktqhr.mongodb.net/crytos?retryWrites=true&w=majority&appName=MarketData`;
  return mongoose
    .connect(connectionString)
    .then((conn) => {
      return conn;
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
}
