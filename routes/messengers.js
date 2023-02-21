import express from "express";
import { messageCtrl } from "../controllers/messengers.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router()

router.post("/messages", verifyToken, messageCtrl.createMessage);
router.get("/messages/:recipient", verifyToken, messageCtrl.getMessages);
router.get("/conversations", verifyToken, messageCtrl.getConversations);
router.get("/latestMessage", verifyToken, messageCtrl.getLatestMessage);

export default router;
