import express from "express";
import { body } from "express-validator";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  joinRoom,
  leaveRoom,
  deleteRoom,
  getRoomMessages,
} from "../controllers/rooms.controller.js";
import { sanitizePreservingCodeBlocks } from "../middlewares/sanitizePreservingCodeBlocks.js";

const router = express.Router();

router
  .route("/")
  .get(getAllRooms)
  .post(
    [
      body("name").trim().notEmpty(),
      body("description").optional().trim(),
      sanitizePreservingCodeBlocks,
    ],
    createRoom
  );

router
  .route("/:id")
  .get(getRoomById)
  .delete(deleteRoom);

router.post("/:id/join", joinRoom);
router.post("/:id/leave", leaveRoom);
router.get("/:id/messages", getRoomMessages);

export default router;

