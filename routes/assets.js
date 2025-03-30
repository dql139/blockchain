import express from "express";
import upload from "../middlewares/upload.js";
import { getUserAssets, getAssetDetails, addNewAsset } from "../controllers/assets.js";

const router = express.Router();

router.get("/:wallet_address", getUserAssets);
router.get("/:token_address/:token_id", getAssetDetails);
router.post("/", upload.single("image"), addNewAsset);

export default router;