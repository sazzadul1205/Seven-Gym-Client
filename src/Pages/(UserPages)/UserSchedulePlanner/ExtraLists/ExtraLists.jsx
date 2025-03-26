import PropTypes from "prop-types";

// Import Component
import ExtraToDoList from "./ExtraToDoList/ExtraToDoList";
import ExtraNotesList from "./ExtraNotesList/ExtraNotesList";
import ExtraPriorityList from "./ExtraPriorityList/ExtraPriorityList";

const ExtraList = ({ priority, note, todo, refetch }) => {
  return (
    <div className="space-y-6">
      {/* Priority List */}
      <ExtraPriorityList priority={priority} refetch={refetch} />

      {/* To-Do List */}
      <ExtraToDoList todo={todo} refetch={refetch} />

      {/* Note List */}
      <ExtraNotesList note={note} refetch={refetch} />
    </div>
  );
};

// Adding prop types
ExtraList.propTypes = {
  priority: PropTypes.array.isRequired,
  note: PropTypes.array.isRequired,
  todo: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default ExtraList;
