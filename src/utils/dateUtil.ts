export const convertDateFormat = (date: string | number) => {
  const nDate = new Date(date);
  return nDate.getFullYear() > 2022 ? nDate.toLocaleString() : "N/A";
};

export const getMonthAndYear = (
  dateString: string | number | Date | undefined
) => {
  if (dateString) {
    const options = { month: "long", year: "numeric" } as const;
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
};
