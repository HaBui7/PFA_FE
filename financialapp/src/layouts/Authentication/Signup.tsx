import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  // State to hold form data and messages
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [message, setMessage] = useState("");

  // Validate the user's input based on the backend requirements
  const validateInput = () => {
    if (name.length < 5 || name.length > 50) {
      setMessage("Name must be between 5 and 50 characters.");
      return false;
    }
    if (email.length < 10 || email.length > 50 || !email.includes("@")) {
      setMessage("Email must be between 10 and 50 characters and include '@'.");
      return false;
    }
    if (password.length < 5) {
      setMessage("Password must be at least 5 characters long.");
      return false;
    }
    if (!birthday) {
      setMessage("Please enter your birthday.");
      return false;
    }

    // Validate that the birthday is not later than today
    const selectedDate = new Date(birthday);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure that today has no time part for comparison
    if (selectedDate > today) {
      setMessage("Birthday is not appropriate.");
      return false;
    }

    return true;
  };
  // Format the birthday to YYYY-MM-DD
  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // Handle the signup submission
  const handleSignup = async () => {
    if (!validateInput()) return;

    try {
      const formattedBirthday = formatDate(birthday);

      // Send a POST request to the register route
      const response = await axios.post("http://localhost:3000/api/register", {
        name,
        email,
        password,
        birthday: formattedBirthday, // Use formatted birthday
      });

      if (response.data.token) {
        localStorage.setItem("auth", response.data.token);
        localStorage.setItem("username", response.data.data.user.name); // Store the username
        setMessage("Signup successful!");
        navigate("/");
      } else {
        setMessage("Signup failed. Please try again.");
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Error caught. Please try again."
      );
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
          Already have an account?,{" "}
          <a href="/login" color="blue">
            Sign in
          </a>
        </div>
      </div>

      <div className="columns-2 grid-cols-1 gap-x-6 gap-y-8 max-md:columns-1">
        <div>
          <div className="py-5 pl-20">
            <label
              htmlFor="name"
              className="text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="my-3">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="pl-5 content-center block w-4/5 rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                type="email"
                autoComplete="email"
                className="pl-5 content-center block w-4/5 rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
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
                className="pl-5 items-center block w-4/5 rounded-full border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <label
              htmlFor="birthday"
              className="my-3 block text-sm font-medium leading-6 text-gray-900"
            >
              Birthday
            </label>
            <div className="my-3">
              <input
                type="date"
                id="birthday"
                name="birthday"
                className="pl-5 items-center  block w-4/5 rounded-full border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
            <div className="">
              <input
                type="checkbox"
                name=""
                id=""
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ms-2 text-sm pb-5 text-gray-900 dark:text-gray-300">
                I agree to the terms & policy
              </label>
            </div>
            <div className="">
              <button
                type="button"
                onClick={handleSignup}
                className="text-white bg-neutral-800 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-4/5 my-5"
              >
                Create your account
              </button>
            </div>
            {message && (
              <div className="text-center text-sm font-medium text-red-500">
                {message}
              </div>
            )}
          </div>
          <img
            className="w-9/12 hidden md:flex"
            src="/src/assets/loginimage.svg"
            alt="Hello"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
