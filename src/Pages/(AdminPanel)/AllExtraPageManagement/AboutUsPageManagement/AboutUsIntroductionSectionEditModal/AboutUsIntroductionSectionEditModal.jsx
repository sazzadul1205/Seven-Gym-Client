import { useEffect, useState } from "react";

// Import PAckages
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Import Icons
import { ImCross } from "react-icons/im";

// Import Common Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// Import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const AboutUsIntroductionSectionEditModal = ({ Refetch, AboutUsData }) => {
  const axiosPublic = useAxiosPublic();

  // Local state variables
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form handling using react-hook-form
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Set Image Preview
  useEffect(() => {
    if (AboutUsData?.introduction) {
      setValue("title", AboutUsData.introduction.title || "");
      setValue("description", AboutUsData.introduction.description || "");
    }
  }, [AboutUsData, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    setModalError("");
    setLoading(true);

    // Construct payload with form data and resolved image URL
    const payload = {
      ...data,
      introduction: {
        title: data.title,
        description: data.description,
      },
    };

    try {
      await axiosPublic.put(`/AboutUs/${AboutUsData._id}`, payload);

      setModalError("");
      setLoading(false);
      Refetch();

      document
        .getElementById("About_Us_Introduction_Section_Edit_Modal")
        .close();

      Swal.fire({
        icon: "success",
        title: "Introduction Section Updated",
        text: "Changes have been saved successfully.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Edit Failed:", error);
      setModalError("Something went wrong while editing the data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-box max-w-3xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-500 px-5 py-4">
        <h3 className="font-bold text-lg">Edit Introduction Section </h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document
              .getElementById("About_Us_Introduction_Section_Edit_Modal")
              .close()
          }
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

      {/* Modal Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
        {/* title */}
        <div>
          <label className="font-semibold mb-1 block" htmlFor="title">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter Title ..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold mb-1 block" htmlFor="description">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            {...register("description", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y min-h-[200px]"
            placeholder="Enter Description ..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <CommonButton
            clickEvent={handleSubmit(onSubmit)}
            text="Save Changes"
            bgColor="green"
            isLoading={loading}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
};

// Prop Validation
AboutUsIntroductionSectionEditModal.propTypes = {
  AboutUsData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    introduction: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,

  Refetch: PropTypes.func.isRequired,
};

export default AboutUsIntroductionSectionEditModal;
