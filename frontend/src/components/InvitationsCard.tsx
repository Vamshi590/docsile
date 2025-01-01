import { capitalizeFirstLetter } from "@/functions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface InvitationCardProps {
  name: string;
  profession: string;
  location: string;
  connections: string;
  profileImage: string;
  backgroundBanner?: string;
  organisation: string;
  id: string;
  handleClick: () => void;
  isFollowing?: boolean;
  onUnfollow?: () => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  name,
  profession,
  location,
  connections,
  profileImage,
  organisation,
  backgroundBanner,
  id,
  isFollowing: initialIsFollowing = false,
  handleClick,
  onUnfollow
}) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  function handleConnectionsProfileClick() {
    navigate(`/connections-profile/${id}`);
  }

  const handleFollowClick = async () => {
    setIsFollowing(true);
    
    try {
      await handleClick();
    } catch (error) {
      setIsFollowing(false);
      toast.error("Failed to follow user");
      console.error(error);
    }
  };

  return (
    <div>
      {backgroundBanner && (
        <div className="relative border border-main rounded-lg overflow-hidden ">
          {backgroundBanner && (
            <div className="relative h-32">
              <img
                src={backgroundBanner}
                alt="Background"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex relative p-1 text-left">
            {/* Profile Image */}
            <div className="">
              <img
                src={profileImage}
                alt={`${name}'s profile`}
                className="w-1/4 rounded-full  border-white absolute -top-12 left-4"
              />
            </div>

            {/* Text Content */}
            <div className="ml-3 mt-12 pt-2 mb-6">
              <h3 className="font-bold text-gray-800">{name}</h3>
              <p className="text-sm text-gray-600">{profession}</p>
              <p className="text-xs text-gray-500">{location}</p>
              <p className="text-xs text-gray-400 mr-2">{connections}</p>
            </div>
            {/* Follow Button */}
            <div className="absolute top-10 right-10">
              <button className="text-main bg-white py-1 px-4  mt-4 rounded-3xl border-main hover:bg-main hover:text-white">
                Follow
              </button>
            </div>
          </div>
        </div>
      )}
      {!backgroundBanner && (
        <div
          
          className="flex items-center lg:flex-col lg:justify-center lg:items-center lg:text-center p-2 shadow-md rounded-2xl cursor-pointer bg-white overflow-hidden"
        >
          <img
            src={profileImage}
            alt={`${name}'s profile`}
            className="w-16 h-16 rounded-full mr-2"
          />
          <div onClick={handleConnectionsProfileClick} className="flex-1  w-60">
            <h3 className="font-semibold  text-gray-800">
              {capitalizeFirstLetter(name)}
            </h3>
            {profession && (
              <p className="text-xs text-gray-600 truncate ">
                {profession} |{" "}
                <span className="text-xs text-gray-500">
                  {capitalizeFirstLetter(organisation)} | {location}{" "}
                </span>{" "}
                |{" "}
              </p>
            )}

            <p className="text-xs pt-1 text-gray-400">{connections}</p>
          </div>
          <button 
            onClick={handleFollowClick} 
            className={`py-1 px-3 text-xs mt-2 rounded-3xl font-semibold ${
              isFollowing 
                ? 'bg-gray-100 text-gray-700' 
                : 'bg-white text-main hover:text-white hover:bg-main'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      )}
    </div>
  );
};

export default InvitationCard;
