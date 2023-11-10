export const daysAgoFromDate = (date) => {
  const newDate = date?.split("T")[0];
  const dateElements = newDate?.split("-");

  const year = dateElements && dateElements[0];
  const month = dateElements && dateElements[1] - 1;
  const day = dateElements && dateElements[2];

  const targetDate = new Date(year, month, day);
  const currentDate = new Date();

  const timeDifference = currentDate - targetDate;

  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return daysAgo;
};
