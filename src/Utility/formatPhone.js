export const formatPhone = (phone) => {
  // Ensure phone starts with '+'
  const normalized = phone.startsWith("+") ? phone : `+${phone}`;

  // Format: +880 19 1733 5945
  const country = normalized.slice(0, 4); // +880
  const operator = normalized.slice(4, 6); // 19
  const part1 = normalized.slice(6, 10); // 1733
  const part2 = normalized.slice(10); // 5945

  return `${country} ${operator} ${part1} ${part2}`;
};
