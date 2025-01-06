import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineClose } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import profilepic from "../assets/ProfilePic.svg";
import { FaArrowRight } from "react-icons/fa6";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { toast } from "sonner";


function PublishPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [visibility, setVisibility] = useState("anyone");



  const [showSecondForm, setShowSecondForm] = useState(true);

  const localUserID = localStorage.getItem("Id");
  const { id } = useParams();

  const userId = localUserID || id;


  const navigate = useNavigate();

  const handleNext = () => {
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




  function handleCancel() {
    navigate("/");
  }

  //backend

  async function handleSubmit() {
    if (photos.length > 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }

    const promise = async () => {
      try {
        let imageURLs = [];

        if (photos.length > 0) {
          // Get presigned URLs for all photos
          const { data } = await axios.post(`${BACKEND_URL}/get-upload-urls`, {
            fileCount: photos.length,
            fileTypes: photos.map(photo => photo.type),
            id: userId,
            type : "posts"
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

        const { data: postData } = await axios.post(`${BACKEND_URL}/publish-post/${userId}`, {
          title,
          description,
          imageUrls: imageURLs,
        });

        navigate('/');
        return 'Post published successfully';
      } catch (e: any) {
        throw new Error(e.response?.data?.message || "Failed to publish post");
      }
    };

    toast.promise(promise(), {
      loading: 'Publishing post...',
      success: (data) => data,
      error: (err) => err.message
    });
  }

  return (
    <div className="h-screen max-w-sm mx-auto p-2 bg-white rounded-lg shadow-md space-y-4 relative overflow-auto no-scrollbar">
      {/* Top Bar - Visibility, Anonymous Toggle, and Post */}

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
                <p className="text-base font-medium">Publish Post</p>
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
                placeholder="Post Title..."
                className="w-full p-3 text-base border-none rounded-lg focus:outline-none focus:ring-1 focus:ring-main transition duration-300"
              />
            </div>

            {/* Question Description */}
            <div className="relative mb-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your Post..."
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
                <p className="text-base font-medium">Publish Post</p>
              </div>

              <div onClick={handleSubmit}>
                <div className="bg-blue-500 px-3 py-1 rounded-3xl shadow-lg text-white cursor-pointer hover:bg-main transition duration-300">
                  <p className="text-base">Post</p>
                </div>
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
}

export default PublishPost;
