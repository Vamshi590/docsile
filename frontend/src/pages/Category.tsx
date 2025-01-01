// components

import CategoryCard from "../components/CategoryCard";
import MainHead from "../components/MainHead";

//logos

import organisationLogo from "../assets/organisationlogo.svg";
import doctorLogo from "../assets/doctorLogo.svg";
import studentLogo from "../assets/studentLogo.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { BACKEND_URL } from "../config";
import { getCategoryId } from "@/functions";

function Category() {
  //hooks

  const navigate = useNavigate();

  async function handleCategory(category: string) {
    const googleEmail = localStorage.getItem("googleEmail");
    const googlePassword = localStorage.getItem("googlePassword");

    if (googleEmail && googlePassword) {
      try {
        const response = await axios.post(`${BACKEND_URL}/auth/signup`, {
          email: googleEmail,
          password: googlePassword,
          category: category,
        });
        const userId = response.data.id;
        // Clear temporary Google data
        localStorage.removeItem("googleEmail");
        localStorage.removeItem("googlePassword");
        // Navigate to appropriate signup form
        navigate(`/signup/${category}/${userId}`, { state: userId });
      } catch (e) {
        toast.error("Failed to create account");
        console.error(e);
      }
    } else {
      // Handle regular navigation to signup
      navigate(`/auth/signup`, { state: { id: getCategoryId(category)} });
    }
  }

  // handling category clicks

  function handleOrganisation() {
    handleCategory("organisation");
  }

  function handleDoctor() {
    handleCategory("doctor");
  }

  function handleStudent() {
    handleCategory("student");
  }

  return (
    <div className="bg-slate-100 flex items-center justify-center h-screen">
      <div className="bg-white flex-col rounded-lg p-8 max-w-md w-full  h-screen">
        <MainHead />

        <div className="flex justify-center mt-8">
          <div className="flex-col">
            <p className="font-semibold text-center text-base p-2">
              please choose your Category and share your details to begin the
              process
            </p>
          </div>
        </div>

        <CategoryCard
          title="Organisation"
          subtitle="Hospitals, Colleges, Societies and Medical companies"
          icon={organisationLogo}
          onClick={handleOrganisation}
        />

        <CategoryCard
          title="Doctor"
          subtitle="Medical Professionals and practitioners"
          icon={doctorLogo}
          onClick={handleDoctor}
        />
        <CategoryCard
          title="Medical Student"
          subtitle="Future Healthcare Leaders and Innovaters"
          icon={studentLogo}
          onClick={handleStudent}
        />
      </div>
    </div>
  );
}

export default Category;
