import db from "../models/db.js"
import { walletExist, assetExist, categoriesList } from "../utils/dbUtils.js";

export const getUserAssets = async (req, res) => {
    try {
        const { wallet_address } = req.params;

        if(!await walletExist(wallet_address))
            return res.status(404).json({error: "Wallet address not found"});

        const { category="", sort="created_at", order="desc", page=1, limit=10} = req.query;

        const categories = await categoriesList();
        if(!categories.includes(category) && category.length)
            return res.status(400).json({error: "Category not found"});

        if(!["name", "created_at"].includes(sort))
            return res.status(400).json({error: "Invalid sort option"});
        if(!["asc", "desc"].includes(order.toLowerCase()))
            return res.status(400).json({error: "Invalid sort order"});

        const offset = (page - 1) * limit;
        const query = `
            SELECT a.id, u.wallet_address as owner_wallet_address, a.name, a.description, ENCODE(a.image, 'base64') AS image,
                    c.name as category, a.token_address, a.token_id, a.blockchain, a.attributes, a.created_at
            FROM assets a
            JOIN users u ON a.owner_id = u.id
            JOIN categories c ON a.category_id = c.id
            WHERE u.wallet_address = $1
            ${category.length ? "AND c.name ILIKE $4" : ""}
            ORDER BY ${sort} ${order}
            LIMIT $2
            OFFSET $3
        `;
        const results = await db.query(query, [wallet_address, limit, offset, category]);
        
        res.json({page, results});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const getAssetDetails = async (req, res) => {
    try {
        const { token_address, token_id } = req.params;

        const query = `
            SELECT a.id, u.wallet_address as owner_wallet_address, a.name, a.description, ENCODE(a.image, 'base64') AS image,
                    c.name as category, a.token_address, a.token_id, a.blockchain, a.attributes, a.created_at
            FROM assets a
            JOIN users u ON a.owner_id = u.id
            JOIN categories c ON a.category_id = c.id
            WHERE a.token_address = $1 AND a.token_id = $2
        `;
        const results = await db.query(query, [token_address, token_id]);

        if(results.length)
            res.json({results});
        else
            res.status(404).json({error: "Asset not found"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const addNewAsset = async (req, res) => {
    try {
        const { wallet_address, name, description, category, token_address, token_id, blockchain, attributes } = req.body;
        const image = req.file.buffer;

        if(await assetExist(token_address, token_id))
            return res.status(409).json({error: "Asset already exist"});

        const query = `
            INSERT INTO assets (owner_id, name, description, image, category_id, token_address, token_id, blockchain, attributes)
            VALUES (
                (SELECT id FROM users WHERE wallet_address = $1),
                $2,
                $3,
                $4,
                (SELECT id FROM categories WHERE name = $5),
                $6,
                $7,
                $8,
                $9
            )
        `
        const results = await db.query(query, [wallet_address, name, description, image, category, token_address, token_id, blockchain, attributes]);

        res.json({"message": "Asset added successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}