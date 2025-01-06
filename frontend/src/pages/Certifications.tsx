import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineClose } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

import { AiOutlineFilePdf } from "react-icons/ai";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { GoArrowLeft } from "react-icons/go";
import { toast } from "sonner";

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

const Certifications: React.FC = () => {
  const [formData, setFormData] = useState({
    certificationName: "",
    issuingOrganization: "",
    issueDate: "",
    urlToCredential: "",
    description: "",
  });

  const [showSecondPage, setShowSecondPage] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      // Check file type
      const isValidType = [
        "image/jpeg",
        "image/png",
        "application/pdf",
      ].includes(uploadedFile.type);
      if (!isValidType) {
        alert("Only PDF, JPG, and PNG files are allowed.");
        return;
      }
      // Preview for image files only
      if (uploadedFile.type.startsWith("image")) {
        setPreviewUrl(URL.createObjectURL(uploadedFile));
      } else {
        setPreviewUrl(null);
      }
      setFile(uploadedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  function handleGoBack() {
    setShowSecondPage(false);
  }

  //backend

  async function handleSubmit() {

    const promise = async () => {
      try{
        let imageURL = null;
        if(file){
          const {data : uploadData} = await axios.get(`${BACKEND_URL}/get-upload-url`);

          const uploadResponse = await axios.put(uploadData.uploadURL, file, {
            headers: {
              "Content-Type": file.type,
            },
            withCredentials: false,
          })

          if(uploadResponse.status !== 200){
            throw new Error("Failed to upload file");
          }

          imageURL = uploadData.imageURL;

          const {data : certificateData} = await axios.post(`${BACKEND_URL}/add-certificate/${id}`, {
          certificateName : formData.certificationName,
          issuingOrganisation : formData.issuingOrganization,
          issueDate : formData.issueDate,
          certificateURL : formData.urlToCredential,
          descreption : formData.description,
          imageUrl : imageURL
          })
          console.log(certificateData);

          navigate(`/profile/${id}`); ;
          return 'certificate added';

        }
      }catch(e : any){
        throw new Error(e.response?.data?.message || "Failed to add certificate");

      }
    }

    toast.promise(promise(), {
      loading : "Adding certificate...",
      success : (data) => data,
      error : (err) => err.message
    })



  }

  return (
    <div className="bg-slate-100 flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg p-2 max-w-sm w-full shadow-md space-y-4 relative h-screen">
        <div className={`transition-transform duration-500 ease-in-out `}>
          {!showSecondPage ? (
            <>
              <div className="flex flex-col justify-center items-center w-full">
                <div className="flex flex-row justify-between items-center w-full p-2">
                  <MdOutlineClose
                    onClick={handleCancel}
                    className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700 mb-3"
                  />
                  <h2 className="text-xl font-semibold mb-4">
                    Add Certifications
                  </h2>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowSecondPage(true)}
                      className="bg-blue-500 p-3 rounded-full text-white cursor-pointer hover:bg-blue-600 transition duration-300"
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Inputs */}

              <div className="flex flex-col justify-center  p-2 w-full">
                <CustomInput
                  label="Certification Name"
                  name="certificationName"
                  placeholder="Ex: Certified Medical Assistant (CMA)"
                  value={formData.certificationName}
                  onChange={handleChange}
                />
                <CustomInput
                  label="Issuing Organization"
                  name="issuingOrganization"
                  placeholder="Ex: Association of Indian Medical Device Industry (AIMED)"
                  value={formData.issuingOrganization}
                  onChange={handleChange}
                />
                <CustomInput
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  placeholder="Ex: 2024-01-01"
                  value={formData.issueDate}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-8 mt-4 border-b border-b-main">
                <label className="block text-base px-2 font-semibold mb1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="A brief description of what the certification entails or its relevance"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-2 py-2 placeholder:text-sm rounded-2xl focus:outline-none "
                  rows={3}
                ></textarea>
              </div>
            </>
          ) : (
            <div className="transition-transform">
              <div className="flex flex-col justify-center items-center w-full">
                <div className="flex flex-row justify-between items-center w-full p-2">
                  <GoArrowLeft
                    onClick={handleGoBack}
                    className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700 mb-3"
                  />
                  <h2 className="text-xl font-semibold mb-4">
                    Add Certifications
                  </h2>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmit}
                      className="bg-blue-500 px-2 py-px rounded-full text-white cursor-pointer hover:bg-blue-600 transition duration-300"
                    >
                      <p>Add</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="my-2">
                 <CustomInput
                  label="URL to Credential (if applicable)"
                  name="urlToCredential"
                  placeholder="Ex: https://www.credential.com"
                  value={formData.urlToCredential}
                  onChange={handleChange}
                />
              </div>
             

              <div className="flex flex-col justify-center w-full mb-6">
                <p>Certificate (If any)</p>

                <p className="text-xs mt-px">
                  ** Upload your certificate to show others about your
                  Achievements
                </p>
              </div>
              <div className="flex flex-col items-center w-full justify-center border border-dashed border-main  rounded-lg shadow-sm p-6">
              

                {!file ? (
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="flex flex-col items-center justify-center bg-blue-100 text-blue-500 rounded-full p-4 mb-2">
                      <LuImagePlus className="text-4xl" />
                    </div>
                    <p className="text-base font-semibold text-slate-600 mb-2">
                      Upload Your Certificate
                    </p>
                    <p className="text-xs text-slate-400">
                      (Only JPG, PNG, or PDF files)
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-full flex flex-col items-center">
                    {file.type === "application/pdf" ? (
                      <div className="flex items-center bg-gray-100 p-4 rounded-lg w-full justify-between">
                        <AiOutlineFilePdf className="text-red-500 text-4xl" />
                        <span className="text-sm font-medium text-slate-700">
                          {file.name}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={previewUrl!}
                        alt="Uploaded preview"
                        className="object-contain rounded-lg w-full h-48"
                      />
                    )}
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <AiOutlineClose />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certifications;
