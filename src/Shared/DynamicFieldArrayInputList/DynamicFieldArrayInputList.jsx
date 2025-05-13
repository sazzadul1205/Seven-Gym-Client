import { useEffect } from "react";

// Import Package
import { useFieldArray } from "react-hook-form";
import PropTypes from "prop-types";

// Icons
import { FaPlus, FaTrash } from "react-icons/fa";

// Shared Button
import CommonButton from "../Buttons/CommonButton";

const DynamicFieldArrayInputList = ({
  control,
  name,
  label,
  fields,
  multiFieldLayoutClass = "",
}) => {
  // useFieldArray hook provides methods to manipulate field arrays
  const {
    fields: fieldArray,
    append,
    remove,
  } = useFieldArray({
    control,
    name,
  });

  // Determine whether this is a simple (single-field) or complex (multi-field) entry
  const isSimple = fields.length === 1;

  useEffect(() => {
    // Ensure at least one field is present by default on initial render
    if (fieldArray.length === 0) {
      append(
        isSimple
          ? "" // For simple fields, just append an empty string
          : fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {}) // For multi-field objects, initialize all keys with empty strings
      );
    }
  }, [fieldArray, append, isSimple, fields]);

  // Create a new empty object/entry based on whether the field is simple or complex
  const createEmptyField = () =>
    isSimple
      ? ""
      : fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {});

  // Dynamic placeholder text for each field based on its name
  const getPlaceholder = (fieldName) => {
    const placeholders = {
      partnerName: "Enter partner name",
      website: "Enter website",
      // Extend with more field-specific placeholders as needed
    };

    // Default to a generic placeholder if not specifically defined
    return placeholders[fieldName] || `Enter ${fieldName}`;
  };

  return (
    <div className="border-t-2 border-gray-400 pb-3">
      {/* Section Label */}
      <label className="block font-bold ml-1 mb-2">{label}</label>

      <div className="space-y-2">
        {/* Render the field array inputs */}
        {fieldArray.map((field, index) =>
          isSimple ? (
            // Render simple input for single-field entries
            <div key={field.id} className="flex items-center space-x-2">
              {/* Field index */}
              <span className="font-bold text-gray-700">{index + 1}.</span>

              {/* Input field */}
              <input
                {...control.register(`${name}.${index}`)}
                className="input input-bordered w-full bg-white border-gray-600"
                placeholder={getPlaceholder("partnerName")} // Placeholder for simple input
              />

              {/* Delete button */}
              <button
                type="button"
                onClick={() => {
                  // Prevent all fields from being removed
                  if (fieldArray.length === 1) {
                    remove(index);
                    append(createEmptyField());
                  } else {
                    remove(index);
                  }
                }}
                className="bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 text-white p-3 cursor-pointer"
              >
                <FaTrash />
              </button>
            </div>
          ) : (
            // Render multi-field entry (e.g., partnerName and website)
            <div key={field.id} className="w-full">
              <div
                className={`flex items-start gap-2 ${multiFieldLayoutClass}`}
              >
                {/* Field index */}
                <span className="font-bold text-gray-700 mt-3">
                  {index + 1}.
                </span>

                {/* Render all inputs inside the entry */}
                <div className={`flex-1 ${multiFieldLayoutClass}`}>
                  {fields.map((fieldName) => (
                    <input
                      key={fieldName}
                      {...control.register(`${name}.${index}.${fieldName}`)}
                      className="input input-bordered w-full bg-white border-gray-600"
                      placeholder={getPlaceholder(fieldName)}
                    />
                  ))}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => {
                    // Prevent all fields from being removed
                    if (fieldArray.length === 1) {
                      remove(index);
                      append(createEmptyField());
                    } else {
                      remove(index);
                    }
                  }}
                  className="bg-linear-to-bl hover:bg-linear-to-tr from-red-300 to-red-600 text-white p-3 cursor-pointer"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          )
        )}

        {/* Add New Entry Button */}
        <div className="flex justify-end mt-2">
          <CommonButton
            clickEvent={() => append(createEmptyField())}
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

// Prop type validation for component props
DynamicFieldArrayInputList.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  multiFieldLayoutClass: PropTypes.string,
};

export default DynamicFieldArrayInputList;
