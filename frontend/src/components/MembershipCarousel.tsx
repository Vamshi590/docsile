import { motion } from "framer-motion";

interface Membership {
  id: string;
  icon: string;
  societyName: string;
  position: string;
}

interface MembershipCarouselProps {
  memberships: Membership[];
  onAddClick: () => void;
}

const MembershipCarousel = ({ memberships, onAddClick }: MembershipCarouselProps) => {
  if (!memberships?.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 rounded-lg">
        <p className="text-gray-600 text-lg mb-4">No memberships added yet</p>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 text-main hover:underline"
        >
          Add your first membership
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-12">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-shrink-0 gap-16"
      >
        {memberships.map((membership) => (
          <div key={membership.id} className="flex flex-col border border-main items-center rounded-3xl px-2 py-4 w-1/4 shadow-md hover:shadow-2xl cursor-default">
            <div className="rounded-full w-12 h-12">
              <img
                className="rounded-full transform duration-300 ease-in-out transition hover:-translate-y-2"
                src={membership.icon}
                alt={`${membership.societyName} icon`}
              />
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-main text-lg font-semibold">
                {membership.societyName}
              </p>
              <p className="text-gray-600 text-sm">{membership.position}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MembershipCarousel; 