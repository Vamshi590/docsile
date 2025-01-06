import googleicon from  '../assets/googleicon.svg'

interface Education {
  id: string;
  icon?: string;
  schoolName: string;
  duration: string;
  degree: string;
}

interface EducationTimelineProps {
  educations: Education[];
  onAddClick: () => void;
}

const EducationTimeline = ({ educations, onAddClick }: EducationTimelineProps) => {
  if (!educations?.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 rounded-lg">
        <p className="text-gray-600 text-lg mb-4">No education details added yet</p>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 text-main hover:underline"
        >
          Add your education details
        </button>
      </div>
    );
  }

  return (
    <ol className="items-center sm:flex flex-row">
      {educations.map((edu, index) => (
        <li key={edu.id} className="relative mb-6 sm:mb-0 sm:pb-8 sm:pl-8">
          <div className="flex items-center">
            <div className="z-10 flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                <div className="rounded w-12 h-12 flex items-center justify-center">
                  <img src={edu.icon || googleicon} alt={`${edu.schoolName} icon`} />
                </div>
              </div>
            </div>
            {index !== educations.length - 1 && (
              <div className="flex-grow w-full bg-gray-200 h-0.5"></div>
            )}
          </div>
          <div className="mt-3 sm:pe-8">
            <h3 className="text-lg font-semibold text-main">
              {edu.schoolName}
            </h3>
            <p>{edu.degree}</p>
            <time className="block my-1.5 text-sm font-normal leading-none text-gray-400">
              {edu.duration}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default EducationTimeline; 