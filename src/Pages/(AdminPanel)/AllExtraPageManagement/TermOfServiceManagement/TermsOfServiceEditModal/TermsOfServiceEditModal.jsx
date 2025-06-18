import { useEffect, useState } from "react";

// Import Packages
import { useForm, useFieldArray } from "react-hook-form";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

// Import Icons
import { ImCross } from "react-icons/im";
import { FaRegTrashAlt } from "react-icons/fa";

// Import Common Button
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

// import Hooks
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";

const TermsOfServiceEditModal = ({ TermsOfServiceData, Refetch }) => {
  const axiosPublic = useAxiosPublic();

  // Local State Management
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form handling using react-hook-form
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: TermsOfServiceData?.title || "",
      background: TermsOfServiceData?.background || "",
      sections: TermsOfServiceData?.sections || [],
    },
  });

  // Hook to manage dynamic fields (add/remove/edit sections)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  // When TermsOfServiceData is available, reset the form with it
  useEffect(() => {
    if (TermsOfServiceData) {
      reset({
        title: TermsOfServiceData.title,
        background: TermsOfServiceData.background,
        sections: TermsOfServiceData.sections,
      });
    }
  }, [TermsOfServiceData, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    setModalError("");

    try {
      // Send updated data to server
      const res = await axiosPublic.put(
        `/Terms_Of_Service/${TermsOfServiceData._id}`,
        {
          ...data,
          updatedDate: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        }
      );

      // If update is successful
      if (res.status === 200) {
        Refetch();
        document.getElementById("Terms_Of_Service_Edit_Modal").close();

        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Terms of Service updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Update failed:", err);

      // Set local error message
      setModalError(
        "Failed to update Terms of Service. Please try again later."
      );

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to update Terms of Service. Please try again later.",
      });
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="modal-box max-w-4xl w-full p-0 bg-gradient-to-b from-white to-gray-100 text-black max-h-[90vh] overflow-y-auto">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b px-5 py-4">
        <h3 className="font-bold text-lg">Edit Terms of Service</h3>
        <ImCross
          className="text-xl hover:text-red-600 cursor-pointer"
          onClick={() =>
            document.getElementById("Terms_Of_Service_Edit_Modal").close()
          }
        />
      </div>

      {/* Error messages */}
      {(Object.keys(errors).length > 0 || modalError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md space-y-1 text-sm m-5">
          {errors.title && <div>Title is required.</div>}
          {errors.background && <div>Background image URL is required.</div>}
          {modalError && <div>{modalError}</div>}
        </div>
      )}

      {/* Form Wrapper */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
        {/* Section Title */}
        <h3 className="font-bold text-xl">Sections</h3>

        {/* All Dynamic Sections */}
        <div className="space-y-6">
          {fields.map((field, index) => {
            const content = watch(`sections.${index}.content`);
            const isList = Array.isArray(content); // Check if content is list or text

            return (
              <div
                key={field.id}
                className="border p-4 rounded-md space-y-3 bg-gray-50"
              >
                {/* Section Heading Input */}
                <div>
                  <label className="font-semibold">Heading</label>
                  <input
                    type="text"
                    {...register(`sections.${index}.heading`, {
                      required: true,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Section Content (either Text or List) */}
                <div>
                  <label className="font-semibold">Content</label>
                  {isList ? (
                    <>
                      {content.map((item, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            {...register(`sections.${index}.content.${i}`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                          {/* Remove List Item */}
                          <button
                            type="button"
                            className="p-3 text-white rounded-full bg-linear-to-bl hover:bg-linear-to-tr from-red-600 to-red-300 hover:scale-105 cursor-pointer"
                            onClick={() => {
                              const updated = [...content];
                              updated.splice(i, 1);
                              setValue(`sections.${index}.content`, updated);
                            }}
                          >
                            <FaRegTrashAlt />
                          </button>
                        </div>
                      ))}
                      {/* Add New List Item */}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() =>
                          setValue(`sections.${index}.content`, [
                            ...content,
                            "",
                          ])
                        }
                      >
                        + Add Item
                      </button>
                    </>
                  ) : (
                    // Content as Textarea
                    <textarea
                      rows={4}
                      {...register(`sections.${index}.content`)}
                      className="w-full px-3 py-2 h-28 border border-gray-300 rounded-md"
                    />
                  )}
                </div>

                {/* Toggle Content Between Text and List */}
                <div className="text-right text-sm">
                  <button
                    type="button"
                    className="text-blue-600 underline"
                    onClick={() => {
                      const current = watch(`sections.${index}.content`);
                      if (Array.isArray(current)) {
                        setValue(
                          `sections.${index}.content`,
                          current.join("\n")
                        );
                      } else {
                        const newArray = current
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean);
                        setValue(`sections.${index}.content`, newArray);
                      }
                    }}
                  >
                    Convert to {isList ? "Text" : "List"}
                  </button>
                </div>

                {/* Delete Entire Section */}
                <div className="text-right">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => remove(index)}
                  >
                    Delete Section
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Section Button */}
        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={() =>
            append({
              heading: "",
              content: "",
            })
          }
        >
          + Add New Section
        </button>

        {/* Submit Button */}
        <div className="flex justify-end">
          <CommonButton
            clickEvent={handleSubmit(onSubmit)}
            text="Save Changes"
            bgColor="green"
            px="px-10"
            isLoading={loading}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
};

// Prop Validation
TermsOfServiceEditModal.propTypes = {
  TermsOfServiceData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        heading: PropTypes.string.isRequired,
        content: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
        ]).isRequired,
      })
    ).isRequired,
  }).isRequired,
  Refetch: PropTypes.func.isRequired,
};

export default TermsOfServiceEditModal;
