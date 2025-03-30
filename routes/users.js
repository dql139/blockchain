import express from "express";
import { getUserInformation, addNewUser, updateUserInformation } from "../controllers/users.js";

const router = express.Router();

router.get("/:wallet_address", getUserInformation);
router.post("/", addNewUser);
router.put("/:wallet_address", updateUserInformation);

export default router;