import express from "express";
import { commentCtrl } from "../controllers/comments.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();
router.get('/comments/:postId', verifyToken, commentCtrl.getPostComment);
router.get('/comments/:commentId/reply', verifyToken, commentCtrl.getCommentById);
router.post('/comments', verifyToken, commentCtrl.createComment);
router.patch('/comments/:commentId', verifyToken, commentCtrl.updateComment);
router.patch("/comments/:commentId/like", verifyToken, commentCtrl.likeComment);
router.patch("/comments/:commentId/unlike", verifyToken, commentCtrl.unLikeComment);
router.delete("/comments/:commentId", verifyToken, commentCtrl.deleteComment);
router.delete("/comments/:commentId/:id", verifyToken, commentCtrl.deleteReplyOfComment);

export default router