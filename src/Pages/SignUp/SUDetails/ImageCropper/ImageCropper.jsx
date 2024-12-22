/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import { FiCamera } from "react-icons/fi";
import Cropper from "react-easy-crop";

const ImageCropper = ({ onImageCropped }) => {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropArea, setCropArea] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Save the File object
      setShowCropper(true);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCropArea(croppedAreaPixels);
  }, []);

  const getCroppedImage = async () => {
    if (!image || !cropArea) return;

    const canvas = document.createElement("canvas");
    const img = document.createElement("img");
    img.src = URL.createObjectURL(image);

    return new Promise((resolve) => {
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;

        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(
          img,
          cropArea.x * scaleX,
          cropArea.y * scaleY,
          cropArea.width * scaleX,
          cropArea.height * scaleY,
          -canvas.width / 2,
          -canvas.height / 2,
          canvas.width,
          canvas.height
        );
        ctx.restore();

        canvas.toBlob(
          (blob) => {
            onImageCropped(blob); // Pass the Blob object
            setShowCropper(false);
            resolve(blob);
          },
          "image/jpeg",
          1
        );
      };
    });
  };

  return (
    <div>
      <div
        className="w-[250px] h-[250px] rounded-full mx-auto border-2 border-dashed border-gray-500 flex items-center justify-center relative overflow-hidden hover:scale-105"
        style={{ backgroundColor: "#f9f9f9" }}
      >
        {image && !showCropper ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Cropped Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <FiCamera size={40} />
            <p>Drag & Drop or Click to Browse</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleImageChange}
        />
      </div>

      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg relative w-full max-w-4xl">
            <div className="relative h-96">
              <Cropper
                image={URL.createObjectURL(image)} // Correctly create object URL
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1 / 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-between items-center mt-4 space-x-4">
              <div>
                <label className="text-gray-700">Zoom:</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className="ml-2"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setShowCropper(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#F72C5B] text-white px-4 py-2 rounded-lg"
                  onClick={getCroppedImage}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
