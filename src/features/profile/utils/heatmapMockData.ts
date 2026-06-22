export const generateDatesMatrix = () => {
  const data = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  const firstDayOfYear = new Date(currentYear, 0, 1);
  const startDate = new Date(firstDayOfYear);
  startDate.setDate(firstDayOfYear.getDate() - firstDayOfYear.getDay());

  const currentDate = new Date(startDate);

  while (currentDate.getFullYear() <= currentYear) {
    const colData = [];
    for (let row = 0; row < 7; row++) {
      colData.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    data.push(colData);
  }
  return data;
};

export const generateMockHeatmapData = (
  datesMatrix: Date[][],
  userId?: string,
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  return datesMatrix.map((col) =>
    col.map((date) => {
      // Only return mock data for this specific user
      if (
        userId === '6a11445a170302d1e1dd726a' &&
        date < today &&
        date.getFullYear() === currentYear
      ) {
        return Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0;
      }
      return 0; // Return 0 intensity for all other users or future dates
    }),
  );
};
