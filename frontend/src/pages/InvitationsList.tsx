import React, { useEffect, useRef, useState } from "react";
import profImg from "../assets/profile.svg";
// import banner from '../assets/banner.svg';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import InvitationCard from "@/components/InvitationsCard";
import BottomNavbar from "@/components/BottomNavbar";
import TopNavbar from "@/components/TopNavbar";
import { toast, Toaster } from "sonner";



const InvitationsList: React.FC = () => {
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

  const invitations = [
    {
      name: "Prof. Michelle Obama",
      profession:
        "Ophthalmologist | AIIMS Delhi’25 | Aspiring Medical Professional",
      location: "AIIMS Delhi",
      connections: " 465 Mutuals ",
      organisation: "sri harsha eye hospital",
      profileImage: profImg,
    },
  ];

  const invitations1 = [
    {
      name: "Prof. Michelle Obama",
      profession:
        "Ophthalmologist | AIIMS Delhi’25 | Aspiring Medical Professional",
      location: "AIIMS Delhi",
      connections: " 465 Mutuals ",
      organisation: "sri harsha eye hospital",
      profileImage: profImg,
      id: "3",
    },
    {
      name: "Prof. Michelle Obama",
      profession:
        "Ophthalmologist | AIIMS Delhi’25 | Aspiring Medical Professional",
      location: "AIIMS Delhi",
      connections: " 465 Mutuals ",
      organisation: "sri harsha eye hospital",
      profileImage: profImg,
      id: "0",
    },
    {
      name: "Prof. Michelle Obama",
      profession:
        "Ophthalmologist | AIIMS Delhi’25 | Aspiring Medical Professional",
      location: "AIIMS Delhi",
      connections: " 465 Mutuals ",
      organisation: "sri harsha eye hospital",
      profileImage: profImg,
      id: "1",
    },
    {
      name: "Prof. Michelle Obama",
      profession:
        "Ophthalmologist | AIIMS Delhi’25 | Aspiring Medical Professional",
      location: "AIIMS Delhi",
      connections: " 465 Mutuals ",
      organisation: "sri harsha eye hospital",
      profileImage: profImg,
      id: "2",
    },
  ];

  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState<{
    name: string;
    profession: string;
    location: string;
    connections: string;
    profileImage: string;
    organisation: string;
    id: string;
    isFollowing?: boolean;
  }[]>([]);

  const [visibleCount1, setVisibleCount1] = useState(3); // Initially display 3 items
  const [visibleCount2, setVisibleCount2] = useState(3); // Initially display 3 items

  const showMoreItems1 = () => {
    setVisibleCount1((prevCount) =>
      Math.min(prevCount + 3, invitations.length)
    ); // Load 3 more, but not exceed total items
  };
  const showMoreItems2 = () => {
    setVisibleCount2((prevCount) =>
      Math.min(prevCount + 3, peopleYouMayKnow.length)
    ); // Load 3 more, but not exceed total items
  };

  const navigate = useNavigate();

  const { id } = useParams();

  function handleBackClick() {
    navigate("/");
  }

  useEffect(() => {
    async function fetchConnections() {
      try {
        const response = await axios.get(`${BACKEND_URL}/connections/${id}`);

        const data = response.data;

        const formattedData = data.map(
          (user: {
            name: string;
            specialisation_field_of_study: string;
            organisation_name: string;
            city: string;
            connectionCount: string;
            id: string;
            profileImage: any;
          }) => ({
            name: user.name,
            profession: user.specialisation_field_of_study || "Unknown", // Replace with your backend field for profession
            location: user.city || "Unknown", // Replace with your backend field for location
            organisation: user.organisation_name,
            connections: `${user.connectionCount || 0} connections`, // Adjust according to backend structure
            profileImage: user.profileImage || profImg, // Use default if no image provided
            id: user.id,
            isFollowing: false, // Add default value
          })
        );

        setPeopleYouMayKnow(formattedData);

        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }

    fetchConnections();
  }, []);


  async function handleFollowClick(followerId: string) {
    try {
      const response = await axios.post(`${BACKEND_URL}/follow/${id}/${followerId}`);
      if(response){
         toast.success("Successfully followed!");
      }
    } catch (error) {
      toast.error("Failed to follow user");
      console.error(error);
    }
  }

  async function handleUnfollow(followerId: string) {
    try {
      const response = await axios.post(`${BACKEND_URL}/unfollow/${id}/${followerId}`);
      toast.success("Successfully unfollowed");
    } catch (error) {
      toast.error("Failed to unfollow user");
      console.error(error);
    }
  }

  async function handleNetworkClick() {
    try{
      const response = await axios.get(`${BACKEND_URL}/connections/network/${id}`);
      console.log(response);
    }catch(e){
      console.log(e);
    }
  }

  return (
    <div className="bg-white flex text-left  min-h-screen ">
      <TopNavbar />

      <Toaster/>
      <div className="container mx-auto flex flex-col pt-4 lg:pt-20 px-4 gap-3 max-w-7xl">
        <div className="flex lg:gap-8 w-full">
          <div className="hidden lg:block lg:w-[25%] ">
            <div className="sticky top-20">
              <div className="bg-white max-w-xs w-full rounded-xl p-4 ">
               <div className="flex flex-col">

                <p className="font-semibold text-lg px-4 ">Manage Friends</p>

                <div className="flex flex-col mt-3  p-2 rounded-md">

                  <p className="w-full ps-2 py-2 text-sm font-semibold bg-gray-100 rounded-s-lg cursor-pointer border-r-2 border-r-main ">Follow Friends</p>

                  <p onClick={handleNetworkClick} className="w-full ps-2 py-2 text-sm text-gray-600 font-semibold cursor-pointer hover:bg-gray-50">Followers & Following</p>

                  <p className="w-full ps-2 py-2 text-sm text-gray-600 font-semibold cursor-pointer hover:bg-gray-50">Groups</p>

                  <p className="w-full ps-2 py-2 text-sm text-gray-600 font-semibold cursor-pointer hover:bg-gray-50">Societies & Clubs</p>

                  <p className="w-full ps-2 py-2 text-sm text-gray-600 font-semibold cursor-pointer hover:bg-gray-50">Organisations</p>


                </div>

               </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[75%]">
            <div className="relative  w-full h-full ">
              <div className="bg-white flex-col rounded-lg px-2 py-4  w-full h-screen overflow-auto no-scrollbar pb-16 ">
                <div className=" lg:hidden flex  items-center mb-4">
                  <button onClick={handleBackClick} className="text-lg pr-1">
                    <FaArrowLeft />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Search"
                        className="border rounded-full py-2  ml-2 px-3 w-full text-sm"
                      />
                    </div>
                  </div>
                </div>

                <h2 className="text-lg text-left pl-4 font-semibold mb-4">
                  Invitations({invitations.length})
                </h2>

                <div className="space-y-4 grid grid-cols-12">
                  {invitations
                    .slice(0, visibleCount1)
                    .map((invitation, index) => (

                    <div className="col-span-12 md:col-span-6">
                       <InvitationCard
                        key={index}
                        name={invitation.name}
                        profession={invitation.profession}
                        location={invitation.location}
                        connections={invitation.connections}
                        profileImage={invitation.profileImage}
                        organisation={invitation.organisation}
                        id={"8"} 
                        handleClick={() => id && handleFollowClick(id)}
                        onUnfollow={() => id && handleUnfollow(id)}
                        isFollowing={false}
                      />
                    </div>
                    
                     
                    ))}
                </div>
                {visibleCount1 < invitations.length && (
                  <div className="text-center mt-4">
                    <a
                      href="#"
                      className="text-blue-500 hover:underline"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent page reload
                        showMoreItems1();
                      }}
                    >
                      See All
                    </a>
                  </div>
                )}
                {/* People You May Know Section */}
                <h2 className="text-md text-left ml-2 font-semibold mt-8 mb-4">
                  People you may know based on your recent activity.
                </h2>
                
                  <div className="grid grid-cols-12 w-full gap-4">
                    {peopleYouMayKnow
                      .slice(0, visibleCount2)
                      .map((person, index) => (
                        <div className="col-span-12 md:col-span-6 lg:col-span-4">
                          <InvitationCard
                            key={index}
                            name={person.name}
                            profession={person.profession}
                            location={person.location}
                            connections={person.connections}
                            profileImage={person.profileImage}
                            organisation={person.organisation}
                            id={person.id}
                            isFollowing={person.isFollowing}
                            handleClick={() => handleFollowClick(person.id)}
                            onUnfollow={() => handleUnfollow(person.id)}
                          />
                        </div>
                      ))}
                  </div>
              

                {visibleCount2 < peopleYouMayKnow.length && (
                  <div className="text-center mt-4">
                    <a
                      href="#"
                      className="text-blue-500 hover:underline"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent page reload
                        showMoreItems2();
                      }}
                    >
                      See More
                    </a>
                  </div>
                )}

                <div className="lg:hidden">
                  <BottomNavbar showNavbar={showNavbar} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationsList;
