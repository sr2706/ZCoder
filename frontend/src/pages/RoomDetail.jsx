import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "@clerk/clerk-react";
import { useSocket } from "../contexts/SocketContext";
import toast from "react-hot-toast";
import Spinner from "../components/spinner";
import formatDate from "../utils/formatDate";
import { FaUsers, FaPaperPlane, FaSignOutAlt } from "react-icons/fa";

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const socket = useSocket();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchRoom();
    fetchCurrentUser();
  }, [id]);

  useEffect(() => {
    if (socket && id && currentUserId) {
      socket.emit("join_room", id);

      socket.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

      socket.on("user_joined", (data) => {
        toast.success("A user joined the room");
      });

      socket.on("user_left", (data) => {
        toast.info("A user left the room");
      });

      return () => {
        socket.emit("leave_room", id);
        socket.off("receive_message");
        socket.off("user_joined");
        socket.off("user_left");
      };
    }
  }, [socket, id, currentUserId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setCurrentUserId(data._id);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rooms/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRoom(data);
        setMessages(data.messages || []);
        scrollToBottom();
      } else {
        toast.error("Room not found");
        navigate("/rooms");
      }
    } catch (error) {
      console.error("Error fetching room:", error);
      toast.error("Failed to load room");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    try {
      const userResponse = await fetch(`/api/users/${userId}`);
      const userData = await userResponse.json();

      const response = await fetch(`/api/rooms/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData._id }),
      });

      if (response.ok) {
        toast.success("Joined room successfully!");
        fetchRoom();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to join room");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error("Failed to join room");
    }
  };

  const handleLeaveRoom = async () => {
    try {
      const userResponse = await fetch(`/api/users/${userId}`);
      const userData = await userResponse.json();

      const response = await fetch(`/api/rooms/${id}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData._id }),
      });

      if (response.ok) {
        toast.success("Left room successfully!");
        navigate("/rooms");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to leave room");
      }
    } catch (error) {
      console.error("Error leaving room:", error);
      toast.error("Failed to leave room");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !currentUserId) return;

    try {
      socket.emit("send_message", {
        roomId: id,
        author: currentUserId,
        content: newMessage.trim(),
        messageType: "text",
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isMember = room && currentUserId && room.members.some((m) => m._id === currentUserId || m.toString() === currentUserId);

  if (loading) {
    return <Spinner />;
  }

  if (!room) {
    return null;
  }

  return (
    <>
      <div className="w-full flex justify-center bg-background drop-shadow-2xl">
        <Header />
      </div>
      <div className="min-h-screen bg-background text-primary_text flex flex-col">
        <div className="container mx-auto p-4 flex-1 flex flex-col">
          {/* Room Header */}
          <div className="bg-background p-4 rounded-lg shadow-lg mb-4 border border-secondary/80">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">{room.name}</h1>
                <p className="text-secondary_text mb-2">{room.description || "No description"}</p>
                <div className="flex items-center text-sm text-secondary_text">
                  <FaUsers className="mr-1" />
                  <span>{room.members?.length || 0} members</span>
                </div>
              </div>
              <div className="flex space-x-2">
                {!isMember && userId && (
                  <button
                    onClick={handleJoinRoom}
                    className="btn btn-primary"
                  >
                    Join Room
                  </button>
                )}
                {isMember && userId && (
                  <button
                    onClick={handleLeaveRoom}
                    className="btn btn-error flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Leave
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col bg-background rounded-lg shadow-lg border border-secondary/80">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-secondary_text py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.author._id === currentUserId ||
                      message.author.toString() === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                        message.author._id === currentUserId ||
                        message.author.toString() === currentUserId
                          ? "bg-primary text-primary_text"
                          : "bg-secondary/20 text-primary_text"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <Link
                          to={`/${message.author.clerkId}`}
                          className="font-semibold hover:underline text-sm"
                        >
                          {message.author.name}
                        </Link>
                        <span className="ml-2 text-xs opacity-70">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {isMember && (
              <form onSubmit={handleSendMessage} className="p-4 border-t border-secondary/80">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center"
                    disabled={!newMessage.trim()}
                  >
                    <FaPaperPlane className="mr-2" />
                    Send
                  </button>
                </div>
              </form>
            )}
            {!isMember && (
              <div className="p-4 border-t border-secondary/80 text-center text-secondary_text">
                Join the room to send messages
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDetailPage;

