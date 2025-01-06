import insighticon from "../assets/insightfulicon.svg";
import shareicon from "../assets/shareicon.svg";
import answericon from "../assets/answericon.svg";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { BsDot } from 'react-icons/bs';

interface QuestionImageLink {
  id: number;
  question_image_link: string;
}

const ImageCarousel = ({ images }: { images: QuestionImageLink[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!Array.isArray(images) || images.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full mb-2">
      {/* Image container */}
      <div className="relative h-[400px] w-full rounded-2xl overflow-hidden">
        <img
          src={images[currentIndex].question_image_link}
          alt={`Question image ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
            >
              <IoIosArrowBack size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
            >
              <IoIosArrowForward size={20} />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all ${
                  currentIndex === index ? 'text-white' : 'text-white/50'
                }`}
              >
                <BsDot size={24} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function QuestionCard({
  cardprofileimg,
  questionimg,
  questioner,
  questionerdetails,
  questiondate,
  question,
  questiondescription,
  commentimg,
  id
}: any) {

  const navigate = useNavigate();



  const handleQuestionClick = () => {
    navigate(`/question-page/${id}`);
  }




  return (
    <div className="flex flex-col  p-4 rounded-xl bg-white mt-4 border border-main">
      <div className="flex flex-row ">
        <div className="flex items-center rounded-full">
          <img
            className="rounded-full w-12 h-12 object-cover "
            src={cardprofileimg}
            alt="card profile img"
          />
        </div>

        <div className="flex flex-col p-2">
          <div>
            <p className="text-sm font-medium">
              {questioner}
              {", "}
              <span className="text-xs font-normal">{questionerdetails}</span>
              <span className="text-xs font-normal"> | </span>
              <span className="text-xs font-normal">{questiondate}</span>
            </p>
          </div>

          <div>
            <p className="text-xs font-normal">Asked a question</p>
          </div>
        </div>
      </div>

      <div  className="border-b border-main  cursor-pointer ">
        <div className="py-4 ">
          <p className="text-base font-medium">{question}</p>
        </div>

        <div className="pb-4 ">
          <p className="text-sm">{questiondescription}</p>
        </div>

        {questionimg && Array.isArray(questionimg) && questionimg.length > 0 && (
          <ImageCarousel images={questionimg} />
        )}
      </div>

      <div className="flex flex-row justify-between mt-3 px-1">
        <div className=" cursor-pointer flex flex-row gap-1 items-center">
          <div>
            <img src={insighticon} alt="insightful icon" />
          </div>

          <div>
            <p className="text-sm"> Insightful</p>
          </div>
        </div>
        <div className=" cursor-pointer flex flex-row gap-1 items-center">
          <div className="text-slate-500">
            <img src={answericon} alt="answer icon" />
          </div>

          <div>
            <p className="text-sm">Answer</p>
          </div>
        </div>
        <div className=" cursor-pointer flex flex-row gap-1 items-center">
          <div className="text-slate-500">
            <img src={shareicon} alt="share icon" />
          </div>

          <div>
            <p className="text-sm">Share</p>
          </div>
        </div>
      </div>

      <div className="cursor-pointer flex flex-row mt-3 ">
        <div>
          <img
            className="w-8 rounded-full"
            src={commentimg}
            alt="comment profile image"
          />
        </div>

        <div className="w-full pl-1.5">
          <input
            className="text-xs w-full border border-main rounded-full shadow-sm py-1.5 px-2"
            placeholder="Comment on question"
            type="text"
          />
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
