import express from "express";
import { notifyCtrl } from "../controllers/notifications.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post('/notifies', verifyToken, notifyCtrl.createNotify);

router.get("/user/notifies", verifyToken, notifyCtrl.getAllNotifies);

router.delete('/notifies/:id', verifyToken, notifyCtrl.removeNotify);

router.patch("/notifies/isReadNotify/:notifyId", verifyToken, notifyCtrl.isReadNotify);

router.delete("/user/notifies", verifyToken, notifyCtrl.deleteAllUserNotifies);


export default router;
