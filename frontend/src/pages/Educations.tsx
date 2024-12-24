import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import { BACKEND_URL } from "@/config";
import { studentPrograms } from "@/studentPrograms";
import { studentDepartments } from "@/studentDepartments";
import DropdownWithSearchAndLabel from "@/components/DropdownWithSearchAndLabel";

interface InputProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const CustomInput: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) => (
  <div className="my-4">
    <label className="block text-md   font-semibold mb-1">{label}</label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full  py-2 border-b placeholder:text-sm border-b-main focus:outline-none "
    />
  </div>
);

function Educations() {
  const [formData, setFormData] = useState({
    schoolName: "",
    startDate: "",
    endDate: "",
    grade: "",
  
  });

  const [selectedProgram, setSelectedProgram] = useState<string>("");

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const { id } = useParams(); // Get user ID from URL params

  const navigate = useNavigate();

  function handleProgramSelect(option: string) {
    setSelectedProgram(option);
  }

  function handleDepartmentSelect(option: string) {
    setSelectedDepartment(option);
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/profile/${id}`);
  }

  //backend

  async function handleSubmit() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/add-education/${id}`,
        {
          schoolName: formData.schoolName,
          degree : selectedProgram,
          department : selectedDepartment,
          startDate: formData.startDate,
          endDate : formData.endDate,
          grade: formData.grade,
        }
      );

      console.log(response);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="bg-slate-100 flex items-center justify-center  overflow-auto no-scrollbar">
      <div className="bg-white rounded-lg p-2 max-w-sm w-full shadow-md space-y-4 relative h-screen overflow-auto no-scrollbar">
        <div className={`transition-transform duration-500 ease-in-out `}>
          <>
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex flex-row justify-between items-center w-full p-2">
                <MdOutlineClose
                  onClick={handleCancel}
                  className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700 mb-3"
                />
                <h2 className="text-xl font-semibold mb-4">Add Education</h2>

                <div className="flex justify-end items-center">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 px-3 py-1 rounded-full text-white cursor-pointer hover:bg-blue-600 transition duration-300"
                  >
                    <p>Add</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Inputs */}

            <div className="flex flex-col justify-center  p-2 w-full">
              <CustomInput
                label="School Name"
                name="schoolName"
                placeholder="Ex: Dr. B. C. Roy National Award"
                value={formData.schoolName}
                onChange={handleChange}
              />
              <DropdownWithSearchAndLabel
                label="Degree"
                place="Ex: MBBS"
                onSelect={handleProgramSelect}
                dropDownOptions={studentPrograms}
              />

              <DropdownWithSearchAndLabel
                label="Department"
                place="Ex: Cardiology"
                onSelect={handleDepartmentSelect}
                dropDownOptions={studentDepartments}
              />

              <div className="flex flex-col items-center space-y-4 p-4">
                {/* Date Inputs */}
                <div className="flex space-x-4 items-center">
                  {/* Start Date */}
                  <div className="flex flex-col border-b border-b-main">
                    <label className="text-sm font-semibold mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className=" rounded-lg px-4 py-2 focus:outline-none "
                    />
                  </div>

                  {/* End Date */}
                  <div className="flex flex-col border-b border-b-main">
                    <label className="text-sm font-semibold mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className=" rounded-lg px-4 py-2 focus:outline-none "
                    />
                  </div>
                </div>
              </div>
         
            
             
                <CustomInput
                  label="Grade/ Percentage"
                  name="grade"
                  placeholder=""
                  value={formData.grade}
                  onChange={handleChange}
                />
            
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

export default Educations;
