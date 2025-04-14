export const calculateEndAt = (startAt, durationWeeks) => {
    const startDate = new Date(startAt);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationWeeks * 7);
    return endDate.toISOString();
  };
  