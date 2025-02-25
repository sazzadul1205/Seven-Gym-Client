import { GrSchedules } from "react-icons/gr";

import DailyScheduleSettings from "./DailyScheduleSettings/DailyScheduleSettings";
import PrioritySettings from "./PrioritySettings/PrioritySettings";
import NotesSettings from "./NotesSettings/NotesSettings";
import ToDoSettings from "./ToDoSettings/ToDoSettings";

const USSchedule = ({ userSchedule, refetch }) => {
  // Schedule Content
  const MySchedule = userSchedule?.schedule;

  // Priority Content
  const MyPriority = userSchedule?.priority;

  // ToDo Content
  const MyToDo = userSchedule?.todo;

  // Notes Content
  const MyNote = userSchedule?.notes;

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <header className="bg-gray-400 px-5 py-2">
        <p className="flex items-center gap-2 text-xl font-semibold italic text-white">
          <GrSchedules /> User Workout Schedule
        </p>
      </header>

      {/* Schedule Settings */}
      <DailyScheduleSettings refetch={refetch} MySchedule={MySchedule} />

      {/* Priority Settings */}
      <PrioritySettings refetch={refetch} MyPriority={MyPriority} />

      {/* ToDo Settings */}
      <ToDoSettings refetch={refetch} MyToDo={MyToDo} />

      {/* Notes Settings */}
      <NotesSettings refetch={refetch} MyNote={MyNote} />
    </div>
  );
};

export default USSchedule;
