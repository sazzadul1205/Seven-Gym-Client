export const formatDateWithTextMonth = (dateStr) => {
  if (!dateStr) return null;

  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "long" }); // Full month name
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
