import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import MainHead from "../components/MainHead";
import InputWithPlace from "../components/InputWithPlace";

import Dropdown2 from "../components/Dropdown2";
import background2 from "../assets/background2.svg";
import { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { BACKEND_URL } from "../config";
import CountrySelector from "../components/CountrySelector";
import StateCitySelector from "../components/StateCitySelector";
import { Country } from "country-state-city";
import { doctorSpecialisations } from "../doctorSpecialisations";
import DropDownWithSearch from "../components/DropDownWithSearch";

function DoctorSignup() {
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.state;

  console.log(id);

  const options = ["Mr", "Ms"];

  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | null
  >("Specialization");

  function handleSpecializationSelect(option: string) {
    setSelectedSpecialization(option);
  }

  //county and state and city

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [doctorCountry, setDoctorCountry] = useState("");

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const country = Country.getCountryByCode(countryCode);
    const countryName = country?.name || "";
    console.log(countryName);
    setDoctorCountry(countryName);
  };

  const handleStateCitySelect = (city: string, state: string) => {
    setSelectedCity(city);
    setSelectedState(state);
  };

  const DoctorLocation = `${selectedCity},${selectedState}`;

  //zod schema

  const doctorDetailsSchema = z.object({
    fullname: z.string().min(3, { message: "Enter valid Full Name" }),
    hospitalname: z.string().min(4, { message: "Enter valid Hospital Name" }),
    selectedSpecialization: z
      .string()
      .min(4, { message: "Enter valid Specialization" }),
    doctorCountry: z.string().min(3, { message: "Enter valid Country" }),
    DoctorLocation: z.string().min(3, { message: " Enter valid City" }),
    gender: z.string().min(3, { message: "Enter Valid Gender" }),
  });

  //details

  const [doctorDetails, setDoctorDetails] = useState({
    fullname: "",
    hospitalname: "",
  });

  //Handling Gender

  const [selectedOption, setSelectedOption] = useState<string | null>("Title");

  let gender = "";

  if (selectedOption === "Mr") {
    gender = "Male";
  } else if (selectedOption === "Ms") {
    gender = "Female";
  }

  //handling dropdown select

  function handleDropdownSelect(option: string) {
    setSelectedOption(option);
    console.log(selectedOption);
  }

  //handling input changes

  function handleChange(e: any) {
    setDoctorDetails({ ...doctorDetails, [e.target.name]: e.target.value });
  }

  //Button click send details to backend

  const finalData = {
    ...doctorDetails,
    doctorCountry,
    DoctorLocation,
    selectedSpecialization,
    gender,
  };

  //BACKEND Call

  async function handleClick(e: any) {
    e.preventDefault();


    const result = doctorDetailsSchema.safeParse(finalData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(`${firstError.path[0]}: ${firstError.message}`);
      return;
    }

    const loadingToast = toast.loading("Loading");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/signup/doctor`,
        {
          name: doctorDetails.fullname,
          country: doctorCountry,
          city: DoctorLocation,
          organisation_name: doctorDetails.hospitalname,
          specialisation_field_of_study: selectedSpecialization,
          gender: gender,
          id: id,
        }
      );

      console.log(response);

      toast.dismiss(loadingToast);

      toast.success("User Created Successfully");

      navigate("/", { state: id });
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

    console.log(doctorDetails);
  }

  return (
    <div className="bg-slate-100 flex items-center justify-center h-screen overflow-auto no-scrollbar">
      <div className="bg-white flex-col rounded-lg p-8 max-w-md w-full  h-screen">
        <div className="w-full">
          <img className="w-full" src={background2} alt="background" />
        </div>

        <MainHead />
        <Toaster />

        <div className="mt-8">
          <p className="text-center text-sm font-semibold">
            Join a network of experts commited to advancing healthcare together
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2  flex-col items-center justify-center">
          <div className="col-span-1 mt-5">
            <Dropdown2
              label={"Title"}
              onSelect={handleDropdownSelect}
              options={options}
            />
          </div>
          <div className="col-span-3">
            <InputWithPlace
              place="Full Name"
              type="text"
              onChange={handleChange}
              value={doctorDetails.fullname}
              name="fullname"
            />
          </div>
        </div>

        <InputWithPlace
          place="Hospital / Institute Name"
          type="text"
          onChange={handleChange}
          value={doctorDetails.hospitalname}
          name="hospitalname"
        />
        {/* <InputWithPlace
          place="Specialization"
          type="text"
          onChange={handleChange}
          value={doctorDetails.specialization}
          name="specialization"
        /> */}

        {/* <Dropdown2 label = "Specialization" options = {doctorSpecialisations} onSelect = {handleSpecializationSelect}/> */}

        <DropDownWithSearch
          place="Specialization"
          onSelect={handleSpecializationSelect}
          dropDownOptions={doctorSpecialisations}
        />

        <CountrySelector onCountrySelect={handleCountrySelect} />

        <StateCitySelector
          selectedCountry={selectedCountry}
          onStateCitySelect={handleStateCitySelect}
        />

        <div className="flex mt-6 justify-between">
          <Link
            className="flex flex-col justify-center items-center font-semibold"
            to={"/category"}
          >
            Back to Categories
          </Link>
          <Button
            label="Continue"
            bgColor="bg-main"
            textColor="text-white"
            size="half"
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
}

export default DoctorSignup;
