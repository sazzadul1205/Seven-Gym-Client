import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { FiCamera } from "react-icons/fi";
import Cropper from "react-easy-crop";

const ImageCropper = ({ onImageCropped }) => {
  // State to handle image, crop settings, and crop visibility
  const [image, setImage] = useState(null); // The selected image file
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // Position of the crop area
  const [zoom, setZoom] = useState(1); // Zoom level for cropping
  const [rotation, setRotation] = useState(0); // Rotation angle for the image
  const [cropArea, setCropArea] = useState(null); // The actual crop area in pixels
  const [showCropper, setShowCropper] = useState(false); // To toggle the visibility of the cropper

  // Handle image selection from file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Save the selected image file
      setShowCropper(true); // Show the cropper interface
    }
  };

  // Handle crop completion event to save the cropped area
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCropArea(croppedAreaPixels); // Save the cropped area dimensions
  }, []);

  // Function to generate the cropped image as a Blob
  const getCroppedImage = async () => {
    if (!image || !cropArea) return; // Check if the image or crop area is invalid

    const canvas = document.createElement("canvas"); // Create a new canvas to render the cropped image
    const img = document.createElement("img"); // Create an image element
    img.src = URL.createObjectURL(image); // Convert the file to an image URL

    return new Promise((resolve) => {
      img.onload = () => {
        const ctx = canvas.getContext("2d"); // Get the canvas 2d context
        const scaleX = img.naturalWidth / img.width; // Calculate scale for X axis
        const scaleY = img.naturalHeight / img.height; // Calculate scale for Y axis

        // Set canvas size to match the cropped area dimensions
        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        ctx.save(); // Save current context
        ctx.translate(canvas.width / 2, canvas.height / 2); // Center the crop on the canvas
        ctx.rotate((rotation * Math.PI) / 180); // Apply rotation
        ctx.drawImage(
          img,
          cropArea.x * scaleX, // Apply crop position X
          cropArea.y * scaleY, // Apply crop position Y
          cropArea.width * scaleX, // Apply crop width
          cropArea.height * scaleY, // Apply crop height
          -canvas.width / 2, // Adjust to center the cropped area
          -canvas.height / 2, // Adjust to center the cropped area
          canvas.width, // Set the canvas width
          canvas.height // Set the canvas height
        );
        ctx.restore(); // Restore the context

        // Convert the canvas to a Blob and pass it to the parent component
        canvas.toBlob(
          (blob) => {
            onImageCropped(blob); // Pass the cropped image Blob
            setShowCropper(false); // Close the cropper interface
            resolve(blob); // Resolve the promise with the Blob
          },
          "image/jpeg", // Image format
          1 // Quality (1 = high)
        );
      };
    });
  };

  return (
    <div>
      {/* Image Preview and Upload Input */}
      <div
        className="w-[250px] h-[250px] rounded-full mx-auto border-2 border-dashed border-gray-500 flex items-center justify-center relative overflow-hidden hover:scale-105"
        style={{ backgroundColor: "#f9f9f9" }}
      >
        {/* Display the image or a placeholder */}
        {image && !showCropper ? (
          <img
            src={URL.createObjectURL(image)} // Display the selected image
            alt="Cropped Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <FiCamera size={40} />
            <p>Drag & Drop or Click to Browse</p>
          </div>
        )}
        {/* Hidden input for file selection */}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleImageChange}
        />
      </div>

      {/* Image Cropper Modal */}
      <div>
        {showCropper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white p-5 rounded-lg shadow-lg relative w-full max-w-4xl">
              <div className="relative h-96">
                {/* Cropper Component */}
                <Cropper
                  image={URL.createObjectURL(image)} // Create an object URL for the image
                  crop={crop} // Set the crop position
                  zoom={zoom} // Set the zoom level
                  rotation={rotation} // Set the rotation angle
                  aspect={1 / 1} // Set aspect ratio for the crop
                  onCropChange={setCrop} // Update crop position
                  onZoomChange={setZoom} // Update zoom level
                  onRotationChange={setRotation} // Update rotation angle
                  onCropComplete={onCropComplete} // Update crop area dimensions
                />
              </div>
              <div className="flex justify-between items-center mt-4 space-x-4">
                {/* Zoom Control */}
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
                {/* Buttons for Cancel and Save */}
                <div className="flex space-x-2">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => setShowCropper(false)} // Close the cropper
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#F72C5B] text-white px-4 py-2 rounded-lg"
                    onClick={getCroppedImage} // Save the cropped image
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ImageCropper.propTypes = {
  onImageCropped: PropTypes.func.isRequired,
};

export default ImageCropper;
