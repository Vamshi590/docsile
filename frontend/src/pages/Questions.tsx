import { GoArrowLeft } from "react-icons/go";
import Search from "../components/Search";
import cardprofileimg from "../assets/cardprofileimg.svg";
import QuestionCard from "../components/QuestionCard";
import logo from "../assets/logo.png";
import profilepic from "../assets/ProfilePic.svg";
import BottomNavbar from "../components/BottomNavbar";
import { useEffect, useRef, useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { capitalizeFirstLetter, truncateString } from "@/functions";

function Questions() {
  // const [showHeader, setShowHeader] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null); // Ref for scrollable content

  // Handle scrolling inside the content div
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollY = contentRef.current.scrollTop;
        if (scrollY > lastScrollY) {
          // If scrolling down, hide the header and navbar
          // setShowHeader(false);
          setShowNavbar(false);
        } else {
          // If scrolling up, show the header and navbar
          // setShowHeader(true);
          setShowNavbar(true);
        }
        setLastScrollY(scrollY);
      }
    };

    const scrollableDiv = contentRef.current;
    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [lastScrollY]);

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <TopNavbar />

      <div className="container mx-auto flex flex-col pt-4 lg:pt-20 px-4 gap-3 max-w-7xl">
        <div className="hidden lg:flex flex-col gap-3">
          <div className="flex flex-row px-2 py-3.5 bg-white rounded-3xl shadow-lg">
            <div className="flex items-center border-r border-gray-400 bg-white p-2 flex-grow w-2/3">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-700 mr-2" />
              <input
                type="text"
                placeholder="Search for a question"
                className="focus:outline-none flex-grow bg-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center bg-white p-2 flex-grow w-1/3">
              <HiOutlineLocationMarker className="w-5 h-5 text-gray-700 mr-2" />
              <input
                type="text"
                placeholder="Opthalmology"
                className="bg-white focus:outline-none flex-grow placeholder:text-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="flex lg:gap-8 w-full">
          <div className="hidden lg:block lg:w-[25%] mt-4">
            <div className="">
              <div className="bg-white max-w-xs w-full rounded-xl p-4 ">
                <div className="flex flex-col justify-center">
                  <div className="flex flex-col gap-4  pb-4 border-b border-b-main">
                    <div className="rounded-full w-9 h-9">
                      <img src={profilepic} alt="profile pic" />
                    </div>

                    <p className="text-gray-500">Ask Question</p>
                  </div>

                  <div className="flex flex-col  justify-start pt-4">
                    <p className="text-gray-700 text-sm font-semibold">
                      Feared to ask ?{" "}
                    </p>
                    <p className="text-gray-600 text-xs pt-2">
                      Now you can ask
                      questions{" "}
                      <span className="text-main">
                        {" "}
                        <strong>Anonymously</strong>
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-row justify-between items-center mt-4">
                    <div className="flex flex-row gap-4">
                      <p className="text-xs text-gray-500">Ask Anonymously :</p>

                      <label className="inline-flex items-center mb-5 cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                        />
                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[45%] w-full">
            <div className="relative  flex-col rounded-lg px-2 w-full">
              <div className="lg:hidden">
                <div className="flex flex-row items-center gap-2">
                  <GoArrowLeft className="w-5 h-5 text-slate-500" />
                  <Search />
                </div>
              </div>

              <QuestionCard
                cardprofileimg={profilepic}
                questioner={"Dr. Lavanya Seelam"}
                questionerdetails={"Orthopedic surgeon"}
                questiondate={"Oct 7"}
                question={"What are the main reasons for weakness in bone?"}
                questiondescription={
                  "As we know today's life there are many cases of heart attacks which are very terrifying. What do you think would be the cause for this unimagined heart attack?"
                }
                commentimg={cardprofileimg}
              />

              <QuestionCard
                cardprofileimg={cardprofileimg}
                questionimg={logo}
                questioner={"Dr. Sriprada Jorige"}
                questionerdetails={"Cardiologist"}
                questiondate={"Oct 7"}
                question={"What are the main reasons for heart attacks?"}
                questiondescription={
                  "As we know today's life there are many cases of heart attacks which are very terrifying. What do you think would be the cause for this unimagined heart attack?"
                }
                commentimg={profilepic}
              />

              <div className="lg:hidden">
                <BottomNavbar showNavbar={showNavbar} />
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:w-[30%] mt-4">
            <div className="sticky top-20">
              <div className="flex flex-col bg-white p-2 rounded-xl ">
                <p className="flex flex-row items-start justify-start w-full p-2 font-semibold">
                  Pulse Questions :{" "}
                </p>

                <div className="flex items-center p-2   cursor-pointer bg-white overflow-hidden ">
                  <img
                    src={profilepic}
                    alt={`${name}'s profile`}
                    className="w-11 h-11 rounded-full mr-2"
                  />
                  <div className="flex-1 text-left ">
                    <div className="flex flex-row items-center gap-2">
                      <p className="font-semibold text-xs text-gray-800">
                        {capitalizeFirstLetter("Vamshidhar")}
                      </p>

                      <p className="text-gray-500 text-[0.6rem] ">
                        Posted 2d ago
                      </p>
                    </div>

                    <p className="text-[0.7rem] text-gray-800 ">
                      {truncateString(
                        "What are the main reasons for obesity in this era of junk food and social media and everything",
                        70
                      )}
                    </p>
                  </div>{" "}
                </div>

                <div className="flex items-center p-2   cursor-pointer bg-white overflow-hidden ">
                  <img
                    src={profilepic}
                    alt={`${name}'s profile`}
                    className="w-11 h-11 rounded-full mr-2"
                  />
                  <div className="flex-1 text-left ">
                    <div className="flex flex-row items-center gap-2">
                      <p className="font-semibold text-xs text-gray-800">
                        {capitalizeFirstLetter("Vamshidhar")}
                      </p>

                      <p className="text-gray-500 text-[0.6rem] ">
                        Posted 2d ago
                      </p>
                    </div>

                    <p className="text-[0.7rem] text-gray-800 ">
                      {truncateString(
                        "What are the main reasons for obesity in this era of junk food and social media and everything",
                        70
                      )}
                    </p>
                  </div>{" "}
                </div>

                <div className="flex items-center p-2   cursor-pointer bg-white overflow-hidden ">
                  <img
                    src={profilepic}
                    alt={`${name}'s profile`}
                    className="w-11 h-11 rounded-full mr-2"
                  />
                  <div className="flex-1 text-left ">
                    <div className="flex flex-row items-center gap-2">
                      <p className="font-semibold text-xs text-gray-800">
                        {capitalizeFirstLetter("Vamshidhar")}
                      </p>

                      <p className="text-gray-500 text-[0.6rem] ">
                        Posted 2d ago
                      </p>
                    </div>

                    <p className="text-[0.7rem] text-gray-800 ">
                      {truncateString(
                        "What are the main reasons for obesity in this era of junk food and social media and everything",
                        70
                      )}
                    </p>
                  </div>{" "}
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questions;
