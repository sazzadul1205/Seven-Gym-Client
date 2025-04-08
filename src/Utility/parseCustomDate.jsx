export const fetchParsedCustomDate = (input) => {
  return new Promise((resolve, reject) => {
    if (!input || typeof input !== "string") {
      return reject(new Error("Invalid or missing date input."));
    }

    // Try native Date parsing first (ISO, RFC, etc.)
    const nativeParsed = new Date(input);
    if (!isNaN(nativeParsed.getTime())) {
      return resolve(nativeParsed);
    }

    try {
      // Handle custom format: DD-MM-YYYYTHH:mm
      const [datePart, timePart] = input.split("T");
      const [day, month, year] = datePart.split(/[-/]/); // supports "-" or "/"
      let hour = "00",
        minute = "00";

      if (timePart) {
        [hour, minute] = timePart.split(":");
      }

      const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}T${hour}:${minute}`;
      const customParsed = new Date(isoDate);

      if (!isNaN(customParsed.getTime())) {
        resolve(customParsed);
      } else {
        reject(new Error("Unrecognized date format."));
      }
    } catch (err) {
      reject(err);
    }
  });
};
