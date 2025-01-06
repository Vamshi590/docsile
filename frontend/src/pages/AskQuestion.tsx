import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdToggleOn, MdToggleOff, MdOutlineClose } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import profilepic from "../assets/ProfilePic.svg";
import { FaArrowRight } from "react-icons/fa6";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { toast, Toaster } from "sonner";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [visibility, setVisibility] = useState("anyone");

  const [referenceTags, setReferenceTags] = useState([]);

  const [referenceText, setReferenceText] = useState("");

  const [showSecondForm, setShowSecondForm] = useState(true);

  const navigate = useNavigate();

  const localUserID = localStorage.getItem("Id");
  const { id } = useParams();

  const userId = localUserID || id;

  const handleNext = () => {
    if (!title.trim()) {
      toast.error("Please enter a question title");
      return;
    }
    setShowSecondForm(false);
  };

  const handleBack = () => {
    setShowSecondForm(true);
  };

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedPhotos = Array.from(event.target.files);
      setPhotos((prevPhotos) => [...prevPhotos, ...selectedPhotos].slice(0, 4)); // Max 4 photos
    }
  };

  // Remove photo
  const removePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  function handleInterestsChange(e: any) {
    setReferenceText(e.target.value);
  }

  const interestText = referenceText;

  function handleInterests() {
    //@ts-ignore
    setReferenceTags([...referenceTags, interestText]);
    setReferenceText("");
  }

  function handleCancel() {
    navigate("/");
  }

  //backend

  async function handleSubmit() {
    if (referenceTags.length === 0) {
      toast.error("Please add at least one reference tag");
      return;
    }

    if (photos.length > 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }

    const promise = async () => {
      try {
        let imageURLs = [];

        // If there are photos, upload to S3 first
        if (photos.length > 0) {
          // Get presigned URLs for all photos
          const { data } = await axios.post(`${BACKEND_URL}/get-upload-urls`, {
            fileCount: photos.length,
            fileTypes: photos.map(photo => photo.type),
            id : userId,
            type : "questions"
          });

          // Upload all photos in parallel
          const uploadPromises = photos.map(async (photo, index) => {
            const uploadResponse = await axios.put(data.urls[index].uploadURL, photo, {
              headers: {
                'Content-Type': photo.type
              },
              withCredentials: false
            });

            if (uploadResponse.status !== 200) {
              throw new Error('Failed to upload photo');
            }

            return data.urls[index].imageURL;
          });

          imageURLs = await Promise.all(uploadPromises);
        }

        // Post question with image URLs if they exist
        const { data: questionData } = await axios.post(
          `${BACKEND_URL}/questions/ask-question/${userId}`,
          {
            title,
            description,
            referenceTags,
            anonymous,
            urgency: "high",
            imageUrls: imageURLs // Changed to array of URLs
          }
        );

        navigate('/questions');
        return 'Question posted successfully!';
      } catch (e: any) {
        throw new Error(e.response?.data?.message || "Failed to post question");
      }
    };

    toast.promise(promise(), {
      loading: 'Posting your question...',
      success: (data) => data,
      error: (err) => err.message
    });
  }

  // Add this function to handle tag removal
  const removeTag = (indexToRemove: number) => {
    setReferenceTags(referenceTags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="h-screen max-w-sm mx-auto p-2 bg-white rounded-lg shadow-md space-y-4 relative overflow-auto no-scrollbar">
      {/* Top Bar - Visibility, Anonymous Toggle, and Post */}

      <Toaster/>
      <div
        className={`transition-transform h-screen duration-500 ease-in-out ${
          showSecondForm ? "translate-y-0" : "translate-y-0"
        }`}
      >
        {showSecondForm ? (
          <div className={`h-screen${showSecondForm ? "hidden" : "block"}`}>
            <div className="flex justify-between items-center p-2 ">
              <div
                onClick={handleCancel}
                className="flex items-center space-x-3"
              >
                <MdOutlineClose className="text-xl text-gray-500 cursor-pointer hover:text-gray-700" />
              </div>

              <div className="flex flex-row items-center space-x-2 justify-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                  {/* Placeholder for profile picture */}
                  <img src={profilepic} alt="Profile" />
                </div>
                <p className="text-base font-medium">Ask Question</p>
              </div>

              <div>
                <div
                  onClick={handleNext}
                  className="bg-blue-500 p-3 rounded-full shadow-lg text-white cursor-pointer hover:bg-main transition duration-300"
                >
                  <FaArrowRight className="text-xl" />
                </div>
              </div>
            </div>

            {/* Question Title */}
            <div className="relative mb-3 border-b border-b-main">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Question title..."
                className="w-full p-3 text-base border-none rounded-lg focus:outline-none focus:ring-1 focus:ring-main transition duration-300"
                required
                onInvalid={(e) => {
                  e.preventDefault();
                  toast.error("Please enter a question title");
                }}
              />
            </div>

            {/* Question Description */}
            <div className="relative mb-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your question..."
                className="w-full p-3 text-base border-none rounded-lg focus:outline-none focus:ring-1 focus:ring-main transition duration-300 resize-none"
                rows={7}
              />
            </div>

            {/* Photo Upload & Preview */}
            {photos.length > 0 && (
              <div className="flex space-x-2 overflow-x-auto mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Uploaded ${index + 1}`}
                      className="h-20 w-20 object-contain rounded-lg transition duration-300"
                    />
                    <button
                      className="absolute top-1 right-1 bg-white p-1 rounded-full hover:bg-red-500 hover:text-white transition duration-300"
                      onClick={() => removePhoto(index)}
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Floating Photo Upload Button */}
            <div className="absolute bottom-6 right-6">
              <label htmlFor="photo-upload">
                <div className="bg-blue-500 p-3 rounded-full shadow-lg text-white cursor-pointer hover:bg-main transition duration-300">
                  <LuImagePlus className="text-xl" />
                </div>
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                id="photo-upload"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className={`h-screen`}>
            <div className="flex justify-between items-center p-2 mt-1">
              <div onClick={handleBack} className="flex items-center space-x-3">
                <GoArrowLeft className="text-xl text-gray-500 cursor-pointer hover:text-gray-700" />
              </div>

              <div className="flex flex-row items-center space-x-2 justify-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                  {/* Placeholder for profile picture */}
                  <img src={profilepic} alt="Profile" />
                </div>
                <p className="text-base font-medium">Ask Question</p>
              </div>

              <div onClick={handleSubmit}>
                <div className="bg-blue-500 px-3 py-1 rounded-3xl shadow-lg text-white cursor-pointer hover:bg-main transition duration-300">
                  <p className="text-base">Ask</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-b border-b-main">
              <div className="flex flex-col justify-center items-center">
                <div className="w-full px-2 py-1">
                  <p>Refference Tags :</p>
                </div>

                <div className="w-full px-2 py-1 mb-4">
                  <p className="text-xs">
                    ** Refference tags help us to deliver your question to the
                    target people which can reduce the time for question being
                    answered
                  </p>
                </div>

                <div
                  className={
                    referenceTags.length > 0
                      ? " rounded-2xl w-full"
                      : "rounded-2xl transition duration-300 ease shadow-sm focus:outline-none focus:ring-1 focus:ring-main focus:shadow w-full"
                  }
                >
                  {referenceTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 px-2 pt-2">
                      {referenceTags?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-black border border-second rounded-full relative group"
                        >
                          {skill}
                          <button
                            onClick={() => removeTag(index)}
                            className="absolute -top-1 -right-1 bg-white rounded-full w-4 h-4 flex items-center justify-center text-xs border border-second hover:bg-gray-600 hover:text-white hover:border-black"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex w-full max-w-sm min-w-[200px] rounded-2xl transition duration-300 ease">
                    <input
                      className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm focus:outline-none px-3 py-3"
                      placeholder="Enter Reference tags (required)"
                      type="text"
                      onChange={handleInterestsChange}
                      value={interestText}
                      required
                    />

                    <button
                      className={`justify-end px-2 text-base font-semibold ${
                        referenceTags.length === 0 ? 'text-black' : ''
                      }`}
                      onClick={handleInterests}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center w-full py-4 items-center border-b border-b-main">
              {/* Right Side: Anonymous Toggle, Label and Post */}
              <div className="flex items-center w-full space-x-4 px-2">
                {/* Anonymous Toggle with Label */}
                <div className="flex justify-between w-full items-center space-x-6">
                  <span className="">Anonymous :</span>

                  <div>
                    <button
                      onClick={() => setAnonymous(!anonymous)}
                      className="flex justify-center items-center  p-2 rounded-full transition duration-300 ease-in-out"
                    >
                      {anonymous ? (
                        <MdToggleOn
                          size={40}
                          className="text-blue-500 text-2xl"
                        />
                      ) : (
                        <MdToggleOff
                          size={40}
                          className="text-gray-400 text-2xl"
                        />
                      )}

                      <div></div>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs px-2">
                  **This enables you to not share your name while posting,
                  others can see only question
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 p-2">
              {/* Left Side: Close and Profile */}
              <div className="flex items-center space-x-3">
                <div className="flex flex-row items-center justify-center">
                  <p className="">Share with :</p>
                </div>

                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="border-none focus:outline-none text-gray-700 cursor-pointer"
                >
                  <option value="anyone">Anyone</option>
                  <option value="followers">Followers</option>
                  <option value="college">College</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AskQuestion;
