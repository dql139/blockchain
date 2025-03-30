import db from "../models/db.js";
import { walletExist } from "../utils/dbUtils.js";

export const getUserInformation = async (req, res) => {
    try {
        const { wallet_address } = req.params;

        if(!await walletExist(wallet_address))
            return res.status(404).json({error: "Wallet address not found"});

        const query = `
            SELECT * FROM users
            WHERE wallet_address = $1
        `;
        const results = await db.query(query, [wallet_address]);

        res.json({results});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const addNewUser = async (req, res) => {
    try {
        const { wallet_address, username, email } = req.body;

        if(await walletExist(wallet_address))
            return res.status(409).json({error: "Wallet address already exists"});
        
        const query = `
            INSERT INTO users (wallet_address, username, email) VALUES
            ($1, $2, $3)
        `;
        const results = await db.query(query, [wallet_address, username, email]);

        res.json({"message": "User added successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const updateUserInformation = async (req, res) => {
    try {
        const { wallet_address } = req.params
        const { username, email } = req.body

        if(!await walletExist(wallet_address))
            return res.status(404).json({error: "Wallet address not found"});

        const query = `
            UPDATE users
            SET
                username = COALESCE(NULLIF($2, ''), username),
                email = COALESCE(NULLIF($3, ''), email)
            WHERE wallet_address = $1
            RETURNING *
        `
        const results = await db.query(query, [wallet_address, username, email]);

        res.json({results});
    } catch(err) {
        res.status(500).json({error: err.message})
    }
}