import RoomMessage from "../models/roomMessage.model.js";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import BlogPost from "../models/blogpost.model.js";
import { addNotification } from "../controllers/users.controller.js";

const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Room-related events
    socket.on("join_room", async (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      
      // Notify others in the room
      socket.to(roomId).emit("user_joined", { socketId: socket.id });
    });

    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
      
      socket.to(roomId).emit("user_left", { socketId: socket.id });
    });

    socket.on("send_message", async (data) => {
      try {
        const { roomId, author, content, messageType } = data;

        const newMessage = new RoomMessage({
          roomId,
          author,
          content,
          messageType: messageType || "text",
        });

        const savedMessage = await newMessage.save();
        const populatedMessage = await RoomMessage.findById(savedMessage._id)
          .populate("author", "name clerkId avatar");

        // Update room's messages array
        await Room.findByIdAndUpdate(roomId, {
          $push: { messages: savedMessage._id },
        });

        // Broadcast to all users in the room
        io.to(roomId).emit("receive_message", populatedMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Real-time blog post updates
    socket.on("join_blog_post", (postId) => {
      socket.join(`blog_post_${postId}`);
    });

    socket.on("leave_blog_post", (postId) => {
      socket.leave(`blog_post_${postId}`);
    });

    // Real-time comment updates
    socket.on("new_comment", async (data) => {
      try {
        const { postId, commentId } = data;
        const comment = await Comment.findById(commentId)
          .populate("author", "name clerkId avatar");

        if (comment) {
          io.to(`blog_post_${postId}`).emit("comment_added", comment);
        }
      } catch (error) {
        console.error("Error broadcasting comment:", error);
      }
    });

    // Real-time vote updates
    socket.on("vote_update", async (data) => {
      try {
        const { postId, type } = data; // type: 'upvote' or 'downvote'
        const post = await BlogPost.findById(postId);
        
        if (post) {
          io.to(`blog_post_${postId}`).emit("vote_changed", {
            postId,
            upvotes: post.upvotes.length,
            downvotes: post.downvotes.length,
            type,
          });
        }
      } catch (error) {
        console.error("Error broadcasting vote:", error);
      }
    });

    // Real-time notification updates
    socket.on("subscribe_notifications", (userId) => {
      socket.join(`notifications_${userId}`);
    });

    socket.on("unsubscribe_notifications", (userId) => {
      socket.leave(`notifications_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Helper function to emit notifications
  const emitNotification = (userId, notification) => {
    io.to(`notifications_${userId}`).emit("new_notification", notification);
  };

  return { emitNotification };
};

export default setupSocketIO;

