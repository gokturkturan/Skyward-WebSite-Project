import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import toast from "react-hot-toast";

const ImageUpload = ({ ad, setAd }) => {
  const handleUpload = async (e) => {
    try {
      let files = e.target.files;
      files = [...files];
      if (files?.length) {
        setAd({ ...ad, uploading: true });
        files.map((file) => {
          if (file.size > 1048576) {
            toast.error(
              files.length > 1
                ? "One of the photos is too large."
                : "The size of this photo is too large."
            );
          } else {
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
                    const { data } = await axios.post("/ads/upload-image", {
                      image: uri,
                    });
                    setAd((prev) => ({
                      ...prev,
                      photos: [data, ...prev.photos],
                      uploading: false,
                    }));
                  } catch (error) {
                    console.log(error);
                    setAd({ ...ad, uploading: false });
                  }
                },
                "base64"
              );
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      setAd({ ...ad, uploading: false });
    }
  };

  const handleDelete = async () => {
    try {
      setAd({ ...ad, uploading: true });
    } catch (error) {
      console.log(error);
      setAd({ ...ad, uploading: false });
    }
  };

  return (
    <>
      <div className="col-span-full mt-2">
        <label
          htmlFor="cover-photo"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Photos
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <div className="mt-4 flex text-sm leading-6 ">
              <div className="text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
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
                <span>Upload photos</span>
                <input
                  id="file-upload"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, GIF (Each photo must be at most 1 MB)
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
