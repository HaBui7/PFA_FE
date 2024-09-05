import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="text-lg font-semibold">LOGO</div>
          <nav className="flex space-x-6">
            <a href="#" className="text-gray-700 font-medium hover:text-blue-600">Section 1</a>
            <a href="#" className="text-gray-700 font-medium hover:text-blue-600">Section 1</a>
            <a href="#" className="text-gray-700 font-medium hover:text-blue-600">Section 1</a>
            <a href="#" className="text-gray-700 font-medium hover:text-blue-600">Section 1</a>
          </nav>
          <div className="relative">
            <button className="flex items-center space-x-2 focus:outline-none">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="rounded-full h-10 w-10"
              />
              <span className="text-gray-700 font-medium">RMIT UNIVERSITY</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg hidden">
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Log out</a>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Card */}
      <main className="flex-grow flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
          <div className="flex items-center mb-8">
            <img
              src="https://via.placeholder.com/80"
              alt="Profile"
              className="rounded-full h-20 w-20 mr-6"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Rmit University</h2>
              <p className="text-gray-600">rmituniversity@gmail.com</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">User name</label>
              <input
                type="text"
                placeholder="User Name"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2">Birthday</label>
              <input
                type="date"
                placeholder="Birthday"
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end mt-8 space-x-4">
            <button className="bg-white border border-black text-black px-6 py-2 rounded-full hover:bg-gray-100">
              Edit
            </button>
            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800">
              Save
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
