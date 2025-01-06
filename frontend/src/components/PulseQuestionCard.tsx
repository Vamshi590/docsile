import { capitalizeFirstLetter } from "@/functions";
import { truncateString } from "@/functions";

const PulseQuestionCard = ({ profileImage, name, postedAt, question }: {
  profileImage: string;
  name: string;
  postedAt: string;
  question: string;
}) => (
  <div className="flex items-center p-2 cursor-pointer bg-white overflow-hidden">
    <img
      src={profileImage}
      alt={`${name}'s profile`}
      className="w-11 h-11 rounded-full mr-2"
    />
    <div className="flex-1 text-left">
      <div className="flex flex-row items-center gap-2">
        <p className="font-semibold text-xs text-gray-800">
          {capitalizeFirstLetter(name)}
        </p>
        <p className="text-gray-500 text-[0.6rem]">
          {postedAt}
        </p>
      </div>
      <p className="text-[0.7rem] text-gray-800">
        {question? truncateString(question, 70) : ""}
      </p>
    </div>
  </div>
);

export default PulseQuestionCard;