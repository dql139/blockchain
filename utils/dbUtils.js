import db from "../models/db.js"

export const walletExist = async (walletAddress) => {
    const results = await db.query("SELECT id FROM users WHERE wallet_address = $1", [walletAddress]);
    return !!results.length;
}

export const categoryExist = async (categoryName) => {
    const results = await db.query("SELECT id FROM categories WHERE name = $1", [categoryName]);
    return !!results.length;
}

export const transactionExist = async (txHash) => {
    const results = await db.query("SELECT id FROM transactions WHERE tx_hash = $1", [txHash]);
    return !!results.length;
}

export const assetExist = async (token_address, token_id) => {
    const results = await db.query("SELECT id FROM assets WHERE token_address = $1 AND token_id = $2", [token_address, token_id]);
    return !!results.length;
}

export const listingExist = async (token_address, token_id) => {
    const query = `
        SELECT l.id
        FROM listings l
        JOIN assets a ON l.asset_id = a.id
        WHERE a.token_address = $1 AND a.token_id = $2
    `;
    const results = await db.query(query, [token_address, token_id]);
    return !!results.length;
}

export const categoriesList = async () => {
    return (await db.query("SELECT name FROM categories")).map(category => category.name);
}