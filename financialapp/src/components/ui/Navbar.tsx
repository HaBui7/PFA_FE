import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.webp";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <img src={logo} alt="Fintrack Logo" className="h-10 mr-2" />
      </div>
      <div className="hidden md:flex space-x-8">
        <Link to="/transaction" className="text-black hover:text-gray-600">
          Transaction
        </Link>
        <Link to="/goals" className="text-black hover:text-gray-600">
          Goals
        </Link>
        <Link to="/chatbot" className="text-black hover:text-gray-600">
          Assistant
          <span className="ml-1 bg-aiLogo text-aiLogo-foreground text-xs px-1 rounded">
            AI
          </span>
        </Link>
      </div>
      <div className="hidden md:flex space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 border border-greenButton bg-whiteButton text-whiteButton-foreground rounded-lg shadow-lg hover:bg-gray-100"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-greenButton text-greenButton-foreground rounded-lg shadow-lg  hover:bg-gray-500"
        >
          Sign up
        </Link>
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
              to="/transaction"
              className="text-black text-lg hover:text-gray-600"
              onClick={() => setDrawerOpen(false)}
            >
              Transaction
            </Link>
            <Link
              to="/goals"
              className="text-black text-lg hover:text-gray-600"
              onClick={() => setDrawerOpen(false)}
            >
              Goals
            </Link>
            <Link
              to="/chatbot"
              className="text-black text-lg hover:text-gray-600"
              onClick={() => setDrawerOpen(false)}
            >
              Assistant
              <span className="ml-1 bg-aiLogo text-aiLogo-foreground text-xs px-1 rounded-lg ">
                AI
              </span>
            </Link>
          </div>
          <div className="w-full flex flex-col items-center space-y-4">
            <Link
              to="/login"
              className="px-4 py-2 border border-greenButton bg-whiteButton text-whiteButton-foreground  rounded-lg  hover:bg-gray-100 w-full text-center"
              onClick={() => setDrawerOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-greenButton text-greenButton-foreground rounded hover:bg-gray-500 w-full text-center"
              onClick={() => setDrawerOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
