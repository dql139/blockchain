import db from "../models/db.js";
import { walletExist, transactionExist } from "../utils/dbUtils.js";

export const getUserTransactions = async (req, res) => {
    try {
        const { wallet_address } = req.params;

        if(!await walletExist(wallet_address))
            return res.status(404).json({error: "Wallet address not found"});

        const query = `
            SELECT t.id, ub.username AS buyer, ub.wallet_address AS buyer_wallet, us.username AS seller, us.wallet_address AS seller_wallet,
                    a.name AS asset_name, ENCODE(a.image, 'base64') as image, a.token_address, a.token_id, t.price, t.currency, t.tx_hash, t.timestamp
            FROM transactions t
            JOIN users ub ON t.buyer_id = ub.id
            JOIN users us ON t.seller_id = us.id
            JOIN assets a ON a.id = t.asset_id
            WHERE $1 in (ub.wallet_address, us.wallet_address)
        `;

        const results = await db.query(query, [wallet_address]);

        res.json({results});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const getTransactionDetails = async (req, res) => {
    try {
        const { tx_hash } = req.params;

        if(!await transactionExist(tx_hash))
            return res.status(404).json({error: "Transaction not found"});

        const query = `
            SELECT t.id, ub.username AS buyer, ub.wallet_address AS buyer_wallet, us.username AS seller, us.wallet_address AS seller_wallet,
                    a.name AS asset_name, ENCODE(a.image, 'base64') as image, a.token_address, a.token_id, t.price, t.currency, t.tx_hash, t.timestamp
            FROM transactions t
            JOIN users ub ON t.buyer_id = ub.id
            JOIN users us ON t.seller_id = us.id
            JOIN assets a ON a.id = t.asset_id
            WHERE tx_hash = $1
        `;
        const results = await db.query(query, [tx_hash]);

        res.json({results});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const getAllTransactions = async (req, res) => {
    try {
        const query = `
            SELECT t.id, ub.username AS buyer, ub.wallet_address AS buyer_wallet, us.username AS seller, us.wallet_address AS seller_wallet,
                    a.name AS asset_name, ENCODE(a.image, 'base64') as image, a.token_address, a.token_id, t.price, t.currency, t.tx_hash, t.timestamp
            FROM transactions t
            JOIN users ub ON t.buyer_id = ub.id
            JOIN users us ON t.seller_id = us.id
            JOIN assets a ON a.id = t.asset_id
        `;
        const results = await db.query(query);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const addNewTransaction = async (req, res) => {
    try {
        const { buyer_wallet, seller_wallet, token_address, token_id, price, currency, tx_hash } = req.body;

        if(await transactionExist(tx_hash))
            return res.status(409).json({error: "Transaction already exist"});

        const query = `
            INSERT INTO transactions (buyer_id, seller_id, asset_id, price, currency, tx_hash)
            SELECT u1.id, u2.id, a.id, $5, $6, $7
            FROM users u1, users u2, assets a
            WHERE u1.wallet_address = $1
            AND u2.wallet_address = $2
            AND a.token_address = $3
            AND a.token_id = $4
        `;
        const results = await db.query(query, [buyer_wallet, seller_wallet, token_address, token_id, price, currency, tx_hash]);

        res.json({"message": "Transaction recorded successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}