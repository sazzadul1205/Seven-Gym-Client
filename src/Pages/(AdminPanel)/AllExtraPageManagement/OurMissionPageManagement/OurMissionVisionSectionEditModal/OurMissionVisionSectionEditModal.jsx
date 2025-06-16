import { useEffect, useRef, useState } from "react";

// Import PAckages
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { ImCross } from "react-icons/im";
import { RiImageAddFill } from "react-icons/ri";

// Import Common Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

// Image upload requirements
const REQUIRED_WIDTH = 500;
const REQUIRED_HEIGHT = 500;
const TOLERANCE = 0.05;

// Environment variables for image hosting API
const Image_Hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const Image_Hosting_API = `https://api.imgbb.com/1/upload?key=${Image_Hosting_Key}`;

const OurMissionVisionSectionEditModal = ({ Refetch, OurMissionsData }) => {
  const axiosPublic = useAxiosPublic();
  const missionInputRef = useRef(null);
  const visionInputRef = useRef(null);

  // State
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [missionPreview, setMissionPreview] = useState(null);
  const [visionPreview, setVisionPreview] = useState(null);

  // Form setup using react-hook-form
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Load default values when OurMissionsData changes
  useEffect(() => {
    if (OurMissionsData?.mission) {
      setValue("missionTitle", OurMissionsData.mission.title);
      setValue("missionDescription", OurMissionsData.mission.description);
      setMissionPreview(OurMissionsData.mission.img);
    }

    if (OurMissionsData?.vision) {
      setValue("visionTitle", OurMissionsData.vision.title);
      setValue("visionDescription", OurMissionsData.vision.description);
      setVisionPreview(OurMissionsData.vision.img);
    }
  }, [OurMissionsData, setValue]);

  // Upload image to hosting API and return the URL
  const uploadImage = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(Image_Hosting_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data?.data?.display_url || null;
    } catch (error) {
      console.error("Upload failed:", error);
      setModalError("Upload failed. Try again.");
      return null;
    }
  };

  // Validate image type and dimensions, then preview it
  const validateImage = (file, onValid) => {
    if (!file?.type?.startsWith("image/")) return;

    const reader = new FileReader();
    const img = new Image();

    reader.onloadend = () => {
      img.onload = () => {
        const { width, height } = img;
        const isValidWidth =
          Math.abs(width - REQUIRED_WIDTH) <= REQUIRED_WIDTH * TOLERANCE;
        const isValidHeight =
          Math.abs(height - REQUIRED_HEIGHT) <= REQUIRED_HEIGHT * TOLERANCE;

        if (isValidWidth && isValidHeight) {
          onValid(reader.result, file);
        } else {
          setModalError(
            `Invalid Dimensions: ${width}x${height}. Required: ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px`
          );
        }
      };
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  // Handle mission image selection
  const handleMissionImageChange = (e) => {
    const file = e.target.files[0];
    validateImage(file, (previewUrl, validFile) => {
      setMissionPreview(previewUrl);
      setValue("missionImage", validFile);
    });
  };

  // Handle vision image selection
  const handleVisionImageChange = (e) => {
    const file = e.target.files[0];
    validateImage(file, (previewUrl, validFile) => {
      setVisionPreview(previewUrl);
      setValue("visionImage", validFile);
    });
  };

  // Generate handlers for drag & drop
  const createDragHandlers = (setPreview, key) => ({
    handleDrop: (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        validateImage(file, (previewUrl, validFile) => {
          setPreview(previewUrl);
          setValue(key, validFile);
        });
      }
    },
    handleDragOver: (e) => {
      e.preventDefault();
      setIsDragging(true);
    },
    handleDragLeave: () => setIsDragging(false),
  });

  // Submit form data
  const onSubmit = async (data) => {
    setModalError("");
    setLoading(true);

    let uploadedMissionImageUrl = missionPreview;
    let uploadedVisionImageUrl = visionPreview;

    try {
      // Upload new mission image if updated
      if (data.missionImage instanceof File) {
        const uploaded = await uploadImage(data.missionImage);
        if (!uploaded) {
          setModalError("Failed to upload mission image.");
          setLoading(false);
          return;
        }
        uploadedMissionImageUrl = uploaded;
      }

      // Upload new vision image if updated
      if (data.visionImage instanceof File) {
        const uploaded = await uploadImage(data.visionImage);
        if (!uploaded) {
          setModalError("Failed to upload vision image.");
          setLoading(false);
          return;
        }
        uploadedVisionImageUrl = uploaded;
      }

      // Prepare payload and send update request
      const payload = {
        mission: {
          img: uploadedMissionImageUrl,
          title: data.missionTitle,
          description: data.missionDescription,
        },
        vision: {
          img: uploadedVisionImageUrl,
          title: data.visionTitle,
          description: data.visionDescription,
        },
      };

      await axiosPublic.put(`/Our_Missions/${OurMissionsData._id}`, payload);

      // Reset form and close modal
      reset();
      Refetch();
      setMissionPreview(null);
      setVisionPreview(null);
      setLoading(false);

      document.getElementById("Our_Mission_Vision_Section_Edit_Modal").close();

      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        text: "Mission and Vision section updated.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (err) {
      console.error("Update error:", err);
      setModalError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-2xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-500 px-5 py-4">
        <h3 className="font-bold text-lg">Edit Mission & Vision Section</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document
              .getElementById("Our_Mission_Vision_Section_Edit_Modal")
              .close()
          }
        />
      </div>

      {/* Error Messages */}
      {(Object.keys(errors).length > 0 || modalError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md space-y-1 text-sm m-5">
          {errors?.missionTitle && <div>Mission title is required.</div>}
          {errors?.missionDescription && (
            <div>Mission description is required.</div>
          )}
          {errors?.visionTitle && <div>Vision title is required.</div>}
          {errors?.visionDescription && (
            <div>Vision description is required.</div>
          )}
          {modalError && <div>{modalError}</div>}
        </div>
      )}

      {/* Modal Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
        {/* Mission Section */}
        <SectionBlock
          title="Mission"
          imagePreview={missionPreview}
          onImageChange={handleMissionImageChange}
          register={register}
          imageInputId="missionImageInput"
          fileInputRef={missionInputRef}
          dragHandlers={createDragHandlers(setMissionPreview, "missionImage")}
          isDragging={isDragging}
        />

        {/* Vision Section */}
        <SectionBlock
          title="Vision"
          imagePreview={visionPreview}
          onImageChange={handleVisionImageChange}
          register={register}
          imageInputId="visionImageInput"
          fileInputRef={visionInputRef}
          dragHandlers={createDragHandlers(setVisionPreview, "visionImage")}
          isDragging={isDragging}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <CommonButton
            clickEvent={handleSubmit(onSubmit)}
            text="Save Changes"
            bgColor="green"
            isLoading={loading}
            loadingText="Saving..."
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

// Prop Validation
OurMissionVisionSectionEditModal.propTypes = {
  Refetch: PropTypes.func.isRequired,
  OurMissionsData: PropTypes.shape({
    _id: PropTypes.string,
    mission: PropTypes.shape({
      img: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    }),
    vision: PropTypes.shape({
      img: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    }),
  }).isRequired,
};

export default OurMissionVisionSectionEditModal;


// CompressedSelect Box
export const SectionBlock = ({
  title,
  imagePreview,
  onImageChange,
  register,
  imageInputId,
  fileInputRef,
  dragHandlers,
  isDragging,
}) => (
  <>
    <h3 className="text-lg font-bold">{title} Card</h3>

    {/* Image Upload */}
    <div className="flex flex-col items-center">
      <label className="block font-medium mb-1">Icon</label>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={dragHandlers.handleDrop}
        onDragOver={dragHandlers.handleDragOver}
        onDragLeave={dragHandlers.handleDragLeave}
        className={`w-[120px] h-[120px] rounded-full border-2 border-dashed ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-500"
        } flex items-center justify-center group cursor-pointer relative overflow-hidden transition-all duration-200 mx-auto`}
      >
        {imagePreview ? (
          <>
            <img
              src={imagePreview}
              alt={`${title.toLowerCase()}Preview`}
              className="absolute inset-0 w-full h-full object-contain p-10"
            />
            <div className="absolute inset-0 bg-white/80 hidden group-hover:flex items-center justify-center z-10">
              <div className="text-5xl border-2 border-gray-700 rounded-full p-5 text-gray-600 pointer-events-none">
                <RiImageAddFill />
              </div>
            </div>
          </>
        ) : (
          <div className="text-5xl border-2 border-gray-700 rounded-full p-5 text-gray-600 pointer-events-none">
            <RiImageAddFill />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          id={imageInputId}
          onChange={onImageChange}
          className="hidden"
        />
      </div>
    </div>

    {/* Title */}
    <div>
      <label className="block text-sm font-medium mb-1">Title</label>
      <input
        type="text"
        {...register(`${title.toLowerCase()}Title`, {
          required: `${title} title is required`,
        })}
        placeholder={`Enter ${title.toLowerCase()} title`}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />
    </div>

    {/* Description */}
    <div>
      <label className="block text-sm font-medium mb-1">Description</label>
      <textarea
        {...register(`${title.toLowerCase()}Description`, {
          required: `${title} description is required`,
        })}
        placeholder={`Enter ${title.toLowerCase()} description`}
        className="w-full px-3 py-2 h-28 border border-gray-300 rounded-md"
      />
    </div>
  </>
);

// Prop Validation
SectionBlock.propTypes = {
  title: PropTypes.string.isRequired,
  imagePreview: PropTypes.string,
  onImageChange: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  imageInputId: PropTypes.string.isRequired,
  fileInputRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  dragHandlers: PropTypes.shape({
    handleDrop: PropTypes.func,
    handleDragOver: PropTypes.func,
    handleDragLeave: PropTypes.func,
  }).isRequired,
  isDragging: PropTypes.bool.isRequired,
};
