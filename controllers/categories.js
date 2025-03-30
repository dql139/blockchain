import db from "../models/db.js";
import { categoryExist } from "../utils/dbUtils.js";

export const getAllCategories = async (req, res) => {
    try {
        const query = `
            SELECT * FROM categories
        `;
        const results = await db.query(query);

        res.json({results});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const addNewCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if(await categoryExist(name))
            return res.status(409).json({error: "Category already exist"});

        const query = `
            INSERT INTO categories (name) VALUES ($1)
        `;
        const results = await db.query(query, [name]);

        res.json({"message": "Category added successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}