import express from "express";
import { getAllTransactions, getTransactionDetails, getUserTransactions } from "../controllers/transactions.js";

const router = express.Router();

router.get("/user/:wallet_address", getUserTransactions);
router.get("/:tx_hash", getTransactionDetails)
router.get("/", getAllTransactions);


export default router;