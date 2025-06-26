import { useEffect, useState } from "react";

// Import Packages
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";

// Import Background Image
import Classes_Background from "../../../assets/Classes-Background/Classes_Background.jpg";

// Shared
import Loading from "../../../Shared/Loading/Loading";
import FetchingError from "../../../Shared/Component/FetchingError";

// Import Hooks
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

// Import Components
import ManagementClassPricing from "./ManagementClassPricing/ManagementClassPricing";
import ManagementClassSchedule from "./ManagementClassSchedule/ManagementClassSchedule";
import ManagementClassTrainers from "./ManagementClassTrainers/ManagementClassTrainers";
import ManagementClassMoreDetails from "./ManagementClassMoreDetails/ManagementClassMoreDetails";
import ManagementClassTestimonial from "./ManagementClassTestimonial/ManagementClassTestimonial";
import ManagementClassKeyFeatures from "./ManagementClassKeyFeatures/ManagementClassKeyFeatures";
import ManagementClassDetailsContent from "./ManagementClassDetailsContent/ManagementClassDetailsContent";

// Import Modals
import ClassDetailsPricingEditModal from "./ManagementClassPricing/ClassDetailsPricingEditModal/ClassDetailsPricingEditModal";
import ClassDetailsScheduleEditModal from "./ManagementClassSchedule/ClassDetailsScheduleEditModal/ClassDetailsScheduleEditModal";
import ClassDetailsTrainersEditModal from "./ManagementClassTrainers/ClassDetailsTrainersEditModal/ClassDetailsTrainersEditModal";
import ClassDetailsContentEditModal from "./ManagementClassDetailsContent/ClassDetailsContentEditModal/ClassDetailsContentEditModal";
import ClassDetailsMoreDetailsEditModal from "./ManagementClassMoreDetails/ClassDetailsMoreDetailsEditModal/ClassDetailsMoreDetailsEditModal";
import ClassDetailsKeyFeaturesEditModal from "./ManagementClassKeyFeatures/ClassDetailsKeyFeaturesEditModal/ClassDetailsKeyFeaturesEditModal";
import ClassDetailsTestimonialsEditModal from "./ManagementClassTestimonial/ClassDetailsTestimonialsEditModal/ClassDetailsTestimonialsEditModal";

