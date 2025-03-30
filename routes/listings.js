import express from "express";
import { addNewListing, getListingDetails, getListings, removeListing } from "../controllers/listings.js";

const router = express.Router();

router.post("/", addNewListing);
router.get("/", getListings);
router.get("/:token_address/:token_id", getListingDetails);
router.delete("/:token_address/:token_id", removeListing);

export default router;