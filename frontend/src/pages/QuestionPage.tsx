import TopNavbar from "@/components/TopNavbar";

import ImageCarousel from "@/components/ImageCarousel";
import profilepic from "../assets/ProfilePic.svg";
import { FaBold, FaImage, FaItalic, FaLink, FaUnderline } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";
import test5img from "../assets/test5.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { toast, Toaster } from "sonner";

function QuestionPage() {
  const images = [test5img];

  const [answer, setAnswer] = useState("");

  const userid = localStorage.getItem("Id");

  console.log(userid);

  const questionId = 8;

  const [question, setQuestion] = useState<any>();

  useEffect(() => {
    async function getQuestion() {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/questions/${userid}`
        );
        setQuestion(response.data);
        
      } catch (e) {
        console.log(e);
      }
    }

    getQuestion();
  }, []);

  if(question) {
      console.log(question.data);

  }


  async function handlePostAnswerClick() {
    if (!answer.trim()) {
      toast.error("Please write an answer before posting");
      return;
    }

    const promise = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/answer/${questionId}`,
          {
            answer: answer,
            id: userid,
          }
        );

        if (response.data) {
          setAnswer(""); // Clear the answer field
          return "Answer posted successfully!";
        }
      } catch (e: any) {
        throw new Error(e.response?.data?.message || "Failed to post answer");
      }
    };

    toast.promise(promise(), {
      loading: "Posting your answer...",
      success: (data) => data,
      error: (err) => err.message,
    });
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <TopNavbar />

      <Toaster />

      <div className="container mx-auto flex flex-col pt-4 lg:pt-20 px-4 gap-3 max-w-7xl">
        <div className="flex flex-row items-center justify-between border-b border-b-gray-200 w-full px-4">
          <div className="flex flex-col bg-white  ml-6 w-[90%]">
            {/* Question Title */}
            <h1 className="text-2xl font-bold mb-4">
              What are the main reasons for weakness in bones
            </h1>
            {/* Metadata */}
            <div className="flex items-center text-sm text-gray-600 mb-6">
              <p className="mr-4 text-sm">Asked : Today</p>
              <div className="flex flex-row items-center gap-2">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <p className="text-sm"> Urgency : high </p>
              </div>

              <div className="flex flex-row gap-1">
                <p className="ml-4 text-sm">Asked by : </p>
                <p className="text-sm font-bold cursor-pointer">
                  Lavanya seelam
                </p>
              </div>
            </div>
          </div>

          <div className=" w-[10%] cursor-pointer rounded-lg">
            <p className="text-white font-semibold bg-main px-4 py-2 rounded-lg text-sm">
              Ask Question
            </p>
          </div>
        </div>

        <div className="w-full border-b border-b-gray-200 pb-4 ">
          <div className="w-[70%]  flex flex-col ">
            <div className="px-4">
              <p className="text-black text-md px-4">
                I'm curious about the factors that contribute to bone weakness.
                Despite trying to maintain a healthy lifestyle, I’ve noticed
                some issues that might be related to bone health, such as
                persistent fatigue or minor injuries taking longer to heal.
                Could you explain the common causes of weakened bones and what
                steps can be taken to prevent or address this issue?
              </p>
            </div>

            <div className="px-8 mt-6">
              <ImageCarousel images={images} />
            </div>

            <div className="px-4 mt-4">
              <p className="text-black text-md px-4">
                I’ve been trying to lead a healthy lifestyle, but I’ve noticed
                some concerning signs that might be related to bone health.
                These include persistent fatigue, difficulty recovering from
                minor injuries, and a general feeling of physical fragility.
                It’s making me wonder: what are the key factors that contribute
                to weakened bones? How do things like diet, lifestyle, or
                underlying health conditions play a role? Additionally, what
                preventative measures can be taken to maintain strong, healthy
                bones? Could you also explain how aging and genetic
                predispositions impact bone density and what steps I can take to
                address these issues before they become more serious ?
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col px-8 w-full py-6 ">
          <p className="text-xl font-semibold">Answers</p>

          <div className="flex flex-row mt-5 border-b border-b-gray-200 pb-6">
            <div className="rounded-full w-24">
              <img
                className="w-11 h-11 rounded-full "
                src={profilepic}
                alt="profile pic"
              />
            </div>

            <div className="flex flex-col px-2">
              <p className="text-sm font-semibold">Dr. Ganapathi seelam</p>

              <p className="text-xs text-gray-500">
                Orthopedic | gandhi hospital
              </p>

              <div className="flex flex-col">
                <div className="mt-4">
                  <p className="text-black text-sm ">
                    Bone weakness, often referred to as low bone density or
                    osteoporosis, occurs when the bones lose strength and are
                    more prone to fractures. Here are the primary reasons for
                    this condition:
                    <ul className=" list-outside font-semibold ">
                      <li>Nutritional Deficiencies</li>
                      <li>Aging</li>
                      <li>Hormonal Changes</li>
                      <li>Lack of Physical Activity</li>
                      <li>Certain Medical Conditions</li>
                      <li>Genetics</li>
                    </ul>
                  </p>
                </div>
              </div>

              <div className="flex flex-row gap-4 mt-4">
                <AiOutlineLike />

                <PiShareFatLight />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full h-screen px-8 mt-6">
          <div>
            <p className="text-xl font-semibold">Post your Answer</p>
          </div>

          <div className="w-full flex flex-row gap-8 mt-6 border-t border-t-main border-x border-x-main p-2">
            <FaBold className="cursor-pointer" />

            <FaUnderline className="cursor-pointer" />

            <FaItalic className="cursor-pointer" />

            <FaLink className="cursor-pointer" />

            <FaImage className="cursor-pointer" />
          </div>

          <div className="w-full border border-main">
            <textarea
              className="w-full focus:outline-none px-2 py-2"
              name="content"
              id="content"
              rows={5}
              placeholder="Start typing here..."
              onChange={(event) => setAnswer(event.target.value)}
              value={answer}
              required
              onInvalid={(e: any) => {
                e.preventDefault();
                toast.error("Please write an answer before posting");
              }}
            ></textarea>
          </div>

          <div
            onClick={handlePostAnswerClick}
            className=" w-full flex flex-row justify-end mt-4"
          >
            <p className="text-white px-4 py-2 bg-main rounded-xl cursor-pointer">
              Post
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionPage;
