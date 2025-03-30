import express from "express";
import usersRoutes from "./users.js";
import assetsRoutes from "./assets.js";
import transactionsRoutes from "./transactions.js";
import categoriesRoutes from "./categories.js";
import listingsRoutes from "./listings.js";

const router = express.Router();

router.use("/api/users", usersRoutes);
router.use("/api/assets", assetsRoutes);
router.use("/api/transactions", transactionsRoutes);
router.use("/api/categories", categoriesRoutes);
router.use("/api/listings", listingsRoutes);

export default router;