import Button from "../components/Button";
import MainHead from "../components/MainHead";
import SubHeading from "../components/SubHeading";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dropdown2 from "../components/Dropdown2";
import { useState } from "react";
import InputWithPlace from "../components/InputWithPlace";
import axios from "axios";
import { BACKEND_URL } from "../config";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import { Country } from "country-state-city";
import CountrySelector from "../components/CountrySelector";
import StateCitySelector from "../components/StateCitySelector";
import DropDownWithSearch from "../components/DropDownWithSearch";
import { studentPrograms } from "../studentPrograms";
import { studentDepartments } from "../studentDepartments";
function StudentSignup() {
  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state;

  const options = ["Mr", "Ms"];

  const [selectedOption, setSelectedOption] = useState<string | null>("Title");

  const [selectedProgram, setSelectedProgram] = useState<string>("");

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const [studentDetails, setStudentDetails] = useState({
    fullname: "",

    collegeName: "",
  });

  //country and state and city

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [studentCountry, setStudentCountry] = useState("");

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const country = Country.getCountryByCode(countryCode);
    const countryName = country?.name || "";
    console.log(countryName);
    setStudentCountry(countryName);
  };

  const handleStateCitySelect = (city: string, state: string) => {
    setSelectedCity(city);
    setSelectedState(state);
  };

  function handleProgramSelect(option: string) {
    setSelectedProgram(option);
  }

  function handleDepartmentSelect(option: string) {
    setSelectedDepartment(option);
  }

  const studentLocation = `${selectedCity}, ${selectedState}`;

  let gender = "";

  if (selectedOption === "Mr") {
    gender = "Male";
  } else if (selectedOption === "Ms") {
    gender = "Female";
  }


 
  function handleChange(e: any) {
    setStudentDetails({ ...studentDetails, [e.target.name]: e.target.value });
  }

  function handleDropdownSelect(option: any) {
    setSelectedOption(option);
  }

  // zod schema

  const studentDetailsSchema = z.object({
    fullname: z.string().min(3, { message: "Enter valid Full Name" }),
    collegeName: z.string().min(4, { message: "Enter valid College Name" }),
    selectedProgram: z
      .string()
      .min(4, { message: "Enter valid Field of study" }),
    studentCountry: z.string().min(3, { message: "Enter valid Country" }),
    studentLocation: z.string().min(3, { message: " Enter valid City" }),
    selectedDepartment: z
      .string()
      .min(3, { message: "Enter valid Department" }),
    gender: z.string().min(3, { message: "Enter Valid Title" }),
  });


  const finalData = {
    ...studentDetails,
    studentCountry,
    studentLocation,
    selectedDepartment,
    selectedProgram,
    gender,
  };

  async function handleClick(e: any) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in first");
      navigate("/auth/signup");
      return;
    }

    const result = studentDetailsSchema.safeParse(finalData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(`${firstError.path[0]}: ${firstError.message}`);
      return;
    }

    const loadingToast = toast.loading("Loading");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/signup/student`,
        {
          name: studentDetails.fullname,
          country: studentCountry,
          city: studentLocation,
          organisation_name: studentDetails.collegeName,
          specialisation_field_of_study: selectedProgram,
          department: selectedDepartment,
          gender: gender,
          id: id,
        },
        { withCredentials: true }
      );

      console.log(response);
      toast.dismiss(loadingToast);
      toast.success("Student Profile Created Successfully");
      navigate("/");
    } catch (error: any) {
      toast.dismiss(loadingToast);

      if (error.response?.status === 401) {
        toast.error("Please sign in again");
        navigate("/auth/signup");
        return;
      }

      if (error.response) {
        toast.error(`Error: ${error.response.data}`);
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  }

  return (
    <div className="bg-slate-100 flex items-center justify-center h-screen">
      <div className="bg-white flex-col rounded-lg p-8 max-w-md w-full  h-screen">
        <MainHead />
        <SubHeading content="Connect with mentors, access resources and shape your future in medicine." />

        <div className="grid grid-cols-4 gap-2  flex-col items-center justify-center">
          <div className="col-span-1 mt-5">
            <Dropdown2
              label="Title"
              onSelect={handleDropdownSelect}
              options={options}
            />
          </div>
          <div className="col-span-3">
            <InputWithPlace
              place="Full Name"
              type="text"
              onChange={handleChange}
              value={studentDetails.fullname}
              name="fullname"
            />
          </div>
        </div>
        <Toaster />
        <InputWithPlace
          place="College / University Name"
          type="text"
          onChange={handleChange}
          value={studentDetails.collegeName}
          name="collegeName"
        />

        <DropDownWithSearch
          place="Current Programme (ex: MBBS)"
          onSelect={handleProgramSelect}
          dropDownOptions={studentPrograms}
        />

        <DropDownWithSearch
          place="Department (ex: Cardiology)"
          onSelect={handleDepartmentSelect}
          dropDownOptions={studentDepartments}
        />

        {/* <InputWithPlace
          place="Field of Study"
          type="text"
          onChange={handleChange}
          value={studentDetails.field_of_study}
          name="field_of_study"
        /> */}

        <CountrySelector onCountrySelect={handleCountrySelect} />

        <StateCitySelector
          selectedCountry={selectedCountry}
          onStateCitySelect={handleStateCitySelect}
        />
        <div className="flex mt-6 justify-between">
          <Link
            to={"/category"}
            className="flex flex-col justify-center items-center font-semibold"
          >
            Back to Categories
          </Link>
          <Button
            label="Sign UP"
            bgColor="bg-main"
            textColor="text-white"
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
}

export default StudentSignup;
