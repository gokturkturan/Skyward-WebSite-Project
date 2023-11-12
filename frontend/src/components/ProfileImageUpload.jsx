import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import Loader from "./Loader";

const ProfileImageUpload = ({ photo, setPhoto, uploading, setUploading }) => {
  const [auth, setAuth] = useAuth();

  const handleUpload = async (e) => {
    try {
      let file = e.target.files[0];
      if (file) {
        setUploading(true);
        new Promise(() => {
          Resizer.imageFileResizer(
            file,
            1080,
            720,
            "JPEG",
            100,
            0,
            async (uri) => {
              try {
                const { data } = await axios.post("/users/upload-image", {
                  image: uri,
                });
                setPhoto(data);
                setUploading(false);
              } catch (error) {
                console.log(error);
                setUploading(false);
              }
            },
            "base64"
          );
        });
      }
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const handleDelete = async (photo) => {
    const answer = window.confirm("Do you want to delete this photo?");
    if (!answer) return;
    setUploading(true);
    try {
      const { data } = await axios.post("/users/delete-image", photo);
      if (data) {
        setPhoto(null);
        setUploading(false);
      }
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <>
      <div className="col-span-full mt-2">
        <label
          htmlFor="cover-photo"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Profile Photo
        </label>
        <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <div className="flex text-sm leading-6">
              <div className="text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 hover:text-blue-500"
              >
                {uploading ? <Loader /> : "Upload Photo"}
                <input
                  id="file-upload"
                  accept="image/*"
                  onChange={handleUpload}
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG (Photo must be at most 300kB)
            </p>
          </div>
        </div>
      </div>

      {photo?.Location && (
        <div className="">
          <div className="inline-block h-20 w-20">
            <img
              className="rounded-full"
              src={photo.Location}
              alt="profilePhoto"
            />
            <div
              className="py-2 flex justify-center"
              onClick={() => handleDelete(photo)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="red"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileImageUpload;
