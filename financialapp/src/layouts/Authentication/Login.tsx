import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // State to hold the form data and success message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handle the login submission
  const handleLogin = async () => {
    try {
      // Send a POST request to the login route
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      // If login is successful, store the token and navigate
      if (response.data.token) {
        localStorage.setItem("auth", response.data.token); // Store JWT token
        localStorage.setItem("username", response.data.data.user.name);
        setMessage("Login successful!"); // Set success message
        navigate("/"); // Navigate to home page
      }
    } catch (error) {
      setMessage("Login failed. Please check your credentials."); // Set error message
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center  p-10">
        <img className="h-12" src="/src/assets/logo.webp" alt="description" />
      </div>
      <div className="pl-20">
        <p className="mt-10 text-3xl leading-8 text-black-600 font-bold">
          WELCOME!
        </p>
        <div className="py-0 mt-1 text-md leading-8 text-gray-600 font-bold">
          New here?{" "}
          <Link to="/signup" className="text-black font-bold">
            Create your account
          </Link>
        </div>
      </div>

      <div className="columns-2 grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div>
          <div className="py-5 pl-20">
            <label
              htmlFor="Email"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="my-3">
              <input
                id="Email"
                name="Email"
                type="text"
                autoComplete="given-name"
                className=" content-center block w-4/5 rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
              />
              <label
                htmlFor="password"
                className="my-3 block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="my-3">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="items-center block w-4/5 rounded-full border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update password state
                />
              </div>
              <div className="flex columns-2">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 rounded-full"
                />
                <label className="ms-2 text-sm pb-5 text-gray-900 dark:text-gray-300">
                  I agree to the terms & policy
                </label>
                <a
                  href=""
                  className="ml-20 text-sm pb-5 text-gray-900 dark:text-gray-300 pl-20 "
                >
                  Forget password?
                </a>
              </div>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleLogin} // Call handleLogin on button click
                  className="text-white  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-4/5  bg-neutral-800"
                >
                  Sign In
                </button>
              </div>
            </div>
            {message && (
              <div className="text-center text-sm font-medium text-red-500">
                {message}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <img
              className="w-7/12"
              src="/src/assets/loginimage.svg"
              alt="Hello"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
