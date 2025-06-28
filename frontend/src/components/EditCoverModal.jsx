import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updateCoverPhoto } from "../features/auth/authSlice";
import { uploadMedia } from "../features/upload/uploadSlice";
import getCroppedImg from "../utils/cropImage";
import { checkAuth } from "../features/auth/authSlice";

const EditCoverModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [fakeProgress, setFakeProgress] = useState(0);

  const { uploading, uploadProgress } = useSelector((state) => state.upload);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([croppedBlob], "cover.jpg", { type: "image/jpeg" });

      const uploadRes = await dispatch(uploadMedia(file)).unwrap();
      await dispatch(updateCoverPhoto(uploadRes)).unwrap();

      toast.success("Cover photo updated!");
      dispatch(checkAuth()); // Refresh auth state

      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update cover.");
    }
  };

  useEffect(() => {
    let interval;
    if (uploading) {
      interval = setInterval(() => {
        setFakeProgress((prev) =>
          prev < 90 ? prev + Math.random() * 5 : prev
        );
      }, 200);
    } else if (!uploading && uploadProgress === 100) {
      setFakeProgress(100);
      setTimeout(() => setFakeProgress(0), 500);
    }
    return () => clearInterval(interval);
  }, [uploading, uploadProgress]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/30 backdrop-blur-md rounded-xl w-full max-w-3xl p-6 relative border border-white/20 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Edit Cover Photo</h2>

        {/* Custom Upload Button */}
        <div className="mb-4">
          <label className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded cursor-pointer transition duration-200">
            Choose Cover Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {imageSrc && (
          <div className="relative w-full h-72 mt-4 bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={3 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {/* Upload progress bar */}
        {uploading && (
          <div className="px-6 pt-4">
            <div className="w-full bg-white/30 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-500 h-2.5 transition-all duration-300"
                style={{ width: `${fakeProgress.toFixed(1)}%` }}
              ></div>
            </div>
            <p className="text-sm text-white mt-2 text-center">
              Uploading cover... {Math.round(fakeProgress)}%
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-white/30 text-white px-4 py-2 rounded hover:bg-white/50 border border-white/20 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCoverModal;
