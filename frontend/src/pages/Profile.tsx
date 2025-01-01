import { GoArrowLeft } from "react-icons/go";
import {
  FaBehance,
  FaDribbble,
  FaLinkedin,
  FaRegBell,
  FaTwitter,
} from "react-icons/fa";
import { LuMenu } from "react-icons/lu";
import ProfileCard from "../components/ProfileCard";
import profilepic from "../assets/ProfilePic.svg";
import topinterestsicon from "../assets/topinterestsicon.svg";
import activityicon from "../assets/activityicon.svg";
import certificationicon from "../assets/certificationsicon.svg";
import educationicon from "../assets/educationicon.svg";
import analyticsicon from "../assets/analyticsicon.svg";
import { useEffect, useRef, useState } from "react";
import AnalyticsCard from "../components/AnalyticsCard";
import editicon from "../assets/editicon.svg";
import jobimage from "../assets/JobImage.svg";
import EducationCard from "../components/EducationCard";
import MembershipCard from "../components/MembershipCard";
import CertificateCard from "../components/CertificateCard";
import AchievementsCard from "../components/AchievementsCard";
import ProffesionalExperienceCard from "../components/ProffesionalExperienceCard";
import ActivityCard from "../components/ActivityCard";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import noimagepost from "../assets/post_moti_logo.jpg";
import { capitalizeFirstLetter, truncateString } from "@/functions";
import NoPosts from "@/components/NoPosts";
import NoCertificates from "@/components/NoCertificates";
import NoAwards from "@/components/NoAwards";
import NoExperience from "@/components/NoExperience";
import NoEducation from "@/components/NoEducation";
import NoMemberships from "@/components/NoMemberships";
import TopNavbar from "@/components/TopNavbar";
import { MdArrowRightAlt } from "react-icons/md";
import googleicon from "../assets/googleicon.svg";
import appleicon from "../assets/appleicon.svg";
import { motion } from "framer-motion";
import testimg from "../assets/mahendhar fee.png";

