/* eslint-disable react/prop-types */
import { useState } from "react";

import { ImCross } from "react-icons/im";
import Swal from "sweetalert2";

import useAuth from "../../../../../../Hooks/useAuth";
import useAxiosPublic from "../../../../../../Hooks/useAxiosPublic";

const ManageTimeModal = ({ refetch }) => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [endTime, setEndTime] = useState("12 AM");
  const [startTime, setStartTime] = useState("12 AM");

  const generateSchedule = async () => {
    if (!startTime || !endTime) {
      Swal.fire({
        icon: "warning",
        title: "Missing Time Selection",
        text: "Please select both start and end times.",
      });
      return;
    }

    const today = new Date();
    const userEmail = user?.email;

    const fullWeekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Convert 12-hour format to 24-hour format
    const convertTimeTo24Hour = (time) => {
      const [hour, period] = time.split(" ");
      let hours = parseInt(hour, 10);

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0; // Midnight case (12 AM -> 00)
      }

      return hours;
    };

    const startHour = convertTimeTo24Hour(startTime);
    const endHour = convertTimeTo24Hour(endTime);

    // Generate time slots for a given day
    const generateTimeSlots = (start, end, dayId) => {
      let timeSlots = {};
      for (let hour = start; hour < end; hour++) {
        const formattedTime = `${String(hour).padStart(2, "0")}:00`; // Ensure "08:00" format
        timeSlots[formattedTime] = {
          id: `sche-${dayId}-${formattedTime}`,
          title: "",
          notes: "",
          location: "",
          status: "",
        };
      }
      return timeSlots;
    };

    let schedule = {
      email: userEmail,
      schedule: {},
    };

    // Generate schedule for ALL 7 days (Sunday to Saturday)
    fullWeekdays.forEach((day, index) => {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() - today.getDay() + index); // Start from Sunday

      const formattedDate = currentDate
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-"); // Format DD-MM-YYYY

      const dayId = `${day}-${formattedDate}`;

      schedule.schedule[day] = {
        id: dayId,
        dayName: day,
        date: formattedDate,
        schedule: generateTimeSlots(startHour, endHour, dayId),
      };
    });
    document.getElementById("Manage_Time_Modal").close();
    // Add confirmation dialog before resetting schedule
    const confirmReset = await Swal.fire({
      title: "Are you sure?",
      text: "This will reset your entire schedule and overwrite any existing data.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset it!",
      cancelButtonText: "No, keep it",
    });

    // If the user clicks "Yes", proceed with resetting the schedule
    if (confirmReset.isConfirmed) {
      try {
        await axiosPublic.put(
          `/Schedule/DeleteFullScheduleByEmail?email=${userEmail}`,
          {
            schedule: schedule.schedule, // Send only the schedule in the body
          }
        );

        refetch();

        Swal.fire({
          icon: "success",
          title: "Schedule Updated!",
          text: "Your schedule has been successfully Updated.",
          timer: 2000,
          showConfirmButton: false,
        });

        document.getElementById("Manage_Time_Modal").close();
      } catch (error) {
        console.error("Error posting schedule:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Update",
          text: "There was an error Updating your schedule. Please try again.",
        });
      }
    } else {
      // If the user clicks "No", do nothing (schedule not reset)
      Swal.fire({
        icon: "info",
        title: "Cancelled",
        text: "Your schedule was not changed.",
      });
    }
  };

  return (
    <div className="modal-box bg-white p-6 rounded-lg shadow-lg text-center">
      {/* Header */}
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-2 relative">
          {/* Cross Icon - Positioned Top right */}
          <ImCross
            className="absolute right-0 top-0 text-gray-500 cursor-pointer hover:text-red-500"
            onClick={() => document.getElementById("Manage_Time_Modal").close()}
          />

          {/* Title - Centered */}
          <h3 className="font-bold text-lg flex-1 text-center">
            Select Time Range
          </h3>
        </div>

        <p className="text-gray-500 mb-4">
          Choose a start and end time for your schedule
        </p>
      </div>

      {/* Time Picker Inputs */}
      <div className="flex justify-center gap-4 items-center mb-6">
        {/* Start Time */}
        <select
          value={startTime.split(" ")[0]} // Ensure only the hour is shown
          onChange={(e) =>
            setStartTime(`${e.target.value} ${startTime.split(" ")[1] || "AM"}`)
          }
          className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-red-400"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>

        {/* AM/PM Selector */}
        <select
          value={startTime.split(" ")[1] || "AM"}
          onChange={(e) =>
            setStartTime(`${startTime.split(" ")[0] || "12"} ${e.target.value}`)
          }
          className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-red-400"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>

        {/* End Time */}
        <select
          value={endTime.split(" ")[0]}
          onChange={(e) =>
            setEndTime(`${e.target.value} ${endTime.split(" ")[1] || "AM"}`)
          }
          className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-red-400"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>

        {/* AM/PM Selector */}
        <select
          value={endTime.split(" ")[1] || "AM"}
          onChange={(e) =>
            setEndTime(`${endTime.split(" ")[0] || "12"} ${e.target.value}`)
          }
          className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-red-400"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>

      {/* Confirm Button */}
      <button
        className="bg-linear-to-tr from-red-400 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl py-3 px-10 transition-all duration-300"
        onClick={generateSchedule}
      >
        Confirm Time
      </button>
    </div>
  );
};

export default ManageTimeModal;
