import mongoose from "mongoose";
const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "RoomMessage" }],
    isPublic: { type: Boolean, default: true },
    maxMembers: { type: Number, default: 50 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;

