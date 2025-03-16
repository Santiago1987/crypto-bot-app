import { getMongoConnection, getLocalMongoConnection } from "./mongo.js"
import { Crypto, CryptoDetails } from "./schemas.js"

export const createCrypto = async ({ cryptoName, product_id }) => {
    let DBConnection = await getMongoConnection();
    const crypto = new Crypto({
        crypto: cryptoName,
        product_id,
    });
    let res = await crypto.save();
    await DBConnection.connection.close();
    return res;
}

export const createLocalCrypto = async ({ cryptoName, product_id }) => {
    let DBConnection = await getLocalMongoConnection();
    const crypto = new Crypto({
        crypto: cryptoName,
        product_id,
    });
    let res = await crypto.save();
    await DBConnection.connection.close();
    return res;
}

export const saveCandles = async ({ product_id, granularity, candles }) => {
    let DBConnection = await getMongoConnection();

    try {
        for (let i = 0; i < candles.length; i++) {
            let cryptoDetail = new CryptoDetails({
                product_id,
                granularity,
                ...candles[i]
            })
            await cryptoDetail.save();
        }
    } catch (error) {
        console.log(error)
        throw new Error(error)

    } finally {
        await DBConnection.connection.close()
    }
    return candles.length
}

export const saveLocalCandles = async ({ product_id, granularity, candles }) => {
    let DBConnection = await getLocalMongoConnection();

    try {
        for (let i = 0; i < candles.length; i++) {
            let cryptoDetail = new CryptoDetails({
                product_id,
                granularity,
                ...candles[i]
            })
            await cryptoDetail.save();
        }
    } catch (error) {
        console.log(error)
        throw new Error(error)

    } finally {
        await DBConnection.connection.close()
    }
    return candles.length
}

export const restartCandles = async ({ product_id }) => {
    let DBConnection = await getMongoConnection();
    return Crypto.findOneAndUpdate(
        { product_id },
        { $set: { minutes: [] } },
        { new: true }
    ).finally(() =>
        DBConnection.connection.close()
    )
}
