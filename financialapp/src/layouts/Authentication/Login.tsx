import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulate authentication
    localStorage.setItem("auth", "true");
    navigate("/");
  };

  return (
    <div>
      <div className="flex justify-center items-center  p-10">
        <img className="h-12" src="/src/assets/logo.webp" alt="description" />
      </div>
      <div className="pl-20">
        <p className="font- mt-10 text-3xl leading-8 text-black-600 	font-bold ;">
          WELCOME !
        </p>
        <div className=" py-0 mt-1 text-md leading-8 text-gray-600 	font-bold;">
          Already have an account? ,{" "}
          <a href="" color="blue">
            Sign in
          </a>
        </div>
      </div>

      <div className="columns-2   grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6  ">
        <div>
          <div className=" py-5 pl-20   ">
            <label
              htmlFor="Email"
              className=" text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="my-3">
              <input
                id="Email"
                name="Email"
                type="text"
                autoComplete="given-name"
                className="px-5 content-center block w-4/5 rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <label
                htmlFor="password
              "
                className="my-3 block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="my-3">
                <input
                  type="text"
                  id="password"
                  name="password"
                  className="px-5 items-center block w-4/5 rounded-full border-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className=" ">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  className=" w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ms-2 text-sm pb-5 text-gray-900 dark:text-gray-300 ">
                  I agree to the terms & policy
                </label>
              </div>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-4/5 my-5"
                >
                  Create your account
                </button>
              </div>
            </div>
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
