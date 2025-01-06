interface ExperienceCardProps {
  icon: string;
  title: string;
  organization: string;
  duration: string;
}

const ExperienceCard = ({ icon, title, organization, duration }: ExperienceCardProps) => (
  <div className="border p-4 border-main cursor-pointer rounded-3xl flex flex-col text-center items-center w-1/4 shadow-lg hover:shadow-2xl">
    <div className="transition duration-300 ease-in-out transform hover:-translate-y-1 rounded-full w-24 h-24 flex flex-row justify-center items-center">
      <img src={icon} alt={`${organization} icon`} />
    </div>

    <div className="flex flex-col justify-center items-center">
      <p className="text-lg font-bold text-main">
        {title}
      </p>
      <p className="text-base text-gray-600">
        {organization}
      </p>
      <p className="text-sm text-gray-600">
        {duration}
      </p>
    </div>
  </div>
);

export default ExperienceCard; 