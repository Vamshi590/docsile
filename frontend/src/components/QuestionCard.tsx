import insighticon from "../assets/insightfulicon.svg";
import shareicon from "../assets/shareicon.svg";
import answericon from "../assets/answericon.svg";
import { useNavigate } from "react-router-dom";

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
            className="rounded-full w-12"
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

      <div onClick={handleQuestionClick} className="border-b border-main  cursor-pointer ">
        <div className="py-4 ">
          <p className="text-base font-medium">{question}</p>
        </div>

        <div className="pb-4 ">
          <p className="text-sm">{questiondescription}</p>
        </div>

        {questionimg && (
          <div className="mb-2">
            <img
              className="w-full rounded-2xl py-2"
              src={questionimg}
              alt="question image"
            />
          </div>
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
