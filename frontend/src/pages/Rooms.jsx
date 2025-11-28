import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "@clerk/clerk-react";
import { useSocket } from "../contexts/SocketContext";
import toast from "react-hot-toast";
import Spinner from "../components/spinner";
import { FaPlus, FaUsers, FaHashtag } from "react-icons/fa";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    tags: "",
    isPublic: true,
    maxMembers: 50,
  });
  const { userId } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    fetchRooms();
  }, [search, tags, page]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(search && { search }),
        ...(tags && { tags }),
      });
      const response = await fetch(`/api/rooms?${params}`);
      const data = await response.json();
      setRooms(data.rooms || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await fetch(`/api/users/${userId}`);
      const userData = await userResponse.json();
      
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRoom,
          creator: userData._id,
          tags: newRoom.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        const room = await response.json();
        toast.success("Room created successfully!");
        setShowCreateModal(false);
        setNewRoom({
          name: "",
          description: "",
          tags: "",
          isPublic: true,
          maxMembers: 50,
        });
        fetchRooms();
      } else {
        toast.error("Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room");
    }
  };

  if (loading && rooms.length === 0) {
    return <Spinner />;
  }

  return (
    <>
      <div className="w-full flex justify-center bg-background drop-shadow-2xl">
        <Header />
      </div>
      <div className="min-h-screen bg-background text-primary_text p-4">
        <div className="container mx-auto">
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 lg:mb-0">Interactive Rooms</h1>
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 w-full lg:w-auto">
              <input
                type="text"
                className="input input-bordered w-full lg:w-auto"
                placeholder="Search rooms"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <input
                type="text"
                className="input input-bordered w-full lg:w-auto"
                placeholder="Filter by tags (comma-separated)"
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value);
                  setPage(1);
                }}
              />
              {userId && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary text-primary_text hover:bg-border hover:text-primary px-4 py-2 rounded-lg flex items-center"
                >
                  <FaPlus className="mr-2" /> Create Room
                </button>
              )}
            </div>
          </header>

          {loading && (
            <div className="self-center w-10 h-10 border-4 border-primary border-dashed rounded-full animate-spin m-2"></div>
          )}

          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <Link
                  key={room._id}
                  to={`/rooms/${room._id}`}
                  className="bg-background p-6 rounded-lg shadow-xl border border-secondary/80 hover:bg-primary/10 transition-all duration-200"
                >
                  <h2 className="text-xl font-semibold text-primary_text mb-2">
                    {room.name}
                  </h2>
                  <p className="text-secondary_text mb-4 line-clamp-2">
                    {room.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      <span>{room.members?.length || 0} members</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-secondary_text">
                        {room.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>
                  {room.tags && room.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {room.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary_text/70 px-2 py-1 rounded-full text-xs flex items-center"
                        >
                          <FaHashtag className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {rooms.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-secondary_text">No rooms found. Create one to get started!</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 mx-1 bg-primary text-primary_text rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-1">
              Page {totalPages === 0 ? "0" : page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
              className="px-4 py-2 mx-1 bg-primary text-primary_text rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Room</h2>
            <form onSubmit={handleCreateRoom}>
              <div className="mb-4">
                <label className="block mb-2">Room Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={newRoom.description}
                  onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newRoom.tags}
                  onChange={(e) => setNewRoom({ ...newRoom, tags: e.target.value })}
                  placeholder="javascript, react, algorithms"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Max Members</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={newRoom.maxMembers}
                  onChange={(e) => setNewRoom({ ...newRoom, maxMembers: parseInt(e.target.value) })}
                  min="2"
                  max="100"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="checkbox mr-2"
                    checked={newRoom.isPublic}
                    onChange={(e) => setNewRoom({ ...newRoom, isPublic: e.target.checked })}
                  />
                  Public Room
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomsPage;

