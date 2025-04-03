import PropTypes from "prop-types";

// Reusable input field component
const InputField = ({
  label,
  id,
  type,
  placeholder,
  register,
  errors,
  options = [], // default to empty array
}) => (
  <div>
    <label htmlFor={id} className="block font-bold ml-1 mb-2">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        {...register(id)}
        id={id}
        className="textarea textarea-bordered w-full rounded-lg bg-white border-gray-600"
        placeholder={placeholder}
      />
    ) : type === "select" ? (
      <select
        {...register(id)}
        id={id}
        className="select select-bordered w-full rounded-lg bg-white border-gray-600"
      >
        {Array.isArray(options) ? (
          options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))
        ) : (
          <option>No options available</option>
        )}
      </select>
    ) : (
      <input
        {...register(id)}
        type={type}
        id={id}
        className="input input-bordered w-full rounded-lg bg-white border-gray-600"
        placeholder={placeholder}
      />
    )}
    {errors[id] && (
      <p className="text-red-500 text-sm">{errors[id]?.message}</p>
    )}
  </div>
);

// PropTypes validation
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string,
  type: PropTypes.oneOf([
    "text",
    "email",
    "password",
    "number",
    "date",
    "datetime-local",
    "textarea",
    "select",
    "tel",
  ]),
  placeholder: PropTypes.string,
  register: PropTypes.func,
  errors: PropTypes.object,
  validation: PropTypes.object,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default InputField;
