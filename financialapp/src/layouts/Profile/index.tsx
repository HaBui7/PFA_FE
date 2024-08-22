import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/confirmModal";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    birthday: "",
    initialBalance: "",
    currentBalance: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`, // Assuming you use JWT tokens
            },
          }
        );

        const userData = response.data.data.user;

        const formattedBirthday = userData.birthday.split("T")[0];

        setFormData({
          ...userData,
          birthday: formattedBirthday, // Set the formatted birthday
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:3000/api/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      });
      localStorage.setItem("username", formData.name);
      window.location.reload();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating user profile:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:3000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      });
      localStorage.removeItem("auth"); // Store JWT token
      localStorage.removeItem("username");
      navigate("/login");
    } catch (err) {
      console.error("Error deleting user profile:", err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen px-8 sm:px-12 lg:px-16 mt-10">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="w-24 h-24 rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-semibold">{formData.name}</h2>
            <p className="text-gray-600">{formData.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Birthday
            </label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Initial Balance
            </label>
            <input
              type="number"
              name="initialBalance"
              value={formData.initialBalance}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Balance
            </label>
            <input
              type="number"
              name="currentBalance"
              value={formData.currentBalance}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleEdit}
            className={`px-6 py-3 rounded-md text-black border-2 border-black mr-4 ${
              isEditing ? "bg-gray-300" : "bg-white"
            }`}
            disabled={isEditing}
          >
            Edit
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-3 rounded-md text-white bg-black mr-4"
            disabled={!isEditing}
          >
            Save
          </Button>
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-6 py-3 rounded-md text-white bg-red-600"
          >
            Delete
          </Button>
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            title="Delete Profile"
            message="Are you sure you want to delete your profile? This action cannot be undone."
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
