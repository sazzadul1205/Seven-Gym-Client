import PropTypes from "prop-types";
import { useFieldArray } from "react-hook-form";

// Input Icons
import { FaPlus, FaTrash } from "react-icons/fa";

// Input Button
import CommonButton from "../Buttons/CommonButton";

const DynamicFieldArrayInputList = ({
  control,
  name,
  label,
  placeholder,
  fields,
}) => {
  const {
    fields: fieldArray,
    append,
    remove,
  } = useFieldArray({
    control,
    name,
  });

  // Determine if it's a simple single input (for example, an array of strings)
  const isSimple = fields.length === 1;

  return (
    <div className="border-b-2 border-gray-400 pb-3">
      {/* Label */}
      <label className="block font-bold ml-1 mb-2">{label}</label>

      {/* Input fields and Delete */}
      <div className="space-y-2">
        {fieldArray.map((field, index) =>
          isSimple ? (
            // Simple input (flexed side-by-side) for single value arrays
            <div key={field.id} className="flex items-center space-x-2">
              <input
                {...control.register(`${name}.${index}`)}
                className="input input-bordered w-full bg-white border-gray-600"
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 text-white p-3 cursor-pointer"
              >
                <FaTrash />
              </button>
            </div>
          ) : (
            // Multiple inputs (stacked) for object-based fields
            <div key={field.id} className="block space-y-2">
              {fields.map((fieldName) => (
                <input
                  key={fieldName}
                  {...control.register(`${name}.${index}.${fieldName}`)}
                  className="input input-bordered w-full bg-white border-gray-600"
                  placeholder={placeholder || fieldName}
                />
              ))}
              {/* Delete Button (only show if more than one item exists) */}
              {fieldArray.length > 1 && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 text-white p-3 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {/* Add New Button */}
        <div className="flex justify-end">
          <CommonButton
            clickEvent={() =>
              append(
                // For simple arrays, append an empty string.
                // For object arrays, initialize each field with an empty string.
                isSimple
                  ? ""
                  : fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
              )
            }
            type="button"
            text={`Add New ${label}`}
            py="py-2"
            bgColor="green"
            icon={<FaPlus />}
          />
        </div>
      </div>
    </div>
  );
};

DynamicFieldArrayInputList.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  fields: PropTypes.array.isRequired,
};

export default DynamicFieldArrayInputList;
