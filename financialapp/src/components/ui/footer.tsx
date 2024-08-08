import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import logo from "@/assets/logo.webp";

const Footer = () => {
  return (
    <footer className="bg-white py-8 ">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <Link to="/about" className=" text-footer-foreground">
            About us
          </Link>
          <Link to="/discover" className=" teext-">
            Discover
          </Link>
          <Link to="/explore" className=" text-footer-foreground">
            Explore
          </Link>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook className=" text-footer-foreground w-6 h-6" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className=" text-footer-foreground w-6 h-6" />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className=" text-footer-foreground w-6 h-6" />
          </a>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 flex flex-col md:flex-row justify-between items-center border-t pt-6">
        <p className="text-gray-600">© 2024 Fintrack. All rights reserved.</p>
        <img src={logo} alt="Fintrack Logo" className="h-10 mr-2" />
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/terms" className="text-gray-600 hover:text-gray-800">
            Terms of Service
          </Link>
          <Link to="/privacy" className="text-gray-600 hover:text-gray-800">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
