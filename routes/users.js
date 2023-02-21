import express from "express";
import {
    getUserDetail,
    getFriendDetail,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken} from "../middlewares/auth.js";

const router = express.Router();

// READ
router.get("/user", verifyToken, getUserDetail);
router.get("/user/friends/:friendId", verifyToken, getFriendDetail);

//UPDATE
router.patch("/user/friends/:friendId", verifyToken, addRemoveFriend);

export default router;

