import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

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
    // Fetch the user profile data when the component mounts
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

        // Convert ISO date string to "YYYY-MM-DD" format for the input field
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="w-24 h-24 rounded-full mb-2"
          />
          <h2 className="text-lg font-semibold">{formData.name}</h2>
          <p className="text-sm text-gray-600">{formData.email}</p>
        </div>
        <div className="space-y-4">
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={handleEdit}
            className={`px-4 py-2 rounded-md text-white ${
              isEditing ? "bg-gray-300" : "bg-black"
            }`}
            disabled={isEditing}
          >
            Edit
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md text-white bg-black"
            disabled={!isEditing}
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-md text-white bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