function Profile() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null); // Ref for scrollable content

  const { id } = useParams(); // Get user ID from URL params
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<any>(null); // State to hold user data

  function handleAddCertificates() {
    navigate(`/add-certificate/${id}`);
  }

  function handleAddAchievements() {
    navigate(`/add-achievements/${id}`);
  }

  function handleAddExperience() {
    navigate(`/add-professional-experience/${id}`);
  }

  function handleAddEducation() {
    navigate(`/add-education/${id}`);
  }

  function handleAddMemberships() {
    navigate(`/add-memberships/${id}`);
  }

  useEffect(() => {
    if (id) {
      // First, check localStorage for data
      const storedUser = localStorage.getItem("User");
      if (storedUser) {
        // If data exists, render it immediately
        setUserDetails(JSON.parse(storedUser));

        // Then fetch new data from the server and compare
        fetchUserData(id, JSON.parse(storedUser));
        console.log("ikkada okasari ochindhi");
      } else {
        // If no data in localStorage, fetch data from the backend
        fetchUserData(id);
        console.log("ikkada inkokasari ochindhi");
      }
    }
  }, [id]);

  // Function to fetch user data from the backend
  const fetchUserData = async (userId: string, storedUserData: any = null) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/profile/${userId}`);
      const userInfo = response.data.user;
      const questionInfo = response.data.questions;
      const postsInfo = response.data.posts;
      const certificatesInfo = response.data.certificates;
      const awardsInfo = response.data.awards;
      const experienceInfo = response.data.experiences;
      const educationInfo = response.data.educations;
      const membershipsInfo = response.data.memberships;

      const fetchedUser = {
        name: userInfo.name,
        headline: `${userInfo.specialisation_field_of_study}`,
        userLocation: `${userInfo.city}`,
        workPlace: `${userInfo.organisation_name}`,
        questionCount: questionInfo.length,
        postsCount: postsInfo.length,
        posts: postsInfo,
        certificates: certificatesInfo,
        awards: awardsInfo,
        experiences: experienceInfo,
        educations: educationInfo,
        memberships: membershipsInfo,
      };

      if (storedUserData) {
        // Compare fetched data with stored data
        if (JSON.stringify(fetchedUser) !== JSON.stringify(storedUserData)) {
          console.log("Data has changed, updating localStorage and UI...");
          localStorage.setItem("User", JSON.stringify(fetchedUser)); // Update localStorage
          setUserDetails(fetchedUser); // Update UI with new data
        } else {
          console.log("No changes detected in the data.");
        }
      } else {
        // If no stored data, set fetched data to localStorage and UI
        console.log("Storing new data in localStorage...");
        localStorage.setItem("User", JSON.stringify(fetchedUser));
        setUserDetails(fetchedUser);
      }
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  // Scroll handling to hide/show Navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = contentRef.current?.scrollTop || 0;
      if (scrollY > lastScrollY) {
        setShowNavbar(false); // Hide Navbar when scrolling down
      } else {
        setShowNavbar(true); // Show Navbar when scrolling up
      }
      setLastScrollY(scrollY); // Update lastScrollY state
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

  // Tab selection for Activity, Certifications, etc.
  const [values, setValues] = useState(0);

  const handleActivity = () => setValues(0);
  const handleCertifications = () => setValues(1);
  const handleEducation = () => setValues(2);
  const handleAnalytics = () => setValues(3);

  if (!userDetails) {
    return <p>Loading...</p>; // Loading state while fetching user data
  }

  const handleScroll = (id : any) => {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white flex items-center justify-center min-h-screen">
      <div className="hidden lg:block">
        <TopNavbar />
      </div>

      <div className="container mx-auto flex flex-col md:flex-row md:pt-16 px-4 lg:gap-12 max-w-7xl bg-white ">
        <div className="hidden md:block md:w-[25%] sticky top-10">
          <div className="flex justify-center  bg-gray-100 ">
            <div className="bg-white max-w-xs w-full rounded-xl py-3 text-center">
              {/* Profile Image with shadow */}
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
                <img
                  src={profilepic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-20 rounded-full" />
              </div>

              {/* Name and Title */}
              <h2 className="mt-4 text-3xl font-bold text-main">Ch Srilatha</h2>
              <p className="text-gray-700 font-medium">Opthalmology</p>
              <p className="text-sm text-gray-500">Sri harsha eye hospital</p>
              <p className="text-sm text-gray-500">Karimnagar, Telangana</p>

              {/* Social Icons */}
              <div className="flex items-center justify-center space-x-3 mt-6">
                <a
                  href="#"
                  className="bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200"
                >
                  <FaBehance size={18} className="text-gray-600" />
                </a>
                <a
                  href="#"
                  className="bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200"
                >
                  <FaLinkedin size={18} className="text-gray-600" />
                </a>
                <a
                  href="#"
                  className="bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200"
                >
                  <FaTwitter size={18} className="text-gray-600" />
                </a>
                <a
                  href="#"
                  className="bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200"
                >
                  <FaDribbble size={18} className="text-gray-600" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-start mt-4 w-full">
            <button
              className="text-gray-700 flex flex-row px-6  py-2 rounded-l-md w-full font-medium  items-center hover:border-r-2 hover:border-r-main hover:bg-slate-100"
              onClick={() => handleScroll("posts")}
            >
              Posts/Questions
            </button>

            <button
              className="text-gray-700 flex flex-row px-6  py-2 rounded-l-md w-full font-medium  items-center hover:border-r-2 hover:border-r-main hover:bg-slate-100"
              onClick={() => handleScroll("experiences")}
            >
              Experience
            </button>

            <button
              className="text-gray-700 flex flex-row px-6  py-2 rounded-l-md w-full font-medium  items-center hover:border-r-2 hover:border-r-main hover:bg-slate-100"
              onClick={() => handleScroll("educations")}            
            >
              Education
            </button>

            <button
              className="text-gray-700 flex flex-row px-6  py-2 rounded-l-md w-full font-medium  items-center hover:border-r-2 hover:border-r-main hover:bg-slate-100"
              onClick={() => handleScroll("memberships")}            
            >
              Memberships
            </button>

            <button
              className="text-gray-700 flex flex-row px-6  py-2 rounded-l-md w-full font-medium  items-center hover:border-r-2 hover:border-r-main hover:bg-slate-100"
              onClick={() => handleScroll("certifications")}
            >
              Certifications
            </button>

            <a
              className="text-gray-700 flex flex-row px-6  py-2 rounded-l-md w-full font-medium  items-center hover:border-r-2 hover:border-r-main hover:bg-slate-100"
              href="#"
            >
              Awards
            </a>
          </div>
        </div>

        <div className=" hidden md:block md:w-[75%] w-full pl-6 mt-6 pb-16 ">
          <div className="relative ml-8  h-full ">
            <div
              className={`bg-white flex-col rounded-lg px-2 h-screen overflow-auto no-scrollbar  pt-20 lg:pt-4 pb-16`}
            >
              {/* about me */}
              <div id="aboutMe" className="flex flex-col w-[90%]">
                <p className="text-2xl font-bold text-main w-full">About me</p>

                <p className="text-2xl font-medium py-2 text-gray-600 mt-6">
                  Hi, I am Chinthala Srilatha i am an Opthalmologist and i have
                  an eye hospital Sri harsha Eye Hospital.
                </p>

                <p className="text-sm py-2 text-gray-600">
                  {truncateString(
                    "i have done my studies in gandhi medical college after that ihave got training in chalemda medical college and then i have opened hospital in karimanagar which is been great since the start i have learned so much from it",
                    150
                  )}
                </p>

                <div className="flex flex-row gap-12 mt-12 w-full ">
                  <div className="bg-main hover:bg-gray-700 cursor-pointer flex flex-row justify-between items-center gap-20 text-white rounded-full px-4 py-2">
                    <p className="font-medium">Hire Me</p>
                    <MdArrowRightAlt size={"1.5rem"} />
                  </div>

                  <div className="hover:bg-gray-700 cursor-pointer border-main bg-main text-white flex flex-row justify-between items-center gap-20  rounded-full px-4 py-2">
                    <p className="font-medium">Resume</p>
                    <MdArrowRightAlt size={"1.5rem"} />
                  </div>
                </div>
              </div>

              {/* Experiences  */}

              <div id="experiences" className="mt-20">

              <div  className="flex flex-col">
                <p className="text-2xl font-bold text-main w-[90%]">
                  Experiences
                </p>

                <div className="flex flex-row gap-8 mt-12 mb-4 ">
                  <div className="  border p-4 border-main cursor-pointer rounded-3xl flex flex-col text-center items-center  w-1/4 shadow-lg hover:shadow-2xl">
                    <div className="transition duration-300 ease-in-out transform hover:-translate-y-1 rounded-full w-24 h-24 flex flex-row justify-center items-center">
                      <img src={googleicon} alt="job image" />
                    </div>

                    <div className="flex flex-col justify-center items-center">
                      <p className="text-lg font-bold text-main">
                        Cardiologist
                      </p>

                      <p className="text-base text-gray-600">
                        Gandhi medical college
                      </p>

                      <p className="text-sm text-gray-600">
                        Jan 2021 - Present
                      </p>
                    </div>
                  </div>

                  <div className=" border p-4 border-main cursor-pointer rounded-3xl flex flex-col text-center items-center justify-between w-1/4 shadow-lg hover:shadow-2xl">
                    <div className=" transition duration-300 ease-in-out transform hover:-translate-y-2 rounded-full w-24 h-24 flex flex-row justify-center items-center">
                      <img src={appleicon} alt="job image" />
                    </div>

                    <div className="flex flex-col justify-center items-center">
                      <p className="text-lg font-bold text-main">
                        Opthalmology
                      </p>

                      <p className="text-base text-gray-600">
                        Chalmeda medical college
                      </p>

                      <p className="text-sm text-gray-600">
                        Jan 2019 - jan 2021
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>


              {/* educations */}

              <div id="educations" className="flex flex-col mt-20">
                <h2 className="text-2xl font-bold text-main w-[90%] ">
                  Education
                </h2>

                <div className="flex flex-row items-start md:items-center mt-12">
                  {/* Left Section with Icons */}
                  <div className="flex flex-col items-center space-y-20 ">
                    {/* <div className="bg-white p-4 shadow-lg hover:shadow-2xl rounded-lg border-l-4 border-main">
                      <div className="flex flex-row space-x-6 ">
                        <div className="h-full items-center justify-center">
                          <div className="rounded-full w-12 h-12 flex flex-col justify-center ">
                            <img src={googleicon} alt="google icon" />
                          </div>
                        </div>

                        <div className="flex flex-col  w-full ">
                          <p className="text-lg font-semibold text-main">
                            Gandhi medical college
                          </p>

                          <p className="text-gray-600">MBBS | Cardiology</p>

                          <p className="text-sm text-gray-600">2021 - 2025</p>
                        </div>
                      </div>
                    </div> */}
                    <ol className="items-center sm:flex flex-row">
                      <li className="relative mb-6 sm:mb-0 sm:pb-8 sm:pl-8">
                        <div className="flex items-center">
                          <div className="z-10 flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                              <div className="rounded w-12 h-12 flex items-center justify-center">
                                <img src={appleicon} alt="apple icon" />
                              </div>
                            </div>
                          </div>
                          <div className="flex-grow w-full bg-gray-200 h-0.5"></div>
                        </div>
                        <div className="mt-3 sm:pe-8">
                          <h3 className="text-lg font-semibold text-main">
                            Gandhi medical college
                          </h3>
                          <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                            Jan 2021 - May 2025
                          </time>
                        </div>
                      </li>
                      <li className="relative mb-6 sm:mb-0 sm:pb-8 sm:pl-8">
                        <div className="flex items-center">
                          <div className="z-10 flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                              <div className="rounded-full w-12 h-12 flex justify-center items-center">
                                <img src={googleicon} alt="google icon" />
                              </div>
                            </div>
                          </div>
                          <div className="flex-grow w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
                        </div>
                        <div className="mt-3 sm:pe-8">
                          <h3 className="text-lg font-semibold text-main dark:text-white">
                            Paramitha high school
                          </h3>
                          <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            March 2018 - April 2020
                          </time>
                        </div>
                      </li>
                    </ol>
                  </div>

                  {/* Right Section with Text */}
                </div>
              </div>

              {/* Memberships */}

              <div id="memberships" className="flex flex-col mt-20">
                <p className="text-main text-2xl font-bold">Memberships</p>

                <div className="container mx-auto mt-12">
                  <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="flex flex-shrink-0 gap-16"
                  >
                    <div className="flex flex-col border border-main items-center rounded-3xl px-2 py-4 w-1/4 shadow-md hover:shadow-2xl cursor-default">
                      <div className="rounded-full w-12 h-12">
                        <img
                          className="rounded-full transform duration-300 ease-in-out transition hover:-translate-y-2"
                          src={googleicon}
                          alt="google icon"
                        />
                      </div>

                      <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-main text-lg font-semibold">
                          Telangana opthalmology society
                        </p>
                        <p className="text-gray-600 text-sm">Member</p>
                      </div>
                    </div>

                    <div className="flex flex-col border border-main items-center rounded-3xl px-2 py-4 w-1/4 shadow-md hover:shadow-2xl cursor-default">
                      <div className="rounded-full w-12 h-12">
                        <img
                          className="rounded-full transform duration-300 ease-in-out transition hover:-translate-y-2"
                          src={googleicon}
                          alt="google icon"
                        />
                      </div>

                      <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-main text-lg font-semibold">
                          Telangana opthalmology society
                        </p>
                        <p className="text-gray-600 text-sm">Member</p>
                      </div>
                    </div>

                    <div className="flex flex-col border border-main items-center rounded-3xl px-2 py-4 w-1/4 shadow-md hover:shadow-2xl cursor-default">
                      <div className="rounded-full w-12 h-12">
                        <img
                          className="rounded-full transform duration-300 ease-in-out transition hover:-translate-y-2"
                          src={googleicon}
                          alt="google icon"
                        />
                      </div>

                      <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-main text-lg font-semibold">
                          Telangana opthalmology society
                        </p>
                        <p className="text-gray-600 text-sm">Member</p>
                      </div>
                    </div>

                    <div className="flex flex-col border border-main items-center rounded-3xl px-2 py-4 w-1/4 shadow-md hover:shadow-2xl cursor-default">
                      <div className="rounded-full w-12 h-12">
                        <img
                          className="rounded-full transform duration-300 ease-in-out transition hover:-translate-y-2"
                          src={googleicon}
                          alt="google icon"
                        />
                      </div>

                      <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-main text-lg font-semibold">
                          Telangana opthalmology society
                        </p>
                        <p className="text-gray-600 text-sm">Member</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* certifications */}

              <div id="certifications" className="flex flex-col mt-20 w-full">
                <p className="text-main font-bold text-2xl">Certifications</p>

                <div className="flex flex-row justify-between w-full mt-12">
                  <div className="flex flex-col justify-center items-center w-1/2">
                    <div className="w-2/3">
                      <p className="text-main text-2xl font-bold">
                        DR. Chathurvedhi gandhi Certificate
                      </p>
                      <p className="text-gray-600">Gandhi medical college</p>
                    </div>
                  </div>

                  <div className="w-1/2">
                    <div className="flex items-center justify-center">
                      <img
                        className=" transform duration-200 ease-in-out transition  hover:translate-y-8 hover:shadow-xl object-contain h-72 cursor-pointer"
                        src={testimg}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-between w-full mt-12">
                <div className="w-1/2">
                  <div className="flex items-center justify-center">
                    <img
                      className="transform duration-200 ease-in-out transition hover:translate-y-3 hover:shadow-xl object-contain h-72 cursor-pointer"
                      src={testimg}
                      alt=""
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center w-1/2">
                  <div className="w-2/3">
                    <p className="text-main text-2xl font-bold">
                      DR. Chathurvedhi gandhi Certificate
                    </p>
                    <p className="text-gray-600">Gandhi medical college</p>
                  </div>
                </div>
              </div>

          
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="relative max-w-sm w-full h-full">
            <div
              className="bg-white flex-col rounded-lg px-2 pt-4 max-w-sm w-full h-screen overflow-y-scroll no-scrollbar pb-16"
              ref={contentRef}
            >
              <div className="flex flex-row justify-between items-center">
                <GoArrowLeft className="text-slate-500 w-5 h-5" />
                <div className="flex flex-row justify-around gap-4">
                  <FaRegBell className="text-slate-500 w-5 h-5 " />
                  <LuMenu className="text-slate-500 w-5 h-5 " />
                </div>
              </div>

              <ProfileCard
                profilepic={profilepic}
                name={capitalizeFirstLetter(userDetails.name)}
                details={capitalizeFirstLetter(userDetails.headline)}
                activeloction={capitalizeFirstLetter(userDetails.userLocation)}
                currentWorkPlace={capitalizeFirstLetter(userDetails.workPlace)}
                questions={userDetails.questionCount}
                published={userDetails.postsCount}
                followers={userDetails.friendsCount}
                following={userDetails.friendsCount}
              />

              <div className="flex flex-row border border-main rounded-2xl shadow-md mt-4 px-3 py-2">
                <img
                  className="w-16"
                  src={topinterestsicon}
                  alt="top interests icon"
                />
                <div className="flex flex-col px-4">
                  <p className="text-base font-semibold pb-1">Top Interests</p>
                  <p className="text-xs pb-1 ">
                    vision science, ocular surgery, medical research, Diagnostic
                    tools, Treatment innovations
                  </p>
                </div>
              </div>

              <div className="flex flex-row justify-between mt-6 px-3">
                <button
                  onClick={handleActivity}
                  className={
                    values === 0 ? "p-1.5 border-b-2 border-b-main" : "p-1.5"
                  }
                >
                  <img src={activityicon} alt="activity icon" />
                </button>
                <button
                  onClick={handleCertifications}
                  className={
                    values === 1 ? "p-1.5 border-b-2 border-b-main" : "p-1.5"
                  }
                >
                  <img src={certificationicon} alt="certifications icon" />
                </button>
                <button
                  onClick={handleEducation}
                  className={
                    values === 2 ? "p-1.5 border-b-2 border-b-main" : "p-1.5"
                  }
                >
                  <img src={educationicon} alt="education icon" />
                </button>
                <button
                  onClick={handleAnalytics}
                  className={
                    values === 3 ? "p-1.5 border-b-2 border-b-main" : "p-1.5"
                  }
                >
                  <img src={analyticsicon} alt="analytics icon" />
                </button>
              </div>

              {values === 0 && (
                <div className="grid grid-cols-12 mt-4 gap-3">
                  {userDetails?.posts?.length > 0 ? (
                    userDetails.posts.map((post: any) => (
                      <ActivityCard
                        key={post.id} // Assuming each post has a unique 'id'
                        activitycardimg={post.image || noimagepost} // Use post's image or fallback image
                        title={truncateString(
                          capitalizeFirstLetter(post.title),
                          50
                        )} // Assuming 'title' is part of the post object
                      />
                    ))
                  ) : (
                    <div className="grid col-span-12">
                      <NoPosts />
                    </div>
                  )}
                </div>
              )}

              {values == 1 && (
                <div className="mt-4 px-3 pb-4">
                  <div className="flex flex-row justify-between">
                    <div>
                      <p className="text-base font-semibold">Certifications</p>
                    </div>

                    <div className="flex flex-row justify-between gap-3">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={handleAddCertificates}
                          className="border border-main rounded-full bg-main text-white px-2 py text-sm font-medium"
                        >
                          +Add
                        </button>
                      </div>

                      <div className="flex flex-row items-center">
                        <button>
                          <img src={editicon} alt="edit icon" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {userDetails?.certificates?.length > 0 ? (
                    userDetails.certificates.map((certificate: any) => (
                      <CertificateCard
                        key={certificate.id} // Assuming each post has a unique 'id'
                        orginastionimage={jobimage}
                        title={capitalizeFirstLetter(
                          certificate.certificateName
                        )}
                        organisation={capitalizeFirstLetter(
                          certificate.issuingOrganisation
                        )}
                        date={certificate.issueDate}
                      />
                    ))
                  ) : (
                    <NoCertificates />
                  )}

                  <div className="flex flex-row justify-between mt-4">
                    <div>
                      <p className="text-base font-semibold">
                        Achievements And Awards
                      </p>
                    </div>

                    <div className="flex flex-row justify-between gap-3">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={handleAddAchievements}
                          className="border border-main bg-main text-white rounded-full px-2 py text-sm font-medium"
                        >
                          +Add
                        </button>
                      </div>

                      <div className="flex flex-row items-center">
                        <button>
                          <img src={editicon} alt="edit icon" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {userDetails?.awards?.length > 0 ? (
                    userDetails.awards.map((award: any) => (
                      <AchievementsCard
                        jobimage={jobimage}
                        title={award.awardName}
                        date={award.issueDate}
                      />
                    ))
                  ) : (
                    <NoAwards />
                  )}
                </div>
              )}

              {values == 2 && (
                <div className="mt-4 px-3 pb-4">
                  <div className="flex flex-row justify-between">
                    <div>
                      <p className="text-base font-semibold">
                        Proffesional Experience
                      </p>
                    </div>

                    <div className="flex flex-row justify-between gap-3">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={handleAddExperience}
                          className="border border-main bg-main text-white rounded-full px-2 py text-sm font-medium"
                        >
                          +Add
                        </button>
                      </div>

                      <div className="flex flex-row items-center">
                        <button>
                          <img src={editicon} alt="edit icon" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {userDetails?.experiences?.length > 0 ? (
                    userDetails.experiences.map((experience: any) => (
                      <ProffesionalExperienceCard
                        key={experience.id}
                        jobimage={jobimage}
                        title={capitalizeFirstLetter(experience.title)}
                        organisation={capitalizeFirstLetter(
                          experience.organisation
                        )}
                        timeline={`${capitalizeFirstLetter(
                          experience.startDate
                        )} - ${capitalizeFirstLetter(experience.endDate)}`}
                      />
                    ))
                  ) : (
                    <NoExperience />
                  )}

                  <div className="flex flex-row justify-between mt-4">
                    <div>
                      <p className="text-base font-semibold">
                        Education Qualifications
                      </p>
                    </div>

                    <div className="flex flex-row justify-between gap-3">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={handleAddEducation}
                          className="border border-main bg-main text-white rounded-full px-2 py text-sm font-medium"
                        >
                          +Add
                        </button>
                      </div>

                      <div className="flex flex-row items-center">
                        <button>
                          <img src={editicon} alt="edit icon" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {userDetails?.educations?.length > 0 ? (
                    userDetails.educations.map((education: any) => (
                      <EducationCard
                        jobimage={jobimage}
                        title={education.schoolName}
                        organisation={`${education.degree} | ${education.department}`}
                        timeline={`${education.startDate} - ${education.endDate}`}
                      />
                    ))
                  ) : (
                    <NoEducation />
                  )}

                  <div className="mt-4">
                    <div className="flex flex-row justify-between">
                      <div>
                        <p className="text-base font-semibold">Memberships</p>
                      </div>

                      <div className="flex flex-row justify-between gap-3">
                        <div className="flex justify-center items-center">
                          <button
                            onClick={handleAddMemberships}
                            className="border border-main bg-main text-white rounded-full px-2 py text-sm font-medium"
                          >
                            +Add
                          </button>
                        </div>

                        <div className="flex flex-row items-center">
                          <button>
                            <img src={editicon} alt="edit icon" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {userDetails?.memberships?.length > 0 ? (
                    userDetails.memberships.map((membership: any) => (
                      <MembershipCard
                        image={jobimage}
                        title={membership.societyName}
                        position={membership.position}
                      />
                    ))
                  ) : (
                    <NoMemberships />
                  )}
                </div>
              )}

              {values == 3 && (
                <div className="mt-4 px-3 pb-4">
                  <div>
                    <p className="text-base font-semibold">
                      Analytics and Data Points
                    </p>
                  </div>

                  <div className="grid grid-cols-12 mt-4 gap-3">
                    <AnalyticsCard
                      value="211"
                      label="Post impressions"
                      analytics="+2.1% past 7 days"
                    />
                    <AnalyticsCard
                      value="211"
                      label="Post impressions"
                      analytics="+2.1% past 7 days"
                    />
                    <AnalyticsCard
                      value="211"
                      label="Post impressions"
                      analytics="+2.1% past 7 days"
                    />
                    <AnalyticsCard
                      value="211"
                      label="Post impressions"
                      analytics="+2.1% past 7 days"
                    />
                    <AnalyticsCard
                      value="211"
                      label="Post impressions"
                      analytics="+2.1% past 7 days"
                    />
                    <AnalyticsCard
                      value="211"
                      label="Post impressions"
                      analytics="+2.1% past 7 days"
                    />
                  </div>
                </div>
              )}

              <div className="md:hidden">
                <BottomNavbar showNavbar={showNavbar} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
