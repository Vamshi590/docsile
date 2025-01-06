import { GoArrowLeft } from "react-icons/go";
import {
  FaBehance,
  FaDribbble,
  FaLinkedin,
  FaRegBell,
  FaTwitter,
  FaPlus,
} from "react-icons/fa";
import { LuMenu } from "react-icons/lu";
import ProfileCard from "../components/ProfileCard";
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
import testimg from "../assets/mahendhar fee.png";
import ExperienceCard from "../components/ExperienceCard";
import EducationTimeline from "../components/EducationTimeline";
import { formatDate } from "@/utils/dateFormatter";
import MembershipCarousel from "../components/MembershipCarousel";
import CertificateGallery from "../components/CertificateGallery";
import { checkVerification } from "@/utils/verificationCheck";
import { Dialog } from "@/components/Dialog";
import { toast, Toaster } from "sonner";
import profilepic from "../assets/ProfilePic.svg";

function Profile() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null); // Ref for scrollable content


  const { id } = useParams(); // Get user ID from URL params
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<any>(null); // State to hold user data

  // Add the verification dialog
  const [showDialog, setShowDialog] = useState(false);

  function handleAddCertificates() {
    checkVerification(id as string, "add-certificate", navigate, setShowDialog);
  }

  function handleAddAchievements() {
    checkVerification(id as string, "add-achievements", navigate, setShowDialog);
  }

  function handleAddExperience() {
    checkVerification(id as string, "add-professional-experience", navigate, setShowDialog);
  }

  function handleAddEducation() {
    checkVerification(id as string, "add-education", navigate, setShowDialog);
  }

  function handleAddMemberships() {
    checkVerification(id as string, "add-memberships", navigate, setShowDialog);
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
      const userData = response.data.data; // New response structure

      console.log(response.data)

      const fetchedUser = {
        name: userData.name,
        headline: userData.department,
        userLocation: userData.city,
        workPlace: userData.organisation_name,
        questionCount: userData.questions.length,
        postsCount: userData.posts.length,
        profile_picture: userData.profile_picture,
        posts: userData.posts,
        certificates: userData.certifications,
        awards: userData.achievementsAwards,
        experiences: userData.professionalExperience,
        educations: userData.education,
        memberships: userData.memberships,
      };

      if (storedUserData) {
        if (JSON.stringify(fetchedUser) !== JSON.stringify(storedUserData)) {
          localStorage.setItem("User", JSON.stringify(fetchedUser));
          setUserDetails(fetchedUser);
        }
      } else {
        localStorage.setItem("User", JSON.stringify(fetchedUser));
        setUserDetails(fetchedUser);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err.response?.data?.message || err);
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

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Get presigned URL from backend
      const { data } = await axios.get(`${BACKEND_URL}/get-upload-url`);

      // Upload to S3 without credentials
      await axios.put(data.uploadURL, file, {
        headers: { 
          "Content-Type": file.type 
        },
        withCredentials: false
      });

      // Save image URL to database
      await axios.post(`${BACKEND_URL}/update-profile-picture`, {
        userId: id,
        imageUrl: data.imageURL
      });

      

      toast.success("Profile picture uploaded successfully");
      // Optionally refresh the page or update the UI
      window.location.reload();
    } catch (error) {
      toast.error("Failed to upload profile picture");
      console.error(error);
    }
  };

  if (!userDetails) {
    return <p>Loading...</p>; // Loading state while fetching user data
  }

  const handleScroll = (id: any) => {
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

      <Toaster/>

      <div className="container mx-auto flex flex-col md:flex-row md:pt-16 px-4 lg:gap-12 max-w-7xl bg-white ">
        <div className="hidden md:block md:w-[25%] sticky top-10">
          <div className="flex justify-center  bg-gray-100 ">
            <div className="bg-white max-w-xs w-full rounded-xl py-3 text-center">
              {/* Profile Image with shadow */}
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
                <img
                  src={userDetails.profile_picture || profilepic}
                  alt="Profile"
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-20 rounded-full" />
                
                <label className="absolute bottom-0 right-0 p-2 bg-main rounded-full cursor-pointer hover:bg-opacity-90 transition-all">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                  />
                  <FaPlus className="w-4 h-4 text-white" />
                </label>
              </div>

              {/* Name and Title */}
              <h2 className="mt-4 text-3xl font-bold text-main">{capitalizeFirstLetter(userDetails.name)}</h2>
              <p className="text-gray-700 font-medium">{capitalizeFirstLetter(userDetails.headline)}</p>
              <p className="text-sm text-gray-500">{capitalizeFirstLetter(userDetails.workPlace)}</p>
              <p className="text-sm text-gray-500">{capitalizeFirstLetter(userDetails.userLocation)}</p>

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
                <div className="flex flex-col">
                  <div className="flex justify-between items-center w-[90%]">
                    <p className="text-2xl font-bold text-main">Experiences</p>
                    <button 
                      onClick={handleAddExperience}
                      className="bg-main text-white px-4 py-2 rounded-full hover:bg-opacity-90"
                    >
                      + Add Experience
                    </button>
                  </div>

                  <div className="flex flex-row gap-8 mt-12 mb-4">
                    {userDetails?.experiences?.length > 0 ? (
                      userDetails.experiences.map((exp: any) => (
                        <ExperienceCard
                          key={exp.id}
                          icon={exp.icon || googleicon}
                          title={capitalizeFirstLetter(exp.title)}
                          organization={capitalizeFirstLetter(exp.organisation)}
                          duration = {`${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}`}
                        />
                      ))
                    ) : (
                      <div className="w-full flex flex-col items-center justify-center py-12 bg-white rounded-lg">
                        <p className="text-gray-600 text-lg mb-4">No experiences added yet</p>
                        <button 
                          onClick={handleAddExperience}
                          className="flex items-center gap-2 text-main hover:underline"
                        >
                          Add your first experience
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* educations */}

              <div id="educations" className="flex flex-col mt-20">
                <div className="flex justify-between items-center w-[90%]">
                  <h2 className="text-2xl font-bold text-main">Education</h2>
                  <button 
                    onClick={() => navigate(`/add-education/${id}`)}
                    className="bg-main text-white px-4 py-2 rounded-full hover:bg-opacity-90"
                  >
                    + Add Education
                  </button>
                </div>

                <div className="flex flex-row items-start md:items-center mt-12">
                  <EducationTimeline
                    educations={userDetails?.educations?.map((edu: any) => ({
                      id: edu.id,
                      icon: edu.icon,
                      schoolName: capitalizeFirstLetter(edu.schoolName),
                      degree : `${capitalizeFirstLetter(edu.degree)} | ${capitalizeFirstLetter(edu.department)}`,
                      duration: `${formatDate(edu.startDate)} - ${edu.endDate ? formatDate(edu.endDate) : 'Present'}`
                    })) || []}
                    onAddClick={() => navigate(`/add-education/${id}`)}
                  />
                </div>
              </div>

              {/* Memberships */}

              <div id="memberships" className="flex flex-col mt-20">
                <div className="flex justify-between items-center w-[90%]">
                  <p className="text-main text-2xl font-bold">Memberships</p>
                  <button 
                    onClick={() => navigate(`/add-memberships/${id}`)}
                    className="bg-main text-white px-4 py-2 rounded-full hover:bg-opacity-90"
                  >
                    + Add Membership
                  </button>
                </div>

                <MembershipCarousel
                  memberships={userDetails?.memberships?.map((membership: any) => ({
                    id: membership.id,
                    icon: membership.icon || googleicon,
                    societyName: membership.societyname || 'Society Name',
                    position: membership.position || 'Member'
                  })) || []}
                  onAddClick={() => navigate(`/add-memberships/${id}`)}
                />
              </div>

              {/* certifications */}

              <div id="certifications" className="flex flex-col mt-20 w-full">
                <div className="flex justify-between items-center w-[90%]">
                  <p className="text-main font-bold text-2xl">Certifications</p>
                  <button 
                    onClick={() => navigate(`/add-certificate/${id}`)}
                    className="bg-main text-white px-4 py-2 rounded-full hover:bg-opacity-90"
                  >
                    + Add Certificate
                  </button>
                </div>

                <CertificateGallery
                  certificates={userDetails?.certificates?.map((cert: any) => ({
                    id: cert.id,
                    title: capitalizeFirstLetter(cert.certificateName),
                    organization: capitalizeFirstLetter(cert.issuingOrganisation),
                    image: cert.certificateMediaLink || testimg
                  })) || []}
                  onAddClick={() => navigate(`/add-certificate/${id}`)}
                />
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

      <Dialog isOpen={showDialog} onClose={() => setShowDialog(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Verification Required</h2>
          <p className="mb-4">Please verify your medical registration to continue.</p>
          <button 
            onClick={() => navigate('/verification')} 
            className="bg-main text-white px-4 py-2 rounded-full"
          >
            Verify Now
          </button>
        </div>
      </Dialog>
    </div>
  );
}

export default Profile;
