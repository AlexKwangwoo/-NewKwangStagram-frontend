// export const formatDate = (date) => {
//   const theDate = new Date(date);
//   return theDate.toLocaleDateString("en", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
// };

export const formatDate = (date) => {
  const createdAtDate = new Date(0);
  createdAtDate.setUTCSeconds(date / 1000);
  const createdAtModified = createdAtDate.toISOString();
  const theDate = new Date(createdAtModified);
  return theDate.toLocaleDateString("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
