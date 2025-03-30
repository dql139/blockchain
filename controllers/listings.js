import db from "../models/db.js";
import { listingExist, categoriesList } from "../utils/dbUtils.js";

export const addNewListing = async (req, res) => {
    try {
        const { token_address, token_id, wallet_address, price, currency } = req.body;

        if(await listingExist(token_address, token_id))
            return res.status(409).json({error: "This asset is already listed"});

        const query = `
            INSERT INTO listings (assets_id, seller_id, price, currency)
            SELECT a.id, u.id, $4, $5
            FROM assets a, users u
            WHERE a.token_address = $1
            AND a.token_id = $2
            AND u.wallet_address = $3
        `;
        const results = await db.query(query, [token_address, token_id, wallet_address, price, currency]);

        res.json({"message": "Listing added successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const getListings = async (req, res) => {
    try {
        const { search="", category="", min_price=0, max_price=2147483648, sort="created_at", order="desc", page=1, limit=10 } = req.query;

        const categories = await categoriesList();
        if(category.length && !categories.includes(category))
            return res.status(404).json({error: "Category not found"});

        if(max_price < min_price)
            return res.status(400).json({error: "Max price cannot be less than min price"});

        if(!["price", "created_at"].includes(sort))
            return res.status(400).json({error: "Invalid sort option"});
        if(!["asc", "desc"].includes(order.toLowerCase()))
            return res.status(400).json({error: "Invalid sort order"});

        const offset = (page - 1) * limit;

        const searchQuery = search ? `%${search}%` : "%";
        const queryParams = [searchQuery, min_price, max_price, limit, offset];
        let query = `
            SELECT l.id, a.name, a.description, ENCODE(a.image, 'base64') as image, c.name as category, a.token_address, a.token_id, u.username, u.wallet_address, l.price, l.currency, l.created_at
            FROM listings l
            JOIN assets a ON a.id = l.asset_id
            JOIN users u ON u.id = l.seller_id
            JOIN categories c ON c.id = a.category_id
            WHERE a.name ILIKE $1
            AND l.price >= $2
            AND l.price <= $3
        `;
        if(category) {
            query += " AND c.name = $6";
            queryParams.push(category);
        }
        query += ` ORDER BY l.${sort} ${order} LIMIT $4 OFFSET $5`;
        const results = await db.query(query, queryParams);

        res.json({results});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const getListingDetails = async (req, res) => {
    try {
        const { token_address, token_id } = req.params;

        if(!await listingExist(token_address, token_id))
            return res.status(404).json({error: "Listing not found"});
        

        const query = `
            SELECT l.id, a.name, a.description, ENCODE(a.image, 'base64') as image, c.name as category, a.token_address, a.token_id, u.username, u.wallet_address, l.price, l.currency, l.created_at
            FROM listings l
            JOIN assets a ON a.id = l.asset_id
            JOIN users u ON u.id = l.seller_id
            JOIN categories c ON c.id = a.category_id
            WHERE a.token_address = $1 AND a.token_id = $2
        `;
        const results = await db.query(query, [token_address, token_id]);

        res.json({results});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const removeListing = async (req, res) => {
    try {
        const { token_address, token_id } = req.params;

        if(!await listingExist(token_address, token_id))
            return res.status(404).json({error: "Listing not found"});

        const query = `
            DELETE FROM listings l
            USING assets a
            WHERE a.id = l.asset_id
            AND a.token_address = $1
            AND a.token_id = $2
        `;
        const results = await db.query(query, [token_address, token_id]);

        res.json({"message": "Listing deleted successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}