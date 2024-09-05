import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.webp";
import { Menu, X, ChevronDown } from "lucide-react";
import avatar from "@/assets/avatar.jpg";
import axios from "axios";

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Get current path

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`, // Assuming you use JWT tokens
          },
        });
        const userBalance = response.data.data.user.currentBalance;
        localStorage.setItem("balance", userBalance);
        setBalance(userBalance);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user current balance:", err);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth");
    const storedUsername = localStorage.getItem("username");
    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");
  };
  if (loading) {
    return <p>Loading...</p>;
  }
  // Define a function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <img src={logo} alt="Fintrack Logo" className="h-10 mr-2" />
      </div>
      <div className="hidden md:flex space-x-8">
        <Link
          to="/dashboard"
          className={`text-black hover:text-gray-600 ${
            isActive("/dashboard") ? "text-blue-500" : ""
          }`}
        >
          Dashboard
          {isActive("/dashboard") && (
            <div className="h-1 bg-blue-500 rounded mt-1"></div>
          )}
        </Link>
        <Link
          to="/transaction"
          className={`text-black hover:text-gray-600 ${
            isActive("/transaction") ? "text-blue-500" : ""
          }`}
        >
          Transaction
          {isActive("/transaction") && (
            <div className="h-1 bg-blue-500 rounded mt-1"></div>
          )}
        </Link>
        <Link
          to="/goals"
          className={`text-black hover:text-gray-600 ${
            isActive("/goals") ? "text-blue-500" : ""
          }`}
        >
          Goals
          {isActive("/goals") && (
            <div className="h-1 bg-blue-500 rounded mt-1"></div>
          )}
        </Link>
        <Link
          to="/budgeting"
          className={`text-black hover:text-gray-600 ${
            isActive("/budgeting") ? "text-blue-500" : ""
          }`}
        >
          Budget
          {isActive("/budgeting") && (
            <div className="h-1 bg-blue-500 rounded mt-1"></div>
          )}
        </Link>
        <Link
          to="/chatbot"
          className={`text-black hover:text-gray-600 ${
            isActive("/chatbot") ? "text-blue-500" : ""
          }`}
        >
          Assistant
          <span className="ml-1 bg-aiLogo text-aiLogo-foreground text-xs px-1 rounded">
            AI
          </span>
          {isActive("/chatbot") && (
            <div className="h-1 bg-blue-500 rounded mt-1"></div>
          )}
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {/* <div className="underline"> Current Balance: {balance}</div> */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img
                src={avatar}
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
              />
              <span className="text-black font-medium">{username}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-black hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 border border-greenButton bg-whiteButton text-whiteButton-foreground rounded-lg shadow-lg hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-greenButton text-greenButton-foreground rounded-lg shadow-lg hover:bg-gray-500"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
      <div className="md:hidden">
        <button onClick={() => setDrawerOpen(!drawerOpen)}>
          {drawerOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 flex flex-col items-center justify-between p-4 bg-white z-50 md:hidden">
          <div className="w-full flex justify-end">
            <button onClick={() => setDrawerOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <Link
              to="/dashboard"
              className={`text-black text-lg hover:text-gray-600 ${
                isActive("/dashboard") ? "text-blue-500" : ""
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              Dashboard
              {isActive("/dashboard") && (
                <div className="h-1 bg-blue-500 rounded mt-1"></div>
              )}
            </Link>
            <Link
              to="/transaction"
              className={`text-black text-lg hover:text-gray-600 ${
                isActive("/transaction") ? "text-blue-500" : ""
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              Transaction
              {isActive("/transaction") && (
                <div className="h-1 bg-blue-500 rounded mt-1"></div>
              )}
            </Link>
            <Link
              to="/goals"
              className={`text-black text-lg hover:text-gray-600 ${
                isActive("/goals") ? "text-blue-500" : ""
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              Goals
              {isActive("/goals") && (
                <div className="h-1 bg-blue-500 rounded mt-1"></div>
              )}
            </Link>
            <Link
              to="/budgeting"
              className={`text-black text-lg hover:text-gray-600 ${
                isActive("/budgeting") ? "text-blue-500" : ""
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              Budget
              {isActive("/budgeting") && (
                <div className="h-1 bg-blue-500 rounded mt-1"></div>
              )}
            </Link>
            <Link
              to="/chatbot"
              className={`text-black text-lg hover:text-gray-600 ${
                isActive("/chatbot") ? "text-blue-500" : ""
              }`}
              onClick={() => setDrawerOpen(false)}
            >
              Assistant
              <span className="ml-1 bg-aiLogo text-aiLogo-foreground text-xs px-1 rounded-lg">
                AI
              </span>
              {isActive("/chatbot") && (
                <div className="h-1 bg-blue-500 rounded mt-1"></div>
              )}
            </Link>
          </div>
          <div className="w-full flex flex-col items-center space-y-4">
            {isLoggedIn ? (
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="h-12 w-12 rounded-full"
                />
                <span className="text-black font-medium">{username}</span>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-greenButton bg-whiteButton text-whiteButton-foreground rounded-lg hover:bg-gray-100 w-full text-center"
                  onClick={() => setDrawerOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-greenButton text-greenButton-foreground rounded-lg hover:bg-gray-500 w-full text-center"
                  onClick={() => setDrawerOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
