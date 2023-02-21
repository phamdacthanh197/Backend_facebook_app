import express from "express";
import { storiesCtrl } from "../controllers/stories.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get('/stories', verifyToken, storiesCtrl.getAllStory);
router.get('/user/stories', verifyToken, storiesCtrl.getUserStories);

export default router;