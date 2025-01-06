import { GoArrowLeft } from "react-icons/go";
import Search from "../components/Search";
import cardprofileimg from "../assets/cardprofileimg.svg";
import QuestionCard from "../components/QuestionCard";
import profilepic from "../assets/ProfilePic.svg";
import BottomNavbar from "../components/BottomNavbar";
import { useEffect, useRef, useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { HiOutlineLocationMarker } from "react-icons/hi";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { toast, Toaster } from "sonner";
import PulseQuestionCard from "@/components/PulseQuestionCard";



interface PulseQuestion {
  profileImage: string;
  name: string;
  postedAt: string;
  question: string;
}

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

  const userid = localStorage.getItem("Id");


  
  const [question, setQuestion] = useState<any>();

  useEffect(() => {
    async function getQuestion() {
      const loading =  toast.loading("Loading Questions...");
      try {
        const response = await axios.get(
          `${BACKEND_URL}/questions/${userid}`
        );
        setQuestion(response.data);

        toast.dismiss(loading);

        
      } catch (e) {
        console.log(e);
      }
    }

    getQuestion();
  }, []);

  if(question) {
      console.log(question.data);

  }

  // Filter high urgency questions for pulse section
  const pulseQuestions = question?.data
    ?.filter((q: any) => q.urgency === "HIGH")
    ?.map((q: any) => ({
      profileImage: q.User.profileImage || profilepic,
      name: q.User.name,
      postedAt: new Date(q.asked_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      question: q.question
    })) || [];

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <TopNavbar />

      <Toaster/>
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

              {question?.data?.map((q: any) => (
                <QuestionCard
                  key={q.id}
                  cardprofileimg={q.User.profileImage || profilepic}
                  questioner={q.User.name}
                  questionerdetails={`${q.User.department} | ${q.User.organisation_name}`}
                  questiondate={new Date(q.asked_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  questionimg = {q.question_image_links}
                  question={q.question}
                  questiondescription={q.question_description}
                  commentimg={cardprofileimg}
                  id={q.id.toString()}
                />
              ))}

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

                {pulseQuestions.map((q: PulseQuestion, index: number) => (
                  <PulseQuestionCard
                    key={index}
                    profileImage={q.profileImage}
                    name={q.name}
                    postedAt={q.postedAt}
                    question={q.question}
                  />
                ))}

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questions;
