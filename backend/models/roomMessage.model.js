import mongoose from "mongoose";
const { Schema } = mongoose;

const roomMessageSchema = new Schema(
  {
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    messageType: { type: String, enum: ["text", "code", "system"], default: "text" },
  },
  { timestamps: true }
);

const RoomMessage = mongoose.model("RoomMessage", roomMessageSchema);

export default RoomMessage;

