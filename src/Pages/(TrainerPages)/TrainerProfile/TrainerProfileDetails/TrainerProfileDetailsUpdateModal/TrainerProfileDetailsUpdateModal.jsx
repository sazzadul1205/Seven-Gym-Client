import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import CommonButton from "../../../../../Shared/Buttons/CommonButton";

const TrainerProfileDetailsUpdateModal = ({ TrainerDetails, refetch }) => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      certifications: TrainerDetails.certifications,
      focusAreas: TrainerDetails.preferences.focusAreas,
    },
  });

  const { fields
    , append
    , remove
    
   } = useFieldArray({
    control,
    name: "certifications",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "certifications",
  });

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Submitted Certifications:", data.certifications);
  };

  return (
    <div className="modal-box p-0 bg-linear-to-b from-white to-gray-300 text-black">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-200 px-5 py-4">
        <h3 className="font-bold text-lg">Update Trainer Profile Details</h3>
        <ImCross
          className="text-xl hover:text-[#F72C5B] cursor-pointer"
          onClick={() =>
            document
              .getElementById("Trainer_Profile_Details_Update_Modal")
              ?.close()
          }
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        {/* Certifications */}
        <div className="border-b-2 border-gray-400 pb-3">
          <label className="block font-bold ml-1 mb-2">Certifications</label>

          <div className="space-y-2  ">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center">
                <input
                  {...register(`certifications.${index}`)}
                  className="input input-bordered w-full bg-white border-gray-600"
                  placeholder="Enter certification"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 text-white p-3 cursor-pointer"
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            {/* Add New Certification Buttons */}
            <div className="flex justify-end">
              <CommonButton
                clickEvent={() => append("")}
                text="Add New Certification"
                py="py-2"
                bgColor="green"
                icon={<FaPlus />}
              />
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="border-b-2 border-gray-400 pb-3">
          <label className="block font-bold ml-1 mb-2">Focus Areas</label>

          <div className="space-y-2  ">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center">
                <input
                  {...register(`focusAreas.${index}`)}
                  className="input input-bordered w-full bg-white border-gray-600"
                  placeholder="Enter certification"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 text-white p-3 cursor-pointer"
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            {/* Add New Certification Buttons */}
            <div className="flex justify-end">
              <CommonButton
                clickEvent={() => append("")}
                text="Add New Certification"
                py="py-2"
                bgColor="green"
                icon={<FaPlus />}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <CommonButton
            onClick={handleSubmit(onSubmit)} // Use onClick here directly
            text="Save Changes"
            bgColor="green"
            // isLoading={isSubmitting}
            loadingText="Saving..."
          />
        </div>
      </form>
    </div>
  );
};

export default TrainerProfileDetailsUpdateModal;

// const Data = [
// "certifications": [
//     "Certified Dance Instructor",
//     "Hip Hop Dance Certification",
//     "Ballroom Dance Certified",
//     "CPR & First Aid Certified",
//     "Certified Zumba Instructor"
//   ],
//       "awards": [
//         {
//           "title": "National Dance Championship Winner",
//           "year": 2015,
//           "organization": "National Dance Federation"
//         },
//         {
//           "title": "Best Dance Performance Award",
//           "year": 2018,
//           "organization": "California Dance Academy"
//         }
//       ],

// "preferences": {
//     "focusAreas": [
//       "Hip Hop",
//       "Contemporary",
//       "Ballroom",
//       "Choreography",
//       "Rhythm and Coordination",
//       "Dance Flexibility"
//     ],
//     "classTypes": [
//       "Private Training",
//       "Group Classes"
//     ]
//   },

// "additionalServices": [
//     "Choreography for events",
//     "Dance fitness classes",
//     "Private lessons for competitions"
//   ],

// "equipmentUsed": [
//     "Dance Floors",
//     "Mirrored Walls",
//     "Barres",
//     "Dance Mats",
//     "Stretch Bands"
//   ],
// "partnerships": [
//     {
//       "partnerName": "Global Dance Academy",
//       "website": "https://globaldanceacademy.com"
//     },
//     {
//       "partnerName": "Elite Dance Studios",
//       "website": "https://elitedancestudios.com"
//     }
//   ],
//  "languagesSpoken": [
//     "English",
//     "Spanish",
//     "French"
//   ],
// ]
