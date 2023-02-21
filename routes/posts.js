import express from "express";
import { getFeedPosts, getUserPosts, likePost, unLikePost,deletePost } from "../controllers/posts.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

//READ
router.get("/posts", verifyToken, getFeedPosts);
router.get("/user/posts", verifyToken, getUserPosts );

//UPDATE
router.patch("/posts/:postId/like", verifyToken, likePost);
router.patch("/posts/:postId/unlike", verifyToken, unLikePost);

//DElETE
router.delete("/posts/:postId", verifyToken, deletePost );

export default router;
