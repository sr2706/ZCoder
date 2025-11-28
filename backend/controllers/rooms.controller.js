import Room from "../models/room.model.js";
import RoomMessage from "../models/roomMessage.model.js";
import User from "../models/user.model.js";

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { name, description, isPublic, maxMembers, tags, creator } = req.body;

    const newRoom = new Room({
      name,
      description,
      creator,
      isPublic: isPublic !== undefined ? isPublic : true,
      maxMembers: maxMembers || 50,
      tags: tags || [],
      members: [creator], // Creator is automatically a member
    });

    const savedRoom = await newRoom.save();
    const populatedRoom = await Room.findById(savedRoom._id)
      .populate("creator", "name clerkId avatar")
      .populate("members", "name clerkId avatar");

    res.status(201).json(populatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const { search = "", tags = "", page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {
      isPublic: true,
      ...(search && { name: new RegExp(search, "i") }),
      ...(tags && { tags: { $in: tags.split(",") } }),
    };

    const rooms = await Room.find(filter)
      .populate("creator", "name clerkId avatar")
      .populate("members", "name clerkId avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalRooms = await Room.countDocuments(filter);
    const totalPages = Math.ceil(totalRooms / limit);

    res.status(200).json({ rooms, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get room by ID
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("creator", "name clerkId avatar")
      .populate("members", "name clerkId avatar")
      .populate({
        path: "messages",
        populate: { path: "author", select: "name clerkId avatar" },
        options: { sort: { createdAt: -1 }, limit: 100 },
      });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a room
export const joinRoom = async (req, res) => {
  try {
    const { userId } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.members.length >= room.maxMembers) {
      return res.status(400).json({ message: "Room is full" });
    }

    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    const populatedRoom = await Room.findById(room._id)
      .populate("creator", "name clerkId avatar")
      .populate("members", "name clerkId avatar");

    res.status(200).json(populatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave a room
export const leaveRoom = async (req, res) => {
  try {
    const { userId } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Creator cannot leave the room
    if (room.creator.toString() === userId) {
      return res.status(400).json({ message: "Creator cannot leave the room" });
    }

    room.members = room.members.filter(
      (id) => id.toString() !== userId
    );
    await room.save();

    res.status(200).json({ message: "Left room successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a room
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Delete all messages in the room
    await RoomMessage.deleteMany({ roomId: room._id });

    // Delete the room
    await room.deleteOne();

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get room messages
export const getRoomMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await RoomMessage.find({ roomId: req.params.id })
      .populate("author", "name clerkId avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(messages.reverse()); // Reverse to show oldest first
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

