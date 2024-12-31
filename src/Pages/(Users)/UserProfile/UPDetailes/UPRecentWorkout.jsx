/* eslint-disable react/prop-types */
import { FaRegPlusSquare } from "react-icons/fa";
import { formatDistanceToNowStrict, parse } from "date-fns";

const UPRecentWorkout = ({ usersData }) => {
  const recentWorkouts = usersData?.recentWorkouts?.slice(0, 5); // Only get the 5 most recent workouts

  return (
    <div className="space-y-8 mt-8">
      <div className="flex justify-between items-center border-b border-white pb-4">
        <h3 className="text-2xl font-semibold text-white">Recent Workouts</h3>
        <FaRegPlusSquare className="text-3xl font-bold text-white hover:text-purple-300 transition-colors duration-200" />
      </div>
      <div className="space-y-4">
        {recentWorkouts?.map((workout, index) => {
          // Parse the workout date and calculate the time ago
          const workoutDate = parse(
            workout.date,
            "dd/MM/yyyy h:mm a",
            new Date()
          );
          const timeAgo = formatDistanceToNowStrict(workoutDate, {
            addSuffix: true,
          });

          return (
            <div
              key={index}
              className="flex justify-between items-center text-gray-700 bg-gray-50 px-5 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              <p className="text-xl font-semibold text-gray-800">
                {workout.name}
              </p>

              <p className="text-sm text-gray-600">{workout.duration}</p>
              <p className="text-sm text-gray-600">{workout.calories}</p>
              <div className="text-sm text-gray-500 italic">
                <p>{timeAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UPRecentWorkout;
