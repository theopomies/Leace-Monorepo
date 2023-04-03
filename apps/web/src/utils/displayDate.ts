export const displayDate = (date: Date) => {
  return (
    (date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate()) +
    "-" +
    (date.getUTCMonth() + 1 < 10
      ? "0" + (date.getUTCMonth() + 1)
      : date.getUTCMonth() + 1) +
    "-" +
    date.getUTCFullYear()
  );
};
