import homepage from "@/assets/homepage.png";
import subHomepage from "@/assets/sub-homepage.png";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const HomePageContent = () => {
  return (
    <div className="min-h-screen">
      <div
        className="relative bg-cover bg-center h-[32rem]"
        style={{ backgroundImage: `url(${homepage})` }}
      >
        <div className="absolute inset-0 flex flex-col items-center mt-10 text-center text-white px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            A Personal Finance Assistant Tool
          </h1>
          <p className="text-sm md:text-lg font-light mb-6">
            With stellar one-click reports and unmatched support, see how{" "}
            <br></br>{" "}
            <span className="text-black font-semibold"> Fintrack</span> will
            make a difference in your finance status.
          </p>

          <Link
            className="px-4 py-3 bg-greenButton text-greenButton-foreground border-whiteButton border hover:bg-gray-500"
            to="/dashboard"
          >
            <div className="flex items-center">
              Get started
              <ChevronRight className="w-5 ml-2" />
            </div>
          </Link>
          <div className="relative mt-12">
            <img
              src={subHomepage}
              alt="Team working"
              className="w-[60%] md:w-[100%] mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageContent;
