import { useEffect, useState } from "react";

// import Packages
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const convertToEmbedUrl = (inputUrl) => {
  try {
    const url = new URL(inputUrl); // Parse the input URL
    let videoId = "";

    // Handle short YouTube URL format: youtu.be/VIDEO_ID
    if (url.hostname === "youtu.be") {
      videoId = url.pathname.slice(1);
    }
    // Handle standard YouTube watch URL: youtube.com/watch?v=VIDEO_ID
    else if (
      url.hostname.includes("youtube.com") &&
      url.searchParams.has("v")
    ) {
      videoId = url.searchParams.get("v");
    }
    // Handle embedded YouTube URL: youtube.com/embed/VIDEO_ID
    else if (
      url.hostname.includes("youtube.com") &&
      url.pathname.startsWith("/embed/")
    ) {
      videoId = url.pathname.split("/embed/")[1];
    }

    // Return null if no video ID was found
    if (!videoId) return null;

    // Return full embed URL with autoplay, mute, loop
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
  } catch (err) {
    // Return null on invalid URL
    console.error("Invalid YouTube URL:", err);
    return null;
  }
};

const HomePageAdminWelcomeEditModal = ({
  setSelectedWelcomer,
  selectedWelcomer,
  Refetch,
}) => {
  const axiosPublic = useAxiosPublic();

  // State Management
  const [modalError, setModalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);

  // Set up form with default values
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: selectedWelcomer?.title || "",
      description: selectedWelcomer?.description || "",
      videoUrl: selectedWelcomer?.videoUrl || "",
    },
  });

  const watchedFields = watch();

  // Detect if any field has changed from the original data
  useEffect(() => {
    const original = {
      title: selectedWelcomer?.title || "",
      description: selectedWelcomer?.description || "",
      videoUrl: selectedWelcomer?.videoUrl || "",
    };

    const isChanged =
      original.title !== watchedFields.title ||
      original.description !== watchedFields.description ||
      original.videoUrl !== watchedFields.videoUrl;

    setChanged(isChanged);
  }, [watchedFields, selectedWelcomer]);

  // Reset form when selectedWelcomer changes
  useEffect(() => {
    reset({
      title: selectedWelcomer?.title || "",
      description: selectedWelcomer?.description || "",
      videoUrl: selectedWelcomer?.videoUrl || "",
    });
  }, [selectedWelcomer, reset]);

  // Handle form submit
  const onSubmit = async (data) => {
    setLoading(true);
    setModalError("");

    const formattedUrl = convertToEmbedUrl(data.videoUrl);
    if (!formattedUrl) {
      setModalError("Invalid YouTube URL. Please check and try again.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...data,
        videoUrl: formattedUrl,
      };

      await axiosPublic.put(
        `/Home_Welcome_Section/${selectedWelcomer._id}`,
        payload
      );

      Refetch();
      setSelectedWelcomer("");
      document.getElementById("Edit_Welcome_Modal").close();

    } catch (error) {
      console.error("Update failed:", error);
      setModalError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-2xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Edit Welcome Section</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() => {
            setSelectedWelcomer("");
            document.getElementById("Edit_Welcome_Modal").close();
          }}
        />
      </div>

      {/* Error messages */}
      {(Object.keys(errors).length > 0 || modalError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md space-y-1 text-sm m-5">
          {errors.title && <div>Title is required.</div>}
          {errors.description && <div>Description is required.</div>}
          {errors.videoUrl && <div>Video URL is required.</div>}
          {modalError && <div>{modalError}</div>}
        </div>
      )}

      {/* Form Inputs */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {/* Title Field */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            rows={4}
            {...register("description", { required: true })}
            placeholder="Banner description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        {/* YouTube Video URL Field */}
        <div>
          <label className="block font-semibold mb-1">YouTube Video URL</label>
          <input
            type="text"
            {...register("videoUrl", { required: true })}
            placeholder="e.g. https://youtu.be/ID or https://youtube.com/watch?v=ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-3">
          <CommonButton
            clickEvent={handleSubmit(onSubmit)}
            text="Save Changes"
            bgColor="green"
            isLoading={loading}
            loadingText="Saving..."
            disabled={!changed || loading}
          />
        </div>
      </form>
    </div>
  );
};

// Prop Validation
HomePageAdminWelcomeEditModal.propTypes = {
  setSelectedWelcomer: PropTypes.func.isRequired,
  selectedWelcomer: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    videoUrl: PropTypes.string,
  }),
  Refetch: PropTypes.func.isRequired,
};
export default HomePageAdminWelcomeEditModal;
