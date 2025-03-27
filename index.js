import express from 'express';
import { getMongoConnection } from './DB/mongo.js';
import { CryptoDetails } from './DB/schemas.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/:ticket/:granularity", async (req, res) => {
    let { ticket, granularity } = req.params;
    let DBConnection = await getMongoConnection();
    let candles = await CryptoDetails.find({ product_id: ticket, granularity: parseInt(granularity) });
    res.json(candles);
    await DBConnection.connection.close();
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});