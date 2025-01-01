import { useState } from "react";
import Button from "../components/Button";
import Dropdown2 from "../components/Dropdown2";
import InputWithPlace from "../components/InputWithPlace";
import MainHead from "../components/MainHead";
import SubHeading from "../components/SubHeading";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import CountrySelector from "../components/CountrySelector";
import StateCitySelector from "../components/StateCitySelector";
import background from "../assets/background2.svg";
import { Country } from "country-state-city";

function OrganisationSignup() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userId") || "");
  const email = localStorage.getItem("email");

  const id = location.state || userId;

  const [selectedOption, setSelectedOption] = useState<string | null>(
    "Type Of Organisation"
  );

  const typeOptions = [
    "Hospital",
    "Medical College",
    "Medical Society",
    "Pharmacueticals",
  ];

  const [organisationDetails, setOrganisationDetails] = useState({
    name: "",
  });

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [organisationCountry, setOrganisationCountry] = useState("");

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const country = Country.getCountryByCode(countryCode);
    const countryName = country?.name || "";
    console.log(countryName);
    setOrganisationCountry(countryName);
  };

  const handleStateCitySelect = (city: string, state: string) => {
    setSelectedCity(city);
    setSelectedState(state);
  };

  const organisationLocation = `${selectedCity}, ${selectedState}`;

  //zod schema

  const organisationDetailsSchema = z.object({
    name: z.string().min(3, { message: "Enter valid Full Name" }),
    organisationCountry: z.string().min(3, { message: "Enter valid Country" }),
    organisationLocation: z.string().min(3, { message: " Enter valid City" }),
    selectedOption: z
      .string()
      .min(5, { message: "Enter valid organisation type" }),
  });

  function handleDropdownSelect(option: string) {
    setSelectedOption(option);
    console.log(selectedOption);
  }

  function handleChange(e: any) {
    setOrganisationDetails({
      ...organisationDetails,
      [e.target.name]: e.target.value,
    });
  }

  async function handleClick(e: any) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please sign in first");
      navigate('/auth/signup');
      return;
    }

    const finalData = {
      ...organisationDetails,
      organisationCountry,
      organisationLocation,
      selectedOption,
    };

    const result = organisationDetailsSchema.safeParse(finalData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(`${firstError.path[0]}: ${firstError.message}`);
      return;
    }

    const loadingToast = toast.loading("loading");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/signup/organisation`,
        {
          email: email,
          organisation_name: organisationDetails.name,
          country: organisationCountry,
          city: organisationLocation,
          organisation_type: selectedOption,
          id: id,
        },
        {withCredentials: true}
      );

      console.log(response);

      toast.dismiss(loadingToast);
      toast.success("Organisation Created Successfully");
      navigate("/");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      
      if (error.response?.status === 401) {
        toast.error("Please sign in again");
        navigate('/auth/signup');
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
        <div className="w-full mb-4">
          <img className="w-full" src={background} alt="background" />
        </div>

        <MainHead />
        <SubHeading content="Expand your Organisation's reach in Healthcare Innovation" />

        <Toaster />

        <Dropdown2
          label="Type Of Organisation"
          onSelect={handleDropdownSelect}
          options={typeOptions}
        />

        <InputWithPlace
          place="Name of Organisation"
          type="text"
          onChange={handleChange}
          value={organisationDetails.name}
          name="name"
        />

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

export default OrganisationSignup;