const ClassDetailsManagement = ({ ClassDetailsData, Refetch }) => {
  const axiosPublic = useAxiosPublic();

  const [selectedClassId, setSelectedClassId] = useState(
    ClassDetailsData?.[0]?._id || null
  );
  const [selectedClass, setSelectedClass] = useState(
    ClassDetailsData?.[0] || null
  );

  // Fetch Class Schedule
  const {
    data: ClassScheduleData,
    isLoading: ClassScheduleDataIsLoading,
    error: ClassScheduleDataError,
  } = useQuery({
    queryKey: ["ClassScheduleData", selectedClass?.module],
    queryFn: async () =>
      axiosPublic
        .get(
          `/Our_Classes_Schedule/SearchByModule?moduleName=${selectedClass?.module}`
        )
        .then((res) => res.data),
  });

  // Map through all and get _id array
  const ClassTrainerIds =
    selectedClass?.trainers?.map((trainer) => trainer?._id) || [];

  // Fetch Trainers Data
  const {
    data: ClassTrainersData,
    isLoading: ClassTrainersIsLoading,
    error: ClassTrainerError,
  } = useQuery({
    queryKey: ["ClassTrainersData", ClassTrainerIds],
    queryFn: async () =>
      axiosPublic
        .get(`/Trainers/BasicInfo?ids=${ClassTrainerIds.join(",")}`)
        .then((res) => res.data),
    enabled: ClassTrainerIds.length > 0,
  });

  // Update selected class when data updates
  useEffect(() => {
    if (ClassDetailsData?.length && selectedClassId) {
      const updatedClass = ClassDetailsData.find(
        (cls) => cls._id === selectedClassId
      );
      setSelectedClass(updatedClass || ClassDetailsData[0]);
    }
  }, [ClassDetailsData, selectedClassId]);

  // Handle Loading State
  if (ClassScheduleDataIsLoading || ClassTrainersIsLoading) {
    return <Loading />;
  }

  // Handle Errors
  if (ClassScheduleDataError || ClassTrainerError) {
    return <FetchingError />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Vertical Tabs on the Left */}
        <div className="bg-gray-400 py-2 px-4">
          <div className="flex md:flex-col gap-3">
            {ClassDetailsData.map((cls) => {
              const isActive = selectedClassId === cls._id;

              return (
                <button
                  key={cls._id}
                  onClick={() => {
                    setSelectedClassId(cls._id);
                    setSelectedClass(cls);
                  }}
                  className={`inline-flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 transition-all duration-200 flex-shrink-0 w-full cursor-pointer ${
                    isActive
                      ? "bg-blue-100 border-blue-500 text-blue-700 font-bold shadow"
                      : "bg-white border-gray-300 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <img
                    src={cls.icon}
                    alt={cls.module}
                    className="w-10 h-10 object-contain mb-1"
                  />
                  <span className="text-xs sm:text-sm text-center">
                    {cls.module}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Class Content */}
        <div
          className="min-h-screen bg-fixed bg-cover bg-center w-full"
          style={{
            backgroundImage: `url(${Classes_Background})`,
          }}
        >
          <div className="bg-gradient-to-b from-black/30 to-gray-700/70 min-h-full border-l-2 border-white space-y-2">
            {/* Header */}
            <div className="flex text-lg font-semibold bg-gray-400 py-4 text-white px-5">
              <p className="text-blue-600">{selectedClass?.module}</p>
              <p className="pl-2">Class View Management</p>
            </div>

            {/* Class Header Section */}
            <ManagementClassDetailsContent selectedClass={selectedClass} />

            {/* Class Key Features */}
            <ManagementClassKeyFeatures selectedClass={selectedClass} />

            {/* Class Pricing */}
            <ManagementClassPricing selectedClass={selectedClass} />

            {/* Class Schedule */}
            <ManagementClassSchedule ClassScheduleData={ClassScheduleData} />

            {/* Classes Trainer */}
            <ManagementClassTrainers ClassTrainersData={ClassTrainersData} />

            {/* Classes Trainer */}
            <ManagementClassMoreDetails selectedClass={selectedClass} />

            {/* Classes Testimonials */}
            <ManagementClassTestimonial selectedClass={selectedClass} />
          </div>
        </div>
      </div>

      {/* Update Modal - Class Detail */}
      {/* Content Edit Modal */}
      <dialog id="Class_Detail_Content_Edit_Modal" className="modal">
        <ClassDetailsContentEditModal
          selectedClass={selectedClass}
          Refetch={Refetch}
        />
      </dialog>

      {/* Key Features Edit */}
      <dialog id="Class_Details_Key_Features_Edit_Modal" className="modal">
        <ClassDetailsKeyFeaturesEditModal
          selectedClass={selectedClass}
          Refetch={Refetch}
        />
      </dialog>

      {/* Key Pricing Edit */}
      <dialog id="Class_Pricing_Edit_Modal" className="modal">
        <ClassDetailsPricingEditModal
          selectedClass={selectedClass}
          Refetch={Refetch}
        />
      </dialog>

      {/* Schedule Edit */}
      <dialog id="Class_Schedule_Edit_Modal" className="modal">
        <ClassDetailsScheduleEditModal
          ClassScheduleData={ClassScheduleData}
          selectedClass={selectedClass}
          Refetch={Refetch}
        />
      </dialog>

      {/* Trainer Edit */}
      <dialog id="Class_Trainers_Edit_Modal" className="modal">
        <ClassDetailsTrainersEditModal
          selectedClass={selectedClass}
          ClassScheduleData={ClassScheduleData}
          ClassTrainersData={ClassTrainersData}
          Refetch={Refetch}
        />
      </dialog>

      {/* Trainer Edit */}
      <dialog id="Class_More_Details_Edit_Modal" className="modal">
        <ClassDetailsMoreDetailsEditModal
          selectedClass={selectedClass}
          Refetch={Refetch}
        />
      </dialog>

      {/* Trainer Edit */}
      <dialog id="Class_Testimonials_Edit_Modal" className="modal">
        <ClassDetailsTestimonialsEditModal
          selectedClass={selectedClass}
          Refetch={Refetch}
        />
      </dialog>
    </div>
  );
};

// Prop Validation
ClassDetailsManagement.propTypes = {
  ClassDetailsData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      module: PropTypes.string,
      icon: PropTypes.string,
      trainers: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
        })
      ),
    })
  ),
  Refetch: PropTypes.func.isRequired,
};

export default ClassDetailsManagement;
