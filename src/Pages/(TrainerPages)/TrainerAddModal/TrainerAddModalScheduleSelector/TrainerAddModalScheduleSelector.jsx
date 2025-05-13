import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import CommonButton from "../../../../Shared/Buttons/CommonButton";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const HOURS_COUNT = 6; // number of time slots

// UTILITIES
const parseToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
const formatHHMM = (mins) => {
  const m = ((mins % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h.toString().padStart(2, "0")} : ${mm
    .toString()
    .padStart(2, "0")}`.replace(/\s/g, "");
};
const to12Hr = (time) => {
  let [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 === 0 ? 12 : h % 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
};
const generateAllHourlyTimes = () =>
  Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
const generateRanges = (startTime, count) => {
  const startMins = parseToMinutes(startTime);
  return Array.from({ length: count }, (_, i) => {
    const blockStart = startMins + i * 60;
    return {
      start: formatHHMM(blockStart),
      end: formatHHMM(blockStart + 59),
    };
  });
};

const TrainerAddModalScheduleSelector = () => {
  const { control, handleSubmit, setValue, getValues } = useForm();
  const [previewData, setPreviewData] = useState({ days: [], times: [] });
  const [error, setError] = useState("");

  // Load saved schedule if available
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};
    if (saved.schedule) {
      setValue("days", saved.schedule.days || []);
      setValue("times", saved.schedule.times || []);
      setPreviewData(saved.schedule);
    }
  }, [setValue]);

  const onSubmit = (data) => {
    const { days, times } = data;

    if (!days || days.length !== 5) {
      setError("Please select exactly 5 available days.");
      return;
    }

    if (!times || times.length !== HOURS_COUNT) {
      setError(`Please select exactly ${HOURS_COUNT} time slots.`);
      return;
    }

    const storedInfo =
      JSON.parse(localStorage.getItem("trainerBasicInfo")) || {};
    const updated = {
      ...storedInfo,
      schedule: { days, times },
    };

    localStorage.setItem("trainerBasicInfo", JSON.stringify(updated));
    setPreviewData({ days, times });
    setError("");
  };

  return (
    <div className="p-2">
      <h3 className="text-2xl font-semibold text-center text-gray-800">
        Trainer Schedule Selector
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* Multi-select Days */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Day Selection ( Select 5 Days )
          </label>

          <Controller
            name="days"
            control={control}
            defaultValue={[]}
            render={({ field }) => {
              const selected = field.value;
              const isSelected = (day) => selected.includes(day);
              const toggleDay = (day) => {
                const updated = isSelected(day)
                  ? selected.filter((d) => d !== day)
                  : [...selected, day];
                if (updated.length <= 5) field.onChange(updated);
              };

              return (
                <div className="grid grid-cols-7 gap-[2px] w-full">
                  {DAYS.map((day) => {
                    const active = isSelected(day);
                    const disabled = !active && selected.length >= 5;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        disabled={disabled}
                        className={`${
                          disabled
                            ? "opacity-50 cursor-not-allowed bg-gray-300"
                            : "cursor-pointer"
                        } ${
                          active
                            ? "bg-gradient-to-tr from-blue-300 to-blue-600 text-white"
                            : "bg-gradient-to-tr from-gray-200 to-gray-400"
                        } w-full px-2 py-3 rounded text-sm border transition-all duration-200`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              );
            }}
          />
        </div>

        {/* Time Slots */}
        <div className="mt-6">
          <label className="block font-medium text-gray-700 mb-2">
            Select {HOURS_COUNT} Time Slots
          </label>

          <Controller
            name="times"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => {
              const timeOptions = generateAllHourlyTimes();
              const initial = value[0] || timeOptions[0];
              const [fromTime, setFromTime] = useState(initial);
              const [ranges, setRanges] = useState(
                generateRanges(initial, HOURS_COUNT)
              );

              useEffect(() => {
                const newRanges = generateRanges(fromTime, HOURS_COUNT);
                setRanges(newRanges);
                onChange(newRanges.map((r) => r.start));
              }, [fromTime, onChange]);

              return (
                <div className="space-y-4">
                  {/* Start Hour Selector */}
                  <div className="flex items-end gap-4">
                    <div className="flex flex-col w-full sm:w-1/2">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Select Starting Hour
                      </label>
                      <select
                        className="border border-gray-300 rounded-md px-4 py-2 text-sm shadow-sm"
                        value={fromTime}
                        onChange={(e) => setFromTime(e.target.value)}
                      >
                        {timeOptions.map((t) => (
                          <option key={t} value={t}>
                            {to12Hr(t)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full sm:w-auto">
                      <CommonButton
                        clickEvent={() => onSubmit(getValues())}
                        text="Apply Range"
                        disabled={ranges.length === 0}
                        bgColor="blue"
                        className="w-full sm:w-auto"
                      />
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Generated Time Blocks Preview
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ranges.map(({ start, end }, idx) => (
                        <p
                          key={idx}
                          className="flex gap-2 items-center bg-gray-100 rounded-2xl border py-2 px-4 text-gray-800 shadow-sm"
                        >
                          <span className="text-blue-700">
                            Class {idx + 1}:
                          </span>
                          {to12Hr(start)} - {to12Hr(end)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Schedule
        </button>
      </form>

      {/* Schedule Preview */}
      {previewData.days.length === 5 &&
        previewData.times.length === HOURS_COUNT && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Schedule Preview</h4>
            <table className="w-full border border-gray-300 text-center text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2 py-1">Day</th>
                  {previewData.times.map((time, idx) => (
                    <th key={idx} className="border px-2 py-1">
                      {time}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.days.map((day, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1 font-medium">{day}</td>
                    {previewData.times.map((_, tIdx) => (
                      <td key={tIdx} className="border px-2 py-1">
                        ✓
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default TrainerAddModalScheduleSelector;
