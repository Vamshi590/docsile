import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import { BACKEND_URL } from "@/config";


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
function Memberships() {
  const [formData, setFormData] = useState({
    societyName: "",
    position: "",
    relatedDepartment : "",
    membershipId: "",
  });

  const { id } = useParams(); // Get user ID from URL params

  const navigate = useNavigate();

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
        `${BACKEND_URL}/add-memberships/${id}`,
        {
          societyName: formData.societyName,
          position: formData.position,
          membershipId: formData.membershipId,
          relatedDepartment : formData.relatedDepartment
        }
      );

      console.log(response);
      navigate(`/profile/${id}`);
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
                <h2 className="text-xl font-semibold mb-4">Add Memberships</h2>

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
                label="Society Name"
                name="societyName"
                placeholder="Ex: Telangana Opthalmology Society"
                value={formData.societyName}
                onChange={handleChange}
              />

              <CustomInput
                label="Position"
                name="position"
                placeholder="Ex: Member"
                value={formData.position}
                onChange={handleChange}
              />

              <CustomInput
                label="Related Department"
                name="relatedDepartment"
                placeholder="Ex: Opthalmology"
                value={formData.relatedDepartment}
                onChange={handleChange}
              />

              <div className="my-4">
                <label className="block text-md   font-semibold mb-1">
                  Membership Id
                </label>
                <div>
                    <p className="text-xs">**Id is used to validate when you join society pages, it is not shown to other users</p>
                </div>
                <input
                  name="membershipId"
                  type="text"
                  placeholder="Ex: C1234"
                  value={formData.membershipId}
                  onChange={handleChange}
                  className="w-full  py-2 border-b placeholder:text-sm border-b-main focus:outline-none "
                />
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

export default Memberships;
